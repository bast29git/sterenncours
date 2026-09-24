/*
   Opaline : base commune des mondes 3D écrits pour les leçons (E18 à E27).
   Un monde importe creerMonde, décrit sa scène, ses légendes et ses défis ;
   la coquille (shell.js, monde3d) apporte accueil, fin, fiche, qualité, commandes.
*/
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const STYLE = `
  .mb-panneau { position: absolute; z-index: 20; top: 14px; left: 14px; width: 250px; max-height: calc(100% - 28px); overflow: auto; padding: 12px; display: flex; flex-direction: column; gap: 9px; background: color-mix(in srgb, var(--surface) 90%, transparent); border: 1px solid var(--border); border-radius: 14px; box-shadow: var(--shadow-md); backdrop-filter: blur(10px); font-size: 13.5px; line-height: 1.45; }
  .mb-panneau.droite { left: auto; right: 14px; }
  .mb-panneau h3 { font-family: var(--font-mono); font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--fg-muted); margin: 2px 0 0; }
  .mb-panneau p { margin: 0; }
  .mb-ligne { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
  .mb-ligne b { font-family: var(--font-data); font-size: 14px; }
  .mb-plage { width: 100%; accent-color: var(--accent); min-height: 32px; }
  .mb-bouton { font: inherit; font-weight: 700; font-size: 13px; min-height: 40px; padding: 6px 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface-2); color: var(--fg); cursor: pointer; text-align: left; }
  .mb-bouton[aria-pressed="true"], .mb-bouton.primaire { background: var(--accent); border-color: var(--accent); color: var(--on-accent, #fff); }
  .mb-bouton:focus-visible { outline: none; box-shadow: var(--ring); }
  .mb-groupe { display: flex; flex-wrap: wrap; gap: 6px; }
  .mb-groupe .mb-bouton { flex: 1 1 auto; text-align: center; min-height: 36px; padding: 4px 8px; }
  .mb-carte { background: var(--accent-weak); color: var(--accent-text); border-radius: 10px; padding: 9px 11px; font-size: 13px; }
  .mb-val { font-family: var(--font-data); font-weight: 700; color: var(--accent-text); }
  .mb-mesures { font-family: var(--font-data); font-size: 13px; display: grid; grid-template-columns: 1fr auto; gap: 3px 10px; }
  .mb-mesures b { font-weight: 700; }
  .mb-etapes { display: flex; flex-direction: column; gap: 5px; }
  .mb-etapes .mb-bouton { display: flex; gap: 8px; align-items: center; }
  .mb-etapes .mb-bouton i { display: inline-grid; place-items: center; width: 22px; height: 22px; border-radius: 999px; background: var(--surface); color: var(--fg); font-style: normal; font-size: 12px; font-weight: 800; flex: none; }
  .mb-etapes .mb-bouton[aria-pressed="true"] i { background: #fff; color: var(--accent); }
  @media (max-width: 720px) { .mb-panneau { width: min(220px, 62vw); padding: 10px; font-size: 12.5px; top: 10px; left: 10px; max-height: 52%; } .mb-panneau.droite { right: 10px; } }
`;

export { THREE };

/** Un texte rendu dans une texture (pour les étiquettes 3D). */
export function textureTexte(texte, o) {
  o = o || {};
  const c = document.createElement('canvas'); const px = 2; const taille = (o.taille || 30) * px;
  const x = c.getContext('2d'); x.font = `700 ${taille}px ${o.police || 'Nunito, Arial, sans-serif'}`;
  const lignes = String(texte).split('\n'); const w = Math.max(...lignes.map((l) => x.measureText(l).width)) + 36 * px; const h = lignes.length * taille * 1.3 + 22 * px;
  c.width = Math.ceil(w); c.height = Math.ceil(h);
  x.font = `700 ${taille}px ${o.police || 'Nunito, Arial, sans-serif'}`; x.textBaseline = 'middle'; x.textAlign = 'center';
  if (o.fond !== 'none') { x.fillStyle = o.fond || 'rgba(20, 30, 40, 0.78)'; const r = 14 * px; x.beginPath(); x.roundRect(0, 0, c.width, c.height, r); x.fill(); }
  x.fillStyle = o.couleur || '#ffffff';
  lignes.forEach((l, i) => x.fillText(l, c.width / 2, (i + 0.5) * taille * 1.3 + 11 * px));
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.userData.ratio = c.width / c.height;
  return t;
}

/** Point d'une sphère de rayon r à la latitude et longitude données (degrés). */
export function latlon(lat, lon, r) {
  const phi = (90 - lat) * Math.PI / 180; const th = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
}

/** Un arc entre deux points de la sphère, qui s'élève au milieu. */
export function arcSphere(a, b, r, hauteur, n) {
  const pts = []; const N = n || 48;
  for (let i = 0; i <= N; i += 1) {
    const t = i / N; const p = a.clone().lerp(b, t).normalize();
    const eleve = r * (1 + (hauteur || 0.18) * Math.sin(Math.PI * t));
    pts.push(p.multiplyScalar(eleve));
  }
  return new THREE.CatmullRomCurve3(pts);
}

/**
 * Crée scène, caméra, rendu, contrôles, lumières, sol et boucle d'animation, puis branche le socle commun.
 * @param {object} shell  l'objet renvoyé par Konstrio.createGame
 * @param {object} o  { fond, hdri, brouillard, camera: { position, cible, fov, near, far }, sol: { taille, couleur } | false,
 *                     soleil: { position, intensite, couleur }, ambiance, legende, legendes, exposition, surQualite, ombres }
 */
export function creerMonde(shell, o) {
  o = o || {};
  if (!document.getElementById('mb-styles')) { const st = document.createElement('style'); st.id = 'mb-styles'; st.textContent = STYLE; document.head.appendChild(st); }
  const stage = shell.stage;
  const scene = new THREE.Scene(); window.Konstrio.declarer3d({ scene });
  if (o.fond != null) scene.background = typeof o.fond === 'number' ? new THREE.Color(o.fond) : o.fond;
  const cam = o.camera || {};
  const camera = new THREE.PerspectiveCamera(cam.fov || 50, Math.max(1, stage.clientWidth) / Math.max(1, stage.clientHeight), cam.near || 0.1, cam.far || 800);
  camera.position.fromArray(cam.position || [8, 6, 12]);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' }); window.Konstrio.declarer3d({ renderer });
  renderer.shadowMap.enabled = o.ombres !== false; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  window.Konstrio.adapterRendu(renderer); renderer.setSize(stage.clientWidth, stage.clientHeight);
  renderer.domElement.setAttribute('aria-label', o.libelle || 'Scène en trois dimensions'); renderer.domElement.setAttribute('role', 'img');
  stage.appendChild(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.target.fromArray(cam.cible || [0, 1, 0]); controls.minDistance = cam.min || 2; controls.maxDistance = cam.max || 60; controls.maxPolarAngle = cam.polaire == null ? Math.PI * 0.49 : cam.polaire;
  controls.update();

  scene.add(new THREE.HemisphereLight(0xdfe9ff, 0x2a2018, o.ambiance == null ? 0.9 : o.ambiance));
  const sol = o.soleil || {};
  const soleil = new THREE.DirectionalLight(sol.couleur == null ? 0xfff3e0 : sol.couleur, sol.intensite == null ? 1.6 : sol.intensite);
  soleil.position.fromArray(sol.position || [12, 18, 8]); soleil.castShadow = o.ombres !== false;
  soleil.shadow.mapSize.set(1024, 1024); soleil.shadow.camera.near = 1; soleil.shadow.camera.far = 120;
  const e = sol.etendue || 24; soleil.shadow.camera.left = -e; soleil.shadow.camera.right = e; soleil.shadow.camera.top = e; soleil.shadow.camera.bottom = -e; soleil.shadow.bias = -0.0006;
  scene.add(soleil);
  if (o.hdri) {
    const pm = new THREE.PMREMGenerator(renderer);
    new RGBELoader().load(o.hdri, (t) => { t.mapping = THREE.EquirectangularReflectionMapping; scene.environment = pm.fromEquirectangular(t).texture; t.dispose(); pm.dispose(); }, undefined, () => {});
  }
  if (o.sol !== false) {
    const s = o.sol || {}; const g = new THREE.Mesh(new THREE.CircleGeometry(s.taille || 40, 64), new THREE.MeshStandardMaterial({ color: s.couleur == null ? 0x8d8a80 : s.couleur, roughness: 0.95, metalness: 0 }));
    g.rotation.x = -Math.PI / 2; g.position.y = s.y || 0; g.receiveShadow = true; g.name = 'sol'; scene.add(g);
  }

  const boucles = []; const clock = new THREE.Clock();
  function animer() {
    const dt = Math.min(0.05, clock.getDelta()); const t = clock.elapsedTime;
    controls.update();
    for (const f of boucles) { try { f(dt, t); } catch (err) { /* une boucle ne casse pas le rendu */ } }
    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animer);
  function redimensionner() { const w = Math.max(1, stage.clientWidth); const h = Math.max(1, stage.clientHeight); camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h); }
  window.addEventListener('resize', redimensionner); new ResizeObserver(redimensionner).observe(stage);

  const socle = window.Konstrio.monde3d({ THREE, scene, camera, renderer, controls, exposition: o.exposition, brouillard: o.brouillard, legende: o.legende || null, legendes: o.legendes || null, surQualite: o.surQualite });

  /** Un panneau de commandes HTML posé sur la scène. */
  function panneau(html, cote) { const p = document.createElement('div'); p.className = 'mb-panneau' + (cote === 'droite' ? ' droite' : ''); p.innerHTML = html; stage.appendChild(p); return p; }
  /** Une étiquette texte flottante (sprite), toujours face à la caméra. */
  function etiquette(texte, position, opt) {
    opt = opt || {}; const tex = textureTexte(texte, opt);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: opt.profondeur !== false }));
    const h = opt.hauteur || 0.6; sp.scale.set(h * tex.userData.ratio, h, 1); sp.position.fromArray(position); sp.renderOrder = 10; sp.raycast = () => {};
    scene.add(sp); return sp;
  }
  /** Matériau standard en une ligne. */
  function mat(couleur, opt) { opt = opt || {}; return new THREE.MeshStandardMaterial(Object.assign({ color: couleur, roughness: opt.rugosite == null ? 0.6 : opt.rugosite, metalness: opt.metal || 0 }, opt.transparent ? { transparent: true, opacity: opt.opacite == null ? 0.5 : opt.opacite } : {}, opt.emissif ? { emissive: new THREE.Color(opt.emissif), emissiveIntensity: opt.intensite || 0.8 } : {})); }
  /** Un maillage avec ombres, ajouté à la scène ou au parent. */
  function mesh(geo, materiau, position, parent) { const m = new THREE.Mesh(geo, materiau); if (position) m.position.fromArray(position); m.castShadow = true; m.receiveShadow = true; (parent || scene).add(m); return m; }
  function legender(objet, nom, phrase) { objet.userData.legende = { nom, phrase }; objet.traverse((c) => { if (c !== objet) c.userData.legende = objet.userData.legende; }); return objet; }

  return { THREE, scene, camera, renderer, controls, stage, soleil, socle, panneau, etiquette, mat, mesh, legender, boucle: (f) => boucles.push(f), redimensionner };
}
