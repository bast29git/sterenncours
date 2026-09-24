/**
 * POST /api/tuteur : Opale, la tutrice de l'espace de Sterenn.
 *
 * Elle guide sans donner les réponses. Elle connaît l'application, le
 * programme (functions/_programme.js, généré au build) et la fiche ouverte,
 * que le navigateur décrit dans `contexte`. Deux garde-fous après la
 * génération : la réponse attendue de l'exercice en cours ne doit pas
 * apparaître dans sa réponse, et un second passage du modèle vérifie qu'elle
 * n'a pas livré un résultat final. Sans liaison Workers AI, la fonction
 * répond `indisponible: true` et l'écran propose le plan de la fiche et le
 * message au professeur.
 */
import { json, erreur, gerer, exigerSession } from '../_commun.js';
import { PROGRAMME } from '../_programme.js';
import { lireReglages } from './reglages.js';

const MODELE = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const MODELE_CONTROLE = '@cf/meta/llama-3.1-8b-instruct-fast';
const QUOTA_JOUR = 200;

const MODES = {
  cours: 'Sterenn lit une fiche de cours. Tu peux expliquer la notion avec tes mots, donner un exemple différent de ceux de la fiche, reformuler une définition.',
  revision: 'Sterenn lit une fiche de révision. Tu aides à mémoriser : mots-clés, moyens mnémotechniques littéraux, auto-questions.',
  exercices: 'Sterenn fait des exercices. Tu ne donnes JAMAIS le résultat, ni un calcul complet, ni une phrase à recopier. Tu donnes une seule piste à la fois : quelle règle du cours relire, quelle est la première étape, quelle question se poser. Tu termines par une question qui la fait avancer.',
  evaluation: 'Sterenn est en évaluation. Tu n\'expliques pas la notion. Tu rappelles seulement comment lire une consigne, gérer son temps, vérifier son travail. Tu dis clairement que pendant une évaluation tu ne peux pas aider sur le contenu.',
  jeux: 'Sterenn est dans les mondes 3D et les jeux. Tu expliques comment jouer, à quoi sert le jeu, ce qu\'il fait apprendre, et tu encourages.',
  messages: 'Sterenn est dans la messagerie avec son professeur Bastien. Tu peux l\'aider à formuler une question claire, sans l\'écrire à sa place.',
  reussites: 'Sterenn regarde ses réussites et ses étoiles. Tu expliques comment on gagne des étoiles : une fiche terminée vaut 1 étoile, une série d\'exercices réussie à 70 % vaut 1 étoile, un monde 3D terminé avec au moins deux étoiles vaut 1 étoile, une leçon validée par le professeur vaut 3 étoiles.',
  autre: 'Sterenn navigue dans l\'application. Tu l\'aides à s\'orienter : Aujourd\'hui, Mes matières, Jeux, Messages, Mes réussites.',
};

function systeme(contexte, reglages) {
  const mode = MODES[contexte.mode] ? contexte.mode : 'autre';
  const programme = PROGRAMME.map((m) =>
    `${m.nom} : ${m.lecons.map((l) => l.ref + ' ' + l.titre).join(' ; ')}`).join('\n');
  const fiche = contexte.titre
    ? `\nFiche ouverte : ${contexte.matiere || ''} ${contexte.ref || ''} « ${contexte.titre} ».`
      + (contexte.resume ? `\nRésumé : ${contexte.resume}` : '')
      + (contexte.objectifs && contexte.objectifs.length ? `\nObjectifs : ${contexte.objectifs.slice(0, 8).join(' | ')}` : '')
      + (contexte.plan && contexte.plan.length ? `\nPlan : ${contexte.plan.slice(0, 12).join(' | ')}` : '')
    : '';
  const question = contexte.question ? `\nQuestion d'exercice en cours : « ${contexte.question} ». Tu n'y réponds pas, tu aides à la résoudre.` : '';
  return [
    'Tu es Opale, la tutrice de l\'espace de cours Opaline. Tu accompagnes Sterenn, élève de 4e, dont le professeur est Bastien.',
    'Règles absolues :',
    '1. Tu ne donnes jamais la réponse finale d\'un exercice, d\'une question ou d\'une évaluation : ni résultat numérique, ni traduction complète, ni phrase à recopier, ni texte à rendre. Tu donnes une piste, une méthode, une question, un rappel de cours ou un exemple différent.',
    '2. Tu tutoies Sterenn. Phrases courtes. Une idée par phrase. Langage littéral : pas d\'ironie, pas de métaphore, pas de sous-entendu. Ton calme, direct, encourageant sans excès.',
    '3. Tu réponds en français, en 120 mots au plus. Pas de titres. Au plus quatre points dans une liste. Tu n\'utilises jamais le tiret long ni le tiret demi-cadratin.',
    '4. Tu ne parles jamais de diagnostic, de trouble ou de profil. Tu parles de méthodes et de choix.',
    '5. Si la question sort du travail scolaire, tu réponds en une phrase et tu reviens au travail.',
    '6. Tu connais l\'application : Aujourd\'hui (ce qu\'on fait), Mes matières (parcours par matière, quatre fiches par leçon : Cours, Révision, Exercices, et la grille d\'évaluation), M\'entraîner (séries de questions interactives), Jeux (mondes 3D et jeux 2D liés aux leçons), Messages (échanges avec Bastien, dépôt de photos de devoirs), Mes réussites (étoiles et paliers). Sterenn a cours trois fois par semaine avec Bastien, lundi, mercredi et vendredi de 13 h à 14 h 30.',
    '7. Le programme de 4e couvert par Opaline :',
    programme,
    'Situation : ' + MODES[mode] + fiche + question,
    reglages.calculatrice && mode !== 'evaluation' && !(mode === 'exercices' && contexte.matiere === 'maths')
      ? 'Une calculatrice est disponible dans ton panneau, onglet Calculatrice.'
      : 'La calculatrice est coupée ici : Sterenn calcule à la main, tu peux rappeler une méthode de calcul.',
  ].join('\n');
}

const normaliser = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

/** La réponse attendue de l'exercice en cours ne doit pas apparaître dans le texte. */
function contientReponse(texte, attendues) {
  const t = ' ' + normaliser(texte) + ' ';
  return (attendues || []).some((a) => {
    const n = normaliser(a);
    if (!n || n.length < 2) return false;
    if (/^[0-9 ,.-]+$/.test(n) && n.replace(/\s/g, '').length <= 1) return false;
    return t.includes(' ' + n + ' ');
  });
}

async function quotaAtteint(env) {
  try {
    const cle = 'tuteur:' + new Date().toISOString().slice(0, 10);
    const n = Number(await env.SESSIONS.get(cle)) || 0;
    if (n >= QUOTA_JOUR) return true;
    await env.SESSIONS.put(cle, String(n + 1), { expirationTtl: 60 * 60 * 26 });
  } catch (e) { /* sans KV : pas de quota */ }
  return false;
}

const PISTE_GENERIQUE = 'Je ne peux pas te donner ce résultat : c\'est à toi de le trouver. Relis la règle du cours qui correspond à cette question, écris la première étape seule, puis vérifie ton unité ou ton signe. Quelle est la première chose que tu sais déjà ?';

export const onRequestPost = gerer(async (context) => {
  const session = await exigerSession(context);
  const { env } = context;

  let corps;
  try { corps = await context.request.json(); } catch (e) { return erreur('Requête invalide.'); }
  const texte = String(corps && corps.question || '').trim().slice(0, 600);
  if (!texte) return erreur('Écris une question.');
  const contexte = (corps && typeof corps.contexte === 'object' && corps.contexte) || {};
  const historique = Array.isArray(corps.historique) ? corps.historique.slice(-8) : [];

  const reglages = await lireReglages(env.DB);
  if (session.role === 'eleve' && !reglages.tuteur) return erreur('Opale est en pause pour le moment.', 403);
  if (!env.AI) return json({ indisponible: true });
  if (await quotaAtteint(env)) return json({ indisponible: true, raison: 'quota' });

  const messages = [{ role: 'system', content: systeme(contexte, reglages) }];
  for (const h of historique) {
    if (!h || (h.role !== 'user' && h.role !== 'assistant')) continue;
    messages.push({ role: h.role, content: String(h.content || '').slice(0, 800) });
  }
  messages.push({ role: 'user', content: texte });

  let reponse = '';
  try {
    const r = await env.AI.run(MODELE, { messages, max_tokens: 380, temperature: 0.4 });
    reponse = String((r && (r.response || r.result && r.result.response)) || '').trim();
  } catch (e) {
    return json({ indisponible: true, raison: 'modele' });
  }
  if (!reponse) return json({ indisponible: true, raison: 'vide' });
  reponse = reponse.replace(/[–—]/g, ':');

  // Garde-fous : jamais la réponse de l'exercice en cours, ni un résultat final.
  let controle = 'aucun';
  const enTravail = contexte.mode === 'exercices' || contexte.mode === 'evaluation';
  if (enTravail && contientReponse(reponse, contexte.attendues)) {
    reponse = PISTE_GENERIQUE; controle = 'reponse-retiree';
  } else if (enTravail) {
    try {
      const v = await env.AI.run(MODELE_CONTROLE, {
        messages: [
          { role: 'system', content: 'Tu es un contrôleur. On te donne la question d\'un exercice de collège et la réponse d\'une tutrice. Réponds uniquement OUI si la tutrice livre le résultat final (nombre, mot, phrase ou traduction qui constitue la réponse attendue). Réponds uniquement NON si elle donne seulement une méthode, une piste ou une question.' },
          { role: 'user', content: `Question : ${contexte.question || texte}\nRéponse de la tutrice : ${reponse}` },
        ],
        max_tokens: 4, temperature: 0,
      });
      const verdict = String((v && v.response) || '').trim().toUpperCase();
      if (verdict.startsWith('OUI')) { reponse = PISTE_GENERIQUE; controle = 'resultat-retire'; } else controle = 'verifie';
    } catch (e) { controle = 'non-verifie'; }
  }

  return json({ reponse, controle, modele: MODELE });
});
