# Attributions — module 3D « Dinosaures » (3d-18)

## Rendu : 100 % procédural

Toutes les créatures, peaux (PBR : albédo + normal map + roughness procéduraux,
écailles / cuir / plumes selon l'espèce), squelettes du « mode sous la peau », le
décor (sol, végétation instanciée, volcan, ciel) et les animations sont **générés
par code** dans `games-3d/3d-18-dinosaures.html`. Aucun asset externe n'est chargé
au runtime en dehors de l'IBL déjà présent dans le repo.

## Environnement (IBL) — déjà présent dans le repo

- `../env/sky_day_1k.hdr` — Poly Haven, **CC0**. Sert uniquement de lumière
  d'ambiance / reflets (PMREM). Chargé de façon best-effort (échec silencieux).

## Assets externes tentés — NON intégrés

- **Queensland Museum — squelette de *Minmi* sp.** (OBJ, **CC BY 4.0**,
  auteur : Queensland Museum, opendata@qm.qld.gov.au). Source déclarée :
  <https://www.data.qld.gov.au/dataset/3d-model-of-the-dinosaur-skeleton-of-minmi-sp>.
  **Non intégré** : (1) le fichier référencé par les métadonnées CKAN
  (`http://www.qm.qld.gov.au/microsites/data/3d-models/Minmi/minmi 800k.obj`)
  est **mort** — l'URL renvoie désormais la page d'accueil (SPA) du musée, et
  l'hôte de remplacement `museum.qld.gov.au` renvoie 404 ; (2) l'OBJ annoncé
  faisait **92 Mo**, trop lourd pour une page web et non décimable ici (Blender
  indisponible). Décision : rester **procédural** (mode squelette stylisé maison).

- **Digital Atlas of Ancient Life** (CC0) — non tenté : modèles hébergés sur
  Sketchfab, téléchargement binaire nécessitant une authentification OAuth
  (non « directement téléchargeable »).

En cas de réhébergement futur d'un asset permissif **directement téléchargeable**
et léger, l'ajouter ici (titre, auteur, licence, URL) avant intégration.
