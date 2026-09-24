/**
 * Prépare un environnement local de test : wrangler.toml minimal, migrations
 * appliquées sur la base locale, codes d'accès de test dans le KV local.
 *   node tests/preparer.mjs
 * Codes de test : élève « eleve-test », professeur « prof-test » (jamais ceux
 * de la production).
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const RACINE = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const toml = path.join(RACINE, 'wrangler.toml');
if (!fs.existsSync(toml)) {
  const modele = fs.readFileSync(path.join(RACINE, 'wrangler.toml.modele'), 'utf8')
    .replace('__KV_ID__', 'kv-test').replace('__D1_ID__', 'd1-test')
    .replace(/\n\[ai\]\nbinding = "AI"\n?/, '\n');
  fs.writeFileSync(toml, modele);
  console.log('wrangler.toml de test écrit');
}
const wrangler = (args) => execFileSync('npx', ['wrangler', ...args], { cwd: RACINE, stdio: ['ignore', 'pipe', 'inherit'], env: { ...process.env, CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN || '' } }).toString();
for (const f of fs.readdirSync(path.join(RACINE, 'migrations')).filter((x) => x.endsWith('.sql')).sort()) {
  try { wrangler(['d1', 'execute', 'sterenncours', '--local', '--file', path.join('migrations', f)]); console.log('migration', f); }
  catch (e) { console.log('migration', f, '(déjà appliquée ou colonne présente)'); }
}
const ITER = 1000;
for (const [role, code] of [['eleve', process.env.CODE_ELEVE_TEST || 'eleve-test'], ['prof', process.env.CODE_PROF_TEST || 'prof-test']]) {
  const sel = crypto.randomBytes(16).toString('hex');
  const empreinte = crypto.pbkdf2Sync(code, Buffer.from(sel, 'hex'), ITER, 32, 'sha256').toString('hex');
  wrangler(['kv', 'key', 'put', '--local', '--binding', 'SESSIONS', 'auth:' + role, JSON.stringify({ sel, iterations: ITER, empreinte })]);
  console.log('code de test posé pour', role);
}
