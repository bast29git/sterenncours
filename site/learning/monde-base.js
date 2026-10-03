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
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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
  /* Mission : objectifs, chrono, score */
  .mb-mission { position: absolute; z-index: 21; top: 14px; right: 14px; width: 240px; padding: 10px 12px; background: color-mix(in srgb, var(--surface) 90%, transparent); border: 1px solid var(--border); border-radius: 14px; box-shadow: var(--shadow-md); backdrop-filter: blur(10px); font-size: 13px; line-height: 1.4; }
  .mb-mission h3 { font-family: var(--font-mono); font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--fg-muted); margin: 0 0 6px; display: flex; justify-content: space-between; gap: 8px; }
  .mb-mission ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
  .mb-mission li { display: flex; gap: 8px; align-items: flex-start; padding: 5px 7px; border-radius: 8px; background: var(--surface-2); }
  .mb-mission li i { flex: none; width: 18px; height: 18px; border-radius: 999px; border: 2px solid var(--border); display: grid; place-items: center; font-style: normal; font-size: 11px; margin-top: 1px; }
  .mb-mission li.fait { opacity: .7; } .mb-mission li.fait i { background: var(--accent); border-color: var(--accent); color: var(--on-accent, #fff); }
  .mb-mission li.courant { outline: 2px solid var(--accent); }
  .mb-mission .chrono { font-family: var(--font-data); font-weight: 700; font-size: 14px; color: var(--fg); }
  .mb-mission .jauge { height: 6px; border-radius: 4px; background: var(--border); overflow: hidden; margin-top: 8px; } .mb-mission .jauge i { display: block; height: 100%; background: var(--accent); transition: width .25s; }
  @media (max-width: 720px) { .mb-mission { width: min(200px, 56vw); top: 10px; right: 10px; font-size: 12px; max-height: 40%; overflow: auto; } }
  /* Marche à la première personne : joystick tactile et bouton */
  .mb-stick { position: absolute; z-index: 22; left: 18px; bottom: 18px; width: 120px; height: 120px; border-radius: 50%; background: rgba(20, 30, 40, .28); border: 2px solid rgba(255, 255, 255, .35); touch-action: none; display: none; }
  .mb-stick i { position: absolute; left: 35px; top: 35px; width: 50px; height: 50px; border-radius: 50%; background: rgba(255, 255, 255, .78); box-shadow: 0 2px 8px rgba(0, 0, 0, .3); }
  .mb-stick.on { display: block; }
  .mb-aide-marche { position: absolute; z-index: 21; bottom: 18px; left: 50%; transform: translateX(-50%); font-size: 12px; color: var(--fg-muted); background: color-mix(in srgb, var(--surface) 86%, transparent); border: 1px solid var(--border); border-radius: 999px; padding: 5px 12px; white-space: nowrap; }
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

  /* ---------- F225 : une ambiance sonore, fichier ou synthèse, qui suit le bouton muet de la coquille ---------- */
const audio = { ctx: null, maitre: null, actives: [] };
  const muet = () => { try { return localStorage.getItem('konstrio-muted') === '1'; } catch (e) { return false; } };
  function contexteAudio() {
    if (audio.ctx) return audio.ctx;
    try { audio.ctx = new (window.AudioContext || window.webkitAudioContext)(); audio.maitre = audio.ctx.createGain(); audio.maitre.gain.value = muet() ? 0 : 1; audio.maitre.connect(audio.ctx.destination); } catch (e) { return null; }
    const reprendre = () => { if (audio.ctx.state === 'suspended') audio.ctx.resume(); };
    ['pointerdown', 'keydown', 'touchstart'].forEach((ev) => window.addEventListener(ev, reprendre, { passive: true }));
    const suivreMuet = () => { if (audio.maitre) audio.maitre.gain.setTargetAtTime(muet() ? 0 : 1, audio.ctx.currentTime, 0.1); };
    document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('.ksh-sound')) setTimeout(suivreMuet, 0); }, true);
    window.addEventListener('storage', suivreMuet); window.addEventListener('mute-change', suivreMuet);
    document.addEventListener('visibilitychange', () => { if (audio.maitre) audio.maitre.gain.setTargetAtTime(document.hidden || muet() ? 0 : 1, audio.ctx.currentTime, 0.2); });
    return audio.ctx;
  }
  function bruit(ctx, secondes, couleur) {
    const n = Math.floor(ctx.sampleRate * (secondes || 4)); const b = ctx.createBuffer(1, n, ctx.sampleRate); const d = b.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, dernier = 0;
    for (let i = 0; i < n; i += 1) { const w = Math.random() * 2 - 1; if (couleur === 'brun') { dernier = (dernier + 0.02 * w) / 1.02; d[i] = dernier * 3.5; } else if (couleur === 'rose') { b0 = 0.99765 * b0 + w * 0.099; b1 = 0.963 * b1 + w * 0.2965; b2 = 0.57 * b2 + w * 1.0526; d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.11; } else d[i] = w * 0.5; }
    return b;
  }
  /**
   * `o` : { fichier, type: 'vent' | 'pluie' | 'foule' | 'machine' | 'eau' | 'feu' | 'ville' | 'salle' | 'espace' | 'foret', volume, boucle }
   * Un fichier (ogg ou mp3 dans ../assets/3d/audio/) est joué en boucle ; sans fichier, le type est synthétisé.
   */
export function ambiance(o) {
    o = o || {}; const ctx = contexteAudio(); if (!ctx) return { volume() {}, arreter() {} };
    const gain = ctx.createGain(); gain.gain.value = 0; gain.connect(audio.maitre);
    const noeuds = []; const v = o.volume == null ? 0.35 : o.volume;
    const monter = () => gain.gain.setTargetAtTime(v, ctx.currentTime, 1.2);
    if (o.fichier) {
      fetch(o.fichier).then((r) => r.arrayBuffer()).then((b) => ctx.decodeAudioData(b)).then((buf) => { const src = ctx.createBufferSource(); src.buffer = buf; src.loop = o.boucle !== false; src.connect(gain); src.start(); noeuds.push(src); monter(); }).catch(() => { if (o.type) synthese(o.type); });
    } else synthese(o.type || 'vent');
    function synthese(type) {
      const src = ctx.createBufferSource(); src.loop = true;
      const filtre = ctx.createBiquadFilter(); const lfo = ctx.createOscillator(); const lfoGain = ctx.createGain();
      if (type === 'vent' || type === 'espace') { src.buffer = bruit(ctx, 5, 'brun'); filtre.type = 'lowpass'; filtre.frequency.value = type === 'espace' ? 120 : 420; lfo.frequency.value = 0.08; lfoGain.gain.value = type === 'espace' ? 40 : 260; lfo.connect(lfoGain); lfoGain.connect(filtre.frequency); }
      else if (type === 'pluie' || type === 'eau') { src.buffer = bruit(ctx, 4, 'rose'); filtre.type = type === 'eau' ? 'bandpass' : 'highpass'; filtre.frequency.value = type === 'eau' ? 900 : 1800; filtre.Q.value = 0.7; lfo.frequency.value = 0.2; lfoGain.gain.value = 300; lfo.connect(lfoGain); lfoGain.connect(filtre.frequency); }
      else if (type === 'foule' || type === 'ville' || type === 'salle') { src.buffer = bruit(ctx, 6, 'rose'); filtre.type = 'bandpass'; filtre.frequency.value = type === 'salle' ? 500 : 700; filtre.Q.value = 0.5; lfo.frequency.value = 0.35; lfoGain.gain.value = 200; lfo.connect(lfoGain); lfoGain.connect(filtre.frequency); if (type === 'ville') { const klax = ctx.createOscillator(); const kg = ctx.createGain(); kg.gain.value = 0; klax.frequency.value = 330; klax.connect(kg); kg.connect(gain); klax.start(); noeuds.push(klax); setInterval(() => { if (Math.random() < 0.25) { kg.gain.setTargetAtTime(0.06, ctx.currentTime, 0.05); kg.gain.setTargetAtTime(0, ctx.currentTime + 0.4, 0.2); } }, 6000); } }
      else if (type === 'machine') { src.buffer = bruit(ctx, 3, 'brun'); filtre.type = 'lowpass'; filtre.frequency.value = 300; lfo.frequency.value = 1.6; lfoGain.gain.value = 180; lfo.connect(lfoGain); lfoGain.connect(filtre.frequency); const bourdon = ctx.createOscillator(); bourdon.type = 'sawtooth'; bourdon.frequency.value = 55; const bg = ctx.createGain(); bg.gain.value = 0.08; bourdon.connect(bg); bg.connect(gain); bourdon.start(); noeuds.push(bourdon); }
      else if (type === 'feu') { src.buffer = bruit(ctx, 4, 'rose'); filtre.type = 'lowpass'; filtre.frequency.value = 1400; lfo.frequency.value = 3; lfoGain.gain.value = 600; lfo.connect(lfoGain); lfoGain.connect(filtre.frequency); }
      else if (type === 'foret') { src.buffer = bruit(ctx, 6, 'brun'); filtre.type = 'lowpass'; filtre.frequency.value = 600; lfo.frequency.value = 0.12; lfoGain.gain.value = 300; lfo.connect(lfoGain); lfoGain.connect(filtre.frequency); const osc = ctx.createOscillator(); const og = ctx.createGain(); og.gain.value = 0; osc.frequency.value = 2400; osc.connect(og); og.connect(gain); osc.start(); noeuds.push(osc); setInterval(() => { if (Math.random() < 0.5) { osc.frequency.setValueAtTime(1800 + Math.random() * 1500, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(2600 + Math.random() * 800, ctx.currentTime + 0.12); og.gain.setTargetAtTime(0.05, ctx.currentTime, 0.02); og.gain.setTargetAtTime(0, ctx.currentTime + 0.15, 0.05); } }, 2500); }
      else { src.buffer = bruit(ctx, 4, 'rose'); filtre.type = 'lowpass'; filtre.frequency.value = 800; }
      src.connect(filtre); filtre.connect(gain); lfo.start(); src.start(); noeuds.push(src, lfo); monter();
    }
    const controle = { volume: (x) => gain.gain.setTargetAtTime(x, ctx.currentTime, 0.5), arreter: () => { gain.gain.setTargetAtTime(0, ctx.currentTime, 0.4); setTimeout(() => noeuds.forEach((n) => { try { n.stop(); } catch (e) { /* déjà arrêté */ } }), 1500); } };
    audio.actives.push(controle); return controle;
  }
  /** Un son bref synthétisé : 'pas', 'clic', 'cloche', 'splash', 'tic', 'souffle', 'coup'. */
export function son(type, o) {
    const ctx = contexteAudio(); if (!ctx) return; o = o || {}; const t = ctx.currentTime; const g = ctx.createGain(); g.connect(audio.maitre); g.gain.value = 0;
    if (type === 'cloche' || type === 'tic' || type === 'clic') { const osc = ctx.createOscillator(); osc.type = type === 'cloche' ? 'sine' : 'triangle'; osc.frequency.value = o.frequence || (type === 'cloche' ? 880 : type === 'tic' ? 1400 : 600); osc.connect(g); osc.start(t); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(o.volume || 0.25, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + (type === 'cloche' ? 1.2 : 0.08)); osc.stop(t + 1.3); return; }
    const src = ctx.createBufferSource(); src.buffer = bruit(ctx, 0.6, type === 'pas' || type === 'coup' ? 'brun' : 'rose'); const f = ctx.createBiquadFilter(); f.type = type === 'splash' ? 'highpass' : 'lowpass'; f.frequency.value = type === 'pas' ? 500 : type === 'coup' ? 200 : type === 'souffle' ? 1200 : 2500;
    src.connect(f); f.connect(g); src.start(t); const dur = type === 'pas' ? 0.12 : type === 'coup' ? 0.25 : 0.5; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(o.volume || 0.3, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); src.stop(t + dur + 0.05);
  }


/**
 * F228 : les outils de jeu, utilisables aussi par les mondes qui n'emploient pas creerMonde :
 *   const o = outils({ scene, camera, renderer, controls, stage, boucle, legender, etiquette });
 *   o.marcher(...), o.mission(...), o.personnage(...), o.chargerModele(...)
 */
function injecterStyle() { if (!document.getElementById('mb-styles')) { const st = document.createElement('style'); st.id = 'mb-styles'; st.textContent = STYLE; document.head.appendChild(st); } }

export function outils(ctx) {
  const { scene, camera, renderer, controls, stage } = ctx;
  injecterStyle();
  const boucles = []; const boucle = ctx.boucle || ((f) => boucles.push(f));
  if (!ctx.boucle) { const clock = new THREE.Clock(); const pas = () => { const dt = Math.min(0.05, clock.getDelta()); boucles.forEach((f) => { try { f(dt, clock.elapsedTime); } catch (e) { /* rien */ } }); requestAnimationFrame(pas); }; requestAnimationFrame(pas); }
  const legender = ctx.legender || ((objet, nom, phrase) => { objet.userData.legende = { nom, phrase }; objet.traverse((c) => { if (c !== objet) c.userData.legende = objet.userData.legende; }); return objet; });
  const etiquette = ctx.etiquette || ((texte, position, opt) => { opt = opt || {}; const tex = textureTexte(texte, opt); const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false })); const h = opt.hauteur || 0.6; sp.scale.set(h * tex.userData.ratio, h, 1); sp.position.fromArray(position); sp.raycast = () => {}; scene.add(sp); return sp; });
  /* ---------- F223 : la marche à la première personne (clavier, flèches, joystick tactile, regard au doigt) ---------- */
  function marcher(o) {
    o = o || {};
    const hauteur = o.hauteur == null ? 1.65 : o.hauteur; const vitesse = o.vitesse || 3;
    const lim = o.limites || { xmin: -30, xmax: 30, zmin: -30, zmax: 30 };
    const touches = {}; let actif = false; let yaw = 0; let pitch = 0; let glisse = null;
    const stick = document.createElement('div'); stick.className = 'mb-stick'; stick.innerHTML = '<i></i>'; stick.setAttribute('aria-hidden', 'true'); stage.appendChild(stick);
    const nub = stick.firstChild; let vecStick = { x: 0, y: 0 };
    const aide = document.createElement('div'); aide.className = 'mb-aide-marche'; aide.hidden = true; aide.textContent = o.aide || 'Flèches ou ZQSD pour marcher, glisse pour regarder. Échap : vue libre.'; stage.appendChild(aide);
    const sauvegarde = { position: camera.position.clone(), cible: controls.target.clone() };
    const dom = renderer.domElement;
    const onKey = (e, v) => { const k = e.key.toLowerCase(); if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'z', 'q', 's', 'd', 'w', 'a', 'shift'].includes(k)) { touches[k] = v; if (actif) e.preventDefault(); } if (v && k === 'escape' && actif) desactiver(); };
    const onDown = (e) => { if (!actif || e.target !== dom) return; glisse = { x: e.clientX, y: e.clientY }; };
    const onMove = (e) => { if (!actif || !glisse) return; yaw -= (e.clientX - glisse.x) * 0.0045; pitch = Math.max(-1.2, Math.min(1.2, pitch - (e.clientY - glisse.y) * 0.0035)); glisse = { x: e.clientX, y: e.clientY }; };
    const onUp = () => { glisse = null; };
    stick.addEventListener('pointerdown', (e) => { stick.setPointerCapture(e.pointerId); majStick(e); });
    stick.addEventListener('pointermove', (e) => { if (e.buttons || e.pointerType === 'touch') majStick(e); });
    const finStick = () => { vecStick = { x: 0, y: 0 }; nub.style.transform = ''; };
    stick.addEventListener('pointerup', finStick); stick.addEventListener('pointercancel', finStick);
    function majStick(e) { const r = stick.getBoundingClientRect(); let dx = (e.clientX - r.left - r.width / 2) / (r.width / 2); let dy = (e.clientY - r.top - r.height / 2) / (r.height / 2); const n = Math.hypot(dx, dy); if (n > 1) { dx /= n; dy /= n; } vecStick = { x: dx, y: dy }; nub.style.transform = `translate(${dx * 35}px, ${dy * 35}px)`; }
    function activer(depart) {
      if (actif) return; actif = true; controls.enabled = false;
      const p = depart || o.depart || [0, 0, 6]; camera.position.set(p[0], hauteur + (o.sol || 0), p[2]);
      yaw = o.yaw != null ? o.yaw : Math.atan2(camera.position.x, camera.position.z); pitch = 0;
      stick.classList.add('on'); aide.hidden = false; dom.style.cursor = 'grab';
      window.addEventListener('keydown', onKeyDown); window.addEventListener('keyup', onKeyUp); dom.addEventListener('pointerdown', onDown); window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp);
      if (o.surChangement) o.surChangement(true);
    }
    function desactiver() {
      if (!actif) return; actif = false; controls.enabled = true; stick.classList.remove('on'); aide.hidden = true; dom.style.cursor = '';
      camera.position.copy(sauvegarde.position); controls.target.copy(sauvegarde.cible); controls.update();
      window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); dom.removeEventListener('pointerdown', onDown); window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp);
      Object.keys(touches).forEach((k) => { touches[k] = false; }); finStick();
      if (o.surChangement) o.surChangement(false);
    }
    const onKeyDown = (e) => onKey(e, true); const onKeyUp = (e) => onKey(e, false);
    let bob = 0;
    boucle((dt) => {
      if (!actif) return;
      let av = (touches.arrowup || touches.z || touches.w ? 1 : 0) - (touches.arrowdown || touches.s ? 1 : 0);
      let lat = (touches.arrowright || touches.d ? 1 : 0) - (touches.arrowleft || touches.q || touches.a ? 1 : 0);
      av -= vecStick.y; lat += vecStick.x;
      const v = vitesse * (touches.shift ? 1.8 : 1);
      const dir = new THREE.Vector3(Math.sin(yaw) * -1, 0, Math.cos(yaw) * -1); const droite = new THREE.Vector3(-dir.z, 0, dir.x);
      const pas = new THREE.Vector3().addScaledVector(dir, av * v * dt).addScaledVector(droite, lat * v * dt);
      const cible = camera.position.clone().add(pas);
      cible.x = Math.max(lim.xmin, Math.min(lim.xmax, cible.x)); cible.z = Math.max(lim.zmin, Math.min(lim.zmax, cible.z));
      if (!o.collision || !o.collision(cible.x, cible.z)) { camera.position.x = cible.x; camera.position.z = cible.z; }
      const bouge = Math.abs(av) + Math.abs(lat) > 0.05; bob = bouge ? bob + dt * 9 : 0;
      const solY = o.solA ? o.solA(camera.position.x, camera.position.z) : (o.sol || 0);
      camera.position.y = solY + hauteur + (bouge ? Math.sin(bob) * 0.035 : 0);
      const regard = new THREE.Vector3(Math.sin(yaw) * -Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * -Math.cos(pitch));
      camera.lookAt(camera.position.clone().add(regard));
      if (o.surPas && bouge) o.surPas(dt);
    });
    return { activer, desactiver, estActif: () => actif, position: () => camera.position.clone(), direction: () => new THREE.Vector3(Math.sin(yaw) * -1, 0, Math.cos(yaw) * -1), bascule: () => (actif ? desactiver() : activer()) };
  }

  /* ---------- F224 : une mission : des objectifs, une progression, un chrono facultatif, une fin ---------- */
  function mission(o) {
    o = o || {}; const objectifs = (o.objectifs || []).map((x) => Object.assign({ fait: false }, x));
    const zone = document.createElement('section'); zone.className = 'mb-mission'; zone.setAttribute('aria-live', 'polite'); stage.appendChild(zone);
    let debut = null; let finie = false; let score = 0;
    const api = window.__kshApi;
    const rendre = () => {
      const faits = objectifs.filter((x) => x.fait).length; const courant = objectifs.find((x) => !x.fait);
      zone.innerHTML = `<h3><span>${o.titre || 'Mission'}</span>${o.chrono ? `<span class="chrono" data-chrono>${formater(ecoule())}</span>` : ''}</h3>
        <ol>${objectifs.map((x) => `<li class="${x.fait ? 'fait' : ''} ${x === courant ? 'courant' : ''}"><i aria-hidden="true">${x.fait ? '✓' : ''}</i><span>${x.texte}</span></li>`).join('')}</ol>
        <div class="jauge" aria-hidden="true"><i style="width:${Math.round((faits / Math.max(1, objectifs.length)) * 100)}%"></i></div>`;
    };
    const ecoule = () => (debut ? (performance.now() - debut) / 1000 : 0);
    const formater = (t) => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
    function commencer() { debut = performance.now(); finie = false; objectifs.forEach((x) => { x.fait = false; }); rendre(); if (api && o.annonce !== false) api.say(o.intro || ('Mission : ' + (o.titre || '')), 'concentre'); }
    function valider(id, points) {
      const x = objectifs.find((y) => y.id === id); if (!x || x.fait || finie) return false;
      x.fait = true; score += points == null ? 100 : points; if (api) { api.addScore(points == null ? 100 : points); api.sound('good'); }
      rendre(); if (x.apres) { try { x.apres(); } catch (e) { /* rien */ } }
      if (objectifs.every((y) => y.fait)) terminer(true);
      return true;
    }
    function terminer(reussie) {
      if (finie) return; finie = true; const t = ecoule();
      if (o.surFin) { try { o.surFin(reussie, t, score); } catch (e) { /* rien */ } }
      if (api && o.gagner !== false) api.win({ score, stars: reussie ? (o.chrono && o.chronoCible && t > o.chronoCible ? 2 : 3) : 1, title: (o.titre || 'Mission') + (reussie ? ' réussie' : ' inachevée') + (o.chrono ? ' en ' + formater(t) : ''), detail: { mission: o.titre, objectifs: objectifs.map((x) => x.id), secondes: Math.round(t) }, buddy: reussie ? (o.bravo || 'Mission accomplie.') : 'On pourra la refaire.' });
    }
    boucle(() => { if (!debut || finie) return; const c = zone.querySelector('[data-chrono]'); if (c) c.textContent = formater(ecoule()); if (o.chronoMax && ecoule() > o.chronoMax) terminer(false); objectifs.forEach((x) => { if (!x.fait && typeof x.verifier === 'function') { let ok = false; try { ok = !!x.verifier(); } catch (e) { ok = false; } if (ok) valider(x.id, x.points); } }); });
    rendre(); zone.hidden = o.cachee === true;
    return { commencer, valider, terminer, rendre, objectifs, estFinie: () => finie, ecoule, montrer: () => { zone.hidden = false; }, cacher: () => { zone.hidden = true; }, zone };
  }

  /* ---------- F226 : un personnage articulé, bâti sur des capsules, qui marche, regarde et parle ---------- */
  function personnage(o) {
    o = o || {}; const g = new THREE.Group(); const t = o.taille || 1.7; const u = t / 1.7;
    const peau = o.peau == null ? 0xe8c4a8 : o.peau; const haut = o.haut == null ? 0x5a6fb0 : o.haut; const bas = o.bas == null ? 0x3b3f4a : o.bas; const cheveux = o.cheveux == null ? 0x3a2a1e : o.cheveux;
    const mp = (c, opt) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.75 }, opt || {}));
    const capsule = (r, h, mat) => new THREE.Mesh(THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(r, h, 6, 12) : new THREE.CylinderGeometry(r, r, h + 2 * r, 12), mat);
    const torse = capsule(0.17 * u, 0.32 * u, mp(haut)); torse.position.y = 1.12 * u; g.add(torse);
    const bassin = capsule(0.16 * u, 0.08 * u, mp(bas)); bassin.position.y = 0.86 * u; g.add(bassin);
    const cou = new THREE.Mesh(new THREE.CylinderGeometry(0.05 * u, 0.06 * u, 0.1 * u, 10), mp(peau)); cou.position.y = 1.42 * u; g.add(cou);
    const tete = new THREE.Mesh(new THREE.SphereGeometry(0.12 * u, 24, 18), mp(peau)); tete.position.y = 1.58 * u; tete.scale.set(0.92, 1.08, 0.95); g.add(tete);
    const chev = new THREE.Mesh(new THREE.SphereGeometry(0.125 * u, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.55), mp(cheveux, { roughness: 0.9 })); chev.position.y = 1.6 * u; chev.scale.set(0.95, 1.05, 0.98); g.add(chev);
    if (o.chapeau) { const bord = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * u, 0.2 * u, 0.015 * u, 24), mp(o.chapeau)); bord.position.y = 1.69 * u; g.add(bord); const haut2 = new THREE.Mesh(new THREE.CylinderGeometry(0.11 * u, 0.12 * u, o.chapeau === 0x111111 ? 0.22 * u : 0.1 * u, 24), mp(o.chapeau)); haut2.position.y = 1.69 * u + (o.chapeau === 0x111111 ? 0.11 : 0.05) * u; g.add(haut2); }
    const yeux = new THREE.Mesh(new THREE.SphereGeometry(0.016 * u, 8, 8), mp(0x1a1a22)); yeux.position.set(-0.04 * u, 1.6 * u, 0.105 * u); g.add(yeux); const y2 = yeux.clone(); y2.position.x = 0.04 * u; g.add(y2);
    const membres = {};
    const membre = (nom, x, y, r, h, mat, epaule) => { const piv = new THREE.Group(); piv.position.set(x, y, 0); const m = capsule(r, h, mat); m.position.y = -(h / 2 + r); piv.add(m); g.add(piv); membres[nom] = piv; if (epaule) { const ep = new THREE.Mesh(new THREE.SphereGeometry(r * 1.15, 12, 10), mat); piv.add(ep); } };
    membre('brasG', -0.22 * u, 1.3 * u, 0.055 * u, 0.5 * u, mp(haut), true); membre('brasD', 0.22 * u, 1.3 * u, 0.055 * u, 0.5 * u, mp(haut), true);
    membre('jambeG', -0.09 * u, 0.82 * u, 0.07 * u, 0.6 * u, mp(bas)); membre('jambeD', 0.09 * u, 0.82 * u, 0.07 * u, 0.6 * u, mp(bas));
    [['jambeG', -0.09], ['jambeD', 0.09]].forEach(([n, x]) => { const pied = new THREE.Mesh(new THREE.BoxGeometry(0.1 * u, 0.06 * u, 0.22 * u), mp(0x2a2320)); pied.position.set(0, -0.78 * u, 0.04 * u); membres[n].add(pied); });
    if (o.jupe) { const jupe = new THREE.Mesh(new THREE.ConeGeometry(0.3 * u, 0.75 * u, 20, 1, true), mp(o.jupe, { side: THREE.DoubleSide })); jupe.position.y = 0.5 * u; g.add(jupe); }
    if (o.tablier) { const tab = new THREE.Mesh(new THREE.PlaneGeometry(0.3 * u, 0.6 * u), mp(o.tablier, { side: THREE.DoubleSide })); tab.position.set(0, 0.95 * u, 0.17 * u); g.add(tab); }
    g.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
    if (o.position) g.position.fromArray(o.position);
    if (o.nom) legender(g, o.nom, o.phrase || ''); scene.add(g);
    let phase = 0; let cibleMarche = null; let vitesse = o.vitesse || 1.1; let bulle = null; let bulleT = 0; let enMarche = false;
    const animer = (dt, t) => {
      if (cibleMarche) {
        const d = cibleMarche.clone().sub(g.position); d.y = 0; const dist = d.length();
        if (dist < 0.05) { cibleMarche = null; enMarche = false; if (o.surArrivee) o.surArrivee(); } else { d.normalize(); g.position.addScaledVector(d, Math.min(dist, vitesse * dt)); g.rotation.y = Math.atan2(d.x, d.z); enMarche = true; }
      }
      if (enMarche) { phase += dt * 7 * vitesse; const a = Math.sin(phase) * 0.6; membres.jambeG.rotation.x = a; membres.jambeD.rotation.x = -a; membres.brasG.rotation.x = -a * 0.7; membres.brasD.rotation.x = a * 0.7; g.position.y = (o.position ? o.position[1] : 0) + Math.abs(Math.sin(phase)) * 0.02; }
      else { ['jambeG', 'jambeD', 'brasG', 'brasD'].forEach((n) => { membres[n].rotation.x *= 0.85; }); membres.brasG.rotation.z = 0.08 + Math.sin(t * 1.3) * 0.02; membres.brasD.rotation.z = -0.08 - Math.sin(t * 1.3) * 0.02; }
      tete.rotation.y = Math.sin(t * 0.7 + (o.graine || 0)) * 0.25;
      if (bulle && performance.now() > bulleT) { scene.remove(bulle); bulle = null; }
    };
    boucle(animer);
    return {
      groupe: g, membres, tete,
      allerA: (p, v) => { cibleMarche = p.isVector3 ? p.clone() : new THREE.Vector3(p[0], g.position.y, p[2]); if (v) vitesse = v; },
      marcherSurPlace: (oui) => { enMarche = oui; },
      regarder: (p) => { const v = (p.isVector3 ? p : new THREE.Vector3(...p)).clone().sub(g.position); g.rotation.y = Math.atan2(v.x, v.z); },
      dire: (texte, secondes) => { if (bulle) scene.remove(bulle); bulle = etiquette(texte, [0, 0, 0], { taille: 26, hauteur: 0.42, fond: 'rgba(22, 30, 42, 0.9)', couleur: '#ffffff' }); bulle.position.copy(g.position).add(new THREE.Vector3(0, 1.98 * u, 0)); bulleT = performance.now() + (secondes || 4) * 1000; if (window.__kshApi && o.voix !== false) window.__kshApi.say(texte, 'joyeux'); },
      position: () => g.position,
    };
  }

  /* ---------- F227 : un modèle glTF ou GLB, promis ---------- */
  function chargerModele(url, o) {
    o = o || {};
    return new Promise((ok, ko) => new GLTFLoader().load(url, (gltf) => {
      const racine = gltf.scene; racine.traverse((m) => { if (m.isMesh) { m.castShadow = o.ombres !== false; m.receiveShadow = o.ombres !== false; } });
      if (o.echelle) racine.scale.setScalar(o.echelle); if (o.position) racine.position.fromArray(o.position);
      let melangeur = null; if (gltf.animations && gltf.animations.length) { melangeur = new THREE.AnimationMixer(racine); boucle((dt) => melangeur.update(dt)); }
      if (o.ajouter !== false) scene.add(racine);
      ok({ scene: racine, animations: gltf.animations || [], melangeur, jouer: (nom) => { if (!melangeur) return null; const clip = typeof nom === 'number' ? gltf.animations[nom] : (gltf.animations.find((a) => a.name === nom) || gltf.animations[0]); if (!clip) return null; const action = melangeur.clipAction(clip); action.play(); return action; } });
    }, undefined, ko));
  }

  return { marcher, mission, personnage, chargerModele, ambiance, son };
}

/**
 * Crée scène, caméra, rendu, contrôles, lumières, sol et boucle d'animation, puis branche le socle commun.
 * @param {object} shell  l'objet renvoyé par Konstrio.createGame
 * @param {object} o  { fond, hdri (chemin | false), hdriFond, brouillard, camera: { position, cible, fov, near, far, min, max, polaire },
 *                     sol: { taille, couleur, texture (jeu pbr2k), repetition, y, carre } | false, ciel: { haut, horizon, bas, soleil } | true,
 *                     soleil: { position, intensite, couleur, etendue }, ambiance, legende, legendes, exposition, surQualite, ombres,
 *                     rendu: { bloom: { force, rayon, seuil } | false, smaa, gtao } }
 * Chaîne de rendu : Render, occlusion ambiante écran (cran haut, GPU réel), bloom discret, SMAA, sortie ACES.
 * Retour : { ..., marcher(o), mission(o), ambiance(o), son(type), personnage(o), chargerModele(url, o) } (voir chaque fonction).
 */
export function creerMonde(shell, o) {
  o = o || {};
  injecterStyle();
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
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false, depthTest: opt.profondeur !== false }));
    const h = opt.hauteur || 0.6; sp.scale.set(h * tex.userData.ratio, h, 1); sp.position.fromArray(position); sp.renderOrder = 10; sp.raycast = () => {};
    scene.add(sp); return sp;
  }
  /** Matériau standard en une ligne. */
  function mat(couleur, opt) { opt = opt || {}; return new THREE.MeshStandardMaterial(Object.assign({ color: couleur, roughness: opt.rugosite == null ? 0.6 : opt.rugosite, metalness: opt.metal || 0 }, opt.transparent ? { transparent: true, opacity: opt.opacite == null ? 0.5 : opt.opacite } : {}, opt.emissif ? { emissive: new THREE.Color(opt.emissif), emissiveIntensity: opt.intensite || 0.8 } : {})); }
  /** Un maillage avec ombres, ajouté à la scène ou au parent. */
  function mesh(geo, materiau, position, parent) { const m = new THREE.Mesh(geo, materiau); if (position) m.position.fromArray(position); m.castShadow = true; m.receiveShadow = true; (parent || scene).add(m); return m; }
  function legender(objet, nom, phrase) { objet.userData.legende = { nom, phrase }; objet.traverse((c) => { if (c !== objet) c.userData.legende = objet.userData.legende; }); return objet; }

  const extras = outils({ scene, camera, renderer, controls, stage, boucle: (f) => boucles.push(f), legender, etiquette });

  /** Un matériau PBR prêt pour un maillage de ce monde (la géométrie reçoit son second jeu d'UV pour l'occlusion). */
  function pbr(jeu, opt) { return matPBR(jeu, opt); }
  /** Un maillage habillé d'un jeu PBR, avec ombres. */
  function meshPBR(geo, jeu, opt, position, parent) { return mesh(preparerAo(geo), matPBR(jeu, opt), position, parent); }
  /** Un matériau physique (verre, laque, métal poli) en une ligne : { couleur, transmission, rugosite, metal, epaisseur, ior, clearcoat, opacite }. */
  function matPhysique(opt) { opt = opt || {}; return new THREE.MeshPhysicalMaterial(Object.assign({ color: opt.couleur == null ? 0xffffff : opt.couleur, roughness: opt.rugosite == null ? 0.1 : opt.rugosite, metalness: opt.metal || 0, transmission: opt.transmission || 0, thickness: opt.epaisseur == null ? 0.5 : opt.epaisseur, ior: opt.ior || 1.5, clearcoat: opt.clearcoat || 0, clearcoatRoughness: opt.clearcoatRugosite == null ? 0.1 : opt.clearcoatRugosite, transparent: !!(opt.transmission || (opt.opacite != null && opt.opacite < 1)), opacity: opt.opacite == null ? 1 : opt.opacite, side: opt.double ? THREE.DoubleSide : THREE.FrontSide }, opt.emissif ? { emissive: new THREE.Color(opt.emissif), emissiveIntensity: opt.intensite || 0.8 } : {})); }
  return { THREE, scene, camera, renderer, controls, stage, soleil, sol: solMesh, socle, composer, bloom, gtao, panneau, etiquette, mat, mesh, pbr, meshPBR, matPhysique, texturesPBR, preparerAo, legender, marcher: extras.marcher, mission: extras.mission, ambiance, son, personnage: extras.personnage, chargerModele: extras.chargerModele, boucle: (f) => boucles.push(f), redimensionner };
}
