/*
   Opaline : base commune des mondes 3D écrits pour les leçons (E18 à E27).
   Un monde importe creerMonde, décrit sa scène, ses légendes et ses défis ;
   la coquille (shell.js, monde3d) apporte accueil, fin, fiche, qualité, commandes.
*/
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const PBR_BASE = '../assets/3d/pbr2k/';
const ENV_BASE = '../assets/3d/env/';
const REDUIT = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

/** Le rendu est-il logiciel (SwiftShader, llvmpipe) ? Alors pas d'occlusion ambiante écran : jamais de rendu noir. */
export function renduLogiciel(renderer) {
  try { const gl = renderer.getContext(); const dbg = gl.getExtension('WEBGL_debug_renderer_info'); const rn = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : ''; return /swiftshader|llvmpipe|software|basic render/i.test(rn); } catch (e) { return false; }
}

const cacheTextures = new Map();
/**
 * Un jeu de textures PBR de Poly Haven (pbr2k), en cache : { map, normalMap, roughnessMap, aoMap }, répété `repetition` fois.
 * Les fichiers manquants sont ignorés : le matériau reste valable.
 */
export function texturesPBR(jeu, repetition, options) {
  options = options || {};
  const cle = jeu + '|' + (repetition || 1);
  if (cacheTextures.has(cle)) return cacheTextures.get(cle);
  const charg = new THREE.TextureLoader();
  const une = (suffixe, srgb) => {
    const t = charg.load(`${PBR_BASE}${jeu}/${jeu}_${suffixe}_1k.jpg`, undefined, undefined, () => {});
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repetition || 1, repetition || 1); t.anisotropy = 8;
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  const jeuT = { map: une('diff', true), normalMap: une('nor_gl'), roughnessMap: une('rough'), aoMap: options.sansAo ? null : une('ao') };
  cacheTextures.set(cle, jeuT);
  return jeuT;
}

/** Un matériau standard habillé d'un jeu PBR ; `opt` : { repetition, couleur, rugosite, metal, normale, ao }. */
export function matPBR(jeu, opt) {
  opt = opt || {};
  const t = texturesPBR(jeu, opt.repetition || 1, { sansAo: opt.ao === false });
  const m = new THREE.MeshStandardMaterial({ color: opt.couleur == null ? 0xffffff : opt.couleur, roughness: opt.rugosite == null ? 1 : opt.rugosite, metalness: opt.metal || 0, map: t.map, normalMap: t.normalMap, roughnessMap: t.roughnessMap, aoMap: t.aoMap || null, aoMapIntensity: opt.ao === false ? 0 : 0.9 });
  m.normalScale.set(opt.normale == null ? 0.8 : opt.normale, opt.normale == null ? 0.8 : opt.normale);
  return m;
}

/** Les géométries n'ont qu'un jeu d'UV : la carte d'occlusion lit le second, on le copie. */
export function preparerAo(geo) { if (geo && geo.attributes && geo.attributes.uv && !geo.attributes.uv1) geo.setAttribute('uv1', geo.attributes.uv); return geo; }

/** Un dôme de ciel dégradé, avec un disque solaire facultatif. `o` : { haut, horizon, bas, soleil: [x, y, z] | false, rayon } */
export function ciel(scene, o) {
  o = o || {};
  const mat = new THREE.ShaderMaterial({
    uniforms: { haut: { value: new THREE.Color(o.haut == null ? 0x2f6fc8 : o.haut) }, horizon: { value: new THREE.Color(o.horizon == null ? 0xdfe9f2 : o.horizon) }, bas: { value: new THREE.Color(o.bas == null ? 0x8e9aa6 : o.bas) }, dirSoleil: { value: new THREE.Vector3(...(o.soleil || [0.4, 0.5, 0.3])).normalize() }, avecSoleil: { value: o.soleil === false ? 0 : 1 } },
    vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * p; }',
    fragmentShader: `varying vec3 vDir; uniform vec3 haut; uniform vec3 horizon; uniform vec3 bas; uniform vec3 dirSoleil; uniform float avecSoleil;
      void main(){ float h = vDir.y; vec3 c = h > 0.0 ? mix(horizon, haut, pow(clamp(h, 0.0, 1.0), 0.55)) : mix(horizon, bas, clamp(-h * 3.0, 0.0, 1.0));
        float s = max(0.0, dot(vDir, dirSoleil)); c += avecSoleil * (vec3(1.0, 0.95, 0.85) * pow(s, 900.0) * 3.0 + vec3(1.0, 0.85, 0.6) * pow(s, 24.0) * 0.35);
        gl_FragColor = vec4(c, 1.0); }`,
    side: THREE.BackSide, depthWrite: false, fog: false,
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(o.rayon || 400, 48, 24), mat); dome.name = 'ciel'; dome.raycast = () => {}; dome.renderOrder = -10;
  scene.add(dome); return dome;
}

/**
 * Crée scène, caméra, rendu, contrôles, lumières, sol et boucle d'animation, puis branche le socle commun.
 * @param {object} shell  l'objet renvoyé par Konstrio.createGame
 * @param {object} o  { fond, hdri (chemin | false), hdriFond, brouillard, camera: { position, cible, fov, near, far, min, max, polaire },
 *                     sol: { taille, couleur, texture (jeu pbr2k), repetition, y, carre } | false, ciel: { haut, horizon, bas, soleil } | true,
 *                     soleil: { position, intensite, couleur, etendue }, ambiance, legende, legendes, exposition, surQualite, ombres,
 *                     rendu: { bloom: { force, rayon, seuil } | false, smaa, gtao } }
 * Chaîne de rendu : Render, occlusion ambiante écran (cran haut, GPU réel), bloom discret, SMAA, sortie ACES.
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
  soleil.shadow.mapSize.set(2048, 2048); soleil.shadow.camera.near = 1; soleil.shadow.camera.far = 120; soleil.shadow.normalBias = 0.02;
  const e = sol.etendue || 24; soleil.shadow.camera.left = -e; soleil.shadow.camera.right = e; soleil.shadow.camera.top = e; soleil.shadow.camera.bottom = -e; soleil.shadow.bias = -0.0006;
  scene.add(soleil);
  // L'environnement lumineux : la carte HDRI demandée, ou le ciel de jour par défaut dès qu'il y a un sol.
  const hdri = o.hdri === false ? null : (o.hdri || (o.sol !== false ? ENV_BASE + 'sky_day_1k.hdr' : null));
  if (hdri) {
    const pm = new THREE.PMREMGenerator(renderer); pm.compileEquirectangularShader();
    new RGBELoader().load(hdri, (t) => { t.mapping = THREE.EquirectangularReflectionMapping; const env = pm.fromEquirectangular(t).texture; scene.environment = env; if (o.hdriFond) { scene.background = t; scene.backgroundBlurriness = o.hdriFlou == null ? 0.25 : o.hdriFlou; } else t.dispose(); pm.dispose(); }, undefined, () => {});
    scene.environmentIntensity = o.environnement == null ? 0.9 : o.environnement;
  }
  if (o.ciel) ciel(scene, o.ciel === true ? { soleil: (o.soleil && o.soleil.position) || undefined } : Object.assign({ soleil: (o.soleil && o.soleil.position) || undefined }, o.ciel));
  let solMesh = null;
  if (o.sol !== false) {
    const s = o.sol || {};
    const geo = s.carre ? new THREE.PlaneGeometry(s.taille * 2 || 80, s.taille * 2 || 80, 1, 1) : new THREE.CircleGeometry(s.taille || 40, 64);
    preparerAo(geo);
    const materiau = s.texture ? matPBR(s.texture, { repetition: s.repetition || Math.max(4, Math.round((s.taille || 40) / 3)), couleur: s.couleur == null ? 0xffffff : s.couleur, rugosite: s.rugosite == null ? 1 : s.rugosite, normale: s.normale }) : new THREE.MeshStandardMaterial({ color: s.couleur == null ? 0x8d8a80 : s.couleur, roughness: 0.95, metalness: 0 });
    solMesh = new THREE.Mesh(geo, materiau);
    solMesh.rotation.x = -Math.PI / 2; solMesh.position.y = s.y || 0; solMesh.receiveShadow = true; solMesh.name = 'sol'; scene.add(solMesh);
  }

  /* La chaîne de rendu : Render, GTAO (cran haut, GPU réel, pas en mouvement réduit), bloom discret, SMAA, sortie. */
  const r = Object.assign({ bloom: { force: 0.35, rayon: 0.45, seuil: 0.9 }, smaa: true, gtao: true }, o.rendu || {});
  const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera));
  const logiciel = renduLogiciel(renderer); const mobile = window.matchMedia('(max-width: 640px), (pointer: coarse)').matches;
  let gtao = null;
  if (r.gtao && !logiciel && !REDUIT && !mobile) {
    try {
      gtao = new GTAOPass(scene, camera, stage.clientWidth, stage.clientHeight); gtao.blendIntensity = 0.65;
      try { gtao.updateGtaoMaterial({ radius: 0.4, distanceExponent: 1, thickness: 1, scale: 1, samples: 12, distanceFallOff: 1 }); } catch (e) { /* valeurs par défaut */ }
      // La pré-passe normales et profondeur ignore sprites et étiquettes : ils pollueraient le tampon.
      gtao.render = function (rd, wb, rb, dt, mk) { const caches = []; scene.traverse((x) => { if ((x.isSprite || x.isLensflare || x.isPoints || x.isLine) && x.visible) { x.visible = false; caches.push(x); } }); try { GTAOPass.prototype.render.call(this, rd, wb, rb, dt, mk); } finally { caches.forEach((x) => { x.visible = true; }); } };
      composer.addPass(gtao);
    } catch (e) { gtao = null; }
  }
  let bloom = null;
  if (r.bloom) { bloom = new UnrealBloomPass(new THREE.Vector2(stage.clientWidth, stage.clientHeight), r.bloom.force == null ? 0.35 : r.bloom.force, r.bloom.rayon == null ? 0.45 : r.bloom.rayon, r.bloom.seuil == null ? 0.9 : r.bloom.seuil); composer.addPass(bloom); }
  let smaa = null;
  if (r.smaa) { smaa = new SMAAPass(stage.clientWidth, stage.clientHeight); composer.addPass(smaa); }
  composer.addPass(new OutputPass());
  let composerActif = true;

  const boucles = []; const clock = new THREE.Clock();
  function animer() {
    const dt = Math.min(0.05, clock.getDelta()); const t = clock.elapsedTime;
    controls.update();
    for (const f of boucles) { try { f(dt, t); } catch (err) { /* une boucle ne casse pas le rendu */ } }
    if (composerActif) { try { composer.render(dt); return; } catch (err) { composerActif = false; } }
    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animer);
  function redimensionner() {
    const w = Math.max(1, stage.clientWidth); const h = Math.max(1, stage.clientHeight); camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
    composer.setSize(w, h); if (smaa) smaa.setSize(w, h); if (gtao) gtao.setSize(w, h); if (bloom) bloom.setSize(w, h);
  }
  window.addEventListener('resize', redimensionner); new ResizeObserver(redimensionner).observe(stage);

  // Les crans de qualité de la coquille : l'occlusion au cran haut, le lissage dès le cran moyen.
  function surQualite(cran) {
    if (gtao) gtao.enabled = cran >= 3;
    if (smaa) smaa.enabled = cran >= 2;
    composerActif = cran >= 2 || !!(bloom && bloom.enabled);
    if (o.surQualite) o.surQualite(cran);
  }
  const socle = window.Konstrio.monde3d({ THREE, scene, camera, renderer, controls, exposition: o.exposition, brouillard: o.brouillard, legende: o.legende || null, legendes: o.legendes || null, surQualite, bloom: () => bloom, composer: () => composer });

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

  /** Un matériau PBR prêt pour un maillage de ce monde (la géométrie reçoit son second jeu d'UV pour l'occlusion). */
  function pbr(jeu, opt) { return matPBR(jeu, opt); }
  /** Un maillage habillé d'un jeu PBR, avec ombres. */
  function meshPBR(geo, jeu, opt, position, parent) { return mesh(preparerAo(geo), matPBR(jeu, opt), position, parent); }
  /** Un matériau physique (verre, laque, métal poli) en une ligne : { couleur, transmission, rugosite, metal, epaisseur, ior, clearcoat, opacite }. */
  function matPhysique(opt) { opt = opt || {}; return new THREE.MeshPhysicalMaterial(Object.assign({ color: opt.couleur == null ? 0xffffff : opt.couleur, roughness: opt.rugosite == null ? 0.1 : opt.rugosite, metalness: opt.metal || 0, transmission: opt.transmission || 0, thickness: opt.epaisseur == null ? 0.5 : opt.epaisseur, ior: opt.ior || 1.5, clearcoat: opt.clearcoat || 0, clearcoatRoughness: opt.clearcoatRugosite == null ? 0.1 : opt.clearcoatRugosite, transparent: !!(opt.transmission || (opt.opacite != null && opt.opacite < 1)), opacity: opt.opacite == null ? 1 : opt.opacite, side: opt.double ? THREE.DoubleSide : THREE.FrontSide }, opt.emissif ? { emissive: new THREE.Color(opt.emissif), emissiveIntensity: opt.intensite || 0.8 } : {})); }
  return { THREE, scene, camera, renderer, controls, stage, soleil, sol: solMesh, socle, composer, bloom, gtao, panneau, etiquette, mat, mesh, pbr, meshPBR, matPhysique, texturesPBR, preparerAo, legender, boucle: (f) => boucles.push(f), redimensionner };
}
