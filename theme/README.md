# Design system : lexique des blocs

Toute la mise en forme passe par des **conteneurs `:::`**. Aucun style en ligne n'est autorisé dans le Markdown : c'est ce qui garantit qu'une fiche de maths et une fiche d'espagnol se lisent exactement de la même façon.

## Blocs sémantiques

Syntaxe : `::: nom Titre optionnel` … `:::`

| Conteneur | Picto | Libellé affiché | Usage |
|---|---|---|---|
| `objectif` | 🎯 | Objectif | Ce que l'élève saura faire à la fin |
| `plan` | 🧭 | Plan de la fiche | Sommaire, en tête de chaque document |
| `materiel` | 🎒 | Ce dont tu as besoin | Matériel nécessaire |
| `definition` | 📘 | Définition | Une notion, un mot, une propriété |
| `formule` | 🧮 | Formule à connaître | Règle ou formule à mémoriser |
| `exemple` | 💡 | Exemple guidé | Application détaillée pas à pas |
| `piege` | ⚠️ | Piège à éviter | Erreur fréquente, explicitement nommée |
| `retenir` | 🧠 | À retenir | Synthèse de fin de partie |
| `methode` | 🧰 | Méthode pas à pas | Procédure reproductible |
| `aide` | 🆘 | Coup de pouce | Indice, sans donner la réponse |
| `pause` | 🔁 | Pause conseillée | Point d'arrêt sans perte du fil |
| `info` | ℹ️ | Bon à savoir | Complément non exigible |
| `audio en-GB Titre` | 🔊 | Écoute | Script d'écoute lu à voix haute par le navigateur dans la langue donnée (langues vivantes) |

## Blocs de structure

| Conteneur | Effet |
|---|---|
| `::: etapes` + liste ordonnée | Pastilles numérotées colorées |
| `::: motscles` + liste | Étiquettes de mots-clés |
| `::: echelle` + liste | Échelle des 4 niveaux d'évaluation |
| `::: grille` + tableau | Tableau au format grille |
| `::: cartes` + liste de liens | Cartes de navigation |
| `::: cocher` + liste | Cases à cocher d'auto-évaluation |
| `::: formule-cle` | Encadré central pour une formule |
| `::: reponse 5` | 5 lignes vierges à remplir au stylo |
| `::: saut` | Saut de page à l'impression |

## Exercices et corrigés

```markdown
::: exercice 3 | entrainement | 10 min
Énoncé de l'exercice.

::: corrige
Correction détaillée, étape par étape.
:::
:::
```

Niveaux disponibles : `application`, `entrainement`, `approfondissement`.

## Imbrication

Un conteneur qui en contient un autre ouvre avec **plus de deux-points** :

```markdown
:::: methode Rédiger une démonstration
::: etapes
1. Première étape
2. Deuxième étape
:::
::::
```

## Couleurs de matière

Le gabarit place `data-matiere` sur `<html>` d'après le front-matter.
Les couleurs disponibles : `maths`, `francais`, `histoire-geo`, `emc`,
`physique-chimie`, `svt`, `anglais-lv1`, `espagnol-lv2`, `pilotage`.

## Retours à la ligne

Le rendu utilise `breaks: true` : **une ligne écrite est une ligne affichée**.
On n'écrit donc jamais une phrase coupée en deux lignes, et chaque étape d'un
calcul ou d'un corrigé va sur sa propre ligne.

## Règles non négociables

- Aucune information portée par la **couleur seule** : toujours couleur + picto + mot.
- Aucun texte **justifié**.
- Aucun emoji **hors du lexique** ci-dessus.
- Fond **crème**, jamais blanc pur, à l'écran comme à l'impression des blocs.
- Jamais de **phrase coupée** en deux lignes dans le Markdown.
