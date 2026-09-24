/* ============================================================
   KONSTRIO — Coquille de jeu commune (game shell)
   Dépend de : tokens.css + konstrio.js
   Usage dans un jeu :
     const shell = Konstrio.createGame({ id, code, title, type, domain, intro, learned, onStart, ... });
     // construire le jeu dans shell.stage ; piloter via shell.setScore(), shell.win()...
   ============================================================ */
(function () {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- styles de la coquille ---------- */
  const STYLE = `
  .ksh-root { position: fixed; inset: 0; display: flex; flex-direction: column; background: var(--bg); color: var(--fg); font-family: var(--font-body); overflow: hidden; }
  .ksh-hud { display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-bottom: 1px solid var(--border); background: color-mix(in srgb, var(--surface) 70%, transparent); backdrop-filter: blur(10px); z-index: 30; flex-wrap: wrap; }
  .ksh-back { width: 40px; height: 40px; flex: none; }
  .ksh-titlewrap { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .ksh-title { font-family: var(--font-title); font-weight: 800; font-size: 16px; line-height: 1.1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ksh-dtag { font-family: var(--font-mono); font-size: 10px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; padding: 2px 8px; border-radius: 999px; color: #fff; width: fit-content; }
  .ksh-spacer { flex: 1; }
  .ksh-stat { display: flex; flex-direction: column; align-items: center; min-width: 56px; }
  .ksh-stat .lbl { font-family: var(--font-mono); font-size: 9px; letter-spacing: .08em; text-transform: uppercase; color: var(--fg-muted); }
  .ksh-stat .val { font-family: var(--font-data); font-weight: 700; font-size: 18px; line-height: 1; }
  .ksh-prog { width: 110px; }
  .ksh-stars { display: inline-flex; gap: 3px; }
  .ksh-mode { font-family: var(--font-mono); font-size: 11px; font-weight: 700; padding: 6px 12px; border-radius: 999px; border: 1px solid var(--border); background: var(--surface); color: var(--fg); cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
  .ksh-mode b { width: 7px; height: 7px; border-radius: 999px; background: var(--brand-teal); }
  .ksh-mode[data-mode="cours"] b { background: var(--accent); }
  .ksh-btns { display: flex; gap: 6px; }
  .ksh-ib { width: 40px; height: 40px; border-radius: 11px; border: 1px solid var(--border); background: var(--surface); color: var(--fg); cursor: pointer; display: grid; place-items: center; transition: transform .12s, background .2s; flex: none; }
  .ksh-ib:hover { transform: translateY(-1px); background: var(--surface-2); }
  .ksh-ib:focus-visible { outline: none; box-shadow: var(--ring); }
  .ksh-ib svg { width: 19px; height: 19px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .ksh-stage { position: relative; flex: 1; min-height: 0; overflow: hidden; }
  .ksh-stage canvas { display: block; }
  .ksh-screen { position: absolute; inset: 0; z-index: 50; display: grid; place-items: center; padding: 24px; background: color-mix(in srgb, var(--bg) 86%, transparent); backdrop-filter: blur(8px); animation: kshFade .35s ease; overflow:auto; }
  .ksh-screen[hidden] { display: none; }
  @keyframes kshFade { from { opacity: 0; } to { opacity: 1; } }
  .ksh-card { width: min(620px, 100%); background: var(--surface); border: 1px solid var(--border); border-radius: 20px; box-shadow: var(--shadow-lg); padding: 30px; animation: kshUp .4s cubic-bezier(.22,1,.36,1) both; }
  @keyframes kshUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
  .ksh-h { font-family: var(--font-title); font-weight: 800; font-size: 26px; letter-spacing: -.01em; margin: 0 0 6px; }
  .ksh-sub { color: var(--fg-muted); font-size: 14.5px; line-height: 1.5; margin: 0 0 18px; }
  .ksh-steps { display: flex; flex-direction: column; gap: 10px; margin: 0 0 20px; }
  .ksh-step { display: flex; gap: 12px; align-items: flex-start; font-size: 14px; line-height: 1.45; }
  .ksh-step i { flex: none; width: 26px; height: 26px; border-radius: 999px; background: var(--accent-weak); color: var(--accent-text); font-family: var(--font-data); font-weight: 700; font-size: 13px; display: grid; place-items: center; font-style: normal; }
  .ksh-obj { background: var(--accent-weak); border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent); border-radius: 12px; padding: 12px 14px; font-size: 13.5px; color: var(--accent-text); margin: 0 0 20px; display:flex; gap:9px; align-items:flex-start; }
  .ksh-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .ksh-b { font-family: var(--font-body); font-weight: 700; font-size: 15px; min-height: 48px; padding: 0 22px; border-radius: 999px; border: 1px solid var(--border); background: var(--surface); color: var(--fg); cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: transform .12s, box-shadow .2s, background .2s; }
  .ksh-b:hover { transform: translateY(-1px); box-shadow: var(--shadow-md); }
  .ksh-b:focus-visible { outline: none; box-shadow: var(--ring); }
  .ksh-b.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
  .ksh-b.primary:hover { box-shadow: 0 8px 24px rgba(110,107,255,.4); }
  .ksh-fin-stars { display: flex; gap: 8px; justify-content: center; margin: 6px 0 18px; }
  .ksh-fin-stars svg { width: 46px; height: 46px; }
  .ksh-learned { background: var(--ok); border-radius: 12px; padding: 14px 16px; margin: 0 0 20px; }
  .ksh-learned h4 { font-size: 13px; font-family: var(--font-title); margin: 0 0 8px; color: var(--ok-fg); display:flex; align-items:center; gap:7px; }
  .ksh-learned ul { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 6px; }
  .ksh-learned li { font-size: 14px; line-height: 1.4; }
  .ksh-toast { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%) translateY(20px); background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow-lg); border-radius: 12px; padding: 12px 18px; z-index: 95; font-weight: 600; opacity: 0; transition: .3s; pointer-events: none; }
  .ksh-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
  .ksh-lecon { margin: 0 0 6px; font-size: 14px; color: var(--fg-muted); }
  .ksh-lecon-lien { color: var(--accent-text); font-weight: 700; text-decoration: none; border-bottom: 1px dotted currentColor; }
  .ksh-lecon-attente { color: var(--fg-muted); }
  .ksh-duree { margin: 0 0 14px; font-size: 13.5px; color: var(--fg-muted); }
  .ksh-apprendre { background: var(--accent-weak); border-radius: 12px; padding: 12px 14px; margin: 0 0 16px; }
  .ksh-apprendre h4 { font-size: 13px; font-family: var(--font-title); margin: 0 0 6px; color: var(--accent-text); }
  .ksh-apprendre ul { margin: 0; padding-left: 18px; font-size: 14px; line-height: 1.5; }
  .ksh-seuils { text-align: center; font-size: 12.5px; color: var(--fg-muted); margin: 0 0 14px; line-height: 1.5; }
  .ksh-finscore { font-family: var(--font-data); font-weight: 700; font-size: 40px; text-align: center; line-height: 1; }
  .ksh-finlabel { text-align:center; font-family: var(--font-mono); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--fg-muted); margin-bottom: 4px; }
  @media (max-width: 640px) {
    .ksh-prog, .ksh-stat.opt { display: none; }
    .ksh-title { font-size: 14px; max-width: 130px; }
    .ksh-card { padding: 22px; }
  }
  @media (prefers-reduced-motion: reduce) { .ksh-screen, .ksh-card, .ksh-toast { animation: none; } }`;

  function star(filled) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.6l-5.9 3.1 1.13-6.57L2.45 9.44l6.6-.96z" fill="${filled ? 'var(--brand-amber)' : 'none'}" stroke="${filled ? 'var(--brand-amber)' : 'var(--fg-muted)'}" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
  }
  const ICON = {
    pause: '<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
    replay: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    sound: '<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M16 9a4 4 0 0 1 0 6M19 7a8 8 0 0 1 0 10"/></svg>',
    mute: '<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m22 9-6 6M16 9l6 6"/></svg>',
    theme: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/></svg>',
    full: '<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    quit: '<svg viewBox="0 0 24 24"><path d="M10 17l-5-5 5-5M5 12h12M15 4h4v16h-4"/></svg>',
  };

  function createGame(cfg) {
    document.documentElement.setAttribute('data-theme', localStorage.getItem('konstrio-theme') || 'light');
    if (!window.KonstrioAch && !document.getElementById('ksh-ach')) { const sa = document.createElement('script'); sa.id = 'ksh-ach'; sa.src = '../achievements.js'; document.head.appendChild(sa); }
    // Panneau « Accessibilité & confort » : présent aussi dans TOUS les jeux
    // (bouton universel toujours visible, réglages partagés via localStorage).
    if (!window.__konstrioConfort && !document.getElementById('ksh-confort')) { const sc = document.createElement('script'); sc.id = 'ksh-confort'; sc.src = '../confort.js'; document.head.appendChild(sc); }
    function ach(cb, n) { if (window.KonstrioAch) cb(window.KonstrioAch); else if ((n || 0) < 20) setTimeout(() => ach(cb, (n || 0) + 1), 250); }
    ach(K => { const h = new Date().getHours(); if (h >= 0 && h < 5) K.unlock('nightowl'); });
    if (!document.getElementById('ksh-styles')) {
      const s = document.createElement('style'); s.id = 'ksh-styles'; s.textContent = STYLE; document.head.appendChild(s);
    }
    if (cfg.title) document.title = 'Opaline · ' + cfg.title;

    const SKEY = 'konstrio-game-' + cfg.id;
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(SKEY) || '{}'); } catch (e) {}

    const root = document.createElement('div'); root.className = 'ksh-root';
    const dom = cfg.domain || { label: '', color: 'var(--accent)' };
    root.innerHTML = `
      <header class="ksh-hud">
        <button class="ksh-ib ksh-back" title="Retour aux jeux" aria-label="Quitter">${ICON.quit}</button>
        <div class="ksh-titlewrap">
          <span class="ksh-title">${cfg.title || ''}</span>
          <span class="ksh-dtag" style="background:${dom.color}">${dom.label || cfg.type || ''}</span>
        </div>
        <button class="ksh-mode" data-mode="detente" title="Changer de mode"><b></b><span class="ksh-modelbl">Détente</span></button>
        <div class="ksh-spacer"></div>
        <div class="ksh-stat opt ksh-level-wrap"><span class="lbl">Niveau</span><span class="val ksh-level">1</span></div>
        <div class="ksh-stat ksh-score-wrap"><span class="lbl">Score</span><span class="val ksh-score">0</span></div>
        <div class="ksh-stat opt ksh-timer-wrap" hidden><span class="lbl">Temps</span><span class="val ksh-timer">0:00</span></div>
        <div class="ksh-stat opt ksh-prog-wrap"><span class="lbl">Progression</span><div class="progress ksh-prog" style="margin-top:5px"><i style="width:0%"></i></div></div>
        <div class="ksh-stat opt ksh-stars-wrap"><span class="lbl">Étoiles</span><span class="ksh-stars" style="margin-top:2px">${star(0)+star(0)+star(0)}</span></div>
        <div class="ksh-btns">
          <button class="ksh-ib ksh-pausebtn" title="Pause (Échap)" aria-label="Pause">${ICON.pause}</button>
          <button class="ksh-ib ksh-replay" title="Rejouer" aria-label="Rejouer">${ICON.replay}</button>
          <button class="ksh-ib ksh-instr" title="Instructions" aria-label="Instructions">${ICON.info}</button>
          <button class="ksh-ib ksh-sound" title="Son" aria-label="Activer/couper le son">${ICON.sound}</button>
          <button class="ksh-ib ksh-theme" title="Thème clair/sombre" aria-label="Thème">${ICON.theme}</button>
          <button class="ksh-ib ksh-full" title="Plein écran" aria-label="Plein écran">${ICON.full}</button>
        </div>
      </header>
      <main class="ksh-stage" tabindex="-1"></main>
      <div class="ksh-screen ksh-accueil"></div>
      <div class="ksh-screen ksh-pause" hidden></div>
      <div class="ksh-screen ksh-fin" hidden></div>
      <div class="ksh-toast"></div>`;
    document.body.appendChild(root);

    const $ = (s) => root.querySelector(s);
    const stage = $('.ksh-stage');

    // buddy
    const buddy = document.createElement('konstrio-buddy');
    buddy.setAttribute('emotion', 'joyeux');
    buddy.setAttribute('show-hint', '');
    buddy.setAttribute('show-why', '');
    document.body.appendChild(buddy);

    /* ---------- son (WebAudio) ---------- */
    let actx = null, muted = localStorage.getItem('konstrio-muted') === '1';
    function ac() { if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } return actx; }
    function tone(freq, dur, type, vol, when) {
      const c = ac(); if (!c || muted) return;
      const o = c.createOscillator(), g = c.createGain(); o.type = type || 'sine'; o.frequency.value = freq;
      const t = c.currentTime + (when || 0);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol || .12, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + .02);
    }
    const SND = {
      click: () => tone(440, .06, 'triangle', .07),
      good: () => { tone(660, .12, 'sine', .12); tone(990, .16, 'sine', .1, .08); },
      bad: () => { tone(180, .22, 'sawtooth', .09); },
      win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .3, 'sine', .12, i * .1)),
      tick: () => tone(880, .03, 'square', .04),
      pop: () => tone(520, .08, 'sine', .08),
    };
    function syncSound() { $('.ksh-sound').innerHTML = muted ? ICON.mute : ICON.sound; }
    syncSound();
    // Le panneau Accessibilité peut couper/rétablir les sons pendant la partie.
    document.addEventListener('cf-sons-change', (e) => { muted = !(e.detail && e.detail.on); syncSound(); });

    /* ---------- timer ---------- */
    let tSec = 0, tInt = null, tUp = false;
    function fmt(s) { const m = Math.floor(s / 60); return m + ':' + String(Math.floor(s % 60)).padStart(2, '0'); }
    const timer = {
      show(up) { tUp = !!up; $('.ksh-timer-wrap').hidden = false; },
      set(s) { tSec = s; $('.ksh-timer').textContent = fmt(s); },
      start() { if (tInt) return; $('.ksh-timer-wrap').hidden = false; tInt = setInterval(() => { tSec += tUp ? 1 : -1; if (!tUp && tSec <= 0) { tSec = 0; this.stop(); if (api.onTimeout) api.onTimeout(); } $('.ksh-timer').textContent = fmt(tSec); }, 1000); },
      stop() { clearInterval(tInt); tInt = null; },
      reset(s) { this.stop(); tSec = s || 0; $('.ksh-timer').textContent = fmt(tSec); },
      get value() { return tSec; },
    };

    /* ---------- API exposée au jeu ---------- */
    let mode = 'detente', started = false, paused = false;
    const api = {
      stage, buddy, timer, cfg, mode,
      get muted() { return muted; },
      setScore(n) { $('.ksh-score').textContent = Math.round(n); },
      addScore(n) { const c = parseInt($('.ksh-score').textContent || '0', 10); this.setScore(c + n); },
      setLevel(t) { $('.ksh-level').textContent = t; },
      setProgress(f) { $('.ksh-prog i').style.width = Math.max(0, Math.min(1, f)) * 100 + '%'; },
      setStars(n) { $('.ksh-stars').innerHTML = star(n >= 1) + star(n >= 2) + star(n >= 3); },
      sound(k) { (SND[k] || function () {})(); },
      say(msg, emo) { buddy.say ? buddy.say(msg, emo) : (buddy.setAttribute('message', msg), emo && buddy.setAttribute('emotion', emo)); },
      hint(msg) { buddy.say(msg, 'curieux'); },
      celebrate(msg) { if (msg) buddy.setAttribute('message', msg); buddy.celebrate ? buddy.celebrate() : null; this.sound('win'); },
      toast(msg, ms) { const t = $('.ksh-toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), ms || 1800); },
      save(obj) { saved = Object.assign(saved, obj); try { localStorage.setItem(SKEY, JSON.stringify(saved)); } catch (e) {} },
      load(k, d) { return (k in saved) ? saved[k] : d; },
      win(o) { showFin(true, o || {}); },
      lose(o) { showFin(false, o || {}); },
    };

    /* ---------- écran Accueil : le même pour tous les jeux ---------- */
    function steps(arr) { return (arr || []).map((s, i) => `<div class="ksh-step"><i>${i + 1}</i><span>${s}</span></div>`).join(''); }
    const esc = (t) => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    /** La leçon que ce jeu sert, d'après le catalogue et le programme d'Opaline (chargés une fois). */
    function chargerScript(src) {
      return new Promise((ok, ko) => {
        if (document.querySelector(`script[src="${src}"]`)) return ok();
        const el = document.createElement('script'); el.src = src; el.onload = ok; el.onerror = ko; document.head.appendChild(el);
      });
    }
    let leconPromise = null;
    function leconServie() {
      if (leconPromise) return leconPromise;
      leconPromise = Promise.all([
        window.JEUX ? Promise.resolve() : chargerScript('/data/jeux.js').catch(() => {}),
        window.PROGRAMME ? Promise.resolve() : chargerScript('/data/programme.js').catch(() => {}),
      ]).then(() => {
        const jeu = (window.JEUX || []).find((j) => j.id === cfg.id);
        if (!jeu || !window.PROGRAMME) return [];
        return (jeu.lecons || []).map((c) => {
          const [mid, ref] = c.split(':');
          const m = PROGRAMME.matieres.find((x) => x.id === mid);
          const l = m && m.lecons.find((x) => x.ref === ref);
          return m && l ? { mid, ref, matiere: m.nom, icone: m.icone, titre: l.titre, notions: l.notions || [], url: '/#/lecon/' + mid + '/' + ref + '/cours' } : null;
        }).filter(Boolean);
      });
      return leconPromise;
    }
    api.leconServie = leconServie;
    /** E12 : les questions de la leçon rattachée, prises dans la banque d'Opaline (qcm et vrai/faux). */
    api.banqueLecon = function () {
      return leconServie().then((lecons) => (window.EXERCICES ? Promise.resolve() : chargerScript('/data/exercices.js').catch(() => {})).then(() => {
        const items = [];
        lecons.forEach((l) => { const b = window.EXERCICES && window.EXERCICES[l.mid + '/' + l.ref]; if (b && b.items) items.push(...b.items.filter((q) => q.type === 'qcm' || q.type === 'vraifaux')); });
        return items;
      }));
    };
    function renderAccueil() {
      const intro = cfg.intro || {};
      const consignes = (intro.how || []).slice(0, 3);
      if (!consignes.length && intro.rule) consignes.push(intro.rule);
      const modeParDefaut = intro.objectif ? 'cours' : 'detente';
      $('.ksh-accueil').innerHTML = `
        <div class="ksh-card" role="dialog" aria-label="Présentation du jeu">
          <div class="ksh-dtag" style="background:${dom.color};margin-bottom:12px">${cfg.code || ''} · ${dom.label || ''}</div>
          <h2 class="ksh-h">${cfg.title || ''}</h2>
          <p class="ksh-lecon" id="ksh-lecon"><span class="ksh-lecon-attente">Leçon servie : recherche dans le programme…</span></p>
          <p class="ksh-duree">⏱ Durée conseillée : ${esc(cfg.duree || intro.duree || '10 min')}${intro.rule && consignes[0] !== intro.rule ? ' · ' + intro.rule : ''}</p>
          <div class="ksh-steps">${steps(consignes)}</div>
          <div class="ksh-apprendre" id="ksh-apprendre" hidden></div>
          ${intro.objectif ? `<div class="ksh-obj">🎯 <span><b>Objectif&nbsp;:</b> ${intro.objectif}</span></div>` : ''}
          <div class="ksh-row">
            <button class="ksh-b primary ksh-play">▶ Jouer</button>
            <button class="ksh-b ksh-acc-instr">Instructions</button>
            <button class="ksh-b ksh-play-autre" title="${modeParDefaut === 'cours' ? 'Sans les questions du cours' : 'Avec les questions du cours'}">${modeParDefaut === 'cours' ? '🌿 Plutôt en détente' : '🎓 Plutôt en mode cours'}</button>
          </div>
        </div>`;
      $('.ksh-play').onclick = () => begin(modeParDefaut);
      $('.ksh-play-autre').onclick = () => begin(modeParDefaut === 'cours' ? 'detente' : 'cours');
      $('.ksh-acc-instr').onclick = showInstr;
      leconServie().then((lecons) => {
        const zone = $('#ksh-lecon'); if (!zone) return;
        if (!lecons.length) { zone.innerHTML = '<span class="ksh-lecon-attente">Jeu libre, hors programme.</span>'; return; }
        zone.innerHTML = 'Leçon servie : ' + lecons.map((l) => `<a class="ksh-lecon-lien" href="${l.url}">${l.icone} ${esc(l.titre)}</a>`).join(' · ');
        const notions = [...new Set(lecons.flatMap((l) => l.notions))].slice(0, 3);
        const app = $('#ksh-apprendre');
        if (app && notions.length) { app.hidden = false; app.innerHTML = `<h4>📘 Ce que tu vas apprendre</h4><ul>${notions.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>`; }
      });
      buddy.say((intro.greet || ('Salut ! ' + (cfg.title || '') + ' : prête à jouer ?')), 'joyeux');
    }

    function setMode(m) {
      mode = m; api.mode = m;
      const mb = $('.ksh-mode'); mb.dataset.mode = m; mb.querySelector('.ksh-modelbl').textContent = m === 'cours' ? 'Cours' : 'Détente';
      $('.ksh-level-wrap').style.display = (m === 'cours') ? '' : 'none';
    }

    function begin(m) {
      setMode(m);
      $('.ksh-accueil').hidden = true;
      started = true; paused = false;
      try { ac() && ac().resume && ac().resume(); } catch (e) {}
      if (cfg.onStart) cfg.onStart(m, api);
      // Prévisibilité (profil autisme/TSA) : annoncer « ce qui va se passer »
      // avant l'étape, sans jamais bloquer le jeu.
      if (document.documentElement.hasAttribute('data-confort-previsible')) {
        api.toast('Ce qui va se passer : tu joues à ton rythme, puis tu verras tes étoiles. Pause possible à tout moment (Échap).', 5000);
      }
      ach(K => K.recordPlay(cfg.id, cfg.title, cfg.type, cfg.domain && cfg.domain.label));
    }

    /* ---------- Pause ---------- */
    function showPause() {
      if (!started || paused) return;
      paused = true; timer.stop();
      if (cfg.onPause) cfg.onPause(api);
      $('.ksh-pause').innerHTML = `
        <div class="ksh-card" role="dialog" aria-label="Pause">
          <h2 class="ksh-h">Pause</h2>
          <p class="ksh-sub">Le jeu est en pause. Reprends quand tu veux.</p>
          <div class="ksh-row">
            <button class="ksh-b primary ksh-resume">▸ Reprendre</button>
            <button class="ksh-b ksh-prestart">↺ Recommencer</button>
            <button class="ksh-b ksh-pinstr">Instructions</button>
            <button class="ksh-b ksh-pquit">Quitter</button>
          </div>
        </div>`;
      $('.ksh-pause').hidden = false;
      $('.ksh-resume').onclick = resume;
      $('.ksh-prestart').onclick = () => { $('.ksh-pause').hidden = true; restart(); };
      $('.ksh-pinstr').onclick = showInstr;
      $('.ksh-pquit').onclick = quit;
    }
    function resume() { paused = false; $('.ksh-pause').hidden = true; if (cfg.onResume) cfg.onResume(api); }
    function restart() {
      $('.ksh-fin').hidden = true; $('.ksh-pause').hidden = true; paused = false; started = true;
      api.setScore(0); api.setProgress(0); api.setStars(0);
      if (cfg.onRestart) cfg.onRestart(api); else if (cfg.onStart) cfg.onStart(mode, api);
    }
    /** E28 : libère les géométries, matériaux, textures et le contexte WebGL déclarés par le monde. */
    function liberer3d() {
      const r = window.__ksh3d; if (!r) return;
      try {
        if (r.scene && r.scene.traverse) r.scene.traverse((o) => {
          if (o.geometry && o.geometry.dispose) o.geometry.dispose();
          const mats = Array.isArray(o.material) ? o.material : (o.material ? [o.material] : []);
          mats.forEach((m) => { Object.keys(m).forEach((k) => { const v = m[k]; if (v && v.isTexture && v.dispose) v.dispose(); }); if (m.dispose) m.dispose(); });
        });
        if (r.renderer) { if (r.renderer.setAnimationLoop) r.renderer.setAnimationLoop(null); if (r.renderer.dispose) r.renderer.dispose(); if (r.renderer.forceContextLoss) r.renderer.forceContextLoss(); }
      } catch (e) { /* la sortie ne doit jamais bloquer */ }
      window.__ksh3d = null;
    }
    window.addEventListener('pagehide', liberer3d);
    function quit() {
      if (cfg.onQuit) { try { cfg.onQuit(api); } catch (e) {} }
      liberer3d();
      // Retour CONTEXTUEL au HUB éducatif (et non la vitrine ni l'accueil brut).
      // Priorité 1 : le referrer interne /learning* — il conserve la query string
      // (?view=…&mat=…) que le hub SPA encode → on revient à la BONNE vue.
      try {
        const ref = document.referrer ? new URL(document.referrer) : null;
        if (ref && ref.origin === window.location.origin && ref.pathname.startsWith('/learning')) {
          window.location.href = ref.href; return;
        }
      } catch (_) { /* referrer indisponible → filet sessionStorage puis repli HUB */ }
      // Priorité 2 : filet de sécurité si le Referer est masqué (politique de
      // confidentialité, ouverture directe…). Le hub mémorise son URL contextualisée
      // dans sessionStorage (même origine) au moment de lancer un jeu.
      try {
        const back = sessionStorage.getItem('konstrio-learn-back');
        if (back && back.indexOf('/learning') === 0) { window.location.href = back; return; }
      } catch (_) { /* stockage indisponible → repli HUB */ }
      window.location.href = '/#/jeux';
    }

    /* ---------- Instructions ---------- */
    function showInstr() {
      const intro = cfg.intro || {};
      const wrap = document.createElement('div'); wrap.className = 'ksh-screen';
      wrap.innerHTML = `<div class="ksh-card" role="dialog" aria-label="Instructions">
        <h2 class="ksh-h">Comment jouer</h2>
        <p class="ksh-sub">${intro.rule || ''}</p>
        ${intro.how ? `<div class="ksh-steps">${steps(intro.how)}</div>` : ''}
        ${intro.keys ? `<p class="ksh-sub" style="margin-top:4px"><b>Clavier :</b> ${intro.keys}</p>` : ''}
        <div class="ksh-row"><button class="ksh-b primary ksh-close">Compris&nbsp;!</button></div>
      </div>`;
      root.appendChild(wrap);
      wrap.querySelector('.ksh-close').onclick = () => wrap.remove();
      wrap.addEventListener('click', (e) => { if (e.target === wrap) wrap.remove(); });
    }

    /* ---------- Fin ---------- */
    function showFin(won, o) {
      timer.stop();
      if (won) ach(K => K.recordWin(cfg.id, { stars: o.stars != null ? o.stars : 3, score: o.score || 0, mode }));
      const stars = o.stars != null ? o.stars : (won ? 3 : 0);
      const best = api.load('best', 0); const sc = o.score != null ? o.score : 0;
      if (sc > best) api.save({ best: sc });
      // Sync best-effort du score → Konstrio (D1 tenant-scopé). N'altère jamais le jeu (mode public/hors-ligne).
      if (won || o.score != null) { try { fetch('/api/learning/game-score', { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ gameId: cfg.id, title: cfg.title, score: Math.round(sc), stars: stars, won: !!won, lowerIsBetter: !!cfg.lowerIsBetter }) }).catch(function () {}); } catch (e) {} }
      const learned = o.learned || cfg.learned || [];
      $('.ksh-fin').innerHTML = `
        <div class="ksh-card" role="dialog" aria-label="Fin de partie">
          <div class="ksh-fin-stars">${star(stars >= 1) + star(stars >= 2) + star(stars >= 3)}</div>
          <div class="ksh-finlabel">${won ? 'Bravo !' : 'Continue, tu y es presque !'}</div>
          <h2 class="ksh-h" style="text-align:center;font-size:22px">${o.title || (won ? 'Niveau réussi' : 'Réessaie')}</h2>
          ${o.score != null ? `<div class="ksh-finscore" style="color:${dom.color}">${Math.round(sc)}</div><div class="ksh-finlabel" style="margin-bottom:16px">points${sc >= best && sc > 0 ? ' · nouveau record !' : ''}</div>` : ''}
          <p class="ksh-seuils">${cfg.seuils || 'Les étoiles : 1 dès que la partie est finie, 2 à partir de 70 % de réussite, 3 à partir de 90 %. Dans Opaline, une étoile est gagnée à partir de 2 étoiles ici.'}</p>
          ${learned.length ? `<div class="ksh-learned"><h4>💡 Ce que tu as appris</h4><ul>${learned.map(l => `<li>${l}</li>`).join('')}</ul></div>` : ''}
          <div class="ksh-row" style="justify-content:center">
            <button class="ksh-b primary ksh-frestart">↺ Rejouer</button>
            ${o.onNext ? `<button class="ksh-b ksh-fnext">${o.nextLabel || 'Niveau suivant'} ▸</button>` : ''}
            <button class="ksh-b ksh-fquit">Quitter</button>
          </div>
        </div>`;
      $('.ksh-fin').hidden = false;
      buddy.say(won ? (o.buddy || 'Excellent travail ! Tu as compris l\'essentiel.') : (o.buddy || 'Pas grave, recommence : tu vas y arriver.'), won ? 'celebration' : 'rassurant');
      if (won) { api.sound('win'); if (!REDUCED && buddy.celebrate) buddy.celebrate(); }
      $('.ksh-frestart').onclick = restart;
      $('.ksh-fquit').onclick = quit;
      if (o.onNext) $('.ksh-fnext').onclick = () => { $('.ksh-fin').hidden = true; o.onNext(); };
    }

    /* ---------- HUD events ---------- */
    $('.ksh-back').onclick = quit;
    $('.ksh-mode').onclick = () => { $('.ksh-accueil').hidden = false; renderAccueil(); };
    $('.ksh-pausebtn').onclick = showPause;
    $('.ksh-replay').onclick = restart;
    $('.ksh-instr').onclick = showInstr;
    $('.ksh-sound').onclick = () => { muted = !muted; localStorage.setItem('konstrio-muted', muted ? '1' : '0'); syncSound(); if (!muted) api.sound('click'); };
    $('.ksh-theme').onclick = () => {
      const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', t); localStorage.setItem('konstrio-theme', t);
      if (t === 'dark') ach(K => K.unlock('darkmode'));
      if (cfg.onTheme) cfg.onTheme(t, api);
    };
    $('.ksh-full').onclick = () => { if (!document.fullscreenElement) root.requestFullscreen && root.requestFullscreen(); else document.exitFullscreen && document.exitFullscreen(); };
    root.querySelector('.ksh-pause');
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (paused) resume(); else if (started && $('.ksh-fin').hidden) showPause(); } });
    buddy.addEventListener('hint', () => { if (cfg.onHint) cfg.onHint(api); else api.hint(cfg.intro && cfg.intro.hint ? cfg.intro.hint : 'Observe bien les indices à l\'écran !'); });
    buddy.addEventListener('why', () => { if (cfg.onWhy) cfg.onWhy(api); else api.say(cfg.intro && cfg.intro.why ? cfg.intro.why : 'Chaque bonne réponse renforce ta compréhension du sujet.', 'idee'); });
    buddy.addEventListener('mute-change', (e) => { muted = e.detail; syncSound(); });
    $('.ksh-pause');

    setMode('detente');
    renderAccueil();
    api.showPause = showPause; api.restart = restart; api.quit = quit;
    if (cfg.onReady) setTimeout(function () { cfg.onReady(api); }, 0);
    return api;
  }

  /** E2 : densité de pixels 2 sur ordinateur, 1,5 sur téléphone, abaissée d'un demi-cran si le rendu passe sous 45 images par seconde. */
  function adapterRendu(renderer) {
    const mobile = window.matchMedia('(max-width: 640px), (pointer: coarse)').matches;
    let ratio = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    renderer.setPixelRatio(ratio);
    let images = 0; let depuis = performance.now(); let mesures = 0;
    function compter() {
      images += 1;
      const t = performance.now();
      if (t - depuis >= 3000) {
        const ips = images / ((t - depuis) / 1000);
        images = 0; depuis = t; mesures += 1;
        if (ips < 45 && ratio > 1) { ratio = Math.max(1, ratio - 0.5); renderer.setPixelRatio(ratio); }
        if (mesures >= 6 || ratio <= 1) return;
      }
      requestAnimationFrame(compter);
    }
    requestAnimationFrame(compter);
    return ratio;
  }
  /** Le monde déclare sa scène et son rendu ; la coquille les libère à la sortie. */
  function declarer3d(objets) { window.__ksh3d = Object.assign(window.__ksh3d || {}, objets); }

  window.Konstrio = { createGame, REDUCED, adapterRendu, declarer3d, unlock: function (id) { if (window.KonstrioAch) window.KonstrioAch.unlock(id); } };
})();
