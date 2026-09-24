/* ============================================================
   Konstrio : Moteur de jeux de langues (anglais / espagnol)
   Dépend de : tokens.css + konstrio.js + shell.js
   Usage : LangGame({ id, code, title, lang, mode, domain, intro, learned, rounds })
   mode : 'mcq' | 'listen' | 'type' | 'order'
   round : { prompt, audio?, options?, answer, accept?, words?, explain?, lvl? }
   ============================================================ */
(function () {
  const VOICES = { en: 'en-US', es: 'es-ES' };
  function speak(text, lang) { try { if (!('speechSynthesis' in window)) return; speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = lang; u.rate = 0.9; speechSynthesis.speak(u); } catch (e) {} }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0;[a[i], a[j]] = [a[j], a[i]]; } return a; }
  function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[.,!?¿¡;:'"]/g, '').replace(/\s+/g, ' ').trim(); }
  function esc(s) { return (s + '').replace(/"/g, '&quot;'); }
  let CSS_DONE = false;
  function injectCSS() {
    if (CSS_DONE) return; CSS_DONE = true; const st = document.createElement('style'); st.textContent = `
    .lg2{ position:absolute; inset:0; overflow:auto; display:flex; flex-direction:column; align-items:center; padding:18px 16px 34px; gap:14px; }
    .lg2-diff{ display:flex; gap:6px; background:var(--surface-2); border:1px solid var(--border); border-radius:999px; padding:4px; }
    .lg2-diff button{ font-family:var(--font-body); font-weight:700; font-size:12px; padding:7px 15px; border-radius:999px; border:none; background:transparent; color:var(--fg-muted); cursor:pointer; }
    .lg2-diff button[aria-pressed="true"]{ background:var(--accent); color:#fff; }
    .lg2-card{ width:min(560px,100%); background:var(--surface); border:1px solid var(--border); border-radius:18px; box-shadow:var(--shadow-md); padding:24px; display:flex; flex-direction:column; gap:16px; animation:fadeUp .35s both; }
    .lg2-prompt{ font-size:19px; line-height:1.4; font-weight:600; display:flex; flex-wrap:wrap; align-items:center; gap:10px; }
    .lg2-prompt .big{ font-family:var(--font-title); font-weight:800; font-size:30px; color:var(--accent-text); }
    .lg2-audio{ font-family:var(--font-body); font-weight:700; font-size:13px; padding:8px 14px; border-radius:999px; border:1px solid var(--border); background:var(--surface-2); color:var(--fg); cursor:pointer; }
    .lg2-audio:hover{ background:var(--accent-weak); }
    .lg2-opts{ display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    .lg2-opt{ min-height:54px; border-radius:12px; border:1px solid var(--border); background:var(--surface-2); color:var(--fg); font-family:var(--font-body); font-weight:700; font-size:16px; cursor:pointer; transition:.12s; padding:8px 12px; }
    .lg2-opt:hover{ transform:translateY(-2px); box-shadow:var(--shadow-md); border-color:var(--accent); }
    .lg2-opt:disabled{ cursor:default; transform:none; }
    .lg2-opt.ok{ background:var(--ok); color:var(--ok-fg); border-color:var(--brand-teal); }
    .lg2-opt.no{ background:var(--err); color:var(--err-fg); border-color:var(--brand-red); }
    .lg2-input{ width:100%; min-height:54px; border-radius:12px; border:1px solid var(--border); background:var(--surface-2); color:var(--fg); font-family:var(--font-body); font-size:18px; padding:0 16px; outline:none; }
    .lg2-input:focus{ box-shadow:var(--ring); border-color:var(--accent); }
    .lg2-build{ min-height:50px; border-bottom:2px dashed var(--border); display:flex; flex-wrap:wrap; gap:7px; padding:8px 2px; }
    .lg2-bank{ display:flex; flex-wrap:wrap; gap:7px; }
    .lg2-chip{ font-family:var(--font-body); font-weight:700; font-size:15px; padding:9px 14px; border-radius:10px; border:1px solid var(--border); background:var(--surface-2); color:var(--fg); cursor:pointer; }
    .lg2-chip:hover{ border-color:var(--accent); }
    .lg2-chip.used{ opacity:.3; pointer-events:none; }
    .lg2-check{ min-height:48px; border-radius:12px; border:none; background:var(--accent); color:#fff; font-family:var(--font-body); font-weight:700; font-size:15px; cursor:pointer; }
    .lg2-fb{ font-size:14px; line-height:1.5; padding:0; display:none; }
    .lg2-fb.show{ display:block; padding:13px 15px; border-radius:12px; }
    .lg2-fb.good{ background:var(--ok); color:var(--ok-fg); }
    .lg2-fb.bad{ background:var(--err); color:var(--err-fg); }
    .lg2-next{ min-height:46px; border-radius:12px; border:none; background:var(--accent); color:#fff; font-family:var(--font-body); font-weight:700; font-size:15px; cursor:pointer; width:100%; }`;
    document.head.appendChild(st);
  }

  window.LangGame = function (cfg) {
    const langCode = VOICES[cfg.lang] || 'en-US';
    let api, root, rounds = [], idx = 0, correct = 0, diff = 2, mode = 'detente', banque = null, ratees = [];
    const shell = window.Konstrio.createGame({
      id: cfg.id, code: cfg.code, title: cfg.title, type: '2D', domain: cfg.domain,
      intro: cfg.intro, learned: cfg.learned, duree: cfg.duree,
      onReady: (a) => { api = a; injectCSS(); root = document.createElement('div'); root.className = 'lg2'; a.stage.appendChild(root); reset(); },
      onStart: (m, a) => { api = a; mode = m; diff = api.difficulte; reset(); chargerBanque(); },
      onRestart: (a) => { api = a; api.nouvelleGraine(); reset(); },
      onDifficulte: (d) => { diff = d; },
    });
    /* D13 : en mode cours et en choix multiple, les questions de la leçon rattachée (banque d'Opaline) remplacent la liste interne. */
    function chargerBanque() {
      if (mode !== 'cours' || banque !== null || cfg.mode !== 'mcq' || cfg.sansBanque) return;
      banque = [];
      api.banqueLecon().then((items) => {
        banque = items.map((q) => (q.type === 'vraifaux' ? { prompt: q.q, options: ['Vrai', 'Faux'], answer: q.reponse ? 'Vrai' : 'Faux', explain: q.explication, lvl: 1 } : { prompt: q.q, options: q.choix.slice(), answer: q.choix[q.reponse], explain: q.explication, lvl: 1 }));
        if (banque.length >= 4 && idx === 0 && correct === 0) { api.toast('Questions prises dans ta leçon Opaline.', 2500); reset(); }
      }).catch(() => { banque = []; });
    }
    function source() { return (mode === 'cours' && banque && banque.length >= 4) ? banque : cfg.rounds; }
    function pool() { const rs = source().filter(r => (r.lvl || 1) <= diff); return shuffle(rs, api.aleatoire(api.graine())).slice(0, Math.min(10, rs.length)); }
    function reset() { rounds = pool(); idx = 0; correct = 0; ratees = []; api.setScore(0); api.setProgress(0); render(); }
    function diffBar() { return `<div class="lg2-diff">${['Facile', 'Moyen', 'Expert'].map((d, i) => `<button data-d="${i + 1}" aria-pressed="${diff === i + 1}">${d}</button>`).join('')}</div>`; }
    function render() {
      if (idx >= rounds.length) return finish();
      const r = rounds[idx];
      api.setLevel((idx + 1) + '/' + rounds.length); api.setProgress(idx / rounds.length);
      const audioBtn = r.audio ? `<button class="lg2-audio">🔊 ${cfg.lang === 'es' ? 'Escuchar' : 'Listen'}</button>` : '';
      let main;
      if (cfg.mode === 'order') {
        main = `<div class="lg2-prompt">${r.prompt} ${audioBtn}</div><div class="lg2-build" id="lgBuild"></div><div class="lg2-bank" id="lgBank"></div><button class="lg2-check" id="lgCheck">Valider</button>`;
      } else if (cfg.mode === 'type') {
        main = `<div class="lg2-prompt">${r.prompt} ${audioBtn}</div><input class="lg2-input" id="lgInput" placeholder="${cfg.lang === 'es' ? 'Escribe…' : 'Type…'}" autocomplete="off" autocapitalize="off"><button class="lg2-check" id="lgCheck">Valider</button>`;
      } else {
        const opts = shuffle(r.options);
        main = `<div class="lg2-prompt">${r.prompt} ${audioBtn}</div><div class="lg2-opts">${opts.map(o => `<button class="lg2-opt" data-o="${esc(o)}">${o}</button>`).join('')}</div>`;
      }
      root.innerHTML = diffBar() + `<div class="lg2-card">${main}<div class="lg2-fb" id="lgFb"></div></div>`;
      root.querySelectorAll('.lg2-diff button').forEach(b => b.onclick = () => { diff = +b.dataset.d; api.save({ diff }); reset(); });
      root.querySelectorAll('.lg2-opt').forEach((b, k) => { b.setAttribute('data-touche', String(k + 1)); });
      if (r.audio) { const ab = root.querySelector('.lg2-audio'); ab.onclick = () => { speak(r.audio, langCode); }; if (cfg.mode === 'listen') setTimeout(() => speak(r.audio, langCode), 450); }
      if (cfg.mode === 'mcq' || cfg.mode === 'listen') root.querySelectorAll('.lg2-opt').forEach(b => b.onclick = () => answerMCQ(b.dataset.o, b, r));
      if (cfg.mode === 'type') { const inp = root.querySelector('#lgInput'); inp.focus(); const go = () => answerVal(inp.value, r); inp.onkeydown = e => { if (e.key === 'Enter') go(); }; root.querySelector('#lgCheck').onclick = go; }
      if (cfg.mode === 'order') buildOrder(r);
      api.say(idx === 0 ? cfg.intro.greet : (cfg.lang === 'es' ? '¡Vamos! Siguiente.' : 'Keep going! Next one.'), 'concentre');
    }
    function buildOrder(r) {
      const bank = root.querySelector('#lgBank'), build = root.querySelector('#lgBuild');
      shuffle(r.words).forEach((w, i) => { const c = document.createElement('button'); c.className = 'lg2-chip'; c.textContent = w; c.dataset.i = i; c.onclick = () => { c.classList.add('used'); const b = document.createElement('button'); b.className = 'lg2-chip'; b.textContent = w; b.onclick = () => { b.remove(); c.classList.remove('used'); }; build.appendChild(b); }; bank.appendChild(c); });
      root.querySelector('#lgCheck').onclick = () => { const got = [...build.children].map(x => x.textContent).join(' '); answerVal(got, r); };
    }
    function answerMCQ(val, btn, r) {
      root.querySelectorAll('.lg2-opt').forEach(b => b.disabled = true);
      const ok = val === r.answer; btn.classList.add(ok ? 'ok' : 'no');
      if (!ok) root.querySelectorAll('.lg2-opt').forEach(b => { if (b.dataset.o === r.answer) b.classList.add('ok'); });
      conclude(ok, r);
    }
    function answerVal(val, r) {
      const accepts = [r.answer].concat(r.accept || []).map(norm);
      const ok = accepts.includes(norm(val));
      root.querySelectorAll('.lg2-input,.lg2-chip,.lg2-check').forEach(b => b.disabled = true);
      conclude(ok, r);
    }
    function conclude(ok, r) {
      if (ok) { correct++; api.addScore(100); api.sound('good'); } else { api.sound('bad'); ratees.push(String(r.prompt).replace(/<[^>]+>/g, '').slice(0, 80)); }
      if (r.audio) speak(r.audio, langCode);
      const fb = root.querySelector('#lgFb'); fb.className = 'lg2-fb show ' + (ok ? 'good' : 'bad');
      const corr = cfg.lang === 'es' ? 'Respuesta' : 'Réponse';
      fb.innerHTML = `<b>${ok ? '✓ ' + (cfg.lang === 'es' ? '¡Correcto!' : 'Correct !') : '✗ ' + corr + ' : ' + r.answer}</b>${r.explain ? '<br>' + r.explain : ''}`;
      api.say(ok ? (r.explain || (cfg.lang === 'es' ? '¡Muy bien!' : 'Well done!')) : ('« ' + r.answer + ' ». ' + (r.explain || '')), ok ? 'fier' : 'rassurant');
      const nb = document.createElement('button'); nb.className = 'lg2-next'; nb.textContent = idx + 1 < rounds.length ? '▸ ' + (cfg.lang === 'es' ? 'Siguiente' : 'Suivant') : '🏁 ' + (cfg.lang === 'es' ? 'Resultado' : 'Résultat');
      root.querySelector('.lg2-card').appendChild(nb); nb.focus();
      nb.onclick = () => { idx++; api.setProgress(idx / rounds.length); render(); };
    }
    function finish() {
      const acc = correct / rounds.length, stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
      const graine = api.graine();
      api.win({ score: correct * 100, stars, title: `${correct}/${rounds.length} ${cfg.lang === 'es' ? 'correctas' : 'correct'}`, learned: cfg.learned, buddy: acc >= 0.9 ? (cfg.lang === 'es' ? '¡Excelente! Dominas esto.' : 'Excellent : tu maîtrises !') : 'Bien. Recommence pour progresser encore.', onNext: () => { api.nouvelleGraine(); reset(); }, nextLabel: cfg.lang === 'es' ? 'Otra vez' : 'Nouveau tirage', memeTirage: () => { api._graine = graine; reset(); }, detail: { justes: correct, total: rounds.length, ratees: ratees.slice(0, 10), difficulte: diff, mode: cfg.mode } });
    }
    // D5 : les touches 1 à 4 choisissent une proposition, Entrée passe à la suivante.
    document.addEventListener('keydown', (e) => {
      if (!root || e.ctrlKey || e.metaKey || e.altKey) return;
      const c = e.target; if (c && (c.tagName === 'INPUT' || c.tagName === 'TEXTAREA')) return;
      if (/^[1-4]$/.test(e.key)) { const b = root.querySelector(`.lg2-opt[data-touche="${e.key}"]:not(:disabled)`); if (b) { e.preventDefault(); b.click(); } }
      if (e.key === 'Enter') { const n = root.querySelector('.lg2-next'); if (n) { e.preventDefault(); n.click(); } }
    });
    return shell;
  };
})();
