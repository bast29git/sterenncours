/**
 * A59 : non-régression visuelle. Chaque écran clé est capturé, puis comparé au pixel près à sa
 * capture de référence (tests/references/*.png). Au premier passage, ou avec --reference, les
 * captures deviennent la référence. Les différences sont écrites dans tests/visuel-sortie/.
 *   node tests/visuel.mjs            (serveur local attendu sur PORT, 8799 par défaut)
 *   node tests/visuel.mjs --reference
 * Seuil : 1,5 % de pixels différents (écart de plus de 40 sur un canal), pour absorber le rendu des polices.
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const RACINE = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BASE = process.env.BASE || `http://127.0.0.1:${process.env.PORT || '8799'}`;
const REFERENCES = path.join(RACINE, 'tests', 'references');
const SORTIE = path.join(RACINE, 'tests', 'visuel-sortie');
const REFAIRE = process.argv.includes('--reference');
const SEUIL = 0.015;
fs.mkdirSync(REFERENCES, { recursive: true }); fs.mkdirSync(SORTIE, { recursive: true });

const ECRANS = [
  { nom: 'portail', role: null, hash: null },
  { nom: 'eleve-accueil', role: 'eleve', hash: '#/hub' },
  { nom: 'eleve-matieres', role: 'eleve', hash: '#/matieres' },
  { nom: 'eleve-fiche', role: 'eleve', hash: '#/lecon/maths/L01/cours' },
  { nom: 'eleve-serie', role: 'eleve', hash: '#/exos/maths/L01' },
  { nom: 'eleve-semaine', role: 'eleve', hash: '#/calendrier' },
  { nom: 'eleve-reussites', role: 'eleve', hash: '#/reussites' },
  { nom: 'eleve-jeux', role: 'eleve', hash: '#/jeux' },
  { nom: 'prof-accueil', role: 'prof', hash: '#/' },
  { nom: 'prof-suivi', role: 'prof', hash: '#/suivi' },
  { nom: 'prof-lecon', role: 'prof', hash: '#/lecon/maths/L01/cours' },
  { nom: 'prof-reglages', role: 'prof', hash: '#/reglages' },
];
const CODES = { eleve: process.env.CODE_ELEVE_TEST || 'sanka29', prof: process.env.CODE_PROF_TEST || 'babas29' };

const nav = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--no-sandbox', '--font-render-hinting=none'] });
const contextes = {};
async function pageDe(role) {
  if (contextes[role]) return contextes[role];
  const ctx = await nav.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: 'light', locale: 'fr-FR', timezoneId: 'Europe/Paris' });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  if (role) {
    await page.fill('#code', CODES[role]); await page.click('.entree-bouton');
    await page.waitForFunction(() => !document.getElementById('portail') || document.getElementById('portail').hidden, null, { timeout: 15000 });
    await page.waitForTimeout(800);
  }
  contextes[role || 'aucun'] = page; return page;
}
/* Ce qui change à chaque passage (dates, heures, compteurs) est neutralisé pour comparer ce qui compte : la mise en page. */
const NEUTRALISER = `
  *, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }
  body.corps-eleve, body.corps-eleve::before { background-image: none !important; }
  time, .e-jour-nom b, #e-heure, .e-diapo-temps, .p-kpis .v, .e-etoiles-compte span, .ksh-timer { visibility: hidden !important; }
`;
async function capturer(e) {
  const page = await pageDe(e.role);
  if (e.hash) { await page.evaluate((h) => { location.hash = h; }, e.hash); await page.waitForTimeout(1800); }
  await page.addStyleTag({ content: NEUTRALISER });
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(200);
  return page.screenshot({ fullPage: false, animations: 'disabled' });
}
async function comparer(a, b) {
  const [ia, ib] = await Promise.all([sharp(a).ensureAlpha().raw().toBuffer({ resolveWithObject: true }), sharp(b).ensureAlpha().raw().toBuffer({ resolveWithObject: true })]);
  if (ia.info.width !== ib.info.width || ia.info.height !== ib.info.height) return { part: 1, diff: null };
  const n = ia.info.width * ia.info.height; const diff = Buffer.alloc(n * 4); let differents = 0;
  for (let i = 0; i < n; i += 1) {
    const o = i * 4; const d = Math.max(Math.abs(ia.data[o] - ib.data[o]), Math.abs(ia.data[o + 1] - ib.data[o + 1]), Math.abs(ia.data[o + 2] - ib.data[o + 2]));
    if (d > 40) { differents += 1; diff[o] = 230; diff[o + 1] = 30; diff[o + 2] = 30; diff[o + 3] = 255; } else { const g = Math.round(ib.data[o] * 0.3 + 170); diff[o] = g; diff[o + 1] = g; diff[o + 2] = g; diff[o + 3] = 255; }
  }
  return { part: differents / n, diff: await sharp(diff, { raw: { width: ia.info.width, height: ia.info.height, channels: 4 } }).png().toBuffer() };
}
let problemes = 0; let nouvelles = 0;
for (const e of ECRANS) {
  const ref = path.join(REFERENCES, e.nom + '.png');
  let capture;
  try { capture = await capturer(e); } catch (err) { console.log('❌ ' + e.nom + ' : capture impossible : ' + err.message.slice(0, 80)); problemes += 1; continue; }
  if (REFAIRE || !fs.existsSync(ref)) { fs.writeFileSync(ref, capture); nouvelles += 1; console.log('📸 ' + e.nom + ' : référence ' + (REFAIRE ? 'refaite' : 'créée')); continue; }
  const r = await comparer(capture, fs.readFileSync(ref));
  if (r.part > SEUIL) { problemes += 1; fs.writeFileSync(path.join(SORTIE, e.nom + '.png'), capture); if (r.diff) fs.writeFileSync(path.join(SORTIE, e.nom + '-diff.png'), r.diff); console.log(`❌ ${e.nom} : ${(r.part * 100).toFixed(2)} % de pixels différents (seuil ${SEUIL * 100} %)`); }
  else console.log(`✅ ${e.nom} : ${(r.part * 100).toFixed(2)} %`);
}
await nav.close();
console.log(problemes ? `❌ ${problemes} écran(s) ont changé : voir tests/visuel-sortie/ (captures et différences en rouge)` : nouvelles ? `✅ ${nouvelles} référence(s) enregistrée(s)` : '✅ aucun écran n\'a changé');
process.exit(problemes ? 1 : 0);
