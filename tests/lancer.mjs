/**
 * Lance le serveur local, joue les scénarios, arrête le serveur.
 *   npm test
 * Variables : PORT (8798), CODE_ELEVE_TEST, CODE_PROF_TEST, CHROME_PATH.
 */
import { spawn } from 'node:child_process';
import path from 'node:path';

const RACINE = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PORT = process.env.PORT || '8798';
const BASE = `http://127.0.0.1:${PORT}`;

const serveur = spawn('npx', ['wrangler', 'pages', 'dev', '--port', PORT, '--local'], { cwd: RACINE, stdio: ['ignore', 'pipe', 'pipe'], detached: true });
let journal = '';
serveur.stdout.on('data', (d) => { journal += d; });
serveur.stderr.on('data', (d) => { journal += d; });

async function attendre() {
  for (let i = 0; i < 60; i += 1) {
    try { const r = await fetch(BASE + '/'); if (r.ok) return true; } catch (e) { /* pas encore */ }
    await new Promise((r) => setTimeout(r, 2000));
  }
  return false;
}
function arreter() { try { process.kill(-serveur.pid, 'SIGTERM'); } catch (e) { /* déjà arrêté */ } }

(async () => {
  if (!(await attendre())) { console.error('Le serveur local ne répond pas.\n' + journal.slice(-2000)); arreter(); process.exit(1); }
  const { lancerScenarios } = await import('./scenarios.mjs');
  let code = 0;
  try { code = await lancerScenarios(BASE); } catch (e) { console.error(e); code = 1; }
  arreter();
  process.exit(code);
})();
