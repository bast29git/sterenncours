/**
 * PUT /api/suivi : positionne une leçon sur l'échelle des quatre niveaux.
 * Réservé à l'espace professeur : l'élève ne se note pas elle-même.
 * GET /api/suivi?cle=<matiere>/<ref>&n=50 : l'historique daté des positionnements d'une leçon (B144).
 * GET /api/suivi?export=csv : le suivi complet en CSV (professeur, B197).
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant, nouvelId, MESSAGES, journaliser, methodeNonPermise } from '../_commun.js';
import { lireCorps, matiere as validerMatiere, ref as validerRef, texte as validerTexte, entier, choix } from '../_valider.js';
import { PROGRAMME } from '../_programme.js';

export const onRequest = methodeNonPermise(['GET', 'PUT']);
const NIVEAUX = ['insuffisant', 'fragile', 'satisfaisant', 'tresbien'];
const RAISONS = ['decision', 'serie', 'devoir', 'reprise', 'proposition', 'positionnement'];
const LECONS = new Map(PROGRAMME.flatMap((m) => m.lecons.map((l) => [m.id + '/' + l.ref, { matiere: m.nom, titre: l.titre }])));
const csv = (v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';

export const onRequestGet = gerer(async (context) => {
  const session = await exigerSession(context);
  const url = new URL(context.request.url);
  if (url.searchParams.get('export') === 'csv') {
    exigerProf(session);
    const r = await context.env.DB.prepare('SELECT cle, matiere, ref, niveau, note, maj_le, maj_par FROM suivi ORDER BY cle').all();
    const lignes = ['﻿' + ['cle', 'matiere', 'titre', 'niveau', 'note', 'mis_a_jour_le', 'par'].join(';')];
    for (const l of r.results || []) { const inf = LECONS.get(l.cle) || {}; lignes.push([l.cle, inf.matiere || l.matiere, inf.titre || '', l.niveau, l.note, l.maj_le, l.maj_par].map(csv).join(';')); }
    return new Response(lignes.join('\r\n'), { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': `attachment; filename="suivi-${new Date().toISOString().slice(0, 10)}.csv"`, 'cache-control': 'no-store' } });
  }
  const cle = String(url.searchParams.get('cle') || '');
  if (!/^[a-z0-9-]+\/[A-Za-z0-9]+$/.test(cle)) return erreur('Clé invalide.', 400, 'invalide', 'cle');
  const n = entier(url.searchParams.get('n'), 1, 200, 50);
  try {
    const r = await context.env.DB.prepare('SELECT avant, apres, raison, par, quand FROM suivi_journal WHERE cle = ? ORDER BY quand DESC LIMIT ?').bind(cle, n).all();
    return json({ cle, journal: r.results || [] });
  } catch (e) { return json({ cle, journal: [] }); }
});

export const onRequestPut = gerer(async (context) => {
  const session = exigerProf(await exigerSession(context));
  const { DB } = context.env;

  const corps = await lireCorps(context.request);
  if (!corps) return erreur(MESSAGES.requete_invalide);
  // B141 : matière et référence passent par les validateurs partagés et doivent exister au programme.
  const matiere = validerMatiere(corps.matiere); const ref = validerRef(corps.ref);
  if (!matiere || !ref) return erreur('matiere et ref sont requis.', 400, 'invalide', matiere ? 'ref' : 'matiere');
  const cle = matiere + '/' + ref;
  if (!LECONS.has(cle)) return erreur(MESSAGES.cle_lecon_invalide, 400, 'invalide', 'ref');
  const niveau = corps.niveau ? choix(corps.niveau, NIVEAUX) : null;
  if (corps.niveau && !niveau) return erreur('Niveau inconnu.', 400, 'invalide', 'niveau');
  // B142 : la note est nettoyée et bornée à cinq cents caractères.
  const note = validerTexte(corps.note, 500) || null;

  const raison = choix(corps.raison, RAISONS, 'decision');
  const avant = await DB.prepare('SELECT niveau FROM suivi WHERE cle = ?').bind(cle).first().catch(() => null);
  const journalSuivi = async (apres) => {
    if ((avant && avant.niveau) === (apres || null)) return;
    try {
      await DB.prepare('INSERT INTO suivi_journal (id, cle, avant, apres, raison, par, quand) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(nouvelId(), cle, avant ? avant.niveau : null, apres || null, raison, session.role, maintenant()).run();
    } catch (e) { /* table absente avant la migration 0008 */ }
    // B143 : le journal d'audit général en garde aussi la trace.
    await journaliser(context.env, session, 'suivi', cle, avant ? avant.niveau : null, apres || null);
  };
  if (!niveau) {
    await DB.prepare('DELETE FROM suivi WHERE cle = ?').bind(cle).run();
    await journalSuivi(null);
    return json({ cle, niveau: null });
  }

  const quand = maintenant();
  await DB.prepare(
    `INSERT INTO suivi (cle, matiere, ref, niveau, note, maj_le, maj_par)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(cle) DO UPDATE SET niveau = excluded.niveau, note = excluded.note,
       maj_le = excluded.maj_le, maj_par = excluded.maj_par`,
  ).bind(cle, matiere, ref, niveau, note, quand, session.role).run();
  await journalSuivi(niveau);

  return json({ cle, niveau, note, maj_le: quand });
});
