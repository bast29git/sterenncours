/* ============================================================================
 * farces.js : les farces de la messagerie, dans les deux espaces.
 *
 * Une farce est un message dont le contexte vaut « farce:<id> ». Elle s'anime
 * sur la photo de la personne visée : la tarte à la crème vole en 3D (three.js,
 * chargé à la demande depuis learning/vendor), les autres sont dessinées sur un
 * canevas plein écran. Avec « mouvement réduit », seul le résultat s'affiche.
 *
 *   FARCES.LISTE                      le catalogue
 *   FARCES.idDe(message)              l'identifiant, ou null
 *   FARCES.jouer(id, cibleElement)    l'animation, promesse tenue à la fin
 * ========================================================================== */
(function () {
  const LISTE = [
    { id: 'tarte', nom: 'Tarte à la crème', ico: '🥧', texte: '{qui} t\'envoie une tarte à la crème en pleine figure !', trois: true },
    { id: 'confettis', nom: 'Confettis', ico: '🎊', texte: '{qui} fait pleuvoir des confettis sur toi !' },
    { id: 'neige', nom: 'Boule de neige', ico: '❄️', texte: '{qui} te lance une boule de neige !' },
    { id: 'coeurs', nom: 'Pluie de cœurs', ico: '💗', texte: '{qui} t\'envoie une pluie de cœurs.' },
    { id: 'feu', nom: 'Feu d\'artifice', ico: '🎆', texte: '{qui} tire un feu d\'artifice pour toi !' },
  ];
  const parId = (id) => LISTE.find((f) => f.id === id) || null;
  const idDe = (m) => { const c = String(m && m.contexte || ''); return c.indexOf('farce:') === 0 && parId(c.slice(6)) ? c.slice(6) : null; };
  const texteDe = (id, qui) => { const f = parId(id); return f ? f.texte.replace('{qui}', qui) : ''; };
  const reduit = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const enCours = new Set();

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
      ? '<svg viewBox="0 0 100 100"><path d="M50 12c14 0 22 8 26 18 12 2 16 12 14 22-4 12-16 14-24 12-2 12-10 22-22 22-14 0-20-10-22-20-12 0-20-10-16-22 2-10 12-14 22-12 4-10 12-20 22-20Z" fill="#f4fbff" stroke="#cfe6f5" stroke-width="2"/></svg>'
      : '<svg viewBox="0 0 100 100"><path d="M48 8c16-2 26 8 30 18 10 0 18 10 14 22-2 10-12 14-20 12 0 12-8 24-22 24-12 0-18-8-22-18-12 2-22-6-22-18 0-10 8-16 16-16 0-12 12-22 26-24Z" fill="#fff7ea" stroke="#f0dcb8" stroke-width="2"/><circle cx="40" cy="42" r="5" fill="#f5d9a0"/><circle cx="62" cy="58" r="4" fill="#f5d9a0"/><path d="M30 70q6 14 2 22M70 68q4 12 8 18" stroke="#fff7ea" stroke-width="7" stroke-linecap="round"/></svg>';
    el.classList.add('farce-cible');
    el.appendChild(t);
    const essuyer = () => { t.classList.add('fin'); setTimeout(() => t.remove(), 300); };
    t.addEventListener('click', essuyer);
    setTimeout(essuyer, 12000);
  }

  /* --- Tarte à la crème en 3D ------------------------------------------------- */
  async function tarte3d(cible) {
    const THREE = await import('/learning/vendor/three.module.js');
    const c = canevas();
    const rendu = new THREE.WebGLRenderer({ canvas: c, alpha: true, antialias: true });
    rendu.setPixelRatio(Math.min(2, devicePixelRatio || 1));
    rendu.setSize(innerWidth, innerHeight, false);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 100);
    camera.position.set(0, 0, 10);
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const soleil = new THREE.DirectionalLight(0xffffff, 1.1); soleil.position.set(3, 5, 6); scene.add(soleil);
    // La tarte : un moule doré, une crème blanche, une cerise.
    const tarte = new THREE.Group();
    const moule = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 0.9, 0.35, 40), new THREE.MeshStandardMaterial({ color: 0xd9a066, roughness: 0.8 }));
    const creme = new THREE.Mesh(new THREE.CylinderGeometry(0.98, 0.98, 0.5, 40), new THREE.MeshStandardMaterial({ color: 0xfff7ea, roughness: 0.4 }));
    creme.position.y = 0.4;
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 }));
    dome.position.y = 0.62;
    const cerise = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), new THREE.MeshStandardMaterial({ color: 0xd42a4a, roughness: 0.3 }));
    cerise.position.y = 1.35;
    tarte.add(moule, creme, dome, cerise);
    scene.add(tarte);
    // Où frapper : le centre de la photo, projeté dans le plan z = 0.
    const centre = centreDe(cible);
    const demiH = Math.tan(THREE.MathUtils.degToRad(20)) * 10; const demiW = demiH * camera.aspect;
    const cibleX = (centre.x / innerWidth - 0.5) * 2 * demiW;
    const cibleY = -(centre.y / innerHeight - 0.5) * 2 * demiH;
    const depart = new THREE.Vector3(-demiW - 2, -demiH - 1, 0);
    const arrivee = new THREE.Vector3(cibleX, cibleY, 0);
    const eclats = [];
    const matEclat = new THREE.MeshStandardMaterial({ color: 0xfff7ea, roughness: 0.5 });
    const t0 = performance.now(); const vol = 1100; const eclat = 700;
    return new Promise((fin) => {
      let touche = false;
      const boucle = () => {
        const t = performance.now() - t0;
        if (t < vol) {
          const k = t / vol; const e = k * k * (3 - 2 * k);
          tarte.position.lerpVectors(depart, arrivee, e);
          tarte.position.y += Math.sin(k * Math.PI) * 2.2;
          tarte.rotation.x = k * Math.PI * 1.5; tarte.rotation.z = k * Math.PI * 0.5;
          const taille = 1 + k * 0.25; tarte.scale.set(taille, taille, taille);
        } else {
          if (!touche) {
            touche = true; tarte.visible = false; tacher(cible, 'creme');
            for (let i = 0; i < 46; i += 1) {
              const m = new THREE.Mesh(new THREE.SphereGeometry(0.06 + Math.random() * 0.12, 8, 6), matEclat);
              m.position.copy(arrivee);
              m.userData.v = new THREE.Vector3((Math.random() - 0.5) * 6, Math.random() * 5, (Math.random() - 0.3) * 4);
              scene.add(m); eclats.push(m);
            }
          }
          const dt = 0.016;
          eclats.forEach((m) => { m.userData.v.y -= 9.8 * dt; m.position.addScaledVector(m.userData.v, dt); });
        }
        rendu.render(scene, camera);
        if (t < vol + eclat) requestAnimationFrame(boucle);
        else { rendu.dispose(); c.remove(); fin(); }
      };
      requestAnimationFrame(boucle);
    });
  }

  /* --- Les autres farces, sur un canevas 2D --------------------------------- */
  function particules(cible, genre) {
    const c = canevas(); const ctx = c.getContext('2d');
    const centre = centreDe(cible);
    const W = c.width; const H = c.height;
    const objets = []; const t0 = performance.now(); let duree = 2400;
    const couleurs = ['#E8608E', '#2BB5A0', '#C79CE6', '#F4C542', '#2E7FC2', '#E96A43'];
    if (genre === 'confettis') for (let i = 0; i < 160; i += 1) objets.push({ x: Math.random() * W, y: -20 - Math.random() * H * 0.6, vx: (Math.random() - 0.5) * 60, vy: 120 + Math.random() * 160, r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 6, w: 6 + Math.random() * 6, h: 8 + Math.random() * 8, c: couleurs[i % couleurs.length] });
    if (genre === 'coeurs') for (let i = 0; i < 40; i += 1) objets.push({ x: centre.x + (Math.random() - 0.5) * 80, y: centre.y + 20, vx: (Math.random() - 0.5) * 90, vy: -80 - Math.random() * 140, s: 10 + Math.random() * 16, a: 1, d: Math.random() * 600 });
    if (genre === 'feu') { duree = 3000; for (let s = 0; s < 4; s += 1) { const cx = centre.x + (Math.random() - 0.5) * 260; const cy = centre.y - 40 - Math.random() * 160; for (let i = 0; i < 60; i += 1) { const a = (i / 60) * Math.PI * 2; const v = 90 + Math.random() * 160; objets.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, c: couleurs[(s + i) % couleurs.length], d: s * 450, a: 1 }); } } }
    let neige = genre === 'neige' ? { x: -40, y: H * 0.8, touche: false } : null;
    if (neige) { duree = 1900; }
    return new Promise((fin) => {
      let precedent = t0;
      const boucle = () => {
        const maintenant = performance.now(); const dt = Math.min(0.05, (maintenant - precedent) / 1000); precedent = maintenant;
        const t = maintenant - t0;
        ctx.clearRect(0, 0, W, H);
        if (genre === 'confettis') objets.forEach((o) => { o.x += o.vx * dt; o.y += o.vy * dt; o.r += o.vr * dt; ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(o.r); ctx.fillStyle = o.c; ctx.fillRect(-o.w / 2, -o.h / 2, o.w, o.h); ctx.restore(); });
        if (genre === 'coeurs') objets.forEach((o) => { if (t < o.d) return; o.x += o.vx * dt; o.y += o.vy * dt; o.a = Math.max(0, 1 - (t - o.d) / 1800); ctx.globalAlpha = o.a; ctx.font = `${o.s}px serif`; ctx.fillText('💗', o.x, o.y); ctx.globalAlpha = 1; });
        if (genre === 'feu') objets.forEach((o) => { if (t < o.d) return; o.vy += 60 * dt; o.x += o.vx * dt; o.y += o.vy * dt; o.a = Math.max(0, 1 - (t - o.d) / 1400); ctx.globalAlpha = o.a; ctx.fillStyle = o.c; ctx.beginPath(); ctx.arc(o.x, o.y, 3, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; });
        if (neige) {
          const k = Math.min(1, t / 1000);
          if (k < 1) { neige.x = -40 + (centre.x + 40) * k; neige.y = H * 0.8 + (centre.y - H * 0.8) * k - Math.sin(k * Math.PI) * 160; ctx.fillStyle = '#f4fbff'; ctx.strokeStyle = '#cfe6f5'; ctx.beginPath(); ctx.arc(neige.x, neige.y, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
          else if (!neige.touche) { neige.touche = true; tacher(cible, 'neige'); for (let i = 0; i < 30; i += 1) { const a = Math.random() * Math.PI * 2; objets.push({ x: centre.x, y: centre.y, vx: Math.cos(a) * (60 + Math.random() * 120), vy: Math.sin(a) * (60 + Math.random() * 120) - 80, a: 1 }); } }
          objets.forEach((o) => { o.vy += 300 * dt; o.x += o.vx * dt; o.y += o.vy * dt; ctx.fillStyle = '#f4fbff'; ctx.beginPath(); ctx.arc(o.x, o.y, 4, 0, Math.PI * 2); ctx.fill(); });
        }
        if (t < duree) requestAnimationFrame(boucle); else { c.remove(); fin(); }
      };
      requestAnimationFrame(boucle);
    });
  }

  async function jouer(id, cible) {
    const f = parId(id);
    if (!f || enCours.has(id)) return;
    enCours.add(id);
    try {
      if (reduit()) { if (id === 'tarte') tacher(cible, 'creme'); else if (id === 'neige') tacher(cible, 'neige'); else if (cible) { cible.classList.add('farce-secoue'); setTimeout(() => cible.classList.remove('farce-secoue'), 900); } return; }
      if (id === 'tarte') {
        try { await tarte3d(cible); } catch (e) { await particules(cible, 'neige'); tacher(cible, 'creme'); }
      } else await particules(cible, id);
      if (window.NOYAU && window.NOYAU.son) window.NOYAU.son('etoile');
    } finally { enCours.delete(id); }
  }

  window.FARCES = { LISTE, parId, idDe, texteDe, jouer, tacher };
})();
