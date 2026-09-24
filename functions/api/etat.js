/**
 * GET /api/etat : tout l'état partagé en une seule requête.
 * Le site l'appelle au démarrage puis après chaque modification.
 */
import { json, gerer, exigerSession } from '../_commun.js';
import { lireReglages } from './reglages.js';
import { lireFelicitations } from './felicitations.js';
import { lireAcces } from './acces.js';
import { lireProfil } from './profil.js';
import { PROGRAMME } from '../_programme.js';

export const onRequestGet = gerer(async (context) => {
  const session = await exigerSession(context);
  const { DB } = context.env;

  const [suivi, resultats, fiches, ouvertures, messages, reglages, felicitations, acces, profil, passees] = await Promise.all([
    DB.prepare('SELECT cle, niveau, note, maj_le, maj_par FROM suivi').all(),
    DB.prepare('SELECT cle, justes, total, meilleur, series, maj_le FROM resultats').all(),
    DB.prepare('SELECT cle, termine_le FROM fiches_lues').all(),
    DB.prepare('SELECT cle, etat FROM ouvertures').all(),
    DB.prepare('SELECT COUNT(*) AS n FROM messages WHERE auteur != ? AND lu_le IS NULL AND (envoyer_le IS NULL OR envoyer_le <= ?)').bind(session.role, new Date().toISOString()).all()
      .catch(() => DB.prepare('SELECT COUNT(*) AS n FROM messages WHERE auteur != ? AND lu_le IS NULL').bind(session.role).all()),
    lireReglages(DB),
    lireFelicitations(DB),
    lireAcces(DB),
    lireProfil(DB),
    DB.prepare('SELECT lecons FROM seances WHERE date <= ? AND type = ?').bind(new Date().toISOString().slice(0, 10), 'cours').all().catch(() => ({ results: [] })),
  ]);

  const enObjet = (lignes, cleChamp) => {
    const sortie = {};
    for (const l of lignes) {
      const { [cleChamp]: k, ...reste } = l;
      sortie[k] = reste;
    }
    return sortie;
  };

  // Verrous des leçons, calculés ici et non dans le navigateur : première de la
  // matière ouverte, puis la précédente validée ou la leçon déjà au programme
  // d'une séance passée ; la décision explicite du professeur (ouvertures) prime.
  const validees = new Set((suivi.results || []).filter((l) => l.niveau === 'satisfaisant' || l.niveau === 'tresbien').map((l) => l.cle));
  const programmees = new Set();
  for (const l of passees.results || []) {
    try { JSON.parse(l.lecons || '[]').forEach((r) => programmees.add(r)); } catch (e) { /* ligne illisible */ }
  }
  const decisions = {};
  for (const o of ouvertures.results || []) decisions[o.cle] = o.etat;
  const verrous = {};
  for (const m of PROGRAMME) {
    m.lecons.forEach((l, i) => {
      const cle = m.id + '/' + l.ref;
      const d = decisions[cle];
      let ouvert;
      if (d === 1) ouvert = true;
      else if (d === 0) ouvert = false;
      else ouvert = i === 0 || programmees.has(cle) || validees.has(m.id + '/' + m.lecons[i - 1].ref);
      verrous[cle] = ouvert;
    });
  }

  const corps = {
    role: session.role,
    acces,
    verrous,
    profil,
    suivi: enObjet(suivi.results || [], 'cle'),
    resultats: enObjet(resultats.results || [], 'cle'),
    fiches: enObjet(fiches.results || [], 'cle'),
    ouvertures: enObjet(ouvertures.results || [], 'cle'),
    reglages,
    felicitations,
    messagesNonLus: (messages.results && messages.results[0] && messages.results[0].n) || 0,
  };
  // Empreinte : le navigateur renvoie l'empreinte reçue ; si rien n'a changé, 304 sans corps.
  const texte = JSON.stringify(corps);
  let h = 0;
  for (let i = 0; i < texte.length; i += 1) h = (h * 31 + texte.charCodeAt(i)) | 0;
  const empreinte = '"' + (h >>> 0).toString(16) + '-' + texte.length + '"';
  if (context.request.headers.get('if-none-match') === empreinte) {
    return new Response(null, { status: 304, headers: { etag: empreinte, 'cache-control': 'no-store' } });
  }
  return json(corps, 200, { etag: empreinte });
});
