/* ============================================================
   Konstrio — Moteur de quiz générique (avec visuel optionnel)
   Dépend de : tokens.css + konstrio.js + shell.js
   Usage : QuizGame({ id, code, title, domain, intro, learned, rounds })
   round : { prompt, options:[…], answer, explain?, visual?(HTML), lvl? }
   ============================================================ */
(function () {
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0;[a[i], a[j]] = [a[j], a[i]]; } return a; }
  function esc(s) { return (s + '').replace(/"/g, '&quot;'); }
  let CSS = false;
  function css() { if (CSS) return; CSS = true; const s = document.createElement('style'); s.textContent = `
   .qz{ position:absolute; inset:0; overflow:auto; display:flex; flex-direction:column; align-items:center; padding:18px 16px 34px; gap:14px; }
   .qz-diff{ display:flex; gap:6px; background:var(--surface-2); border:1px solid var(--border); border-radius:999px; padding:4px; }
   .qz-diff button{ font-family:var(--font-body); font-weight:700; font-size:12px; padding:7px 15px; border-radius:999px; border:none; background:transparent; color:var(--fg-muted); cursor:pointer; }
   .qz-diff button[aria-pressed="true"]{ background:var(--accent); color:#fff; }
   .qz-card{ width:min(580px,100%); background:var(--surface); border:1px solid var(--border); border-radius:18px; box-shadow:var(--shadow-md); padding:22px; display:flex; flex-direction:column; gap:15px; animation:fadeUp .35s both; }
   .qz-visual{ background:var(--surface-2); border:1px solid var(--border); border-radius:12px; padding:14px 16px; overflow-x:auto; }
   .qz-prompt{ font-size:17px; line-height:1.45; font-weight:600; }
   .qz-opts{ display:grid; grid-template-columns:1fr 1fr; gap:10px; }
   @media (max-width:520px){ .qz-opts{ grid-template-columns:1fr; } }
   .qz-opt{ min-height:52px; border-radius:12px; border:1px solid var(--border); background:var(--surface-2); color:var(--fg); font-family:var(--font-body); font-weight:700; font-size:15px; cursor:pointer; transition:.12s; padding:9px 13px; text-align:left; }
   .qz-opt:hover{ transform:translateY(-2px); box-shadow:var(--shadow-md); border-color:var(--accent); }
   .qz-opt:disabled{ cursor:default; transform:none; }
   .qz-opt.ok{ background:var(--ok); color:var(--ok-fg); border-color:var(--brand-teal); }
   .qz-opt.no{ background:var(--err); color:var(--err-fg); border-color:var(--brand-red); }
   .qz-fb{ display:none; font-size:14px; line-height:1.5; }
   .qz-fb.show{ display:block; padding:13px 15px; border-radius:12px; }
   .qz-fb.good{ background:var(--ok); color:var(--ok-fg); } .qz-fb.bad{ background:var(--err); color:var(--err-fg); }
   .qz-next{ min-height:46px; border-radius:12px; border:none; background:var(--accent); color:#fff; font-family:var(--font-body); font-weight:700; font-size:15px; cursor:pointer; width:100%; }
   .qz-mono{ font-family:var(--font-mono); }
   .qz-grid{ border-collapse:collapse; font-family:var(--font-mono); font-size:13px; }
   .qz-grid th,.qz-grid td{ border:1px solid var(--border); padding:5px 10px; text-align:center; }
   .qz-grid th{ background:var(--surface-3); color:var(--fg-muted); font-weight:700; }`;
    document.head.appendChild(s); }

  window.QuizGame = function (cfg) {
    let api, root, rounds = [], idx = 0, correct = 0, diff = 2;
    const shell = window.Konstrio.createGame({
      id: cfg.id, code: cfg.code, title: cfg.title, type: '2D', domain: cfg.domain, intro: cfg.intro, learned: cfg.learned,
      onReady: (a) => { api = a; css(); root = document.createElement('div'); root.className = 'qz'; a.stage.appendChild(root); reset(); },
      onStart: (m, a) => { api = a; reset(); }, onRestart: (a) => { api = a; reset(); },
    });
    function pool() { const rs = cfg.rounds.filter(r => (r.lvl || 1) <= diff); return shuffle(rs).slice(0, Math.min(cfg.perRun || 10, rs.length)); }
    function reset() { rounds = pool(); idx = 0; correct = 0; api.setScore(0); api.setProgress(0); render(); }
    function render() {
      if (idx >= rounds.length) return finish();
      const r = rounds[idx]; api.setLevel((idx + 1) + '/' + rounds.length); api.setProgress(idx / rounds.length);
      const opts = shuffle(r.options);
      root.innerHTML = `<div class="qz-diff">${['Facile', 'Moyen', 'Expert'].map((d, i) => `<button data-d="${i + 1}" aria-pressed="${diff === i + 1}">${d}</button>`).join('')}</div>
        <div class="qz-card">${r.visual ? `<div class="qz-visual">${r.visual}</div>` : ''}<div class="qz-prompt">${r.prompt}</div>
        <div class="qz-opts">${opts.map(o => `<button class="qz-opt" data-o="${esc(o)}">${o}</button>`).join('')}</div><div class="qz-fb" id="qzFb"></div></div>`;
      root.querySelectorAll('.qz-diff button').forEach(b => b.onclick = () => { diff = +b.dataset.d; reset(); });
      root.querySelectorAll('.qz-opt').forEach(b => b.onclick = () => answer(b.dataset.o, b, r));
      api.say(idx === 0 ? (cfg.intro.greet) : 'Question suivante !', 'concentre');
    }
    function answer(val, btn, r) {
      root.querySelectorAll('.qz-opt').forEach(b => b.disabled = true);
      const ok = val === r.answer; btn.classList.add(ok ? 'ok' : 'no');
      if (!ok) root.querySelectorAll('.qz-opt').forEach(b => { if (b.dataset.o === r.answer) b.classList.add('ok'); });
      if (ok) { correct++; api.addScore(100); api.sound('good'); } else api.sound('bad');
      const fb = root.querySelector('#qzFb'); fb.className = 'qz-fb show ' + (ok ? 'good' : 'bad');
      fb.innerHTML = `<b>${ok ? '✓ Correct !' : '✗ Réponse : ' + r.answer}</b>${r.explain ? '<br>' + r.explain : ''}`;
      api.say(ok ? (r.explain || 'Bien vu !') : ('La bonne réponse : ' + r.answer + '. ' + (r.explain || '')), ok ? 'fier' : 'rassurant');
      const nb = document.createElement('button'); nb.className = 'qz-next'; nb.textContent = idx + 1 < rounds.length ? '▸ Suivant' : '🏁 Résultat';
      root.querySelector('.qz-card').appendChild(nb); nb.focus(); nb.onclick = () => { idx++; api.setProgress(idx / rounds.length); render(); };
    }
    function finish() { const acc = correct / rounds.length, stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1; api.win({ score: correct * 100, stars, title: `${correct}/${rounds.length} bonnes réponses`, learned: cfg.learned, buddy: acc >= 0.9 ? 'Excellent — niveau expert atteint !' : 'Bien joué — rejoue pour viser le sans-faute.', onNext: reset, nextLabel: 'Rejouer' }); }
    return shell;
  };
})();
