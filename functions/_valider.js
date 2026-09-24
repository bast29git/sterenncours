/**
 * A31 : validateurs partagés par les fonctions du serveur, au lieu de regex répétées.
 * Chaque fonction renvoie la valeur nettoyée, ou la valeur par défaut (null quand rien n'est donné).
 */
export async function lireCorps(request) {
  try { return await request.json(); } catch (e) { return null; }
}
export const texte = (v, max = 400) => (v == null ? '' : String(v)).trim().slice(0, max);
export const entier = (v, min, max, defaut = null) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return defaut;
  return Math.max(min, Math.min(max, Math.round(n)));
};
export const nombre = (v, min, max, defaut = null) => {
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
