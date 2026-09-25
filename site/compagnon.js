/* ============================================================================
 * compagnon.js : le compagnon de Sterenn.
 *
 * Une petite créature dessinée en SVG, qu'elle nomme et habille. Les espèces,
 * les couleurs, les accessoires et les auras se débloquent avec les étoiles
 * (toutes les réussites) ou avec les opales (une par leçon validée). Il vit sur
 * l'accueil, réagit aux étoiles gagnées, s'endort le soir, et sa page
 * « Mon compagnon » (#/compagnon) sert à le changer. Le choix est enregistré
 * dans le profil partagé (moi.compagnon) : le professeur le voit aussi.
 *
 *   COMPAGNON.rendre({ taille, bulle })   le HTML du compagnon courant
 *   COMPAGNON.vue()                        la page de personnalisation
 *   COMPAGNON.reagir('etoile' | 'serie' | 'lecon' | 'bonjour')
 * ========================================================================== */
(function () {
  const N = () => window.NOYAU;
  const ech = (t) => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const CLE = 'moi.compagnon';
  const CLE_VUS = 'opaline.compagnon.vus';

  /* ---------- Le catalogue ---------- */
  // Chaque élément porte son prix : { etoiles: n } ou { opales: n }. Une opale = une leçon validée.
  const COULEURS = [
    { id: 'turquoise', nom: 'Turquoise', c: '#2BB5A0', c2: '#8FE3D5', etoiles: 0 },
    { id: 'rose', nom: 'Rose', c: '#E8608E', c2: '#F7A8C4', etoiles: 0 },
    { id: 'indien', nom: 'Bleu indien', c: '#1F6F8E', c2: '#8CC3DA', etoiles: 0 },
    { id: 'violet', nom: 'Violet pastel', c: '#A97AD1', c2: '#EBC6EC', etoiles: 5 },
    { id: 'menthe', nom: 'Menthe', c: '#1F9E86', c2: '#7FD3C1', etoiles: 10 },
    { id: 'corail', nom: 'Corail', c: '#E96A43', c2: '#F7B199', etoiles: 18 },
    { id: 'ocean', nom: 'Océan', c: '#2E7FC2', c2: '#8FC4E8', etoiles: 26 },
    { id: 'prune', nom: 'Prune', c: '#9046A8', c2: '#C79BD6', etoiles: 36 },
    { id: 'or', nom: 'Or', c: '#C9962B', c2: '#F3D98A', etoiles: 50 },
    { id: 'nuit', nom: 'Nuit', c: '#2A2F55', c2: '#7C86C8', opales: 8 },
  ];
  const ESPECES = [
    { id: 'opaline', nom: 'Opaline', desc: 'Un petit esprit d\'opale, le premier compagnon.', etoiles: 0 },
    { id: 'renard', nom: 'Renard', desc: 'Curieux, il pointe le museau vers ce qui est nouveau.', etoiles: 0 },
    { id: 'chat', nom: 'Chat', desc: 'Il dort beaucoup, mais il voit tout.', etoiles: 3 },
    { id: 'hibou', nom: 'Hibou', desc: 'Il veille la nuit et connaît les chemins.', etoiles: 8 },
    { id: 'lapin', nom: 'Lapin', desc: 'Il bondit à chaque étoile.', etoiles: 14 },
    { id: 'dragon', nom: 'Petit dragon', desc: 'Il souffle une flamme minuscule quand il est content.', etoiles: 22 },
    { id: 'fantome', nom: 'Fantôme', desc: 'Il traverse les murs et les leçons difficiles.', etoiles: 30 },
    { id: 'robot', nom: 'Robot', desc: 'Il calcule vite et ne se trompe jamais deux fois.', etoiles: 40 },
    { id: 'licorne', nom: 'Licorne', desc: 'Rare. Sa corne brille à chaque leçon validée.', etoiles: 55 },
    { id: 'kitsune', nom: 'Kitsune', desc: 'Le renard à plusieurs queues des histoires japonaises.', etoiles: 70 },
    { id: 'phenix', nom: 'Phénix', desc: 'Il renaît de chaque erreur, plus fort.', opales: 5 },
    { id: 'aurore', nom: 'Esprit d\'aurore', desc: 'Il vient du ciel du nord, là où la lumière danse.', opales: 12 },
  ];
  const ACCESSOIRES = [
    { id: 'lunettes', nom: 'Lunettes', etoiles: 2 },
    { id: 'echarpe', nom: 'Écharpe', etoiles: 4 },
    { id: 'chapeau', nom: 'Chapeau', etoiles: 6 },
    { id: 'noeud', nom: 'Nœud', etoiles: 9 },
    { id: 'fleur', nom: 'Fleur', etoiles: 12 },
    { id: 'feutre', nom: 'Feutre à alcool', etoiles: 15 },
    { id: 'couronne', nom: 'Couronne', etoiles: 20 },
    { id: 'cape', nom: 'Cape', etoiles: 25 },
    { id: 'ailes', nom: 'Ailes', etoiles: 32 },
    { id: 'lanterne', nom: 'Lanterne', etoiles: 38 },
    { id: 'casque', nom: 'Casque d\'exploratrice', etoiles: 45 },
    { id: 'etoile', nom: 'Étoile sur la tête', etoiles: 60 },
    { id: 'halo', nom: 'Halo d\'aurore', opales: 15 },
  ];
  const AURAS = [
    { id: 'aucune', nom: 'Aucune', etoiles: 0 },
    { id: 'etincelles', nom: 'Étincelles', etoiles: 6 },
    { id: 'bulles', nom: 'Bulles', etoiles: 12 },
    { id: 'aurore', nom: 'Aurore boréale', opales: 3 },
    { id: 'feuilles', nom: 'Feuilles', etoiles: 28 },
    { id: 'galaxie', nom: 'Galaxie', etoiles: 45 },
  ];
  // Trois stades : le compagnon grandit avec les étoiles.
  const STADES = [{ min: 0, nom: 'Petit' }, { min: 20, nom: 'Grand' }, { min: 50, nom: 'Majestueux' }];
  const FAMILLES = { espece: ESPECES, couleur: COULEURS, accessoire: ACCESSOIRES, aura: AURAS };

  /* ---------- Ce qu'elle a ---------- */
  const compte = () => { const n = N(); const r = n && n.reussites ? n.reussites() : { total: 0, lecons: 0 }; return { etoiles: r.total || 0, opales: r.lecons || 0 }; };
  const ouvert = (x) => { const c = compte(); if (N() && N().estProf && N().estProf()) return true; return x.opales ? c.opales >= x.opales : c.etoiles >= (x.etoiles || 0); };
  const prix = (x) => (x.opales ? `${x.opales} opale${x.opales > 1 ? 's' : ''}` : (x.etoiles ? `${x.etoiles} étoile${x.etoiles > 1 ? 's' : ''}` : 'offert'));
  const stade = () => { const e = compte().etoiles; let s = 0; STADES.forEach((x, i) => { if (e >= x.min) s = i; }); return s; };
  function lireChoix() {
    const n = N(); const c = (n && n.profil ? n.profil(CLE, null) : null) || {};
    const choix = { nom: String(c.nom || 'Opaline').slice(0, 24), espece: c.espece || 'opaline', couleur: c.couleur || 'turquoise', accessoires: Array.isArray(c.accessoires) ? c.accessoires.slice(0, 4) : [], aura: c.aura || 'aucune' };
    // Un élément qui n'est plus ouvert (jamais le cas : rien ne redescend) retombe sur le premier.
    if (!ESPECES.find((x) => x.id === choix.espece)) choix.espece = 'opaline';
    if (!COULEURS.find((x) => x.id === choix.couleur)) choix.couleur = 'turquoise';
    if (!AURAS.find((x) => x.id === choix.aura)) choix.aura = 'aucune';
    choix.accessoires = choix.accessoires.filter((a) => ACCESSOIRES.find((x) => x.id === a));
    return choix;
  }
  async function enregistrer(choix) { const n = N(); if (n && n.enregistrerProfil) await n.enregistrerProfil(CLE, choix); }

  /* ---------- Le dessin ---------- */
  const OEILS = '<circle class="cmp-oeil" cx="40" cy="50" r="4"/><circle class="cmp-oeil" cx="60" cy="50" r="4"/><circle cx="41.5" cy="48.5" r="1.3" fill="#fff"/><circle cx="61.5" cy="48.5" r="1.3" fill="#fff"/>';
  const BOUCHE = '<path class="cmp-bouche" d="M44 60q6 5 12 0" fill="none" stroke="#24202B" stroke-width="2.2" stroke-linecap="round"/>';
  const JOUES = '<circle cx="33" cy="58" r="3.2" fill="#F7A8C4" opacity=".7"/><circle cx="67" cy="58" r="3.2" fill="#F7A8C4" opacity=".7"/>';
  const CORPS = {
    opaline: (c, c2) => `<path d="M50 8 82 40 50 92 18 40Z" fill="url(#cmp-g)"/><path d="M18 40h64L50 52Z" fill="#fff" opacity=".28"/><path d="M50 8 34 40h32Z" fill="${c2}" opacity=".35"/>`,
    renard: (c, c2) => `<path d="M22 30 30 8l14 18h12L70 8l8 22Z" fill="${c}"/><ellipse cx="50" cy="58" rx="30" ry="28" fill="${c}"/><path d="M50 62q-14 0-16 14 6 8 16 8t16-8q-2-14-16-14Z" fill="#fff"/><path d="M28 24l4-9 7 9Z M72 24l-4-9-7 9Z" fill="#fff" opacity=".6"/><circle cx="50" cy="68" r="3" fill="#24202B"/>`,
    chat: (c, c2) => `<path d="M24 34 26 10l16 14h16L74 10l2 24Z" fill="${c}"/><ellipse cx="50" cy="58" rx="30" ry="27" fill="${c}"/><path d="M30 30l4-13 8 11ZM70 30l-4-13-8 11Z" fill="${c2}"/><path d="M46 66h8l-4 4Z" fill="#24202B"/><path d="M30 66h10M30 70h9M60 66h10M61 70h9" stroke="#24202B" stroke-width="1.4" stroke-linecap="round"/>`,
    hibou: (c, c2) => `<path d="M26 26 32 10l14 12h8L68 10l6 16Z" fill="${c}"/><ellipse cx="50" cy="58" rx="31" ry="30" fill="${c}"/><ellipse cx="50" cy="66" rx="18" ry="16" fill="${c2}"/><circle cx="40" cy="50" r="10" fill="#fff"/><circle cx="60" cy="50" r="10" fill="#fff"/><path d="M46 60l4 6 4-6Z" fill="#F2A33C"/>`,
    lapin: (c, c2) => `<rect x="34" y="2" width="11" height="34" rx="5.5" fill="${c}"/><rect x="55" y="2" width="11" height="34" rx="5.5" fill="${c}"/><rect x="37" y="6" width="5" height="26" rx="2.5" fill="${c2}"/><rect x="58" y="6" width="5" height="26" rx="2.5" fill="${c2}"/><ellipse cx="50" cy="60" rx="29" ry="27" fill="${c}"/><path d="M46 64h8l-4 4Z" fill="#E8608E"/><path d="M50 68v4M44 76q6 4 12 0" stroke="#24202B" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
    dragon: (c, c2) => `<path d="M36 14l6 14h-12ZM50 8l6 16H44ZM64 14l6 14H58Z" fill="${c2}"/><ellipse cx="50" cy="58" rx="30" ry="28" fill="${c}"/><ellipse cx="50" cy="70" rx="16" ry="12" fill="${c2}" opacity=".7"/><path d="M12 62q6-14 20-6M88 62q-6-14-20-6" fill="${c}"/><path d="M20 78l-8 8 12-2Z" fill="${c}"/><path d="M76 72q8-2 10 6-6 0-10-6Z" fill="#F2A33C"/>`,
    fantome: (c, c2) => `<path d="M22 56a28 28 0 0 1 56 0v34l-8-6-8 6-8-6-8 6-8-6-8 6-8-6-8 6Z" fill="${c}" opacity=".92"/><path d="M30 44a20 20 0 0 1 40 0" fill="#fff" opacity=".25"/><circle cx="50" cy="66" r="3" fill="${c2}"/>`,
    robot: (c, c2) => `<rect x="47" y="4" width="6" height="12" fill="${c2}"/><circle cx="50" cy="4" r="4" fill="#F2A33C"/><rect x="22" y="18" width="56" height="52" rx="12" fill="${c}"/><rect x="30" y="36" width="40" height="26" rx="8" fill="#24202B" opacity=".85"/><rect x="34" y="74" width="32" height="18" rx="6" fill="${c2}"/><rect x="10" y="40" width="10" height="24" rx="5" fill="${c2}"/><rect x="80" y="40" width="10" height="24" rx="5" fill="${c2}"/><path d="M40 68h20" stroke="${c2}" stroke-width="2"/>`,
    licorne: (c, c2) => `<path d="M50 2 56 30H44Z" fill="url(#cmp-g)"/><ellipse cx="50" cy="58" rx="30" ry="27" fill="#fff"/><path d="M22 40q-10 20 6 34M78 40q10 20-6 34" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/><path d="M34 34q16-10 32 0" fill="none" stroke="${c2}" stroke-width="6" stroke-linecap="round"/><path d="M46 68h8l-4 4Z" fill="#E8608E"/>`,
    kitsune: (c, c2) => `<path d="M6 80q10-30 30-16M94 80q-10-30-30-16M14 88q8-24 30-14M86 88q-8-24-30-14" fill="${c2}" opacity=".9"/><path d="M22 30 30 8l14 18h12L70 8l8 22Z" fill="${c}"/><ellipse cx="50" cy="58" rx="30" ry="28" fill="${c}"/><path d="M50 62q-14 0-16 14 6 8 16 8t16-8q-2-14-16-14Z" fill="#fff"/><circle cx="50" cy="68" r="3" fill="#24202B"/><path d="M36 40l6-4M64 40l-6-4" stroke="#B42318" stroke-width="2.4" stroke-linecap="round"/>`,
    phenix: (c, c2) => `<path d="M50 4q-12 16-4 26 4-10 4-26Zm0 0q12 16 4 26-4-10-4-26Z" fill="#F2A33C"/><ellipse cx="50" cy="58" rx="28" ry="27" fill="${c}"/><path d="M6 44q20-6 22 20-16 4-22-20ZM94 44q-20-6-22 20 16 4 22-20Z" fill="${c2}"/><path d="M40 90q10-14 20 0-10 6-20 0Z" fill="#F2A33C"/><path d="M46 66l4 6 4-6Z" fill="#F2A33C"/>`,
    aurore: (c, c2) => `<path d="M20 90q0-50 30-70 30 20 30 70Z" fill="url(#cmp-g)" opacity=".92"/><path d="M28 86q4-30 22-46 18 16 22 46" fill="${c2}" opacity=".35"/><path d="M34 26q16-16 32 0" fill="none" stroke="#fff" stroke-width="3" opacity=".7" stroke-linecap="round"/><circle cx="50" cy="12" r="4" fill="#fff" opacity=".9"/>`,
  };
  const ACCESSOIRE_SVG = {
    lunettes: '<g fill="none" stroke="#24202B" stroke-width="2.4"><circle cx="40" cy="50" r="8"/><circle cx="60" cy="50" r="8"/><path d="M48 50h4M32 48l-8-2M68 48l8-2"/></g>',
    echarpe: (c2) => `<path d="M26 74q24 12 48 0v9q-24 12-48 0Z" fill="${c2}"/><path d="M62 80l6 16 7-3-6-14Z" fill="${c2}"/>`,
    chapeau: '<path d="M24 34h52l-6-6H30Z" fill="#24202B"/><path d="M34 28l4-18h24l4 18Z" fill="#24202B"/><path d="M36 22h28" stroke="#E8608E" stroke-width="3"/>',
    noeud: '<path d="M50 30l-14-8v16Zm0 0l14-8v16Z" fill="#E8608E"/><circle cx="50" cy="30" r="3.5" fill="#F7A8C4"/>',
    fleur: '<g transform="translate(70 26)"><circle cx="0" cy="-7" r="4.5" fill="#F7A8C4"/><circle cx="7" cy="0" r="4.5" fill="#F7A8C4"/><circle cx="0" cy="7" r="4.5" fill="#F7A8C4"/><circle cx="-7" cy="0" r="4.5" fill="#F7A8C4"/><circle cx="0" cy="0" r="3.5" fill="#F2A33C"/></g>',
    feutre: '<g transform="rotate(-30 78 74)"><rect x="72" y="52" width="10" height="34" rx="3" fill="#2BB5A0"/><rect x="72" y="52" width="10" height="8" rx="3" fill="#24202B"/><path d="M74 86l3 8 3-8Z" fill="#2BB5A0"/></g>',
    couronne: '<path d="M30 30l6-16 8 10 6-14 6 14 8-10 6 16Z" fill="#F2C744"/><circle cx="36" cy="16" r="2.5" fill="#E8608E"/><circle cx="50" cy="12" r="2.5" fill="#2BB5A0"/><circle cx="64" cy="16" r="2.5" fill="#E8608E"/>',
    cape: (c2) => `<path d="M20 44q-10 30 2 50h56q12-20 2-50-14 12-30 12t-30-12Z" fill="${c2}" opacity=".85"/>`,
    ailes: '<path d="M18 50q-16-10-14-28 12 4 18 20 4-8 10-10-4 12-14 18Zm64 0q16-10 14-28-12 4-18 20-4-8-10-10 4 12 14 18Z" fill="#fff" opacity=".85" stroke="#C79CE6" stroke-width="1.5"/>',
    lanterne: '<path d="M84 48v10" stroke="#24202B" stroke-width="2"/><rect x="76" y="58" width="16" height="20" rx="3" fill="#F2C744" opacity=".9"/><rect x="74" y="56" width="20" height="4" rx="1" fill="#24202B"/><rect x="74" y="78" width="20" height="4" rx="1" fill="#24202B"/>',
    casque: '<path d="M28 34a22 18 0 0 1 44 0v4H28Z" fill="#F2A33C"/><rect x="24" y="36" width="52" height="5" rx="2" fill="#24202B"/><circle cx="50" cy="26" r="5" fill="#fff"/>',
    etoile: '<path d="M50 2l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1Z" fill="#F2C744"/>',
    halo: '<ellipse cx="50" cy="12" rx="22" ry="6" fill="none" stroke="url(#cmp-g)" stroke-width="4" opacity=".9"/>',
  };
  const AURA_SVG = {
    aucune: '',
    etincelles: '<g class="cmp-aura cmp-aura-etincelles" fill="#F2C744"><path d="M10 20l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/><path d="M88 14l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5Z"/><path d="M14 78l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5Z"/><path d="M90 70l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/></g>',
    bulles: '<g class="cmp-aura cmp-aura-bulles" fill="none" stroke="#8FC4E8" stroke-width="1.5"><circle cx="12" cy="30" r="5"/><circle cx="88" cy="22" r="4"/><circle cx="8" cy="72" r="3"/><circle cx="92" cy="66" r="6"/><circle cx="20" cy="10" r="2.5"/></g>',
    aurore: '<g class="cmp-aura cmp-aura-aurore" opacity=".7"><path d="M0 26q25-30 50-10t50-10v14q-25-20-50 0T0 40Z" fill="url(#cmp-g)"/></g>',
    feuilles: '<g class="cmp-aura cmp-aura-feuilles" fill="#7FD3C1"><path d="M8 24q10-10 14 2-10 6-14-2Z"/><path d="M84 12q10-8 12 4-10 4-12-4Z"/><path d="M6 70q10-8 12 4-10 4-12-4Z"/><path d="M88 80q10-8 12 4-10 4-12-4Z"/></g>',
    galaxie: '<g class="cmp-aura cmp-aura-galaxie"><ellipse cx="50" cy="60" rx="48" ry="14" fill="none" stroke="#C79CE6" stroke-width="2" opacity=".7"/><circle cx="10" cy="56" r="2" fill="#fff"/><circle cx="90" cy="64" r="2.5" fill="#F2C744"/><circle cx="30" cy="70" r="1.5" fill="#fff"/></g>',
  };

  let nGrad = 0;
  /** Le HTML du compagnon. o : { taille (rem), bulle (texte), choix (sinon le profil), dort } */
  function rendre(o) {
    const opt = o || {};
    const choix = opt.choix || lireChoix();
    const couleur = COULEURS.find((x) => x.id === choix.couleur) || COULEURS[0];
    const corps = CORPS[choix.espece] || CORPS.opaline;
    nGrad += 1; const gid = 'cmp-g' + nGrad;
    const heure = new Date().getHours();
    const dort = typeof opt.dort === 'boolean' ? opt.dort : (heure >= 21 || heure < 7);
    // Les ailes et la cape passent derrière le corps ; le reste devant.
    const DERRIERE = ['ailes', 'cape'];
    const dessiner = (a) => { const s = ACCESSOIRE_SVG[a]; return typeof s === 'function' ? s(couleur.c2) : (s || ''); };
    const arriere = choix.accessoires.filter((a) => DERRIERE.includes(a)).map(dessiner).join('');
    const acc = choix.accessoires.filter((a) => !DERRIERE.includes(a)).map(dessiner).join('');
    const svg = `<svg class="cmp-svg" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${couleur.c2}"/><stop offset=".55" stop-color="${couleur.c}"/><stop offset="1" stop-color="#C79CE6"/></linearGradient></defs>${(AURA_SVG[choix.aura] || '').replace(/cmp-g\b/g, gid)}${arriere}<g class="cmp-corps">${corps(couleur.c, couleur.c2).replace(/cmp-g\b/g, gid)}${choix.espece === 'hibou' || choix.espece === 'robot' ? '' : JOUES}${dort ? '<path class="cmp-oeil-clos" d="M35 51q5 4 10 0M55 51q5 4 10 0" fill="none" stroke="#24202B" stroke-width="2.2" stroke-linecap="round"/>' : OEILS}${dort ? '<path d="M45 61h10" stroke="#24202B" stroke-width="2" stroke-linecap="round"/>' : BOUCHE}</g>${acc}${dort ? '<text x="70" y="26" font-size="12" fill="#6B6575" class="cmp-zzz">z z</text>' : ''}</svg>`;
    const s = stade();
    return `<span class="cmp cmp-${ech(choix.espece)} cmp-stade-${s + 1}${dort ? ' dort' : ''}" style="--cmp-taille:${Number(opt.taille) || 5}rem" role="img" aria-label="${ech(choix.nom)}, ton compagnon${dort ? ', qui dort' : ''}">${svg}${opt.bulle ? `<span class="cmp-bulle">${ech(opt.bulle)}</span>` : ''}</span>`;
  }

  /* ---------- Ce qu'il dit ---------- */
  const PHRASES = {
    matin: ['Bonjour. On commence doucement.', 'Une chose à la fois, on y va.', 'Le cahier est prêt ?'],
    aprem: ['C\'est l\'heure de travailler ensemble.', 'Une leçon, puis une pause.', 'Je reste à côté.'],
    soir: ['La journée est finie. Repose-toi.', 'Demain, on continue.', 'Bonne soirée.'],
    etoile: ['Une étoile ! Bien joué.', 'Ça, c\'est acquis.', 'Tu avances.'],
    serie: ['Série réussie !', 'Toutes ces questions… bravo.'],
    lecon: ['Leçon validée : trois étoiles.', 'Une leçon de plus dans la poche.'],
    debloque: ['Quelque chose de nouveau s\'ouvre pour moi !'],
  };
  const phrase = (cle) => { const l = PHRASES[cle] || PHRASES.matin; return l[Math.floor(Math.random() * l.length)]; };
  function phraseDuMoment() {
    const h = new Date().getHours();
    if (h < 12) return phrase('matin'); if (h < 19) return phrase('aprem'); return phrase('soir');
  }

  /* ---------- Les réactions ---------- */
  function reagir(evenement) {
    document.querySelectorAll('.cmp').forEach((el) => {
      el.classList.remove('cmp-saute'); void el.offsetWidth; el.classList.add('cmp-saute');
      const b = el.querySelector('.cmp-bulle');
      if (b) b.textContent = phrase(evenement);
      setTimeout(() => el.classList.remove('cmp-saute'), 1200);
    });
    signalerDeblocages();
  }
  /** Les nouveaux éléments ouverts depuis la dernière visite : une phrase, pas plus. */
  function deblocagesNouveaux() {
    const n = N(); if (!n) return [];
    const vus = new Set(n.lire(CLE_VUS, []) || []);
    const tous = [];
    Object.entries(FAMILLES).forEach(([f, liste]) => liste.forEach((x) => { if (ouvert(x) && (x.etoiles || x.opales)) tous.push({ f, x }); }));
    return tous.filter((t) => !vus.has(t.f + ':' + t.x.id));
  }
  function marquerVus() { const n = N(); if (!n) return; const tous = []; Object.entries(FAMILLES).forEach(([f, liste]) => liste.forEach((x) => { if (ouvert(x)) tous.push(f + ':' + x.id); })); n.ecrire(CLE_VUS, tous); }
  function signalerDeblocages() {
    const n = N(); const nouveaux = deblocagesNouveaux();
    if (!n || !nouveaux.length || (n.estProf && n.estProf())) return;
    const noms = nouveaux.slice(0, 3).map((t) => t.x.nom).join(', ');
    n.signaler(`Nouveau pour ton compagnon : ${noms}. Va voir sur sa page.`, 'succes');
    marquerVus();
  }

  /* ---------- La page ---------- */
  function vue() {
    const n = N(); const V = window.VUE_ELEVE;
    if (!n || !V) return;
    const choix = lireChoix();
    const c = compte();
    const carte = (famille, x, actif) => {
      const ok = ouvert(x);
      const apercu = famille === 'couleur'
        ? `<i class="cmp-pastille" style="background:linear-gradient(135deg,${x.c2},${x.c})"></i>`
        : rendre({ taille: 3.4, choix: { ...choix, espece: famille === 'espece' ? x.id : choix.espece, accessoires: famille === 'accessoire' ? [x.id] : (famille === 'aura' ? [] : choix.accessoires), aura: famille === 'aura' ? x.id : (famille === 'espece' ? 'aucune' : choix.aura) }, dort: false });
      return `<li><button type="button" data-famille="${famille}" data-id="${x.id}" class="${actif ? 'actif' : ''}${ok ? '' : ' ferme'}" aria-pressed="${actif}" aria-disabled="${!ok}" title="${ech(x.nom)}${ok ? '' : ' : à ' + prix(x)}">${apercu}<b>${ech(x.nom)}</b><span>${ok ? (actif ? 'choisi' : (x.etoiles || x.opales ? 'ouvert' : 'offert')) : '🔒 ' + prix(x)}</span></button></li>`;
    };
    const prochain = (liste) => liste.filter((x) => !ouvert(x)).sort((a, b) => (a.opales ? 1000 + a.opales : a.etoiles) - (b.opales ? 1000 + b.opales : b.etoiles))[0];
    const suivants = Object.entries(FAMILLES).map(([f, l]) => ({ f, x: prochain(l) })).filter((t) => t.x);
    V.afficher(`<h1>Mon compagnon</h1>
      <p class="e-intro">Il s'appelle comme tu veux, il change de forme et de couleur. Chaque étoile et chaque leçon validée (une opale) lui ouvre quelque chose.</p>
      <section class="cmp-scene e-carte">
        <div id="cmp-apercu">${rendre({ taille: 9, bulle: phraseDuMoment() })}</div>
        <div class="cmp-fiche">
          <label for="cmp-nom">Son nom</label>
          <p class="cmp-nom-ligne"><input id="cmp-nom" type="text" maxlength="24" value="${ech(choix.nom)}"><button type="button" class="e-bouton e-bouton-doux" id="cmp-nom-ok">Garder</button></p>
          <p class="cmp-compte">${n.ic('ic-etoile')} ${c.etoiles} étoile${c.etoiles > 1 ? 's' : ''} · ${c.opales} opale${c.opales > 1 ? 's' : ''} (leçons validées) · stade ${stade() + 1} sur 3, ${STADES[stade()].nom.toLowerCase()}</p>
          ${suivants.length ? `<p class="e-aide">Prochains déblocages : ${suivants.map((t) => `${ech(t.x.nom)} à ${prix(t.x)}`).join(' · ')}.</p>` : '<p class="e-aide">Tout est ouvert.</p>'}
        </div>
      </section>
      <div class="cmp-onglets" role="tablist">${[['espece', 'Forme'], ['couleur', 'Couleur'], ['accessoire', 'Accessoires'], ['aura', 'Aura']].map(([f, t], i) => `<button type="button" role="tab" data-onglet="${f}" aria-selected="${i === 0}">${t}</button>`).join('')}</div>
      ${Object.entries(FAMILLES).map(([f, liste], i) => `<ul class="cmp-grille" data-panneau="${f}" ${i ? 'hidden' : ''}>${liste.map((x) => carte(f, x, f === 'accessoire' ? choix.accessoires.includes(x.id) : choix[f] === x.id)).join('')}</ul>`).join('')}
      <p class="e-aide">Les accessoires se cumulent, quatre au plus. Rien ne se perd : ce qui est ouvert reste ouvert.</p>`);
    const zone = document.getElementById('vue-eleve');
    const onglets = zone.querySelectorAll('[data-onglet]');
    onglets.forEach((b) => b.addEventListener('click', () => {
      onglets.forEach((x) => x.setAttribute('aria-selected', String(x === b)));
      zone.querySelectorAll('[data-panneau]').forEach((p) => { p.hidden = p.getAttribute('data-panneau') !== b.getAttribute('data-onglet'); });
    }));
    const rafraichir = () => { document.getElementById('cmp-apercu').innerHTML = rendre({ taille: 9, bulle: phraseDuMoment() }); };
    zone.querySelectorAll('[data-famille]').forEach((b) => b.addEventListener('click', async () => {
      const f = b.getAttribute('data-famille'); const id = b.getAttribute('data-id');
      const x = FAMILLES[f].find((y) => y.id === id);
      if (!ouvert(x)) { n.signaler(`« ${x.nom} » s'ouvre à ${prix(x)}.`, 'info'); return; }
      const actuel = lireChoix();
      if (f === 'accessoire') {
        const deja = actuel.accessoires.includes(id);
        if (deja) actuel.accessoires = actuel.accessoires.filter((a) => a !== id);
        else { if (actuel.accessoires.length >= 4) { n.signaler('Quatre accessoires au plus : retire-en un d\'abord.', 'info'); return; } actuel.accessoires.push(id); }
      } else actuel[f] = id;
      try { await enregistrer(actuel); } catch (e) { n.signaler(e.message); return; }
      zone.querySelectorAll(`[data-famille="${f}"]`).forEach((y) => { const on = f === 'accessoire' ? actuel.accessoires.includes(y.getAttribute('data-id')) : y.getAttribute('data-id') === id; y.classList.toggle('actif', on); y.setAttribute('aria-pressed', String(on)); const s = y.querySelector('span'); if (s && !y.classList.contains('ferme')) s.textContent = on ? 'choisi' : 'ouvert'; });
      rafraichir(); reagir('etoile');
    }));
    document.getElementById('cmp-nom-ok').addEventListener('click', async () => {
      const nom = document.getElementById('cmp-nom').value.trim().slice(0, 24) || 'Opaline';
      const actuel = lireChoix(); actuel.nom = nom;
      try { await enregistrer(actuel); n.signaler(`Il s'appelle ${nom}.`, 'succes'); rafraichir(); } catch (e) { n.signaler(e.message); }
    });
    marquerVus();
  }

  window.COMPAGNON = { ESPECES, COULEURS, ACCESSOIRES, AURAS, STADES, rendre, vue, reagir, lireChoix, phraseDuMoment, compte, ouvert, prix, deblocagesNouveaux, signalerDeblocages };
})();
