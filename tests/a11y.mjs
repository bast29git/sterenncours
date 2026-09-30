/**
 * F199 : audit d'accessibilité des écrans clés, avec axe-core (règles WCAG 2 A et AA).
 *   npm run audit:a11y            (serveur local attendu sur PORT, 8799 par défaut)
 * Un manquement sérieux ou critique fait sortir en erreur ; les autres sont listés.
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const RACINE = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BASE = process.env.BASE || `http://127.0.0.1:${process.env.PORT || '8799'}`;
const AXE = fs.readFileSync(path.join(RACINE, 'node_modules', 'axe-core', 'axe.min.js'), 'utf8');
const CODES = { eleve: process.env.CODE_ELEVE_TEST || 'sanka29', prof: process.env.CODE_PROF_TEST || 'babas29' };
const ECRANS = [
  ['eleve', '#/hub'], ['eleve', '#/matieres'], ['eleve', '#/matiere/maths'], ['eleve', '#/lecon/maths/L01/cours'], ['eleve', '#/calendrier'],
  ['eleve', '#/jeux'], ['eleve', '#/messages'], ['eleve', '#/reussites'], ['eleve', '#/compagnon'], ['eleve', '#/aide'],
  ['prof', '#/'], ['prof', '#/suivi'], ['prof', '#/messages'], ['prof', '#/reglages'], ['prof', '#/acces'], ['prof', '#/journal'],
];

const nav = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--no-sandbox'] });
const contextes = {};
async function pageDe(role) {
  if (!contextes[role]) {
    const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.fill('#code', CODES[role]); await page.click('.entree-bouton');
    await page.waitForFunction(() => !document.getElementById('portail') || document.getElementById('portail').hidden, null, { timeout: 15000 });
    contextes[role] = page;
  }
  return contextes[role];
}
let serieux = 0; let mineurs = 0;
for (const [role, hash] of ECRANS) {
  const page = await pageDe(role);
  await page.evaluate((h) => { location.hash = h; }, hash);
  await page.waitForTimeout(hash.includes('journal') || hash.includes('messages') ? 3000 : 1500);
  await page.addScriptTag({ content: AXE });
  const r = await page.evaluate(async () => {
    const res = await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'best-practice'], resultTypes: ['violations'] });
    return res.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, cibles: v.nodes.slice(0, 3).map((x) => x.target.join(' ')) }));
  });
  const graves = r.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  const autres = r.filter((v) => v.impact !== 'serious' && v.impact !== 'critical');
  serieux += graves.length; mineurs += autres.length;
  console.log(`${graves.length ? '❌' : '✅'} ${role} ${hash}${graves.length ? ' : ' + graves.map((v) => `${v.id} (${v.impact}) ×${v.n} ${v.cibles.join(' ; ')}`).join(' | ') : ''}${autres.length ? ` · ${autres.length} remarque(s) mineure(s) : ${autres.map((v) => v.id).join(', ')}` : ''}`);
}
await nav.close();
console.log(serieux ? `❌ ${serieux} manquement(s) sérieux` : `✅ aucun manquement sérieux (${mineurs} remarque(s) mineure(s))`);
process.exit(serieux ? 1 : 0);
