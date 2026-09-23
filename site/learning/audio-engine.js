/* ============================================================
   KONSTRIO — audio-engine.js (§32.2 / §31.4)
   Couche audio commune des 20 jeux 3D (et utilisable en 2D).
   - Web Audio NATIF (aucune dépendance, aucun fichier son requis :
     identité sonore procédurale → reste auto-hébergé & sans licence).
   - Bus : master / music / ambience / sfx / ui / voice (GainNode).
   - Ducking auto (la musique/ambiance baisse quand Konstrio parle).
   - Ambiances adaptatives (exploration/défi/danger/réussite).
   - Aucun son avant interaction (politique navigateur respectée).
   - Tout désactivable + accessibilité : mode confort, muet pédagogique,
     reduced-audio lié à prefers-reduced-motion. Réglages persistés.
   - Helper THREE.PositionalAudio si une instance THREE est fournie.
   API : window.KonstrioAudio
   ============================================================ */
(function () {
  'use strict';
  if (window.KonstrioAudio) return;

  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LS = 'konstrio-audio';
  function loadPrefs() {
    try { return JSON.parse(localStorage.getItem(LS) || '{}'); } catch (e) { return {}; }
  }
  function savePrefs(p) { try { localStorage.setItem(LS, JSON.stringify(p)); } catch (e) {} }

  var prefs = loadPrefs();
  // Volumes par bus (0..1). Défauts sobres.
  var VOL = Object.assign({ master: 0.8, music: 0.5, ambience: 0.6, sfx: 0.8, ui: 0.7, voice: 1.0 }, prefs.vol || {});
  var state = {
    ready: false,
    muted: prefs.muted === true,            // muet global
    comfort: prefs.comfort === true,        // mode confort : moins de basses/pics
    silentEdu: prefs.silentEdu === true,    // muet pédagogique : pas de son (texte/icônes ailleurs)
    reduced: prefs.reduced != null ? prefs.reduced : REDUCED, // moins d'ambiances
    ctx: null, buses: {}, ambianceNodes: null, ambianceName: null, mood: 'exploration', speaking: false,
  };

  var BUSES = ['music', 'ambience', 'sfx', 'ui', 'voice'];

  function ensure() {
    if (state.ctx) return state.ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    var ctx = new AC();
    state.ctx = ctx;
    var master = ctx.createGain();
    master.gain.value = state.muted ? 0 : VOL.master;
    master.connect(ctx.destination);
    state.buses.master = master;
    BUSES.forEach(function (b) {
      var g = ctx.createGain();
      g.gain.value = VOL[b];
      g.connect(master);
      state.buses[b] = g;
    });
    state.ready = true;
    return ctx;
  }

  // Reprise du contexte après le 1er geste utilisateur (politique autoplay).
  function resume() {
    var ctx = ensure();
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
    window.addEventListener(ev, function once() {
      resume();
      ['pointerdown', 'keydown', 'touchstart'].forEach(function (e2) { window.removeEventListener(e2, once); });
    }, { once: false });
  });

  function busGain(name) { ensure(); return state.buses[name] || state.buses.master; }

  /* ---------- Brique de synthèse : une note enveloppée ---------- */
  function tone(opts) {
    if (state.muted || state.silentEdu) return;
    var ctx = resume(); if (!ctx) return;
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = opts.type || 'sine';
    o.frequency.value = opts.freq || 440;
    var t = ctx.currentTime + (opts.at || 0);
    var peak = (opts.gain != null ? opts.gain : 0.18) * (state.comfort ? 0.6 : 1);
    var dur = opts.dur || 0.18;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak), t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(busGain(opts.bus || 'sfx'));
    o.start(t); o.stop(t + dur + 0.02);
  }
  function chord(freqs, opts) {
    opts = opts || {};
    freqs.forEach(function (f, i) { tone(Object.assign({}, opts, { freq: f, at: (opts.at || 0) + i * (opts.spread || 0.07) })); });
  }

  /* ---------- Identité sonore Konstrio (procédurale) ---------- */
  var ID = {
    accueil: function () { chord([523.25, 659.25, 783.99], { bus: 'ui', type: 'triangle', dur: 0.5, gain: 0.14, spread: 0.08 }); }, // arpège cyan
    indice: function () { tone({ freq: 880, bus: 'ui', type: 'sine', dur: 0.22, gain: 0.12 }); tone({ freq: 1175, bus: 'ui', at: 0.09, dur: 0.18, gain: 0.1 }); }, // lumineux discret
    erreur: function () { tone({ freq: 330, bus: 'ui', type: 'sine', dur: 0.28, gain: 0.12 }); tone({ freq: 247, bus: 'ui', at: 0.1, dur: 0.3, gain: 0.1 }); }, // doux, non punitif
    bravo: function () { chord([659.25, 783.99, 987.77, 1318.5], { bus: 'ui', type: 'triangle', dur: 0.42, gain: 0.14, spread: 0.06 }); }, // mini-fanfare
    pourquoi: function () { tone({ freq: 587, bus: 'ui', type: 'sine', dur: 0.18, gain: 0.1 }); tone({ freq: 740, bus: 'ui', at: 0.12, dur: 0.22, gain: 0.1 }); }, // curieux
    defi: function () { chord([392, 523.25, 659.25, 880], { bus: 'ui', type: 'sawtooth', dur: 0.5, gain: 0.1, spread: 0.09 }); }, // montée Aurora
    click: function () { tone({ freq: 660, bus: 'ui', type: 'square', dur: 0.06, gain: 0.07 }); },
  };

  /* ---------- Ducking : baisse music/ambience quand Konstrio parle ---------- */
  function duck(on) {
    ensure();
    var ctx = state.ctx; if (!ctx) return;
    ['music', 'ambience'].forEach(function (b) {
      var g = state.buses[b]; if (!g) return;
      var target = on ? VOL[b] * 0.25 : VOL[b];
      g.gain.cancelScheduledValues(ctx.currentTime);
      g.gain.setTargetAtTime(target, ctx.currentTime, 0.15);
    });
  }

  /* ---------- Ambiance adaptative (bruit filtré + drone) ---------- */
  function stopAmbience() {
    if (state.ambianceNodes) { try { state.ambianceNodes.forEach(function (n) { try { n.stop && n.stop(); } catch (e) {} try { n.disconnect(); } catch (e) {} }); } catch (e) {} }
    state.ambianceNodes = null; state.ambianceName = null;
  }
  function setAmbience(name) {
    ensure(); var ctx = state.ctx; if (!ctx) { state.ambianceName = name; return; }
    if (state.ambianceName === name) return;
    stopAmbience();
    if (state.muted || state.silentEdu || state.reduced) { state.ambianceName = name; return; }
    // Drone doux : 2 oscillateurs basse + un bruit filtré, propre à chaque univers.
    var presets = {
      solaire: { base: 70, type: 'sine', cut: 600 }, abysses: { base: 55, type: 'sine', cut: 350 },
      moteur: { base: 90, type: 'sawtooth', cut: 800 }, datacenter: { base: 110, type: 'triangle', cut: 1200 },
      foret: { base: 80, type: 'sine', cut: 2000 }, centrale: { base: 75, type: 'sine', cut: 500 },
      default: { base: 80, type: 'sine', cut: 700 },
    };
    var p = presets[name] || presets.default;
    var nodes = [];
    [p.base, p.base * 1.5].forEach(function (f) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = p.type; o.frequency.value = f;
      g.gain.value = 0.05 * (state.comfort ? 0.5 : 1);
      o.connect(g); g.connect(busGain('ambience')); o.start(); nodes.push(o); nodes.push(g);
    });
    state.ambianceNodes = nodes; state.ambianceName = name;
  }

  function setMood(mood) { state.mood = mood; /* hook : moduler filtre/tempo selon exploration/défi/danger/réussite */ }

  /* ---------- API publique ---------- */
  function applyVolumes() {
    ensure(); var ctx = state.ctx; if (!ctx) return;
    if (state.buses.master) state.buses.master.gain.setTargetAtTime(state.muted ? 0 : VOL.master, ctx.currentTime, 0.05);
    BUSES.forEach(function (b) { if (state.buses[b]) state.buses[b].gain.setTargetAtTime(VOL[b], ctx.currentTime, 0.05); });
  }
  function persist() { savePrefs({ vol: VOL, muted: state.muted, comfort: state.comfort, silentEdu: state.silentEdu, reduced: state.reduced }); }

  window.KonstrioAudio = {
    init: resume,
    play: function (id) { if (ID[id]) ID[id](); },             // identité sonore Konstrio
    sfx: function (freq, opts) { tone(Object.assign({ freq: freq, bus: 'sfx' }, opts || {})); },
    ambience: setAmbience,
    stopAmbience: stopAmbience,
    mood: setMood,
    speak: function (on) { state.speaking = !!on; duck(!!on); }, // appelé quand Konstrio parle (ducking)
    setVolume: function (bus, v) { if (VOL[bus] != null) { VOL[bus] = Math.max(0, Math.min(1, v)); applyVolumes(); persist(); } },
    getVolumes: function () { return Object.assign({}, VOL); },
    mute: function (on) { state.muted = on == null ? !state.muted : !!on; applyVolumes(); persist(); return state.muted; },
    comfort: function (on) { state.comfort = on == null ? !state.comfort : !!on; persist(); return state.comfort; },
    silentEdu: function (on) { state.silentEdu = on == null ? !state.silentEdu : !!on; if (state.silentEdu) stopAmbience(); persist(); return state.silentEdu; },
    reducedAudio: function (on) { state.reduced = on == null ? !state.reduced : !!on; if (state.reduced) stopAmbience(); persist(); return state.reduced; },
    isMuted: function () { return state.muted; },
    // Helper : rattacher un THREE.AudioListener à la caméra pour l'audio spatial (PositionalAudio).
    attachListener: function (THREE, camera) {
      try { var l = new THREE.AudioListener(); camera.add(l); return l; } catch (e) { return null; }
    },
  };
})();
