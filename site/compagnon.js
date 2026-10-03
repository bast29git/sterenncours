/* ============================================================================
 * compagnon.js : le compagnon de Sterenn (F239, compagnon 2.0).
 *
 * Une petite créature dessinée en SVG, qu'elle nomme, habille et dont elle
 * s'occupe. Les formes, couleurs, motifs, yeux, accessoires, auras, fonds et
 * objets de sa chambre, et ses tours s'ouvrent avec les étoiles (toutes les
 * réussites), les opales (une par leçon validée), les cœurs (la mission du
 * jour) ou l'amitié (ce qu'elle fait avec lui, jour après jour). Rien ne se
 * referme jamais. Il a des envies du jour, une humeur, une mémoire de ce
 * qu'elle lui dit, un album de photos, un carnet. Six gestes : caresser,
 * nourrir (les provisions viennent des réussites), jouer (trois mini-jeux),
 * brosser, parler, photographier. Les tours s'apprennent en répétant une suite.
 * Les choix vivent dans le profil partagé (moi.compagnon, moi.compagnon_vie,
 * moi.compagnon_coeurs) : le professeur les voit aussi.
 *
 *   COMPAGNON.rendre({ taille, bulle })   le HTML du compagnon courant
 *   COMPAGNON.vue()                        sa page
 *   COMPAGNON.reagir('etoile' | 'serie' | 'lecon' | 'fiche' | 'jeu' | 'felicitation' | 'bonjour')
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
    { id: 'coeur', nom: 'Cœur au cou', coeurs: 2 },
    { id: 'bandana', nom: 'Bandana', coeurs: 5 },
    { id: 'baguette', nom: 'Baguette magique', coeurs: 8 },
  ];
  // Les tours : des cabrioles ouvertes par les cœurs, gagnés en s'occupant de lui.
  const TOURS = [
    { id: 'pirouette', nom: 'Pirouette', coeurs: 1 },
    { id: 'salut', nom: 'Salut', coeurs: 3 },
    { id: 'danse', nom: 'Petite danse', coeurs: 6 },
    { id: 'cache', nom: 'Cache-cache', coeurs: 10 },
    { id: 'etoiles', nom: 'Pluie d\'étoiles', coeurs: 15 },
  ];
  // Les motifs sur le corps, les yeux : étoiles, opales, cœurs ou un niveau d'amitié.
  const MOTIFS = [
    { id: 'uni', nom: 'Uni', etoiles: 0 },
    { id: 'rayures', nom: 'Rayures', amitie: 2 },
    { id: 'taches', nom: 'Taches', etoiles: 8 },
    { id: 'etoiles', nom: 'Étoilé', opales: 2 },
    { id: 'coeurs', nom: 'Petits cœurs', coeurs: 4 },
    { id: 'aurore', nom: 'Reflets d\'aurore', amitie: 5 },
  ];
  const YEUX = [
    { id: 'ronds', nom: 'Ronds', etoiles: 0 },
    { id: 'amande', nom: 'En amande', amitie: 1 },
    { id: 'rieurs', nom: 'Rieurs', coeurs: 3 },
    { id: 'etoiles', nom: 'Étoiles', etoiles: 16 },
    { id: 'grands', nom: 'Grands yeux', opales: 4 },
  ];
  // Sa chambre : un fond, puis des objets posés (cinq au plus).
  const FONDS = [
    { id: 'prairie', nom: 'Prairie', etoiles: 0 },
    { id: 'chambre', nom: 'Sa chambre', amitie: 1 },
    { id: 'aurore', nom: 'Nuit d\'aurore', opales: 2 },
    { id: 'bibliotheque', nom: 'Bibliothèque', etoiles: 15 },
    { id: 'atelier', nom: 'Atelier de feutres', amitie: 4 },
    { id: 'plage', nom: 'Plage bretonne', etoiles: 30 },
    { id: 'espace', nom: 'Espace', opales: 10 },
  ];
  const OBJETS = [
    { id: 'coussin', nom: 'Coussin', etoiles: 1 },
    { id: 'gamelle', nom: 'Gamelle', amitie: 1 },
    { id: 'balle', nom: 'Balle', coeurs: 2 },
    { id: 'plante', nom: 'Plante', etoiles: 4 },
    { id: 'livres', nom: 'Pile de livres', opales: 1 },
    { id: 'lampe', nom: 'Lampe', amitie: 2 },
    { id: 'feutres', nom: 'Pot de feutres', etoiles: 10 },
    { id: 'tapis', nom: 'Tapis', coeurs: 4 },
    { id: 'telescope', nom: 'Télescope', opales: 6 },
    { id: 'cadre', nom: 'Cadre photo', amitie: 3 },
    { id: 'tableau', nom: 'Tableau d\'aurore', etoiles: 24 },
    { id: 'guirlande', nom: 'Guirlande', opales: 14 },
  ];
  // Les provisions : chaque réussite en apporte une, il les mange quand elle le nourrit.
  const PROVISIONS = [
    { id: 'baie', nom: 'Baies', ico: '🫐', source: 'une fiche terminée' },
    { id: 'biscuit', nom: 'Biscuit', ico: '🍪', source: 'une série réussie' },
    { id: 'the', nom: 'Thé aux fleurs', ico: '🍵', source: 'une leçon validée' },
    { id: 'etoile', nom: 'Étoile sucrée', ico: '⭐', source: 'un monde ou un jeu gagné' },
  ];
  // L'amitié : des points gagnés en s'occupant de lui (plafonnés par jour), huit niveaux.
  const NIVEAUX = [
    { min: 0, nom: 'On se découvre' }, { min: 8, nom: 'Copains' }, { min: 20, nom: 'Bons amis' }, { min: 36, nom: 'Complices' },
    { min: 56, nom: 'Fidèles' }, { min: 80, nom: 'Inséparables' }, { min: 110, nom: 'Deux explorateurs' }, { min: 150, nom: 'Légendaires' },
  ];
  const GESTES = {
    caresse: { nom: 'Caresser', points: 1, max: 3 }, nourrir: { nom: 'Nourrir', points: 2, max: 2 }, jouer: { nom: 'Jouer', points: 3, max: 2 },
    brosser: { nom: 'Brosser', points: 2, max: 1 }, parler: { nom: 'Parler', points: 1, max: 2 }, tour: { nom: 'Apprendre un tour', points: 4, max: 1 }, envie: { nom: 'Envie', points: 2, max: 2 },
  };
  // Les vignettes de l'album : des repères, gagnés sans rien acheter.
  const VIGNETTES = [
    { id: 'premier-pas', ico: '👣', nom: 'Premiers pas', texte: 'Tu lui as donné un nom.', test: (v, c, n) => !!(n.profil(CLE, null) || {}).ne_le },
    { id: 'gourmet', ico: '🍽️', nom: 'Gourmet', texte: 'Nourri dix fois.', test: (v) => (v.nourris || 0) >= 10 },
    { id: 'joueur', ico: '🎲', nom: 'Joueur', texte: 'Cinq parties gagnées.', test: (v) => (v.joues || 0) >= 5 },
    { id: 'soigne', ico: '🪮', nom: 'Soigné', texte: 'Brossé cinq jours.', test: (v) => (v.brosses || 0) >= 5 },
    { id: 'confident', ico: '💬', nom: 'Confident', texte: 'Dix conversations.', test: (v) => (v.parles || 0) >= 10 },
    { id: 'dresseuse', ico: '🎪', nom: 'Dresseuse', texte: 'Trois tours appris.', test: (v) => (v.tours_appris || []).length >= 3 },
    { id: 'photographe', ico: '📸', nom: 'Photographe', texte: 'Trois photos dans l\'album.', test: (v) => (v.souvenirs || []).length >= 3 },
    { id: 'fidele', ico: '📅', nom: 'Fidèle', texte: 'Sept jours de visites.', test: (v) => Object.keys(v.jours || {}).length >= 7 },
    { id: 'parfaite', ico: '🌟', nom: 'Journée parfaite', texte: 'Toutes ses envies d\'un jour comblées.', test: (v) => (v.parfaites || 0) >= 1 },
    { id: 'dix-etoiles', ico: '⭐', nom: 'Dix étoiles', texte: 'Dix étoiles gagnées.', test: (v, c) => c.etoiles >= 10 },
    { id: 'cinq-opales', ico: '💎', nom: 'Cinq opales', texte: 'Cinq leçons validées.', test: (v, c) => c.opales >= 5 },
    { id: 'explorateur', ico: '🪐', nom: 'Exploratrice', texte: 'Un monde 3D gagné.', test: (v, c, n) => Object.entries(n.etat.resultats || {}).some(([k, r]) => k.indexOf('jeu/3d-') === 0 && r && r.meilleur >= 70) },
    { id: 'complices', ico: '🤝', nom: 'Complices', texte: 'Niveau d\'amitié 4.', test: (v) => niveauDe(v.amitie || 0) >= 3 },
  ];
  // Les missions du jour : une par jour, un cœur quand elle est faite.
  const MISSIONS = [
    { id: 'fiche', texte: 'Termine une fiche aujourd\'hui.', faite: (n) => Object.values(n.etat.fiches || {}).some((f) => String(f && f.termine_le || '').slice(0, 10) === n.jourIso()) },
    { id: 'serie', texte: 'Réussis une série à 70 % aujourd\'hui.', faite: (n) => Object.values(n.etat.resultats || {}).some((r) => r && String(r.maj_le || '').slice(0, 10) === n.jourIso() && r.total > 0 && r.meilleur / r.total >= 0.7) },
    { id: 'visite', texte: 'Viens me voir sur ma page.', faite: (n) => n.lire('opaline.compagnon.visite', '') === n.jourIso() },
    { id: 'caresse', texte: 'Caresse-moi trois fois.', faite: (n) => (n.lire('opaline.compagnon.caresses', {}) || {})[n.jourIso()] >= 3 },
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
  const FAMILLES = { espece: ESPECES, couleur: COULEURS, motif: MOTIFS, yeux: YEUX, accessoire: ACCESSOIRES, aura: AURAS, fond: FONDS, objet: OBJETS, tour: TOURS };
  const niveauDe = (pts) => { let k = 0; NIVEAUX.forEach((x, i) => { if (pts >= x.min) k = i; }); return k; };

  /* ---------- Ce qu'elle a ---------- */
  const compte = () => { const n = N(); const r = n && n.reussites ? n.reussites() : { total: 0, lecons: 0 }; const c = n && n.profil ? (n.profil('moi.compagnon_coeurs', null) || {}) : {}; return { etoiles: r.total || 0, opales: r.lecons || 0, coeurs: Number(c.n) || 0 }; };
  const ouvert = (x) => { const c = compte(); if (N() && N().estProf && N().estProf()) return true; if (x.amitie) return niveauDe(lireVie().amitie || 0) >= x.amitie; if (x.coeurs) return c.coeurs >= x.coeurs; return x.opales ? c.opales >= x.opales : c.etoiles >= (x.etoiles || 0); };
  const prix = (x) => (x.amitie ? `amitié « ${NIVEAUX[x.amitie].nom} »` : x.coeurs ? `${x.coeurs} cœur${x.coeurs > 1 ? 's' : ''}` : x.opales ? `${x.opales} opale${x.opales > 1 ? 's' : ''}` : (x.etoiles ? `${x.etoiles} étoile${x.etoiles > 1 ? 's' : ''}` : 'offert'));
  const stade = () => { const e = compte().etoiles; let s = 0; STADES.forEach((x, i) => { if (e >= x.min) s = i; }); return s; };
  function lireChoix() {
    const n = N(); const c = (n && n.profil ? n.profil(CLE, null) : null) || {};
    const choix = { nom: String(c.nom || 'Opaline').slice(0, 24), espece: c.espece || 'opaline', couleur: c.couleur || 'turquoise', motif: c.motif || 'uni', yeux: c.yeux || 'ronds', accessoires: Array.isArray(c.accessoires) ? c.accessoires.slice(0, 4) : [], aura: c.aura || 'aucune', ne_le: c.ne_le || null };
    if (!MOTIFS.find((x) => x.id === choix.motif)) choix.motif = 'uni';
    if (!YEUX.find((x) => x.id === choix.yeux)) choix.yeux = 'ronds';
    // Un élément qui n'est plus ouvert (jamais le cas : rien ne redescend) retombe sur le premier.
    if (!ESPECES.find((x) => x.id === choix.espece)) choix.espece = 'opaline';
    if (!COULEURS.find((x) => x.id === choix.couleur)) choix.couleur = 'turquoise';
    if (!AURAS.find((x) => x.id === choix.aura)) choix.aura = 'aucune';
    choix.accessoires = choix.accessoires.filter((a) => ACCESSOIRES.find((x) => x.id === a));
    return choix;
  }
  async function enregistrer(choix) { const n = N(); if (!n || !n.enregistrerProfil) return; const actuel = n.profil(CLE, null) || {}; if (!choix.ne_le) choix.ne_le = actuel.ne_le || n.jourIso(); await n.enregistrerProfil(CLE, choix); }
  const age = () => { const n = N(); const c = n && n.profil ? n.profil(CLE, null) : null; if (!c || !c.ne_le) return 0; return Math.max(0, Math.round((new Date(n.jourIso() + 'T12:00:00') - new Date(c.ne_le + 'T12:00:00')) / 86400000)); };

  /* ---------- Le dessin ---------- */
  const OEILS = '<circle class="cmp-oeil" cx="40" cy="50" r="4"/><circle class="cmp-oeil" cx="60" cy="50" r="4"/><circle cx="41.5" cy="48.5" r="1.3" fill="#fff"/><circle cx="61.5" cy="48.5" r="1.3" fill="#fff"/>';
  const YEUX_SVG = {
    ronds: OEILS,
    amande: '<ellipse class="cmp-oeil" cx="40" cy="50" rx="4.6" ry="3.1"/><ellipse class="cmp-oeil" cx="60" cy="50" rx="4.6" ry="3.1"/><circle cx="41.6" cy="49" r="1.1" fill="#fff"/><circle cx="61.6" cy="49" r="1.1" fill="#fff"/>',
    rieurs: '<path d="M35 51q5-6 10 0M55 51q5-6 10 0" fill="none" stroke="#24202B" stroke-width="2.4" stroke-linecap="round"/>',
    etoiles: '<path class="cmp-oeil" d="M40 45l1.6 3.3 3.6.4-2.7 2.5.7 3.6-3.2-1.8-3.2 1.8.7-3.6-2.7-2.5 3.6-.4Z"/><path class="cmp-oeil" d="M60 45l1.6 3.3 3.6.4-2.7 2.5.7 3.6-3.2-1.8-3.2 1.8.7-3.6-2.7-2.5 3.6-.4Z"/>',
    grands: '<circle class="cmp-oeil" cx="40" cy="50" r="5.6"/><circle class="cmp-oeil" cx="60" cy="50" r="5.6"/><circle cx="42" cy="48" r="2" fill="#fff"/><circle cx="62" cy="48" r="2" fill="#fff"/><circle cx="38.5" cy="52.5" r=".9" fill="#fff"/><circle cx="58.5" cy="52.5" r=".9" fill="#fff"/>',
  };
  const MOTIF_SVG = {
    uni: () => '',
    rayures: () => '<g fill="#fff" opacity=".32" transform="rotate(-20 50 60)"><rect x="20" y="44" width="60" height="5"/><rect x="20" y="56" width="60" height="5"/><rect x="20" y="68" width="60" height="5"/></g>',
    taches: () => '<g fill="#fff" opacity=".35"><circle cx="34" cy="68" r="4.5"/><circle cx="62" cy="72" r="3.5"/><circle cx="48" cy="78" r="3"/><circle cx="70" cy="60" r="2.6"/><circle cx="30" cy="56" r="2.4"/></g>',
    etoiles: () => '<g fill="#fff" opacity=".6"><path d="M34 70l1.2 2.5 2.7.3-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.3Z"/><path d="M64 74l1.2 2.5 2.7.3-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.3Z"/><path d="M50 82l1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3Z"/><path d="M70 62l.9 1.8 2 .2-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.2Z"/></g>',
    coeurs: () => '<g fill="#fff" opacity=".55"><path d="M36 72l-3-3a2 2 0 0 1 3-2.6 2 2 0 0 1 3 2.6Z"/><path d="M64 76l-3-3a2 2 0 0 1 3-2.6 2 2 0 0 1 3 2.6Z"/><path d="M50 84l-3-3a2 2 0 0 1 3-2.6 2 2 0 0 1 3 2.6Z"/></g>',
    aurore: (c2) => `<g opacity=".45"><path d="M22 70q14-10 28 0t28 0v6q-14 10-28 0t-28 0Z" fill="#fff"/><path d="M22 60q14-8 28 0t28 0v5q-14 8-28 0t-28 0Z" fill="${c2}"/></g>`,
  };
  const BOUCHES = {
    curieux: '<path class="cmp-bouche" d="M44 60q6 5 12 0" fill="none" stroke="#24202B" stroke-width="2.2" stroke-linecap="round"/>',
    content: '<path class="cmp-bouche" d="M41 58q9 10 18 0" fill="none" stroke="#24202B" stroke-width="2.4" stroke-linecap="round"/><path d="M44 60q6 6 12 0Z" fill="#E8608E" opacity=".8"/>',
    ennui: '<path class="cmp-bouche" d="M44 61h12" fill="none" stroke="#24202B" stroke-width="2.2" stroke-linecap="round"/>',
    surpris: '<ellipse class="cmp-bouche" cx="50" cy="61" rx="3.5" ry="4.5" fill="#24202B"/>',
  };
  const BOUCHE = BOUCHES.curieux;
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
    coeur: '<path d="M50 72v6" stroke="#24202B" stroke-width="1.2"/><path d="M50 88l-7-7a4.2 4.2 0 0 1 6-6l1 1 1-1a4.2 4.2 0 0 1 6 6Z" fill="#E8608E"/>',
    bandana: '<path d="M26 34q24-10 48 0l-2 6q-22-8-44 0Z" fill="#E96A43"/><path d="M70 36l10 10-4 2-8-8Z" fill="#E96A43"/><path d="M34 36h30" stroke="#F7B199" stroke-width="1.4" stroke-dasharray="3 3"/>',
    baguette: '<g transform="rotate(-35 80 70)"><rect x="78" y="48" width="4" height="40" rx="2" fill="#24202B"/><path d="M80 40l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" fill="#F2C744"/></g>',
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
    const h = opt.humeur || humeur();
    const dort = typeof opt.dort === 'boolean' ? opt.dort : h === 'dort';
    // Les ailes et la cape passent derrière le corps ; le reste devant.
    const DERRIERE = ['ailes', 'cape'];
    const dessiner = (a) => { const s = ACCESSOIRE_SVG[a]; return typeof s === 'function' ? s(couleur.c2) : (s || ''); };
    const arriere = choix.accessoires.filter((a) => DERRIERE.includes(a)).map(dessiner).join('');
    const acc = choix.accessoires.filter((a) => !DERRIERE.includes(a)).map(dessiner).join('');
    const svg = `<svg class="cmp-svg" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${couleur.c2}"/><stop offset=".55" stop-color="${couleur.c}"/><stop offset="1" stop-color="#C79CE6"/></linearGradient></defs>${(AURA_SVG[choix.aura] || '').replace(/cmp-g\b/g, gid)}${arriere}<g class="cmp-corps">${corps(couleur.c, couleur.c2).replace(/cmp-g\b/g, gid)}${choix.espece === 'hibou' || choix.espece === 'robot' ? '' : `<clipPath id="${gid}-m"><ellipse cx="50" cy="62" rx="27" ry="24"/></clipPath><g clip-path="url(#${gid}-m)">${(MOTIF_SVG[choix.motif] || MOTIF_SVG.uni)(couleur.c2)}</g>`}${choix.espece === 'hibou' || choix.espece === 'robot' ? '' : JOUES}${dort ? '<path class="cmp-oeil-clos" d="M35 51q5 4 10 0M55 51q5 4 10 0" fill="none" stroke="#24202B" stroke-width="2.2" stroke-linecap="round"/>' : (YEUX_SVG[choix.yeux] || OEILS)}${dort ? '<path d="M45 61h10" stroke="#24202B" stroke-width="2" stroke-linecap="round"/>' : (BOUCHES[h] || BOUCHE)}</g>${acc}${dort ? '<text x="70" y="26" font-size="12" fill="#6B6575" class="cmp-zzz">z z</text>' : ''}</svg>`;
    const s = stade();
    return `<span class="cmp cmp-${ech(choix.espece)} cmp-stade-${s + 1} cmp-humeur-${ech(h)}${dort ? ' dort' : ''}" style="--cmp-taille:${Number(opt.taille) || 5}rem" role="img" aria-label="${ech(choix.nom)}, ton compagnon${dort ? ', qui dort' : ''}">${svg}${opt.bulle ? `<span class="cmp-bulle">${ech(opt.bulle)}</span>` : ''}</span>`;
  }

  /* ---------- Ce qu'il dit ---------- */
  const PHRASES = {
    matin: ['Bonjour. On commence doucement.', 'Une chose à la fois, on y va.', 'Le cahier est prêt ?'],
    aprem: ['C\'est l\'heure de travailler ensemble.', 'Une leçon, puis une pause.', 'Je reste à côté.'],
    soir: ['La journée est finie. Repose-toi.', 'Demain, on continue.', 'Bonne soirée.'],
    etoile: ['Une étoile ! Bien joué.', 'Ça, c\'est acquis.', 'Tu avances.'],
    serie: ['Série réussie ! Un biscuit pour moi.', 'Toutes ces questions… bravo.'],
    lecon: ['Leçon validée : trois étoiles, et du thé pour moi.', 'Une leçon de plus dans la poche.'],
    fiche: ['Fiche terminée. Des baies, merci !', 'Lue jusqu\'au bout, bravo.'],
    jeu: ['Un monde gagné ! Une étoile sucrée.', 'Tu as fini le monde. On y retourne quand tu veux.'],
    felicitation: ['Bastien t\'a écrit un mot. Je suis fier.', 'Un mot de Bastien ! Garde-le.'],
    debloque: ['Quelque chose de nouveau s\'ouvre pour moi !'],
    content: ['Tu as travaillé aujourd\'hui. Je suis content.', 'Une bonne journée !', 'Ça avance, je le vois.'],
    ennui: ['Ça fait un moment… on ouvre une fiche ?', 'Je m\'ennuie un peu. Une petite série ?', 'Reviens quand tu veux, je suis là.'],
    surpris: ['Oh ! Qu\'est-ce que c\'est ?', 'Encore ?', 'Hé !'],
    caresse: ['Rrrr… merci.', 'Encore un peu ?', 'Ça fait du bien.', 'Tu es gentille.'],
    mission: ['Mission du jour réussie : un cœur pour moi !'],
    miam: ['Miam. Merci !', 'C\'était bon.', 'Je garde une place pour la suite.'],
    rassasie: ['Je n\'ai plus faim pour aujourd\'hui. Demain !'],
    brosse: ['Tout doux… continue.', 'Là, juste là.', 'Je brille, non ?'],
    gagne: ['Gagné ! Tu es forte.', 'Bien joué. Encore une ?'],
    perdu: ['Raté, mais c\'était drôle. On recommence ?', 'Presque !'],
    appris: ['Je sais faire un tour de plus !', 'Appris. Regarde-moi.'],
    photo: ['Clic ! Je suis bien, là ?', 'Une photo pour l\'album.'],
    niveau: ['Notre amitié grandit.', 'On se connaît mieux, maintenant.'],
    parfaite: ['Toutes mes envies du jour… merci.'],
    envie: ['Aujourd\'hui, j\'aurais envie de…', 'Tu sais ce qui me ferait plaisir ?'],
  };
  const phrase = (cle) => { const l = PHRASES[cle] || PHRASES.matin; return l[Math.floor(Math.random() * l.length)]; };
  /** L'humeur : dort la nuit, content après du travail aujourd'hui, s'ennuie après trois jours sans rien, curieux sinon. */
  function humeur() {
    const n = N(); const h = new Date().getHours();
    if (h >= 21 || h < 7) return 'dort';
    if (!n || !n.etat) return 'curieux';
    const auj = n.jourIso();
    const dates = [];
    Object.values(n.etat.fiches || {}).forEach((f) => { if (f && f.termine_le) dates.push(String(f.termine_le).slice(0, 10)); });
    Object.values(n.etat.resultats || {}).forEach((r) => { if (r && r.maj_le) dates.push(String(r.maj_le).slice(0, 10)); });
    const v = lireVie(); if (v.jours && v.jours[auj]) dates.push(auj);
    if (dates.includes(auj)) return 'content';
    const derniere = dates.sort().pop();
    if (derniere && (new Date(auj + 'T12:00:00') - new Date(derniere + 'T12:00:00')) / 86400000 >= 3) return 'ennui';
    return 'curieux';
  }
  function phraseDuMoment() {
    const h = humeur();
    if (h === 'dort') return phrase('soir');
    if (h === 'content') return phrase('content');
    if (h === 'ennui') return phrase('ennui');
    const g = gouts(); const cles = Object.keys(g);
    if (cles.length && Math.random() < 0.3) { const q = QUESTIONS.find((x) => x.id === cles[Math.floor(Math.random() * cles.length)]); if (q) return q.rappel(g[q.id]); }
    const heure = new Date().getHours();
    return heure < 12 ? phrase('matin') : phrase('aprem');
  }
  /* ---------- Ses petits sons ---------- */
  let ctxAudio = null;
  function bip(genre) {
    const n = N();
    try { if (n && n.lire && n.lire(n.CLE_SONS || 'opaline.sons', true) === false) return; } catch (e) { return; }
    try {
      ctxAudio = ctxAudio || new (window.AudioContext || window.webkitAudioContext)();
      const motifs = { caresse: [[880, 0.08], [1174, 0.1], [988, 0.14]], joie: [[784, 0.07], [988, 0.07], [1319, 0.16]], tour: [[659, 0.06], [880, 0.06], [1109, 0.06], [1319, 0.12]], dodo: [[440, 0.18], [349, 0.26]], miam: [[523, 0.07], [659, 0.07], [523, 0.1]], raté: [[392, 0.12], [330, 0.18]], clic: [[1568, 0.05]] };
      let t = ctxAudio.currentTime;
      (motifs[genre] || motifs.caresse).forEach(([f, d]) => { const o = ctxAudio.createOscillator(); const g = ctxAudio.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 1.06, t + d); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.08, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(g); g.connect(ctxAudio.destination); o.start(t); o.stop(t + d + 0.02); t += d; });
    } catch (e) { /* pas de son ici */ }
  }

  /* ---------- Sa vie : amitié, provisions, envies, souvenirs, chambre (profil partagé moi.compagnon_vie) ---------- */
  const CLE_VIE = 'moi.compagnon_vie';
  function lireVie() {
    const n = N(); const v = (n && n.profil ? n.profil(CLE_VIE, null) : null) || {};
    const vie = {
      amitie: Number(v.amitie) || 0, jours: v.jours && typeof v.jours === 'object' ? v.jours : {},
      provisions: Object.assign({ baie: 0, biscuit: 0, the: 0, etoile: 0 }, v.provisions || {}),
      nourris: Number(v.nourris) || 0, joues: Number(v.joues) || 0, brosses: Number(v.brosses) || 0, parles: Number(v.parles) || 0, parfaites: Number(v.parfaites) || 0,
      tours_appris: Array.isArray(v.tours_appris) ? v.tours_appris : [], souvenirs: Array.isArray(v.souvenirs) ? v.souvenirs.slice(0, 12) : [],
      gouts: v.gouts && typeof v.gouts === 'object' ? v.gouts : {}, chambre: Object.assign({ fond: 'prairie', objets: [] }, v.chambre || {}),
      carnet: Array.isArray(v.carnet) ? v.carnet.slice(0, 40) : [], envies_faites: Array.isArray(v.envies_faites) ? v.envies_faites : [],
    };
    if (!FONDS.find((x) => x.id === vie.chambre.fond)) vie.chambre.fond = 'prairie';
    vie.chambre.objets = (Array.isArray(vie.chambre.objets) ? vie.chambre.objets : []).filter((o) => OBJETS.find((x) => x.id === o)).slice(0, 5);
    return vie;
  }
  let fileVie = Promise.resolve();
  /** Modifie sa vie d'un bloc et l'enregistre ; les écritures s'enchaînent dans l'ordre. */
  function modifierVie(fn) {
    const n = N(); if (!n || !n.enregistrerProfil || (n.estProf && n.estProf())) return Promise.resolve(lireVie());
    fileVie = fileVie.then(async () => {
      const v = lireVie(); const avant = niveauDe(v.amitie);
      fn(v);
      // Soixante jours d'historique au plus ; le carnet garde quarante lignes.
      const cles = Object.keys(v.jours).sort(); while (cles.length > 60) delete v.jours[cles.shift()];
      v.carnet = v.carnet.slice(0, 40);
      await n.enregistrerProfil(CLE_VIE, v);
      const apres = niveauDe(v.amitie);
      if (apres > avant) { noter(v, `Amitié : « ${NIVEAUX[apres].nom} »`); await n.enregistrerProfil(CLE_VIE, v); bip('joie'); n.signaler(`Votre amitié passe au niveau « ${NIVEAUX[apres].nom} ». Quelque chose s'ouvre peut-être pour lui.`, 'succes'); }
      return v;
    }).catch(() => lireVie());
    return fileVie;
  }
  const noter = (v, texte) => { const n = N(); v.carnet.unshift({ d: n ? n.jourIso() : '', t: String(texte).slice(0, 80) }); };
  const jourVie = (v) => { const n = N(); const j = n ? n.jourIso() : ''; v.jours[j] = v.jours[j] || {}; return v.jours[j]; };
  /** Un geste du jour : compte, donne ses points d'amitié tant que le plafond du jour n'est pas atteint. Renvoie les points gagnés. */
  function geste(v, id) {
    const g = GESTES[id]; const j = jourVie(v); j[id] = (j[id] || 0) + 1;
    if (j[id] > g.max) return 0;
    v.amitie += g.points; return g.points;
  }
  const amitie = () => { const v = lireVie(); const k = niveauDe(v.amitie); const suivant = NIVEAUX[k + 1]; return { points: v.amitie, niveau: k, nom: NIVEAUX[k].nom, suivant: suivant ? suivant.min : null, part: suivant ? (v.amitie - NIVEAUX[k].min) / (suivant.min - NIVEAUX[k].min) : 1 }; };
  const gouts = () => lireVie().gouts;

  /* ---------- Les envies du jour : deux gestes tirés par la date, deux points d'amitié chacun ---------- */
  const ENVIES = [
    { id: 'caresse', texte: 'une caresse', fait: (j) => (j.caresse || 0) >= 1 },
    { id: 'nourrir', texte: 'une friandise', fait: (j) => (j.nourrir || 0) >= 1 },
    { id: 'jouer', texte: 'une partie', fait: (j) => (j.jouer || 0) >= 1 },
    { id: 'brosser', texte: 'un brossage', fait: (j) => (j.brosser || 0) >= 1 },
    { id: 'parler', texte: 'une conversation', fait: (j) => (j.parler || 0) >= 1 },
  ];
  function enviesDuJour() {
    const n = N(); const j = n ? n.jourIso() : '2026-01-01'; const k = Number(j.replace(/-/g, ''));
    const a = k % ENVIES.length; const b = (a + 1 + (Math.floor(k / 7) % (ENVIES.length - 1))) % ENVIES.length;
    const v = lireVie(); const jour = v.jours[j] || {};
    return [ENVIES[a], ENVIES[b]].map((e) => ({ id: e.id, texte: e.texte, faite: e.fait(jour) }));
  }
  /** Après chaque geste : une envie comblée donne ses points une fois ; les deux le même jour, une journée parfaite. */
  function verifierEnvies(v) {
    const n = N(); const j = n.jourIso(); const jour = jourVie(v); let nouvelles = 0;
    ENVIES.forEach((e) => { const cle = j + ':' + e.id; if (!enviesDuJour().some((x) => x.id === e.id)) return; if (e.fait(jour) && !v.envies_faites.includes(cle)) { v.envies_faites.push(cle); v.amitie += GESTES.envie.points; nouvelles += 1; } });
    v.envies_faites = v.envies_faites.filter((c) => c.slice(0, 10) >= new Date(Date.now() - 10 * 86400000).toISOString().slice(0, 10));
    const toutes = enviesDuJour().every((x) => ENVIES.find((e) => e.id === x.id).fait(jour));
    if (toutes && !v.envies_faites.includes(j + ':parfaite')) { v.envies_faites.push(j + ':parfaite'); v.parfaites += 1; v.amitie += 1; noter(v, 'Journée parfaite : toutes ses envies comblées'); return 'parfaite'; }
    return nouvelles ? 'envie' : '';
  }

  /* ---------- Les missions et les cœurs ---------- */
  function missionDuJour() { const n = N(); const j = n ? n.jourIso() : '2026-01-01'; const k = Number(j.replace(/-/g, '')) % MISSIONS.length; return MISSIONS[k]; }
  const coeursProfil = () => { const n = N(); return (n && n.profil ? n.profil('moi.compagnon_coeurs', null) : null) || { n: 0, jours: {} }; };
  /** Vérifie la mission du jour ; le cœur est donné une seule fois par jour. Renvoie true si un cœur vient d'être gagné. */
  async function verifierMission() {
    const n = N(); if (!n || !n.enregistrerProfil || (n.estProf && n.estProf())) return false;
    const m = missionDuJour(); const c = coeursProfil(); const auj = n.jourIso();
    if (c.jours && c.jours[auj]) return false;
    let faite = false; try { faite = m.faite(n); } catch (e) { faite = false; }
    if (!faite) return false;
    const jours = Object.assign({}, c.jours || {}); jours[auj] = m.id;
    const cles = Object.keys(jours).sort(); while (cles.length > 60) delete jours[cles.shift()];
    try { await n.enregistrerProfil('moi.compagnon_coeurs', { n: (Number(c.n) || 0) + 1, jours }); } catch (e) { return false; }
    bip('joie'); n.signaler(phrase('mission'), 'succes');
    animer(null, 'cmp-saute', phrase('mission'));
    return true;
  }

  /* ---------- Les gestes ---------- */
  /** Une animation et une phrase sur un compagnon affiché (celui de la page, sinon tous). */
  function animer(el, classe, texte, duree) {
    const cibles = el ? [el] : [...document.querySelectorAll('.cmp')];
    cibles.forEach((c) => { c.classList.remove(classe); void c.offsetWidth; c.classList.add(classe); const b = c.querySelector('.cmp-bulle'); if (b && texte) b.textContent = texte; setTimeout(() => c.classList.remove(classe), duree || 1200); });
  }
  const apercu = () => document.querySelector('#cmp-apercu .cmp');
  let nCaresse = 0;
  function caresser(el) {
    const n = N(); if (!n) return;
    nCaresse += 1;
    const auj = n.jourIso(); const c = n.lire('opaline.compagnon.caresses', {}) || {}; c[auj] = (c[auj] || 0) + 1; n.ecrire('opaline.compagnon.caresses', c);
    const cible = el || document.querySelector('.cmp');
    if (cible) animer(cible, nCaresse % 3 === 0 ? 'cmp-tour-pirouette' : 'cmp-caresse', nCaresse % 3 === 0 ? phrase('surpris') : phrase('caresse'), 1000);
    bip(nCaresse % 3 === 0 ? 'tour' : 'caresse');
    if ((c[auj] || 0) <= GESTES.caresse.max) modifierVie((v) => { geste(v, 'caresse'); verifierEnvies(v); }).then(() => rafraichirAujourdhui());
    verifierMission();
  }
  /** Nourrir : une provision de moins, deux fois par jour au plus pour l'amitié (il mange quand même). */
  async function nourrir(id) {
    const v0 = lireVie(); if (!v0.provisions[id]) return false;
    const jour = (v0.jours[N().jourIso()] || {});
    if ((jour.nourrir || 0) >= 4) { animer(apercu(), 'cmp-caresse', phrase('rassasie'), 1000); return false; }
    await modifierVie((v) => { v.provisions[id] = Math.max(0, (v.provisions[id] || 0) - 1); v.nourris += 1; geste(v, 'nourrir'); verifierEnvies(v); });
    bip('miam'); animer(apercu(), 'cmp-mange', phrase('miam'), 1400);
    rafraichirAujourdhui(); return true;
  }
  /** Brosser : des passages sur lui (glisser, ou le bouton répété), huit pour un brossage complet. */
  let brossage = 0;
  function brosser(pas) {
    brossage = Math.min(8, brossage + (pas || 1));
    const j = document.getElementById('cmp-brosse-jauge'); if (j) j.style.width = Math.round((brossage / 8) * 100) + '%';
    if (brossage % 3 === 1) animer(apercu(), 'cmp-caresse', phrase('brosse'), 700);
    if (brossage >= 8) {
      brossage = 0; bip('joie'); animer(apercu(), 'cmp-brille', 'Je brille !', 1600);
      modifierVie((v) => { v.brosses += 1; geste(v, 'brosser'); verifierEnvies(v); }).then(() => { rafraichirAujourdhui(); fermerZone(); });
      return true;
    }
    return false;
  }
  /* ---------- Parler : il raconte, il demande, il se souvient ---------- */
  const FAITS = [
    'Les aurores boréales naissent à plus de 100 km d\'altitude, quand des particules du Soleil touchent l\'air.',
    'Le vert des aurores vient de l\'oxygène ; le violet, de l\'azote.',
    'Un feutre à alcool sèche vite parce que l\'alcool s\'évapore plus vite que l\'eau.',
    'Un chat dort environ seize heures par jour. Moi, un peu moins.',
    'Le son va à 340 m/s dans l\'air et quinze fois plus vite dans l\'acier.',
    'Les Lumières, c\'est un siècle d\'idées : raison, liberté, savoir pour tous.',
    'Une opale, c\'est de l\'eau prise dans la pierre : d\'où ses reflets.',
    'La Terre tourne sur elle-même à plus de 1 600 km/h à l\'équateur, et tu ne sens rien.',
    'Un hibou peut tourner la tête à 270 degrés. Je m\'entraîne.',
    'Le papier a été inventé en Chine il y a près de deux mille ans.',
  ];
  const QUESTIONS = [
    { id: 'moment', q: 'Tu préfères travailler le matin ou l\'après-midi ?', r: ['Le matin', 'L\'après-midi'], rappel: (v) => `Tu m'avais dit : tu préfères ${v === 0 ? 'le matin' : 'l\'après-midi'}.` },
    { id: 'ciel', q: 'Qu\'est-ce qui te fait le plus rêver ?', r: ['Les aurores boréales', 'Les étoiles'], rappel: (v) => `Je me souviens : ${v === 0 ? 'les aurores' : 'les étoiles'} te font rêver.` },
    { id: 'matiere', q: 'En ce moment, quelle matière te plaît le plus ?', r: ['Les sciences', 'Les lettres et l\'histoire'], rappel: (v) => `Tu aimes ${v === 0 ? 'les sciences' : 'les lettres et l\'histoire'} en ce moment, tu m'as dit.` },
    { id: 'pause', q: 'Pour une pause, tu choisis quoi ?', r: ['Dessiner aux feutres', 'Écouter de la musique'], rappel: (v) => `Pour ta pause, ${v === 0 ? 'les feutres' : 'la musique'}. Je retiens.` },
    { id: 'monde', q: 'Dans les mondes 3D, tu préfères…', r: ['Explorer à pied', 'Résoudre la mission'], rappel: (v) => `Toi, dans les mondes, c'est ${v === 0 ? 'explorer' : 'la mission'}.` },
    { id: 'saison', q: 'Ta saison préférée ?', r: ['L\'hiver et ses nuits', 'L\'été et ses soirs'], rappel: (v) => `Ta saison, c'est ${v === 0 ? 'l\'hiver' : 'l\'été'}.` },
    { id: 'heros', q: 'Une héroïne qui te ressemble ?', r: ['Maomao, qui observe tout', 'Myne, qui lit tout'], rappel: (v) => `Comme ${v === 0 ? 'Maomao' : 'Myne'}, tu m'as dit.` },
    { id: 'reviser', q: 'Pour réviser, le mieux pour toi ?', r: ['Une série de questions', 'Relire la fiche'], rappel: (v) => `Pour réviser, ${v === 0 ? 'une série' : 'relire la fiche'} : c'est toi qui l'as dit.` },
  ];
  function conversation() {
    const n = N(); const g = gouts(); const restantes = QUESTIONS.filter((q) => g[q.id] === undefined);
    const prochaine = n.prochaineSeance ? n.prochaineSeance() : null;
    const lignes = [];
    const a = amitie();
    lignes.push(`<p class="cmp-dit">${ech(phrase(humeur() === 'content' ? 'content' : 'aprem'))} Notre amitié : <b>${ech(a.nom)}</b>.</p>`);
    if (prochaine && prochaine.titre) lignes.push(`<p class="cmp-dit">Prochaine séance : ${ech(prochaine.titre)}. Je serai là.</p>`);
    lignes.push(`<p class="cmp-dit">${ech(FAITS[(Number(n.jourIso().replace(/-/g, '')) + (lireVie().parles || 0)) % FAITS.length])}</p>`);
    const q = restantes.length ? restantes[(lireVie().parles || 0) % restantes.length] : null;
    const html = `<div class="cmp-conversation">${lignes.join('')}
      ${q ? `<p class="cmp-dit cmp-question"><b>${ech(q.q)}</b></p><p class="cmp-reponses">${q.r.map((r, i) => `<button type="button" class="e-bouton e-bouton-doux" data-reponse="${i}" data-question="${q.id}">${ech(r)}</button>`).join('')}</p>` : `<p class="cmp-dit">${ech(QUESTIONS[(lireVie().parles || 0) % QUESTIONS.length].rappel(g[QUESTIONS[(lireVie().parles || 0) % QUESTIONS.length].id] || 0))}</p>`}
      <p class="e-aide">Il se souvient de tes réponses. <button type="button" class="e-bouton e-bouton-fin e-bouton-doux" id="cmp-zone-fermer">Fermer</button></p></div>`;
    ouvrirZone(html, 'Parler');
    const zone = document.getElementById('cmp-zone');
    zone.querySelectorAll('[data-reponse]').forEach((b) => b.addEventListener('click', async () => {
      const id = b.getAttribute('data-question'); const r = Number(b.getAttribute('data-reponse'));
      const qq = QUESTIONS.find((x) => x.id === id);
      await modifierVie((v) => { v.gouts[id] = r; v.parles += 1; geste(v, 'parler'); verifierEnvies(v); });
      zone.querySelector('.cmp-reponses').outerHTML = `<p class="cmp-dit">${ech(qq.rappel(r))}</p>`;
      bip('caresse'); animer(apercu(), 'cmp-saute', 'Je retiens.', 1000); rafraichirAujourdhui();
    }));
    if (!q) modifierVie((v) => { v.parles += 1; geste(v, 'parler'); verifierEnvies(v); }).then(() => rafraichirAujourdhui());
  }

  /* ---------- Jouer : trois mini-jeux, choisis à tour de rôle ---------- */
  const MINI = [
    { id: 'etoile', nom: 'Attrape l\'étoile', regle: 'Touche l\'étoile six fois : elle se déplace à chaque fois. Prends ton temps.' },
    { id: 'cache', nom: 'Cache-cache', regle: 'Il se cache sous une des trois boîtes, qui s\'échangent. Retrouve-le trois fois sur quatre.' },
    { id: 'suite', nom: 'La suite', regle: 'Il fait des mouvements dans l\'ordre ; refais la même suite avec les boutons.' },
  ];
  function jouer(id) {
    const v = lireVie(); const m = MINI.find((x) => x.id === id) || MINI[(v.joues + Object.keys(v.jours).length) % MINI.length];
    const gagner = async (oui, detail) => {
      bip(oui ? 'joie' : 'raté'); animer(apercu(), oui ? 'cmp-saute' : 'cmp-caresse', phrase(oui ? 'gagne' : 'perdu'), 1200);
      if (oui) await modifierVie((x) => { x.joues += 1; geste(x, 'jouer'); verifierEnvies(x); });
      const z = document.getElementById('cmp-zone-corps'); if (z) z.innerHTML = `<p class="cmp-dit">${oui ? 'Gagné' : 'Perdu'}${detail ? ' : ' + ech(detail) : ''}.</p><p class="cmp-reponses"><button type="button" class="e-bouton" id="cmp-rejouer">Rejouer</button> <button type="button" class="e-bouton e-bouton-doux" id="cmp-zone-fermer">Fermer</button></p>`;
      const r = document.getElementById('cmp-rejouer'); if (r) r.addEventListener('click', () => jouer(m.id));
      const f = document.getElementById('cmp-zone-fermer'); if (f) f.addEventListener('click', fermerZone);
      rafraichirAujourdhui();
    };
    const choixJeux = `<p class="cmp-jeux-choix">${MINI.map((x) => `<button type="button" class="e-bouton e-bouton-doux ${x.id === m.id ? 'actif' : ''}" data-mini="${x.id}" aria-pressed="${x.id === m.id}">${ech(x.nom)}</button>`).join('')}</p>`;
    ouvrirZone(`${choixJeux}<p class="e-aide">${ech(m.regle)}</p><div id="cmp-zone-corps" class="cmp-jeu cmp-jeu-${m.id}"></div>`, 'Jouer : ' + m.nom);
    document.querySelectorAll('[data-mini]').forEach((b) => b.addEventListener('click', () => jouer(b.getAttribute('data-mini'))));
    const corps = document.getElementById('cmp-zone-corps');
    if (m.id === 'etoile') {
      let pris = 0; const debut = performance.now();
      corps.innerHTML = '<div class="cmp-terrain" aria-label="Terrain de jeu"><button type="button" class="cmp-etoile-cible" aria-label="Attraper l\'étoile">★</button></div><p class="cmp-jeu-score">0 sur 6</p>';
      const cible = corps.querySelector('.cmp-etoile-cible'); const score = corps.querySelector('.cmp-jeu-score');
      const placer = () => { cible.style.left = (8 + Math.random() * 78) + '%'; cible.style.top = (8 + Math.random() * 70) + '%'; };
      placer();
      cible.addEventListener('click', () => { pris += 1; bip('clic'); score.textContent = pris + ' sur 6'; placer(); if (pris >= 6) gagner(true, Math.round((performance.now() - debut) / 1000) + ' s'); });
    } else if (m.id === 'cache') {
      let manche = 0; let trouves = 0;
      const jouerManche = () => {
        manche += 1; const bonne = Math.floor(Math.random() * 3);
        corps.innerHTML = `<p class="cmp-jeu-score">Manche ${manche} sur 4 · trouvé ${trouves} fois</p><div class="cmp-boites">${[0, 1, 2].map((i) => `<button type="button" class="cmp-boite" data-boite="${i}" aria-label="Boîte ${i + 1}" disabled><span class="cmp-boite-dedans">${i === bonne ? rendre({ taille: 2.4, humeur: 'surpris' }) : ''}</span><span class="cmp-boite-couvercle">${['📦', '🎁', '🧺'][i]}</span></button>`).join('')}</div><p class="e-aide cmp-boites-aide">Regarde bien où il entre…</p>`;
        const boites = [...corps.querySelectorAll('.cmp-boite')]; const aide = corps.querySelector('.cmp-boites-aide');
        boites[bonne].classList.add('montre');
        setTimeout(() => { boites[bonne].classList.remove('montre'); boites.forEach((b) => b.classList.add('ferme')); aide.textContent = 'Les boîtes s\'échangent…'; }, 1100);
        // Trois échanges visibles, puis le choix.
        let ordre = [0, 1, 2];
        const echanger = (k) => { if (k >= 3) { aide.textContent = 'Où est-il ?'; boites.forEach((b) => { b.disabled = false; }); return; } const i = Math.floor(Math.random() * 3); const j = (i + 1 + Math.floor(Math.random() * 2)) % 3; [ordre[i], ordre[j]] = [ordre[j], ordre[i]]; boites.forEach((b, idx) => { b.style.order = String(ordre.indexOf(idx)); b.classList.add('bouge'); setTimeout(() => b.classList.remove('bouge'), 500); }); setTimeout(() => echanger(k + 1), 650); };
        setTimeout(() => echanger(0), 1500);
        boites.forEach((b) => b.addEventListener('click', () => {
          boites.forEach((x) => { x.disabled = true; x.classList.remove('ferme'); });
          const ok = Number(b.getAttribute('data-boite')) === bonne; if (ok) trouves += 1; bip(ok ? 'clic' : 'raté');
          aide.textContent = ok ? 'Trouvé !' : 'Il était ailleurs.';
          setTimeout(() => { if (manche >= 4) gagner(trouves >= 3, `trouvé ${trouves} fois sur 4`); else jouerManche(); }, 1000);
        }));
      };
      jouerManche();
    } else {
      const MOUVES = [['gauche', '◀ Gauche', 'cmp-mv-gauche'], ['droite', 'Droite ▶', 'cmp-mv-droite'], ['saut', '▲ Saut', 'cmp-saute'], ['tour', '↻ Tour', 'cmp-tour-pirouette']];
      const longueur = 3 + Math.min(2, Math.floor((lireVie().joues || 0) / 3));
      const suite = Array.from({ length: longueur }, () => MOUVES[Math.floor(Math.random() * MOUVES.length)][0]); window.__cmpSuite = suite;
      let attendu = 0; let phase = 'regarde';
      corps.innerHTML = `<p class="cmp-jeu-score">Regarde la suite de ${longueur} mouvements…</p><p class="cmp-suite-boutons">${MOUVES.map(([id, t]) => `<button type="button" class="e-bouton e-bouton-doux" data-mouv="${id}" disabled>${t}</button>`).join('')}</p><p class="cmp-suite-trace" aria-live="polite"></p>`;
      const score = corps.querySelector('.cmp-jeu-score'); const trace = corps.querySelector('.cmp-suite-trace'); const boutons = [...corps.querySelectorAll('[data-mouv]')];
      const montrer = (k) => { if (k >= suite.length) { phase = 'joue'; score.textContent = 'À toi : refais la suite.'; boutons.forEach((b) => { b.disabled = false; }); return; } const mv = MOUVES.find((x) => x[0] === suite[k]); animer(apercu(), mv[2], '', 700); bip('clic'); setTimeout(() => montrer(k + 1), 900); };
      setTimeout(() => montrer(0), 600);
      boutons.forEach((b) => b.addEventListener('click', () => {
        if (phase !== 'joue') return; const id = b.getAttribute('data-mouv'); const mv = MOUVES.find((x) => x[0] === id);
        animer(apercu(), mv[2], '', 700); trace.textContent += (trace.textContent ? ' · ' : '') + mv[1].replace(/[◀▶▲↻] ?/g, '');
        if (id !== suite[attendu]) { phase = 'fin'; boutons.forEach((x) => { x.disabled = true; }); gagner(false, `la suite était ${suite.join(', ')}`); return; }
        attendu += 1; bip('clic');
        if (attendu >= suite.length) { phase = 'fin'; boutons.forEach((x) => { x.disabled = true; }); gagner(true, `${suite.length} mouvements`); }
      }));
    }
  }
  /* ---------- Les tours : ouverts par les cœurs, appris en répétant leur suite ---------- */
  const SUITES_TOURS = { pirouette: ['tour', 'tour'], salut: ['gauche', 'droite', 'saut'], danse: ['gauche', 'droite', 'gauche', 'droite'], cache: ['saut', 'tour', 'saut'], etoiles: ['saut', 'saut', 'tour', 'saut'] };
  const tourAppris = (id) => lireVie().tours_appris.includes(id);
  function apprendre(id) {
    const t = TOURS.find((x) => x.id === id); if (!t || !ouvert(t) || tourAppris(id)) return;
    const MOUVES = [['gauche', '◀ Gauche', 'cmp-mv-gauche'], ['droite', 'Droite ▶', 'cmp-mv-droite'], ['saut', '▲ Saut', 'cmp-saute'], ['tour', '↻ Tour', 'cmp-tour-pirouette']];
    const suite = SUITES_TOURS[id]; let attendu = 0; let phase = 'regarde'; window.__cmpSuite = suite;
    ouvrirZone(`<p class="e-aide">Pour apprendre « ${ech(t.nom)} », regarde sa suite puis refais-la une fois sans erreur.</p><div id="cmp-zone-corps" class="cmp-jeu"><p class="cmp-jeu-score">Regarde…</p><p class="cmp-suite-boutons">${MOUVES.map(([mid, tx]) => `<button type="button" class="e-bouton e-bouton-doux" data-mouv="${mid}" disabled>${tx}</button>`).join('')}</p><p class="cmp-suite-trace" aria-live="polite"></p></div>`, 'Apprendre : ' + t.nom);
    const corps = document.getElementById('cmp-zone-corps'); const score = corps.querySelector('.cmp-jeu-score'); const boutons = [...corps.querySelectorAll('[data-mouv]')];
    const montrer = (k) => { if (k >= suite.length) { phase = 'joue'; score.textContent = 'À toi.'; boutons.forEach((b) => { b.disabled = false; }); return; } const mv = MOUVES.find((x) => x[0] === suite[k]); animer(apercu(), mv[2], '', 700); bip('clic'); setTimeout(() => montrer(k + 1), 900); };
    setTimeout(() => montrer(0), 600);
    boutons.forEach((b) => b.addEventListener('click', async () => {
      if (phase !== 'joue') return; const mid = b.getAttribute('data-mouv'); const mv = MOUVES.find((x) => x[0] === mid); animer(apercu(), mv[2], '', 700);
      if (mid !== suite[attendu]) { attendu = 0; score.textContent = 'Pas tout à fait. On reprend depuis le début : ' + suite.join(', ') + '.'; bip('raté'); return; }
      attendu += 1; bip('clic');
      if (attendu >= suite.length) {
        phase = 'fin'; boutons.forEach((x) => { x.disabled = true; });
        await modifierVie((v) => { if (!v.tours_appris.includes(id)) v.tours_appris.push(id); geste(v, 'tour'); noter(v, `Tour appris : ${t.nom}`); });
        bip('joie'); animer(apercu(), 'cmp-saute', phrase('appris'), 1200); score.textContent = `« ${t.nom} » est appris. Il le fera quand tu veux.`;
        setTimeout(() => { fermerZone(); vue(); }, 1400);
      }
    }));
  }
  function tour(id, el) {
    const t = TOURS.find((x) => x.id === id); if (!t || !ouvert(t)) return false;
    const cible = el || document.querySelector('.cmp'); if (!cible) return false;
    TOURS.forEach((x) => cible.classList.remove('cmp-tour-' + x.id)); void cible.offsetWidth;
    cible.classList.add('cmp-tour-' + id); bip('tour');
    if (id === 'etoiles') { const pluie = document.createElement('span'); pluie.className = 'cmp-pluie'; pluie.innerHTML = '★★★★★★★★'.split('').map((c, i) => `<i style="--i:${i}">${c}</i>`).join(''); cible.appendChild(pluie); setTimeout(() => pluie.remove(), 2200); }
    setTimeout(() => cible.classList.remove('cmp-tour-' + id), 2200);
    return true;
  }
  /* ---------- La photo : un souvenir dans l'album, à envoyer à Bastien ---------- */
  async function photographier(titre) {
    const n = N(); const choix = lireChoix(); const v0 = lireVie();
    const souvenir = { d: n.jourIso(), t: String(titre || '').trim().slice(0, 40), choix: { espece: choix.espece, couleur: choix.couleur, motif: choix.motif, yeux: choix.yeux, accessoires: choix.accessoires.slice(), aura: choix.aura, nom: choix.nom }, fond: v0.chambre.fond, objets: v0.chambre.objets.slice(), amitie: NIVEAUX[niveauDe(v0.amitie)].nom };
    await modifierVie((v) => { v.souvenirs.unshift(souvenir); v.souvenirs = v.souvenirs.slice(0, 12); noter(v, `Photo : ${souvenir.t || 'sans titre'}`); });
    bip('clic'); animer(apercu(), 'cmp-flash', phrase('photo'), 900);
    return souvenir;
  }
  async function envoyerPhoto(souvenir) {
    const n = N(); if (!n || !n.api) return false;
    const texte = `📸 ${souvenir.choix.nom} (${ESPECES.find((x) => x.id === souvenir.choix.espece).nom}, ${COULEURS.find((x) => x.id === souvenir.choix.couleur).nom})${souvenir.t ? ' : ' + souvenir.t : ''}. Amitié : ${souvenir.amitie}. Dans sa ${FONDS.find((x) => x.id === souvenir.fond).nom.toLowerCase()}.`;
    try { await n.api('/messages', { method: 'POST', body: JSON.stringify({ texte, contexte: 'compagnon:photo' }) }); n.signaler('Photo envoyée à Bastien.', 'succes'); return true; } catch (e) { n.signaler(e.message || 'La photo n\'est pas partie.'); return false; }
  }

  /* ---------- Sa chambre : un fond et des objets, dessinés en SVG derrière lui ---------- */
  const FOND_SVG = {
    prairie: '<rect width="200" height="120" fill="#DDF2F7"/><ellipse cx="100" cy="130" rx="130" ry="40" fill="#9ED9A6"/><circle cx="160" cy="26" r="12" fill="#FFE59A"/><path d="M20 60q10-14 24 0M140 50q10-14 24 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>',
    chambre: '<rect width="200" height="120" fill="#F6E9D8"/><rect y="90" width="200" height="30" fill="#D9B48C"/><rect x="24" y="22" width="44" height="40" rx="3" fill="#BFE3F2" stroke="#fff" stroke-width="3"/><rect x="130" y="40" width="50" height="50" rx="4" fill="#E9C3A5"/><rect x="134" y="36" width="42" height="8" rx="2" fill="#C98C6A"/>',
    aurore: '<rect width="200" height="120" fill="#101C3A"/><path d="M0 50q50-40 100-10t100-20v40q-50 20-100 0T0 80Z" fill="#3BE2A4" opacity=".45"/><path d="M0 30q60-30 110 0t90-10v24q-45 24-90 0T0 54Z" fill="#B08CF0" opacity=".4"/><circle cx="30" cy="20" r="1.4" fill="#fff"/><circle cx="90" cy="14" r="1" fill="#fff"/><circle cx="150" cy="24" r="1.3" fill="#fff"/><circle cx="180" cy="10" r="1" fill="#fff"/><ellipse cx="100" cy="128" rx="130" ry="30" fill="#1E2E56"/>',
    bibliotheque: '<rect width="200" height="120" fill="#EFE3D2"/><rect y="94" width="200" height="26" fill="#A9794F"/><g><rect x="20" y="20" width="160" height="70" fill="#8C5A3B"/><rect x="26" y="26" width="148" height="18" fill="#F2E4D0"/><rect x="26" y="50" width="148" height="18" fill="#F2E4D0"/><rect x="26" y="74" width="148" height="12" fill="#F2E4D0"/><g fill="#2E7FC2"><rect x="30" y="28" width="6" height="14"/><rect x="48" y="28" width="5" height="14"/><rect x="90" y="52" width="6" height="14"/><rect x="140" y="52" width="7" height="14"/></g><g fill="#E96A43"><rect x="38" y="28" width="7" height="14"/><rect x="100" y="52" width="5" height="14"/><rect x="60" y="76" width="30" height="8"/></g><g fill="#2BB5A0"><rect x="56" y="28" width="6" height="14"/><rect x="120" y="52" width="6" height="14"/><rect x="150" y="28" width="7" height="14"/></g></g>',
    atelier: '<rect width="200" height="120" fill="#FBF3E4"/><rect y="92" width="200" height="28" fill="#E2D2B8"/><rect x="20" y="30" width="60" height="44" fill="#fff" stroke="#D9C9AE" stroke-width="2"/><path d="M28 60q14-24 30-6t16-10" fill="none" stroke="#E8608E" stroke-width="3"/><path d="M30 44q20 14 44 0" fill="none" stroke="#2BB5A0" stroke-width="3"/><g><rect x="130" y="44" width="8" height="40" rx="2" fill="#E8608E"/><rect x="142" y="40" width="8" height="44" rx="2" fill="#2BB5A0"/><rect x="154" y="46" width="8" height="38" rx="2" fill="#F2C744"/><rect x="166" y="42" width="8" height="42" rx="2" fill="#2E7FC2"/></g>',
    plage: '<rect width="200" height="120" fill="#CFEAF6"/><rect y="70" width="200" height="22" fill="#4FA8D8"/><path d="M0 72q25-6 50 0t50 0 50 0 50 0v8H0Z" fill="#fff" opacity=".6"/><ellipse cx="100" cy="124" rx="140" ry="36" fill="#F1DDB0"/><circle cx="40" cy="22" r="11" fill="#FFE59A"/><path d="M120 18q8-8 16 0M150 30q8-8 16 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>',
    espace: '<rect width="200" height="120" fill="#0B1024"/><circle cx="40" cy="30" r="1.5" fill="#fff"/><circle cx="80" cy="12" r="1" fill="#fff"/><circle cx="120" cy="26" r="1.2" fill="#fff"/><circle cx="170" cy="18" r="1.6" fill="#fff"/><circle cx="20" cy="70" r="1" fill="#fff"/><circle cx="186" cy="60" r="1.1" fill="#fff"/><circle cx="150" cy="44" r="14" fill="#E9B46A"/><ellipse cx="150" cy="44" rx="24" ry="6" fill="none" stroke="#F3D9A4" stroke-width="2.5"/><ellipse cx="100" cy="126" rx="140" ry="34" fill="#2A2F55"/>',
  };
  const OBJET_SVG = {
    coussin: '<ellipse cx="0" cy="0" rx="18" ry="9" fill="#E8608E"/><ellipse cx="0" cy="-3" rx="16" ry="7" fill="#F7A8C4"/>',
    gamelle: '<path d="M-12-4h24l-3 10h-18Z" fill="#2E7FC2"/><ellipse cx="0" cy="-4" rx="12" ry="3" fill="#8FC4E8"/>',
    balle: '<circle r="7" fill="#F2C744"/><path d="M-7 0q7-6 14 0" fill="none" stroke="#E96A43" stroke-width="2"/>',
    plante: '<rect x="-7" y="-2" width="14" height="12" rx="2" fill="#C98C6A"/><path d="M0-2q-12-10-8-22 10 4 8 22Zm0 0q12-10 8-22-10 4-8 22Z" fill="#23A06E"/><path d="M0-2v-16" stroke="#1F6F3E" stroke-width="2"/>',
    livres: '<rect x="-12" y="-4" width="24" height="5" fill="#2E7FC2"/><rect x="-10" y="-9" width="22" height="5" fill="#E96A43"/><rect x="-11" y="-14" width="20" height="5" fill="#2BB5A0"/>',
    lampe: '<rect x="-1.5" y="-18" width="3" height="20" fill="#24202B"/><path d="M-10-18h20l-4-10h-12Z" fill="#F2C744"/><ellipse cx="0" cy="3" rx="7" ry="2" fill="#24202B"/>',
    feutres: '<rect x="-9" y="-6" width="18" height="12" rx="2" fill="#6B6575"/><rect x="-7" y="-18" width="3.5" height="13" fill="#E8608E"/><rect x="-2" y="-20" width="3.5" height="15" fill="#2BB5A0"/><rect x="3" y="-17" width="3.5" height="12" fill="#2E7FC2"/>',
    tapis: '<ellipse cx="0" cy="0" rx="30" ry="9" fill="#C79CE6"/><ellipse cx="0" cy="0" rx="22" ry="6" fill="none" stroke="#fff" stroke-width="1.5" opacity=".7"/>',
    telescope: '<path d="M-2 4l-8 12M2 4l8 12" stroke="#24202B" stroke-width="2"/><rect x="-5" y="-22" width="10" height="26" rx="3" fill="#2E7FC2" transform="rotate(-30)"/>',
    cadre: '<rect x="-10" y="-13" width="20" height="24" rx="1.5" fill="#F2C744"/><rect x="-7" y="-10" width="14" height="18" fill="#fff"/><circle cx="0" cy="-1" r="4" fill="#2BB5A0"/>',
    tableau: '<rect x="-16" y="-14" width="32" height="22" fill="#24202B"/><rect x="-14" y="-12" width="28" height="18" fill="#101C3A"/><path d="M-14-4q8-8 14-2t14-4v8H-14Z" fill="#3BE2A4" opacity=".7"/>',
    guirlande: '<path d="M-30-10q15 8 30 0t30 0" fill="none" stroke="#6B6575" stroke-width="1.2"/><g><circle cx="-22" cy="-7" r="2.5" fill="#F2C744"/><circle cx="-10" cy="-5" r="2.5" fill="#E8608E"/><circle cx="2" cy="-7" r="2.5" fill="#2BB5A0"/><circle cx="14" cy="-5" r="2.5" fill="#2E7FC2"/><circle cx="26" cy="-7" r="2.5" fill="#F2C744"/></g>',
  };
  const PLACES = [[26, 96], [170, 94], [60, 102], [140, 104], [100, 20]];
  const PLACES_MUR = { cadre: [34, 42], tableau: [160, 40], guirlande: [100, 16], lampe: [176, 84] };
  /** Le HTML de sa chambre (fond et objets), à poser derrière lui. */
  function rendreChambre(ch) {
    const c = ch || lireVie().chambre;
    const objets = c.objets.map((id, i) => { const p = PLACES_MUR[id] || PLACES[i % PLACES.length]; return `<g transform="translate(${p[0]} ${p[1]})">${OBJET_SVG[id] || ''}</g>`; }).join('');
    return `<svg class="cmp-chambre cmp-fond-${ech(c.fond)}" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${FOND_SVG[c.fond] || FOND_SVG.prairie}${objets}</svg>`;
  }

  /* ---------- La mascotte, sur toutes les pages ---------- */
  const CLE_PARTOUT = 'opaline.compagnon.partout';
  const PAGES_MASCOTTE = new Set(['matieres', 'matiere', 'jeux', 'semaine', 'reussites', 'curiosites', 'aide', 'notes', 'annales', 'choix']);
  function mascotte(route) {
    const n = N(); const ancien = document.getElementById('cmp-mascotte');
    const r = Array.isArray(route) ? route : [];
    // Une chose à la fois : la mascotte n'apparaît que sur les pages calmes, jamais sur une fiche, un jeu, une évaluation ni dans les messages.
    const cache = !n || (n.estProf && n.estProf()) || n.lire(CLE_PARTOUT, true) === false || !PAGES_MASCOTTE.has(r[0] || 'hub');
    if (cache) { if (ancien) ancien.remove(); return; }
    const el = ancien || document.createElement('button');
    if (!ancien) {
      el.id = 'cmp-mascotte'; el.type = 'button'; el.className = 'cmp-mascotte';
      el.setAttribute('aria-label', 'Ton compagnon : le caresser'); el.title = 'Caresser';
      el.addEventListener('click', () => caresser(el.querySelector('.cmp')));
      document.body.appendChild(el);
    }
    if (!el.__rendu || el.__rendu !== r.join('/')) { el.innerHTML = rendre({ taille: 3.2, bulle: phraseDuMoment() }); el.__rendu = r.join('/'); }
    verifierMission();
  }

  /* ---------- Les réactions : une réussite lui apporte une provision ---------- */
  const PROVISION_PAR = { fiche: 'baie', serie: 'biscuit', lecon: 'the', jeu: 'etoile', felicitation: 'the' };
  function reagir(evenement) {
    animer(null, 'cmp-saute', phrase(PHRASES[evenement] ? evenement : 'etoile'));
    bip('joie');
    const prov = PROVISION_PAR[evenement];
    if (prov) modifierVie((v) => { v.provisions[prov] = Math.min(20, (v.provisions[prov] || 0) + 1); });
    signalerDeblocages();
    verifierMission();
  }
  /** Les nouveaux éléments ouverts depuis la dernière visite : une phrase, pas plus. */
  function deblocagesNouveaux() {
    const n = N(); if (!n) return [];
    const vus = new Set(n.lire(CLE_VUS, []) || []);
    const tous = [];
    Object.entries(FAMILLES).forEach(([f, liste]) => liste.forEach((x) => { if (ouvert(x) && (x.etoiles || x.opales || x.coeurs || x.amitie)) tous.push({ f, x }); }));
    return tous.filter((t) => !vus.has(t.f + ':' + t.x.id));
  }
  const CLE_JOURNAL = 'opaline.compagnon.journal';
  function marquerVus() {
    const n = N(); if (!n) return;
    const journal = n.lire(CLE_JOURNAL, {}) || {}; const tous = [];
    // À la toute première visite, ce qui est déjà ouvert n'est pas daté d'aujourd'hui : le carnet commence vide.
    const premiere = !Object.keys(journal).length && !(n.lire(CLE_VUS, []) || []).length;
    Object.entries(FAMILLES).forEach(([f, liste]) => liste.forEach((x) => { if (ouvert(x)) { const k = f + ':' + x.id; tous.push(k); if (!premiere && !journal[k] && (x.etoiles || x.opales || x.coeurs || x.amitie)) journal[k] = n.jourIso(); } }));
    n.ecrire(CLE_VUS, tous); n.ecrire(CLE_JOURNAL, journal);
  }
  const NOMS_FAMILLES = { espece: 'forme', couleur: 'couleur', motif: 'motif', yeux: 'yeux', accessoire: 'accessoire', aura: 'aura', fond: 'fond de chambre', objet: 'objet', tour: 'tour' };
  function journalRecent() {
    const n = N(); const j = (n && n.lire(CLE_JOURNAL, {})) || {};
    const deblocages = Object.entries(j).map(([k, d]) => { const [f, id] = k.split(':'); const x = (FAMILLES[f] || []).find((y) => y.id === id); return x ? { d, t: `${x.nom} (${NOMS_FAMILLES[f] || f})` } : null; }).filter(Boolean);
    const vie = lireVie().carnet;
    return deblocages.concat(vie).sort((a, b) => String(b.d).localeCompare(String(a.d))).slice(0, 14);
  }
  function signalerDeblocages() {
    const n = N(); const nouveaux = deblocagesNouveaux();
    if (!n || !nouveaux.length || (n.estProf && n.estProf())) return;
    const noms = nouveaux.slice(0, 3).map((t) => t.x.nom).join(', ');
    n.signaler(`Nouveau pour ton compagnon : ${noms}. Va voir sur sa page.`, 'succes');
    marquerVus();
  }
  const vignettes = () => { const n = N(); const v = lireVie(); const c = compte(); return VIGNETTES.map((x) => { let ok = false; try { ok = !!x.test(v, c, n); } catch (e) { ok = false; } return Object.assign({ ok }, x); }); };

  /* ---------- La zone d'action : une seule chose ouverte à la fois ---------- */
  function ouvrirZone(html, titre) {
    const z = document.getElementById('cmp-zone'); if (!z) return;
    brossage = 0;
    z.hidden = false; z.innerHTML = `<h3 class="cmp-zone-titre">${ech(titre)}</h3>${html}`;
    const f = z.querySelector('#cmp-zone-fermer'); if (f) f.addEventListener('click', fermerZone);
    z.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  function fermerZone() { const z = document.getElementById('cmp-zone'); if (z) { z.hidden = true; z.innerHTML = ''; } document.querySelectorAll('[data-geste][aria-pressed]').forEach((b) => b.setAttribute('aria-pressed', 'false')); const ap = document.getElementById('cmp-apercu'); if (ap) ap.classList.remove('brossage'); const j = document.getElementById('cmp-brosse'); if (j) j.hidden = true; }
  /** Le bloc « Aujourd'hui » et la fiche se redessinent après un geste, sans recharger la page. */
  function rafraichirAujourdhui() {
    const b = document.getElementById('cmp-aujourdhui'); if (b) b.innerHTML = blocAujourdhui();
    const a = document.getElementById('cmp-amitie'); if (a) a.innerHTML = ligneAmitie();
    const p = document.getElementById('cmp-provisions'); if (p) p.innerHTML = ligneProvisions();
  }
  function ligneAmitie() {
    const a = amitie();
    return `<span class="cmp-amitie-nom">Amitié : <b>${ech(a.nom)}</b> <small>(niveau ${a.niveau + 1} sur ${NIVEAUX.length})</small></span><span class="cmp-amitie-jauge" role="img" aria-label="${a.points} points d'amitié${a.suivant ? `, niveau suivant à ${a.suivant}` : ''}"><i style="width:${Math.round(a.part * 100)}%"></i></span>${a.suivant ? `<small>${a.points} / ${a.suivant}</small>` : '<small>au plus haut</small>'}`;
  }
  function ligneProvisions() {
    const v = lireVie();
    return PROVISIONS.map((p) => `<span class="cmp-prov" title="${ech(p.nom)} : ${ech(p.source)}"><span aria-hidden="true">${p.ico}</span> ${v.provisions[p.id] || 0}</span>`).join('');
  }
  function blocAujourdhui() {
    const n = N(); const envies = enviesDuJour(); const mission = missionDuJour(); const coeursJour = (coeursProfil().jours || {})[n.jourIso()];
    let missionFaite = false; try { missionFaite = !!coeursJour || mission.faite(n); } catch (e) { missionFaite = false; }
    const jour = lireVie().jours[n.jourIso()] || {};
    const pointsJour = Object.keys(GESTES).reduce((s, k) => s + Math.min(jour[k] || 0, GESTES[k].max) * GESTES[k].points, 0);
    return `<p class="cmp-envies"><b>Ses envies du jour</b> : ${envies.map((e) => `<span class="cmp-envie ${e.faite ? 'faite' : ''}">${e.faite ? '✓ ' : ''}${ech(e.texte)}</span>`).join(' ')}${envies.every((e) => e.faite) ? ' <span class="cmp-envie faite">journée parfaite</span>' : ''}</p>
      <p class="cmp-mission ${missionFaite ? 'faite' : ''}"><b>Mission du jour</b> : ${ech(mission.texte)} ${missionFaite ? '✓ faite, un cœur gagné' : '(un cœur à gagner)'}</p>
      <p class="e-aide">Amitié gagnée aujourd'hui : ${pointsJour} point${pointsJour > 1 ? 's' : ''}. Chaque geste compte quelques fois par jour, pas plus : la régularité fait tout.</p>`;
  }

  /* ---------- La page ---------- */
  function vue() {
    const n = N(); const V = window.VUE_ELEVE;
    if (!n || !V) return;
    const choix = lireChoix(); const c = compte(); const vie = lireVie();
    n.ecrire('opaline.compagnon.visite', n.jourIso());
    const carte = (famille, x, actif) => {
      const ok = ouvert(x);
      if (famille === 'tour') {
        const appris = tourAppris(x.id);
        return `<li><button type="button" data-tour="${x.id}" class="${ok ? '' : 'ferme'}${appris ? ' appris' : ''}" aria-disabled="${!ok}" title="${ech(x.nom)}${ok ? (appris ? '' : ' : à apprendre') : ' : à ' + prix(x)}"><span class="cmp-tour-ico" aria-hidden="true">${{ pirouette: '🌀', salut: '👋', danse: '💃', cache: '🙈', etoiles: '✨' }[x.id] || '🎪'}</span><b>${ech(x.nom)}</b><span>${ok ? (appris ? 'appris · le faire' : 'ouvert · l\'apprendre') : prix(x)}</span></button></li>`;
      }
      let apercuHtml;
      if (famille === 'couleur') apercuHtml = `<i class="cmp-pastille" style="background:linear-gradient(135deg,${x.c2},${x.c})"></i>`;
      else if (famille === 'fond') apercuHtml = `<span class="cmp-mini-chambre">${rendreChambre({ fond: x.id, objets: [] })}</span>`;
      else if (famille === 'objet') apercuHtml = `<svg class="cmp-mini-objet" viewBox="-34 -26 68 40" aria-hidden="true"><g transform="translate(0 6)">${OBJET_SVG[x.id] || ''}</g></svg>`;
      else apercuHtml = rendre({ taille: 3.4, humeur: 'curieux', choix: { ...choix, espece: famille === 'espece' ? x.id : choix.espece, motif: famille === 'motif' ? x.id : choix.motif, yeux: famille === 'yeux' ? x.id : choix.yeux, accessoires: famille === 'accessoire' ? [x.id] : (famille === 'aura' ? [] : choix.accessoires), aura: famille === 'aura' ? x.id : (famille === 'accessoire' ? 'aucune' : choix.aura) } });
      return `<li><button type="button" data-famille="${famille}" data-id="${x.id}" class="${actif ? 'actif' : ''}${ok ? '' : ' ferme'}" aria-pressed="${actif}" aria-disabled="${!ok}" title="${ech(x.nom)}${ok ? '' : ' : à ' + prix(x)}">${apercuHtml}<b>${ech(x.nom)}</b><span>${ok ? (x.desc ? ech(x.desc) : (actif ? 'choisi' : 'ouvert')) : prix(x)}</span></button></li>`;
    };
    const estActif = (f, x) => (f === 'accessoire' ? choix.accessoires.includes(x.id) : f === 'fond' ? vie.chambre.fond === x.id : f === 'objet' ? vie.chambre.objets.includes(x.id) : choix[f] === x.id);
    const prochain = (liste) => liste.filter((x) => !ouvert(x)).sort((a, b) => (a.amitie ? 3000 + a.amitie : a.coeurs ? 2000 + a.coeurs : a.opales ? 1000 + a.opales : a.etoiles) - (b.amitie ? 3000 + b.amitie : b.coeurs ? 2000 + b.coeurs : b.opales ? 1000 + b.opales : b.etoiles))[0];
    const suivants = Object.entries(FAMILLES).map(([f, l]) => ({ f, x: prochain(l) })).filter((t) => t.x).slice(0, 5);
    const APPARENCE = [['espece', 'Forme'], ['couleur', 'Couleur'], ['motif', 'Motif'], ['yeux', 'Yeux'], ['accessoire', 'Accessoires'], ['aura', 'Aura']];
    const CHAMBRE = [['fond', 'Fond'], ['objet', 'Objets']];
    const grille = (f, liste) => `<ul class="cmp-grille cmp-grille-${f}" data-panneau="${f}" hidden>${liste.map((x) => carte(f, x, estActif(f, x))).join('')}</ul>`;
    const vig = vignettes(); const nbVig = vig.filter((x) => x.ok).length;
    V.afficher(`<h1>Mon compagnon</h1>
      <p class="e-intro">Il s'appelle comme tu veux, il change de forme et de couleur, il a sa chambre. Chaque étoile, chaque leçon validée (une opale), chaque cœur et votre amitié lui ouvrent quelque chose. Rien ne se referme.</p>
      <section class="cmp-scene e-carte">
        <div class="cmp-scene-chambre" id="cmp-scene-chambre">${rendreChambre(vie.chambre)}<div id="cmp-apercu">${rendre({ taille: 9, bulle: phraseDuMoment() })}</div><div class="cmp-brosse" id="cmp-brosse" hidden><span>Brossage</span><i><b id="cmp-brosse-jauge"></b></i></div></div>
        <div class="cmp-fiche">
          <label for="cmp-nom">Son nom</label>
          <p class="cmp-nom-ligne"><input id="cmp-nom" type="text" maxlength="20" minlength="1" autocomplete="off" spellcheck="false" aria-describedby="cmp-nom-aide" value="${ech(choix.nom)}"><button type="button" class="e-bouton e-bouton-doux" id="cmp-nom-ok">Garder</button></p>
          <p class="e-aide" id="cmp-nom-aide">Un nom de 1 à 20 caractères, lettres, chiffres, espaces et tirets.</p>
          <p class="cmp-amitie" id="cmp-amitie">${ligneAmitie()}</p>
          <p class="cmp-compte">${n.ic('ic-etoile')} ${c.etoiles} étoile${c.etoiles > 1 ? 's' : ''} · ${c.opales} opale${c.opales > 1 ? 's' : ''} · ${c.coeurs} cœur${c.coeurs > 1 ? 's' : ''} · stade ${stade() + 1} sur 3, ${STADES[stade()].nom.toLowerCase()}${age() ? ` · ${age()} jour${age() > 1 ? 's' : ''} ensemble` : ''}</p>
          <p class="cmp-humeur">Humeur : <b>${{ dort: 'il dort', content: 'content', ennui: 'il s\'ennuie un peu', curieux: 'curieux', surpris: 'surpris' }[humeur()] || 'curieux'}</b></p>
          <p class="cmp-provisions" id="cmp-provisions">${ligneProvisions()}</p>
          <p class="e-aide">Ses provisions viennent de tes réussites : une fiche, une série, une leçon validée, un monde gagné.</p>
        </div>
      </section>
      <section class="e-carte cmp-aujourdhui-carte" aria-labelledby="cmp-auj-titre">
        <h2 id="cmp-auj-titre" class="cmp-h2">Aujourd'hui</h2>
        <div id="cmp-aujourdhui">${blocAujourdhui()}</div>
        <div class="cmp-gestes" role="group" aria-label="Ce que tu peux faire avec lui">
          ${[['caresser', '🤲', 'Caresser'], ['nourrir', '🍪', 'Nourrir'], ['jouer', '🎲', 'Jouer'], ['brosser', '🪮', 'Brosser'], ['parler', '💬', 'Parler'], ['photo', '📸', 'Photo']].map(([g, ico, t]) => `<button type="button" class="cmp-geste" data-geste="${g}" aria-pressed="false"><span aria-hidden="true">${ico}</span><b>${t}</b></button>`).join('')}
        </div>
        <div id="cmp-zone" class="cmp-zone" hidden></div>
      </section>
      <div class="cmp-onglets" role="tablist">${[['apparence', 'Apparence'], ['chambre', 'Sa chambre'], ['tour', 'Tours'], ['album', 'Album'], ['carnet', 'Carnet']].map(([f, t], i) => `<button type="button" role="tab" data-onglet="${f}" aria-selected="${i === 0}">${t}</button>`).join('')}</div>
      <div data-section="apparence">
        <div class="cmp-sous-onglets" role="tablist">${APPARENCE.map(([f, t], i) => `<button type="button" role="tab" data-sous="${f}" aria-selected="${i === 0}">${t}</button>`).join('')}</div>
        ${APPARENCE.map(([f]) => grille(f, FAMILLES[f])).join('')}
        <p class="e-aide">Les accessoires se cumulent, quatre au plus. Ce qui est ouvert reste ouvert.</p>
      </div>
      <div data-section="chambre" hidden>
        <div class="cmp-sous-onglets" role="tablist">${CHAMBRE.map(([f, t], i) => `<button type="button" role="tab" data-sous="${f}" aria-selected="${i === 0}">${t}</button>`).join('')}</div>
        ${CHAMBRE.map(([f]) => grille(f, FAMILLES[f])).join('')}
        <p class="e-aide">Cinq objets au plus dans sa chambre ; touche un objet posé pour le retirer.</p>
      </div>
      <div data-section="tour" hidden>
        <ul class="cmp-grille cmp-grille-tour">${TOURS.map((x) => carte('tour', x, false)).join('')}</ul>
        <p class="e-aide">Un tour s'ouvre avec les cœurs, puis s'apprend : regarde sa suite et refais-la une fois sans erreur.</p>
      </div>
      <div data-section="album" hidden>
        <h2 class="cmp-h2">Vignettes <small>${nbVig} sur ${vig.length}</small></h2>
        <ul class="cmp-vignettes">${vig.map((x) => `<li class="${x.ok ? 'ok' : ''}" title="${ech(x.texte)}"><span aria-hidden="true">${x.ok ? x.ico : '🔒'}</span><b>${ech(x.nom)}</b><small>${ech(x.texte)}</small></li>`).join('')}</ul>
        <h2 class="cmp-h2">Photos <small>${vie.souvenirs.length} sur 12</small></h2>
        ${vie.souvenirs.length ? `<ul class="cmp-album">${vie.souvenirs.map((s, i) => `<li><span class="cmp-polaroid">${rendreChambre({ fond: s.fond, objets: s.objets || [] })}${rendre({ taille: 4.2, humeur: 'content', choix: Object.assign({ accessoires: [], aura: 'aucune', motif: 'uni', yeux: 'ronds', nom: '' }, s.choix) })}</span><b>${ech(s.t || 'Sans titre')}</b><small>${ech(s.d)} · ${ech(s.amitie || '')}</small><button type="button" class="e-bouton e-bouton-fin e-bouton-doux" data-envoyer="${i}">Envoyer à Bastien</button></li>`).join('')}</ul>` : '<p class="e-vide">Pas encore de photo : le bouton Photo, en haut, en prend une.</p>'}
      </div>
      <div data-section="carnet" hidden>
        ${journalRecent().length ? `<ul class="cmp-carnet">${journalRecent().map((x) => `<li><span>${ech(x.d)}</span> ${ech(x.t)}</li>`).join('')}</ul>` : '<p class="e-vide">Le carnet se remplira avec ses déblocages, ses tours et vos journées.</p>'}
        ${suivants.length ? `<p class="e-aide">Prochains déblocages : ${suivants.map((t) => `${ech(t.x.nom)} à ${prix(t.x)}`).join(' · ')}.</p>` : '<p class="e-aide">Tout est ouvert.</p>'}
        <label class="e-case"><input type="checkbox" id="cmp-partout" ${n.lire(CLE_PARTOUT, true) !== false ? 'checked' : ''}> Le montrer en bas de mes pages (matières, semaine, jeux)</label>
      </div>`);
    const zone = document.getElementById('vue-eleve');
    // Onglets et sous-onglets.
    const onglets = zone.querySelectorAll('[data-onglet]');
    onglets.forEach((b) => b.addEventListener('click', () => {
      onglets.forEach((x) => x.setAttribute('aria-selected', String(x === b)));
      zone.querySelectorAll('[data-section]').forEach((p) => { p.hidden = p.getAttribute('data-section') !== b.getAttribute('data-onglet'); });
    }));
    zone.querySelectorAll('[data-section]').forEach((sec) => {
      const sous = sec.querySelectorAll('[data-sous]'); if (!sous.length) return;
      const montrer = (f) => { sous.forEach((x) => x.setAttribute('aria-selected', String(x.getAttribute('data-sous') === f))); sec.querySelectorAll('[data-panneau]').forEach((p) => { p.hidden = p.getAttribute('data-panneau') !== f; }); };
      sous.forEach((b) => b.addEventListener('click', () => montrer(b.getAttribute('data-sous'))));
      montrer(sous[0].getAttribute('data-sous'));
    });
    const rafraichir = () => { const v = lireVie(); const sc = document.getElementById('cmp-scene-chambre'); const ch = sc.querySelector('.cmp-chambre'); if (ch) ch.outerHTML = rendreChambre(v.chambre); document.getElementById('cmp-apercu').innerHTML = rendre({ taille: 9, bulle: phraseDuMoment() }); };
    // Apparence et chambre.
    zone.querySelectorAll('[data-famille]').forEach((b) => b.addEventListener('click', async () => {
      const f = b.getAttribute('data-famille'); const id = b.getAttribute('data-id');
      const x = FAMILLES[f].find((y) => y.id === id);
      if (!ouvert(x)) { n.signaler(`« ${x.nom} » s'ouvre à ${prix(x)}.`, 'info'); return; }
      if (f === 'fond' || f === 'objet') {
        let message = '';
        await modifierVie((v) => {
          if (f === 'fond') v.chambre.fond = id;
          else if (v.chambre.objets.includes(id)) v.chambre.objets = v.chambre.objets.filter((o) => o !== id);
          else if (v.chambre.objets.length >= 5) message = 'Cinq objets au plus : retire-en un d\'abord.';
          else v.chambre.objets.push(id);
        });
        if (message) { n.signaler(message, 'info'); return; }
        const v = lireVie();
        zone.querySelectorAll(`[data-famille="${f}"]`).forEach((y) => { const on = f === 'fond' ? v.chambre.fond === y.getAttribute('data-id') : v.chambre.objets.includes(y.getAttribute('data-id')); y.classList.toggle('actif', on); y.setAttribute('aria-pressed', String(on)); });
        rafraichir(); bip('clic'); return;
      }
      const actuel = lireChoix();
      if (f === 'accessoire') {
        const deja = actuel.accessoires.includes(id);
        if (deja) actuel.accessoires = actuel.accessoires.filter((a) => a !== id);
        else { if (actuel.accessoires.length >= 4) { n.signaler('Quatre accessoires au plus : retire-en un d\'abord.', 'info'); return; } actuel.accessoires.push(id); }
      } else actuel[f] = id;
      try { await enregistrer(actuel); } catch (e) { n.signaler(e.message); return; }
      zone.querySelectorAll(`[data-famille="${f}"]`).forEach((y) => { const on = f === 'accessoire' ? actuel.accessoires.includes(y.getAttribute('data-id')) : y.getAttribute('data-id') === id; y.classList.toggle('actif', on); y.setAttribute('aria-pressed', String(on)); });
      rafraichir(); animer(apercu(), 'cmp-saute', phrase('etoile'));
    }));
    // Tours : ouverts par les cœurs, appris par la suite, puis joués.
    zone.querySelectorAll('[data-tour]').forEach((b) => b.addEventListener('click', () => {
      const t = TOURS.find((x) => x.id === b.getAttribute('data-tour'));
      if (!ouvert(t)) { n.signaler(`« ${t.nom} » s'ouvre à ${prix(t)} : occupe-toi de lui chaque jour.`, 'info'); return; }
      if (!tourAppris(t.id)) { apprendre(t.id); return; }
      tour(t.id, apercu());
    }));
    // Les gestes.
    zone.querySelectorAll('[data-geste]').forEach((b) => b.addEventListener('click', () => {
      const g = b.getAttribute('data-geste');
      const ap = document.getElementById('cmp-apercu');
      // Brosser, déjà en cours : chaque appui sur le bouton est un passage de brosse (clavier et tactile).
      if (g === 'brosser' && ap.classList.contains('brossage')) { if (brosser(1)) { ap.classList.remove('brossage'); document.getElementById('cmp-brosse').hidden = true; b.setAttribute('aria-pressed', 'false'); } return; }
      zone.querySelectorAll('[data-geste]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      ap.classList.remove('brossage'); document.getElementById('cmp-brosse').hidden = true;
      if (g === 'caresser') { fermerZone(); caresser(apercu()); return; }
      if (g === 'nourrir') {
        const v = lireVie(); const total = PROVISIONS.reduce((s, p) => s + (v.provisions[p.id] || 0), 0);
        ouvrirZone(total ? `<p class="cmp-menu">${PROVISIONS.map((p) => `<button type="button" class="e-bouton e-bouton-doux" data-prov="${p.id}" ${v.provisions[p.id] ? '' : 'disabled'}><span aria-hidden="true">${p.ico}</span> ${ech(p.nom)} <small>× ${v.provisions[p.id] || 0}</small></button>`).join('')}</p><p class="e-aide">Deux repas par jour comptent pour l'amitié ; il mange jusqu'à quatre. <button type="button" class="e-bouton e-bouton-fin e-bouton-doux" id="cmp-zone-fermer">Fermer</button></p>` : `<p class="cmp-dit">Le garde-manger est vide. ${PROVISIONS.map((p) => `${p.ico} ${p.source}`).join(', ')}.</p><p class="e-aide"><button type="button" class="e-bouton e-bouton-fin e-bouton-doux" id="cmp-zone-fermer">Fermer</button></p>`, 'Nourrir');
        document.querySelectorAll('[data-prov]').forEach((x) => x.addEventListener('click', async () => { const ok = await nourrir(x.getAttribute('data-prov')); if (ok) { const vv = lireVie(); x.querySelector('small').textContent = '× ' + (vv.provisions[x.getAttribute('data-prov')] || 0); if (!vv.provisions[x.getAttribute('data-prov')]) x.disabled = true; } }));
        return;
      }
      if (g === 'jouer') { jouer(); return; }
      if (g === 'brosser') {
        fermerZone(); b.setAttribute('aria-pressed', 'true'); brossage = 0;
        ap.classList.add('brossage'); const jauge = document.getElementById('cmp-brosse'); jauge.hidden = false; document.getElementById('cmp-brosse-jauge').style.width = '0%';
        animer(apercu(), 'cmp-caresse', 'Glisse ton doigt sur moi, ou appuie encore sur Brosser.', 1500);
        return;
      }
      if (g === 'parler') { conversation(); return; }
      if (g === 'photo') {
        ouvrirZone(`<p class="cmp-nom-ligne"><input id="cmp-photo-titre" type="text" maxlength="40" placeholder="Un titre pour la photo (facultatif)" aria-label="Titre de la photo"><button type="button" class="e-bouton" id="cmp-photo-ok">Prendre la photo</button></p><p class="e-aide">La photo garde son allure et sa chambre d'aujourd'hui, dans l'album. <button type="button" class="e-bouton e-bouton-fin e-bouton-doux" id="cmp-zone-fermer">Fermer</button></p>`, 'Photo');
        document.getElementById('cmp-photo-ok').addEventListener('click', async () => { const s = await photographier(document.getElementById('cmp-photo-titre').value); document.getElementById('cmp-zone').innerHTML = `<h3 class="cmp-zone-titre">Photo</h3><p class="cmp-dit">Dans l'album${s.t ? ' : « ' + ech(s.t) + ' »' : ''}.</p><p class="cmp-reponses"><button type="button" class="e-bouton" id="cmp-photo-envoyer">Envoyer à Bastien</button> <button type="button" class="e-bouton e-bouton-doux" id="cmp-zone-fermer">Fermer</button></p>`; document.getElementById('cmp-zone-fermer').addEventListener('click', () => { fermerZone(); vue(); }); document.getElementById('cmp-photo-envoyer').addEventListener('click', async () => { await envoyerPhoto(s); fermerZone(); vue(); }); });
      }
    }));
    // Le brossage au doigt : des passages sur lui.
    const ap = document.getElementById('cmp-apercu'); let dernier = null;
    ap.addEventListener('pointermove', (e) => { if (!ap.classList.contains('brossage') || !(e.buttons || e.pointerType === 'touch')) return; if (dernier && Math.hypot(e.clientX - dernier.x, e.clientY - dernier.y) > 40) { dernier = { x: e.clientX, y: e.clientY }; brosser(1); } else if (!dernier) dernier = { x: e.clientX, y: e.clientY }; });
    ap.addEventListener('pointerup', () => { dernier = null; });
    ap.addEventListener('click', () => { if (ap.classList.contains('brossage')) brosser(1); });
    // Les photos de l'album.
    zone.querySelectorAll('[data-envoyer]').forEach((b) => b.addEventListener('click', async () => { const s = lireVie().souvenirs[Number(b.getAttribute('data-envoyer'))]; if (s) { b.disabled = true; await envoyerPhoto(s); b.textContent = 'Envoyée'; } }));
    const partout = document.getElementById('cmp-partout'); if (partout) partout.addEventListener('change', (ev) => { n.ecrire(CLE_PARTOUT, ev.target.checked); mascotte(['compagnon']); n.signaler(ev.target.checked ? 'Il te suivra sur toutes tes pages.' : 'Il reste sur sa page et sur l\'accueil.', 'info'); });
    verifierMission().then((gagne) => { if (gagne) rafraichir(); });
    document.getElementById('cmp-nom-ok').addEventListener('click', async () => {
      // F115 : le nom est nettoyé et vérifié avant d'être gardé.
      const brut = document.getElementById('cmp-nom').value.trim().replace(/\s+/g, ' ').slice(0, 20);
      if (!/^[\p{L}\p{N} '-]{1,20}$/u.test(brut)) { n.signaler('Un nom de 1 à 20 caractères : lettres, chiffres, espaces et tirets.', 'erreur'); document.getElementById('cmp-nom').focus(); return; }
      const nom = brut;
      const actuel = lireChoix(); actuel.nom = nom;
      try { await enregistrer(actuel); n.signaler(`Il s'appelle ${nom}.`, 'succes'); rafraichir(); } catch (e) { n.signaler(e.message); }
    });
    // Un cœur ou une envie de la veille : les déblocages nouveaux sont signalés une fois.
    marquerVus();
  }

  window.COMPAGNON = { ESPECES, COULEURS, MOTIFS, YEUX, ACCESSOIRES, AURAS, FONDS, OBJETS, TOURS, MISSIONS, STADES, NIVEAUX, PROVISIONS, VIGNETTES, rendre, rendreChambre, vue, reagir, lireChoix, lireVie, amitie, enviesDuJour, phraseDuMoment, humeur, compte, ouvert, prix, deblocagesNouveaux, signalerDeblocages, mascotte, caresser, nourrir, brosser, jouer, apprendre, tour, photographier, verifierMission, vignettes };
})();
