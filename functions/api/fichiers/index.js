/**
 * Partage de fichiers entre les deux espaces.
 *   GET  /api/fichiers   liste les fichiers déposés
 *   POST /api/fichiers   dépose un fichier (multipart/form-data)
 *
 * Le contenu vit dans R2, l'index dans D1. Si R2 n'est pas activé sur le
 * compte, l'API le dit clairement au lieu d'échouer silencieusement.
 */
import { json, erreur, gerer, exigerSession, maintenant, nouvelId } from '../../_commun.js';

const TAILLE_MAX = 15 * 1024 * 1024; // 15 Mo
const TYPES_AUTORISES = [
  'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/heic',
  'application/pdf', 'text/plain', 'text/markdown', 'text/csv',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  // Messages vocaux courts (trente secondes au plus), enregistrés par le navigateur.
  'audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg', 'audio/wav',
];

export const onRequestGet = gerer(async (context) => {
  await exigerSession(context);
  const { results } = await context.env.DB.prepare(
    'SELECT id, nom, type, taille, auteur, matiere, ref, note, cree_le FROM fichiers ORDER BY cree_le DESC LIMIT 200',
  ).all();
  return json({ fichiers: results || [], stockage: Boolean(context.env.FICHIERS) });
});

export const onRequestPost = gerer(async (context) => {
  const session = await exigerSession(context);
  if (!context.env.FICHIERS) {
    return erreur('Le stockage de fichiers n\'est pas activé sur ce compte.', 503);
  }

  let formulaire;
  try { formulaire = await context.request.formData(); } catch (e) { return erreur('Envoi illisible.'); }

  const fichier = formulaire.get('fichier');
  if (!fichier || typeof fichier === 'string') return erreur('Aucun fichier reçu.');
  if (fichier.size === 0) return erreur('Le fichier est vide.');
  if (fichier.size > TAILLE_MAX) return erreur('Le fichier dépasse 15 Mo.', 413);

  const type = fichier.type || 'application/octet-stream';
  if (!TYPES_AUTORISES.includes(type)) {
    return erreur('Ce type de fichier n\'est pas accepté : ' + type);
  }
  // A17 : pas de document bureautique avec macros.
  if (/\.(docm|xlsm|pptm|dotm|xlam|ppam)$/i.test(String(fichier.name || '')) || /macroEnabled/i.test(type)) {
    return erreur('Les documents avec macros ne sont pas acceptés.');
  }
  // A16 : le type annoncé doit correspondre aux premiers octets du fichier.
  const tete = new Uint8Array(await fichier.slice(0, 16).arrayBuffer());
  const commence = (...octets) => octets.every((o, i) => tete[i] === o);
  const ascii = (debut, fin) => String.fromCharCode(...tete.slice(debut, fin));
  const signatures = {
    'image/png': () => commence(0x89, 0x50, 0x4E, 0x47),
    'image/jpeg': () => commence(0xFF, 0xD8, 0xFF),
    'image/gif': () => ascii(0, 4) === 'GIF8',
    'image/webp': () => ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP',
    'application/pdf': () => ascii(0, 4) === '%PDF',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': () => commence(0x50, 0x4B, 0x03, 0x04),
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': () => commence(0x50, 0x4B, 0x03, 0x04),
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': () => commence(0x50, 0x4B, 0x03, 0x04),
    'audio/webm': () => commence(0x1A, 0x45, 0xDF, 0xA3),
    'audio/ogg': () => ascii(0, 4) === 'OggS',
    'audio/mp4': () => ascii(4, 8) === 'ftyp',
  };
  if (signatures[type] && !signatures[type]()) {
    return erreur('Le contenu du fichier ne correspond pas à son type (' + type + ').');
  }

  const id = nouvelId();
  const nom = String(fichier.name || 'fichier').slice(0, 160);
  const cleR2 = `${new Date().toISOString().slice(0, 10)}/${id}`;

  await context.env.FICHIERS.put(cleR2, fichier.stream(), {
    httpMetadata: { contentType: type },
    customMetadata: { auteur: session.role, nom },
  });

  const ligne = {
    id,
    nom,
    type,
    taille: fichier.size,
    cle_r2: cleR2,
    auteur: session.role,
    matiere: formulaire.get('matiere') ? String(formulaire.get('matiere')).slice(0, 40) : null,
    ref: formulaire.get('ref') ? String(formulaire.get('ref')).slice(0, 10) : null,
    note: formulaire.get('note') ? String(formulaire.get('note')).slice(0, 300) : null,
    cree_le: maintenant(),
  };

  await context.env.DB.prepare(
    `INSERT INTO fichiers (id, nom, type, taille, cle_r2, auteur, matiere, ref, note, cree_le)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(ligne.id, ligne.nom, ligne.type, ligne.taille, ligne.cle_r2,
    ligne.auteur, ligne.matiere, ligne.ref, ligne.note, ligne.cree_le).run();

  const { cle_r2: _, ...publique } = ligne;
  return json(publique, 201);
});
