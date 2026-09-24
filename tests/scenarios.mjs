/**
 * Scénarios de bout en bout, joués dans Chromium contre un serveur local.
 * Chaque scénario lève une erreur s'il échoue ; le tout renvoie 0 ou 1.
 */
import { chromium } from 'playwright-core';

const ELEVE = process.env.CODE_ELEVE_TEST || 'sanka29';
const PROF = process.env.CODE_PROF_TEST || 'babas29';
const ok = (cond, msg) => { if (!cond) throw new Error('échec : ' + msg); };

async function ouvrir(nav, BASE, code, vp) {
  const ctx = await nav.newContext({ viewport: vp || { width: 1366, height: 900 } });
  const page = await ctx.newPage();
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(e.message));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.fill('#code', code); await page.click('.entree-bouton');
  await page.waitForFunction(() => !document.getElementById('portail') || document.getElementById('portail').hidden, null, { timeout: 15000 });
  await page.waitForTimeout(800);
  return { page, erreurs, ctx };
}
const aller = async (page, hash, attente = 1000) => { await page.evaluate((h) => { location.hash = h; }, hash); await page.waitForTimeout(attente); };
const api = (page, chemin, options) => page.evaluate(async ([c, o]) => { const r = await fetch('/api' + c, { credentials: 'same-origin', ...(o || {}), headers: { 'content-type': 'application/json' } }); return { statut: r.status, corps: await r.json().catch(() => ({})) }; }, [chemin, options]);

export const SCENARIOS = {
  async 'planning généré et réglages'(nav, BASE) {
    const { page, erreurs } = await ouvrir(nav, BASE, PROF);
    // L'année est générée si la base est vide (cas de l'intégration continue).
    const n = await page.evaluate(async () => (await (await fetch('/api/seances')).json()).seances.length);
    if (n === 0) {
      await page.evaluate(async () => {
        const r = window.PLANIFICATEUR.generer('2026-10-05', 37, { mercredi: { debut: '13:00', fin: '14:30' } });
        await fetch('/api/seances/lot', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ seances: r.seances }) });
      });
    }
    const apres = await page.evaluate(async () => (await (await fetch('/api/seances')).json()).seances.length);
    ok(apres >= 100, 'planning présent (' + apres + ')');
    await aller(page, '#/reglages');
    ok((await page.locator('.p-interrupteur').count()) >= 7, 'interrupteurs de réglages');
    const r = await api(page, '/reglages', { method: 'PUT', body: JSON.stringify({ cle: 'pauses', valeur: true }) });
    ok(r.statut === 200, 'réglage enregistré');
    ok(!erreurs.length, 'sans erreur JS : ' + erreurs.join(' | '));
  },
  async 'accès, verrous et évaluation servie par le serveur'(nav, BASE) {
    const prof = await ouvrir(nav, BASE, PROF);
    await api(prof.page, '/acces', { method: 'PUT', body: JSON.stringify({ cle: 'maths/L01/evaluation', etat: null }) });
    const eleve = await ouvrir(nav, BASE, ELEVE);
    const ferme = await eleve.page.evaluate(async () => (await fetch('/data/evaluations/maths/L01.js')).status);
    ok(ferme === 403, 'évaluation fermée : 403 (' + ferme + ')');
    await api(prof.page, '/acces', { method: 'PUT', body: JSON.stringify({ cle: 'maths/L01/evaluation', etat: true }) });
    const ouvert = await eleve.page.evaluate(async () => (await fetch('/data/evaluations/maths/L01.js')).status);
    ok(ouvert === 200, 'évaluation ouverte : 200');
    await eleve.page.reload({ waitUntil: 'networkidle' }); await eleve.page.waitForTimeout(1500);
    await aller(eleve.page, '#/lecon/maths/L01/evaluation', 2000);
    ok((await eleve.page.locator('.e-eval-sujet').count()) === 1, 'sujet affiché');
    await api(prof.page, '/acces', { method: 'PUT', body: JSON.stringify({ cle: 'maths/L01/evaluation', etat: null }) });
    ok(!eleve.erreurs.length && !prof.erreurs.length, 'sans erreur JS');
  },
  async 'fiche en diapositives et cahier'(nav, BASE) {
    const { page, erreurs } = await ouvrir(nav, BASE, ELEVE);
    await aller(page, '#/lecon/maths/L01/cours', 1500);
    ok((await page.locator('.e-diapo-etapes button').count()) > 5, 'étapes de la fiche');
    await page.click('#e-diapo-suiv'); await page.waitForTimeout(600);
    ok((await page.locator('#e-diapo-compte').innerText()).startsWith('2'), 'diapositive suivante');
    const cahier = await page.evaluate(async () => (await fetch('/cahiers/maths/L01.html')).status);
    ok(cahier === 200, 'cahier servi');
    ok(!erreurs.length, 'sans erreur JS : ' + erreurs.join(' | '));
  },
  async 'série interactive et étoiles'(nav, BASE) {
    const { page, erreurs } = await ouvrir(nav, BASE, ELEVE);
    await aller(page, '#/exos/maths/L01', 2000);
    ok((await page.locator('.e-exo-question').count()) === 1, 'question affichée');
    for (let i = 0; i < 25; i += 1) {
      if (await page.locator('#e-refaire').count()) break;
      const b = page.locator('.e-exo-choix button').first();
      if (await b.count()) await b.click(); else { await page.fill('#e-saisie', 'x'); await page.locator('#e-form-saisie button').click(); }
      await page.waitForTimeout(150);
      const suite = page.locator('#e-suivant').first();
      if (await suite.count()) await suite.click();
      await page.waitForTimeout(150);
    }
    ok((await page.locator('#e-refaire').count()) === 1, 'bilan de série');
    ok(!erreurs.length, 'sans erreur JS : ' + erreurs.join(' | '));
  },
  async 'messagerie : envoi, fil, réaction'(nav, BASE) {
    const eleve = await ouvrir(nav, BASE, ELEVE);
    await aller(eleve.page, '#/messages', 1500);
    await eleve.page.fill('#e-texte', 'Message de test **gras**');
    await eleve.page.click('#e-envoi'); await eleve.page.waitForTimeout(1500);
    const dernier = await eleve.page.evaluate(async () => { const m = (await (await fetch('/api/messages')).json()).messages; return m[m.length - 1]; });
    ok(dernier && dernier.texte.includes('Message de test'), 'message enregistré');
    const r = await api(eleve.page, `/messages/${dernier.id}/reaction`, { method: 'POST', body: JSON.stringify({ emoji: '👍' }) });
    ok(r.statut === 200 && r.corps.ajoutee, 'réaction ajoutée');
    ok(!eleve.erreurs.length, 'sans erreur JS');
  },
  async 'félicitation et célébration'(nav, BASE) {
    const eleve = await ouvrir(nav, BASE, ELEVE);
    const prof = await ouvrir(nav, BASE, PROF);
    const r = await api(prof.page, '/felicitations', { method: 'POST', body: JSON.stringify({ texte: 'Test : devoir rendu complet.', matiere: 'maths', ref: 'L01' }) });
    ok(r.statut === 200, 'félicitation créée');
    await eleve.page.reload({ waitUntil: 'networkidle' }); await eleve.page.waitForTimeout(2500);
    ok((await eleve.page.locator('.e-mot-vedette').count()) === 1, 'mot affiché sur l\'accueil');
    ok(!eleve.erreurs.length && !prof.erreurs.length, 'sans erreur JS');
  },
  async 'choix de leçon et semaine'(nav, BASE) {
    const { page, erreurs } = await ouvrir(nav, BASE, ELEVE);
    await aller(page, '#/choix', 1200);
    ok((await page.locator('.e-choix-carte').count()) > 0, 'séances à choix listées');
    await aller(page, '#/calendrier/2026-10-05', 1500);
    ok((await page.locator('[data-absence]').count()) > 0, 'boutons d\'absence');
    ok(!erreurs.length, 'sans erreur JS : ' + erreurs.join(' | '));
  },
  async 'modules et visite'(nav, BASE) {
    const { page, erreurs } = await ouvrir(nav, BASE, ELEVE);
    await aller(page, '#/decouverte', 1500);
    ok((await page.locator('.e-horaire li').count()) === 6, 'programme de la première séance');
    await aller(page, '#/visite', 2500);
    ok((await page.locator('.e-visite-carte').count()) === 1, 'visite lancée');
    await page.keyboard.press('Escape'); await page.waitForTimeout(500);
    ok(!erreurs.length, 'sans erreur JS : ' + erreurs.join(' | '));
  },
  async 'tutrice : réponse ou repli, calculatrice'(nav, BASE) {
    const { page, erreurs } = await ouvrir(nav, BASE, ELEVE);
    await aller(page, '#/lecon/maths/L01/cours', 1500);
    await page.click('#e-opale-bouton'); await page.waitForTimeout(400);
    await page.click('.e-opale-puce >> nth=0'); await page.waitForTimeout(2500);
    ok((await page.locator('.e-opale-msg.opale').count()) >= 2, 'Opale a répondu ou proposé un repli');
    const calc = await page.evaluate(() => window.OPALE.calculer('(3+5)×2^2/4'));
    ok(calc === '8', 'calculatrice : ' + calc);
    ok(!erreurs.length, 'sans erreur JS : ' + erreurs.join(' | '));
  },
  async 'confort et panneau'(nav, BASE) {
    const { page, erreurs } = await ouvrir(nav, BASE, ELEVE);
    await page.click('#e-btn-confort'); await page.waitForTimeout(600);
    ok(await page.evaluate(() => { const p = document.querySelector('.cf-panel'); return p && !p.hidden; }), 'panneau de confort ouvert');
    ok(!erreurs.length, 'sans erreur JS');
  },
  async 'sécurité : débit et taille'(nav, BASE) {
    const { page } = await ouvrir(nav, BASE, ELEVE);
    const gros = await page.evaluate(async () => (await fetch('/api/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'content-length': '40000' }, body: JSON.stringify({ texte: 'x'.repeat(39000) }) })).status);
    ok(gros === 413 || gros === 400, 'corps trop gros refusé (' + gros + ')');
    const evalProf = await page.evaluate(async () => (await fetch('/api/reglages', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: '{"cle":"pauses","valeur":true}' })).status);
    ok(evalProf === 403, 'écriture professeur refusée à l\'élève (' + evalProf + ')');
  },
};

export async function lancerScenarios(BASE) {
  const nav = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--no-sandbox'] });
  let echecs = 0;
  for (const [nom, sc] of Object.entries(SCENARIOS)) {
    const t0 = Date.now();
    try { await sc(nav, BASE); console.log(`✅ ${nom} (${Math.round((Date.now() - t0) / 100) / 10} s)`); }
    catch (e) { echecs += 1; console.log(`❌ ${nom} : ${e.message}`); }
  }
  await nav.close();
  console.log(echecs ? `❌ ${echecs} scénario(s) en échec` : '✅ tous les scénarios passent');
  return echecs ? 1 : 0;
}
