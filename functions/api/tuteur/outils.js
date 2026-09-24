/**
 * POST /api/tuteur/outils : Opale au service du professeur (jamais de Sterenn).
 *   action « resume »    : un résumé de fiche en trois phrases, à valider avant d'être montré (C22).
 *   action « questions » : cinq questions à choix multiples proposées pour la banque, relues une à une (A47).
 *   action « analyse »   : lecture d'une copie photographiée et proposition de positionnement sur la grille,
 *                          la décision restant au professeur (A49).
 * Sans liaison Workers AI : { indisponible: true }. Compte dans l'usage du jour (clé « outils »).
 */
import { compter } from '../usage.js';
import { json, erreur, gerer, exigerSession, exigerProf, MESSAGES } from '../../_commun.js';
import { lireCorps, texte, choix, identifiant, entier, liste } from '../../_valider.js';

const MODELE = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const MODELE_REPLI = '@cf/meta/llama-3.1-8b-instruct';
const MODELE_VISION = '@cf/llava-hf/llava-1.5-7b-hf';
const NIVEAUX = ['insuffisant', 'fragile', 'satisfaisant', 'tresbien'];

async function generer(env, messages, max) {
  try {
    const r = await env.AI.run(MODELE, { messages, max_tokens: max || 500, temperature: 0.3 });
    return String((r && (r.response || (r.result && r.result.response))) || '').trim();
  } catch (e) {
    const r = await env.AI.run(MODELE_REPLI, { messages, max_tokens: max || 500, temperature: 0.3 });
    return String((r && (r.response || (r.result && r.result.response))) || '').trim();
  }
}
const nettoyer = (t) => String(t || '').replace(/[–—]/g, ':').trim();
function extraireJson(t) {
  const m = String(t || '').match(/\[[\s\S]*\]|\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch (e) { return null; }
}

export const onRequestPost = gerer(async (context) => {
  const session = await exigerSession(context);
  exigerProf(session);
  const { env } = context;
  const corps = await lireCorps(context.request);
  if (!corps) return erreur(MESSAGES.requete_invalide);
  const action = choix(corps.action, ['resume', 'questions', 'analyse']);
  if (!action) return erreur(MESSAGES.requete_invalide);
  if (!env.AI) return json({ indisponible: true, message: MESSAGES.ia_indisponible });

  if (action === 'resume') {
    const source = texte(corps.texte, 7000);
    if (source.length < 200) return erreur('Le texte de la fiche est trop court pour un résumé.');
    const titre = texte(corps.titre, 120);
    const reponse = await generer(env, [
      { role: 'system', content: 'Tu es une tutrice de collège. Tu écris en français, au tutoiement, des phrases courtes et littérales, sans métaphore, sans ironie, sans tiret long. Tu résumes une fiche de cours de quatrième en exactement trois phrases, une idée par phrase, vocabulaire de quatrième, sans introduction ni conclusion.' },
      { role: 'user', content: `Fiche : ${titre}\n\n${source}\n\nRésume en trois phrases.` },
    ], 260);
    if (!reponse) return json({ indisponible: true, raison: 'vide' });
    await compter(env, 'outils');
    return json({ resume: nettoyer(reponse) });
  }

  if (action === 'questions') {
    const source = texte(corps.texte, 7000);
    if (source.length < 200) return erreur('Le texte de la fiche est trop court pour proposer des questions.');
    const n = entier(corps.n, 3, 8, 5);
    const titre = texte(corps.titre, 120);
    const reponse = await generer(env, [
      { role: 'system', content: `Tu écris des questions à choix multiples pour une élève de quatrième, en français, sans tiret long. Réponds uniquement par un tableau JSON de ${n} objets de la forme {"q": "question", "choix": ["a", "b", "c", "d"], "reponse": 0, "explication": "ce qu'une réponse fausse doit apprendre"}. La bonne réponse est l'indice dans « choix ». Chaque explication fait une ou deux phrases, littérales. Aucun texte hors du JSON.` },
      { role: 'user', content: `Fiche : ${titre}\n\n${source}` },
    ], 1400);
    const brut = extraireJson(reponse);
    const questions = liste(brut, 8).map((q) => {
      if (!q || typeof q !== 'object') return null;
      const ch = liste(q.choix, 6).map((c) => nettoyer(texte(c, 160))).filter(Boolean);
      const rep = entier(q.reponse, 0, ch.length - 1, 0);
      const enonce = nettoyer(texte(q.q, 400));
      if (!enonce || ch.length < 2) return null;
      return { type: 'qcm', q: enonce, choix: ch, reponse: rep, explication: nettoyer(texte(q.explication, 600)) };
    }).filter(Boolean);
    if (!questions.length) return json({ indisponible: true, raison: 'format' });
    await compter(env, 'outils');
    return json({ questions });
  }

  // analyse d'une copie déposée
  const id = identifiant(corps.fichier);
  if (!id) return erreur(MESSAGES.identifiant_invalide);
  const ligne = await env.DB.prepare('SELECT * FROM fichiers WHERE id = ?').bind(id).first();
  if (!ligne) return erreur('Fichier introuvable.', 404);
  if (String(ligne.type || '').indexOf('image/') !== 0) return erreur('Seule une photo de copie peut être lue.');
  if (!env.FICHIERS) return erreur(MESSAGES.stockage_indisponible, 503);
  const objet = await env.FICHIERS.get(ligne.cle_r2);
  if (!objet) return erreur('Contenu introuvable.', 404);
  const octets = new Uint8Array(await objet.arrayBuffer());
  if (octets.length > 4 * 1024 * 1024) return erreur('La photo dépasse 4 Mo : impossible à lire.', 413);
  let transcription = '';
  try {
    const v = await env.AI.run(MODELE_VISION, { image: [...octets], prompt: 'Transcris fidèlement le texte manuscrit de cette copie d\'élève, ligne par ligne, en français. Si un passage est illisible, écris [illisible]. Ne commente pas.', max_tokens: 700 });
    transcription = nettoyer((v && (v.description || v.response)) || '');
  } catch (e) { return json({ indisponible: true, raison: 'vision' }); }
  if (!transcription) return json({ indisponible: true, raison: 'vide' });
  const criteres = liste(corps.criteres, 10).map((c) => texte(c, 200)).filter(Boolean);
  let propositions = [];
  if (criteres.length) {
    const reponse = await generer(env, [
      { role: 'system', content: 'Tu aides un professeur à positionner une copie de quatrième sur une grille. Pour chaque critère, propose un niveau parmi exactement : insuffisant, fragile, satisfaisant, tresbien, avec une raison d\'une phrase, littérale, sans tiret long. Réponds uniquement par un tableau JSON d\'objets {"critere": "...", "niveau": "...", "raison": "..."}, dans l\'ordre des critères. Le professeur décide ensuite.' },
      { role: 'user', content: `Critères :\n${criteres.map((c, i) => (i + 1) + '. ' + c).join('\n')}\n\nTranscription de la copie :\n${transcription.slice(0, 5000)}` },
    ], 900);
    propositions = liste(extraireJson(reponse), 10).map((p, i) => ({ critere: criteres[i] || texte(p && p.critere, 200), niveau: choix(String(p && p.niveau || '').toLowerCase().replace(/\s|-/g, ''), NIVEAUX, null), raison: nettoyer(texte(p && p.raison, 300)) }));
  }
  await compter(env, 'outils');
  return json({ transcription, propositions });
});
