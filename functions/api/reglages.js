/**
 * GET /api/reglages : les réglages en vigueur, valeurs par défaut comprises.
 * PUT /api/reglages : le professeur change un réglage ({ cle, valeur }).
 *
 * Les réglages décrivent ce que Sterenn voit : les points de pause dans les
 * fiches, la tutrice Opale, la calculatrice, les options de la messagerie.
 * Toute clé inconnue est refusée : la liste ci-dessous fait foi.
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant, journaliser, MESSAGES, methodeNonPermise } from '../_commun.js';
import { lireCorps } from '../_valider.js';

export const onRequest = methodeNonPermise(['GET', 'PUT']);

export const REGLAGES = {
  pauses:        { defaut: true,  type: 'boolean', libelle: 'Points de pause dans les fiches' },
  tuteur:        { defaut: true,  type: 'boolean', libelle: 'Opale, la tutrice, dans l\'espace de Sterenn' },
  calculatrice:  { defaut: true,  type: 'boolean', libelle: 'Calculatrice d\'Opale' },
  calculatrice_maths: { defaut: true, type: 'boolean', libelle: 'Calculatrice autorisée pendant les exercices de mathématiques' },
  calculatrice_evaluation: { defaut: false, type: 'boolean', libelle: 'Calculatrice autorisée pendant une évaluation' },
  reactions:     { defaut: true,  type: 'boolean', libelle: 'Réactions animées sur les messages' },
  formatage:     { defaut: false, type: 'boolean', libelle: 'Mise en forme du texte dans les messages' },
  fils:          { defaut: true,  type: 'boolean', libelle: 'Fils de discussion séparés par matière' },
  felicitations: { defaut: true,  type: 'boolean', libelle: 'Message d\'encouragement automatique quand une série est réussie' },
  sonde:         { defaut: 45,    type: 'number',  libelle: 'Délai de la sonde de nouveautés, en secondes', min: 20, max: 300 },
};

export async function lireReglages(DB) {
  const sortie = {};
  for (const [k, r] of Object.entries(REGLAGES)) sortie[k] = r.defaut;
  try {
    const lignes = await DB.prepare('SELECT cle, valeur FROM reglages').all();
    for (const l of lignes.results || []) {
      if (!REGLAGES[l.cle]) continue;
      try { sortie[l.cle] = JSON.parse(l.valeur); } catch (e) { /* valeur illisible : défaut */ }
    }
  } catch (e) { /* table absente avant la migration : défauts */ }
  return sortie;
}

export const onRequestGet = gerer(async (context) => {
  await exigerSession(context);
  const reglages = await lireReglages(context.env.DB);
  // B159 : une empreinte, pour que le navigateur ne recharge pas des réglages inchangés.
  const texte = JSON.stringify(reglages);
  const octets = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texte));
  const empreinte = '"' + [...new Uint8Array(octets)].slice(0, 10).map((b) => b.toString(16).padStart(2, '0')).join('') + '"';
  if (context.request.headers.get('if-none-match') === empreinte) return new Response(null, { status: 304, headers: { etag: empreinte, 'cache-control': 'no-store' } });
  return json({ reglages, definitions: Object.fromEntries(Object.entries(REGLAGES).map(([k, r]) => [k, { libelle: r.libelle, type: r.type, defaut: r.defaut, min: r.min, max: r.max }])) }, 200, { etag: empreinte });
});

/** Valide et enregistre un réglage ; renvoie la valeur retenue, ou lève une erreur qui nomme le champ (B157). */
async function poser(context, session, cle, brut) {
  const regle = REGLAGES[cle];
  if (!regle) throw erreur(`Réglage inconnu : ${cle}.`, 400, 'invalide', cle);
  let valeur = brut;
  if (typeof valeur !== regle.type) throw erreur(`La valeur de ${cle} doit être de type ${regle.type === 'boolean' ? 'oui/non' : 'nombre'}.`, 400, 'invalide', cle);
  if (regle.type === 'number') valeur = Math.min(regle.max, Math.max(regle.min, Math.round(valeur)));
  await context.env.DB.prepare(
    `INSERT INTO reglages (cle, valeur, maj_le) VALUES (?, ?, ?)
     ON CONFLICT(cle) DO UPDATE SET valeur = excluded.valeur, maj_le = excluded.maj_le`,
  ).bind(cle, JSON.stringify(valeur), maintenant()).run();
  await journaliser(context.env, session, 'reglage', cle, null, valeur);
  return valeur;
}

export const onRequestPut = gerer(async (context) => {
  const session = exigerProf(await exigerSession(context));
  const { DB } = context.env;
  const corps = await lireCorps(context.request);
  if (!corps) return erreur(MESSAGES.requete_invalide);
  // B158 : plusieurs réglages d'un coup ({ reglages: { cle: valeur, ... } }), ou un seul.
  if (corps.reglages && typeof corps.reglages === 'object') {
    const entrees = Object.entries(corps.reglages).slice(0, 40);
    if (!entrees.length) return erreur('Aucun réglage.', 400, 'invalide', 'reglages');
    const retenus = {};
    for (const [k, v] of entrees) retenus[k] = await poser(context, session, String(k), v);
    return json({ retenus, reglages: await lireReglages(DB) });
  }
  const cle = String(corps.cle || '');
  if (!REGLAGES[cle]) return erreur('Réglage inconnu.', 400, 'invalide', 'cle');
  const valeur = await poser(context, session, cle, corps.valeur);
  return json({ cle, valeur, reglages: await lireReglages(DB) });
});
