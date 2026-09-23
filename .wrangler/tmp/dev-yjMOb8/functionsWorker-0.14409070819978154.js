var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/pages-2vBbUn/functionsWorker-0.14409070819978154.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var COOKIE = "sc_session";
var DUREE_SESSION = 60 * 60 * 24 * 30;
var ROLES = ["eleve", "prof"];
var maintenant = /* @__PURE__ */ __name2(() => (/* @__PURE__ */ new Date()).toISOString(), "maintenant");
function json(donnees, statut = 200, entetes2 = {}) {
  return new Response(JSON.stringify(donnees), {
    status: statut,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...entetes2
    }
  });
}
__name(json, "json");
__name2(json, "json");
var erreur = /* @__PURE__ */ __name2((message, statut = 400) => json({ erreur: message }, statut), "erreur");
function lireCookie(request, nom) {
  const brut = request.headers.get("cookie") || "";
  for (const morceau of brut.split(";")) {
    const [c, ...v] = morceau.trim().split("=");
    if (c === nom) return decodeURIComponent(v.join("="));
  }
  return null;
}
__name(lireCookie, "lireCookie");
__name2(lireCookie, "lireCookie");
function cookieSession(jeton, dureeSecondes) {
  const base = `${COOKIE}=${jeton}; Path=/; HttpOnly; Secure; SameSite=Lax`;
  return dureeSecondes > 0 ? `${base}; Max-Age=${dureeSecondes}` : `${base}; Max-Age=0`;
}
__name(cookieSession, "cookieSession");
__name2(cookieSession, "cookieSession");
var hex = /* @__PURE__ */ __name2((octets) => [...new Uint8Array(octets)].map((o) => o.toString(16).padStart(2, "0")).join(""), "hex");
async function creerSession(env, role) {
  const jeton = hex(crypto.getRandomValues(new Uint8Array(32)));
  await env.SESSIONS.put(
    "session:" + jeton,
    JSON.stringify({ role, cree: maintenant() }),
    { expirationTtl: DUREE_SESSION }
  );
  return jeton;
}
__name(creerSession, "creerSession");
__name2(creerSession, "creerSession");
async function lireSession(request, env) {
  const jeton = lireCookie(request, COOKIE);
  if (!jeton || !/^[0-9a-f]{64}$/.test(jeton)) return null;
  const brut = await env.SESSIONS.get("session:" + jeton);
  if (!brut) return null;
  try {
    const donnees = JSON.parse(brut);
    if (!ROLES.includes(donnees.role)) return null;
    return { ...donnees, jeton };
  } catch (e) {
    return null;
  }
}
__name(lireSession, "lireSession");
__name2(lireSession, "lireSession");
async function supprimerSession(env, jeton) {
  if (jeton) await env.SESSIONS.delete("session:" + jeton);
}
__name(supprimerSession, "supprimerSession");
__name2(supprimerSession, "supprimerSession");
function versOctets(chaineHex) {
  const sortie = new Uint8Array(chaineHex.length / 2);
  for (let i = 0; i < sortie.length; i += 1) {
    sortie[i] = parseInt(chaineHex.substr(i * 2, 2), 16);
  }
  return sortie;
}
__name(versOctets, "versOctets");
__name2(versOctets, "versOctets");
var ITERATIONS_MAX = 1e5;
async function deriver(code, selHex, iterations) {
  const tours = Math.min(Number(iterations) || ITERATIONS_MAX, ITERATIONS_MAX);
  const cle = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(code),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: versOctets(selHex), iterations: tours, hash: "SHA-256" },
    cle,
    256
  );
  return hex(bits);
}
__name(deriver, "deriver");
__name2(deriver, "deriver");
function egal(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let ecart = 0;
  for (let i = 0; i < a.length; i += 1) ecart |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return ecart === 0;
}
__name(egal, "egal");
__name2(egal, "egal");
async function exigerSession(context) {
  const session = await lireSession(context.request, context.env);
  if (!session) throw erreur("Session expir\xE9e. Reconnecte-toi.", 401);
  return session;
}
__name(exigerSession, "exigerSession");
__name2(exigerSession, "exigerSession");
function exigerProf(session) {
  if (session.role !== "prof") throw erreur("R\xE9serv\xE9 \xE0 l'espace professeur.", 403);
  return session;
}
__name(exigerProf, "exigerProf");
__name2(exigerProf, "exigerProf");
function gerer(fonction) {
  return async (context) => {
    try {
      return await fonction(context);
    } catch (e) {
      if (e instanceof Response) return e;
      return json({ erreur: "Erreur interne", detail: String(e && e.message || e) }, 500);
    }
  };
}
__name(gerer, "gerer");
__name2(gerer, "gerer");
var nouvelId = /* @__PURE__ */ __name2(() => hex(crypto.getRandomValues(new Uint8Array(12))), "nouvelId");
var onRequestPost = gerer(async (context) => {
  await exigerSession(context);
  const id = context.params.id;
  if (!/^[0-9a-f]{24}$/.test(id)) return erreur("Identifiant invalide.");
  const seance = await context.env.DB.prepare("SELECT * FROM seances WHERE id = ?").bind(id).first();
  if (!seance) return erreur("S\xE9ance introuvable.", 404);
  let corps;
  try {
    corps = await context.request.json();
  } catch (e) {
    return erreur("Requ\xEAte invalide.");
  }
  const choisie = String(corps && corps.lecon || "");
  let choix = [];
  try {
    choix = JSON.parse(seance.choix || "[]");
  } catch (e) {
    choix = [];
  }
  if (!choix.length) return erreur("Cette s\xE9ance ne propose pas de choix.");
  if (!choix.includes(choisie)) return erreur("Cette le\xE7on ne fait pas partie des choix propos\xE9s.");
  let lecons = [];
  try {
    lecons = JSON.parse(seance.lecons || "[]");
  } catch (e) {
    lecons = [];
  }
  const fixes = lecons.filter((r) => !choix.includes(r));
  const nouvelles = [...fixes, choisie];
  const matieres = [...new Set(nouvelles.map((r) => r.split("/")[0]))];
  await context.env.DB.prepare(
    "UPDATE seances SET lecons = ?, matieres = ?, choisi_le = ?, maj_le = ? WHERE id = ?"
  ).bind(JSON.stringify(nouvelles), JSON.stringify(matieres), maintenant(), maintenant(), id).run();
  return json({ id, lecons: nouvelles, matieres, choisi_le: maintenant() });
});
var DATE = /^\d{4}-\d{2}-\d{2}$/;
var CRENEAUX = ["A", "B", "C"];
var STATUTS = ["prevue", "faite", "reportee"];
var TYPES = ["cours", "travail"];
var HEURE = /^([01]\d|2[0-3]):[0-5]\d$/;
var onRequestGet = gerer(async (context) => {
  await exigerSession(context);
  const url = new URL(context.request.url);
  const du = url.searchParams.get("du");
  const au = url.searchParams.get("au");
  const requete = du && au && DATE.test(du) && DATE.test(au) ? context.env.DB.prepare(
    "SELECT * FROM seances WHERE date BETWEEN ? AND ? ORDER BY date ASC, creneau ASC"
  ).bind(du, au) : context.env.DB.prepare("SELECT * FROM seances ORDER BY date ASC, creneau ASC LIMIT 400");
  const { results } = await requete.all();
  return json({ seances: (results || []).map(decoder) });
});
var onRequestPost2 = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  let corps;
  try {
    corps = await context.request.json();
  } catch (e) {
    return erreur("Requ\xEAte invalide.");
  }
  const erreurChamp = valider(corps);
  if (erreurChamp) return erreur(erreurChamp);
  const date = maintenant();
  const seance = construire(corps, date);
  await context.env.DB.prepare(REQUETE_INSERT).bind(...valeurs(seance)).run();
  return json(decoder(seance), 201);
});
var REQUETE_INSERT = `INSERT INTO seances (id, date, creneau, debut, fin, type, matieres, lecons, choix,
     objectif, travail, statut, bilan, cree_le, maj_le)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
var valeurs = /* @__PURE__ */ __name2((s) => [
  s.id,
  s.date,
  s.creneau,
  s.debut,
  s.fin,
  s.type,
  s.matieres,
  s.lecons,
  s.choix,
  s.objectif,
  s.travail,
  s.statut,
  s.bilan,
  s.cree_le,
  s.maj_le
], "valeurs");
function construire(corps, date) {
  return {
    id: nouvelId(),
    date: corps.date,
    creneau: corps.creneau,
    debut: HEURE.test(String(corps.debut || "")) ? corps.debut : "13:00",
    fin: HEURE.test(String(corps.fin || "")) ? corps.fin : "14:30",
    type: TYPES.includes(corps.type) ? corps.type : "cours",
    matieres: JSON.stringify(corps.matieres || []),
    lecons: JSON.stringify(corps.lecons || []),
    choix: JSON.stringify(corps.choix || []),
    objectif: corps.objectif ? String(corps.objectif).slice(0, 300) : null,
    travail: corps.travail ? String(corps.travail).slice(0, 500) : null,
    statut: corps.statut && STATUTS.includes(corps.statut) ? corps.statut : "prevue",
    bilan: null,
    cree_le: date,
    maj_le: date
  };
}
__name(construire, "construire");
__name2(construire, "construire");
function valider(corps) {
  if (!corps || !DATE.test(String(corps.date || ""))) return "Date invalide (AAAA-MM-JJ attendu).";
  if (!CRENEAUX.includes(corps.creneau)) return "Cr\xE9neau invalide (A, B ou C).";
  if (corps.matieres && !Array.isArray(corps.matieres)) return "matieres doit \xEAtre une liste.";
  if (corps.lecons && !Array.isArray(corps.lecons)) return "lecons doit \xEAtre une liste.";
  return null;
}
__name(valider, "valider");
__name2(valider, "valider");
function decoder(ligne) {
  const lire = /* @__PURE__ */ __name2((v) => {
    try {
      return JSON.parse(v || "[]");
    } catch (e) {
      return [];
    }
  }, "lire");
  return { ...ligne, matieres: lire(ligne.matieres), lecons: lire(ligne.lecons), choix: lire(ligne.choix) };
}
__name(decoder, "decoder");
__name2(decoder, "decoder");
var MAX = 400;
var onRequestPost3 = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  let corps;
  try {
    corps = await context.request.json();
  } catch (e) {
    return erreur("Requ\xEAte invalide.");
  }
  const liste = Array.isArray(corps && corps.seances) ? corps.seances : null;
  if (!liste) return erreur("Un tableau \xAB seances \xBB est attendu.");
  if (!liste.length) return erreur("Aucune s\xE9ance \xE0 cr\xE9er.");
  if (liste.length > MAX) return erreur(`Trop de s\xE9ances d'un coup (maximum ${MAX}).`);
  for (const s of liste) {
    const probleme = valider(s);
    if (probleme) return erreur(probleme);
  }
  const { results } = await context.env.DB.prepare("SELECT date, creneau FROM seances").all();
  const existantes = new Set((results || []).map((r) => r.date + "|" + r.creneau));
  const date = maintenant();
  const aCreer = [];
  for (const s of liste) {
    const empreinte = s.date + "|" + s.creneau;
    if (existantes.has(empreinte)) continue;
    existantes.add(empreinte);
    aCreer.push(construire(s, date));
  }
  if (aCreer.length) {
    const requete = context.env.DB.prepare(REQUETE_INSERT);
    await context.env.DB.batch(aCreer.map((s) => requete.bind(...valeurs(s))));
  }
  return json({ crees: aCreer.length, ignores: liste.length - aCreer.length }, 201);
});
var onRequestGet2 = gerer(async (context) => {
  await exigerSession(context);
  const id = context.params.id;
  if (!/^[0-9a-f]{24}$/.test(id)) return erreur("Identifiant invalide.");
  const ligne = await context.env.DB.prepare("SELECT * FROM fichiers WHERE id = ?").bind(id).first();
  if (!ligne) return erreur("Fichier introuvable.", 404);
  if (!context.env.FICHIERS) return erreur("Stockage indisponible.", 503);
  const objet = await context.env.FICHIERS.get(ligne.cle_r2);
  if (!objet) return erreur("Contenu introuvable.", 404);
  const entetes2 = new Headers();
  objet.writeHttpMetadata(entetes2);
  entetes2.set("etag", objet.httpEtag);
  entetes2.set("cache-control", "private, max-age=3600");
  entetes2.set(
    "content-disposition",
    `attachment; filename*=UTF-8''${encodeURIComponent(ligne.nom)}`
  );
  return new Response(objet.body, { headers: entetes2 });
});
var onRequestDelete = gerer(async (context) => {
  const session = await exigerSession(context);
  const id = context.params.id;
  if (!/^[0-9a-f]{24}$/.test(id)) return erreur("Identifiant invalide.");
  const ligne = await context.env.DB.prepare("SELECT * FROM fichiers WHERE id = ?").bind(id).first();
  if (!ligne) return erreur("Fichier introuvable.", 404);
  if (session.role !== "prof" && ligne.auteur !== session.role) {
    return erreur("Tu ne peux supprimer que tes propres fichiers.", 403);
  }
  if (context.env.FICHIERS) await context.env.FICHIERS.delete(ligne.cle_r2);
  await context.env.DB.prepare("DELETE FROM fichiers WHERE id = ?").bind(id).run();
  return json({ supprime: id });
});
var STATUTS2 = ["prevue", "faite", "reportee"];
var CRENEAUX2 = ["A", "B", "C"];
var DATE2 = /^\d{4}-\d{2}-\d{2}$/;
var onRequestPatch = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  const id = context.params.id;
  if (!/^[0-9a-f]{24}$/.test(id)) return erreur("Identifiant invalide.");
  const existante = await context.env.DB.prepare("SELECT * FROM seances WHERE id = ?").bind(id).first();
  if (!existante) return erreur("S\xE9ance introuvable.", 404);
  let corps;
  try {
    corps = await context.request.json();
  } catch (e) {
    return erreur("Requ\xEAte invalide.");
  }
  if (corps.statut && !STATUTS2.includes(corps.statut)) return erreur("Statut invalide.");
  if (corps.creneau && !CRENEAUX2.includes(corps.creneau)) return erreur("Cr\xE9neau invalide.");
  if (corps.date && !DATE2.test(corps.date)) return erreur("Date invalide.");
  const fusion = {
    date: corps.date || existante.date,
    creneau: corps.creneau || existante.creneau,
    matieres: corps.matieres ? JSON.stringify(corps.matieres) : existante.matieres,
    lecons: corps.lecons ? JSON.stringify(corps.lecons) : existante.lecons,
    objectif: corps.objectif !== void 0 ? corps.objectif ? String(corps.objectif).slice(0, 300) : null : existante.objectif,
    travail: corps.travail !== void 0 ? corps.travail ? String(corps.travail).slice(0, 500) : null : existante.travail,
    statut: corps.statut || existante.statut,
    bilan: corps.bilan !== void 0 ? corps.bilan ? String(corps.bilan).slice(0, 800) : null : existante.bilan
  };
  await context.env.DB.prepare(
    `UPDATE seances SET date = ?, creneau = ?, matieres = ?, lecons = ?, objectif = ?,
       travail = ?, statut = ?, bilan = ?, maj_le = ? WHERE id = ?`
  ).bind(
    fusion.date,
    fusion.creneau,
    fusion.matieres,
    fusion.lecons,
    fusion.objectif,
    fusion.travail,
    fusion.statut,
    fusion.bilan,
    maintenant(),
    id
  ).run();
  const lire = /* @__PURE__ */ __name2((v) => {
    try {
      return JSON.parse(v || "[]");
    } catch (e) {
      return [];
    }
  }, "lire");
  return json({ id, ...fusion, matieres: lire(fusion.matieres), lecons: lire(fusion.lecons) });
});
var onRequestDelete2 = gerer(async (context) => {
  exigerProf(await exigerSession(context));
  const id = context.params.id;
  if (!/^[0-9a-f]{24}$/.test(id)) return erreur("Identifiant invalide.");
  await context.env.DB.prepare("DELETE FROM seances WHERE id = ?").bind(id).run();
  return json({ supprime: id });
});
var MAX_TENTATIVES = 12;
var FENETRE = 600;
var onRequestPost4 = gerer(async (context) => {
  const { request, env } = context;
  if (!env.SESSIONS) return erreur("Stockage des sessions non configur\xE9.", 503);
  const ip = request.headers.get("cf-connecting-ip") || "inconnue";
  const cleLimite = "tentatives:" + ip;
  const tentatives = parseInt(await env.SESSIONS.get(cleLimite) || "0", 10);
  if (tentatives >= MAX_TENTATIVES) {
    return erreur("Trop de tentatives. R\xE9essaie dans quelques minutes.", 429);
  }
  let corps;
  try {
    corps = await request.json();
  } catch (e) {
    return erreur("Requ\xEAte invalide.");
  }
  const code = String(corps && corps.code || "").trim().toLowerCase();
  if (!code || code.length > 64) return erreur("Code manquant.");
  for (const role of ROLES) {
    const brut = await env.SESSIONS.get("auth:" + role);
    if (!brut) continue;
    const { sel, iterations, empreinte } = JSON.parse(brut);
    const candidat = await deriver(code, sel, iterations);
    if (egal(candidat, empreinte)) {
      await env.SESSIONS.delete(cleLimite);
      const jeton = await creerSession(env, role);
      return json({ role }, 200, { "set-cookie": cookieSession(jeton, DUREE_SESSION) });
    }
  }
  await env.SESSIONS.put(cleLimite, String(tentatives + 1), { expirationTtl: FENETRE });
  return erreur("Ce code n'est pas reconnu.", 401);
});
async function onRequestPost5(context) {
  const session = await lireSession(context.request, context.env);
  if (session) await supprimerSession(context.env, session.jeton);
  return json({ deconnecte: true }, 200, { "set-cookie": cookieSession("", 0) });
}
__name(onRequestPost5, "onRequestPost5");
__name2(onRequestPost5, "onRequestPost");
var onRequestGet3 = gerer(async (context) => {
  const session = await exigerSession(context);
  const { DB } = context.env;
  const [suivi, resultats, fiches, messages] = await Promise.all([
    DB.prepare("SELECT cle, niveau, note, maj_le, maj_par FROM suivi").all(),
    DB.prepare("SELECT cle, justes, total, meilleur, series, maj_le FROM resultats").all(),
    DB.prepare("SELECT cle, termine_le FROM fiches_lues").all(),
    DB.prepare("SELECT COUNT(*) AS n FROM messages WHERE auteur != ? AND lu_le IS NULL").bind(session.role).all()
  ]);
  const enObjet = /* @__PURE__ */ __name2((lignes, cleChamp) => {
    const sortie = {};
    for (const l of lignes) {
      const { [cleChamp]: k, ...reste } = l;
      sortie[k] = reste;
    }
    return sortie;
  }, "enObjet");
  return json({
    role: session.role,
    suivi: enObjet(suivi.results || [], "cle"),
    resultats: enObjet(resultats.results || [], "cle"),
    fiches: enObjet(fiches.results || [], "cle"),
    messagesNonLus: messages.results && messages.results[0] && messages.results[0].n || 0
  });
});
var onRequestPut = gerer(async (context) => {
  await exigerSession(context);
  const { DB } = context.env;
  let corps;
  try {
    corps = await context.request.json();
  } catch (e) {
    return erreur("Requ\xEAte invalide.");
  }
  const cle = String(corps && corps.cle || "");
  if (!/^[a-z0-9-]+\/[A-Za-z0-9]+\/[a-z]+$/.test(cle)) return erreur("Cl\xE9 de fiche invalide.");
  if (corps.termine === false) {
    await DB.prepare("DELETE FROM fiches_lues WHERE cle = ?").bind(cle).run();
    return json({ cle, termine: false });
  }
  const date = maintenant();
  await DB.prepare(
    `INSERT INTO fiches_lues (cle, termine_le) VALUES (?, ?)
     ON CONFLICT(cle) DO UPDATE SET termine_le = excluded.termine_le`
  ).bind(cle, date).run();
  return json({ cle, termine_le: date });
});
var TAILLE_MAX = 15 * 1024 * 1024;
var TYPES_AUTORISES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/heic",
  "application/pdf",
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation"
];
var onRequestGet4 = gerer(async (context) => {
  await exigerSession(context);
  const { results } = await context.env.DB.prepare(
    "SELECT id, nom, type, taille, auteur, matiere, ref, note, cree_le FROM fichiers ORDER BY cree_le DESC LIMIT 200"
  ).all();
  return json({ fichiers: results || [], stockage: Boolean(context.env.FICHIERS) });
});
var onRequestPost6 = gerer(async (context) => {
  const session = await exigerSession(context);
  if (!context.env.FICHIERS) {
    return erreur("Le stockage de fichiers n'est pas activ\xE9 sur ce compte.", 503);
  }
  let formulaire;
  try {
    formulaire = await context.request.formData();
  } catch (e) {
    return erreur("Envoi illisible.");
  }
  const fichier = formulaire.get("fichier");
  if (!fichier || typeof fichier === "string") return erreur("Aucun fichier re\xE7u.");
  if (fichier.size === 0) return erreur("Le fichier est vide.");
  if (fichier.size > TAILLE_MAX) return erreur("Le fichier d\xE9passe 15 Mo.", 413);
  const type = fichier.type || "application/octet-stream";
  if (!TYPES_AUTORISES.includes(type)) {
    return erreur("Ce type de fichier n'est pas accept\xE9 : " + type);
  }
  const id = nouvelId();
  const nom = String(fichier.name || "fichier").slice(0, 160);
  const cleR2 = `${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}/${id}`;
  await context.env.FICHIERS.put(cleR2, fichier.stream(), {
    httpMetadata: { contentType: type },
    customMetadata: { auteur: session.role, nom }
  });
  const ligne = {
    id,
    nom,
    type,
    taille: fichier.size,
    cle_r2: cleR2,
    auteur: session.role,
    matiere: formulaire.get("matiere") ? String(formulaire.get("matiere")).slice(0, 40) : null,
    ref: formulaire.get("ref") ? String(formulaire.get("ref")).slice(0, 10) : null,
    note: formulaire.get("note") ? String(formulaire.get("note")).slice(0, 300) : null,
    cree_le: maintenant()
  };
  await context.env.DB.prepare(
    `INSERT INTO fichiers (id, nom, type, taille, cle_r2, auteur, matiere, ref, note, cree_le)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    ligne.id,
    ligne.nom,
    ligne.type,
    ligne.taille,
    ligne.cle_r2,
    ligne.auteur,
    ligne.matiere,
    ligne.ref,
    ligne.note,
    ligne.cree_le
  ).run();
  const { cle_r2: _, ...publique } = ligne;
  return json(publique, 201);
});
var LONGUEUR_MAX = 2e3;
var onRequestGet5 = gerer(async (context) => {
  await exigerSession(context);
  const url = new URL(context.request.url);
  const apres = url.searchParams.get("apres");
  const requete = apres ? context.env.DB.prepare(
    "SELECT * FROM messages WHERE cree_le > ? ORDER BY cree_le ASC LIMIT 200"
  ).bind(apres) : context.env.DB.prepare(
    "SELECT * FROM messages ORDER BY cree_le DESC LIMIT 100"
  );
  const { results } = await requete.all();
  const messages = apres ? results : (results || []).reverse();
  return json({ messages });
});
var onRequestPost7 = gerer(async (context) => {
  const session = await exigerSession(context);
  let corps;
  try {
    corps = await context.request.json();
  } catch (e) {
    return erreur("Requ\xEAte invalide.");
  }
  const texte = String(corps && corps.texte || "").trim();
  if (!texte) return erreur("Message vide.");
  if (texte.length > LONGUEUR_MAX) return erreur("Message trop long.");
  const contexte = corps.contexte ? String(corps.contexte).slice(0, 120) : null;
  const message = {
    id: nouvelId(),
    auteur: session.role,
    texte,
    contexte,
    cree_le: maintenant(),
    lu_le: null
  };
  await context.env.DB.prepare(
    "INSERT INTO messages (id, auteur, texte, contexte, cree_le) VALUES (?, ?, ?, ?, ?)"
  ).bind(message.id, message.auteur, message.texte, message.contexte, message.cree_le).run();
  return json(message, 201);
});
var onRequestPatch2 = gerer(async (context) => {
  const session = await exigerSession(context);
  await context.env.DB.prepare(
    "UPDATE messages SET lu_le = ? WHERE auteur != ? AND lu_le IS NULL"
  ).bind(maintenant(), session.role).run();
  return json({ lus: true });
});
var onRequestGet6 = gerer(async (context) => {
  const session = await lireSession(context.request, context.env);
  const relie = {
    kv: Boolean(context.env.SESSIONS),
    db: Boolean(context.env.DB),
    r2: Boolean(context.env.FICHIERS)
  };
  return session ? json({ role: session.role, depuis: session.cree, relie }) : json({ role: null, relie });
});
var onRequestPut2 = gerer(async (context) => {
  await exigerSession(context);
  const { DB } = context.env;
  let corps;
  try {
    corps = await context.request.json();
  } catch (e) {
    return erreur("Requ\xEAte invalide.");
  }
  const { matiere, ref } = corps || {};
  const justes = Number(corps && corps.justes);
  const total = Number(corps && corps.total);
  if (!matiere || !ref) return erreur("matiere et ref sont requis.");
  if (!Number.isInteger(justes) || !Number.isInteger(total) || total <= 0 || justes < 0 || justes > total) {
    return erreur("Score invalide.");
  }
  const cle = matiere + "/" + ref;
  await DB.prepare(
    `INSERT INTO resultats (cle, matiere, ref, justes, total, meilleur, series, maj_le)
     VALUES (?, ?, ?, ?, ?, ?, 1, ?)
     ON CONFLICT(cle) DO UPDATE SET
       justes = excluded.justes,
       total = excluded.total,
       meilleur = MAX(resultats.meilleur, excluded.justes),
       series = resultats.series + 1,
       maj_le = excluded.maj_le`
  ).bind(cle, matiere, ref, justes, total, justes, maintenant()).run();
  const ligne = await DB.prepare("SELECT * FROM resultats WHERE cle = ?").bind(cle).first();
  return json(ligne);
});
var NIVEAUX = ["insuffisant", "fragile", "satisfaisant", "tresbien"];
var onRequestPut3 = gerer(async (context) => {
  const session = exigerProf(await exigerSession(context));
  const { DB } = context.env;
  let corps;
  try {
    corps = await context.request.json();
  } catch (e) {
    return erreur("Requ\xEAte invalide.");
  }
  const { matiere, ref, niveau, note } = corps || {};
  if (!matiere || !ref) return erreur("matiere et ref sont requis.");
  if (niveau && !NIVEAUX.includes(niveau)) return erreur("Niveau inconnu.");
  const cle = matiere + "/" + ref;
  if (!niveau) {
    await DB.prepare("DELETE FROM suivi WHERE cle = ?").bind(cle).run();
    return json({ cle, niveau: null });
  }
  await DB.prepare(
    `INSERT INTO suivi (cle, matiere, ref, niveau, note, maj_le, maj_par)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(cle) DO UPDATE SET niveau = excluded.niveau, note = excluded.note,
       maj_le = excluded.maj_le, maj_par = excluded.maj_par`
  ).bind(cle, matiere, ref, niveau, note || null, maintenant(), session.role).run();
  return json({ cle, niveau, maj_le: maintenant() });
});
var PUBLIC_EXACT = /* @__PURE__ */ new Set([
  "/",
  "/index.html",
  "/portail.css",
  "/app.css",
  "/app.js",
  "/favicon.ico",
  "/robots.txt",
  "/api/connexion",
  "/api/moi"
]);
var PUBLIC_PREFIXES = ["/theme/"];
var estPublic = /* @__PURE__ */ __name2((chemin) => PUBLIC_EXACT.has(chemin) || PUBLIC_PREFIXES.some((p) => chemin.startsWith(p)), "estPublic");
async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const chemin = url.pathname;
  if (estPublic(chemin)) {
    const reponse2 = await next();
    if (chemin.startsWith("/api/")) return entetes(reponse2, "no-store");
    return entetes(reponse2, chemin.startsWith("/theme/") ? "public, max-age=3600" : "public, max-age=300");
  }
  const session = await lireSession(request, env);
  if (!session) {
    if (chemin.startsWith("/api/")) {
      return new Response(JSON.stringify({ erreur: "Non authentifi\xE9" }), {
        status: 401,
        headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
      });
    }
    return Response.redirect(url.origin + "/", 302);
  }
  context.data.session = session;
  const reponse = await next();
  return entetes(reponse, chemin.startsWith("/api/") ? "no-store" : "private, max-age=600");
}
__name(onRequest, "onRequest");
__name2(onRequest, "onRequest");
function entetes(reponse, cache) {
  const sortie = new Response(reponse.body, reponse);
  sortie.headers.set("cache-control", cache);
  sortie.headers.set("x-content-type-options", "nosniff");
  sortie.headers.set("referrer-policy", "strict-origin-when-cross-origin");
  return sortie;
}
__name(entetes, "entetes");
__name2(entetes, "entetes");
var routes = [
  {
    routePath: "/api/seances/:id/choix",
    mountPath: "/api/seances/:id",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/seances/lot",
    mountPath: "/api/seances",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/fichiers/:id",
    mountPath: "/api/fichiers",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete]
  },
  {
    routePath: "/api/fichiers/:id",
    mountPath: "/api/fichiers",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/seances/:id",
    mountPath: "/api/seances",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete2]
  },
  {
    routePath: "/api/seances/:id",
    mountPath: "/api/seances",
    method: "PATCH",
    middlewares: [],
    modules: [onRequestPatch]
  },
  {
    routePath: "/api/connexion",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost4]
  },
  {
    routePath: "/api/deconnexion",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost5]
  },
  {
    routePath: "/api/etat",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/api/fiches",
    mountPath: "/api",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut]
  },
  {
    routePath: "/api/fichiers",
    mountPath: "/api/fichiers",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet4]
  },
  {
    routePath: "/api/fichiers",
    mountPath: "/api/fichiers",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost6]
  },
  {
    routePath: "/api/messages",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet5]
  },
  {
    routePath: "/api/messages",
    mountPath: "/api",
    method: "PATCH",
    middlewares: [],
    modules: [onRequestPatch2]
  },
  {
    routePath: "/api/messages",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost7]
  },
  {
    routePath: "/api/moi",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet6]
  },
  {
    routePath: "/api/resultats",
    mountPath: "/api",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut2]
  },
  {
    routePath: "/api/seances",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/seances",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/suivi",
    mountPath: "/api",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut3]
  },
  {
    routePath: "/",
    mountPath: "/",
    method: "",
    middlewares: [onRequest],
    modules: []
  }
];
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
__name2(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name2(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name2(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name2(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name2(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name2(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
__name2(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
__name2(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name2(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
__name2(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
__name2(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
__name2(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
__name2(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
__name2(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
__name2(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
__name2(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");
__name2(pathToRegexp, "pathToRegexp");
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
__name2(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name2(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name2(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name2((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
var drainBody = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  static {
    __name(this, "___Facade_ScheduledController__");
  }
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name2(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name2((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name2((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// ../../../tmp/claude-0/-home-user/426120ca-062e-56a4-8239-44cbe24a24ce/scratchpad/outils-test/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default2 = drainBody2;

// ../../../tmp/claude-0/-home-user/426120ca-062e-56a4-8239-44cbe24a24ce/scratchpad/outils-test/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError2(e.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError2(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-54KG1M/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = middleware_loader_entry_default;

// ../../../tmp/claude-0/-home-user/426120ca-062e-56a4-8239-44cbe24a24ce/scratchpad/outils-test/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-54KG1M/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class ___Facade_ScheduledController__2 {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__2(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
//# sourceMappingURL=functionsWorker-0.14409070819978154.js.map
