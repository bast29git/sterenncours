/**
 * Visite guidée de l'espace de Sterenn, menée par Opale : six étapes, un
 * projecteur sur l'élément concerné, une carte qui explique. Se lance depuis
 * l'accueil, depuis Opale, ou à la première connexion ; se mémorise.
 */
(function () {
  'use strict';
  const N = window.NOYAU;
  const ETAPES = [
    { cible: '.e-nav a[href="#/hub"]', titre: 'Aujourd\'hui', texte: 'C\'est ta page d\'accueil. Elle dit ce qu\'on fait à la prochaine séance, et ce que tu as à faire d\'ici là. Tu peux toujours y revenir avec ce bouton.' },
    { cible: '.e-nav a[href="#/matieres"]', titre: 'Mes matières', texte: 'Huit planètes, une par matière. Dans chacune, les leçons s\'ouvrent une à une : la suivante s\'ouvre quand la précédente est validée, ou quand Bastien la met au programme.' },
    { cible: '.e-nav a[href="#/calendrier"]', titre: 'Ma semaine', texte: 'Tes cours du lundi, du mercredi et du vendredi, tes deux temps courts du mardi et du jeudi. Tu peux y prévenir d\'une absence et déplacer un temps perso.' },
    { cible: '.e-nav a[href="#/jeux"]', titre: 'Jeux', texte: 'Trente mondes en 3D et une soixantaine de jeux, tous rattachés à une leçon. Une partie gagnée avec au moins deux étoiles compte comme une série réussie.' },
    { cible: '#e-reussites', titre: 'Mes étoiles', texte: 'Une fiche terminée, une série réussie, un monde gagné : chaque acquis vaut une étoile. Elles ne redescendent jamais. Clique ici pour voir d\'où elles viennent.' },
    { cible: '#e-opale-bouton', titre: 'Opale', texte: 'C\'est moi. Je suis là sur tous les écrans. Je peux t\'expliquer une notion, te donner une piste ou t\'aider à t\'organiser. Je ne donne pas les réponses : c\'est toi qui les trouves.' },
    { cible: '#e-btn-confort', titre: 'Confort de lecture', texte: 'Ce bouton règle la taille du texte, les couleurs, les animations et la lecture à voix haute. Tout est modifiable à tout moment, rien n\'est définitif.' },
  ];
  let i = 0; let voile = null; let carte = null;

  const AVATAR = '<svg class="e-visite-avatar" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="visite-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7FF0C8"/><stop offset=".4" stop-color="#2BB5A0"/><stop offset=".72" stop-color="#2A7FA6"/><stop offset="1" stop-color="#C79CE6"/></linearGradient></defs><path d="M32 6 54 26 32 60 10 26Z" fill="url(#visite-g)"/><path d="M10 26h44L32 34Z" fill="#fff" opacity=".35"/><circle cx="25" cy="32" r="3.2" fill="#0b1a3a"/><circle cx="39" cy="32" r="3.2" fill="#0b1a3a"/><path d="M27 40q5 4 10 0" stroke="#0b1a3a" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';

  function placer() {
    const e = ETAPES[i];
    const el = document.querySelector(e.cible);
    document.querySelectorAll('.e-visite-cible').forEach((x) => x.classList.remove('e-visite-cible'));
    if (el) {
      el.classList.add('e-visite-cible');
      const r = el.getBoundingClientRect();
      voile.style.setProperty('--x', r.left - 6 + 'px'); voile.style.setProperty('--y', r.top - 6 + 'px');
      voile.style.setProperty('--w', r.width + 12 + 'px'); voile.style.setProperty('--h', r.height + 12 + 'px');
      voile.classList.add('avec-cible');
    } else voile.classList.remove('avec-cible');
    carte.innerHTML = `${AVATAR}<div class="e-visite-texte"><p class="e-visite-etape">Étape ${i + 1} sur ${ETAPES.length}</p><h2>${N.ech(e.titre)}</h2><p>${N.ech(e.texte)}</p>
      <div class="e-visite-actions">
        <button type="button" class="e-bouton e-bouton-fin" data-visite="quitter">${i === ETAPES.length - 1 ? 'Fermer' : 'Arrêter la visite'}</button>
        ${i > 0 ? '<button type="button" class="e-bouton e-bouton-doux" data-visite="prec">Précédent</button>' : ''}
        ${i < ETAPES.length - 1 ? '<button type="button" class="e-bouton" data-visite="suiv">Suivant</button>' : '<button type="button" class="e-bouton" data-visite="fin">J\'ai tout vu</button>'}
      </div></div>`;
    // La carte se place sous la cible quand il y a de la place, sinon au centre.
    const r = el ? el.getBoundingClientRect() : null;
    const bas = r && r.bottom + 260 < window.innerHeight;
    carte.style.top = r && bas ? r.bottom + 14 + 'px' : '';
    carte.classList.toggle('centree', !(r && bas));
    carte.querySelector('[data-visite="suiv"], [data-visite="fin"]').focus();
  }
  async function fin(terminee) {
    document.removeEventListener('keydown', clavier);
    window.removeEventListener('resize', placer);
    document.querySelectorAll('.e-visite-cible').forEach((x) => x.classList.remove('e-visite-cible'));
    if (voile) voile.remove(); if (carte) carte.remove();
    voile = carte = null;
    try { await N.enregistrerProfil('moi.visite_faite', terminee ? new Date().toISOString() : 'interrompue'); } catch (e) { /* sans importance */ }
    if (terminee) N.signaler('Visite terminée. Tu peux la relancer depuis Opale.', 'succes');
  }
  function clavier(ev) {
    if (ev.key === 'Escape') fin(false);
    if (ev.key === 'ArrowRight' && i < ETAPES.length - 1) { i += 1; placer(); }
    if (ev.key === 'ArrowLeft' && i > 0) { i -= 1; placer(); }
  }
  function lancer(depuis) {
    if (voile) return;
    i = Number(depuis) || 0;
    if (location.hash !== '#/hub' && location.hash !== '#/' && location.hash !== '') { location.hash = '#/hub'; }
    voile = document.createElement('div'); voile.className = 'e-visite-voile'; voile.setAttribute('aria-hidden', 'true');
    carte = document.createElement('section'); carte.className = 'e-visite-carte'; carte.setAttribute('role', 'dialog'); carte.setAttribute('aria-label', 'Visite guidée');
    document.body.append(voile, carte);
    carte.addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-visite]'); if (!b) return;
      const a = b.getAttribute('data-visite');
      if (a === 'suiv') { i += 1; placer(); } else if (a === 'prec') { i -= 1; placer(); } else fin(a === 'fin');
    });
    document.addEventListener('keydown', clavier);
    window.addEventListener('resize', placer);
    setTimeout(placer, 350);
  }
  window.VISITE = { lancer, ETAPES };
})();
