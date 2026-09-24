/* ============================================================
   KONSTRIO : Coquille de jeu commune (game shell)
   Dépend de : tokens.css + konstrio.js
   Usage dans un jeu :
     const shell = Konstrio.createGame({ id, code, title, type, domain, intro, learned, onStart, ... });
     // construire le jeu dans shell.stage ; piloter via shell.setScore(), shell.win()...
   ============================================================ */
(function () {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* E17, E30 : journal de bord et mesures d'un monde, complétés par monde3d, envoyés avec le score. */
  const ETAT = { monde: false, debut: performance.now(), journal: [], ips: [], chargementMs: null, qualite: null, ratio: null, legendes: [] };

  /* ---------- styles de la coquille ---------- */
  const STYLE = `
  .ksh-root { position: fixed; inset: 0; display: flex; flex-direction: column; background: var(--bg); color: var(--fg); font-family: var(--font-body); overflow: hidden; }
  .ksh-hud { display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-bottom: 1px solid var(--border); background: color-mix(in srgb, var(--surface) 70%, transparent); backdrop-filter: blur(10px); z-index: 30; flex-wrap: wrap; }
  .ksh-back { width: 40px; height: 40px; flex: none; }
  .ksh-titlewrap { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .ksh-title { font-family: var(--font-title); font-weight: 800; font-size: 16px; line-height: 1.1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ksh-dtag { font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; padding: 3px 9px; border-radius: 999px; color: var(--fg); background: color-mix(in srgb, var(--dtag, var(--accent)) 18%, var(--surface)); border-left: 4px solid var(--dtag, var(--accent)); width: fit-content; }
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
  .ksh-b:focus-visible, .ksh-ib:focus-visible, .ksh-mode:focus-visible, .ksh-back:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
  .ksh-ib { width: 44px; height: 44px; border-radius: 11px; border: 1px solid var(--border); background: var(--surface); color: var(--fg); cursor: pointer; display: grid; place-items: center; transition: transform .12s, background .2s; flex: none; }
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
  .ksh-b.primary { background: var(--accent); border-color: var(--accent); color: var(--on-accent, #fff); }
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
  .ksh-chargement { position: absolute; inset: 0; z-index: 60; display: grid; place-items: center; background: var(--bg); }
  .ksh-chargement[hidden] { display: none; }
  .ksh-chargement .ksh-card { text-align: center; }
  .ksh-chargement .progress { width: 100%; height: 8px; border-radius: 999px; background: var(--surface-2); overflow: hidden; margin: 14px 0; }
  .ksh-chargement .progress i { display: block; height: 100%; width: 10%; background: var(--accent); transition: width .3s; }
  /* E12 : questions de la leçon */
  .ksh-banque-opts { display: grid; gap: 8px; margin: 12px 0; }
  .ksh-banque-opts .ksh-b { justify-content: flex-start; text-align: left; min-height: 48px; }
  .ksh-banque-opts .ksh-b i { display: inline-grid; place-items: center; width: 22px; height: 22px; border-radius: 6px; background: var(--surface-2); font-style: normal; font-size: 12px; margin-right: 8px; flex: none; }
  .ksh-banque-opts .ksh-b.ok { border-color: var(--brand-teal, #2AA98C); background: color-mix(in srgb, var(--brand-teal, #2AA98C) 18%, var(--surface)); }
  .ksh-banque-opts .ksh-b.no { border-color: #E63329; background: color-mix(in srgb, #E63329 14%, var(--surface)); }
  .ksh-banque-fb { border-left: 3px solid var(--accent); padding: 6px 10px; margin: 4px 0 8px; }
  /* E13 : la fiche dans un panneau */
  .ksh-fiche-panneau { position: absolute; top: 56px; right: 0; bottom: 0; width: min(440px, 100%); z-index: 45; background: var(--surface); border-left: 1px solid var(--border); box-shadow: var(--shadow-lg); display: flex; flex-direction: column; }
  .ksh-fiche-panneau[hidden] { display: none; }
  .ksh-fiche-tete { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 14px; border-bottom: 1px solid var(--border); font-size: 15px; }
  .ksh-fiche-plan { display: flex; gap: 6px; overflow-x: auto; padding: 8px 12px; border-bottom: 1px solid var(--border); flex: none; }
  .ksh-fiche-plan button { flex: none; font: inherit; font-size: 12px; padding: 5px 10px; border-radius: 999px; border: 1px solid var(--border); background: var(--surface-2); color: var(--fg); cursor: pointer; min-height: 32px; }
  .ksh-fiche-plan button[aria-current="true"] { background: var(--accent); color: var(--on-accent, #fff); border-color: var(--accent); }
  .ksh-fiche-corps { flex: 1; overflow: auto; padding: 12px 18px 24px; font-size: 15px; line-height: 1.7; color: var(--fg); }
  .ksh-fiche-corps h2 { font-size: 18px; margin: 18px 0 8px; color: var(--accent-text); }
  .ksh-fiche-corps h3 { font-size: 16px; margin: 14px 0 6px; }
  .ksh-fiche-corps p, .ksh-fiche-corps li { margin: 0 0 8px; }
  .ksh-fiche-corps table { border-collapse: collapse; width: 100%; font-size: 14px; margin: 8px 0; }
  .ksh-fiche-corps th, .ksh-fiche-corps td { border: 1px solid var(--border); padding: 5px 8px; text-align: left; vertical-align: top; }
  .ksh-fiche-corps .bloc { border-left: 4px solid var(--accent); background: var(--surface-2); border-radius: 8px; padding: 8px 12px; margin: 12px 0; }
  .ksh-fiche-corps .bloc-titre { font-weight: 700; display: flex; align-items: center; gap: 6px; margin: 0 0 6px; }
  .ksh-fiche-corps .ic-bloc, .ksh-fiche-corps .picto svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.8; vertical-align: -3px; }
  .ksh-fiche-corps img { max-width: 100%; height: auto; }
  .ksh-fiche-corps .bloc-plan { display: none; }
  .ksh-fiche-corps mark { background: color-mix(in srgb, var(--accent) 25%, transparent); color: inherit; }
  .ksh-fiche-pied { padding: 10px 14px; border-top: 1px solid var(--border); margin: 0; }
  /* E14 : légende d'un objet touché */
  .ksh-legende { position: fixed; z-index: 70; max-width: min(320px, 80vw); background: var(--surface); color: var(--fg); border: 1px solid var(--border); border-radius: 12px; box-shadow: var(--shadow-lg); padding: 9px 12px; font-size: 13.5px; line-height: 1.45; pointer-events: none; transform: translate(-50%, calc(-100% - 14px)); transition: opacity .2s; }
  .ksh-legende[hidden] { display: none; }
  .ksh-legende b { display: block; font-size: 14.5px; margin-bottom: 2px; }
  .ksh-legende::after { content: ""; position: absolute; left: 50%; bottom: -6px; transform: translateX(-50%); border: 6px solid transparent; border-top-color: var(--border); border-bottom: 0; }
  /* E15 : bandeau du mode guidé */
  .ksh-guide { position: absolute; left: 50%; bottom: 18px; transform: translateX(-50%); z-index: 44; width: min(560px, calc(100% - 24px)); background: var(--surface); border: 1px solid var(--accent); border-radius: 14px; box-shadow: var(--shadow-lg); padding: 12px 14px; display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; font-size: 14.5px; line-height: 1.45; }
  .ksh-guide[hidden] { display: none; }
  .ksh-guide b { color: var(--accent-text); flex: none; }
  .ksh-guide span { flex: 1 1 200px; }
  .ksh-defi-opts { display: flex; flex-wrap: wrap; gap: 6px; flex-basis: 100%; }
  .ksh-defi-opts .ksh-b { min-height: 44px; }
  .ksh-defi-opts .ksh-b i { display: inline-grid; place-items: center; width: 20px; height: 20px; border-radius: 5px; background: var(--surface-2); font-style: normal; font-size: 11px; margin-right: 6px; }
  /* E29 : panneau des commandes */
  .ksh-commandes { display: grid; grid-template-columns: auto 1fr; gap: 6px 14px; margin: 10px 0 14px; font-size: 14px; }
  .ksh-commandes kbd { font-family: var(--font-mono); font-size: 12px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; padding: 2px 7px; white-space: nowrap; }
  .ksh-qualite-choix { display: flex; gap: 8px; flex-wrap: wrap; margin: 6px 0 12px; }
  .ksh-qualite-choix button[aria-pressed="true"] { background: var(--accent); color: var(--on-accent, #fff); border-color: var(--accent); }
  @media (max-width: 640px) { .ksh-fiche-panneau { top: 0; } }
  .ksh-conseil { color: var(--fg-muted); font-size: 14px; line-height: 1.5; }
  .ksh-diff { display: flex; gap: 6px; margin: 0 0 16px; flex-wrap: wrap; align-items: center; }
  .ksh-diff span { font-family: var(--font-mono); font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: var(--fg-muted); margin-right: 4px; }
  .ksh-diff button { font-family: var(--font-body); font-weight: 700; font-size: 13px; min-height: 44px; padding: 0 16px; border-radius: 999px; border: 1px solid var(--border); background: var(--surface); color: var(--fg); cursor: pointer; }
  .ksh-diff button[aria-pressed="true"] { background: var(--accent); border-color: var(--accent); color: var(--on-accent, #fff); }
  .ksh-finscore { font-family: var(--font-data); font-weight: 700; font-size: 40px; text-align: center; line-height: 1; color: var(--fg); width: fit-content; margin: 0 auto; padding-bottom: 4px; }
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
          <span class="ksh-dtag" style="--dtag:${dom.color}">${dom.label || cfg.type || ''}</span>
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
      <div class="ksh-chargement" role="status" aria-live="polite"><div class="ksh-card"><h2 class="ksh-h">${cfg.title || 'Chargement'}</h2><div class="progress"><i></i></div><p class="ksh-conseil" id="ksh-conseil">Le jeu se prépare…</p></div></div>
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
    // D20 : quatre sons, ceux de l'identité sonore commune quand le moteur audio est chargé.
    const COMMUN = { click: 'clic', good: 'indice', bad: 'erreur', win: 'bravo', tick: 'clic', pop: 'indice' };
    const commun = (k) => { if (muted || !window.KonstrioAudio || !window.KonstrioAudio.play) return false; try { window.KonstrioAudio.play(COMMUN[k] || k); return true; } catch (e) { return false; } };
    const vibrer = (ms) => { try { if (navigator.vibrate && !muted) navigator.vibrate(ms); } catch (e) { /* pas de retour haptique */ } };
    const SND = {
      click: () => commun('click') || tone(440, .06, 'triangle', .07),
      good: () => { vibrer(15); if (!commun('good')) { tone(660, .12, 'sine', .12); tone(990, .16, 'sine', .1, .08); } },
      bad: () => { vibrer([20, 40, 20]); if (!commun('bad')) tone(180, .22, 'sawtooth', .09); },
      win: () => { vibrer([30, 40, 30]); if (!commun('win')) [523, 659, 784, 1047].forEach((f, i) => tone(f, .3, 'sine', .12, i * .1)); },
      tick: () => commun('tick') || tone(880, .03, 'square', .04),
      pop: () => commun('pop') || tone(520, .08, 'sine', .08),
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
      start() {
        if (tInt) return;
        // D7 : en temps libre (panneau de confort), le chronomètre compte, il ne menace pas.
        if (document.documentElement.getAttribute('data-confort-temps') === 'libre' && !tUp) { tUp = true; tSec = 0; }
        $('.ksh-timer-wrap').hidden = false; tInt = setInterval(() => { tSec += tUp ? 1 : -1; if (!tUp && tSec <= 0) { tSec = 0; this.stop(); if (api.onTimeout) api.onTimeout(); } $('.ksh-timer').textContent = fmt(tSec); }, 1000);
      },
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
      win(o) { o = o || {}; if ((mode === 'cours' || mode === 'guide') && ETAT.monde && !o.sansBanque && !banqueJouee) { banqueJouee = true; quizBanque(o).then((r) => showFin(true, r)); } else showFin(true, o); },
      lose(o) { showFin(false, o || {}); },
      /* D22 : progression du chargement, avec un conseil de la leçon. */
      chargement(fraction, texte) { const c = $('.ksh-chargement'); if (!c) return; if (fraction >= 1) { c.hidden = true; return; } c.hidden = false; c.querySelector('.progress i').style.width = Math.max(5, Math.min(100, fraction * 100)) + '%'; if (texte) $('#ksh-conseil').textContent = texte; },
      /* D10 : la difficulté choisie avant de jouer, mémorisée par jeu (1 facile, 2 moyen, 3 expert). */
      get difficulte() { return Number(saved.diff) || 2; },
      /* D28 : une graine de tirage ; « même tirage » la reprend. */
      graine() { if (!api._graine) api._graine = Math.floor(Math.random() * 1e9); return api._graine; },
      nouvelleGraine() { api._graine = Math.floor(Math.random() * 1e9); return api._graine; },
      aleatoire(graine) { let x = (graine || api.graine()) >>> 0; return () => { x = (x + 0x6D2B79F5) >>> 0; let t = x; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; },
      /* D24 : les questions ratées en série pour la leçon servie (indices dans la banque), lues dans le profil. */
      aRevoir() {
        return leconServie().then((lecons) => fetch('/api/etat', { credentials: 'same-origin' }).then((r) => (r.ok ? r.json() : null)).then((d) => {
          const tout = d && d.profil && d.profil['moi.arevoir'] || {};
          const idx = [];
          lecons.forEach((l) => { const e = tout[l.mid + '/' + l.ref]; if (e && Array.isArray(e.idx)) idx.push(...e.idx); });
          return idx;
        }).catch(() => []));
      },
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
          <div class="ksh-dtag" style="--dtag:${dom.color};margin-bottom:12px">${cfg.code || ''} · ${dom.label || ''}</div>
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
            ${/3d/i.test(cfg.type || '') ? '<button class="ksh-b ksh-play-guide" title="Opale enchaîne trois étapes : regarder, nommer, répondre">🧭 Guidée par Opale</button>' : ''}
          </div>
        </div>`;
      const diffActuelle = Number(saved.diff) || 2;
      $('.ksh-obj, .ksh-row').insertAdjacentHTML('beforebegin', `<div class="ksh-diff" role="group" aria-label="Difficulté"><span>Difficulté</span>${[['1', 'Facile'], ['2', 'Moyen'], ['3', 'Expert']].map(([v, t]) => `<button type="button" data-diff="${v}" aria-pressed="${String(diffActuelle) === v}">${t}</button>`).join('')}</div>`);
      root.querySelectorAll('[data-diff]').forEach((b) => { b.onclick = () => { api.save({ diff: Number(b.getAttribute('data-diff')) }); root.querySelectorAll('[data-diff]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); if (cfg.onDifficulte) cfg.onDifficulte(Number(b.getAttribute('data-diff')), api); }; });
      api.chargement(1);
      $('.ksh-play').onclick = () => begin(modeParDefaut);
      $('.ksh-play-autre').onclick = () => begin(modeParDefaut === 'cours' ? 'detente' : 'cours');
      const bGuide = $('.ksh-play-guide'); if (bGuide) bGuide.onclick = () => begin('guide');
      $('.ksh-acc-instr').onclick = showInstr;
      leconServie().then((lecons) => {
        const zone = $('#ksh-lecon'); if (!zone) return;
        if (!lecons.length) { zone.innerHTML = '<span class="ksh-lecon-attente">Jeu libre, hors programme.</span>'; return; }
        zone.innerHTML = 'Leçon servie : ' + lecons.map((l) => `<a class="ksh-lecon-lien" href="${l.url}">${l.icone} ${esc(l.titre)}</a>`).join(' · ');
        const notions = [...new Set(lecons.flatMap((l) => l.notions))].slice(0, 3);
        api.notionsLecon = notions; api.lienFiche = lecons[0] ? lecons[0].url : null; api.lecons = lecons; ajouterBoutonFiche();
        const conseil = $('#ksh-conseil'); if (conseil && notions.length) conseil.textContent = 'Dans cette leçon : ' + notions.join(', ') + '.';
        const app = $('#ksh-apprendre');
        if (app && notions.length) { app.hidden = false; app.innerHTML = `<h4>📘 Ce que tu vas apprendre</h4><ul>${notions.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>`; }
      });
      buddy.say((intro.greet || ('Salut ! ' + (cfg.title || '') + ' : prête à jouer ?')), 'joyeux');
    }

    function setMode(m) {
      mode = m; api.mode = m;
      const mb = $('.ksh-mode'); mb.dataset.mode = m; mb.querySelector('.ksh-modelbl').textContent = m === 'cours' ? 'Cours' : m === 'guide' ? 'Guidé' : 'Détente';
      $('.ksh-level-wrap').style.display = (m === 'cours') ? '' : 'none';
    }

    function begin(m) {
      setMode(m);
      $('.ksh-accueil').hidden = true;
      started = true; paused = false;
      // D12 : un compteur discret du temps de jeu, si le jeu n'en affiche pas lui-même.
      setTimeout(() => { if (started && $('.ksh-timer-wrap').hidden) { timer.show(true); timer.reset(0); timer.start(); } }, 800);
      try { ac() && ac().resume && ac().resume(); } catch (e) {}
      banqueJouee = false; const bandeauGuide = $('.ksh-guide'); if (bandeauGuide) bandeauGuide.hidden = true; api.attenteLegende = null;
      if (cfg.onStart) cfg.onStart(m === 'guide' ? 'detente' : m, api);
      if (m === 'guide') setTimeout(guider, 700);
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
      api.setScore(0); api.setProgress(0); api.setStars(0); banqueJouee = false; api.attenteLegende = null;
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
      // Priorité 1 : le referrer interne /learning* : il conserve la query string
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
      if (won || o.score != null) { try { fetch('/api/learning/game-score', { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ gameId: cfg.id, title: cfg.title, score: Math.round(sc), stars: stars, won: !!won, lowerIsBetter: !!cfg.lowerIsBetter, mode, detail: detailComplet(o) }) }).catch(function () {}); } catch (e) {} }
      const learned = (o.learned || cfg.learned || []).length ? (o.learned || cfg.learned) : (api.notionsLecon || []).map((n) => 'Cette partie travaille : ' + n + '.');
      $('.ksh-fin').innerHTML = `
        <div class="ksh-card" role="dialog" aria-label="Fin de partie">
          <div class="ksh-fin-stars">${star(stars >= 1) + star(stars >= 2) + star(stars >= 3)}</div>
          <div class="ksh-finlabel">${won ? 'Bravo !' : 'Continue, tu y es presque !'}</div>
          <h2 class="ksh-h" style="text-align:center;font-size:22px">${o.title || (won ? 'Niveau réussi' : 'Réessaie')}</h2>
          ${o.score != null ? `<div class="ksh-finscore" style="border-bottom:4px solid ${dom.color}">${Math.round(sc)}</div><div class="ksh-finlabel" style="margin-bottom:16px">points${sc >= best && sc > 0 ? ' · nouveau record !' : ''}</div>` : ''}
          <p class="ksh-seuils">${cfg.seuils || 'Les étoiles : 1 dès que la partie est finie, 2 à partir de 70 % de réussite, 3 à partir de 90 %. Dans Opaline, une étoile est gagnée à partir de 2 étoiles ici.'}</p>
          ${learned.length ? `<div class="ksh-learned"><h4>💡 Ce que tu as appris</h4><ul>${learned.map(l => `<li>${l}</li>`).join('')}</ul></div>` : ''}
          ${regarde()}
          <div class="ksh-row" style="justify-content:center">
            <button class="ksh-b primary ksh-frestart">↺ Rejouer</button>
            ${o.onNext ? `<button class="ksh-b ksh-fnext">${o.nextLabel || 'Niveau suivant'} ▸</button>` : ''}
            ${o.memeTirage ? '<button class="ksh-b ksh-fmeme" title="La même série de questions, dans le même ordre">Même tirage</button>' : ''}
            ${api.lienFiche ? `<a class="ksh-b" href="${api.lienFiche}">Revenir à la fiche</a>` : ''}
            <button class="ksh-b ksh-fquit">Quitter</button>
          </div>
        </div>`;
      $('.ksh-fin').hidden = false;
      buddy.say(won ? (o.buddy || 'Excellent travail ! Tu as compris l\'essentiel.') : (o.buddy || 'Pas grave, recommence : tu vas y arriver.'), won ? 'celebration' : 'rassurant');
      if (won) { api.sound('win'); if (!REDUCED && buddy.celebrate) buddy.celebrate(); }
      $('.ksh-frestart').onclick = restart;
      $('.ksh-fquit').onclick = quit;
      if (o.onNext) $('.ksh-fnext').onclick = () => { $('.ksh-fin').hidden = true; o.onNext(); };
      if (o.memeTirage) $('.ksh-fmeme').onclick = () => { $('.ksh-fin').hidden = true; o.memeTirage(); };
    }

    /* ---------- E12 : les questions de la leçon, tirées de la banque d'Opaline, avant la fin d'un monde en mode cours ---------- */
    let banqueJouee = false;
    function quizBanque(o) {
      return api.banqueLecon().then((items) => {
        if (!items || items.length < 4) return o;
        const alea = api.aleatoire(api.graine() + 7);
        const tirage = items.slice().sort(() => alea() - 0.5).slice(0, 5);
        return new Promise((fin) => {
          let i = 0; let justes = 0; const ratees = [];
          const ecran = document.createElement('div'); ecran.className = 'ksh-screen ksh-banque'; root.appendChild(ecran);
          function terminer() {
            ecran.remove();
            const d = Object.assign({}, o.detail || {}, { banque: { justes, total: tirage.length, ratees } });
            const acc = justes / tirage.length; const etoilesBanque = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
            const stars = o.stars != null ? Math.max(1, Math.min(3, Math.round((o.stars + etoilesBanque) / 2))) : etoilesBanque;
            ETAT.journal.push({ type: 'banque', nom: justes + '/' + tirage.length, t: Date.now() });
            fin(Object.assign({}, o, { score: (o.score || 0) + justes * 50, stars, detail: d, title: (o.title ? o.title + ' · ' : '') + justes + '/' + tirage.length + ' aux questions de la leçon' }));
          }
          function question() {
            if (i >= tirage.length) { terminer(); return; }
            const q = tirage[i];
            const choix = q.type === 'vraifaux' ? ['Vrai', 'Faux'] : (q.choix || []).slice();
            const bonne = q.type === 'vraifaux' ? (q.reponse ? 'Vrai' : 'Faux') : (q.choix || [])[q.reponse];
            ecran.innerHTML = `<div class="ksh-card" role="dialog" aria-label="Questions de la leçon">
              <div class="ksh-dtag" style="--dtag:${dom.color};margin-bottom:10px">Questions de la leçon · ${i + 1} sur ${tirage.length}</div>
              <h2 class="ksh-h" style="font-size:18px">${q.q}</h2>
              <div class="ksh-banque-opts">${choix.map((c, k) => `<button class="ksh-b" data-c="${esc(c)}" data-touche="${k + 1}"><i>${k + 1}</i>${esc(c)}</button>`).join('')}</div>
              <p class="ksh-sub ksh-banque-fb" hidden></p>
              <div class="ksh-row"><button class="ksh-b primary ksh-banque-suite" hidden>${i + 1 < tirage.length ? 'Suivant ▸' : 'Voir le résultat ▸'}</button></div></div>`;
            const suite = ecran.querySelector('.ksh-banque-suite');
            ecran.querySelectorAll('[data-c]').forEach((b) => {
              b.onclick = () => {
                if (!suite.hidden) return;
                const ok = b.getAttribute('data-c') === bonne;
                ecran.querySelectorAll('[data-c]').forEach((x) => { x.disabled = true; if (x.getAttribute('data-c') === bonne) x.classList.add('ok'); });
                if (!ok) { b.classList.add('no'); ratees.push(String(q.q).replace(/<[^>]+>/g, '').slice(0, 80)); api.sound('bad'); } else { justes += 1; api.sound('good'); }
                const fb = ecran.querySelector('.ksh-banque-fb'); fb.hidden = false;
                fb.innerHTML = (ok ? '<b>Juste.</b> ' : '<b>La bonne réponse : ' + esc(bonne) + '.</b> ') + (q.explication || '');
                suite.hidden = false; suite.focus();
                api.say(ok ? 'Juste. ' + (q.explication || '') : 'La bonne réponse est « ' + bonne + ' ». ' + (q.explication || ''), ok ? 'fier' : 'rassurant');
              };
            });
            suite.onclick = () => { i += 1; question(); };
          }
          api.say('Cinq questions de la leçon, comme dans une série. Réponds avec les boutons ou les touches 1 à 4.', 'concentre');
          question();
        });
      }).catch(() => o);
    }
    document.addEventListener('keydown', (e) => {
      const b = root.querySelector('.ksh-banque') || root.querySelector('.ksh-defi:not([hidden])'); if (!b || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (/^[1-4]$/.test(e.key)) { const c = b.querySelector(`[data-touche="${e.key}"]:not(:disabled)`); if (c) { e.preventDefault(); c.click(); } }
      if (e.key === 'Enter') { const n = b.querySelector('.ksh-banque-suite:not([hidden]), [data-suite], [data-valider]'); if (n) { e.preventDefault(); n.click(); } }
    });

    /* ---------- Défis d'un monde : une suite de consignes, chacune une action (qcm, toucher, régler) ---------- */
    api.defis = function (liste, options) {
      options = options || {};
      let bandeau = $('.ksh-defi'); if (!bandeau) { bandeau = document.createElement('div'); bandeau.className = 'ksh-guide ksh-defi'; bandeau.setAttribute('role', 'status'); root.appendChild(bandeau); }
      let i = 0; let justes = 0; const ratees = []; const total = liste.length;
      api.setProgress(0); api.setLevel('1/' + total);
      const nettoyer = (t) => String(t == null ? '' : t).replace(/<[^>]+>/g, '');
      function fin() {
        bandeau.hidden = true; api.attenteLegende = null;
        const acc = justes / Math.max(1, total);
        api.win({ score: justes * 100, stars: acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1, title: justes + '/' + total + ' défis réussis', detail: { justes, total, ratees }, buddy: acc >= 0.9 ? 'Tous les défis, ou presque : très bien.' : 'Bien. Rejoue pour viser le sans-faute.', onNext: options.rejouer, nextLabel: 'Rejouer les défis' });
      }
      function suivant() { i += 1; api.setProgress(i / total); if (i >= total) { fin(); return; } api.setLevel((i + 1) + '/' + total); poser(); }
      function conclure(ok, d, bonne) {
        api.attenteLegende = null;
        if (ok) { justes += 1; api.addScore(100); api.sound('good'); } else { ratees.push(nettoyer(d.texte).slice(0, 80)); api.sound('bad'); }
        bandeau.innerHTML = `<b>${ok ? 'Juste.' : 'Pas cette fois.'}</b><span>${!ok && bonne ? 'La réponse : ' + bonne + '. ' : ''}${d.explication || ''}</span><button class="ksh-b primary" type="button" data-suite>${i + 1 < total ? 'Suivant ▸' : 'Résultat ▸'}</button>`;
        const b = bandeau.querySelector('[data-suite]'); b.focus(); b.onclick = suivant;
        api.say((ok ? 'Juste. ' : 'La réponse : ' + nettoyer(bonne) + '. ') + nettoyer(d.explication), ok ? 'fier' : 'rassurant');
        if (d.apres) { try { d.apres(ok); } catch (e) {} }
      }
      function poser() {
        const d = liste[i]; bandeau.hidden = false; api.attenteLegende = null;
        if (d.avant) { try { d.avant(); } catch (e) {} }
        const tete = `<b>Défi ${i + 1} sur ${total}</b><span>${d.texte}</span>`;
        if (d.type === 'qcm') {
          bandeau.innerHTML = tete + `<div class="ksh-defi-opts">${d.choix.map((c, k) => `<button class="ksh-b" type="button" data-k="${k}" data-touche="${k + 1}"><i>${k + 1}</i>${esc(c)}</button>`).join('')}</div>`;
          bandeau.querySelectorAll('[data-k]').forEach((b) => { b.onclick = () => conclure(Number(b.getAttribute('data-k')) === d.reponse, d, esc(d.choix[d.reponse])); });
        } else if (d.type === 'toucher') {
          bandeau.innerHTML = tete + '<button class="ksh-b" type="button" data-passer>Passer ▸</button>';
          api.attenteLegende = (nom) => { if (nom === d.cible) conclure(true, d, d.cible); else { api.sound('bad'); api.toast('Ça, c\'est ' + nom + '. Cherche : ' + d.cible + '.', 2200); } };
          bandeau.querySelector('[data-passer]').onclick = () => conclure(false, d, esc(d.cible));
        } else {
          bandeau.innerHTML = tete + `<button class="ksh-b primary" type="button" data-valider>${esc(d.bouton || 'Valider')}</button>`;
          let essais = 0;
          bandeau.querySelector('[data-valider]').onclick = () => {
            let ok = false; try { ok = !!d.verifier(); } catch (e) { ok = false; }
            if (ok) { conclure(true, d, ''); return; }
            essais += 1; api.sound('bad'); api.toast(d.indice || 'Pas encore. Regarde les valeurs affichées.', 2600);
            if (essais >= 3 && !bandeau.querySelector('[data-passer]')) { bandeau.querySelector('[data-valider]').insertAdjacentHTML('afterend', '<button class="ksh-b" type="button" data-passer>Passer ▸</button>'); bandeau.querySelector('[data-passer]').onclick = () => conclure(false, d, ''); }
          };
        }
        api.say(nettoyer(d.texte), 'concentre');
      }
      poser();
      return { arreter: () => { bandeau.hidden = true; api.attenteLegende = null; } };
    };

    /* ---------- E13 : la fiche de la leçon dans un panneau, sans quitter le jeu ---------- */
    function ajouterBoutonFiche() {
      if (!api.lecons || !api.lecons.length || $('.ksh-fiche')) return;
      const b = document.createElement('button'); b.className = 'ksh-ib ksh-fiche'; b.title = 'La fiche de la leçon (F)'; b.setAttribute('aria-label', 'Ouvrir la fiche de la leçon');
      b.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5V5.5M8 7h8M8 11h8"/></svg>';
      $('.ksh-btns').insertBefore(b, $('.ksh-btns').firstChild);
      b.onclick = () => { const p = $('.ksh-fiche-panneau'); if (p && !p.hidden) { p.hidden = true; return; } api.ouvrirFiche(); };
    }
    api.ouvrirFiche = function (section) {
      const l = (api.lecons || [])[0]; if (!l) return Promise.resolve(false);
      return (window.CONTENU && window.CONTENU[l.mid] ? Promise.resolve() : chargerScript('/data/eleve/' + l.mid + '.js').catch(() => chargerScript('/data/contenu/' + l.mid + '.js'))).then(() => {
        const c = window.CONTENU && window.CONTENU[l.mid] && window.CONTENU[l.mid][l.ref] && window.CONTENU[l.mid][l.ref].cours;
        if (!c) { api.toast('La fiche n\'est pas disponible ici. Le lien « Revenir à la fiche » l\'ouvre dans Opaline.', 3000); return false; }
        let p = $('.ksh-fiche-panneau');
        if (!p) { p = document.createElement('aside'); p.className = 'ksh-fiche-panneau'; p.setAttribute('aria-label', 'Fiche de la leçon'); root.appendChild(p); }
        p.innerHTML = `<div class="ksh-fiche-tete"><b>${esc((l.icone || '') + ' ' + c.titre)}</b><button class="ksh-ib ksh-fiche-fermer" aria-label="Fermer la fiche">✕</button></div>
          <nav class="ksh-fiche-plan" aria-label="Plan de la fiche">${(c.plan || []).map((x) => `<button type="button" data-section="${esc(x.id || '')}" data-titre="${esc(x.texte)}">${esc(x.texte)}</button>`).join('')}</nav>
          <div class="ksh-fiche-corps">${c.html || ''}</div>
          <p class="ksh-fiche-pied"><a class="ksh-b" href="${l.url}">Ouvrir dans Opaline</a></p>`;
        p.hidden = false;
        const corps = p.querySelector('.ksh-fiche-corps');
        const aller = (id, titre) => {
          const norm = (t) => String(t || '').toLowerCase().replace(/^\d+[.)]\s*/, '').trim();
          let cible = id ? corps.querySelector('#' + id.replace(/[^a-zA-Z0-9_-]/g, '')) : null;
          if (!cible) cible = [...corps.querySelectorAll('h2, h3')].find((h) => norm(h.textContent) === norm(titre) || norm(h.textContent).indexOf(norm(titre)) !== -1);
          if (cible) cible.scrollIntoView({ block: 'start', behavior: REDUCED ? 'auto' : 'smooth' });
          p.querySelectorAll('.ksh-fiche-plan button').forEach((x) => x.setAttribute('aria-current', String(x.getAttribute('data-titre') === titre)));
        };
        p.querySelectorAll('.ksh-fiche-plan button').forEach((b) => { b.onclick = () => aller(b.getAttribute('data-section'), b.getAttribute('data-titre')); });
        p.querySelector('.ksh-fiche-fermer').onclick = () => { p.hidden = true; const bf = $('.ksh-fiche'); if (bf) bf.focus(); };
        if (section) aller(null, section);
        ETAT.journal.push({ type: 'fiche', nom: section || c.titre, t: Date.now() });
        p.querySelector('.ksh-fiche-fermer').focus();
        return true;
      }).catch(() => false);
    };

    /* ---------- E15 : mode guidé, Opale enchaîne regarder, nommer, répondre ---------- */
    function guider() {
      let bandeau = $('.ksh-guide'); if (!bandeau) { bandeau = document.createElement('div'); bandeau.className = 'ksh-guide'; bandeau.setAttribute('role', 'status'); root.appendChild(bandeau); }
      const etape = (n, texte, bouton, cb, delai) => {
        bandeau.hidden = false; bandeau.innerHTML = `<b>Étape ${n} sur 3</b><span>${esc(texte)}</span>${bouton ? `<button class="ksh-b primary" type="button">${esc(bouton)}</button>` : ''}`;
        const b = bandeau.querySelector('button'); if (b) { b.disabled = !!delai; if (delai) setTimeout(() => { b.disabled = false; b.focus(); }, delai); b.onclick = cb; }
        api.say(texte, 'concentre'); ETAT.journal.push({ type: 'guide', nom: 'étape ' + n, t: Date.now() });
      };
      function repondre() {
        api.attenteLegende = null;
        etape(3, 'Réponds. Cinq questions de la leçon arrivent, une à la fois.', 'Je suis prête ▸', () => { bandeau.hidden = true; api.win({ score: 0, stars: 2, title: 'Visite guidée terminée', learned: cfg.learned, buddy: 'Regarder, nommer, répondre : la visite est complète.' }); });
      }
      etape(1, 'Regarde. Tourne la scène avec un doigt ou la souris, zoome avec deux doigts ou la molette. Rien à répondre pour l\'instant.', 'J\'ai regardé ▸', () => {
        if (api.rassemblerLegendes) api.rassemblerLegendes();
        const cibles = ETAT.legendes.slice().sort(() => Math.random() - 0.5).slice(0, 3);
        if (!cibles.length) { repondre(); return; }
        let k = 0;
        const nommer = () => {
          if (k >= cibles.length) { repondre(); return; }
          const c = cibles[k];
          etape(2, 'Nomme. Touche dans la scène : ' + c.nom + '.', 'Passer ▸', () => { api.attenteLegende = null; k += 1; nommer(); });
          api.attenteLegende = (nom) => {
            if (nom === c.nom) { api.sound('good'); api.addScore(100); api.toast('Oui, c\'est ' + c.nom + '.', 2200); k += 1; api.attenteLegende = null; setTimeout(nommer, 900); }
            else { api.sound('bad'); api.toast('Ça, c\'est ' + nom + '. Cherche : ' + c.nom + '.', 2400); }
          };
        };
        nommer();
      }, REDUCED ? 0 : 8000);
    }

    /* ---------- E17, E30 : le détail envoyé avec le score et « ce que tu as regardé » ---------- */
    function detailComplet(o) {
      const d = Object.assign({}, o.detail || {});
      const touches = [...new Set(ETAT.journal.filter((j) => j.type === 'legende').map((j) => j.nom))];
      if (ETAT.journal.length) d.journal = { touches: touches.slice(0, 20), fiche: ETAT.journal.filter((j) => j.type === 'fiche').length, guide: ETAT.journal.filter((j) => j.type === 'guide').length, banque: ETAT.journal.filter((j) => j.type === 'banque').map((j) => j.nom).slice(-1)[0] || null };
      if (ETAT.ips.length) d.perf = { ips: Math.round(ETAT.ips.reduce((a, b) => a + b, 0) / ETAT.ips.length), chargement_ms: ETAT.chargementMs, qualite: ETAT.qualite, ratio: ETAT.ratio, mobile: window.matchMedia('(max-width: 640px), (pointer: coarse)').matches };
      d.duree_s = Math.round((performance.now() - ETAT.debut) / 1000);
      return Object.keys(d).length ? d : null;
    }
    function regarde() {
      const touches = [...new Set(ETAT.journal.filter((j) => j.type === 'legende').map((j) => j.nom))];
      if (!touches.length) return '';
      return `<div class="ksh-learned"><h4>👀 Ce que tu as regardé de près</h4><p>${touches.slice(0, 12).map(esc).join(' · ')}${touches.length > 12 ? ' · et ' + (touches.length - 12) + ' autre(s)' : ''}</p></div>`;
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
    // D21 : l'onglet perd le focus, le jeu se met en pause.
    document.addEventListener('visibilitychange', () => { if (document.hidden && started && !paused && $('.ksh-fin').hidden && $('.ksh-accueil').hidden) showPause(); });
    buddy.addEventListener('hint', () => { if (cfg.onHint) cfg.onHint(api); else api.hint(cfg.intro && cfg.intro.hint ? cfg.intro.hint : 'Observe bien les indices à l\'écran !'); });
    buddy.addEventListener('why', () => { if (cfg.onWhy) cfg.onWhy(api); else api.say(cfg.intro && cfg.intro.why ? cfg.intro.why : 'Chaque bonne réponse renforce ta compréhension du sujet.', 'idee'); });
    buddy.addEventListener('mute-change', (e) => { muted = e.detail; syncSound(); });
    $('.ksh-pause');

    setMode('detente');
    renderAccueil();
    api.showPause = showPause; api.restart = restart; api.quit = quit;
    /* D27 : passe d'accessibilité commune : un nom pour chaque champ, des rôles cohérents, les zones qui défilent atteignables au clavier. */
    function accessibiliser() {
      try {
        document.querySelectorAll('input:not([type="hidden"]), select, textarea').forEach((el) => {
          if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.closest('label') || (el.id && document.querySelector(`label[for="${el.id}"]`)) || el.getAttribute('title')) return;
          let nom = '';
          const prev = el.previousElementSibling; if (prev && /LABEL|SPAN|B|STRONG|LEGEND|P|H\d/.test(prev.tagName)) nom = prev.textContent.trim();
          if (!nom && el.parentElement) { const t = [...el.parentElement.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(' ').trim(); if (t) nom = t; }
          if (!nom && el.parentElement && el.parentElement.previousElementSibling) nom = el.parentElement.previousElementSibling.textContent.trim();
          if (!nom && el.placeholder) nom = el.placeholder;
          if (!nom && el.id) nom = el.id.replace(/^[a-z]{2,3}(?=[A-Z])/, '').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ');
          el.setAttribute('aria-label', (nom || 'Réglage').replace(/\s+/g, ' ').slice(0, 80));
        });
        document.querySelectorAll('[role="tablist"] > button:not([role]), [role="tablist"] > a:not([role])').forEach((b) => { b.setAttribute('role', 'tab'); if (!b.hasAttribute('aria-selected')) b.setAttribute('aria-selected', b.getAttribute('aria-pressed') === 'true' ? 'true' : 'false'); b.removeAttribute('aria-pressed'); });
        document.querySelectorAll('[role="tablist"] > :not([role="tab"]):not(button):not(a)').forEach((x) => { if (!x.querySelector('[role="tab"]')) x.setAttribute('role', 'presentation'); });
        document.querySelectorAll('[role="tablist"] :is(button, a):not([role])').forEach((b) => b.setAttribute('role', 'tab'));
        document.querySelectorAll('[role="tab"][aria-pressed]').forEach((b) => { b.setAttribute('aria-selected', b.getAttribute('aria-pressed') === 'true' ? 'true' : 'false'); b.removeAttribute('aria-pressed'); });
        document.querySelectorAll('[role="listbox"] > button:not([role]), [role="menu"] > button:not([role])').forEach((b) => b.setAttribute('role', b.parentElement.getAttribute('role') === 'menu' ? 'menuitem' : 'option'));
        stage.querySelectorAll('div, section, ul, pre').forEach((el) => {
          if (el.hasAttribute('tabindex') || el.querySelector('a, button, input, select, textarea, [tabindex]')) return;
          const cs = window.getComputedStyle(el); const defile = /auto|scroll/.test(cs.overflowX + cs.overflowY) && (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2);
          if (defile) { el.setAttribute('tabindex', '0'); if (!el.getAttribute('aria-label') && !el.getAttribute('role')) el.setAttribute('aria-label', 'Zone qui défile'); }
        });
      } catch (e) { /* la passe ne bloque jamais le jeu */ }
    }
    [400, 1500, 4000, 9000].forEach((t) => setTimeout(accessibiliser, t));
    try { let deb = null; new MutationObserver(() => { clearTimeout(deb); deb = setTimeout(accessibiliser, 350); }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-pressed'] }); } catch (e) {}
    api.accessibiliser = accessibiliser;
    window.__kshApi = api;
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

  /**
   * Socle commun des mondes 3D (E3 à E17, E29, E30). Un monde l'appelle une fois, après avoir créé
   * scène, caméra, rendu et contrôles :
   *   window.Konstrio.monde3d({ THREE, scene, camera, renderer, controls, bloom, composer,
   *     exposition, hdri, RGBELoader, brouillard: { couleur, densite }, lisser, BufferGeometryUtils,
   *     legende: (objet) => ({ nom, phrase }) | null, legendes: [{ nom, phrase }], surQualite: (cran) => {} })
   */
  function monde3d(o) {
    const api = window.__kshApi; const THREE = o.THREE; const scene = o.scene; const camera = o.camera; const renderer = o.renderer;
    if (!api || !THREE || !scene || !camera || !renderer) return null;
    ETAT.monde = true;
    const mobile = window.matchMedia('(max-width: 640px), (pointer: coarse)').matches;
    const lire = (g) => { try { return typeof g === 'function' ? g() : g; } catch (e) { return null; } };
    const bloom = () => lire(o.bloom); const composer = () => lire(o.composer);
    const stage = api.stage;

    /* E3 : correction des couleurs unifiée. */
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = o.exposition != null ? o.exposition : (renderer.toneMappingExposure || 1);

    /* E4 : environnement lumineux à partir d'une carte HDRI, si le monde n'en a pas déjà. */
    if (o.hdri && o.RGBELoader && !scene.environment) {
      try {
        const pm = new THREE.PMREMGenerator(renderer);
        new o.RGBELoader().load(o.hdri, (t) => { t.mapping = THREE.EquirectangularReflectionMapping; scene.environment = pm.fromEquirectangular(t).texture; t.dispose(); pm.dispose(); }, undefined, () => {});
      } catch (e) { /* sans environnement */ }
    }

    /* E9 : brouillard de profondeur. */
    if (o.brouillard && !scene.fog) scene.fog = new THREE.FogExp2(o.brouillard.couleur != null ? o.brouillard.couleur : 0x0b1220, o.brouillard.densite || 0.012);

    /* E6 : écran de chargement branché sur le gestionnaire de chargement de three. */
    try {
      const LM = THREE.DefaultLoadingManager; let garde = null;
      const conseil = () => (api.notionsLecon && api.notionsLecon.length ? 'Dans cette leçon : ' + api.notionsLecon.join(', ') + '.' : 'Le monde se prépare…');
      LM.onStart = () => { api.chargement(0.05, conseil()); clearTimeout(garde); garde = setTimeout(() => api.chargement(1), 8000); };
      LM.onProgress = (url, n, total) => { api.chargement(Math.min(0.95, n / Math.max(1, total)), conseil()); };
      LM.onLoad = () => { api.chargement(1); clearTimeout(garde); if (ETAT.chargementMs == null) ETAT.chargementMs = Math.round(performance.now()); };
      LM.onError = () => {};
    } catch (e) { /* pas de gestionnaire */ }

    /* E10 : normales lissées sur les maillages marqués `userData.lisser` (ou la liste donnée). */
    if (o.lisser) {
      setTimeout(() => {
        try {
          scene.traverse((m) => {
            if (!m.isMesh || !m.geometry) return;
            const voulu = o.lisser === true ? m.userData.lisser : (Array.isArray(o.lisser) && o.lisser.indexOf(m) !== -1);
            if (!voulu || m.userData.lisse) return;
            let g = m.geometry;
            if (o.BufferGeometryUtils && o.BufferGeometryUtils.mergeVertices) { const g2 = o.BufferGeometryUtils.mergeVertices(g, 1e-4); if (g2 !== g) { g.dispose(); g = g2; } }
            g.computeVertexNormals(); m.geometry = g; m.userData.lisse = true;
          });
        } catch (e) { /* on garde les facettes */ }
      }, 1500);
    }

    /* E8 : qualité en trois crans, mémorisée pour tous les mondes. */
    const tailles = new Map();
    function appliquerQualite(cran, silencieux) {
      cran = Math.max(1, Math.min(3, Number(cran) || 2)); ETAT.qualite = cran;
      try { localStorage.setItem('opaline.qualite3d', String(cran)); } catch (e) {}
      const ratio = Math.min(window.devicePixelRatio || 1, [1, 1.5, 2][cran - 1]); renderer.setPixelRatio(ratio); ETAT.ratio = ratio;
      const c = composer(); if (c && c.setPixelRatio) { c.setPixelRatio(ratio); c.setSize(stage.clientWidth, stage.clientHeight); }
      const ombres = cran > 1; if (renderer.shadowMap.enabled !== ombres) { renderer.shadowMap.enabled = ombres; scene.traverse((x) => { if (x.material) (Array.isArray(x.material) ? x.material : [x.material]).forEach((m) => { m.needsUpdate = true; }); }); }
      scene.traverse((l) => {
        if (!l.isLight || !l.shadow || !l.shadow.mapSize) return;
        if (!tailles.has(l)) tailles.set(l, l.shadow.mapSize.x || 1024);
        const base = tailles.get(l); const voulu = cran === 3 ? base : Math.min(base, cran === 2 ? 1024 : 512);
        if (l.shadow.mapSize.x !== voulu) { l.shadow.mapSize.set(voulu, voulu); if (l.shadow.map) { l.shadow.map.dispose(); l.shadow.map = null; } }
      });
      const b = bloom(); if (b) b.enabled = cran > 1 && !REDUCED;
      if (o.surQualite) { try { o.surQualite(cran); } catch (e) {} }
      if (!silencieux) api.toast('Qualité : ' + ['basse', 'moyenne', 'haute'][cran - 1] + '. Touche Q pour changer.', 2200);
      document.querySelectorAll('.ksh-qualite-choix button').forEach((x) => x.setAttribute('aria-pressed', String(Number(x.getAttribute('data-cran')) === cran)));
    }
    let qualite = Number(localStorage.getItem('opaline.qualite3d')) || (mobile ? 2 : 3);
    setTimeout(() => appliquerQualite(qualite, true), 0);
    const cycler = () => { qualite = qualite % 3 + 1; appliquerQualite(qualite); };

    /* E30 : images par seconde moyennes, mesurées tant que l'onglet est visible. */
    let images = 0; let depuis = performance.now(); let premiere = false;
    (function mesurer() {
      images += 1; const t = performance.now();
      if (!premiere) { premiere = true; if (ETAT.chargementMs == null) setTimeout(() => { if (ETAT.chargementMs == null) ETAT.chargementMs = Math.round(t); }, 2500); }
      if (t - depuis >= 2000) { if (!document.hidden) { ETAT.ips.push(images / ((t - depuis) / 1000)); if (ETAT.ips.length > 90) ETAT.ips.shift(); } images = 0; depuis = t; }
      requestAnimationFrame(mesurer);
    })();

    /* E14 : légende d'un objet touché (sans glisser), et journal de bord (E17). */
    const ray = new THREE.Raycaster(); const pointeur = new THREE.Vector2();
    let bulle = document.querySelector('.ksh-legende'); if (!bulle) { bulle = document.createElement('div'); bulle.className = 'ksh-legende'; bulle.hidden = true; bulle.setAttribute('role', 'status'); document.body.appendChild(bulle); }
    let bulleT = null;
    function montrerLegende(leg, x, y) {
      bulle.innerHTML = `<b>${String(leg.nom || '').replace(/</g, '&lt;')}</b>${leg.phrase ? `<span>${String(leg.phrase).replace(/</g, '&lt;')}</span>` : ''}`;
      bulle.hidden = false; bulle.style.opacity = '1';
      const w = Math.min(320, window.innerWidth * 0.8);
      bulle.style.left = Math.max(w / 2 + 8, Math.min(window.innerWidth - w / 2 - 8, x)) + 'px'; bulle.style.top = Math.max(70, y) + 'px';
      clearTimeout(bulleT); bulleT = setTimeout(() => { bulle.hidden = true; }, 6000);
      ETAT.journal.push({ type: 'legende', nom: leg.nom, t: Date.now() });
      if (api.attenteLegende) api.attenteLegende(leg.nom);
    }
    function legendeDe(objet) {
      let obj = objet; let n = 0;
      while (obj && n < 8) {
        const l = (obj.userData && obj.userData.legende) || (o.legende ? lire(() => o.legende(obj)) : null);
        if (l && l.nom) return l;
        obj = obj.parent; n += 1;
      }
      return null;
    }
    const dom = renderer.domElement; let appui = null;
    dom.addEventListener('pointerdown', (e) => { appui = { x: e.clientX, y: e.clientY, t: performance.now() }; });
    dom.addEventListener('pointerup', (e) => {
      if (!appui) return; const d = Math.hypot(e.clientX - appui.x, e.clientY - appui.y); const dt = performance.now() - appui.t; appui = null;
      if (d > 8 || dt > 700) return;
      const r = dom.getBoundingClientRect(); pointeur.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      try {
        ray.setFromCamera(pointeur, camera);
        const hits = ray.intersectObjects(scene.children, true).slice(0, 12);
        for (const h of hits) { const leg = legendeDe(h.object); if (leg) { montrerLegende(leg, e.clientX, e.clientY); return; } }
      } catch (err) { /* pas de légende */ }
    });
    api.legender = (objet, nom, phrase) => { if (objet) objet.userData.legende = { nom, phrase }; if (nom && !ETAT.legendes.some((l) => l.nom === nom)) ETAT.legendes.push({ nom, phrase }); };
    const rassembler = () => { try { (lire(o.legendes) || []).forEach((l) => { if (l && l.nom && !ETAT.legendes.some((x) => x.nom === l.nom)) ETAT.legendes.push(l); }); scene.traverse((x) => { const l = x.userData && x.userData.legende; if (l && l.nom && !ETAT.legendes.some((y) => y.nom === l.nom)) ETAT.legendes.push(l); }); } catch (e) { /* liste partielle */ } };
    setTimeout(rassembler, 1500); api.rassemblerLegendes = rassembler;

    /* E29 : mêmes touches et mêmes gestes partout, un panneau « commandes » identique. */
    const controls = o.controls;
    const depart = { position: camera.position.clone(), cible: controls && controls.target ? controls.target.clone() : new THREE.Vector3() };
    if (controls) { controls.enableDamping = true; if (!controls.dampingFactor || controls.dampingFactor > 0.12) controls.dampingFactor = 0.08; controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }; controls.zoomSpeed = 0.9; controls.rotateSpeed = mobile ? 0.7 : 0.9; }
    function tourner(k) {
      if (!controls || controls.enableRotate === false) return;
      const off = camera.position.clone().sub(controls.target); const sph = new THREE.Spherical().setFromVector3(off);
      if (k === 'ArrowLeft') sph.theta += 0.15; if (k === 'ArrowRight') sph.theta -= 0.15; if (k === 'ArrowUp') sph.phi -= 0.12; if (k === 'ArrowDown') sph.phi += 0.12;
      sph.phi = Math.max((controls.minPolarAngle || 0) + 0.02, Math.min((controls.maxPolarAngle == null ? Math.PI : controls.maxPolarAngle) - 0.02, sph.phi));
      camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(sph)); camera.lookAt(controls.target);
    }
    function zoomer(f) {
      if (!controls || controls.enableZoom === false) return;
      const off = camera.position.clone().sub(controls.target); let d = off.length() * f;
      d = Math.max(controls.minDistance || 0.1, Math.min(controls.maxDistance || Infinity, d));
      camera.position.copy(controls.target).add(off.normalize().multiplyScalar(d));
    }
    function recentrer() { if (!controls) return; camera.position.copy(depart.position); controls.target.copy(depart.cible); camera.lookAt(controls.target); controls.update(); api.toast('Vue recentrée.', 1200); }
    function panneauCommandes() {
      if (document.querySelector('.ksh-screen.ksh-cmd-panneau')) return;
      const wrap = document.createElement('div'); wrap.className = 'ksh-screen ksh-cmd-panneau';
      const lignes = [['Un doigt · clic gauche', 'tourner la scène'], ['Deux doigts · molette', 'zoomer'], ['Deux doigts · clic droit', 'déplacer'], ['Toucher un objet', 'sa légende'], ['← → ↑ ↓', 'tourner'], ['+ et -', 'zoomer'], ['R', 'recentrer la vue'], ['F', 'la fiche de la leçon'], ['Q', 'changer la qualité'], ['H', 'ce panneau'], ['1 à 4', 'répondre aux questions'], ['Échap', 'pause']];
      wrap.innerHTML = `<div class="ksh-card" role="dialog" aria-label="Commandes"><h2 class="ksh-h">Commandes</h2><p class="ksh-sub">Les mêmes dans tous les mondes.</p>
        <div class="ksh-commandes">${lignes.map(([k, v]) => `<kbd>${k}</kbd><span>${v}</span>`).join('')}</div>
        <p class="ksh-sub" style="margin:0 0 4px"><b>Qualité du rendu</b> : basse si l'appareil chauffe ou saccade.</p>
        <div class="ksh-qualite-choix">${[1, 2, 3].map((c) => `<button class="ksh-b" type="button" data-cran="${c}" aria-pressed="${c === qualite}">${['Basse', 'Moyenne', 'Haute'][c - 1]}</button>`).join('')}</div>
        <div class="ksh-row"><button class="ksh-b primary ksh-close">Compris</button></div></div>`;
      document.querySelector('.ksh-root').appendChild(wrap);
      wrap.querySelectorAll('[data-cran]').forEach((b) => { b.onclick = () => { qualite = Number(b.getAttribute('data-cran')); appliquerQualite(qualite); }; });
      wrap.querySelector('.ksh-close').onclick = () => wrap.remove();
      wrap.addEventListener('click', (e) => { if (e.target === wrap) wrap.remove(); });
      wrap.querySelector('.ksh-close').focus();
    }
    const btns = document.querySelector('.ksh-btns');
    if (btns && !btns.querySelector('.ksh-cmd')) {
      const bc = document.createElement('button'); bc.className = 'ksh-ib ksh-cmd'; bc.title = 'Commandes et qualité (H)'; bc.setAttribute('aria-label', 'Commandes et qualité');
      bc.innerHTML = '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10"/></svg>';
      bc.onclick = panneauCommandes; btns.insertBefore(bc, btns.firstChild);
    }
    setTimeout(() => {
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
        const t = e.target; if (t && /INPUT|TEXTAREA|SELECT/.test(t.tagName)) return;
        if (document.querySelector('.ksh-screen:not([hidden]) .ksh-card')) return;
        const k = e.key;
        if (/^Arrow(Left|Right|Up|Down)$/.test(k)) { tourner(k); e.preventDefault(); }
        else if (k === '+' || k === '=') zoomer(0.88);
        else if (k === '-') zoomer(1.14);
        else if (k === 'r' || k === 'R') recentrer();
        else if (k === 'f' || k === 'F') { const p = document.querySelector('.ksh-fiche-panneau'); if (p && !p.hidden) p.hidden = true; else api.ouvrirFiche(); }
        else if (k === 'q' || k === 'Q') cycler();
        else if (k === 'h' || k === 'H') panneauCommandes();
      });
    }, 0);

    return { appliquerQualite, recentrer, legende: montrerLegende, journal: ETAT.journal };
  }

  /** E9 : un rayon de lumière volumétrique simple (cône additif), pour les mondes extérieurs. */
  function rayonLumineux(THREE, scene, depuis, vers, couleur, rayon, opacite) {
    if (REDUCED) return null;
    const a = new THREE.Vector3().fromArray(depuis); const b = new THREE.Vector3().fromArray(vers); const h = a.distanceTo(b);
    const geo = new THREE.CylinderGeometry(rayon || 1.5, (rayon || 1.5) * 6, h, 24, 1, true);
    const mat = new THREE.MeshBasicMaterial({ color: couleur == null ? 0xfff2c0 : couleur, transparent: true, opacity: opacite == null ? 0.08 : opacite, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    const m = new THREE.Mesh(geo, mat); m.position.copy(a.clone().add(b).multiplyScalar(0.5));
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize().negate()); m.renderOrder = 5; m.frustumCulled = false; m.raycast = () => {};
    scene.add(m); return m;
  }
  window.Konstrio = { createGame, REDUCED, adapterRendu, declarer3d, monde3d, rayonLumineux, unlock: function (id) { if (window.KonstrioAch) window.KonstrioAch.unlock(id); } };
})();
