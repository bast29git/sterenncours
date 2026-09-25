/* ============================================================================
 * farces.js : les farces de la messagerie, dans les deux espaces.
 *
 * Une farce est un message dont le contexte vaut « farce:<id> ». Elle s'anime
 * sur la photo de la personne visée, dans le fil de la conversation : la tarte
 * à la crème et la boule de neige arrivent en 3D plein écran (three.js, chargé
 * à la demande depuis learning/vendor) et s'écrasent sur la tête ; les autres
 * sont dessinées sur un canevas plein écran. Chaque farce a ses sons, produits
 * ici même (bruit filtré et oscillateurs), coupés par le réglage « sons ».
 * Avec « mouvement réduit », seul le résultat s'affiche.
 *
 *   FARCES.LISTE                        le catalogue
 *   FARCES.idDe(message)                l'identifiant, ou null
 *   FARCES.cible(roleVictime)           la photo à viser, dans le fil de préférence
 *   FARCES.jouer(id, cibleElement)      l'animation, promesse tenue à la fin
 * ========================================================================== */
(function () {
  const LISTE = [
    { id: 'tarte', nom: 'Tarte à la crème', ico: '🥧', texte: '{qui} t\'envoie une tarte à la crème en pleine figure !', trois: true },
    { id: 'neige', nom: 'Énorme boule de neige', ico: '❄️', texte: '{qui} te lance une énorme boule de neige !', trois: true },
    { id: 'confettis', nom: 'Confettis', ico: '🎊', texte: '{qui} fait pleuvoir des confettis sur toi !' },
    { id: 'coeurs', nom: 'Pluie de cœurs', ico: '💗', texte: '{qui} t\'envoie une pluie de cœurs.' },
    { id: 'feu', nom: 'Feu d\'artifice', ico: '🎆', texte: '{qui} tire un feu d\'artifice pour toi !' },
  ];
  const parId = (id) => LISTE.find((f) => f.id === id) || null;
  const idDe = (m) => { const c = String(m && m.contexte || ''); return c.indexOf('farce:') === 0 && parId(c.slice(6)) ? c.slice(6) : null; };
  const texteDe = (id, qui) => { const f = parId(id); return f ? f.texte.replace('{qui}', qui) : ''; };
  const reduit = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const enCours = new Set();
  const N = () => window.NOYAU;

  /* ---------- Les sons, fabriqués sur place ---------- */
  let ctxAudio = null;
  const sonsActifs = () => { const n = N(); try { return !n || !n.lire ? true : n.lire(n.CLE_SONS || 'opaline.sons', true) !== false; } catch (e) { return true; } };
  function audio() {
    if (!sonsActifs()) return null;
    try { ctxAudio = ctxAudio || new (window.AudioContext || window.webkitAudioContext)(); if (ctxAudio.state === 'suspended') ctxAudio.resume(); return ctxAudio; } catch (e) { return null; }
  }
  let tamponBruit = null;
  function bruitBlanc(ctx) {
    if (tamponBruit) return tamponBruit;
    const b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i += 1) d[i] = Math.random() * 2 - 1;
    tamponBruit = b; return b;
  }
  /** Un souffle de bruit filtré. o : { duree, type, de, a, q, gain, debut } */
  function souffle(o) {
    const ctx = audio(); if (!ctx) return;
    const t0 = ctx.currentTime + (o.debut || 0);
    const src = ctx.createBufferSource(); src.buffer = bruitBlanc(ctx); src.loop = true;
    const f = ctx.createBiquadFilter(); f.type = o.type || 'bandpass'; f.Q.value = o.q || 1;
    f.frequency.setValueAtTime(o.de || 800, t0); if (o.a) f.frequency.exponentialRampToValueAtTime(o.a, t0 + o.duree);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(o.gain || 0.3, t0 + (o.attaque || 0.03));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.duree);
    src.connect(f); f.connect(g); g.connect(ctx.destination); src.start(t0); src.stop(t0 + o.duree + 0.05);
  }
  /** Une note. o : { freq, a, duree, type, gain, debut } */
  function note(o) {
    const ctx = audio(); if (!ctx) return;
    const t0 = ctx.currentTime + (o.debut || 0);
    const osc = ctx.createOscillator(); osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.freq, t0); if (o.a) osc.frequency.exponentialRampToValueAtTime(o.a, t0 + o.duree);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(o.gain || 0.2, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.duree);
    osc.connect(g); g.connect(ctx.destination); osc.start(t0); osc.stop(t0 + o.duree + 0.05);
  }
  const SONS = {
    sifflement: (duree) => souffle({ duree, type: 'bandpass', de: 300, a: 2400, q: 1.4, gain: 0.35, attaque: duree * 0.7 }),
    splat: () => { note({ freq: 110, a: 38, duree: 0.22, gain: 0.5 }); souffle({ duree: 0.28, type: 'lowpass', de: 1400, a: 300, gain: 0.5, attaque: 0.005 }); souffle({ duree: 0.42, type: 'bandpass', de: 700, a: 160, q: 3, gain: 0.35, attaque: 0.02, debut: 0.05 }); for (let i = 0; i < 7; i += 1) note({ freq: 420 - i * 30, a: 120, duree: 0.07, gain: 0.12, debut: 0.25 + i * 0.09 }); },
    plop: (debut) => note({ freq: 320, a: 110, duree: 0.08, gain: 0.12, debut }),
    boule: () => { note({ freq: 80, a: 35, duree: 0.3, gain: 0.55 }); souffle({ duree: 0.22, type: 'lowpass', de: 2600, a: 500, gain: 0.5, attaque: 0.004 }); souffle({ duree: 0.7, type: 'highpass', de: 3000, a: 6000, q: 0.8, gain: 0.12, attaque: 0.05, debut: 0.1 }); },
    frisson: () => { for (let i = 0; i < 6; i += 1) note({ freq: 1800 + i * 220, duree: 0.12, type: 'triangle', gain: 0.05, debut: 0.4 + i * 0.07 }); },
    pops: () => { for (let i = 0; i < 12; i += 1) souffle({ duree: 0.06, type: 'highpass', de: 2500, q: 0.7, gain: 0.18, attaque: 0.003, debut: i * 0.11 + Math.random() * 0.04 }); },
    scintille: () => { [1319, 1568, 1976, 2637, 2093, 1760].forEach((f, i) => note({ freq: f, duree: 0.25, type: 'sine', gain: 0.07, debut: i * 0.16 })); },
    fusee: (debut) => note({ freq: 500, a: 1600, duree: 0.7, type: 'sine', gain: 0.05, debut }),
    boum: (debut) => { note({ freq: 70, a: 30, duree: 0.6, gain: 0.45, debut }); souffle({ duree: 0.5, type: 'lowpass', de: 2000, a: 200, gain: 0.35, attaque: 0.005, debut }); souffle({ duree: 0.9, type: 'highpass', de: 4000, q: 0.5, gain: 0.08, attaque: 0.02, debut: debut + 0.1 }); },
  };

  /* ---------- La cible : la photo, dans le fil de préférence ---------- */
  function cible(victime) {
    const prof = document.body.classList.contains('corps-prof') || !document.getElementById('app-eleve') || document.getElementById('app-eleve').hidden;
    let sel;
    if (prof) sel = victime === 'prof' ? '.p-msg.moi .p-msg-photo' : '.p-msg:not(.moi) .p-msg-photo';
    else sel = victime === 'eleve' ? '.e-msg.moi .e-msg-pastille' : '.e-msg:not(.moi) .e-msg-pastille';
    const tous = [...document.querySelectorAll(sel)];
    const el = tous[tous.length - 1];
    if (el) { try { el.scrollIntoView({ block: 'center', behavior: reduit() ? 'auto' : 'smooth' }); } catch (e) { /* rien */ } return el; }
    const moiVictime = (prof && victime === 'prof') || (!prof && victime === 'eleve');
    return document.getElementById(moiVictime ? 'duo-moi' : 'duo-autre');
  }
  function centreDe(el) {
    const r = el && el.getBoundingClientRect ? el.getBoundingClientRect() : { left: innerWidth / 2 - 40, top: innerHeight / 3, width: 80, height: 80 };
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: Math.max(r.width, r.height) / 2 };
  }
  function canevas() {
    const c = document.createElement('canvas');
    c.className = 'farce-canevas'; c.width = innerWidth; c.height = innerHeight;
    c.setAttribute('aria-hidden', 'true');
    document.body.appendChild(c);
    return c;
  }
  /** Le résultat qui reste : de la crème (ou de la neige) sur la photo, à essuyer d'un clic. */
  function tacher(el, genre) {
    if (!el) return;
    const ancien = el.querySelector('.farce-tache'); if (ancien) ancien.remove();
    const t = document.createElement('span');
    t.className = 'farce-tache farce-tache-' + genre; t.setAttribute('role', 'img');
    t.setAttribute('aria-label', genre === 'neige' ? 'Neige sur la photo' : 'Crème sur la photo');
    t.title = 'Essuyer';
    t.innerHTML = genre === 'neige'
      ? '<svg viewBox="0 0 100 100"><path d="M50 12c14 0 22 8 26 18 12 2 16 12 14 22-4 12-16 14-24 12-2 12-10 22-22 22-14 0-20-10-22-20-12 0-20-10-16-22 2-10 12-14 22-12 4-10 12-20 22-20Z" fill="#f6fbff" stroke="#cfe6f5" stroke-width="2"/><circle cx="36" cy="40" r="4" fill="#e3f1fb"/><circle cx="60" cy="62" r="6" fill="#e3f1fb"/><circle cx="62" cy="36" r="3" fill="#fff"/></svg>'
      : '<svg viewBox="0 0 100 100"><path d="M48 8c16-2 26 8 30 18 10 0 18 10 14 22-2 10-12 14-20 12 0 12-8 24-22 24-12 0-18-8-22-18-12 2-22-6-22-18 0-10 8-16 16-16 0-12 12-22 26-24Z" fill="#fff7ea" stroke="#f0dcb8" stroke-width="2"/><circle cx="40" cy="42" r="5" fill="#f5d9a0"/><circle cx="62" cy="58" r="4" fill="#f5d9a0"/><path d="M30 70q6 14 2 26M70 68q4 12 8 22M50 80q2 10 0 18" stroke="#fff7ea" stroke-width="7" stroke-linecap="round"/><circle cx="32" cy="97" r="4" fill="#fff7ea"/><circle cx="78" cy="91" r="3.5" fill="#fff7ea"/></svg>';
    el.classList.add('farce-cible');
    el.appendChild(t);
    const essuyer = () => { t.classList.add('fin'); setTimeout(() => t.remove(), 300); };
    t.addEventListener('click', essuyer);
    setTimeout(essuyer, 15000);
  }
  /** Des coulures sur l'écran, qui glissent puis s'effacent. */
  /** Des points d'éclaboussure autour d'une cible : plus denses près d'elle, jusqu'aux bords de l'écran. */
  function eclaboussures(centre, n) {
    const pts = [];
    for (let i = 0; i < n; i += 1) {
      const a = Math.random() * Math.PI * 2; const d = Math.pow(Math.random(), 0.6) * Math.max(innerWidth, innerHeight) * 0.55;
      pts.push({ x: Math.min(innerWidth, Math.max(0, centre.x + Math.cos(a) * d)), y: Math.min(innerHeight, Math.max(0, centre.y + Math.sin(a) * d * 0.8)) });
    }
    return pts;
  }
  function coulures(points, genre) {
    const couche = document.createElement('div'); couche.className = 'farce-coulures'; couche.setAttribute('aria-hidden', 'true');
    couche.innerHTML = points.map((p) => `<span class="farce-goutte ${genre}" style="left:${p.x}px;top:${p.y}px;--t:${(0.6 + Math.random() * 1.2).toFixed(2)};--s:${(0.5 + Math.random() * 1.3).toFixed(2)}"></span>`).join('');
    document.body.appendChild(couche);
    setTimeout(() => { couche.classList.add('fin'); setTimeout(() => couche.remove(), 900); }, 4200);
  }
  function givre() {
    const g = document.createElement('div'); g.className = 'farce-givre'; g.setAttribute('aria-hidden', 'true');
    document.body.appendChild(g);
    requestAnimationFrame(() => g.classList.add('on'));
    setTimeout(() => { g.classList.remove('on'); setTimeout(() => g.remove(), 1200); }, 3500);
  }
  function secouer(duree) {
    document.documentElement.classList.add('farce-tremble');
    setTimeout(() => document.documentElement.classList.remove('farce-tremble'), duree || 450);
  }

  /* ---------- Textures fabriquées ---------- */
  function textureCanevas(THREE, taille, dessin) {
    const c = document.createElement('canvas'); c.width = taille; c.height = taille;
    dessin(c.getContext('2d'), taille);
    const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.RepeatWrapping;
    if (THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  const alea = (a, b) => a + Math.random() * (b - a);

  /* ---------- Le décor 3D commun ---------- */
  async function scene3d() {
    const THREE = await import('/learning/vendor/three.module.js');
    const c = canevas();
    const rendu = new THREE.WebGLRenderer({ canvas: c, alpha: true, antialias: true });
    rendu.setPixelRatio(Math.min(2, devicePixelRatio || 1));
    rendu.setSize(innerWidth, innerHeight, false);
    rendu.shadowMap.enabled = true; rendu.shadowMap.type = THREE.PCFSoftShadowMap;
    if (THREE.ACESFilmicToneMapping) { rendu.toneMapping = THREE.ACESFilmicToneMapping; rendu.toneMappingExposure = 1.05; }
    if (THREE.SRGBColorSpace) rendu.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, innerWidth / innerHeight, 0.05, 200);
    camera.position.set(0, 0, 0); camera.lookAt(0, 0, -1);
    scene.add(new THREE.HemisphereLight(0xfff6e6, 0x8a8078, 1.6));
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    // La lumière principale vient de derrière la caméra, un peu en haut à gauche : ce qui vole vers l'écran est éclairé de face.
    const soleil = new THREE.DirectionalLight(0xffffff, 2.6); soleil.position.set(-3, 5, 6); soleil.target.position.set(0, 0, -6); soleil.castShadow = true;
    soleil.shadow.mapSize.set(1024, 1024); scene.add(soleil); scene.add(soleil.target);
    const contre = new THREE.PointLight(0xffe6c8, 30, 60, 1.6); contre.position.set(4, -1, 1); scene.add(contre);
    const arriere = new THREE.PointLight(0xcfe8ff, 18, 60, 1.6); arriere.position.set(2, 3, -9); scene.add(arriere);
    /** Le point du monde, à la profondeur d (négative), qui se projette sur le pixel (sx, sy). */
    const versMonde = (sx, sy, d) => { const demiH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * -d; const demiW = demiH * camera.aspect; return new THREE.Vector3((sx / innerWidth - 0.5) * 2 * demiW, -(sy / innerHeight - 0.5) * 2 * demiH, d); };
    const versEcran = (v) => { const p = v.clone().project(camera); return { x: (p.x + 1) / 2 * innerWidth, y: (1 - p.y) / 2 * innerHeight }; };
    const fin = () => { try { rendu.dispose(); } catch (e) { /* rien */ } c.remove(); };
    return { THREE, rendu, scene, camera, versMonde, versEcran, fin };
  }

  /* ---------- La tarte à la crème ---------- */
  function construireTarte(THREE) {
    const g = new THREE.Group();
    const texPate = textureCanevas(THREE, 256, (x, n) => {
      const gr = x.createRadialGradient(n / 2, n / 2, 10, n / 2, n / 2, n / 2); gr.addColorStop(0, '#e2b06b'); gr.addColorStop(0.7, '#c98a3e'); gr.addColorStop(1, '#a5652a');
      x.fillStyle = gr; x.fillRect(0, 0, n, n);
      for (let i = 0; i < 900; i += 1) { x.fillStyle = `rgba(${alea(120, 200) | 0},${alea(60, 110) | 0},20,${alea(0.08, 0.35)})`; x.beginPath(); x.arc(alea(0, n), alea(0, n), alea(0.6, 2.6), 0, Math.PI * 2); x.fill(); }
    });
    const texRugueux = textureCanevas(THREE, 128, (x, n) => { for (let i = 0; i < n * n / 3; i += 1) { const v = alea(150, 255) | 0; x.fillStyle = `rgb(${v},${v},${v})`; x.fillRect(alea(0, n), alea(0, n), 1.5, 1.5); } });
    // L'assiette
    const assiette = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.6, 0.07, 72), new THREE.MeshPhysicalMaterial({ color: 0xf4f1ea, roughness: 0.25, clearcoat: 0.8, clearcoatRoughness: 0.15 }));
    assiette.receiveShadow = true; assiette.position.y = -0.04; g.add(assiette);
    const bord = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.05, 12, 72), assiette.material); bord.rotation.x = Math.PI / 2; g.add(bord);
    // Le moule doré, au bord cannelé
    const geoPate = new THREE.CylinderGeometry(1.3, 1.12, 0.46, 96, 3, false);
    const pos = geoPate.attributes.position;
    for (let i = 0; i < pos.count; i += 1) {
      const x = pos.getX(i); const y = pos.getY(i); const z = pos.getZ(i);
      if (y > 0.05) { const a = Math.atan2(z, x); const r = Math.hypot(x, z); const k = 1 + 0.045 * Math.sin(a * 14) * ((y + 0.23) / 0.46); pos.setX(i, Math.cos(a) * r * k); pos.setZ(i, Math.sin(a) * r * k); }
    }
    geoPate.computeVertexNormals();
    const pate = new THREE.Mesh(geoPate, new THREE.MeshStandardMaterial({ map: texPate, roughness: 0.9, metalness: 0, bumpMap: texRugueux, bumpScale: 0.03 }));
    pate.position.y = 0.23; pate.castShadow = true; pate.receiveShadow = true; g.add(pate);
    // La crème : socle, dôme, bosses, pics
    const matCreme = new THREE.MeshPhysicalMaterial({ color: 0xfff6e8, roughness: 0.42, clearcoat: 0.55, clearcoatRoughness: 0.35, sheen: 0.4, sheenColor: new THREE.Color(0xfff0d8), bumpMap: texRugueux, bumpScale: 0.012 });
    const socle = new THREE.Mesh(new THREE.CylinderGeometry(1.18, 1.16, 0.34, 72), matCreme); socle.position.y = 0.62; socle.castShadow = true; g.add(socle);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(1.08, 48, 32), matCreme); dome.scale.set(1, 0.55, 1); dome.position.y = 0.78; dome.castShadow = true; g.add(dome);
    for (let i = 0; i < 38; i += 1) {
      const r = alea(0.12, 0.3); const a = alea(0, Math.PI * 2); const d = Math.sqrt(Math.random()) * 0.95;
      const b = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 16), matCreme);
      b.position.set(Math.cos(a) * d, 0.78 + Math.sqrt(Math.max(0, 1 - (d / 1.08) ** 2)) * 0.55 + r * 0.35, Math.sin(a) * d);
      b.scale.y = alea(0.7, 1.05); b.castShadow = true; g.add(b);
    }
    for (let i = 0; i < 10; i += 1) {
      const a = (i / 10) * Math.PI * 2; const p = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.42, 14), matCreme);
      p.position.set(Math.cos(a) * 0.95, 0.98, Math.sin(a) * 0.95); p.rotation.z = alea(-0.15, 0.15); p.castShadow = true; g.add(p);
    }
    // Les vermicelles et les fruits
    const couleurs = [0xe8608e, 0x2bb5a0, 0xf2c744, 0x7b6be8, 0xe96a43];
    for (let i = 0; i < 70; i += 1) {
      const v = new THREE.Mesh(THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(0.018, 0.08, 4, 8) : new THREE.CylinderGeometry(0.018, 0.018, 0.1, 6), new THREE.MeshStandardMaterial({ color: couleurs[i % couleurs.length], roughness: 0.4 }));
      const a = alea(0, Math.PI * 2); const d = Math.sqrt(Math.random()) * 1.05;
      v.position.set(Math.cos(a) * d, 0.8 + Math.sqrt(Math.max(0, 1 - (d / 1.08) ** 2)) * 0.56 + 0.05, Math.sin(a) * d);
      v.rotation.set(alea(0, 3), alea(0, 3), alea(0, 3)); g.add(v);
    }
    const matFruit = new THREE.MeshPhysicalMaterial({ color: 0xc41e3a, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08 });
    [[0, 1.42, 0], [0.55, 1.3, 0.3], [-0.5, 1.28, -0.35], [0.2, 1.3, -0.6]].forEach(([x, y, z], i) => {
      const f = new THREE.Mesh(new THREE.SphereGeometry(i ? 0.13 : 0.17, 24, 18), matFruit); f.position.set(x, y, z); f.scale.y = 0.92; f.castShadow = true; g.add(f);
      const q = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, 0.3, 6), new THREE.MeshStandardMaterial({ color: 0x4a7a2a, roughness: 0.7 })); q.position.set(x + 0.04, y + 0.2, z); q.rotation.z = -0.5; g.add(q);
    });
    return g;
  }

  async function tarte3d(el) {
    const { THREE, rendu, scene, camera, versMonde, fin } = await scene3d();
    const tarte = construireTarte(THREE); scene.add(tarte);
    const centre = centreDe(el);
    const zFin = -2.6; const zDebut = -30;
    const arrivee = versMonde(centre.x, centre.y, zFin);
    const depart = versMonde(innerWidth * alea(0.15, 0.85), innerHeight * alea(0.55, 0.9), zDebut);
    const vol = 1600; const t0 = performance.now();
    const eclats = []; const matEclat = new THREE.MeshPhysicalMaterial({ color: 0xfff6e8, roughness: 0.4, clearcoat: 0.5, emissive: 0x40362a, emissiveIntensity: 0.35 });
    const geoEclat = new THREE.SphereGeometry(1, 16, 12);
    let touche = false; let assietteLibre = null;
    SONS.sifflement(vol / 1000);
    return new Promise((resoudre) => {
      let precedent = t0;
      const boucle = () => {
        const maintenant = performance.now(); const dt = Math.min(0.05, (maintenant - precedent) / 1000); precedent = maintenant;
        const t = maintenant - t0;
        if (t < vol) {
          const k = t / vol; const e = k * k * (1.6 - 0.6 * k); // elle accélère vers l'écran
          tarte.position.lerpVectors(depart, arrivee, e);
          tarte.position.y += Math.sin(k * Math.PI) * 3 * (1 - e);
          // la crème finit face à l'écran : le dessus de la tarte se tourne vers la caméra
          tarte.rotation.x = Math.PI / 2 * Math.min(1, k * 1.4) + Math.sin(k * 9) * 0.12 * (1 - k);
          tarte.rotation.y = k * Math.PI * 4.5;
        } else {
          if (!touche) {
            touche = true; tarte.visible = false; secouer(480); SONS.splat(); tacher(el, 'creme');
            setTimeout(() => coulures(eclaboussures(centre, 34), 'creme'), 120);
            assietteLibre = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.6, 0.07, 48), new THREE.MeshPhysicalMaterial({ color: 0xf4f1ea, roughness: 0.25, clearcoat: 0.8 }));
            assietteLibre.position.copy(arrivee); assietteLibre.rotation.x = Math.PI / 2; assietteLibre.userData.v = new THREE.Vector3(alea(-1, 1), -1, 1.2); scene.add(assietteLibre);
            for (let i = 0; i < 240; i += 1) {
              const m = new THREE.Mesh(geoEclat, matEclat);
              const r = alea(0.025, 0.17); m.scale.set(r, r * alea(0.7, 1.6), r);
              m.position.copy(arrivee).add(new THREE.Vector3(alea(-0.6, 0.6), alea(-0.6, 0.6), alea(-0.2, 0.2)));
              const a = alea(0, Math.PI * 2); const vit = alea(1.5, 7);
              m.userData.v = new THREE.Vector3(Math.cos(a) * vit, Math.sin(a) * vit + 1.5, alea(0.5, 7.5));
              scene.add(m); eclats.push(m);
            }
            for (let i = 0; i < 6; i += 1) SONS.plop(0.3 + i * 0.13);
          }
          for (let i = eclats.length - 1; i >= 0; i -= 1) {
            const m = eclats[i]; m.userData.v.y -= 9.8 * dt; m.position.addScaledVector(m.userData.v, dt);
            m.rotation.x += dt * 3; m.rotation.z += dt * 2;
            if (m.position.z > -0.3 || m.position.y < -12) { scene.remove(m); eclats.splice(i, 1); }
          }
          if (assietteLibre) { assietteLibre.userData.v.y -= 9.8 * dt; assietteLibre.position.addScaledVector(assietteLibre.userData.v, dt); assietteLibre.rotation.z += dt * 4; }
        }
        rendu.render(scene, camera);
        if (t < vol + 1500) requestAnimationFrame(boucle); else { fin(); resoudre(); }
      };
      requestAnimationFrame(boucle);
    });
  }

  /* ---------- L'énorme boule de neige ---------- */
  async function neige3d(el) {
    const { THREE, rendu, scene, camera, versMonde, fin } = await scene3d();
    const texNeige = textureCanevas(THREE, 512, (x, n) => {
      x.fillStyle = '#f4f8fc'; x.fillRect(0, 0, n, n);
      for (let i = 0; i < 9000; i += 1) { const v = alea(0, 1); x.fillStyle = v < 0.5 ? `rgba(200,222,240,${alea(0.15, 0.5)})` : `rgba(255,255,255,${alea(0.2, 0.7)})`; x.beginPath(); x.arc(alea(0, n), alea(0, n), alea(0.6, 3.2), 0, Math.PI * 2); x.fill(); }
      for (let i = 0; i < 140; i += 1) { x.fillStyle = `rgba(160,190,215,${alea(0.15, 0.35)})`; x.beginPath(); x.ellipse(alea(0, n), alea(0, n), alea(4, 16), alea(3, 9), alea(0, 3), 0, Math.PI * 2); x.fill(); }
    });
    const texBosse = textureCanevas(THREE, 256, (x, n) => { x.fillStyle = '#808080'; x.fillRect(0, 0, n, n); for (let i = 0; i < 4000; i += 1) { const v = alea(60, 220) | 0; x.fillStyle = `rgb(${v},${v},${v})`; x.beginPath(); x.arc(alea(0, n), alea(0, n), alea(0.8, 4), 0, Math.PI * 2); x.fill(); } });
    const geo = new THREE.SphereGeometry(1.9, 96, 64);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i += 1) { const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)); const k = 1 + 0.035 * Math.sin(v.x * 6.1) * Math.cos(v.y * 5.3) + 0.03 * Math.sin(v.z * 7.7 + v.x * 2); v.multiplyScalar(k); pos.setXYZ(i, v.x, v.y, v.z); }
    geo.computeVertexNormals();
    const boule = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ map: texNeige, bumpMap: texBosse, bumpScale: 0.06, roughness: 0.9, clearcoat: 0.15, clearcoatRoughness: 0.9, sheen: 1, sheenColor: new THREE.Color(0xdfeeff) }));
    boule.castShadow = true; scene.add(boule);
    const centre = centreDe(el);
    const zFin = -3.2; const zDebut = -40;
    const arrivee = versMonde(centre.x, centre.y, zFin);
    const depart = versMonde(innerWidth * alea(0.1, 0.9), innerHeight * alea(0.05, 0.4), zDebut);
    const vol = 1750; const t0 = performance.now();
    const flocons = []; const matFlocon = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, emissive: 0x8fa8c0, emissiveIntensity: 0.45 });
    const geoFlocon = new THREE.SphereGeometry(1, 14, 10);
    let touche = false;
    SONS.sifflement(vol / 1000);
    const trainee = (n) => { for (let i = 0; i < n; i += 1) { const f = new THREE.Mesh(geoFlocon, matFlocon); const r = alea(0.02, 0.09); f.scale.set(r, r, r); f.position.copy(boule.position).add(new THREE.Vector3(alea(-1.5, 1.5), alea(-1.5, 1.5), alea(-1, 1))); f.userData.v = new THREE.Vector3(alea(-0.8, 0.8), alea(-1.2, 0.4), alea(-2, -0.5)); f.userData.vie = alea(0.5, 1.1); scene.add(f); flocons.push(f); } };
    return new Promise((resoudre) => {
      let precedent = t0;
      const boucle = () => {
        const maintenant = performance.now(); const dt = Math.min(0.05, (maintenant - precedent) / 1000); precedent = maintenant;
        const t = maintenant - t0;
        if (t < vol) {
          const k = t / vol; const e = k * k * (2 - k * 0.6);
          boule.position.lerpVectors(depart, arrivee, Math.min(1, e));
          boule.position.y += Math.sin(k * Math.PI) * 2.5 * (1 - k);
          boule.rotation.x += dt * 5; boule.rotation.y += dt * 2.2;
          if (k > 0.3) trainee(3);
        } else if (!touche) {
          touche = true; boule.visible = false; secouer(600); SONS.boule(); SONS.frisson(); tacher(el, 'neige'); givre();
            setTimeout(() => coulures(eclaboussures(centre, 46), 'neige'), 100);
          for (let i = 0; i < 420; i += 1) {
            const f = new THREE.Mesh(geoFlocon, matFlocon); const r = alea(0.03, 0.22); f.scale.set(r, r * alea(0.6, 1.3), r);
            f.position.copy(arrivee).add(new THREE.Vector3(alea(-1.2, 1.2), alea(-1.2, 1.2), alea(-0.4, 0.4)));
            const a = alea(0, Math.PI * 2); const vit = alea(1, 9);
            f.userData.v = new THREE.Vector3(Math.cos(a) * vit, Math.sin(a) * vit + 2, alea(0.4, 9)); f.userData.vie = 3;
            scene.add(f); flocons.push(f);
          }
        }
        for (let i = flocons.length - 1; i >= 0; i -= 1) {
          const f = flocons[i]; f.userData.v.y -= 6 * dt; f.position.addScaledVector(f.userData.v, dt); f.userData.vie -= dt;
          if (f.position.z > -0.3 || f.userData.vie < 0 || f.position.y < -14) { scene.remove(f); flocons.splice(i, 1); }
        }
        rendu.render(scene, camera);
        if (t < vol + 1700) requestAnimationFrame(boucle); else { fin(); resoudre(); }
      };
      requestAnimationFrame(boucle);
    });
  }

  /* ---------- Les autres farces, sur un canevas 2D ---------- */
  function particules(el, genre) {
    const c = canevas(); const ctx = c.getContext('2d');
    const centre = centreDe(el);
    const W = c.width; const H = c.height;
    const objets = []; const t0 = performance.now(); let duree = 2600;
    const couleurs = ['#E8608E', '#2BB5A0', '#C79CE6', '#F4C542', '#2E7FC2', '#E96A43'];
    if (genre === 'confettis') { SONS.pops(); for (let i = 0; i < 220; i += 1) objets.push({ x: Math.random() * W, y: -20 - Math.random() * H * 0.7, vx: (Math.random() - 0.5) * 60, vy: 120 + Math.random() * 180, r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 6, w: 6 + Math.random() * 7, h: 8 + Math.random() * 9, c: couleurs[i % couleurs.length] }); }
    if (genre === 'coeurs') { SONS.scintille(); for (let i = 0; i < 48; i += 1) objets.push({ x: centre.x + (Math.random() - 0.5) * 90, y: centre.y + 20, vx: (Math.random() - 0.5) * 100, vy: -90 - Math.random() * 150, s: 12 + Math.random() * 18, a: 1, d: Math.random() * 700 }); }
    if (genre === 'feu') { duree = 3400; for (let s = 0; s < 5; s += 1) { SONS.fusee(s * 0.45); SONS.boum(s * 0.45 + 0.7); const cx = centre.x + (Math.random() - 0.5) * 320; const cy = centre.y - 60 - Math.random() * 200; for (let i = 0; i < 70; i += 1) { const a = (i / 70) * Math.PI * 2; const v = 90 + Math.random() * 190; objets.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, c: couleurs[(s + i) % couleurs.length], d: 700 + s * 450, a: 1 }); } } }
    return new Promise((resoudre) => {
      let precedent = t0;
      const boucle = () => {
        const maintenant = performance.now(); const dt = Math.min(0.05, (maintenant - precedent) / 1000); precedent = maintenant;
        const t = maintenant - t0;
        ctx.clearRect(0, 0, W, H);
        if (genre === 'confettis') objets.forEach((o) => { o.x += o.vx * dt; o.y += o.vy * dt; o.r += o.vr * dt; ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(o.r); ctx.fillStyle = o.c; ctx.fillRect(-o.w / 2, -o.h / 2, o.w, o.h); ctx.restore(); });
        if (genre === 'coeurs') objets.forEach((o) => { if (t < o.d) return; o.x += o.vx * dt; o.y += o.vy * dt; o.a = Math.max(0, 1 - (t - o.d) / 1900); ctx.globalAlpha = o.a; ctx.font = `${o.s}px serif`; ctx.fillText('💗', o.x, o.y); ctx.globalAlpha = 1; });
        if (genre === 'feu') objets.forEach((o) => { if (t < o.d) return; o.vy += 70 * dt; o.x += o.vx * dt; o.y += o.vy * dt; o.a = Math.max(0, 1 - (t - o.d) / 1500); ctx.globalAlpha = o.a; ctx.fillStyle = o.c; ctx.beginPath(); ctx.arc(o.x, o.y, 3, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; });
        if (t < duree) requestAnimationFrame(boucle); else { c.remove(); resoudre(); }
      };
      requestAnimationFrame(boucle);
    });
  }

  async function jouer(id, el) {
    const f = parId(id);
    if (!f || enCours.has(id)) return;
    enCours.add(id);
    try {
      if (reduit()) { if (id === 'tarte') tacher(el, 'creme'); else if (id === 'neige') { tacher(el, 'neige'); givre(); } else if (el) { el.classList.add('farce-secoue'); setTimeout(() => el.classList.remove('farce-secoue'), 900); } return; }
      if (id === 'tarte') { try { await tarte3d(el); } catch (e) { console.warn('Tarte 3D impossible :', e); tacher(el, 'creme'); SONS.splat(); } }
      else if (id === 'neige') { try { await neige3d(el); } catch (e) { console.warn('Boule de neige 3D impossible :', e); tacher(el, 'neige'); givre(); SONS.boule(); } }
      else await particules(el, id);
    } finally { enCours.delete(id); }
  }

  window.FARCES = { LISTE, parId, idDe, texteDe, jouer, tacher, cible, SONS };
})();
