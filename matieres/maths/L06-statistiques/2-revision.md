---
type: revision
matiere: maths
lecon: L06
titre: Statistiques : fiche de révision
resume: Tout le chapitre en deux pages : effectifs et fréquences, les trois indicateurs avec leur formule, la médiane dans les deux cas de parité, le choix entre moyenne et médiane, les graphiques trompeurs, les huit pièges et un auto-test de 10 questions.
duree: 15 min
competences:
  - Calculer
  - Représenter
objectifs:
  - Retrouver seule les trois formules
  - Choisir l'indicateur adapté à une question
---

::: plan
1. Le vocabulaire
2. Effectifs et fréquences
3. La moyenne
4. La médiane
5. L'étendue
6. Moyenne ou médiane
7. Les mots-clés
8. Les huit pièges
9. Auto-test de 10 questions
:::

## 1. Le vocabulaire

::: grille
| Mot | Définition |
|---|---|
| **Population** | le groupe étudié |
| **Individu** | un élément de ce groupe |
| **Caractère** | ce que l'on observe |
| **Valeur** | un résultat possible du caractère |
| **Effectif** | le nombre d'individus ayant une valeur donnée |
:::

::: formule-cle
Un caractère **quantitatif** se mesure par un nombre : taille, note, âge.
Un caractère **qualitatif** ne se mesure pas : couleur, sport.
Les trois indicateurs ne s'appliquent qu'aux caractères **quantitatifs**.
:::

## 2. Effectifs et fréquences

::: formule-cle
`fréquence = effectif ÷ effectif total`
`fréquence en % = (effectif ÷ effectif total) × 100`
La somme des fréquences vaut toujours **1**, celle des pourcentages **100 %**.
:::

::: grille
| Note | 8 | 10 | 12 | 14 | 16 | Total |
|---|---|---|---|---|---|---|
| Effectif | 3 | 6 | 8 | 5 | 3 | **25** |
| Fréquence | 0,12 | 0,24 | 0,32 | 0,20 | 0,12 | **1** |
| Effectif cumulé | 3 | 9 | 17 | 22 | 25 | |
:::

::: retenir L'effectif cumulé
Il donne le nombre d'individus dont la valeur est **inférieure ou égale** à celle de la colonne.
Il sert surtout à trouver la médiane sans réécrire toutes les valeurs.
:::

## 3. La moyenne

::: formule-cle
`moyenne = somme des valeurs ÷ nombre de valeurs`

**Moyenne pondérée** : `moyenne = (somme des valeur × effectif) ÷ effectif total`
:::

::: grille
| Étape | Sur la série du tableau |
|---|---|
| 1. Multiplier | `8 × 3`, `10 × 6`, `12 × 8`, `14 × 5`, `16 × 3` |
| 2. Additionner | `24 + 60 + 96 + 70 + 48 = 298` |
| 3. Effectif total | `3 + 6 + 8 + 5 + 3 = 25` |
| 4. Diviser | `298 ÷ 25 = 11,92` |
:::

::: piege Le dénominateur
On divise par l'**effectif total**, `25`, et non par le nombre de valeurs différentes, `5`.
C'est l'erreur la plus fréquente du chapitre.
:::

## 4. La médiane

::: formule-cle
La médiane partage la série **ordonnée** en deux groupes de même effectif.
Si `n` est **impair** : valeur de rang `(n + 1) ÷ 2`.
Si `n` est **pair** : **moyenne** des valeurs de rang `n ÷ 2` et `n ÷ 2 + 1`.
:::

::: grille
| Série | n | Rang | Médiane |
|---|---|---|---|
| 9, 10, 12, 14, 15 | 5, impair | `(5+1) ÷ 2 = 3` | 3ᵉ valeur = **12** |
| 8, 10, 12, 14, 15, 18 | 6, pair | rangs 3 et 4 | `(12 + 14) ÷ 2 = **13**` |
:::

::: retenir Avec les effectifs cumulés
`n = 25`, rang `13`. Le cumul passe de 9 à 17 dans la colonne de la note 12 : la médiane vaut **12**.
:::

::: piege La médiane n'est pas au milieu de l'échelle
Elle est au milieu des **individus**. Sur 0, 1, 2, 3, 100, la médiane vaut **2**, pas 50.
:::

## 5. L'étendue

::: formule-cle
`étendue = valeur la plus grande − valeur la plus petite`
Sur la série du tableau : `16 − 8 = 8`.
C'est une **différence**, pas un intervalle : on écrit `8`, jamais « de 8 à 16 ».
:::

## 6. Moyenne ou médiane

::: grille
| | **Moyenne** | **Médiane** |
|---|---|---|
| Utilise | **toutes** les valeurs | seulement le **rang** |
| Sensible aux extrêmes | **oui** | **non** |
| À privilégier quand | les valeurs sont regroupées | il y a des valeurs très éloignées |
:::

::: formule-cle
Salaires : `1500, 1600, 1600, 1700, 1800, 12000`.
Moyenne : `20200 ÷ 6 ≈ 3367`. Médiane : `(1600 + 1700) ÷ 2 = 1650`.
Cinq personnes sur six gagnent **moins** que la moyenne : la médiane décrit mieux la situation ordinaire.
:::

::: retenir Les graphiques trompeurs
1. L'axe vertical part-il de **zéro** ?
2. Les graduations sont-elles **régulières** ?
3. Le dessin montre-t-il des **nombres** ou des **surfaces** ?
Angle d'un secteur : `angle = (effectif ÷ effectif total) × 360°`.
:::

## 7. Les mots-clés

::: motscles
- Population
- Individu
- Caractère
- Quantitatif / qualitatif
- Effectif
- Effectif total
- Effectif cumulé
- Fréquence
- Moyenne
- Moyenne pondérée
- Médiane
- Étendue
- Dispersion
- Diagramme en bâtons
- Diagramme circulaire
- Histogramme
:::

## 8. Les huit pièges

::: piege 1. Le dénominateur de la moyenne pondérée
On divise par l'**effectif total**, pas par le nombre de valeurs différentes.
:::

::: piege 2. Valeur et effectif
La première ligne du tableau donne les **valeurs**, la seconde les **effectifs**.
:::

::: piege 3. La médiane sans ranger
Il faut **toujours** ranger la série dans l'ordre croissant d'abord.
:::

::: piege 4. La médiane en effectif pair
C'est la **moyenne des deux valeurs centrales**, pas l'une des deux.
:::

::: piege 5. L'étendue
C'est une **différence**, un seul nombre.
:::

::: piege 6. La somme des fréquences
Elle vaut **1**, ou 100 %. Un autre total signale une erreur.
:::

::: piege 7. La moyenne d'un caractère qualitatif
Elle n'existe pas.
:::

::: piege 8. L'axe qui ne part pas de zéro
Premier réflexe devant un graphique : regarder où commence l'axe vertical.
:::

## 9. Auto-test

Réponds sans regarder la fiche de cours. Les réponses sont juste en dessous.

::: exercice 1 | application | 10 min | ecran
1. Quelle est la différence entre un caractère quantitatif et un caractère qualitatif ?
2. Comment calcule-t-on une fréquence ? Que vaut leur somme ?
3. Donne la formule de la moyenne pondérée.
4. Calcule la moyenne de la série : valeurs 5, 10, 15 avec effectifs 2, 3, 5.
5. Comment trouve-t-on la médiane quand `n` est impair ?
6. Comment la trouve-t-on quand `n` est pair ?
7. Donne la médiane de : 4, 7, 9, 11.
8. Qu'est-ce que l'étendue ?
9. Dans quel cas la médiane est-elle plus honnête que la moyenne ?
10. Quelles trois questions poser devant un graphique ?

::: corrige
1. Le caractère **quantitatif** se mesure par un nombre, comme une taille ou une note. Le caractère **qualitatif** ne se mesure pas, comme une couleur. Les indicateurs du chapitre ne s'appliquent qu'au premier.
2. `fréquence = effectif ÷ effectif total`. Leur somme vaut toujours **1**, soit 100 %.
3. `moyenne = (somme des produits valeur × effectif) ÷ effectif total`.
4. Numérateur : `5 × 2 + 10 × 3 + 15 × 5 = 10 + 30 + 75 = 115`. Effectif total : `2 + 3 + 5 = 10`. Moyenne : `115 ÷ 10 = **11,5**`.
5. On range la série, puis on prend la valeur de rang `(n + 1) ÷ 2`.
6. On range la série, puis on calcule la **moyenne** des valeurs de rang `n ÷ 2` et `n ÷ 2 + 1`.
7. `n = 4`, pair. Rangs 2 et 3 : les valeurs 7 et 9. Médiane : `(7 + 9) ÷ 2 = **8**`.
8. La **différence** entre la plus grande et la plus petite valeur. Elle mesure la dispersion et ignore tout ce qui est entre les deux.
9. Quand la série contient quelques valeurs **très éloignées** des autres, qui tirent la moyenne sans représenter le groupe.
10. L'axe vertical part-il de zéro ? Les graduations sont-elles régulières ? Le dessin montre-t-il des nombres ou des surfaces ?
:::
:::

::: cocher
- Je calcule une moyenne pondérée en divisant par l'effectif total
- Je trouve une médiane dans les deux cas de parité
- Je sais dire quand la médiane est plus honnête que la moyenne
- J'ai eu au moins 8 bonnes réponses sur 10 à l'auto-test
:::
