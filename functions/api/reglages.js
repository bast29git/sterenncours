/**
 * GET /api/reglages : les réglages en vigueur, valeurs par défaut comprises.
 * PUT /api/reglages : le professeur change un réglage ({ cle, valeur }).
 *
 * Les réglages décrivent ce que Sterenn voit : les points de pause dans les
 * fiches, la tutrice Opale, la calculatrice, les options de la messagerie.
 * Toute clé inconnue est refusée : la liste ci-dessous fait foi.
 */
import { json, erreur, gerer, exigerSession, exigerProf, maintenant, journaliser } from '../_commun.js';

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
  return json({ reglages: await lireReglages(context.env.DB) });
});

export const onRequestPut = gerer(async (context) => {
  const session = exigerProf(await exigerSession(context));
  const { DB } = context.env;

  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur('Requête invalide.'); }
  const cle = String(corps && corps.cle || '');
  const regle = REGLAGES[cle];
  if (!regle) return erreur('Réglage inconnu.');
  let valeur = corps.valeur;
  if (typeof valeur !== regle.type) return erreur(`La valeur de ${cle} doit être de type ${regle.type}.`);
  if (regle.type === 'number') valeur = Math.min(regle.max, Math.max(regle.min, Math.round(valeur)));

  await DB.prepare(
    `INSERT INTO reglages (cle, valeur, maj_le) VALUES (?, ?, ?)
     ON CONFLICT(cle) DO UPDATE SET valeur = excluded.valeur, maj_le = excluded.maj_le`,
  ).bind(cle, JSON.stringify(valeur), maintenant()).run();

  const apres = await lireReglages(DB);
  await journaliser(context.env, session, 'reglage', cle, null, valeur);
  return json({ cle, valeur, reglages: apres });
});
