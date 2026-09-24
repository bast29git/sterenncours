/* A56 : analyse statique légère, sur le site et les fonctions. Règles simples : ce qui casse, pas le style. */
import js from '@eslint/js';

const navigateur = {
  window: 'readonly', document: 'readonly', navigator: 'readonly', location: 'readonly', localStorage: 'readonly', sessionStorage: 'readonly',
  fetch: 'readonly', FormData: 'readonly', File: 'readonly', Blob: 'readonly', URL: 'readonly', URLSearchParams: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly',
  setInterval: 'readonly', clearInterval: 'readonly', requestAnimationFrame: 'readonly', console: 'readonly', performance: 'readonly', crypto: 'readonly',
  Notification: 'readonly', MediaRecorder: 'readonly', SpeechSynthesisUtterance: 'readonly', speechSynthesis: 'readonly', CustomEvent: 'readonly', Event: 'readonly', MouseEvent: 'readonly',
  NodeFilter: 'readonly', Image: 'readonly', PROGRAMME: 'readonly', THREE: 'readonly', Konstrio: 'readonly', caches: 'readonly', self: 'readonly', alert: 'readonly', getSelection: 'readonly',
  innerWidth: 'readonly', innerHeight: 'readonly', devicePixelRatio: 'readonly', MutationObserver: 'readonly', IntersectionObserver: 'readonly', ResizeObserver: 'readonly', AudioContext: 'readonly', webkitAudioContext: 'readonly',
};
const workers = { crypto: 'readonly', Response: 'readonly', Request: 'readonly', fetch: 'readonly', URL: 'readonly', TextEncoder: 'readonly', TextDecoder: 'readonly', console: 'readonly', setTimeout: 'readonly', Blob: 'readonly', FormData: 'readonly', File: 'readonly', Headers: 'readonly' };
const regles = { ...js.configs.recommended.rules, 'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }], 'no-empty': ['error', { allowEmptyCatch: true }], 'no-cond-assign': 'off', 'no-prototype-builtins': 'off', 'no-useless-escape': 'off', 'no-control-regex': 'off', 'no-misleading-character-class': 'off' };

export default [
  { ignores: ['public/**', 'node_modules/**', 'site/learning/vendor/**', 'site/learning/games-2d/**', 'site/learning/games-3d/**', 'site/moteurs/**', 'site/learning/konstrio.js', 'site/learning/achievements.js', 'site/learning/audio-engine.js', 'site/learning/lang-engine.js', 'site/learning/quiz-engine.js', '.wrangler/**'] },
  { files: ['site/**/*.js'], languageOptions: { ecmaVersion: 2022, sourceType: 'script', globals: navigateur }, rules: regles },
  { files: ['site/learning/monde-base.js'], languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: navigateur }, rules: regles },
  { files: ['functions/**/*.js'], languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: workers }, rules: regles },
  { files: ['build/**/*.mjs', 'tests/**/*.mjs'], languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: { ...workers, ...navigateur, process: 'readonly', Buffer: 'readonly', global: 'readonly' } }, rules: regles },
];
