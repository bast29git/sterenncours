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
// Le dossier /learning est réservé aux sessions ouvertes : on entre d'abord avec le code élève de test.
{
  const entree = await ctx.newPage();
  await entree.goto(BASE + '/', { waitUntil: 'networkidle' });
  await entree.fill('#code', process.env.CODE_ELEVE_TEST || 'sanka29'); await entree.click('.entree-bouton');
  await entree.waitForFunction(() => !document.getElementById('portail') || document.getElementById('portail').hidden, null, { timeout: 15000 });
  const test = await entree.goto(BASE + '/learning/shell.js');
  if (!test || test.status() !== 200) { console.log('❌ session élève impossible : /learning répond ' + (test ? test.status() : '?')); process.exit(1); }
  await entree.close();
}
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
    const jeuPresent = await page.$('.ksh-root, .ksh-hud, canvas, .qz-card, .lg2-card, [data-jeu]');
    const soucis = [];
    if (!jeuPresent) soucis.push('page sans jeu (redirection ?)');
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
