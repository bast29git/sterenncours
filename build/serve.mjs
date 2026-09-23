/**
 * serve.mjs : petit serveur statique pour relire les fiches dans le navigateur.
 * Usage : npm run serve  →  http://localhost:4321
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const PORT = Number(process.env.PORT) || 4321;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let cible = path.join(RACINE, url);
  if (!cible.startsWith(RACINE)) { res.writeHead(403).end('Interdit'); return; }
  if (fs.existsSync(cible) && fs.statSync(cible).isDirectory()) {
    cible = path.join(cible, 'index.html');
  }
  if (!fs.existsSync(cible)) { res.writeHead(404).end('Introuvable'); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(cible)] || 'application/octet-stream' });
  fs.createReadStream(cible).pipe(res);
}).listen(PORT, () => console.log(`▶ http://localhost:${PORT}`));
