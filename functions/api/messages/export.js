/**
 * B198 : GET /api/messages/export?format=csv|json&fil=<matiere> : toute la discussion, pour l'archiver (professeur).
 */
import { gerer, exigerSession, exigerProf, json, methodeNonPermise } from '../../_commun.js';
import { matiere as validerMatiere } from '../../_valider.js';

export const onRequest = methodeNonPermise(['GET']);
const csv = (v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';

export const onRequestGet = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  const url = new URL(context.request.url);
  const format = url.searchParams.get('format') === 'json' ? 'json' : 'csv';
  const fil = url.searchParams.get('fil') === 'general' ? 'general' : validerMatiere(url.searchParams.get('fil'));
  const requete = fil === 'general' ? context.env.DB.prepare('SELECT * FROM messages WHERE fil IS NULL ORDER BY cree_le ASC LIMIT 5000')
    : fil ? context.env.DB.prepare('SELECT * FROM messages WHERE fil = ? ORDER BY cree_le ASC LIMIT 5000').bind(fil)
      : context.env.DB.prepare('SELECT * FROM messages ORDER BY cree_le ASC LIMIT 5000');
  const messages = (await requete.all()).results || [];
  const jour = new Date().toISOString().slice(0, 10);
  if (format === 'json') return json({ exporte_le: new Date().toISOString(), fil: fil || null, n: messages.length, messages }, 200, { 'content-disposition': `attachment; filename="messages-${jour}.json"` });
  const lignes = ['﻿' + ['date', 'auteur', 'fil', 'contexte', 'texte', 'lu_le'].join(';')];
  for (const m of messages) lignes.push([m.cree_le, m.auteur === 'eleve' ? 'Sterenn' : 'Bastien', m.fil || '', m.contexte || '', m.texte, m.lu_le || ''].map(csv).join(';'));
  return new Response(lignes.join('\r\n'), { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': `attachment; filename="messages-${jour}.csv"`, 'cache-control': 'no-store' } });
});
