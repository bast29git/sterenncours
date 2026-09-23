/**
 * provisionner.mjs : prépare le compte Cloudflare avant le déploiement.
 *
 * Crée, si elles n'existent pas déjà, les ressources dont le site a besoin :
 *   - un espace KV pour les sessions et les codes d'accès ;
 *   - une base D1 pour le suivi, les résultats, les messages et l'index des fichiers ;
 *   - un bucket R2 pour les fichiers échangés.
 * Puis applique le schéma D1, enregistre les codes d'accès sous forme de
 * dérivation PBKDF2, et écrit wrangler.toml avec les identifiants obtenus.
 *
 * Tout est idempotent : le script se rejoue sans rien casser.
 * Aucune dépendance : uniquement fetch et node:crypto.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const API = 'https://api.cloudflare.com/client/v4';

const JETON = process.env.CLOUDFLARE_API_TOKEN;
const COMPTE = process.env.CLOUDFLARE_ACCOUNT_ID;
const NOM_KV = process.env.NOM_KV || 'sterenncours-sessions';
const NOM_D1 = process.env.NOM_D1 || 'sterenncours';
const NOM_R2 = process.env.NOM_R2 || 'sterenncours-fichiers';
const CODE_ELEVE = process.env.CODE_ELEVE || 'sanka29';
const CODE_PROF = process.env.CODE_PROF || 'babas29';
const ITERATIONS = 150000;

if (!JETON || !COMPTE) {
  console.error('❌ CLOUDFLARE_API_TOKEN et CLOUDFLARE_ACCOUNT_ID sont requis.');
  process.exit(1);
}

async function appel(chemin, options = {}) {
  const reponse = await fetch(API + chemin, {
    ...options,
    headers: {
      Authorization: 'Bearer ' + JETON,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });
  const texte = await reponse.text();
  let donnees;
  try { donnees = JSON.parse(texte); } catch (e) { donnees = { success: false, brut: texte }; }
  return { ok: reponse.ok && donnees.success !== false, statut: reponse.status, donnees };
}

const erreurs = (d) => (d.errors || []).map((e) => `${e.code} ${e.message}`).join(' ; ') || 'erreur inconnue';

/* ---------- KV ------------------------------------------------------------ */
async function espaceKv() {
  const liste = await appel(`/accounts/${COMPTE}/storage/kv/namespaces?per_page=100`);
  if (!liste.ok) throw new Error('KV, lecture impossible : ' + erreurs(liste.donnees));
  const existant = (liste.donnees.result || []).find((n) => n.title === NOM_KV);
  if (existant) {
    console.log(`   ↺ espace KV « ${NOM_KV} » déjà présent`);
    return existant.id;
  }
  const cree = await appel(`/accounts/${COMPTE}/storage/kv/namespaces`, {
    method: 'POST', body: JSON.stringify({ title: NOM_KV }),
  });
  if (!cree.ok) throw new Error('KV, création impossible : ' + erreurs(cree.donnees));
  console.log(`   ✚ espace KV « ${NOM_KV} » créé`);
  return cree.donnees.result.id;
}

async function ecrireKv(idKv, cle, valeur) {
  const reponse = await fetch(
    `${API}/accounts/${COMPTE}/storage/kv/namespaces/${idKv}/values/${encodeURIComponent(cle)}`,
    { method: 'PUT', headers: { Authorization: 'Bearer ' + JETON, 'Content-Type': 'text/plain' }, body: valeur },
  );
  if (!reponse.ok) throw new Error(`KV, écriture de « ${cle} » impossible (${reponse.status})`);
}

/* ---------- D1 ------------------------------------------------------------ */
async function baseD1() {
  const liste = await appel(`/accounts/${COMPTE}/d1/database?per_page=100`);
  if (!liste.ok) throw new Error('D1, lecture impossible : ' + erreurs(liste.donnees));
  const existante = (liste.donnees.result || []).find((b) => b.name === NOM_D1);
  if (existante) {
    console.log(`   ↺ base D1 « ${NOM_D1} » déjà présente`);
    return existante.uuid;
  }
  const cree = await appel(`/accounts/${COMPTE}/d1/database`, {
    method: 'POST', body: JSON.stringify({ name: NOM_D1 }),
  });
  if (!cree.ok) throw new Error('D1, création impossible : ' + erreurs(cree.donnees));
  console.log(`   ✚ base D1 « ${NOM_D1} » créée`);
  return cree.donnees.result.uuid;
}

async function migrerD1(idBase) {
  const fichier = path.join(RACINE, 'migrations', '0001-schema.sql');
  const sql = fs.readFileSync(fichier, 'utf8');
  const instructions = sql
    .split(';')
    .map((s) => s.split('\n').filter((l) => !l.trim().startsWith('--')).join('\n').trim())
    .filter(Boolean);

  for (const instruction of instructions) {
    const r = await appel(`/accounts/${COMPTE}/d1/database/${idBase}/query`, {
      method: 'POST', body: JSON.stringify({ sql: instruction }),
    });
    if (!r.ok) throw new Error('D1, migration : ' + erreurs(r.donnees) + ' | ' + instruction.slice(0, 60));
  }
  console.log(`   ⚙ schéma D1 appliqué (${instructions.length} instructions)`);
}

/* ---------- R2 ------------------------------------------------------------- */
async function bucketR2() {
  const liste = await appel(`/accounts/${COMPTE}/r2/buckets`);
  if (!liste.ok) {
    console.warn('   ⚠️  R2 indisponible sur ce compte : ' + erreurs(liste.donnees));
    return false;
  }
  const buckets = (liste.donnees.result && liste.donnees.result.buckets) || liste.donnees.result || [];
  if (buckets.some((b) => b.name === NOM_R2)) {
    console.log(`   ↺ bucket R2 « ${NOM_R2} » déjà présent`);
    return true;
  }
  const cree = await appel(`/accounts/${COMPTE}/r2/buckets`, {
    method: 'POST', body: JSON.stringify({ name: NOM_R2 }),
  });
  if (!cree.ok) {
    console.warn('   ⚠️  R2, création impossible : ' + erreurs(cree.donnees));
    console.warn('      Le partage de fichiers sera désactivé jusqu\'à activation de R2.');
    return false;
  }
  console.log(`   ✚ bucket R2 « ${NOM_R2} » créé`);
  return true;
}

/* ---------- Codes d'accès --------------------------------------------------- */
function deriver(code, sel) {
  return crypto.pbkdf2Sync(code, Buffer.from(sel, 'hex'), ITERATIONS, 32, 'sha256').toString('hex');
}

async function enregistrerCodes(idKv) {
  for (const [role, code] of [['eleve', CODE_ELEVE], ['prof', CODE_PROF]]) {
    const sel = crypto.randomBytes(16).toString('hex');
    await ecrireKv(idKv, 'auth:' + role, JSON.stringify({
      sel, iterations: ITERATIONS, empreinte: deriver(code.trim().toLowerCase(), sel),
    }));
  }
  console.log('   🔑 codes d\'accès enregistrés (dérivation PBKDF2, jamais en clair)');
}

/* ---------- wrangler.toml ---------------------------------------------------- */
function ecrireConfig(idKv, idD1, avecR2) {
  const gabarit = fs.readFileSync(path.join(RACINE, 'wrangler.toml.modele'), 'utf8');
  let contenu = gabarit
    .replace('__KV_ID__', idKv)
    .replace('__D1_ID__', idD1)
    .replace(/^# .*\n/gm, '');
  if (!avecR2) {
    contenu = contenu.replace(/\[\[r2_buckets\]\][\s\S]*$/m, '');
  }
  fs.writeFileSync(path.join(RACINE, 'wrangler.toml'), contenu.trimStart() + '\n');
  console.log('   📝 wrangler.toml écrit');
}

/* ---------- Exécution --------------------------------------------------------- */
try {
  console.log('Provisionnement Cloudflare');
  const idKv = await espaceKv();
  const idD1 = await baseD1();
  await migrerD1(idD1);
  await enregistrerCodes(idKv);
  const avecR2 = await bucketR2();
  ecrireConfig(idKv, idD1, avecR2);
  console.log('✅ ressources prêtes' + (avecR2 ? '' : ' (sans R2)'));
} catch (e) {
  console.error('❌ ' + e.message);
  process.exit(1);
}
