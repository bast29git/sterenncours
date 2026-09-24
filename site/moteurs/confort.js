/* ============================================================================
 * confort.js — « Accessibilité & confort » du Learning Hub (vitrine).
 *
 * Panneau d'accessibilité pensé pour les enfants EN DIFFICULTÉ (scolaire
 * classique) et à tous les besoins de lecture et d'attention. 100 % autonome
 * (aucune dépendance), réglages RÉELS persistés en localStorage, appliqués à
 * <html>. Se recharge sur navigation SPA Astro (astro:after-swap).
 * Respecte prefers-reduced-motion.
 *
 * Organisation : bouton d'accessibilité universel (pictogramme ISO « personne »)
 * toujours visible + panneau en 2 onglets :
 *  — « Profils » : presets 1-clic (Lecture facilitée, Concentration, Sérénité,
 *    Grand texte/malvoyance, Neutre), modifiables ensuite finement ;
 *  — « Réglages fins » : police lisible, taille (4 crans), interligne (3 crans),
 *    lettres espacées, thème (auto/clair/sombre/crème), contraste élevé, moins
 *    d'animations, grand curseur, règle de lecture, masque de lecture, lecture
 *    audio (vitesse lente/normale), sons on/off, minuteur de pauses bienveillant
 *    (15/20/30 min, jamais bloquant), temps libre (pas de chrono).
 *
 * Drapeaux publics lus par les jeux/leçons :
 *   html[data-confort-temps="libre"]   → pas de chrono punitif
 *   html[data-confort-previsible]      → annoncer « ce qui va se passer »
 *   html[data-confort-focus]           → mode focus (une chose à la fois)
 *   html[data-confort-sons="off"]      → sons coupés (+ évènement cf-sons-change)
 * ========================================================================== */
(function () {
  'use strict';
  if (window.__konstrioConfort) { window.__konstrioConfort.mount(); return; }

  var LS = 'konstrio-confort';
  var PKEY = 'konstrio-confort-pause-debut';
  var REDUCED = false;
  try { REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  var DEFAULTS = {
    profil: '',         // '' | dyslexie | tdah | autisme | malvoyance
    police: 'defaut',   // defaut | lisible | dys
    taille: 0,          // 0..3 (crans ; -1 encore accepté pour compat)
    interligne: 0,      // 0 | 1 | 2 (normal / aéré / très aéré)
    espacement: false,  // lettres & mots espacés
    theme: '',          // '' auto | clair | sombre | creme
    contraste: false,   // contraste élevé
    calme: REDUCED,     // moins d'animations / décors sobres
    curseur: false,     // grand curseur
    regle: false,       // règle de lecture (bandeau qui suit le pointeur)
    masque: false,      // masque de lecture (assombrit tout sauf la ligne)
    focus: false,       // mode focus (une chose à la fois)
    sons: true,         // sons des activités
    voix: 'normal',     // lent | normal (lecture audio)
    pause: 0,           // 0 | 15 | 20 | 30 minutes (rappel de pause)
    tempsLibre: false,  // désactive les chronos punitifs (drapeau lu par les jeux)
  };

  function load() {
    var raw = {};
    try { raw = JSON.parse(localStorage.getItem(LS) || '{}') || {}; } catch (e) { raw = {}; }
    var s = Object.assign({}, DEFAULTS, raw);
    // Migration : l'ancien « espacement » gérait aussi l'interligne.
    if (raw.espacement && typeof raw.interligne === 'undefined') s.interligne = 2;
    // Le réglage « sons » suit le mute déjà choisi dans les jeux si jamais fixé ici.
    if (typeof raw.sons === 'undefined') {
      try { s.sons = localStorage.getItem('konstrio-muted') !== '1'; } catch (e) {}
    }
    return s;
  }
  function save(s) { try { localStorage.setItem(LS, JSON.stringify(s)); } catch (e) {} }

  var state = load();

  // ── Feuille de style des réglages (injectée une fois) ──────────────────────
  var CURSOR = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'42\' height=\'42\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M5 2v18l5-4.6 3 6.3 3.6-1.7-3-6.2H20z\' fill=\'%23151633\' stroke=\'%23ffffff\' stroke-width=\'1.6\' stroke-linejoin=\'round\'/%3E%3C/svg%3E") 4 2, auto';

  var CSS = [
    /* Échelle de police (n'affecte pas le panneau lui-même) */
    'html.cf-scale-n1 body{font-size:.94em}',
    'html.cf-scale-1 body{font-size:1.08em}',
    'html.cf-scale-2 body{font-size:1.18em}',
    'html.cf-scale-3 body{font-size:1.32em}',
    /* Polices lisibles : appliquées au contenu, JAMAIS au panneau (.cf-ui) */
    'html.cf-font-lisible body :not(.cf-ui):not(.cf-ui *){font-family:Verdana,Tahoma,"Segoe UI",system-ui,sans-serif!important}',
    'html.cf-font-dys body :not(.cf-ui):not(.cf-ui *){font-family:"Comic Sans MS","Trebuchet MS",Verdana,Tahoma,sans-serif!important;letter-spacing:.02em}',
    /* Interligne (3 crans) & espacement des lettres */
    'html.cf-lh-1 body :not(.cf-ui):not(.cf-ui *){line-height:1.75!important}',
    'html.cf-lh-2 body :not(.cf-ui):not(.cf-ui *){line-height:2.05!important}',
    'html.cf-space body :not(.cf-ui):not(.cf-ui *){letter-spacing:.06em!important;word-spacing:.18em!important}',
    'html.cf-lh-2 p,html.cf-lh-2 li,html.cf-space p,html.cf-space li{max-width:66ch}',
    /* Thème crème (fond doux, moins de blanc pur) */
    'html.cf-creme{--bg:#F6EFDD;--surface:#FFFBEF;--surface-2:#F3EAD3;--surface-3:#EDE2C6;--border:#E2D6B6;--color-paper:#FFFBEF;--color-surface:#F3EAD3;--color-line:#E2D6B6;--grid-fade:rgba(90,74,30,.05)}',
    'html.cf-creme body{background:#F6EFDD}',
    /* Contraste élevé : renforce les tokens de la DA (clair ET sombre) */
    'html.cf-contrast[data-theme="dark"]{--color-ink:#fff;--fg:#fff;--color-ink-mute:#e6e9f5;--fg-muted:#e6e9f5;--color-line:#8a93b5;--border:#8a93b5}',
    'html.cf-contrast[data-theme="light"],html.cf-contrast:not([data-theme]){--color-ink:#000;--fg:#000;--color-ink-mute:#1b2033;--fg-muted:#1b2033;--color-line:#3a4468;--border:#3a4468}',
    'html.cf-contrast body :not(.cf-ui) a{text-decoration:underline}',
    'html.cf-contrast :focus-visible{outline:3px solid #ffbf00!important;outline-offset:2px!important}',
    /* Mode calme : coupe animations & atténue les décorations */
    'html.cf-calme *,html.cf-calme *::before,html.cf-calme *::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important}',
    'html.cf-calme .lh-hero,html.cf-calme .rk-home-hero,html.cf-calme .rk-hero{background:var(--color-surface,var(--surface,#f2f2f6))!important;color:var(--color-ink,var(--fg,#111))!important;box-shadow:none!important}',
    'html.cf-calme .lh-pcard-ban,html.cf-calme .lh-dom-ban,html.cf-calme .lh-mat-ban,html.cf-calme .lh-pcard-wm,html.cf-calme .lh-dom-wm,html.cf-calme .lh-mat-wm{display:none!important}',
    'html.cf-calme .lh-badge,html.cf-calme .rk-home-eyebrow{background:var(--color-surface,var(--surface,#f2f2f6))!important;color:var(--color-ink-mute,var(--fg-muted,#555))!important}',
    /* Mode focus : une chose à la fois, on masque le hors-tâche */
    'html.cf-focus .lh-hero,html.cf-focus .rk-home-hero,html.cf-focus .rk-hero,html.cf-focus .lh-pcard-ban,html.cf-focus .lh-dom-ban,html.cf-focus .lh-mat-ban,html.cf-focus .lh-pcard-wm,html.cf-focus .lh-dom-wm,html.cf-focus .lh-mat-wm,html.cf-focus footer{display:none!important}',
    'html.cf-focus .ksh-stat.opt,html.cf-focus .ksh-prog-wrap{display:none!important}',
    'html.cf-focus .lh-badge,html.cf-focus .rk-home-eyebrow{background:var(--color-surface,var(--surface,#f2f2f6))!important;color:var(--color-ink-mute,var(--fg-muted,#555))!important}',
    /* Grand curseur */
    'html.cf-cursor,html.cf-cursor body,html.cf-cursor body *{cursor:' + CURSOR + '!important}',
    /* Règle de lecture : bandeau surligné qui suit le pointeur (sans assombrir) */
    '.cf-ruler{position:fixed;left:0;right:0;height:3em;pointer-events:none;z-index:2147483000;background:rgba(255,205,66,.22);border-top:2px solid rgba(233,168,0,.9);border-bottom:2px solid rgba(233,168,0,.9);transition:top .04s linear}',
    /* Masque de lecture : assombrit tout sauf la ligne lue */
    '.cf-mask{position:fixed;left:0;right:0;height:96px;pointer-events:none;z-index:2147482999;box-shadow:0 0 0 100vmax rgba(8,10,22,.62);border-radius:4px;transition:top .04s linear}',
    '@media (prefers-reduced-motion: reduce){.cf-ruler,.cf-mask{transition:none}}',
    /* Bouton flottant + panneau (namespace .cf-ui, non impacté par les réglages) */
    '.cf-fab{position:fixed;left:18px;bottom:18px;z-index:2147483001;width:58px;height:58px;border-radius:50%;border:2px solid rgba(255,255,255,.65);background:#1B6FB8;color:#fff;cursor:pointer;box-shadow:0 10px 28px -8px rgba(27,111,184,.75);display:grid;place-items:center;font:inherit}',
    '.cf-fab:hover{transform:translateY(-2px)}.cf-fab:focus-visible{outline:3px solid #ffbf00;outline-offset:3px}',
    '.cf-fab svg{width:34px;height:34px}',
    '.cf-fab-tip{position:absolute;left:66px;top:50%;transform:translateY(-50%);background:#13142B;color:#fff;font:700 .78rem Manrope,system-ui,sans-serif;padding:7px 12px;border-radius:9px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .15s;box-shadow:0 6px 18px rgba(0,0,0,.3)}',
    '.cf-fab:hover .cf-fab-tip,.cf-fab:focus-visible .cf-fab-tip{opacity:1}',
    '.cf-fab-badge{position:absolute;top:-2px;right:-2px;width:16px;height:16px;border-radius:50%;background:#23A06E;border:2.5px solid #fff}',
    '.cf-panel{position:fixed;left:18px;bottom:88px;z-index:2147483002;width:min(390px,calc(100vw - 36px));max-height:calc(100vh - 124px);overflow:auto;background:var(--surface,var(--color-paper,#fff));color:var(--fg,var(--color-ink,#111));border:1px solid var(--border,var(--color-line,#ddd));border-radius:18px;box-shadow:0 24px 60px -20px rgba(0,0,0,.5);padding:16px;font-family:Manrope,system-ui,sans-serif}',
    '.cf-panel[hidden]{display:none}',
    '.cf-hd{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 10px}',
    '.cf-hd h2{font-size:1.05rem;font-weight:800;margin:0;font-family:Archivo,system-ui,sans-serif;display:flex;align-items:center;gap:8px}',
    '.cf-x{border:none;background:none;cursor:pointer;font-size:1.5rem;line-height:1;color:var(--fg-muted,var(--color-ink-mute,#666));width:44px;height:44px;border-radius:10px;flex:none}',
    '.cf-x:hover{background:var(--surface-2,var(--color-surface,#eee))}',
    '.cf-x:focus-visible{outline:3px solid #ffbf00;outline-offset:2px}',
    '.cf-tabs{display:flex;gap:6px;margin:0 0 14px;border:1px solid var(--border,var(--color-line,#ddd));border-radius:12px;padding:4px;background:var(--surface-2,var(--color-surface,#f4f4f8))}',
    '.cf-tab{flex:1;min-height:44px;border:none;border-radius:9px;background:transparent;color:inherit;cursor:pointer;font:800 .85rem Manrope,system-ui,sans-serif}',
    '.cf-tab[aria-selected="true"]{background:#1B6FB8;color:#fff;box-shadow:0 4px 12px -4px rgba(27,111,184,.6)}',
    '.cf-tab:focus-visible{outline:3px solid #ffbf00;outline-offset:2px}',
    '.cf-grp{margin:0 0 14px}',
    '.cf-lbl{display:block;font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--fg-muted,var(--color-ink-mute,#666));margin:0 0 7px}',
    '.cf-seg{display:flex;gap:6px;flex-wrap:wrap}',
    '.cf-seg button{flex:1;min-width:58px;min-height:44px;border:1px solid var(--border,var(--color-line,#ddd));background:var(--surface,var(--color-paper,#fff));color:inherit;border-radius:12px;cursor:pointer;font:700 .82rem Manrope,system-ui,sans-serif;padding:6px 8px}',
    '.cf-seg button[aria-pressed="true"]{background:#1B6FB8;border-color:#1B6FB8;color:#fff}',
    '.cf-seg button:focus-visible{outline:3px solid #ffbf00;outline-offset:2px}',
    '.cf-tog{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;min-height:52px;border:1px solid var(--border,var(--color-line,#ddd));background:var(--surface,var(--color-paper,#fff));color:inherit;border-radius:13px;cursor:pointer;font:700 .88rem Manrope,system-ui,sans-serif;padding:8px 12px;margin:0 0 8px;text-align:left}',
    '.cf-tog:focus-visible{outline:3px solid #ffbf00;outline-offset:2px}',
    '.cf-tog-tx{display:flex;flex-direction:column;gap:2px}.cf-tog-tx small{font-weight:500;font-size:.72rem;color:var(--fg-muted,var(--color-ink-mute,#666))}',
    '.cf-tog-ic{width:26px;height:26px;flex:none}',
    '.cf-switch{flex:none;width:44px;height:26px;border-radius:999px;background:var(--border,var(--color-line,#ccc));position:relative;transition:background .15s}',
    '.cf-switch::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:transform .15s;box-shadow:0 1px 3px rgba(0,0,0,.25)}',
    '.cf-tog[aria-pressed="true"] .cf-switch{background:#23A06E}.cf-tog[aria-pressed="true"] .cf-switch::after{transform:translateX(18px)}',
    /* Cartes de profils (1 clic) */
    '.cf-prof{display:flex;align-items:flex-start;gap:12px;width:100%;border:2px solid var(--border,var(--color-line,#ddd));background:var(--surface,var(--color-paper,#fff));color:inherit;border-radius:14px;cursor:pointer;font:700 .9rem Manrope,system-ui,sans-serif;padding:12px;margin:0 0 8px;text-align:left;min-height:52px}',
    '.cf-prof:focus-visible{outline:3px solid #ffbf00;outline-offset:2px}',
    '.cf-prof[aria-pressed="true"]{border-color:#1B6FB8;background:rgba(27,111,184,.08)}',
    '.cf-prof-ic{flex:none;width:40px;height:40px;border-radius:11px;display:grid;place-items:center;color:#fff}',
    '.cf-prof-ic svg{width:23px;height:23px}',
    '.cf-prof-tx{display:flex;flex-direction:column;gap:3px}',
    '.cf-prof-tx small{font-weight:500;font-size:.74rem;line-height:1.4;color:var(--fg-muted,var(--color-ink-mute,#666))}',
    '.cf-prof-on{margin-left:auto;flex:none;font-size:.68rem;font-weight:800;color:#137A5E;background:#E3F2EE;border-radius:999px;padding:3px 9px;align-self:center}',
    '.cf-actions{display:flex;gap:8px;margin-top:6px}',
    '.cf-btn{flex:1;min-height:44px;border-radius:12px;border:1px solid var(--border,var(--color-line,#ddd));background:var(--surface,var(--color-paper,#fff));color:inherit;cursor:pointer;font:700 .82rem Manrope,system-ui,sans-serif;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:0 12px}',
    '.cf-btn.primary{background:#1B6FB8;border-color:#1B6FB8;color:#fff}',
    '.cf-btn:focus-visible{outline:3px solid #ffbf00;outline-offset:2px}',
    '.cf-note{font-size:.72rem;color:var(--fg-muted,var(--color-ink-mute,#666));margin:10px 0 0;line-height:1.5}',
    '.cf-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
    /* Minuteur de pause : pastille discrète + rappel bienveillant, jamais bloquant */
    '.cf-pill{position:fixed;left:84px;bottom:24px;z-index:2147483000;display:flex;align-items:center;gap:8px;background:var(--surface,var(--color-paper,#fff));color:var(--fg,var(--color-ink,#111));border:1px solid var(--border,var(--color-line,#ddd));border-radius:999px;padding:7px 14px;font:700 .76rem Manrope,system-ui,sans-serif;box-shadow:0 8px 22px -8px rgba(0,0,0,.35)}',
    '.cf-pill svg{width:16px;height:16px;flex:none}',
    '.cf-pp-bar{width:56px;height:6px;border-radius:999px;background:var(--surface-3,var(--color-surface,#e8e8ef));overflow:hidden}',
    '.cf-pp-bar i{display:block;height:100%;width:0;background:#1B6FB8;border-radius:999px}',
    '.cf-remind{position:fixed;left:50%;bottom:96px;transform:translateX(-50%);z-index:2147483002;width:min(420px,calc(100vw - 32px));background:var(--surface,var(--color-paper,#fff));color:var(--fg,var(--color-ink,#111));border:1px solid var(--border,var(--color-line,#ddd));border-radius:16px;box-shadow:0 24px 60px -20px rgba(0,0,0,.5);padding:16px;font-family:Manrope,system-ui,sans-serif}',
    '.cf-remind p{margin:0 0 12px;font-size:.92rem;font-weight:600;line-height:1.5}',
    '@media (max-width:640px){.cf-pill{left:auto;right:14px;bottom:18px}.cf-panel{left:12px;right:12px;width:auto}}',
  ].join('\n');

  function ensureStyle() {
    if (document.getElementById('cf-style')) return;
    var st = document.createElement('style'); st.id = 'cf-style'; st.textContent = CSS;
    document.head.appendChild(st);
  }

  // ── Application des réglages à <html> ──────────────────────────────────────
  function isActive() {
    return !!(state.profil || state.police !== 'defaut' || state.taille !== 0 ||
      state.interligne !== 0 || state.espacement || state.theme || state.contraste ||
      (state.calme && !REDUCED) || state.curseur || state.regle || state.masque ||
      state.focus || state.pause > 0 || state.tempsLibre || !state.sons);
  }

  function apply() {
    var h = document.documentElement;
    h.classList.remove('cf-scale-n1', 'cf-scale-1', 'cf-scale-2', 'cf-scale-3');
    if (state.taille === -1) h.classList.add('cf-scale-n1');
    else if (state.taille > 0) h.classList.add('cf-scale-' + Math.min(3, state.taille));
    h.classList.remove('cf-font-lisible', 'cf-font-dys');
    if (state.police === 'lisible') h.classList.add('cf-font-lisible');
    else if (state.police === 'dys') h.classList.add('cf-font-dys');
    h.classList.remove('cf-lh-1', 'cf-lh-2');
    if (state.interligne > 0) h.classList.add('cf-lh-' + Math.min(2, state.interligne));
    h.classList.toggle('cf-space', !!state.espacement);
    h.classList.toggle('cf-contrast', !!state.contraste);
    h.classList.toggle('cf-calme', !!state.calme);
    h.classList.toggle('cf-cursor', !!state.curseur);
    h.classList.toggle('cf-focus', !!state.focus);
    h.classList.toggle('cf-creme', state.theme === 'creme');
    // Thème imposé (clair/sombre) : aligne l'attribut partagé du hub & des jeux.
    if (state.theme === 'clair' || state.theme === 'creme') h.setAttribute('data-theme', 'light');
    else if (state.theme === 'sombre') h.setAttribute('data-theme', 'dark');
    // Drapeaux publics lisibles par les jeux / leçons.
    if (state.tempsLibre) h.setAttribute('data-confort-temps', 'libre');
    else h.removeAttribute('data-confort-temps');
    if (state.profil === 'autisme') h.setAttribute('data-confort-previsible', '1');
    else h.removeAttribute('data-confort-previsible');
    if (state.focus) h.setAttribute('data-confort-focus', '1');
    else h.removeAttribute('data-confort-focus');
    h.setAttribute('data-confort-sons', state.sons ? 'on' : 'off');
    ruler(state.regle);
    mask(state.masque);
    pauseSync();
    badgeSync();
  }

  // Effets de bord volontaires (déclenchés par un choix utilisateur, pas au chargement).
  function syncSons() {
    try { localStorage.setItem('konstrio-muted', state.sons ? '0' : '1'); } catch (e) {}
    try { if (window.KonstrioAudio && window.KonstrioAudio.mute) window.KonstrioAudio.mute(!state.sons); } catch (e) {}
    try { document.dispatchEvent(new CustomEvent('cf-sons-change', { detail: { on: !!state.sons } })); } catch (e) {}
  }
  function syncTheme() {
    try {
      if (state.theme === 'clair' || state.theme === 'creme') localStorage.setItem('konstrio-theme', 'light');
      else if (state.theme === 'sombre') localStorage.setItem('konstrio-theme', 'dark');
    } catch (e) {}
  }

  // ── Règle & masque de lecture (suivent le pointeur / le doigt) ─────────────
  var rulerEl = null, maskEl = null, moveBound = false, lastY = 0;
  function onMove(e) {
    var y = (e.touches && e.touches[0] ? e.touches[0].clientY : e.clientY) || 0;
    lastY = y;
    if (rulerEl) rulerEl.style.top = Math.max(0, y - rulerEl.offsetHeight / 2) + 'px';
    if (maskEl) maskEl.style.top = Math.max(0, y - 48) + 'px';
  }
  function bindMove() {
    if (moveBound) return;
    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('touchmove', onMove, { passive: true });
    moveBound = true;
  }
  function ruler(on) {
    if (on) {
      if (!rulerEl) {
        rulerEl = document.createElement('div'); rulerEl.className = 'cf-ruler';
        rulerEl.setAttribute('aria-hidden', 'true');
        rulerEl.style.top = Math.max(0, (lastY || window.innerHeight / 2) - 24) + 'px';
        document.body.appendChild(rulerEl);
      }
      bindMove();
    } else if (rulerEl) { rulerEl.remove(); rulerEl = null; }
  }
  function mask(on) {
    if (on) {
      if (!maskEl) {
        maskEl = document.createElement('div'); maskEl.className = 'cf-mask';
        maskEl.setAttribute('aria-hidden', 'true');
        maskEl.style.top = Math.max(0, (lastY || window.innerHeight / 2) - 48) + 'px';
        document.body.appendChild(maskEl);
      }
      bindMove();
    } else if (maskEl) { maskEl.remove(); maskEl = null; }
  }

  // ── Minuteur de pauses : rappel bienveillant, jamais bloquant ───────
  var pauseInt = null, pausePill = null, remindEl = null;
  function pauseStart() {
    var t = 0;
    try { t = parseInt(localStorage.getItem(PKEY) || '0', 10) || 0; } catch (e) {}
    if (!t || t > Date.now()) { t = Date.now(); setPauseStart(t); }
    return t;
  }
  function setPauseStart(t) { try { localStorage.setItem(PKEY, String(t)); } catch (e) {} }
  function pauseTick() {
    if (!state.pause || !document.body) return;
    var limit = state.pause * 60000;
    var elapsed = Date.now() - pauseStart();
    if (pausePill) {
      var remain = Math.max(0, Math.ceil((limit - elapsed) / 60000));
      var tx = pausePill.querySelector('.cf-pp-tx');
      if (tx) tx.textContent = remain > 0 ? ('Pause dans ' + remain + ' min') : 'C\'est l\'heure de la pause';
      var bar = pausePill.querySelector('.cf-pp-bar i');
      if (bar) bar.style.width = (Math.max(0, Math.min(1, elapsed / limit)) * 100) + '%';
    }
    if (elapsed >= limit && !remindEl) showRemind(Math.round(elapsed / 60000));
  }
  function showRemind(mins) {
    if (remindEl) return;
    remindEl = document.createElement('div');
    remindEl.className = 'cf-remind cf-ui';
    remindEl.setAttribute('role', 'alertdialog');
    remindEl.setAttribute('aria-label', 'Pause conseillée');
    remindEl.innerHTML =
      '<p>Tu travailles depuis ' + mins + ' min — une petite pause ? Bouge un peu, bois de l\'eau, regarde au loin. Tu reprendras encore mieux.</p>' +
      '<div class="cf-actions">' +
        '<button class="cf-btn primary" data-pz-ok>Je fais une pause</button>' +
        '<button class="cf-btn" data-pz-later>Encore 5 min</button>' +
      '</div>';
    document.body.appendChild(remindEl);
    remindEl.querySelector('[data-pz-ok]').onclick = function () {
      setPauseStart(Date.now()); hideRemind(); pauseTick(); announce('Bonne pause ! Le minuteur repart de zéro.');
    };
    remindEl.querySelector('[data-pz-later]').onclick = function () {
      setPauseStart(Date.now() - state.pause * 60000 + 5 * 60000); hideRemind(); pauseTick();
      announce('D\'accord, encore 5 minutes.');
    };
    announce('Tu travailles depuis ' + mins + ' minutes. Une petite pause ?');
    var ok = remindEl.querySelector('[data-pz-ok]'); if (ok) ok.focus();
  }
  function hideRemind() { if (remindEl) { remindEl.remove(); remindEl = null; } }
  function pauseSync() {
    if (state.pause > 0) {
      if (!pausePill && document.body) {
        pausePill = document.createElement('div');
        pausePill.className = 'cf-pill cf-ui';
        pausePill.setAttribute('role', 'status');
        pausePill.innerHTML = svg(IC.clock, '') + '<span class="cf-pp-tx">Pause dans ' + state.pause + ' min</span><span class="cf-pp-bar" aria-hidden="true"><i></i></span>'
          + '<button type="button" class="cf-pp-x" aria-label="Arrêter le rappel de pause" title="Arrêter le rappel de pause">×</button>';
        pausePill.querySelector('.cf-pp-x').addEventListener('click', function () { state.pause = 0; persist(); apply(); announce('Rappel de pause arrêté.'); });
        document.body.appendChild(pausePill);
      }
      if (!pauseInt) pauseInt = setInterval(pauseTick, 5000);
      pauseTick();
    } else {
      if (pauseInt) { clearInterval(pauseInt); pauseInt = null; }
      if (pausePill) { pausePill.remove(); pausePill = null; }
      hideRemind();
    }
  }

  // ── Lecture audio (Web Speech API, FR) ─────────────────────────────────────
  function speak(text) {
    try {
      if (!('speechSynthesis' in window) || !text) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(text).slice(0, 4000));
      u.lang = 'fr-FR'; u.rate = (state.voix === 'lent') ? .72 : .95; u.pitch = 1;
      var vs = window.speechSynthesis.getVoices();
      var fr = vs.filter(function (v) { return /fr/i.test(v.lang); });
      if (fr[0]) u.voice = fr[0];
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }
  function stopSpeak() { try { window.speechSynthesis.cancel(); } catch (e) {} }
  function readPage() {
    // Lit la sélection si présente, sinon le contenu principal visible.
    var sel = String(window.getSelection ? window.getSelection() : '').trim();
    if (sel) { speak(sel); return; }
    var main = document.querySelector('.rk-read.show') || document.querySelector('.lh-view.on') ||
      document.querySelector('main') || document.querySelector('.ks-wrap') || document.body;
    var txt = (main.innerText || main.textContent || '').replace(/\s+/g, ' ').trim();
    speak(txt);
  }

  function announce(msg) {
    var live = document.getElementById('cf-live');
    if (!live) { live = document.createElement('div'); live.id = 'cf-live'; live.className = 'cf-sr'; live.setAttribute('aria-live', 'polite'); document.body.appendChild(live); }
    live.textContent = ''; setTimeout(function () { live.textContent = msg; }, 30);
  }

  // ── Pictogrammes (SVG inline, trait) ───────────────────────────────────────
  var IC = {
    /* Pictogramme d'accessibilité universel (personne bras ouverts dans un cercle) */
    a11y: '<circle cx="12" cy="12" r="10.3" stroke-width="1.6"/><circle cx="12" cy="6.6" r="1.9" fill="currentColor" stroke="none"/><path d="M5.8 9.4c4.1 1.15 8.3 1.15 12.4 0M12 10.9v3.3M12 14.2l-2.8 4.9M12 14.2l2.8 4.9" stroke-width="1.9"/>',
    text: '<path d="M5 6h14M12 6v12M9 18h6"/>',
    space: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    theme: '<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>',
    contrast: '<circle cx="12" cy="12" r="8"/><path d="M12 4v16" fill="currentColor"/>',
    calme: '<path d="M21 12.8A8 8 0 1 1 11.2 3a6 6 0 0 0 9.8 9.8z"/>',
    cursor: '<path d="M5 3v14l4.2-3.8 2.4 5.2 3-1.4-2.4-5.2H17z"/>',
    ruler: '<rect x="3" y="8" width="18" height="8" rx="1"/><path d="M7 8v3M11 8v4M15 8v3M19 8v4"/>',
    mask: '<rect x="3" y="10" width="18" height="5" rx="1"/><path d="M4 4h16M4 20h16" opacity=".45"/>',
    audio: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12"/>',
    mute: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="m22 9-6 6M16 9l6 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    focus: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2v3.5M12 18.5V22M2 12h3.5M18.5 12H22"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h5v16H6a2 2 0 0 0-2 2z"/><path d="M20 5a2 2 0 0 0-2-2h-5v16h5a2 2 0 0 1 2 2z"/>',
    leaf: '<path d="M5 20c0-8 4-14 14-15-1 10-7 14-14 15z"/><path d="M5 20c3-5 7-9 11-11"/>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.8"/>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>',
  };
  function svg(p, cls) { return '<svg class="' + (cls || 'cf-tog-ic') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; }

  var fab = null, panel = null, open = false, tab = 'prof';

  function badgeSync() {
    if (!fab) return;
    var b = fab.querySelector('.cf-fab-badge');
    if (b) b.hidden = !isActive();
  }

  // ── Profils 1-clic (presets combinés, modifiables ensuite) ─────────────────
  var PROFILS = [
    { id: 'dyslexie', color: '#9B2BB0', ic: IC.book, titre: 'Lecture facilitée',
      sub: 'Police lisible, texte grand et aéré, fond crème, règle de lecture.' },
    { id: 'tdah', color: '#F5A623', ic: IC.focus, titre: 'Concentration',
      sub: 'Une chose à la fois : décors masqués, rappel de pause toutes les 20 min.' },
    { id: 'autisme', color: '#1E8C7A', ic: IC.leaf, titre: 'Sérénité',
      sub: 'Zéro animation, sons coupés, couleurs douces, étapes annoncées à l\'avance.' },
    { id: 'malvoyance', color: '#1B6FB8', ic: IC.eye, titre: 'Grands caractères',
      sub: 'Texte très grand, contraste élevé, grand curseur bien visible.' },
    { id: '', color: '#565B75', ic: IC.reset, titre: 'Neutre',
      sub: 'Tout remettre comme au départ.' },
  ];

  function preset(id, focusKey) {
    var s = Object.assign({}, DEFAULTS);
    s.voix = state.voix;               // préférence de voix conservée
    s.sons = state.sons;
    if (id === 'dyslexie') {
      s.profil = 'dyslexie'; s.police = 'dys'; s.taille = 1; s.interligne = 2;
      s.espacement = true; s.theme = 'creme'; s.regle = true;
    } else if (id === 'tdah') {
      s.profil = 'tdah'; s.focus = true; s.pause = 0; s.calme = true;
    } else if (id === 'autisme') {
      s.profil = 'autisme'; s.calme = true; s.sons = false; s.theme = 'creme';
      s.tempsLibre = true;
    } else if (id === 'malvoyance') {
      s.profil = 'malvoyance'; s.taille = 3; s.contraste = true; s.curseur = true;
      s.interligne = 1;
    } else {
      s.sons = true; // Neutre : tout au départ, sons réactivés.
    }
    var wasPause = state.pause;
    state = s;
    if (state.pause > 0 && state.pause !== wasPause) setPauseStart(Date.now());
    syncSons(); syncTheme();
    var p = PROFILS.filter(function (x) { return x.id === id; })[0];
    commit(id ? ('Profil « ' + (p ? p.titre : id) + ' » activé. Tu peux encore ajuster chaque réglage dans l\'onglet Réglages fins.') : 'Tous les réglages ont été remis à zéro.', focusKey);
  }

  // ── Panneau (2 onglets : Profils / Réglages fins) ──────────────────────────
  function togHtml(id, ic, title, sub) {
    return '<button class="cf-tog" data-tog="' + id + '" data-f="tog-' + id + '" aria-pressed="' + (!!state[id]) + '">' +
      '<span style="display:flex;align-items:center;gap:10px">' + svg(ic) + '<span class="cf-tog-tx"><span>' + title + '</span><small>' + sub + '</small></span></span>' +
      '<span class="cf-switch" aria-hidden="true"></span></button>';
  }
  function segHtml(name, label, opts) {
    var h = '<div class="cf-grp"><span class="cf-lbl" id="cf-lbl-' + name + '">' + label + '</span><div class="cf-seg" role="group" aria-labelledby="cf-lbl-' + name + '">';
    for (var i = 0; i < opts.length; i++) {
      var o = opts[i];
      h += '<button data-set="' + name + '" data-val="' + o.v + '" data-f="' + name + '-' + o.v + '" aria-pressed="' + o.on + '"' + (o.aria ? ' aria-label="' + o.aria + '"' : '') + '>' + o.t + '</button>';
    }
    return h + '</div></div>';
  }

  function profPane() {
    var h = '<p style="margin:0 0 12px;font-size:.8rem;color:var(--fg-muted,var(--color-ink-mute,#666));line-height:1.5">Choisis un profil en 1 clic — il applique plusieurs réglages d\'un coup. Tu peux ensuite tout ajuster dans « Réglages fins ».</p>';
    for (var i = 0; i < PROFILS.length; i++) {
      var p = PROFILS[i];
      var on = state.profil === p.id && (p.id !== '' || false);
      h += '<button class="cf-prof" data-prof="' + p.id + '" data-f="prof-' + (p.id || 'neutre') + '" aria-pressed="' + on + '">' +
        '<span class="cf-prof-ic" style="background:' + p.color + '">' + svg(p.ic, '') + '</span>' +
        '<span class="cf-prof-tx"><span>' + p.titre + '</span><small>' + p.sub + '</small></span>' +
        (on ? '<span class="cf-prof-on">Actif</span>' : '') +
      '</button>';
    }
    h += '<p class="cf-note">Rien n\'est bloquant ni chronométré ici : chacun avance à son rythme.</p>';
    return h;
  }

  function regPane() {
    return (
      segHtml('police', 'Police', [
        { v: 'defaut', t: 'Standard', on: state.police === 'defaut' },
        { v: 'lisible', t: 'Lisible', on: state.police === 'lisible' },
        { v: 'dys', t: 'Adaptée dys', on: state.police === 'dys' },
      ]) +
      segHtml('taille', 'Taille du texte', [
        { v: '0', t: 'A', on: state.taille === 0, aria: 'Taille normale' },
        { v: '1', t: 'A+', on: state.taille === 1, aria: 'Taille grande' },
        { v: '2', t: 'A++', on: state.taille === 2, aria: 'Taille très grande' },
        { v: '3', t: 'A+++', on: state.taille === 3, aria: 'Taille maximale' },
      ]) +
      segHtml('interligne', 'Espace entre les lignes', [
        { v: '0', t: 'Normal', on: state.interligne === 0 },
        { v: '1', t: 'Aéré', on: state.interligne === 1 },
        { v: '2', t: 'Très aéré', on: state.interligne === 2 },
      ]) +
      segHtml('theme', 'Couleurs de fond', [
        { v: '', t: 'Auto', on: state.theme === '' },
        { v: 'clair', t: 'Clair', on: state.theme === 'clair' },
        { v: 'sombre', t: 'Sombre', on: state.theme === 'sombre' },
        { v: 'creme', t: 'Crème', on: state.theme === 'creme' },
      ]) +
      '<div class="cf-grp"><span class="cf-lbl">Affichage</span>' +
        togHtml('espacement', IC.space, 'Lettres espacées', 'Plus d\'air entre les lettres et les mots') +
        togHtml('contraste', IC.contrast, 'Contraste élevé', 'Couleurs plus tranchées, liens soulignés') +
        togHtml('calme', IC.calme, 'Moins d\'animations', 'Tout est immobile et sobre') +
        togHtml('curseur', IC.cursor, 'Grand curseur', 'Une flèche plus grosse, facile à suivre') +
      '</div>' +
      '<div class="cf-grp"><span class="cf-lbl">Aides de lecture</span>' +
        togHtml('regle', IC.ruler, 'Règle de lecture', 'Un bandeau surligné suit ta ligne') +
        togHtml('masque', IC.mask, 'Masque de lecture', 'Tout s\'assombrit sauf la ligne lue') +
        togHtml('focus', IC.focus, 'Mode focus', 'Une chose à la fois : les décors disparaissent') +
      '</div>' +
      '<div class="cf-grp"><span class="cf-lbl">Écoute</span><div class="cf-actions">' +
        '<button class="cf-btn primary" data-read data-f="read">' + svg(IC.audio, 'cf-tog-ic') + 'Lire la page</button>' +
        '<button class="cf-btn" data-stop data-f="stop">Stop</button>' +
      '</div></div>' +
      segHtml('voix', 'Vitesse de la voix', [
        { v: 'lent', t: 'Lente', on: state.voix === 'lent' },
        { v: 'normal', t: 'Normale', on: state.voix === 'normal' },
      ]) +
      '<div class="cf-grp">' +
        togHtml('sons', IC.audio, 'Sons des activités', 'Bruitages et musiques des jeux') +
      '</div>' +
      segHtml('pause', 'Rappel de pause', [
        { v: '0', t: 'Off', on: state.pause === 0, aria: 'Pas de rappel de pause' },
        { v: '15', t: '15 min', on: state.pause === 15 },
        { v: '20', t: '20 min', on: state.pause === 20 },
        { v: '30', t: '30 min', on: state.pause === 30 },
      ]) +
      '<div class="cf-grp">' +
        togHtml('tempsLibre', IC.clock, 'Temps libre', 'Pas de chrono, on prend son temps') +
      '</div>' +
      '<div class="cf-actions"><button class="cf-btn" data-reset data-f="reset">' + svg(IC.reset, 'cf-tog-ic') + 'Tout réinitialiser</button></div>' +
      '<p class="cf-note">Astuce : sélectionne un texte puis « Lire la page » pour n\'écouter que ce passage. Tes choix sont gardés sur cet appareil et suivent toutes les pages.</p>'
    );
  }

  function render(focusKey) {
    if (!panel) return;
    panel.innerHTML =
      '<div class="cf-hd"><h2 id="cf-title">' + svg(IC.a11y, 'cf-tog-ic') + 'Accessibilité &amp; confort</h2>' +
      '<button class="cf-x" data-x data-f="x" aria-label="Fermer le panneau d\'accessibilité">×</button></div>' +
      '<div class="cf-tabs" role="tablist" aria-label="Sections du panneau">' +
        '<button class="cf-tab" id="cf-tab-prof" role="tab" data-tab="prof" data-f="tab-prof" aria-selected="' + (tab === 'prof') + '" aria-controls="cf-pane-prof"' + (tab !== 'prof' ? ' tabindex="-1"' : '') + '>Profils</button>' +
        '<button class="cf-tab" id="cf-tab-reg" role="tab" data-tab="reg" data-f="tab-reg" aria-selected="' + (tab === 'reg') + '" aria-controls="cf-pane-reg"' + (tab !== 'reg' ? ' tabindex="-1"' : '') + '>Réglages fins</button>' +
      '</div>' +
      '<div id="cf-pane-prof" role="tabpanel" aria-labelledby="cf-tab-prof"' + (tab !== 'prof' ? ' hidden' : '') + '>' + profPane() + '</div>' +
      '<div id="cf-pane-reg" role="tabpanel" aria-labelledby="cf-tab-reg"' + (tab !== 'reg' ? ' hidden' : '') + '>' + (tab === 'reg' ? regPane() : '') + '</div>';

    // Câblage
    panel.querySelector('[data-x]').onclick = close;
    panel.querySelectorAll('[data-tab]').forEach(function (b) {
      b.onclick = function () { tab = b.dataset.tab; render('tab-' + tab); };
      b.onkeydown = function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault(); tab = (tab === 'prof') ? 'reg' : 'prof'; render('tab-' + tab);
        }
      };
    });
    panel.querySelectorAll('[data-prof]').forEach(function (b) {
      b.onclick = function () { preset(b.dataset.prof, b.dataset.f); };
    });
    panel.querySelectorAll('[data-set]').forEach(function (b) {
      b.onclick = function () {
        var k = b.dataset.set, v = b.dataset.val;
        if (k === 'taille' || k === 'interligne' || k === 'pause') v = parseInt(v, 10) || 0;
        var wasPause = state.pause;
        state[k] = v;
        if (k === 'theme') syncTheme();
        if (k === 'pause' && state.pause > 0 && state.pause !== wasPause) setPauseStart(Date.now());
        commit(labelFor(k, b), b.dataset.f);
      };
    });
    panel.querySelectorAll('[data-tog]').forEach(function (b) {
      b.onclick = function () {
        var k = b.dataset.tog; state[k] = !state[k];
        if (k === 'sons') syncSons();
        if (k === 'masque' && state.masque && state.regle) { state.regle = false; }
        commit((state[k] ? 'Activé : ' : 'Désactivé : ') + b.querySelector('.cf-tog-tx span').textContent, b.dataset.f);
      };
    });
    var r = panel.querySelector('[data-read]'); if (r) r.onclick = function () { readPage(); announce('Lecture en cours'); };
    var st = panel.querySelector('[data-stop]'); if (st) st.onclick = function () { stopSpeak(); announce('Lecture arrêtée'); };
    var rz = panel.querySelector('[data-reset]'); if (rz) rz.onclick = function () { preset('', 'reset'); };

    if (focusKey) {
      var f = panel.querySelector('[data-f="' + focusKey + '"]');
      if (f) f.focus();
    }
  }

  function labelFor(k, b) {
    var names = { police: 'Police', taille: 'Taille du texte', interligne: 'Espace entre les lignes', theme: 'Couleurs', voix: 'Vitesse de la voix', pause: 'Rappel de pause' };
    return (names[k] || k) + ' : ' + b.textContent.trim();
  }

  function commit(msg, focusKey) { save(state); apply(); render(focusKey); if (msg) announce(msg); }

  function openPanel() {
    open = true; panel.hidden = false; fab.setAttribute('aria-expanded', 'true');
    render();
    var first = panel.querySelector('.cf-tab[aria-selected="true"]') || panel.querySelector('button');
    if (first) first.focus();
  }
  function close() {
    open = false; panel.hidden = true; fab.setAttribute('aria-expanded', 'false');
    var retour = document.getElementById('e-btn-confort'); (retour && retour.offsetParent ? retour : fab).focus();
  }
  function toggle() { open ? close() : openPanel(); }

  function build() {
    if (document.querySelector('.cf-fab')) { fab = document.querySelector('.cf-fab'); panel = document.querySelector('.cf-panel'); return; }
    fab = document.createElement('button');
    fab.className = 'cf-fab cf-ui'; fab.type = 'button';
    fab.setAttribute('aria-label', 'Accessibilité et confort');
    fab.setAttribute('title', 'Accessibilité & confort');
    fab.setAttribute('aria-expanded', 'false'); fab.setAttribute('aria-controls', 'cf-panel');
    fab.setAttribute('aria-haspopup', 'dialog');
    fab.innerHTML = svg(IC.a11y, '') +
      '<span class="cf-fab-tip" aria-hidden="true">Accessibilité &amp; confort</span>' +
      '<span class="cf-fab-badge" hidden aria-hidden="true"></span>';
    panel = document.createElement('div');
    panel.className = 'cf-panel cf-ui'; panel.id = 'cf-panel'; panel.hidden = true;
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-labelledby', 'cf-title');
    document.body.appendChild(fab); document.body.appendChild(panel);
    fab.addEventListener('click', toggle);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) close(); });
    document.addEventListener('click', function (e) {
      // NB : un clic interne re-rend le panneau → la cible est détachée du DOM ;
      // on ne ferme que si la cible est toujours attachée ET vraiment extérieure.
      if (open && e.target && e.target.isConnected && !panel.contains(e.target) && e.target !== fab && !fab.contains(e.target)) close();
    });
    render();
  }

  function mount() {
    if (!document.body) { document.addEventListener('DOMContentLoaded', mount); return; }
    // Le rappel de pause n'est jamais actif par défaut : un réglage hérité est
    // remis à zéro une fois ; l'utilisatrice peut le rallumer dans le panneau.
    try {
      if (!localStorage.getItem('konstrio-confort-pause-raz')) {
        if (state.pause > 0) { state.pause = 0; persist(); }
        localStorage.setItem('konstrio-confort-pause-raz', '1');
      }
    } catch (e) {}
    ensureStyle(); build(); apply();
    // Précharge les voix (certains navigateurs les chargent en asynchrone).
    try { if ('speechSynthesis' in window) window.speechSynthesis.getVoices(); } catch (e) {}
  }

  window.__konstrioConfort = {
    mount: mount, apply: apply, speak: speak,
    state: function () { return state; },
    profil: function () { return state.profil; },
    /* Ouverture programmée du panneau (réutilisée par le lecteur de séquences). */
    open: function () { mount(); openPanel(); },
  };
  mount();
  // SPA Astro : le body est remplacé au swap → on remonte le widget.
  document.addEventListener('astro:after-swap', function () {
    state = load(); rulerEl = null; maskEl = null; pausePill = null; remindEl = null;
    if (pauseInt) { clearInterval(pauseInt); pauseInt = null; }
    fab = null; panel = null; open = false; moveBound = false;
    mount();
  });
  document.addEventListener('astro:page-load', mount);
})();
