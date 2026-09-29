/**
 * A53 : les erreurs JavaScript du navigateur, remontées et dédoublonnées.
 *   POST   /api/erreur { message, source, ecran, pile, version } : une erreur de plus (au plus dix par minute et par session)
 *   GET    /api/erreur?n=100&role=eleve : la liste (professeur)
 *   DELETE /api/erreur?empreinte=<hex>  : une entrée, ou tout sans paramètre
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant, MESSAGES, methodeNonPermise } from '../_commun.js';
import { lireCorps, texte as validerTexte, entier, choix } from '../_valider.js';

export const onRequest = methodeNonPermise(['GET', 'POST', 'DELETE']);
async function empreinteDe(texte) {
  const octets = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texte));
  return [...new Uint8Array(octets)].slice(0, 12).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const onRequestPost = gerer(async (context) => {
  const session = await exigerSession(context);
  const corps = await lireCorps(context.request);
  if (!corps) return erreur(MESSAGES.requete_invalide);
  const message = validerTexte(corps.message, 300);
  if (!message) return erreur('Message vide.', 400, 'invalide', 'message');
  const source = validerTexte(corps.source, 200);
  const ecran = validerTexte(corps.ecran, 120);
  // B192, B193 : la pile d'appels (bornée) et la version du site au moment de l'erreur.
  const pile = validerTexte(corps.pile, 800) || null;
  const version = validerTexte(corps.version, 20) || null;
  if (context.env.SESSIONS) {
    const cle = 'erreurs:' + (session.jeton || session.role).slice(0, 24) + ':' + new Date().toISOString().slice(0, 16);
    const n = Number(await context.env.SESSIONS.get(cle)) || 0;
    if (n >= 10) return json({ ignoree: true });
    await context.env.SESSIONS.put(cle, String(n + 1), { expirationTtl: 120 });
  }
  const empreinte = await empreinteDe(message + '|' + source.replace(/\?v=[^&]*/, ''));
  const now = maintenant();
  try {
    await context.env.DB.prepare(
      `INSERT INTO erreurs (empreinte, message, source, ecran, role, n, premiere, derniere, pile, version) VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?, ?)
       ON CONFLICT(empreinte) DO UPDATE SET n = n + 1, derniere = excluded.derniere, ecran = excluded.ecran, pile = COALESCE(excluded.pile, erreurs.pile), version = excluded.version`,
    ).bind(empreinte, message, source, ecran, session.role, now, now, pile, version).run();
  } catch (e) {
    try {
      await context.env.DB.prepare(
        `INSERT INTO erreurs (empreinte, message, source, ecran, role, n, premiere, derniere) VALUES (?, ?, ?, ?, ?, 1, ?, ?)
         ON CONFLICT(empreinte) DO UPDATE SET n = n + 1, derniere = excluded.derniere, ecran = excluded.ecran`,
      ).bind(empreinte, message, source, ecran, session.role, now, now).run();
    } catch (e2) { /* table absente avant la migration */ }
  }
  return json({ empreinte });
});

export const onRequestGet = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  const url = new URL(context.request.url);
  // B194 : nombre et rôle filtrables.
  const n = entier(url.searchParams.get('n'), 1, 500, 100);
  const role = choix(url.searchParams.get('role'), ['eleve', 'prof', 'serveur']);
  try {
    const r = role
      ? await context.env.DB.prepare('SELECT * FROM erreurs WHERE role = ? ORDER BY derniere DESC LIMIT ?').bind(role, n).all()
      : await context.env.DB.prepare('SELECT * FROM erreurs ORDER BY derniere DESC LIMIT ?').bind(n).all();
    const total = await context.env.DB.prepare('SELECT COUNT(*) AS n, SUM(n) AS occurrences FROM erreurs').first().catch(() => ({ n: 0, occurrences: 0 }));
    return json({ erreurs: r.results || [], total: (total && total.n) || 0, occurrences: (total && total.occurrences) || 0 });
  } catch (e) { return json({ erreurs: [], total: 0, occurrences: 0 }); }
});

export const onRequestDelete = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  // B195 : une seule entrée par empreinte, ou tout.
  const empreinte = String(new URL(context.request.url).searchParams.get('empreinte') || '');
  try {
    if (empreinte) {
      if (!/^[0-9a-f]{24}$/.test(empreinte)) return erreur('Empreinte invalide.', 400, 'invalide', 'empreinte');
      await context.env.DB.prepare('DELETE FROM erreurs WHERE empreinte = ?').bind(empreinte).run();
      return json({ vide: false, supprimee: empreinte });
    }
    await context.env.DB.prepare('DELETE FROM erreurs').run();
  } catch (e) { /* rien */ }
  return json({ vide: true });
});
