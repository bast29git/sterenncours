/*
   Lecteur de fiche partagé par les deux espaces (A28) : découpe une fiche sur ses titres de
   niveau 2, la montre une diapositive à la fois, avec les étapes, la jauge, le temps de lecture
   et les boutons précédent et suivant. L'espace de Sterenn y ajoute la mémoire de position et
   les outils de lecture ; l'espace professeur y voit la fiche complète, corrigés inclus.
*/
(function () {
  const ech = (t) => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const ic = (id) => (window.NOYAU && window.NOYAU.ic ? window.NOYAU.ic(id) : `<svg class="ic" aria-hidden="true"><use href="#${id}"/></svg>`);
  const titreCourt = (t) => String(t || '').replace(/^\d+[.)]\s*/, '');

  /** Découpe le HTML d'une fiche en sections, sur ses titres de niveau 2. */
  function decouper(html) {
    const morceaux = String(html || '').split(/(?=<h2 id=")/);
    const sections = [];
    morceaux.forEach((m) => {
      const t = /^<h2 id="([^"]*)">([\s\S]*?)<\/h2>/.exec(m);
      if (t) sections.push({ id: t[1], titre: t[2].replace(/<[^>]+>/g, '').trim(), html: m.slice(t[0].length) });
      else if (m.replace(/<[^>]+>/g, '').trim()) sections.push({ id: 'debut', titre: 'Avant de commencer', html: m, debut: true });
    });
    return sections;
  }

  /**
   * Monte le lecteur en diapositives dans `hote`.
   * o : { sections, position, duree, outilsHtml, surMontrer(k, corps, sections), surTerminer(), surPage(), libelleFin }
   * Renvoie { montrer, avancer, reculer, aller, courant, sections } ; l'objet est aussi posé sur hote.__diapo.
   */
  function monter(hote, o) {
    const sections = o.sections;
    let i = Math.min(sections.length - 1, Math.max(0, Number(o.position) || 0));
    // C13 : le temps de lecture, par diapositive et en tout, d'après les mots (110 mots par minute).
    const mots = (html) => (html.replace(/<[^>]+>/g, ' ').match(/[\p{L}\p{N}]+/gu) || []).length;
    const minutes = sections.map((x) => Math.max(1, Math.round(mots(x.html) / 110)));
    const totalMinutes = minutes.reduce((a, b) => a + b, 0);

    hote.innerHTML = `<section class="e-diapo" aria-label="Fiche en diapositives">
      <div class="e-diapo-barre">
        <ol class="e-diapo-etapes" id="e-diapo-etapes">${sections.map((x, k) => `<li><button type="button" data-diapo="${k}" title="${ech(x.titre)}"><b>${k + 1}</b><span>${ech(titreCourt(x.titre))}</span></button></li>`).join('')}</ol>
        <button type="button" class="e-diapo-mode" id="e-mode-page" title="Afficher toute la fiche sur une page">${ic('ic-livre')}<span>Page entière</span></button>
      </div>
      <p class="e-diapo-temps">${ic('ic-horloge')} ${sections.length} diapositives, environ ${totalMinutes} min de lecture en tout${o.duree ? ` · fiche prévue pour ${ech(o.duree)}` : ''}.</p>
      ${o.outilsHtml || ''}
      <div class="e-diapo-jauge" role="progressbar" aria-valuemin="1" aria-valuemax="${sections.length}" aria-valuenow="1" aria-label="Avancement dans la fiche"><i id="e-diapo-jauge"></i></div>
      <article class="e-fiche e-diapo-corps" id="e-diapo-corps" tabindex="-1"></article>
      <div class="e-diapo-pied">
        <button type="button" class="e-bouton e-bouton-doux" id="e-diapo-prec">${ic('ic-gauche')} Précédent</button>
        <span class="e-diapo-compte" id="e-diapo-compte"></span>
        <button type="button" class="e-bouton" id="e-diapo-suiv">Suivant ${ic('ic-droite')}</button>
      </div>
    </section>`;

    const corps = hote.querySelector('#e-diapo-corps');
    const montrer = (k, defiler) => {
      i = Math.min(sections.length - 1, Math.max(0, k));
      const x = sections[i];
      corps.innerHTML = `<h2 id="${ech(x.id)}">${ech(x.titre)}</h2>${x.html}`;
      if (o.surMontrer) { try { o.surMontrer(i, corps, sections); } catch (e) { /* un outil ne bloque pas la lecture */ } }
      hote.querySelectorAll('[data-diapo]').forEach((b) => {
        const actif = Number(b.getAttribute('data-diapo')) === i;
        b.classList.toggle('actif', actif);
        b.classList.toggle('vu', Number(b.getAttribute('data-diapo')) < i);
        if (actif) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
        if (actif) {
          // On fait défiler la liste des étapes seule, jamais la page entière.
          const liste = b.closest('.e-diapo-etapes');
          if (liste) liste.scrollLeft = Math.max(0, b.offsetLeft - liste.clientWidth / 2 + b.offsetWidth / 2);
        }
      });
      hote.querySelector('#e-diapo-jauge').style.width = Math.round(((i + 1) / sections.length) * 100) + '%';
      hote.querySelector('.e-diapo-jauge').setAttribute('aria-valuenow', String(i + 1));
      hote.querySelector('#e-diapo-compte').textContent = `${i + 1} sur ${sections.length} · ${minutes[i]} min`;
      const prec = hote.querySelector('#e-diapo-prec');
      const suiv = hote.querySelector('#e-diapo-suiv');
      prec.disabled = i === 0;
      const dernier = i === sections.length - 1;
      suiv.innerHTML = dernier ? `${ic('ic-coche')} ${o.libelleFin || 'J\'ai terminé la fiche'}` : `Suivant ${ic('ic-droite')}`;
      suiv.classList.toggle('e-bouton-fin', false);
      if (defiler) {
        const haut = hote.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: Math.max(0, haut), behavior: 'smooth' });
        corps.focus({ preventScroll: true });
      }
    };
    hote.querySelectorAll('[data-diapo]').forEach((b) => b.addEventListener('click', () => montrer(Number(b.getAttribute('data-diapo')), true)));
    hote.querySelector('#e-diapo-prec').addEventListener('click', () => montrer(i - 1, true));
    hote.querySelector('#e-diapo-suiv').addEventListener('click', () => {
      if (i === sections.length - 1) { if (o.surTerminer) o.surTerminer(); return; }
      montrer(i + 1, true);
    });
    hote.querySelector('#e-mode-page').addEventListener('click', () => { if (o.surPage) o.surPage(); });
    const api = { montrer, avancer: () => montrer(i + 1, true), reculer: () => montrer(i - 1, true), aller: (k) => montrer(k, true), courant: () => i, sections };
    hote.__diapo = api;
    montrer(i, false);
    return api;
  }

  /* Scripts d'écoute (::: audio) : lecture à voix haute dans la langue du bloc,
     à une vitesse un peu lente la première fois, normale ensuite. Un seul
     script joue à la fois ; un clic sur le bouton actif arrête la lecture. */
  const LANGUES_AUDIO = { en: 'en-GB', es: 'es-ES', fr: 'fr-FR', de: 'de-DE' };
  document.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-ecouter]');
    if (!b) return;
    if (!window.speechSynthesis) { b.disabled = true; b.textContent = 'Lecture indisponible'; return; }
    const tous = () => document.querySelectorAll('[data-ecouter][aria-pressed="true"]').forEach((x) => { x.setAttribute('aria-pressed', 'false'); x.textContent = 'Écouter'; });
    if (b.getAttribute('aria-pressed') === 'true') { speechSynthesis.cancel(); tous(); return; }
    speechSynthesis.cancel(); tous();
    const bloc = b.closest('.bloc-audio');
    const script = bloc && bloc.querySelector('.audio-script');
    const texte = script ? [...script.querySelectorAll('p, li, dt, dd, td')].map((e) => e.textContent.trim()).filter(Boolean).join('. ') : '';
    if (!texte) return;
    const code = b.getAttribute('data-ecouter') || 'fr-FR';
    const u = new SpeechSynthesisUtterance(texte);
    u.lang = code.length === 2 ? (LANGUES_AUDIO[code] || code) : code;
    const voix = speechSynthesis.getVoices().filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith(u.lang.slice(0, 2).toLowerCase()));
    if (voix.length) u.voice = voix.find((v) => v.lang.replace('_', '-') === u.lang) || voix[0];
    const deja = bloc.getAttribute('data-ecoute-faite') === '1';
    u.rate = deja ? 1 : 0.85;
    u.onend = () => { b.setAttribute('aria-pressed', 'false'); b.textContent = 'Écouter'; bloc.setAttribute('data-ecoute-faite', '1'); };
    u.onerror = u.onend;
    b.setAttribute('aria-pressed', 'true'); b.textContent = 'Arrêter';
    speechSynthesis.speak(u);
  });

  window.LECTEUR = { decouper, monter, titreCourt };
})();
