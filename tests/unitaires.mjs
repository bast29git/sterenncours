/**
 * A57 : tests unitaires des fonctions pures, sans navigateur ni serveur.
 *   node --test tests/unitaires.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const RACINE = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const lire = (f) => fs.readFileSync(path.join(RACINE, f), 'utf8');

/** Charge un script du site dans un bac à sable avec un « window » minimal. */
function charger(fichier, window = {}) {
  const ctx = { window, document: { addEventListener() {}, getElementById() { return null; }, querySelector() { return null; } }, console, setTimeout, clearTimeout, localStorage: { getItem() { return null; }, setItem() {} }, sessionStorage: { getItem() { return null; }, setItem() {} } };
  ctx.window.matchMedia = () => ({ matches: false });
  vm.createContext(ctx);
  vm.runInContext(lire(fichier), ctx, { filename: fichier });
  return ctx.window;
}

test('planificateur : trois séances de cours et deux temps perso par semaine, vacances sautées', () => {
  const lecons = (n, p) => Array.from({ length: n }, (_, i) => ({ ref: 'L' + String(i + 1).padStart(2, '0'), titre: 'Leçon ' + p + i, periode: 1 + (i % 5) }));
  const w = charger('site/planificateur.js', { PROGRAMME: { matieres: [{ id: 'maths', nom: 'Maths', lecons: lecons(8, 'm') }, { id: 'francais', nom: 'Français', lecons: lecons(8, 'f') }, { id: 'svt', nom: 'SVT', lecons: lecons(6, 's') }] } });
  const r = w.PLANIFICATEUR.generer('2026-10-05', 4, { mercredi: { debut: '13:00', fin: '14:30' }, vacances: [{ du: '2026-10-19', au: '2026-10-25', nom: 'test' }], dureePerso: 15 });
  const cours = r.seances.filter((s) => s.type === 'cours');
  const perso = r.seances.filter((s) => s.type === 'travail');
  assert.equal(cours.length, 12, 'douze cours sur quatre semaines posées');
  assert.equal(perso.length, 8, 'huit temps perso');
  const semaines = new Set(cours.map((s) => s.date));
  assert.equal(semaines.size, 12, 'un cours par jour de cours');
  assert.ok(!r.seances.some((s) => s.date >= '2026-10-19' && s.date <= '2026-10-25'), 'aucune séance pendant les vacances');
  assert.equal(perso[0].fin, '17:15', 'temps perso de quinze minutes');
  assert.ok(r.seances.every((s) => /^\d{4}-\d{2}-\d{2}$/.test(s.date)), 'dates au format ISO');
});

test('messagerie : mise en forme légère et neutralisation du HTML', () => {
  const w = charger('site/messagerie.js', { NOYAU: { ech: (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'), ic: () => '' } });
  const M = w.MESSAGERIE;
  assert.ok(M && typeof M.formater === 'function', 'module chargé');
  const gras = M.formater('Un mot **important** ici', true);
  assert.ok(/<(b|strong)>important<\/(b|strong)>/.test(gras), 'le gras est rendu : ' + gras);
  const brut = M.formater('<script>alert(1)</script>', true);
  assert.ok(brut.indexOf('<script>') === -1, 'le HTML est neutralisé');
  const sans = M.formater('Un mot **important**', false);
  assert.ok(sans.indexOf('**important**') !== -1, 'sans l\'option, le texte reste brut');
});

test('jeux : conversion des étoiles en note sur 100', async () => {
  const { noteSur100 } = await import('../functions/api/learning/game-score.js');
  assert.equal(noteSur100({ stars: 3 }), 100);
  assert.equal(noteSur100({ stars: 2 }), 80);
  assert.equal(noteSur100({ stars: 1 }), 50);
  assert.equal(noteSur100({ stars: 0 }), 30);
  assert.equal(noteSur100({ won: true }), 75);
  assert.equal(noteSur100({ won: false }), 40);
});

test('contrastes : la variante foncée de chaque palette passe 4,5 sur blanc', async () => {
  const { verifierContrastes } = await import('../build/verifier.mjs');
  assert.deepEqual(verifierContrastes(), []);
});

test('réglages : la liste serveur et les défauts du client concordent', async () => {
  const { REGLAGES } = await import('../functions/api/reglages.js');
  const app = lire('site/app.js');
  const m = /const REGLAGES_DEFAUT = \{([\s\S]*?)\};/.exec(app);
  assert.ok(m, 'REGLAGES_DEFAUT présent dans app.js');
  for (const cle of Object.keys(REGLAGES)) assert.ok(new RegExp('\\b' + cle + '\\s*:').test(m[1]), 'défaut client pour ' + cle);
});

test('discrétion et tirets : la vérification de forme passe', async () => {
  const { verifierForme } = await import('../build/verifier.mjs');
  assert.deepEqual(verifierForme(), []);
});
