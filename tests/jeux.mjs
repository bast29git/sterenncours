/**
 * D15, D27 : chaque jeu ouvert dans Chromium à 390 px de large : pas de défilement horizontal,
 * aucune erreur JavaScript, et une vérification axe-core des règles d'accessibilité sérieuses.
 *   npm run audit:jeux           (serveur local attendu sur PORT, 8799 par défaut)
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const RACINE = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BASE = process.env.BASE || `http://127.0.0.1:${process.env.PORT || '8799'}`;
const AXE = fs.readFileSync(path.join(RACINE, 'node_modules', 'axe-core', 'axe.min.js'), 'utf8');
const jeux = ['games-2d', 'games-3d'].flatMap((d) => fs.readdirSync(path.join(RACINE, 'site', 'learning', d)).filter((f) => f.endsWith('.html')).map((f) => `/learning/${d}/${f}`));
const seulement = process.argv[2];

const nav = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
let problemes = 0;
for (const url of jeux.filter((u) => !seulement || u.includes(seulement))) {
  const page = await ctx.newPage();
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(e.message.slice(0, 120)));
  try {
    await page.goto(BASE + url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(url.includes('3d') ? 3500 : 1200);
    const large = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    await page.addScriptTag({ content: AXE });
    const axe = await page.evaluate(async () => { const r = await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'], resultTypes: ['violations'] }); return r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => v.id + ' ×' + v.nodes.length); });
    const soucis = [];
    if (large) soucis.push('défilement horizontal');
    if (erreurs.length) soucis.push('erreurs JS : ' + erreurs.join(' | '));
    if (axe.length) soucis.push('axe : ' + axe.join(', '));
    console.log((soucis.length ? '❌ ' : '✅ ') + url.replace('/learning/', '') + (soucis.length ? ' → ' + soucis.join(' ; ') : ''));
    if (soucis.length) problemes += 1;
  } catch (e) { console.log('❌ ' + url + ' → ' + e.message.slice(0, 100)); problemes += 1; }
  await page.close();
}
await nav.close();
console.log(problemes ? `❌ ${problemes} jeu(x) à corriger` : '✅ tous les jeux passent à 390 px, sans erreur ni violation sérieuse');
process.exit(problemes ? 1 : 0);
