/**
 * A31 : validateurs partagés par les fonctions du serveur, au lieu de regex répétées.
 * Chaque fonction renvoie la valeur nettoyée, ou la valeur par défaut (null quand rien n'est donné).
 */
const TAILLE_CORPS_MAX = 65536;
/** B8, B9 : lit un corps JSON, borné à 64 Ko même sans content-length, et null quand il est illisible. */
export async function lireCorps(request, max = TAILLE_CORPS_MAX) {
  try {
    const brut = await request.text();
    if (brut.length > max) return null;
    if (!brut.trim()) return {};
    return JSON.parse(brut);
  } catch (e) { return null; }
}
/** B7 : caractères de contrôle retirés (sauf tabulation et retour à la ligne), espaces multiples regroupés en fin. */
const CONTROLES = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200D\uFEFF]/g;
export const propre = (v) => (v == null ? '' : String(v)).replace(CONTROLES, '');
export const texte = (v, max = 400) => propre(v).trim().slice(0, max);
/** Un texte multi-lignes : contrôles retirés, plus de deux lignes vides d'affilée jamais. */
export const paragraphe = (v, max = 2000) => propre(v).replace(/\r\n?/g, '\n').replace(/\n{3,}/g, '\n\n').trim().slice(0, max);
/** Vide au sens large : rien, ou seulement des espaces et des caractères invisibles. */
export const estVide = (v) => !propre(v).replace(/[\s\u00A0\u2000-\u200A\u202F\u205F\u3000]/g, '').length;
/** B6 : heure « HH:MM » et jour de semaine 1 à 7. */
export const heure = (v) => (/^([01]\d|2[0-3]):[0-5]\d$/.test(String(v || '')) ? String(v) : null);
export const jourSemaine = (v, defaut = null) => { const n = Number(v); return Number.isInteger(n) && n >= 1 && n <= 7 ? n : defaut; };
/** B11 : une date-heure ISO valide, renvoyée normalisée. */
export const dateHeureIso = (v) => { if (!v) return null; const d = new Date(String(v)); return Number.isNaN(d.getTime()) ? null : d.toISOString(); };
/** B10 : une clé de fiche « maths/L01/cours ». */
export const TYPES_FICHE = ['cours', 'revision', 'exercices', 'evaluation'];
export const cleFiche = (v) => (/^[a-z][a-z-]{1,30}\/[A-Z]?\d{1,2}\/(cours|revision|exercices|evaluation)$/.test(String(v || '')) ? String(v) : null);
/** Une liste de clés de leçons, dédoublonnée, bornée, sans entrée invalide. */
export const clesLecons = (v, max = 50) => [...new Set(liste(v, max).map(cleLecon).filter(Boolean))];
/** Absent (null, undefined, chaîne vide) : la valeur par défaut, jamais zéro. */
export const entier = (v, min, max, defaut = null) => {
  if (v === null || v === undefined || v === '') return defaut;
  const n = Number(v);
  if (!Number.isFinite(n)) return defaut;
  return Math.max(min, Math.min(max, Math.round(n)));
};
export const nombre = (v, min, max, defaut = null) => {
  if (v === null || v === undefined || v === '') return defaut;
  const n = Number(v);
  if (!Number.isFinite(n)) return defaut;
  return Math.max(min, Math.min(max, n));
};
export const choix = (v, liste, defaut = null) => (liste.indexOf(v) !== -1 ? v : defaut);
export const booleen = (v, defaut = false) => (typeof v === 'boolean' ? v : defaut);
/** Une clé de leçon telle que « maths/L01 » ou « histoire-geo/H2 ». */
export const cleLecon = (v) => (/^[a-z][a-z-]{1,30}\/[A-Z]?\d{1,2}$/.test(String(v || '')) ? String(v) : null);
export const matiere = (v) => (/^[a-z][a-z-]{1,30}$/.test(String(v || '')) ? String(v) : null);
export const ref = (v) => (/^[A-Z]?\d{1,2}$/.test(String(v || '')) ? String(v) : null);
export const identifiant = (v) => (/^[0-9a-f]{24}$/.test(String(v || '')) ? String(v) : null);
export const dateIso = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(String(v || '')) ? String(v) : null);
export const liste = (v, max = 50) => (Array.isArray(v) ? v.slice(0, max) : []);
