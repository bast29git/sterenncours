/**
 * A53 : les erreurs JavaScript du navigateur, remontées et dédoublonnées.
 *   POST /api/erreur { message, source, ecran } : une erreur de plus (au plus dix par minute et par session)
 *   GET  /api/erreur : la liste (professeur)
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant } from '../_commun.js';

async function empreinteDe(texte) {
  const octets = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texte));
  return [...new Uint8Array(octets)].slice(0, 12).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const onRequestPost = gerer(async (context) => {
  const session = await exigerSession(context);
  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur('Requête invalide.'); }
  const message = String(corps && corps.message || '').slice(0, 300).trim();
  if (!message) return erreur('Message vide.');
  const source = String(corps.source || '').slice(0, 200);
  const ecran = String(corps.ecran || '').slice(0, 120);
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
      `INSERT INTO erreurs (empreinte, message, source, ecran, role, n, premiere, derniere) VALUES (?, ?, ?, ?, ?, 1, ?, ?)
       ON CONFLICT(empreinte) DO UPDATE SET n = n + 1, derniere = excluded.derniere, ecran = excluded.ecran`,
    ).bind(empreinte, message, source, ecran, session.role, now, now).run();
  } catch (e) { /* table absente avant la migration */ }
  return json({ empreinte });
});

export const onRequestGet = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  try {
    const r = await context.env.DB.prepare('SELECT empreinte, message, source, ecran, role, n, premiere, derniere FROM erreurs ORDER BY derniere DESC LIMIT 100').all();
    return json({ erreurs: r.results || [] });
  } catch (e) { return json({ erreurs: [] }); }
});

export const onRequestDelete = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  try { await context.env.DB.prepare('DELETE FROM erreurs').run(); } catch (e) { /* rien */ }
  return json({ vide: true });
});
