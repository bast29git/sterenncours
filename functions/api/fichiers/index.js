/**
 * Partage de fichiers entre les deux espaces.
 *   GET  /api/fichiers?avant=<iso>&limite=50&matiere=<id>&genre=image|audio|document   liste, paginée et filtrée
 *   POST /api/fichiers   dépose un fichier (multipart/form-data)
 *
 * Le contenu vit dans R2, l'index dans D1. Si R2 n'est pas activé sur le
 * compte, l'API le dit clairement au lieu d'échouer silencieusement.
 */
import { json, erreur, gerer, exigerSession, maintenant, nouvelId, journaliser, methodeNonPermise } from '../../_commun.js';
import { entier, dateHeureIso, matiere as validerMatiere, ref as validerRef, texte as validerTexte } from '../../_valider.js';
import { PROGRAMME } from '../../_programme.js';
import { compter } from '../usage.js';

export const onRequest = methodeNonPermise(['GET', 'POST']);
const TAILLE_MAX = 15 * 1024 * 1024; // 15 Mo
// B106 : une borne par famille : une photo n'a pas besoin de 15 Mo, un message vocal encore moins.
const TAILLE_PAR_GENRE = { image: 12 * 1024 * 1024, audio: 3 * 1024 * 1024, document: TAILLE_MAX };
const DEPOTS_PAR_JOUR = 80;
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
// B105 : l'extension annoncée doit aller avec le type.
const EXTENSIONS = {
  'image/png': ['png'], 'image/jpeg': ['jpg', 'jpeg'], 'image/webp': ['webp'], 'image/gif': ['gif'], 'image/heic': ['heic'],
  'application/pdf': ['pdf'], 'text/plain': ['txt'], 'text/markdown': ['md', 'markdown'], 'text/csv': ['csv'],
  'application/msword': ['doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['xlsx'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['pptx'],
  'audio/webm': ['webm', 'weba'], 'audio/ogg': ['ogg', 'oga'], 'audio/mp4': ['m4a', 'mp4'], 'audio/mpeg': ['mp3'], 'audio/wav': ['wav'],
};
const MATIERES = new Set(PROGRAMME.map((m) => m.id));
export const genreDe = (type) => (String(type).startsWith('image/') ? 'image' : String(type).startsWith('audio/') ? 'audio' : 'document');

/** B104 : un nom de fichier sans chemin, sans caractère de contrôle, borné. */
export function nomPropre(brut) {
  const nom = String(brut || 'fichier').split(/[\\/]/).pop().replace(/[\u0000-\u001F\u007F]/g, '').replace(/\s+/g, ' ').trim().slice(0, 160);
  return nom && nom !== '.' && nom !== '..' ? nom : 'fichier';
}

export const onRequestGet = gerer(async (context) => {
  const session = await exigerSession(context);
  const url = new URL(context.request.url);
  // B101, B102, B103 : pagination vers le passé, filtre par matière et par famille.
  const avant = dateHeureIso(url.searchParams.get('avant'));
  const limite = entier(url.searchParams.get('limite'), 1, 200, 100);
  const matiere = validerMatiere(url.searchParams.get('matiere'));
  const genre = ['image', 'audio', 'document'].includes(url.searchParams.get('genre')) ? url.searchParams.get('genre') : null;
  const conditions = []; const valeurs = [];
  if (avant) { conditions.push('cree_le < ?'); valeurs.push(avant); }
  if (matiere) { conditions.push('matiere = ?'); valeurs.push(matiere); }
  if (genre === 'image') conditions.push("type LIKE 'image/%'");
  else if (genre === 'audio') conditions.push("type LIKE 'audio/%'");
  else if (genre === 'document') conditions.push("type NOT LIKE 'image/%' AND type NOT LIKE 'audio/%'");
  const ou = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  let results;
  try {
    results = (await context.env.DB.prepare(`SELECT id, nom, type, taille, auteur, matiere, ref, note, cree_le, sha256 FROM fichiers ${ou} ORDER BY cree_le DESC LIMIT ?`).bind(...valeurs, limite + 1).all()).results || [];
  } catch (e) {
    results = (await context.env.DB.prepare(`SELECT id, nom, type, taille, auteur, matiere, ref, note, cree_le FROM fichiers ${ou} ORDER BY cree_le DESC LIMIT ?`).bind(...valeurs, limite + 1).all()).results || [];
  }
  const suite = results.length > limite;
  const fichiers = (suite ? results.slice(0, limite) : results).map((f) => ({ ...f, genre: genreDe(f.type) }));
  // B118 : un doublon est signalé (même empreinte qu'un fichier plus ancien).
  const vues = new Map();
  for (const f of [...fichiers].reverse()) { if (f.sha256) { if (vues.has(f.sha256)) f.doublon_de = vues.get(f.sha256); else vues.set(f.sha256, f.id); } }
  // B119 : le quota de dépôts du jour, pour que l'interface prévienne avant le refus.
  let quota = null;
  if (context.env.SESSIONS) { try { const n = Number(await context.env.SESSIONS.get('depots:' + session.role + ':' + new Date().toISOString().slice(0, 10))) || 0; quota = { jour: n, plafond: DEPOTS_PAR_JOUR }; } catch (e) { quota = null; } }
  return json({ fichiers, suite, stockage: Boolean(context.env.FICHIERS), quota });
});

export const onRequestPost = gerer(async (context) => {
  const session = await exigerSession(context);
  if (!context.env.FICHIERS) {
    return erreur('Le stockage de fichiers n\'est pas activé sur ce compte.', 503);
  }
  // B107 : quatre-vingts dépôts par jour et par espace.
  const cleQuota = 'depots:' + session.role + ':' + new Date().toISOString().slice(0, 10);
  if (context.env.SESSIONS) {
    const n = Number(await context.env.SESSIONS.get(cleQuota)) || 0;
    if (n >= DEPOTS_PAR_JOUR) return erreur('Le nombre de dépôts du jour est atteint : à demain.', 429, 'quota');
  }

  let formulaire;
  try { formulaire = await context.request.formData(); } catch (e) { return erreur('Envoi illisible.'); }

  const fichier = formulaire.get('fichier');
  if (!fichier || typeof fichier === 'string') return erreur('Aucun fichier reçu.', 400, 'invalide', 'fichier');
  if (fichier.size === 0) return erreur('Le fichier est vide.', 400, 'invalide', 'fichier');
  if (fichier.size > TAILLE_MAX) return erreur('Le fichier dépasse 15 Mo.', 413);

  const type = fichier.type || 'application/octet-stream';
  if (!TYPES_AUTORISES.includes(type)) {
    return erreur('Ce type de fichier n\'est pas accepté : ' + type, 400, 'invalide', 'fichier');
  }
  const genre = genreDe(type);
  if (fichier.size > TAILLE_PAR_GENRE[genre]) return erreur(`Un fichier ${genre === 'image' ? 'image' : genre === 'audio' ? 'audio' : ''} ne dépasse pas ${Math.round(TAILLE_PAR_GENRE[genre] / 1048576)} Mo.`, 413);
  const nom = nomPropre(fichier.name);
  // A17 : pas de document bureautique avec macros.
  if (/\.(docm|xlsm|pptm|dotm|xlam|ppam)$/i.test(nom) || /macroEnabled/i.test(type)) {
    return erreur('Les documents avec macros ne sont pas acceptés.', 400, 'invalide', 'fichier');
  }
  const extension = (nom.includes('.') ? nom.split('.').pop() : '').toLowerCase();
  if (extension && EXTENSIONS[type] && !EXTENSIONS[type].includes(extension)) return erreur(`L'extension .${extension} ne va pas avec le type ${type}.`, 400, 'invalide', 'fichier');
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
    return erreur('Le contenu du fichier ne correspond pas à son type (' + type + ').', 400, 'invalide', 'fichier');
  }
  // B108 : la matière doit exister, la référence suivre le format des leçons.
  const matiere = formulaire.get('matiere') ? String(formulaire.get('matiere')).slice(0, 40) : null;
  const matiereId = matiere ? (PROGRAMME.find((m) => m.id === matiere || m.nom.toLowerCase() === matiere.toLowerCase().split(' · ')[0]) || null) : null;
  if (matiere && !matiereId && !MATIERES.has(matiere)) {
    // On tolère un libellé libre (« Mathématiques · L01 ») mais jamais du contenu douteux.
    if (/[<>\u0000-\u001F]/.test(matiere)) return erreur('Matière invalide.', 400, 'invalide', 'matiere');
  }
  const ref = formulaire.get('ref') ? validerRef(String(formulaire.get('ref'))) : null;
  if (formulaire.get('ref') && !ref) return erreur('Référence de leçon invalide.', 400, 'invalide', 'ref');
  const note = validerTexte(formulaire.get('note'), 300) || null;

  // B109, B110 : empreinte SHA-256 du contenu, stockée et vérifiée par R2 à l'écriture.
  const octets = await fichier.arrayBuffer();
  const sha = [...new Uint8Array(await crypto.subtle.digest('SHA-256', octets))].map((b) => b.toString(16).padStart(2, '0')).join('');
  const id = nouvelId();
  const cleR2 = `${new Date().toISOString().slice(0, 10)}/${id}`;
  await context.env.FICHIERS.put(cleR2, octets, {
    httpMetadata: { contentType: type },
    customMetadata: { auteur: session.role, nom, sha256: sha },
    sha256: sha,
  });

  const ligne = {
    id, nom, type, taille: fichier.size, cle_r2: cleR2, auteur: session.role,
    matiere, ref, note, cree_le: maintenant(), sha256: sha,
  };
  try {
    await context.env.DB.prepare(
      `INSERT INTO fichiers (id, nom, type, taille, cle_r2, auteur, matiere, ref, note, cree_le, sha256) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(ligne.id, ligne.nom, ligne.type, ligne.taille, ligne.cle_r2, ligne.auteur, ligne.matiere, ligne.ref, ligne.note, ligne.cree_le, ligne.sha256).run();
  } catch (e) {
    await context.env.DB.prepare(
      `INSERT INTO fichiers (id, nom, type, taille, cle_r2, auteur, matiere, ref, note, cree_le) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(ligne.id, ligne.nom, ligne.type, ligne.taille, ligne.cle_r2, ligne.auteur, ligne.matiere, ligne.ref, ligne.note, ligne.cree_le).run();
  }
  if (context.env.SESSIONS) { try { const n = Number(await context.env.SESSIONS.get(cleQuota)) || 0; await context.env.SESSIONS.put(cleQuota, String(n + 1), { expirationTtl: 90000 }); } catch (e) { /* facultatif */ } }
  // B111 : le dépôt est journalisé et compté.
  await journaliser(context.env, session, 'fichier', id, null, `${nom} (${type}, ${fichier.size} octets)`);
  await compter(context.env, 'fichier');
  // Doublon d'un fichier déjà déposé ?
  let doublonDe = null;
  try { const d = await context.env.DB.prepare('SELECT id FROM fichiers WHERE sha256 = ? AND id != ? ORDER BY cree_le ASC LIMIT 1').bind(sha, id).first(); doublonDe = d ? d.id : null; } catch (e) { doublonDe = null; }

  const publique = { ...ligne, genre, doublon_de: doublonDe }; delete publique.cle_r2;
  return json(publique, 201);
});
