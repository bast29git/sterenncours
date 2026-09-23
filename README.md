# sterenncours — Supports de cours de 4ᵉ

Supports pédagogiques préparés pour **Sterenn**, classe de **4ᵉ**, profil **TSA sans
déficience intellectuelle**, alignés sur le **programme officiel du cycle 4** et sur
le format de **validation des acquis du CNED**.

Le niveau d'exigence est celui du programme officiel. Ce qui est adapté, c'est la
**forme** : structure identique d'un document à l'autre, consignes explicites,
une idée par bloc, critères de réussite toujours écrits.

## Démarrage

```bash
npm install      # une seule fois
npm run build    # Markdown → HTML dans public/
npm run pdf      # HTML → PDF A4 prêts à imprimer dans public/pdf/
npm run all      # les deux
npm run serve    # relire les fiches sur http://localhost:4321
```

## Par où commencer

| Document | Chemin |
|---|---|
| **Synthèse complète du programme de 4ᵉ** | `00-pilotage/synthese-programme-4e.md` |
| **Adaptations TSA — mode d'emploi** | `00-pilotage/adaptations-tsa.md` |
| Progression annuelle | `00-pilotage/progression-annuelle.md` |
| Journal des séances | `00-pilotage/journal-seances/` |

## Les 4 documents de chaque leçon

Toute leçon possède **quatre** documents, jamais moins :

1. **Fiche de cours complète** — théorie, définitions, formules, exemples guidés
2. **Fiche de révision** — synthèse visuelle, mots-clés, pièges à éviter
3. **Exercices corrigés** — énoncés progressifs + corrigés détaillés pas à pas
4. **Grille d'évaluation** — Insuffisant · Fragile · Satisfaisant · Très bien

L'échelle des grilles est celle du **livret scolaire officiel**, celle-là même qui
est convertie en points pour le brevet en fin de 3ᵉ.

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
public/             Sortie générée — non versionnée
```

Les conventions de rédaction et de contribution sont dans **`CLAUDE.md`**.
Le lexique des blocs visuels est dans **`theme/README.md`**.
