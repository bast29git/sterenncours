/**
 * Messagerie : ce qui est commun aux deux espaces.
 *
 * Émojis, mise en forme légère du texte, réactions animées, fils par matière.
 * Chaque option obéit à un réglage du professeur (N.reglage) : quand elle est
 * coupée, le texte reste du texte simple et les messages gardent leur place.
 */
(function () {
  'use strict';
  const N = window.NOYAU;

  const EMOJIS = [
    { g: 'Humeurs', l: ['🙂', '😀', '😄', '😅', '😌', '🤔', '😮', '😴', '😢', '😤', '🥳', '😎'] },
    { g: 'Gestes', l: ['👍', '👏', '🙌', '🤝', '💪', '✌️', '🙏', '👀', '✍️', '🫶', '👋', '🤞'] },
    { g: 'Cœurs et étoiles', l: ['❤️', '💜', '💙', '💚', '⭐', '🌟', '✨', '🎉', '🏆', '🎯', '🔥', '💎'] },
    { g: 'École', l: ['📗', '📘', '📐', '✏️', '🖍️', '📝', '🔬', '🧪', '🧮', '🗺️', '🎨', '🎧'] },
    { g: 'Ses univers', l: ['🌌', '🌿', '🍵', '📜', '🦊', '🐉', '🌸', '🍡', '🏮', '⛩️', '🎑', '🖌️'] },
  ];
  /* C57 : six autocollants d'opale, dessinés dans la charte, en plus des émojis. Le serveur connaît la même liste. */
  const AUTOCOLLANTS = {
    ':opale-bravo:': { nom: 'Bravo', bouche: 'M24 36q8 7 16 0', extra: '<path d="M32 4l2.2 5.4 5.8.5-4.4 3.8 1.3 5.7L32 16.4l-4.9 3 1.3-5.7L24 9.9l5.8-.5Z" fill="#FFD36A"/>' },
    ':opale-coeur:': { nom: 'Cœur', bouche: 'M25 35q7 6 14 0', extra: '<path d="M47 8c3-3 8-1 8 3 0 4-8 9-8 9s-8-5-8-9c0-4 5-6 8-3Z" fill="#E8608E"/>' },
    ':opale-idee:': { nom: 'Idée', bouche: 'M27 37h10', extra: '<circle cx="49" cy="10" r="5" fill="#FFE07A"/><path d="M46 17h6" stroke="#0b1a3a" stroke-width="2"/>' },
    ':opale-etoile:': { nom: 'Étoile', bouche: 'M26 36q6 5 12 0', extra: '<path d="M50 2l1.8 4.4 4.7.4-3.6 3.1 1.1 4.6L50 12l-4 2.5 1.1-4.6-3.6-3.1 4.7-.4Z" fill="#FFD36A"/>' },
    ':opale-rire:': { nom: 'Rire', bouche: 'M23 34q9 12 18 0Z', extra: '' },
    ':opale-force:': { nom: 'Force', bouche: 'M26 37q6 -3 12 0', extra: '<path d="M44 12l6-4 6 4v6l-6 4-6-4Z" fill="#2BB5A0"/>' },
  };
  let nAuto = 0;
  function rendreReaction(e, taille) {
    const a = AUTOCOLLANTS[e]; if (!a) return N.ech(e);
    nAuto += 1; const g = 'auto-g' + nAuto; const t = taille || 22;
    return `<svg class="e-autocollant" width="${t}" height="${t}" viewBox="0 0 64 64" role="img" aria-label="Autocollant ${a.nom}"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7FF0C8"/><stop offset=".45" stop-color="#2BB5A0"/><stop offset="1" stop-color="#C79CE6"/></linearGradient></defs><path d="M32 8 52 26 32 60 12 26Z" fill="url(#${g})"/><path d="M12 26h40L32 34Z" fill="#fff" opacity=".35"/><circle cx="26" cy="30" r="2.6" fill="#0b1a3a"/><circle cx="38" cy="30" r="2.6" fill="#0b1a3a"/><path d="${a.bouche}" stroke="#0b1a3a" stroke-width="2.2" fill="${a.bouche.endsWith('Z') ? '#0b1a3a' : 'none'}" stroke-linecap="round"/>${a.extra}</svg>`;
  }
  const libelleReaction = (e) => (AUTOCOLLANTS[e] ? 'autocollant ' + AUTOCOLLANTS[e].nom : e);
  const REACTIONS = ['👍', '❤️', '🎉', '👏', '😂', '🤔', '💪', '⭐'].concat(Object.keys(AUTOCOLLANTS));

  /** Mise en forme légère : **gras**, *italique*, _italique_, lignes « - » en liste. */
  function formater(texte, actif) {
    const lignes = N.ech(texte).split('\n');
    if (!actif) return lignes.join('<br>');
    const sortie = [];
    let liste = [];
    const vider = () => { if (liste.length) { sortie.push('<ul>' + liste.map((x) => `<li>${x}</li>`).join('') + '</ul>'); liste = []; } };
    const inline = (t) => t
      .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>')
      .replace(/(^|[\s(])_([^_\n]+)_(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>');
    for (const l of lignes) {
      const m = /^\s*[-•]\s+(.+)$/.exec(l);
      if (m) { liste.push(inline(m[1])); continue; }
      vider();
      sortie.push(inline(l));
    }
    vider();
    return sortie.join('<br>').replace(/<br><ul>/g, '<ul>').replace(/<\/ul><br>/g, '</ul>');
  }

  /** Le fil d'un message : sa colonne, sinon la matière devinée dans son contexte. */
  function filDe(m) {
    if (m.fil) return m.fil;
    if (!m.contexte) return null;
    const c = String(m.contexte).toLowerCase();
    const mat = (window.PROGRAMME ? PROGRAMME.matieres : []).find((x) => c.indexOf(x.nom.toLowerCase()) === 0);
    return mat ? mat.id : null;
  }

  /** Barre des fils : Tout, puis chaque matière qui a des messages. */
  function barreFils(messages, actif, classe) {
    if (!N.reglage('fils')) return '';
    const comptes = {};
    messages.forEach((m) => { const f = filDe(m); if (f) comptes[f] = (comptes[f] || 0) + 1; });
    const mats = (window.PROGRAMME ? PROGRAMME.matieres : []).filter((x) => comptes[x.id]);
    const puce = (id, txt, n) => `<button type="button" class="${actif === id ? 'actif' : ''}" data-fil="${id || ''}">${txt}${n ? `<b>${n}</b>` : ''}</button>`;
    return `<div class="${classe}" role="tablist" aria-label="Fils de discussion">
      ${puce(null, 'Tout', messages.length)}
      ${mats.map((x) => puce(x.id, x.icone + ' ' + N.ech(x.nom), comptes[x.id])).join('')}
    </div>`;
  }
  const filtrer = (messages, fil) => (fil ? messages.filter((m) => filDe(m) === fil) : messages);

  /** Les réactions d'un message et le bouton pour en ajouter une. */
  function reactionsHTML(m, moiRole, classe) {
    if (!N.reglage('reactions')) return '';
    const r = m.reactions || {};
    const puces = Object.keys(r).map((e) => {
      const mienne = r[e].indexOf(moiRole) !== -1;
      const qui = r[e].map((a) => (a === 'eleve' ? 'Sterenn' : 'Bastien')).join(' et ');
      return `<button type="button" class="${classe}-puce ${mienne ? 'mienne' : ''}" data-reagir="${m.id}" data-emoji="${e}" title="${qui}" aria-label="${libelleReaction(e)} par ${qui}${mienne ? ', retirer' : ''}"><span>${rendreReaction(e)}</span>${r[e].length > 1 ? `<b>${r[e].length}</b>` : ''}</button>`;
    }).join('');
    return `<div class="${classe}">${puces}
      <button type="button" class="${classe}-plus" data-reagir-menu="${m.id}" aria-label="Réagir à ce message" aria-expanded="false">${N.ic('ic-emoji')}</button>
      <div class="${classe}-menu" data-menu="${m.id}" hidden>${REACTIONS.map((e) => `<button type="button" data-reagir="${m.id}" data-emoji="${e}" aria-label="Réagir ${libelleReaction(e)}" title="${libelleReaction(e)}">${rendreReaction(e)}</button>`).join('')}</div>
    </div>`;
  }

  /** Branche les réactions d'une zone. `apres(reactions, id)` reçoit la mise à jour. */
  function brancherReactions(zone, apres) {
    zone.addEventListener('click', async (ev) => {
      const menu = ev.target.closest('[data-reagir-menu]');
      if (menu) {
        const id = menu.getAttribute('data-reagir-menu');
        const boite = zone.querySelector(`[data-menu="${id}"]`);
        zone.querySelectorAll('[data-menu]').forEach((b) => { if (b !== boite) b.hidden = true; });
        boite.hidden = !boite.hidden;
        menu.setAttribute('aria-expanded', String(!boite.hidden));
        return;
      }
      const b = ev.target.closest('[data-reagir]');
      if (!b) return;
      const id = b.getAttribute('data-reagir');
      const emoji = b.getAttribute('data-emoji');
      const boite = zone.querySelector(`[data-menu="${id}"]`); if (boite) boite.hidden = true;
      try {
        const d = await N.api(`/messages/${id}/reaction`, { method: 'POST', body: JSON.stringify({ emoji }) });
        if (d.ajoutee) eclat(b, emoji);
        apres(d.reactions, id);
      } catch (e) { N.signaler(e.message); }
    });
  }

  /** L'éclat : l'émoji jaillit de la puce, puis s'efface. Sans mouvement réduit. */
  function eclat(depuis, emoji) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = depuis.getBoundingClientRect();
    for (let i = 0; i < 6; i += 1) {
      const s = document.createElement('span');
      s.className = 'm-eclat'; s.textContent = emoji; s.setAttribute('aria-hidden', 'true');
      s.style.left = (r.left + r.width / 2) + 'px'; s.style.top = (r.top + r.height / 2) + 'px';
      s.style.setProperty('--dx', (Math.random() * 120 - 60).toFixed(0) + 'px');
      s.style.setProperty('--dy', (-60 - Math.random() * 80).toFixed(0) + 'px');
      s.style.animationDelay = (i * 40) + 'ms';
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1100);
    }
  }

  /** Sélecteur d'émojis par groupes. */
  function selecteurEmojis(classe) {
    return EMOJIS.map((g) => `<p class="${classe}-groupe">${N.ech(g.g)}</p><div class="${classe}-grille">${g.l.map((e) => `<button type="button" data-emoji-insere="${e}" aria-label="${e}">${e}</button>`).join('')}</div>`).join('');
  }

  /** Insère du texte à la position du curseur d'un champ. */
  function inserer(champ, avant, apres) {
    const d = champ.selectionStart, f = champ.selectionEnd;
    const sel = champ.value.slice(d, f);
    champ.value = champ.value.slice(0, d) + avant + sel + (apres || '') + champ.value.slice(f);
    const pos = d + avant.length + sel.length;
    champ.setSelectionRange(pos, pos);
    champ.dispatchEvent(new Event('input'));
    champ.focus();
  }

  /** Barre de mise en forme : gras, italique, liste. Seulement si le réglage l'autorise. */
  function barreFormatage(classe) {
    if (!N.reglage('formatage')) return '';
    return `<div class="${classe}" role="toolbar" aria-label="Mise en forme">
      <button type="button" data-format="gras" title="Gras : **mot**" aria-label="Gras"><b>G</b></button>
      <button type="button" data-format="italique" title="Italique : *mot*" aria-label="Italique"><i>I</i></button>
      <button type="button" data-format="liste" title="Liste : une ligne commençant par un tiret" aria-label="Liste">• Liste</button>
    </div>`;
  }
  function brancherFormatage(zone, champ) {
    zone.querySelectorAll('[data-format]').forEach((b) => b.addEventListener('click', () => {
      const f = b.getAttribute('data-format');
      if (f === 'gras') inserer(champ, '**', '**');
      else if (f === 'italique') inserer(champ, '*', '*');
      else inserer(champ, (champ.value && !/\n$/.test(champ.value.slice(0, champ.selectionStart)) && champ.selectionStart ? '\n' : '') + '- ', '');
    }));
  }

  window.MESSAGERIE = { EMOJIS, REACTIONS, AUTOCOLLANTS, rendreReaction, formater, filDe, barreFils, filtrer, reactionsHTML, brancherReactions, selecteurEmojis, inserer, barreFormatage, brancherFormatage, eclat };
})();
