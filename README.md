# sterenncours : Supports de cours de 4ᵉ

Supports pédagogiques préparés pour **Sterenn**, classe de **4ᵉ**, alignés sur le **programme officiel du cycle 4** et couvrant chaque matière à 100 %.

Le niveau d'exigence est celui du programme officiel. Ce qui est adapté, c'est la
**forme** : structure identique d'un document à l'autre, consignes explicites, une idée par bloc, critères de réussite toujours écrits.

## Le portail de cours

Un site autonome, sans serveur ni base de données, dans `site/`.
Après `npm run build`, il est **la racine de `public/`** : on l'ouvre depuis
**`public/index.html`**. Les cours s'y lisent **directement dans la page**,
sans avoir à ouvrir un PDF, et chaque matière propose en plus son dossier
complet en téléchargement.

Deux espaces, deux philosophies :

| Code | Espace | Ce qu'on y fait |
|---|---|---|
| `babas29` | **Back-office professeur** | Le quotidien d'abord : la séance du jour, le planning de la semaine, ce que Sterenn a déposé, les échanges, le suivi des acquis. Le programme et les cours sont des **ressources**, pas le centre de l'écran. |
| `sanka29` | **Espace de Sterenn** | Une action principale par écran : ce qu'on fait aujourd'hui, ce qu'il y a à faire ensuite, mes matières, mon travail à envoyer, mes messages, mes progrès. |

**La vérification des codes se fait côté serveur** (Worker Cloudflare) : ils ne sont
pas dans le code envoyé au navigateur. La session tient dans un cookie HttpOnly,
les tentatives sont limitées par adresse, et tout le contenu pédagogique est protégé.

**L'état est partagé** : suivi, résultats, séances, messages et fichiers vivent dans
une base D1. Ce que tu enregistres apparaît immédiatement dans l'espace de Sterenn,
sur n'importe quel appareil.

## Démarrage

```bash
npm install      # une seule fois
npm run build    # Markdown vers HTML dans public/, données du site, dossiers par matière
npm run pdf      # PDF A4 : un dossier complet par matière, le pilotage et les outils
npm run pdf:tout # en plus : un PDF par fiche individuelle
npm run all      # build + pdf
npm run serve    # relire le tout sur http://localhost:4321
```

## Par où commencer

| Document | Chemin |
|---|---|
| **Synthèse complète du programme de 4ᵉ** | `00-pilotage/synthese-programme-4e.md` |
| **Cadre pédagogique et organisation des séances** | `00-pilotage/cadre-pedagogique.md` |
| Progression annuelle | `00-pilotage/progression-annuelle.md` |
| Journal des séances | `00-pilotage/journal-seances/` |

Après un `npm run build`, deux points d'entrée :
**`public/index.html`** pour le portail, et **`public/documents.html`**
pour la liste brute de tous les documents générés.

## Les dossiers complets par matière

`npm run build` assemble aussi, pour chaque matière, **un document unique**
contenant la couverture, les thèmes officiels, les attendus de fin d'année,
puis toutes les leçons avec leurs quatre documents à la suite.
Sortie : `public/dossiers/<matiere>.html` et `public/pdf/dossiers/<matiere>.pdf`.

## Outils complémentaires

| Outil | Ce qu'il sert à faire |
|---|---|
| `outils/methode-analyser-document.md` | Analyser un document en 5 questions (histoire, géo, EMC, français) |
| `outils/methode-developpement-construit.md` | Rédiger 20 lignes organisées et argumentées |
| `outils/methode-probleme-maths.md` | Passer de l'énoncé au calcul en 6 étapes |
| `outils/cartes-revision.md` | Fabriquer et utiliser des cartes de répétition espacée |
| `outils/planificateur-seance.md` | Préparer une séance minutée et prévisible |
| `outils/suivi-acquis.md` | Suivre les 69 leçons et programmer les reprises |

## Les 4 documents de chaque leçon

Toute leçon possède **quatre** documents, jamais moins :

1. **Fiche de cours complète** : théorie, définitions, formules, exemples guidés
2. **Fiche de révision** : synthèse visuelle, mots-clés, pièges à éviter
3. **Exercices corrigés** : énoncés progressifs + corrigés détaillés pas à pas
4. **Grille d'évaluation** : Insuffisant · Fragile · Satisfaisant · Très bien

L'échelle des grilles est celle du **livret scolaire officiel**, celle-là même qui est convertie en points pour le brevet en fin de 3ᵉ.

## Les 8 matières · 69 leçons

| Matière | Dossier | Leçons |
|---|---|---|
| Mathématiques | `matieres/maths/` | 12 |
| Français | `matieres/francais/` | 10 |
| Physique-Chimie | `matieres/physique-chimie/` | 8 |
| SVT | `matieres/svt/` | 7 |
| Histoire-Géographie | `matieres/histoire-geo/` | 12 |
| EMC | `matieres/emc/` | 4 |
| Anglais LV1 | `matieres/anglais-lv1/` | 8 |
| Espagnol LV2 | `matieres/espagnol-lv2/` | 8 |

## Déploiement

`.github/workflows/deploiement.yml` construit le site, génère les PDF et publie
`public/` sur **Cloudflare Pages** à chaque push. Il attend deux secrets de dépôt :

| Secret | Rôle |
|---|---|
| `CLOUDFLARE_API_TOKEN` | jeton d'API avec la permission « Cloudflare Pages : Edit » |
| `CLOUDFLARE_ACCOUNT_ID` | identifiant du compte Cloudflare |

Le nom du projet Pages et la branche de production se règlent en haut du fichier
(`PROJET_PAGES`, `BRANCHE_PAGES`). Si un secret manque ou porte un autre nom, le
workflow s'arrête avec un message qui le dit explicitement.

## Organisation du dépôt

```
00-pilotage/        Synthèse du programme, adaptations, progression, journal de séances
matieres/           Un dossier par matière, un sous-dossier par leçon (les 4 documents)
outils/             Méthodes transversales, cartes de révision, suivi des acquis
site/               Mini-sites interactifs autonomes
theme/              Design system (cours.css) + lexique des blocs
build/              Chaîne Markdown → HTML → PDF (Node, sans framework)
public/             Sortie générée : non versionnée (c'est elle qui est déployée)
```

Les conventions de rédaction et de contribution sont dans **`CLAUDE.md`**.
Le lexique des blocs visuels est dans **`theme/README.md`**.
