/* ============================================================================
 * scan.js : scanner un document avec l'appareil photo, dans les deux espaces.
 *
 * Une ou plusieurs pages photographiées, redressées en niveaux de gris avec un
 * contraste étiré (le papier devient blanc, l'écriture reste nette), puis
 * assemblées en un seul fichier : un JPEG pour une page, un PDF pour plusieurs.
 * Le PDF est écrit ici même, sans bibliothèque : chaque page est une image
 * JPEG posée sur une page A4. Tout se passe dans le navigateur ; seul le
 * fichier final part vers /api/fichiers, par la messagerie.
 *
 *   window.SCAN.ouvrir({ surFini(file) })
 * ========================================================================== */
(function () {
  const N = window.NOYAU;
  const COTE_MAX = 1600;
  const QUALITE = 0.86;

  /** Charge une image depuis un fichier, en respectant l'orientation du téléphone quand le navigateur le sait. */
  function lireImage(fichier) {
    return new Promise((resoudre, rejeter) => {
      if (window.createImageBitmap) {
        window.createImageBitmap(fichier, { imageOrientation: 'from-image' }).then(resoudre).catch(() => lireImageClassique(fichier).then(resoudre, rejeter));
      } else lireImageClassique(fichier).then(resoudre, rejeter);
    });
  }
  function lireImageClassique(fichier) {
    return new Promise((resoudre, rejeter) => {
      const url = URL.createObjectURL(fichier);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resoudre(img); };
      img.onerror = () => { URL.revokeObjectURL(url); rejeter(new Error('Image illisible.')); };
      img.src = url;
    });
  }

  /** La page « scannée » : réduite, en niveaux de gris, contraste étiré entre le 2e et le 98e centile. */
  function traiter(image, couleur) {
    const w = image.width || image.naturalWidth; const h = image.height || image.naturalHeight;
    const k = Math.min(1, COTE_MAX / Math.max(w, h));
    const c = document.createElement('canvas');
    c.width = Math.round(w * k); c.height = Math.round(h * k);
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(image, 0, 0, c.width, c.height);
    const d = ctx.getImageData(0, 0, c.width, c.height);
    const px = d.data;
    const histo = new Uint32Array(256);
    const n = px.length / 4;
    for (let i = 0; i < px.length; i += 4) {
      const l = (px[i] * 299 + px[i + 1] * 587 + px[i + 2] * 114) / 1000;
      histo[Math.round(l)] += 1;
    }
    // Le papier : le niveau atteint par 95 % des pixels. L'encre : le 1er centile, ou
    // au moins 120 niveaux sous le papier, pour qu'un texte pâle devienne franc.
    let bas = 0; let haut = 255; let cumul = 0;
    for (let v = 0; v < 256; v += 1) { cumul += histo[v]; if (cumul >= n * 0.01) { bas = v; break; } }
    cumul = 0;
    for (let v = 0; v < 256; v += 1) { cumul += histo[v]; if (cumul >= n * 0.95) { haut = v; break; } }
    if (haut - bas < 120) bas = Math.max(0, haut - 120);
    const blanc = Math.max(bas + 40, haut * 0.97);
    const etendue = Math.max(1, blanc - bas);
    for (let i = 0; i < px.length; i += 4) {
      if (couleur) {
        for (let j = 0; j < 3; j += 1) px[i + j] = Math.max(0, Math.min(255, Math.round((px[i + j] - bas) * 255 / etendue)));
      } else {
        const l = (px[i] * 299 + px[i + 1] * 587 + px[i + 2] * 114) / 1000;
        const v = Math.max(0, Math.min(255, Math.round((l - bas) * 255 / etendue)));
        px[i] = v; px[i + 1] = v; px[i + 2] = v;
      }
    }
    ctx.putImageData(d, 0, 0);
    return c;
  }

  const enBlob = (canvas) => new Promise((resoudre) => canvas.toBlob(resoudre, 'image/jpeg', QUALITE));

  /** Un PDF à partir de pages JPEG : une image par page A4, avec des marges. */
  async function pdfDepuis(pages) {
    const A4 = [595.28, 841.89]; const marge = 24;
    const octets = []; let position = 0; const offsets = [];
    const ecrire = (s) => { const b = typeof s === 'string' ? new window.TextEncoder().encode(s) : s; octets.push(b); position += b.length; };
    const objet = (id, tete, corps) => { offsets[id] = position; ecrire(`${id} 0 obj\n${tete}`); if (corps) { ecrire(corps); } ecrire('\nendobj\n'); };
    ecrire('%PDF-1.4\n%âãÏÓ\n');
    const nb = pages.length;
    // 1 catalogue, 2 pages, puis par page : 3 objets (page, contenu, image)
    objet(1, '<< /Type /Catalog /Pages 2 0 R >>');
    const idsPages = pages.map((_, i) => 3 + i * 3);
    objet(2, `<< /Type /Pages /Kids [${idsPages.map((x) => x + ' 0 R').join(' ')}] /Count ${nb} >>`);
    for (let i = 0; i < nb; i += 1) {
      const p = pages[i]; const idPage = 3 + i * 3; const idContenu = idPage + 1; const idImage = idPage + 2;
      const paysage = p.largeur > p.hauteur;
      const [pw, ph] = paysage ? [A4[1], A4[0]] : A4;
      const echelle = Math.min((pw - 2 * marge) / p.largeur, (ph - 2 * marge) / p.hauteur);
      const iw = p.largeur * echelle; const ih = p.hauteur * echelle;
      const x = (pw - iw) / 2; const y = (ph - ih) / 2;
      const flux = `q ${iw.toFixed(2)} 0 0 ${ih.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm /Im${i} Do Q`;
      objet(idPage, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pw.toFixed(2)} ${ph.toFixed(2)}] /Resources << /XObject << /Im${i} ${idImage} 0 R >> >> /Contents ${idContenu} 0 R >>`);
      objet(idContenu, `<< /Length ${flux.length} >>\nstream\n${flux}\nendstream`);
      const donnees = new Uint8Array(await p.blob.arrayBuffer());
      offsets[idImage] = position;
      ecrire(`${idImage} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${p.largeur} /Height ${p.hauteur} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${donnees.length} >>\nstream\n`);
      ecrire(donnees); ecrire('\nendstream\nendobj\n');
    }
    const total = 3 + nb * 3;
    const xref = position;
    let table = `xref\n0 ${total}\n0000000000 65535 f \n`;
    for (let id = 1; id < total; id += 1) table += String(offsets[id]).padStart(10, '0') + ' 00000 n \n';
    ecrire(table);
    ecrire(`trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
    return new Blob(octets, { type: 'application/pdf' });
  }

  function ouvrir(o) {
    const options = o || {};
    const pages = []; let couleur = false; let occupe = false;
    const voile = document.createElement('div');
    voile.className = 'scan-voile';
    voile.innerHTML = `<div class="scan-boite" role="dialog" aria-modal="true" aria-labelledby="scan-titre">
      <div class="scan-tete"><h2 id="scan-titre">Scanner un document</h2><button type="button" class="scan-fermer" aria-label="Fermer">✕</button></div>
      <p class="scan-aide">Prends chaque page en photo, bien à plat, sans ombre sur le texte. Le scan rend le papier blanc et l'écriture nette. Plusieurs pages font un seul PDF.</p>
      <div class="scan-actions">
        <button type="button" class="e-bouton" data-scan="photo">Prendre une page en photo</button>
        <button type="button" class="e-bouton e-bouton-doux" data-scan="choisir">Choisir des images</button>
        <label class="scan-case"><input type="checkbox" data-scan="couleur"> Garder les couleurs</label>
      </div>
      <ol class="scan-pages" aria-label="Pages scannées"></ol>
      <p class="scan-etat" role="status"></p>
      <div class="scan-pied">
        <button type="button" class="e-bouton e-bouton-fin" data-scan="annuler">Annuler</button>
        <button type="button" class="e-bouton" data-scan="fini" disabled>Terminer</button>
      </div>
      <input type="file" accept="image/*" capture="environment" hidden data-scan="entree-photo">
      <input type="file" accept="image/*" multiple hidden data-scan="entree-choisir">
    </div>`;
    document.body.appendChild(voile);
    const q = (s) => voile.querySelector(s);
    const liberer = N && N.piegerFocus ? N.piegerFocus(q('.scan-boite'), document.activeElement) : () => {};
    const fermer = () => { liberer(); voile.remove(); document.removeEventListener('keydown', surTouche); };
    const surTouche = (ev) => { if (ev.key === 'Escape') fermer(); };
    document.addEventListener('keydown', surTouche);
    const etat = (t) => { q('.scan-etat').textContent = t || ''; };
    const rendre = () => {
      q('.scan-pages').innerHTML = pages.map((p, i) => `<li><img src="${p.url}" alt="Page ${i + 1}"><span>Page ${i + 1}</span>
        <span class="scan-outils"><button type="button" data-monter="${i}" aria-label="Monter la page ${i + 1}" ${i === 0 ? 'disabled' : ''}>↑</button><button type="button" data-retirer="${i}" aria-label="Retirer la page ${i + 1}">✕</button></span></li>`).join('');
      q('[data-scan="fini"]').disabled = !pages.length || occupe;
      q('[data-scan="fini"]').textContent = pages.length > 1 ? `Terminer : ${pages.length} pages en un PDF` : 'Terminer';
      q('.scan-pages').querySelectorAll('[data-retirer]').forEach((b) => b.addEventListener('click', () => { const i = Number(b.getAttribute('data-retirer')); URL.revokeObjectURL(pages[i].url); pages.splice(i, 1); rendre(); }));
      q('.scan-pages').querySelectorAll('[data-monter]').forEach((b) => b.addEventListener('click', () => { const i = Number(b.getAttribute('data-monter')); if (i > 0) { const t = pages[i - 1]; pages[i - 1] = pages[i]; pages[i] = t; rendre(); } }));
    };
    const ajouter = async (fichiers) => {
      occupe = true; rendre();
      for (const f of fichiers) {
        try {
          etat(`Traitement de « ${f.name} »…`);
          const img = await lireImage(f);
          const canvas = traiter(img, couleur);
          const blob = await enBlob(canvas);
          pages.push({ blob, largeur: canvas.width, hauteur: canvas.height, url: URL.createObjectURL(blob) });
        } catch (e) { etat('Cette image n\'a pas pu être lue.'); }
      }
      occupe = false; etat(pages.length ? `${pages.length} page(s) prête(s).` : ''); rendre();
    };
    q('[data-scan="photo"]').addEventListener('click', () => q('[data-scan="entree-photo"]').click());
    q('[data-scan="choisir"]').addEventListener('click', () => q('[data-scan="entree-choisir"]').click());
    q('[data-scan="couleur"]').addEventListener('change', (ev) => { couleur = ev.target.checked; });
    ['entree-photo', 'entree-choisir'].forEach((k) => q(`[data-scan="${k}"]`).addEventListener('change', (ev) => { if (ev.target.files && ev.target.files.length) ajouter([...ev.target.files]); ev.target.value = ''; }));
    q('.scan-fermer').addEventListener('click', fermer);
    q('[data-scan="annuler"]').addEventListener('click', fermer);
    q('[data-scan="fini"]').addEventListener('click', async () => {
      if (!pages.length || occupe) return;
      occupe = true; rendre(); etat('Assemblage…');
      const horodatage = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
      let fichier;
      try {
        if (pages.length === 1) fichier = new File([pages[0].blob], `scan-${horodatage}.jpg`, { type: 'image/jpeg' });
        else fichier = new File([await pdfDepuis(pages)], `scan-${horodatage}.pdf`, { type: 'application/pdf' });
      } catch (e) { occupe = false; etat('Le fichier n\'a pas pu être assemblé.'); rendre(); return; }
      pages.forEach((p) => URL.revokeObjectURL(p.url));
      fermer();
      if (options.surFini) options.surFini(fichier);
    });
    rendre();
    q('[data-scan="photo"]').focus();
  }

  window.SCAN = { ouvrir, traiter, pdfDepuis };
})();
