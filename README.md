# sterenncours : Supports de cours de 4ᵉ

Supports pédagogiques préparés pour **Sterenn**, classe de **4ᵉ**, alignés sur le **programme officiel du cycle 4** et couvrant chaque matière à 100 %.

Le niveau d'exigence est celui du programme officiel. Ce qui est adapté, c'est la
**forme** : structure identique d'un document à l'autre, consignes explicites, une idée par bloc, critères de réussite toujours écrits.

## Le portail de cours

Un mini-site autonome, sans serveur ni base de données, dans `site/`.
Après `npm run build`, il s'ouvre depuis **`public/site/index.html`**.

| Code | Espace ouvert |
|---|---|
| `sanka29` | Espace de Sterenn : ses matières, ses leçons, les exercices interactifs, ses progrès et ses badges |
| `babas29` | Espace professeur : le même contenu, plus les attendus officiels, le suivi des 69 leçons et les ressources de pilotage |

Le portail est une **porte d'entrée, pas une protection** : les codes sont dans le
code de la page et restent lisibles par qui ouvre le source. Il sépare deux usages,
il ne protège pas des données sensibles.

Le suivi des acquis est enregistré **dans le navigateur** qui l'a saisi. Il ne part
sur aucun serveur. Les boutons **Exporter** et **Importer** servent à le sauvegarder
et à le transférer d'un appareil à l'autre.

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
**`public/site/index.html`** pour le portail de cours, et
**`public/index.html`** pour le sommaire brut de tous les documents.

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

## Organisation du dépôt

```
00-pilotage/        Synthèse du programme, adaptations, progression, journal de séances
matieres/           Un dossier par matière, un sous-dossier par leçon (les 4 documents)
outils/             Méthodes transversales, cartes de révision, suivi des acquis
site/               Mini-sites interactifs autonomes
theme/              Design system (cours.css) + lexique des blocs
build/              Chaîne Markdown → HTML → PDF (Node, sans framework)
public/             Sortie générée : non versionnée
```

Les conventions de rédaction et de contribution sont dans **`CLAUDE.md`**.
Le lexique des blocs visuels est dans **`theme/README.md`**.
