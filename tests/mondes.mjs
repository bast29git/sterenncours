/**
 * Audit fonctionnel et visuel des 30 mondes 3D : chaque monde s'ouvre (serveur local, session élève),
 * démarre en mode cours, enchaîne tous ses défis (réponse 1 ou « Passer »), doit atteindre l'écran de fin
 * sans erreur JavaScript ; captures bureau et mobile après démarrage.
 *   npm run audit:mondes [-- filtre]      (serveur local attendu sur PORT, 8799 par défaut ; captures dans tests/mondes-sortie/)
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const BASE = process.env.BASE || `http://127.0.0.1:${process.env.PORT || '8799'}`; const S = 'tests/mondes-sortie/'; fs.mkdirSync(S, { recursive: true });
const filtre = process.argv[2] || '';
const mondes = fs.readdirSync('site/learning/games-3d').filter((f) => f.endsWith('.html') && f.includes(filtre)).sort();
const nav = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await nav.newContext({ viewport: { width: 1100, height: 700 } });
{ const e = await ctx.newPage(); await e.goto(BASE + '/', { waitUntil: 'networkidle' }); await e.fill('#code', process.env.CODE_ELEVE_TEST || 'sanka29'); await e.click('.entree-bouton'); await e.waitForFunction(() => !document.getElementById('portail') || document.getElementById('portail').hidden, null, { timeout: 15000 }); await e.close(); }
const resume = [];
for (const f of mondes) {
  const nom = f.replace('.html', ''); const page = await ctx.newPage(); const erreurs = []; const t0 = Date.now();
  page.on('pageerror', (e) => erreurs.push(e.message.slice(0, 160)));
  const ligne = { monde: nom, defis: 0, fin: false, legendes: 0, panneaux: 0, erreurs, ms: 0 };
  try {
    await page.goto(`${BASE}/learning/games-3d/${f}`, { waitUntil: 'load', timeout: 60000 });
    await page.waitForSelector('.ksh-play', { timeout: 40000 }); await page.waitForTimeout(1200);
    await page.evaluate(() => document.querySelector('.ksh-play').click());
    await page.waitForTimeout(5000);
    await page.screenshot({ path: `${S}${nom}.png` });
    ligne.panneaux = await page.evaluate(() => document.querySelectorAll('.mb-panneau, .ss-panel, [class*="panel"], [class*="panneau"]').length);
    ligne.legendes = await page.evaluate(() => { const s = window.__ksh3d && window.__ksh3d.scene; const noms = new Set(); if (s) s.traverse((x) => { const l = x.userData && x.userData.legende; if (l && l.nom) noms.add(l.nom); }); return noms.size; });
    // Les gestes communs : toucher la scène (légende), changer la qualité (Q), ouvrir et fermer la fiche (F, Échap).
    try {
      const c = await page.$('canvas'); if (c) { const bb = await c.boundingBox(); if (bb) await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); }
      await page.keyboard.press('q'); await page.waitForTimeout(400); await page.keyboard.press('q'); await page.waitForTimeout(400);
      await page.keyboard.press('f'); await page.waitForTimeout(800); await page.keyboard.press('Escape'); await page.waitForTimeout(300);
      const pause = await page.evaluate(() => { const p = document.querySelector('.ksh-pause'); return p && !p.hidden; });
      if (pause) { await page.evaluate(() => { const b = document.querySelector('.ksh-pause button, .ksh-pause .ksh-b'); if (b) b.click(); }); await page.waitForTimeout(300); }
    } catch (e) { erreurs.push('gestes : ' + e.message.slice(0, 80)); }
    // Enchaîner les défis : un qcm reçoit la réponse 1, un « toucher » ou un « vérifier » passe. Sans défis
    // (mondes à mission propre), on provoque la fin : la banque de la leçon s'ouvre, on la parcourt.
    let banqueProvoquee = false;
    for (let k = 0; k < 44; k += 1) {
      const etat = await page.evaluate(() => {
        const bq = document.querySelector('.ksh-banque');
        if (bq) { const suite = bq.querySelector('.ksh-banque-suite:not([hidden])'); if (suite) { suite.click(); return 'banque-suite'; } const opt = bq.querySelector('[data-c]:not(:disabled)'); if (opt) { opt.click(); return 'banque'; } return 'banque-attente'; }
        const b = document.querySelector('.ksh-defi:not([hidden])'); if (!b) return 'aucun';
        const suite = b.querySelector('[data-suite]'); if (suite) { suite.click(); return 'suite'; }
        const opt = b.querySelector('[data-k]'); if (opt) { opt.click(); return 'qcm'; }
        const passer = b.querySelector('[data-passer]'); if (passer) { passer.click(); return 'passer'; }
        const valider = b.querySelector('[data-valider]'); if (valider) { valider.click(); valider.click(); valider.click(); const p = b.querySelector('[data-passer]'); if (p) p.click(); return 'verifier'; }
        return 'inconnu';
      });
      if (etat === 'aucun') {
        if (banqueProvoquee) break;
        banqueProvoquee = true; ligne.mission = true;
        await page.evaluate(() => { if (window.__kshApi && window.__kshApi.win) window.__kshApi.win({ score: 100, stars: 2, title: 'Audit : fin provoquée' }); });
        await page.waitForTimeout(900); continue;
      }
      if (etat === 'qcm' || etat === 'passer' || etat === 'verifier') ligne.defis += 1;
      if (etat === 'banque') ligne.banque = (ligne.banque || 0) + 1;
      await page.waitForTimeout(700);
      if (await page.evaluate(() => { const f = document.querySelector('.ksh-fin'); return f && !f.hidden; })) { ligne.fin = true; break; }
    }
    if (!ligne.fin) ligne.fin = await page.evaluate(() => { const f = document.querySelector('.ksh-fin'); return !!(f && !f.hidden); });
  } catch (e) { erreurs.push('ÉCHEC ' + e.message.slice(0, 120)); }
  ligne.ms = Date.now() - t0;
  console.log(`${ligne.fin && !erreurs.length ? '✅' : '❌'} ${nom} : ${ligne.mission ? 'mission propre, ' : ''}${ligne.defis} défi(s), ${ligne.banque || 0} question(s) de banque, fin ${ligne.fin ? 'atteinte' : 'NON atteinte'}, ${ligne.legendes} légende(s), ${ligne.panneaux} panneau(x), ${Math.round(ligne.ms / 1000)} s${erreurs.length ? ' · ERREURS : ' + erreurs.join(' | ') : ''}`);
  resume.push(ligne); await page.close();
}
// Mobile : une capture par monde, après démarrage, pour le débordement et la lisibilité.
const ctxM = await nav.newContext({ viewport: { width: 390, height: 760 }, isMobile: true, hasTouch: true });
{ const e = await ctxM.newPage(); await e.goto(BASE + '/', { waitUntil: 'networkidle' }); await e.fill('#code', process.env.CODE_ELEVE_TEST || 'sanka29'); await e.click('.entree-bouton'); await e.waitForFunction(() => !document.getElementById('portail') || document.getElementById('portail').hidden, null, { timeout: 15000 }); await e.close(); }
for (const f of mondes) {
  const nom = f.replace('.html', ''); const page = await ctxM.newPage(); const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(e.message.slice(0, 120)));
  try {
    await page.goto(`${BASE}/learning/games-3d/${f}`, { waitUntil: 'load', timeout: 60000 });
    await page.waitForSelector('.ksh-play', { timeout: 40000 }); await page.waitForTimeout(800);
    await page.evaluate(() => document.querySelector('.ksh-play').click()); await page.waitForTimeout(4000);
    await page.screenshot({ path: `${S}${nom}-mobile.png` });
    const large = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    console.log(`${large || erreurs.length ? '❌' : '✅'} ${nom} mobile${large ? ' · DÉFILEMENT HORIZONTAL' : ''}${erreurs.length ? ' · ' + erreurs.join(' | ') : ''}`);
  } catch (e) { console.log(`❌ ${nom} mobile : ${e.message.slice(0, 100)}`); }
  await page.close();
}
fs.writeFileSync(S + 'resume.json', JSON.stringify(resume, null, 1));
await nav.close();
