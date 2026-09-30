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
        for (let i = 0; i < r.seances.length; i += 50) {
          const rep = await fetch('/api/seances/lot', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ seances: r.seances.slice(i, i + 50) }) });
          if (!rep.ok) throw new Error('lot refusé : ' + rep.status);
        }
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
    // La fiche reprend là où elle a été laissée (profil) : on compare au compteur de départ.
    let depart = parseInt(await page.locator('#e-diapo-compte').innerText(), 10) || 1;
    // Si la fiche a été laissée sur la dernière diapositive, « Suivant » la termine : on recule d'abord.
    const total = parseInt((await page.locator('#e-diapo-compte').innerText()).replace(/^\d+\s+sur\s+/, ''), 10) || 99;
    if (depart >= total) { await page.click('#e-diapo-prec'); await page.waitForTimeout(400); depart = parseInt(await page.locator('#e-diapo-compte').innerText(), 10) || 1; }
    await page.click('#e-diapo-suiv'); await page.waitForTimeout(600);
    ok((await page.locator('#e-diapo-compte').innerText()).startsWith(String(depart + 1)), 'diapositive suivante');
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
    ok(!eleve.erreurs.length, 'sans erreur JS : ' + eleve.erreurs.join(' | '));
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
    ok(!erreurs.length, 'sans erreur JS : ' + erreurs.join(' | '));
  },
  async 'contrat des API : un corps invalide répond 400 en français avec un code'(nav, BASE) {
    const { page } = await ouvrir(nav, BASE, PROF);
    const cas = [
      ['/suivi', 'PUT', { matiere: 'maths' }], ['/acces', 'PUT', { cle: 'n importe quoi' }], ['/reglages', 'PUT', { cle: 'inconnu', valeur: true }],
      ['/profil', 'PUT', { cle: 'bad key' }], ['/messages', 'POST', { texte: '' }], ['/seances', 'POST', { date: 'hier' }],
      ['/felicitations', 'POST', { texte: '' }], ['/usage', 'POST', { cle: 'inconnu' }], ['/codes', 'PUT', { role: 'x' }], ['/erreur', 'POST', { message: '' }],
    ];
    for (const [chemin, method, corps] of cas) {
      const r = await api(page, chemin, { method, body: JSON.stringify(corps) });
      ok(r.statut === 400, `${method} ${chemin} → 400 attendu (${r.statut})`);
      ok(typeof r.corps.erreur === 'string' && /[a-zéèàç]/i.test(r.corps.erreur), `${chemin} : message en français`);
      ok(typeof r.corps.code === 'string' && r.corps.code.length, `${chemin} : code d'erreur`);
    }
    const inconnu = await api(page, '/seances/000000000000000000000000', { method: 'PATCH', body: '{"statut":"faite"}' });
    ok(inconnu.statut === 404 || inconnu.statut === 400, 'séance inconnue : 404');
    const journal = await api(page, '/journal');
    ok(journal.statut === 200 && Array.isArray(journal.corps.journal), 'journal d\'audit lisible');
    const sante = await api(page, '/moi');
    ok(sante.statut === 200 && sante.corps.sante && sante.corps.sante.tables, 'page santé : tailles des tables');
    // B14, B15, B36, B187, B188, B51, B67 : méthode refusée, adresse inconnue, corps non JSON, santé, version, sessions, pagination.
    const methode = await api(page, '/etat', { method: 'DELETE' });
    ok(methode.statut === 405 && methode.corps.code === 'methode', 'méthode non permise : 405 en JSON');
    const inconnue = await api(page, '/nexistepas');
    ok(inconnue.statut === 404 && inconnue.corps.code === 'introuvable', 'adresse d\'API inconnue : 404 en JSON (' + inconnue.statut + ')');
    const texteBrut = await page.evaluate(async () => (await fetch('/api/messages', { method: 'POST', headers: { 'content-type': 'text/plain' }, body: 'bonjour' })).status);
    ok(texteBrut === 415, 'corps non JSON refusé : 415 (' + texteBrut + ')');
    const controle = await api(page, '/sante');
    ok(controle.statut === 200 && controle.corps.ok === true && Array.isArray(controle.corps.controles), 'santé : base, sessions et fichiers reliés');
    const version = await api(page, '/version');
    ok(version.statut === 200 && typeof version.corps.version === 'string' && version.corps.deploye_le, 'version et date de déploiement');
    const sessions = await api(page, '/sessions');
    ok(sessions.statut === 200 && sessions.corps.sessions.some((x) => x.moi), 'sessions ouvertes, la mienne repérée');
    const pageMsg = await api(page, '/messages?limite=1');
    ok(pageMsg.statut === 200 && pageMsg.corps.messages.length <= 1 && typeof pageMsg.corps.suite === 'boolean', 'messages paginés');
    const nouveaux = await api(page, '/messages/nouveaux');
    ok(nouveaux.statut === 200 && typeof nouveaux.corps.nonLus === 'number', 'sonde légère des nouveautés');
    const csv = await page.evaluate(async () => { const r = await fetch('/api/suivi?export=csv'); return { statut: r.status, type: r.headers.get('content-type') }; });
    ok(csv.statut === 200 && /text\/csv/.test(csv.type), 'export CSV du suivi');
  },
  async 'sécurité : débit et taille'(nav, BASE) {
    const { page } = await ouvrir(nav, BASE, ELEVE);
    const gros = await page.evaluate(async () => (await fetch('/api/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'content-length': '40000' }, body: JSON.stringify({ texte: 'x'.repeat(39000) }) })).status);
    ok(gros === 413 || gros === 400, 'corps trop gros refusé (' + gros + ')');
    const evalProf = await page.evaluate(async () => (await fetch('/api/reglages', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: '{"cle":"pauses","valeur":true}' })).status);
    ok(evalProf === 403, 'écriture professeur refusée à l\'élève (' + evalProf + ')');
    // B72 : le même message envoyé deux fois en dix secondes est refusé (409).
    const texte = 'Doublon de test ' + Date.now();
    const un = await api(page, '/messages', { method: 'POST', body: JSON.stringify({ texte }) });
    const deux = await api(page, '/messages', { method: 'POST', body: JSON.stringify({ texte }) });
    ok(un.statut === 201 && deux.statut === 409, 'double envoi refusé (' + un.statut + ', ' + deux.statut + ')');
    // B16 à B20 : en-têtes de sécurité présents sur une réponse réservée.
    const entetes = await page.evaluate(async () => { const r = await fetch('/api/moi'); return { hsts: r.headers.get('strict-transport-security'), coop: r.headers.get('cross-origin-opener-policy'), robots: r.headers.get('x-robots-tag') }; });
    ok(entetes.hsts && entetes.coop === 'same-origin' && /noindex/.test(entetes.robots || ''), 'en-têtes de sécurité');
  },
};

SCENARIOS['pilotage : sessions, santé, journal filtré'] = async function (nav, BASE) {
  const { page, erreurs } = await ouvrir(nav, BASE, PROF);
  await aller(page, '#/reglages', 2500);
  ok((await page.locator('#r-sessions li').count()) >= 1, 'sessions ouvertes listées');
  ok((await page.locator('#c-fermer').count()) === 1, 'option de fermeture des sessions');
  await aller(page, '#/journal', 3500);
  const controles = await page.locator('.p-fiche-carte .p-etat').allTextContents();
  ok(controles.some((t) => /base/.test(t)) && controles.some((t) => /sessions/.test(t)), 'santé : liaisons sollicitées');
  ok((await page.locator('#j-filtre').count()) === 1, 'journal filtrable');
  ok((await page.locator('[data-mode-opale]').count()) >= 5, 'questions d\'Opale filtrables par mode');
  ok(!erreurs.length, 'sans erreur JS : ' + erreurs.join(' | '));
};
SCENARIOS['messages : correction, retrait annulable, recherche'] = async function (nav, BASE) {
  const { page, erreurs } = await ouvrir(nav, BASE, ELEVE);
  await aller(page, '#/messages', 2500);
  const texte = 'Scénario messages ' + Date.now();
  await page.fill('#e-texte', texte); await page.click('#e-envoi'); await page.waitForTimeout(1800);
  ok((await page.locator('[data-modifier]').count()) >= 1, 'bouton Modifier sur son message');
  await page.locator('[data-modifier]').last().click(); await page.waitForTimeout(300);
  ok(!(await page.locator('#e-modif-zone').evaluate((e) => e.hidden)), 'zone de modification visible');
  await page.fill('#e-texte', texte + ' corrigé'); await page.click('#e-envoi'); await page.waitForTimeout(1800);
  ok((await page.locator('.e-modifie').count()) >= 1, 'message marqué modifié');
  await page.locator('[data-retirer]').last().click(); await page.waitForTimeout(400);
  ok((await page.locator('.bandeau-action').count()) === 1, 'retrait annulable');
  await page.click('.bandeau-action'); await page.waitForTimeout(300);
  ok((await page.locator('.e-msg[hidden]').count()) === 0, 'retrait annulé');
  ok((await page.locator('.e-msg-tete time').count()) >= 1, 'heures relatives');
  ok(!erreurs.length, 'sans erreur JS : ' + erreurs.join(' | '));
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
