/* ============================================================================
   Konstrio Learning — Galerie orbitale 3D des mondes (« worlds orbit »)
   ----------------------------------------------------------------------------
   Anneau orbital 3D réutilisable pour présenter les 20 mondes 3D du Learning
   Hub : chaque monde est une carte (texture canvas : dégradé du monde + emoji
   + titre) disposée sur un anneau légèrement incliné ; la carte face caméra
   est mise en avant (plus grande, éclairée), les autres s'estompent avec la
   profondeur ; fond d'étoiles discret.

   Three.js r160 chargé via l'importmap de la page hôte (specifier 'three'),
   sinon depuis le fichier LOCAL /learning/vendor/three.module.js (CSP 'self',
   aucune dépendance réseau externe).

   API publique : window.KonstrioWorldsOrbit
     .mount(el, worlds, opts) -> { dispose() }
        el     : élément hôte (vidé puis rempli par la lib)
        worlds : [{ id, titre, sousTitre, grad:[c1,c2], emoji, url, badge }]
        opts   : { onOpen(world), reduced:boolean }

   Interactions : drag horizontal (souris + tactile) et molette → rotation avec
   inertie + snap sur la carte la plus proche ; flèches ← → ; Entrée / clic sur
   la carte frontale → onOpen(world) ; clic sur une carte latérale → on l'amène
   devant ; pastilles de pagination sous le canvas ; auto-résilient au resize.

   Accessibilité & repli : si opts.reduced, prefers-reduced-motion,
   html.cf-calme (mode calme Confort) ou échec WebGL/three → AUCUN canvas :
   carrousel DOM horizontal à snap (mêmes cartes en CSS, mêmes interactions
   clic/clavier). Dans tous les cas : composant focusable,
   aria-roledescription="carrousel", annonces aria-live du monde courant.

   Perfs : ~22 draw calls (20 cartes + halo + étoiles), textures ≤ 512 px,
   requestAnimationFrame stoppé hors viewport (IntersectionObserver), onglet
   caché (visibilitychange) et au dispose().
   ============================================================================ */
(function () {
  'use strict';

  var THREE_URL = '/moteurs/vendor/three.module.js';
  var _threeP = null;
  function loadThree() {
    if (!_threeP) {
      _threeP = import(/* @vite-ignore */ 'three').catch(function () {
        return import(/* @vite-ignore */ THREE_URL);
      });
    }
    return _threeP;
  }

  /* ── Détection du mode « réduit » (préférence utilisateur ou site) ─────── */
  function prefersReduced() {
    try {
      if (document.documentElement.classList.contains('cf-calme')) return true;
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    } catch (e) { /* environnements sans matchMedia */ }
    return false;
  }

  /* ── Styles injectés une seule fois (canvas + fallback + pastilles) ─────── */
  var STYLE_ID = 'kwo-style';
  var CSS = [
    '.kwo{position:relative;display:block;width:100%;outline:none}',
    '.kwo:focus-visible{outline:3px solid #6E6BFF;outline-offset:4px;border-radius:18px}',
    '.kwo-stage{position:relative;width:100%;height:clamp(320px,52vw,460px);border-radius:18px;overflow:hidden;',
    ' background:radial-gradient(120% 130% at 50% -10%,#221a55 0%,#120e33 55%,#0a0824 100%);cursor:grab;touch-action:pan-y}',
    '.kwo-stage.kwo-grabbing{cursor:grabbing}',
    '.kwo-stage canvas{display:block;width:100%;height:100%}',
    '.kwo-hint{position:absolute;left:50%;bottom:.55rem;transform:translateX(-50%);z-index:2;pointer-events:none;',
    ' font:600 .72rem/1 system-ui,sans-serif;letter-spacing:.04em;color:rgba(255,255,255,.55);',
    ' background:rgba(10,8,36,.45);padding:.3rem .65rem;border-radius:999px;backdrop-filter:blur(3px);white-space:nowrap;',
    ' transition:opacity .5s;opacity:1}',
    '.kwo-hint.kwo-hide{opacity:0}',
    /* Pastilles de pagination (communes 3D / fallback) */
    '.kwo-dots{display:flex;justify-content:center;align-items:center;gap:.4rem;flex-wrap:wrap;padding:.7rem .5rem 0}',
    '.kwo-dot{width:9px;height:9px;border-radius:50%;border:0;padding:0;cursor:pointer;',
    ' background:color-mix(in srgb,currentColor 26%,transparent);color:inherit;transition:transform .18s,background .18s}',
    '.kwo-dot:hover{background:color-mix(in srgb,currentColor 55%,transparent)}',
    '.kwo-dot[aria-current="true"]{background:#6E6BFF;transform:scale(1.45)}',
    '.kwo-dot:focus-visible{outline:2px solid #6E6BFF;outline-offset:2px}',
    '.kwo-live{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}',
    /* ── Repli DOM : carrousel horizontal à snap (mêmes cartes en CSS) ──── */
    '.kwo-track{display:flex;gap:1rem;overflow-x:auto;scroll-snap-type:x mandatory;padding:.4rem .4rem .9rem;',
    ' scrollbar-width:thin;-webkit-overflow-scrolling:touch}',
    '.kwo-fcard{position:relative;flex:0 0 min(218px,72vw);aspect-ratio:3/4;scroll-snap-align:center;border:0;',
    ' border-radius:18px;overflow:hidden;cursor:pointer;text-align:left;color:#fff;padding:.9rem .95rem;',
    ' display:flex;flex-direction:column;justify-content:flex-end;gap:.25rem;',
    ' background:linear-gradient(150deg,var(--w1,#6E6BFF),var(--w2,#1B82E0));',
    ' box-shadow:0 14px 30px -18px var(--w2,#1B82E0);transition:transform .18s,box-shadow .18s}',
    '.kwo-fcard::after{content:"";position:absolute;inset:0;background:radial-gradient(120% 90% at 82% 8%,rgba(255,255,255,.30),transparent 55%);pointer-events:none}',
    '.kwo-fcard:hover{transform:translateY(-3px)}',
    '.kwo-fcard:focus-visible{outline:3px solid #fff;outline-offset:-4px}',
    '.kwo-femoji{position:absolute;top:.45rem;right:.55rem;font-size:2.6rem;filter:drop-shadow(0 4px 10px rgba(0,0,0,.35))}',
    '.kwo-fbadge{position:absolute;top:.6rem;left:.7rem;font:700 .62rem/1 system-ui,sans-serif;letter-spacing:.05em;',
    ' text-transform:uppercase;background:rgba(255,255,255,.24);padding:.28rem .55rem;border-radius:999px}',
    '.kwo-ft{font:800 1.02rem/1.2 system-ui,sans-serif;text-shadow:0 1px 6px rgba(0,0,0,.3);position:relative}',
    '.kwo-fs{font:500 .78rem/1.35 system-ui,sans-serif;color:rgba(255,255,255,.88);position:relative}',
    '@media (prefers-reduced-motion:reduce){.kwo-fcard,.kwo-dot{transition:none}}'
  ].join('\n');

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ── Texture d'une carte : canvas 2D → dégradé + emoji + titre (≤512px) ── */
  function drawCard(world) {
    var W = 384, H = 512, R = 42;
    var cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    var ctx = cv.getContext('2d');

    function rr(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    ctx.clearRect(0, 0, W, H);
    ctx.save();
    rr(3, 3, W - 6, H - 6, R);
    ctx.clip();

    /* Dégradé du monde (haut-gauche → bas-droite, comme les bannières du hub) */
    var g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, (world.grad && world.grad[0]) || '#6E6BFF');
    g.addColorStop(1, (world.grad && world.grad[1]) || '#1B82E0');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    /* Halo lumineux (même recette que .lh-world-ban::after) */
    var hg = ctx.createRadialGradient(W * 0.82, H * 0.10, 10, W * 0.82, H * 0.10, W * 0.9);
    hg.addColorStop(0, 'rgba(255,255,255,.32)');
    hg.addColorStop(0.55, 'rgba(255,255,255,0)');
    ctx.fillStyle = hg;
    ctx.fillRect(0, 0, W, H);

    /* Assise sombre pour la lisibilité du texte */
    var bg = ctx.createLinearGradient(0, H * 0.55, 0, H);
    bg.addColorStop(0, 'rgba(0,0,0,0)');
    bg.addColorStop(1, 'rgba(0,0,0,.42)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* Emoji du monde */
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '150px "Noto Color Emoji","Apple Color Emoji","Segoe UI Emoji",serif';
    ctx.shadowColor = 'rgba(0,0,0,.35)';
    ctx.shadowBlur = 22;
    ctx.fillText(world.emoji || '✨', W / 2, H * 0.34);
    ctx.shadowBlur = 0;

    /* Badge éventuel (pilule en haut à gauche) */
    if (world.badge) {
      ctx.font = '700 22px system-ui,sans-serif';
      var bw = ctx.measureText(String(world.badge)).width + 34;
      ctx.fillStyle = 'rgba(255,255,255,.24)';
      rr(22, 22, bw, 40, 20);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'left';
      ctx.fillText(String(world.badge), 39, 44);
      ctx.textAlign = 'center';
    }

    /* Titre (2 lignes max) + sous-titre */
    function wrap(text, font, maxW, maxLines) {
      ctx.font = font;
      var words = String(text || '').split(/\s+/), lines = [], cur = '';
      for (var i = 0; i < words.length; i++) {
        var t = cur ? cur + ' ' + words[i] : words[i];
        if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = words[i]; }
        else cur = t;
      }
      if (cur) lines.push(cur);
      if (lines.length > maxLines) {
        lines = lines.slice(0, maxLines);
        lines[maxLines - 1] += '…';
      }
      return lines;
    }
    var y = H * 0.60;
    ctx.fillStyle = '#fff';
    var tf = '800 36px system-ui,sans-serif';
    var tl = wrap(world.titre, tf, W - 60, 2);
    ctx.font = tf;
    for (var i = 0; i < tl.length; i++) { ctx.fillText(tl[i], W / 2, y); y += 44; }
    y += 4;
    ctx.fillStyle = 'rgba(255,255,255,.88)';
    var sf = '500 23px system-ui,sans-serif';
    var sl = wrap(world.sousTitre, sf, W - 64, 2);
    ctx.font = sf;
    for (var j = 0; j < sl.length; j++) { ctx.fillText(sl[j], W / 2, y); y += 30; }

    /* Appel à l'action discret */
    ctx.fillStyle = 'rgba(255,255,255,.28)';
    rr(W / 2 - 78, H - 74, 156, 42, 21);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '700 22px system-ui,sans-serif';
    ctx.fillText('Explorer  ➜', W / 2, H - 52);

    ctx.restore();
    /* Liseré arrondi */
    ctx.strokeStyle = 'rgba(255,255,255,.38)';
    ctx.lineWidth = 4;
    rr(5, 5, W - 10, H - 10, R - 2);
    ctx.stroke();
    return cv;
  }

  /* ── Halo doux derrière la carte frontale (texture radiale) ─────────────── */
  function drawGlow() {
    var S = 256;
    var cv = document.createElement('canvas');
    cv.width = S; cv.height = S;
    var ctx = cv.getContext('2d');
    var g = ctx.createRadialGradient(S / 2, S / 2, 8, S / 2, S / 2, S / 2);
    g.addColorStop(0, 'rgba(140,140,255,.55)');
    g.addColorStop(0.5, 'rgba(110,107,255,.18)');
    g.addColorStop(1, 'rgba(110,107,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    return cv;
  }

  /* ── Utilitaires communs ────────────────────────────────────────────────── */
  function mod(n, m) { return ((n % m) + m) % m; }

  function makeShell(el, worlds, label) {
    ensureStyle();
    var root = document.createElement('div');
    root.className = 'kwo';
    root.tabIndex = 0;
    root.setAttribute('role', 'group');
    root.setAttribute('aria-roledescription', 'carrousel');
    root.setAttribute('aria-label', label || 'Mondes 3D — galerie orbitale');
    var live = document.createElement('p');
    live.className = 'kwo-live';
    live.setAttribute('aria-live', 'polite');
    var dots = document.createElement('div');
    dots.className = 'kwo-dots';
    dots.setAttribute('role', 'tablist');
    dots.setAttribute('aria-label', 'Aller à un monde');
    var dotEls = worlds.map(function (w, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'kwo-dot';
      b.setAttribute('aria-label', 'Monde ' + (i + 1) + ' sur ' + worlds.length + ' : ' + (w.titre || ''));
      dots.appendChild(b);
      return b;
    });
    el.innerHTML = '';
    el.appendChild(root);
    return { root: root, live: live, dots: dots, dotEls: dotEls };
  }

  function announcer(liveEl, worlds) {
    var t = null;
    return function (i) {
      if (t) clearTimeout(t);
      t = setTimeout(function () {
        var w = worlds[i];
        if (w) liveEl.textContent = (w.titre || '') + ' — monde ' + (i + 1) + ' sur ' + worlds.length;
      }, 180);
    };
  }

  /* ══════════════════════════════════════════════════════════════════════════
   *  REPLI ACCESSIBLE : carrousel DOM horizontal à snap (aucun canvas)
   * ════════════════════════════════════════════════════════════════════════ */
  function mountFlat(el, worlds, opts) {
    var ui = makeShell(el, worlds, null);
    var root = ui.root;
    var track = document.createElement('div');
    track.className = 'kwo-track';
    var cards = worlds.map(function (w, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'kwo-fcard';
      b.style.setProperty('--w1', (w.grad && w.grad[0]) || '#6E6BFF');
      b.style.setProperty('--w2', (w.grad && w.grad[1]) || '#1B82E0');
      b.setAttribute('aria-label', 'Ouvrir le monde : ' + (w.titre || ''));
      var html = '<span class="kwo-femoji" aria-hidden="true">' + (w.emoji || '✨') + '</span>';
      if (w.badge) html += '<span class="kwo-fbadge">' + w.badge + '</span>';
      html += '<span class="kwo-ft"></span><span class="kwo-fs"></span>';
      b.innerHTML = html;
      b.querySelector('.kwo-ft').textContent = w.titre || '';
      b.querySelector('.kwo-fs').textContent = w.sousTitre || '';
      b.addEventListener('click', function () { if (opts.onOpen) opts.onOpen(w); });
      track.appendChild(b);
      return b;
    });
    root.appendChild(track);
    root.appendChild(ui.dots);
    root.appendChild(ui.live);

    var index = 0;
    var announce = announcer(ui.live, worlds);
    function setIndex(i, scroll) {
      index = mod(i, worlds.length);
      ui.dotEls.forEach(function (d, k) { d.setAttribute('aria-current', k === index ? 'true' : 'false'); });
      announce(index);
      if (scroll && cards[index]) {
        cards[index].scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
      }
    }
    ui.dotEls.forEach(function (d, k) { d.addEventListener('click', function () { setIndex(k, true); }); });

    /* Index courant dérivé du scroll (carte la plus proche du centre) */
    var scrollT = null;
    function onScroll() {
      if (scrollT) clearTimeout(scrollT);
      scrollT = setTimeout(function () {
        var mid = track.scrollLeft + track.clientWidth / 2;
        var best = 0, bd = Infinity;
        cards.forEach(function (c, k) {
          var d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
          if (d < bd) { bd = d; best = k; }
        });
        if (best !== index) setIndex(best, false);
      }, 90);
    }
    track.addEventListener('scroll', onScroll, { passive: true });

    function onKey(e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); setIndex(index + 1, true); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); setIndex(index - 1, true); }
      else if (e.key === 'Enter' || e.key === ' ') {
        if (e.target === root) { e.preventDefault(); if (opts.onOpen) opts.onOpen(worlds[index]); }
      }
    }
    root.addEventListener('keydown', onKey);
    setIndex(0, false);

    return {
      dispose: function () {
        track.removeEventListener('scroll', onScroll);
        root.removeEventListener('keydown', onKey);
        if (root.parentNode) root.parentNode.removeChild(root);
      }
    };
  }

  /* ══════════════════════════════════════════════════════════════════════════
   *  RENDU 3D : anneau orbital three.js
   * ════════════════════════════════════════════════════════════════════════ */
  function mount3d(el, worlds, opts) {
    var disposed = false;
    var cleanup = [];          // fonctions de nettoyage accumulées
    var fallbackHandle = null; // si l'init 3D échoue en cours de route

    var ui = makeShell(el, worlds, null);
    var root = ui.root;
    var stage = document.createElement('div');
    stage.className = 'kwo-stage';
    var hint = document.createElement('span');
    hint.className = 'kwo-hint';
    hint.setAttribute('aria-hidden', 'true');
    hint.textContent = 'Fais glisser pour explorer · Entrée pour ouvrir';
    stage.appendChild(hint);
    root.appendChild(stage);
    root.appendChild(ui.dots);
    root.appendChild(ui.live);

    var announce = announcer(ui.live, worlds);

    loadThree().then(function (mod3) {
      if (disposed) return;
      var THREE = mod3 && mod3.WebGLRenderer ? mod3 : (mod3 && mod3.default) || mod3;
      if (!THREE || !THREE.WebGLRenderer) throw new Error('three indisponible');

      var N = worlds.length;
      var STEP = (2 * Math.PI) / N;
      var CARD_W = 2.3, CARD_H = 3.05;
      var RADIUS = Math.max(4, (CARD_W + 0.55) / (2 * Math.sin(Math.PI / N)));
      var TILT_Y = Math.min(0.72, RADIUS * 0.085); // inclinaison douce de l'anneau

      var renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
        if (!renderer.getContext()) throw new Error('WebGL KO');
      } catch (err) {
        /* Échec WebGL → repli DOM géré par la lib elle-même */
        fallbackHandle = mountFlat(el, worlds, opts);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      stage.insertBefore(renderer.domElement, hint);

      var scene = new THREE.Scene();
      /* Cadrage : on vise le centre de la carte frontale (y = -TILT_Y) pour
         qu'elle soit entière à l'écran, l'arrière de l'anneau émergeant au-dessus. */
      var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 1.3, RADIUS + 6.6);
      camera.lookAt(0, -TILT_Y - 0.1, RADIUS);

      /* Cartes : UNE géométrie partagée, 1 matériau/texture par monde */
      var geo = new THREE.PlaneGeometry(CARD_W, CARD_H);
      var meshes = worlds.map(function (w, i) {
        var tex = new THREE.CanvasTexture(drawCard(w));
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        var mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
        var m = new THREE.Mesh(geo, mat);
        m.userData = { index: i, angle: i * STEP };
        scene.add(m);
        return m;
      });

      /* Halo derrière l'emplacement frontal (fixe dans le monde) */
      var glowTex = new THREE.CanvasTexture(drawGlow());
      glowTex.colorSpace = THREE.SRGBColorSpace;
      var glow = new THREE.Mesh(
        new THREE.PlaneGeometry(6.4, 6.4),
        new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false })
      );
      glow.position.set(0, -TILT_Y + 0.1, RADIUS - 1.1);
      scene.add(glow);

      /* Étoiles discrètes (1 draw call) */
      var starN = 260;
      var pos = new Float32Array(starN * 3);
      for (var s = 0; s < starN; s++) {
        var r = 16 + Math.random() * 16;
        var th = Math.random() * Math.PI * 2;
        var ph = Math.acos(2 * Math.random() - 1);
        pos[s * 3] = r * Math.sin(ph) * Math.cos(th);
        pos[s * 3 + 1] = r * Math.cos(ph) * 0.6 + 1.5;
        pos[s * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
      }
      var starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      var starMat = new THREE.PointsMaterial({ color: 0xbcc4ff, size: 0.09, transparent: true, opacity: 0.7, sizeAttenuation: true, depthWrite: false });
      scene.add(new THREE.Points(starGeo, starMat));

      /* ── État de rotation : drag / inertie / snap ─────────────────────── */
      var rot = 0, vel = 0, target = 0;
      var mode = 'idle'; // idle | drag | inertia | snap
      var index = -1;
      var clock = 0;

      function frontIndex() { return mod(Math.round(-rot / STEP), N); }
      function setIndex(i) {
        if (i === index) return;
        index = i;
        ui.dotEls.forEach(function (d, k) { d.setAttribute('aria-current', k === index ? 'true' : 'false'); });
        announce(index);
      }
      function goTo(i) {
        var base = -mod(i, N) * STEP;
        var k = Math.round((rot - base) / (2 * Math.PI));
        target = base + k * 2 * Math.PI;
        /* Prend le chemin le plus court si l'écart dépasse un demi-tour */
        if (target - rot > Math.PI) target -= 2 * Math.PI;
        if (rot - target > Math.PI) target += 2 * Math.PI;
        mode = 'snap';
        wake();
      }
      function snapNearest() {
        target = Math.round(rot / STEP) * STEP;
        mode = 'snap';
      }

      /* ── Boucle de rendu (stoppée hors viewport / onglet caché) ───────── */
      var raf = 0, running = false, visible = true;
      function layout(t) {
        for (var i = 0; i < N; i++) {
          var m = meshes[i];
          var a = m.userData.angle + rot;
          var c = Math.cos(a);
          var d = (c + 1) / 2;                       // 1 devant … 0 derrière
          var bob = opts.reduced ? 0 : Math.sin(t * 1.25 + i * 1.7) * 0.05 * d;
          m.position.set(Math.sin(a) * RADIUS, -c * TILT_Y + bob, c * RADIUS);
          m.rotation.y = a;
          var sc = 0.78 + 0.42 * Math.pow(d, 1.6);   // carte frontale mise en avant
          m.scale.setScalar(sc);
          m.material.opacity = 0.16 + 0.84 * Math.pow(d, 1.7);
          var lum = 0.5 + 0.5 * d;                   // les autres s'assombrissent
          m.material.color.setRGB(lum, lum, lum);
          m.renderOrder = Math.round(d * 100);       // devant dessiné en dernier
        }
        glow.material.opacity = 0.75 + (opts.reduced ? 0 : Math.sin(t * 1.8) * 0.12);
        starMat.opacity = 0.55 + (opts.reduced ? 0 : Math.sin(t * 0.9) * 0.15);
      }
      function tick() {
        raf = 0;
        if (disposed || !running) return;
        clock += 1 / 60;
        if (mode === 'inertia') {
          rot += vel;
          vel *= 0.94;
          if (Math.abs(vel) < 0.0022) snapNearest();
        } else if (mode === 'snap') {
          rot += (target - rot) * 0.14;
          if (Math.abs(target - rot) < 0.0006) { rot = target; mode = 'idle'; }
        }
        setIndex(frontIndex());
        layout(clock);
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      }
      function wake() { if (running && !raf) raf = requestAnimationFrame(tick); }
      function setRunning(on) {
        running = on && visible && !document.hidden;
        if (running) wake();
        else if (raf) { cancelAnimationFrame(raf); raf = 0; }
      }

      /* ── Resize auto-résilient ────────────────────────────────────────── */
      function resize() {
        var w = stage.clientWidth || 1;
        var h = stage.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        if (!running) { layout(clock); renderer.render(scene, camera); }
      }
      resize();
      var ro = null;
      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(resize);
        ro.observe(stage);
        cleanup.push(function () { ro.disconnect(); });
      } else {
        window.addEventListener('resize', resize);
        cleanup.push(function () { window.removeEventListener('resize', resize); });
      }

      /* ── Viewport : rAF stoppé quand l'élément sort de l'écran ────────── */
      if (typeof IntersectionObserver !== 'undefined') {
        var io = new IntersectionObserver(function (entries) {
          visible = !!(entries[0] && entries[0].isIntersecting);
          setRunning(true);
        });
        io.observe(stage);
        cleanup.push(function () { io.disconnect(); });
      }
      function onVis() { setRunning(true); }
      document.addEventListener('visibilitychange', onVis);
      cleanup.push(function () { document.removeEventListener('visibilitychange', onVis); });

      /* ── Drag horizontal (souris + tactile) avec inertie ──────────────── */
      var drag = null; // { x0, y0, x, t, moved }
      var DRAG_K; // rad par pixel (recalculé au down selon la largeur)
      function onDown(e) {
        if (e.button !== undefined && e.button !== 0) return;
        drag = { x0: e.clientX, y0: e.clientY, x: e.clientX, t: performance.now(), moved: false };
        DRAG_K = 3.2 / Math.max(320, stage.clientWidth);
        vel = 0;
        mode = 'drag';
        stage.classList.add('kwo-grabbing');
        hint.classList.add('kwo-hide');
        try { stage.setPointerCapture(e.pointerId); } catch (err) {}
        wake();
      }
      function onMove(e) {
        if (!drag) return;
        var dx = e.clientX - drag.x;
        if (Math.abs(e.clientX - drag.x0) > 6) drag.moved = true;
        var now = performance.now();
        var dt = Math.max(1, now - drag.t);
        rot += dx * DRAG_K;
        vel = (dx * DRAG_K) * Math.min(1, 16 / dt);
        drag.x = e.clientX;
        drag.t = now;
        wake();
      }
      function onUp(e) {
        if (!drag) return;
        var wasTap = !drag.moved;
        drag = null;
        stage.classList.remove('kwo-grabbing');
        if (wasTap) {
          mode = 'idle';
          handleTap(e);
          if (mode === 'idle') snapNearest();
        } else if (Math.abs(vel) > 0.003) {
          mode = 'inertia';
        } else {
          snapNearest();
        }
        wake();
      }
      stage.addEventListener('pointerdown', onDown);
      stage.addEventListener('pointermove', onMove);
      stage.addEventListener('pointerup', onUp);
      stage.addEventListener('pointercancel', onUp);
      cleanup.push(function () {
        stage.removeEventListener('pointerdown', onDown);
        stage.removeEventListener('pointermove', onMove);
        stage.removeEventListener('pointerup', onUp);
        stage.removeEventListener('pointercancel', onUp);
      });

      /* ── Clic : carte frontale → onOpen ; carte latérale → on l'amène ── */
      var ray = new THREE.Raycaster();
      var ndc = new THREE.Vector2();
      function handleTap(e) {
        var r = stage.getBoundingClientRect();
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, camera);
        var hits = ray.intersectObjects(meshes, false);
        /* Ignore les cartes quasi transparentes du fond */
        var hit = null;
        for (var i = 0; i < hits.length; i++) {
          if (hits[i].object.material.opacity > 0.35) { hit = hits[i].object; break; }
        }
        if (!hit) return;
        var i2 = hit.userData.index;
        if (i2 === frontIndex()) {
          if (opts.onOpen) opts.onOpen(worlds[i2]);
        } else {
          goTo(i2);
        }
      }

      /* ── Molette → rotation + snap différé ────────────────────────────── */
      var wheelT = null;
      function onWheel(e) {
        e.preventDefault();
        var d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        rot -= d * 0.0016;
        mode = 'drag';
        hint.classList.add('kwo-hide');
        if (wheelT) clearTimeout(wheelT);
        wheelT = setTimeout(function () { snapNearest(); wake(); }, 140);
        wake();
      }
      stage.addEventListener('wheel', onWheel, { passive: false });
      cleanup.push(function () {
        stage.removeEventListener('wheel', onWheel);
        if (wheelT) clearTimeout(wheelT);
      });

      /* ── Clavier : ← → naviguent, Entrée/Espace ouvrent ───────────────── */
      /* Index « logique » : pendant un snap en cours, on enchaîne depuis la
         cible (deux flèches rapides = deux pas, pas un seul). */
      function navIndex() {
        return mode === 'snap' ? mod(Math.round(-target / STEP), N) : frontIndex();
      }
      function onKey(e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); hint.classList.add('kwo-hide'); goTo(navIndex() + 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); hint.classList.add('kwo-hide'); goTo(navIndex() - 1); }
        else if (e.key === 'Enter' || e.key === ' ') {
          if (e.target === root) { e.preventDefault(); if (opts.onOpen) opts.onOpen(worlds[frontIndex()]); }
        }
      }
      root.addEventListener('keydown', onKey);
      cleanup.push(function () { root.removeEventListener('keydown', onKey); });

      /* ── Pastilles ────────────────────────────────────────────────────── */
      ui.dotEls.forEach(function (d, k) {
        var h = function () { goTo(k); };
        d.addEventListener('click', h);
        cleanup.push(function () { d.removeEventListener('click', h); });
      });

      /* ── Libération GPU au dispose ────────────────────────────────────── */
      cleanup.push(function () {
        if (raf) cancelAnimationFrame(raf);
        raf = 0; running = false;
        geo.dispose();
        meshes.forEach(function (m) { m.material.map.dispose(); m.material.dispose(); });
        glow.geometry.dispose(); glowTex.dispose(); glow.material.dispose();
        starGeo.dispose(); starMat.dispose();
        renderer.dispose();
      });

      /* Premier rendu + démarrage */
      setIndex(frontIndex());
      layout(0);
      renderer.render(scene, camera);
      setRunning(true);
      setTimeout(function () { hint.classList.add('kwo-hide'); }, 6000);
    }).catch(function () {
      /* three introuvable → repli DOM */
      if (!disposed) fallbackHandle = mountFlat(el, worlds, opts);
    });

    return {
      dispose: function () {
        if (disposed) return;
        disposed = true;
        cleanup.forEach(function (fn) { try { fn(); } catch (e) {} });
        cleanup.length = 0;
        if (fallbackHandle) { fallbackHandle.dispose(); fallbackHandle = null; }
        if (root.parentNode) root.parentNode.removeChild(root);
      }
    };
  }

  /* ══════════════════════════════════════════════════════════════════════════
   *  API publique
   * ════════════════════════════════════════════════════════════════════════ */
  window.KonstrioWorldsOrbit = {
    /**
     * Monte la galerie orbitale dans `el`.
     * @param {HTMLElement} el      conteneur hôte (sera vidé)
     * @param {Array} worlds        [{id,titre,sousTitre,grad:[c1,c2],emoji,url,badge}]
     * @param {Object} [opts]       { onOpen(world), reduced:boolean }
     * @returns {{dispose:Function}}
     */
    mount: function (el, worlds, opts) {
      opts = opts || {};
      worlds = Array.isArray(worlds) ? worlds : [];
      if (!el || !worlds.length) return { dispose: function () {} };
      if (el.__kwo) { try { el.__kwo.dispose(); } catch (e) {} }
      var reduced = !!opts.reduced || prefersReduced();
      var handle = reduced
        ? mountFlat(el, worlds, opts)
        : mount3d(el, worlds, { onOpen: opts.onOpen, reduced: false });
      el.__kwo = handle;
      var wrapped = {
        dispose: function () {
          handle.dispose();
          if (el.__kwo === wrapped || el.__kwo === handle) el.__kwo = null;
        }
      };
      el.__kwo = wrapped;
      return wrapped;
    }
  };
})();
