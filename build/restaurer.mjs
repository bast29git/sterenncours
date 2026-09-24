/**
 * Vérifie un instantané de sauvegarde, sans rien écrire en production :
 *   node build/restaurer.mjs sauvegarde.json
 * Affiche le nombre de lignes par table et compare, si un second fichier est
 * donné, les deux instantanés :
 *   node build/restaurer.mjs avant.json apres.json
 * La restauration réelle se fait depuis l'espace professeur (Réglages),
 * qui appelle /api/sauvegarde/restaurer avec un filet automatique.
 */
import fs from 'node:fs';

const [a, b] = process.argv.slice(2);
if (!a) { console.error('usage : node build/restaurer.mjs <instantane.json> [autre.json]'); process.exit(1); }
const lire = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const A = lire(a);
console.log(`Instantané ${a} du ${A.le}`);
for (const [t, l] of Object.entries(A.tables)) console.log(`  ${t.padEnd(14)} ${l ? l.length : 'absente'}`);
if (b) {
  const B = lire(b);
  console.log(`\nComparé à ${b} du ${B.le}`);
  for (const t of Object.keys(A.tables)) {
    const na = (A.tables[t] || []).length; const nb = (B.tables[t] || []).length;
    if (na !== nb) console.log(`  ${t.padEnd(14)} ${na} → ${nb} (${nb - na > 0 ? '+' : ''}${nb - na})`);
  }
}
