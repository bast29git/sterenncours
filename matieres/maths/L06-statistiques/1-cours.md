---
type: cours
matiere: maths
lecon: L06
titre: Statistiques : moyenne, médiane, étendue
resume: Lire et produire des données statistiques : effectifs et fréquences, moyenne simple et pondérée, médiane, étendue, choix de l'indicateur pertinent, et lecture critique d'un graphique.
duree: 3 séances de 45 min
competences:
  - Chercher
  - Modéliser
  - Représenter
  - Calculer
  - Communiquer
objectifs:
  - Construire un tableau d'effectifs et de fréquences
  - Calculer une moyenne simple et une moyenne pondérée
  - Déterminer une médiane dans les deux cas de parité
  - Calculer une étendue
  - Choisir l'indicateur adapté à une question posée
  - Repérer un graphique trompeur
---

::: plan
**Séance 1 : décrire une série**

1. Le vocabulaire des statistiques
2. Effectifs et fréquences
3. Effectifs cumulés
4. Lire un tableau

*🔁 Pause de 5 minutes*

**Séance 2 : les trois indicateurs**

5. La moyenne
6. La moyenne pondérée
7. La médiane
8. L'étendue

**Séance 3 : choisir et lire**

9. Moyenne ou médiane
10. Lire un graphique
11. Les graphiques trompeurs
12. Les pièges à éviter
:::

::: materiel
- Une calculatrice
- Une règle pour les graphiques
- Du papier quadrillé
:::

## 1. Le vocabulaire des statistiques

::: definition Les cinq mots de base
Une **série statistique** est une liste de valeurs recueillies sur un groupe.
La **population** est le groupe étudié.
Un **individu** est un élément de ce groupe.
Le **caractère** est ce que l'on observe : la taille, la note, la couleur.
Une **valeur** est un résultat possible du caractère.
:::

::: exemple Le vocabulaire sur un cas
On relève la note de mathématiques des 25 élèves d'une classe.
**Population** : les 25 élèves. **Individu** : un élève. **Caractère** : la note. **Valeurs** : 0 à 20.
:::

::: grille
| Type de caractère | Description | Exemple |
|---|---|---|
| **Quantitatif** | se mesure par un nombre | taille, note, âge |
| **Qualitatif** | ne se mesure pas | couleur des yeux, sport pratiqué |
:::

::: piege On ne calcule pas la moyenne d'un caractère qualitatif
La moyenne d'une couleur ou d'un sport n'a aucun sens.
Les trois indicateurs de ce chapitre ne s'appliquent qu'aux caractères **quantitatifs**.
:::

## 2. Effectifs et fréquences

::: definition Effectif et fréquence
L'**effectif** d'une valeur est le nombre d'individus qui la présentent.
L'**effectif total** est le nombre total d'individus.
La **fréquence** d'une valeur est son effectif divisé par l'effectif total.
:::

::: formule
`fréquence = effectif ÷ effectif total`

En pourcentage : `fréquence en % = (effectif ÷ effectif total) × 100`
:::

::: exemple Un tableau complet
Notes d'un contrôle sur 20, pour 25 élèves.

| Note | 8 | 10 | 12 | 14 | 16 | Total |
|---|---|---|---|---|---|---|
| **Effectif** | 3 | 6 | 8 | 5 | 3 | **25** |
| **Fréquence** | 0,12 | 0,24 | 0,32 | 0,20 | 0,12 | **1** |
| **Pourcentage** | 12 % | 24 % | 32 % | 20 % | 12 % | **100 %** |

Vérification : `3 ÷ 25 = 0,12`, soit 12 %. La somme des fréquences vaut toujours **1**, celle des pourcentages toujours **100 %**.
:::

::: retenir Le contrôle qui évite les erreurs
Additionne toujours tes fréquences : le total doit faire **1**.
S'il fait 0,98 ou 1,03, tu as fait une erreur d'arrondi ou de calcul.
:::

## 3. Effectifs cumulés

::: definition Effectif cumulé croissant
L'**effectif cumulé croissant** d'une valeur est le nombre d'individus dont la valeur est **inférieure ou égale** à celle-ci.
On l'obtient en ajoutant les effectifs de proche en proche.
:::

::: exemple Sur la même série
| Note | 8 | 10 | 12 | 14 | 16 |
|---|---|---|---|---|---|
| Effectif | 3 | 6 | 8 | 5 | 3 |
| **Effectif cumulé** | 3 | 9 | 17 | 22 | 25 |

Lecture : 17 élèves ont eu **12 ou moins**. Le dernier effectif cumulé vaut toujours l'effectif total.
:::

::: retenir À quoi ça sert
L'effectif cumulé sert surtout à **trouver la médiane** sans écrire toutes les valeurs une par une.
C'est la méthode rapide du point 7.
:::

## 4. Lire un tableau

::: methode Lire un tableau statistique en trois étapes
1. Repère la **population** et l'**effectif total**.
2. Repère le **caractère** étudié et son unité.
3. Vérifie que la somme des effectifs égale bien l'effectif total.
:::

::: piege Ne confonds pas la valeur et l'effectif
Dans le tableau ci-dessus, `12` est une **note**, et `8` est le **nombre d'élèves** qui l'ont obtenue.
Lire « 8 » comme une note conduit à tous les calculs faux.
:::

🔁 **Point de pause.** Reprends après cinq minutes. La suite passe au calcul des indicateurs.

## 5. La moyenne

::: definition Moyenne
La **moyenne** d'une série est la somme de toutes les valeurs divisée par leur nombre.
Elle répond à la question : quelle valeur aurait chaque individu si le total était partagé également ?
:::

::: formule
`moyenne = somme des valeurs ÷ nombre de valeurs`
:::

::: exemple Une moyenne simple
Série : 12, 15, 9, 14, 10.
Somme : `12 + 15 + 9 + 14 + 10 = 60`.
Nombre de valeurs : 5.
Moyenne : `60 ÷ 5 = 12`.
:::

::: piege La moyenne peut ne correspondre à aucun individu
Dans la série 0, 0, 20, 20, la moyenne vaut 10, alors qu'aucun individu n'a eu 10.
La moyenne est un **résumé**, pas une valeur observée.
:::

## 6. La moyenne pondérée

::: definition Moyenne pondérée
Quand plusieurs individus partagent la même valeur, on ne réécrit pas cette valeur plusieurs fois : on la multiplie par son **effectif**.
C'est la **moyenne pondérée**, et elle donne exactement le même résultat.
:::

::: formule
`moyenne = (n₁ × x₁ + n₂ × x₂ + ... + nₚ × xₚ) ÷ (n₁ + n₂ + ... + nₚ)`

où `n₁` est l'effectif de la valeur `x₁`, et ainsi de suite.
:::

::: exemple La moyenne de la série du point 2
| Note | 8 | 10 | 12 | 14 | 16 |
|---|---|---|---|---|---|
| Effectif | 3 | 6 | 8 | 5 | 3 |

Numérateur : `8 × 3 + 10 × 6 + 12 × 8 + 14 × 5 + 16 × 3`
`= 24 + 60 + 96 + 70 + 48 = 298`.
Dénominateur : `3 + 6 + 8 + 5 + 3 = 25`.
Moyenne : `298 ÷ 25 = 11,92`.
:::

::: piege Le dénominateur, c'est l'effectif total
On divise par **25**, le nombre d'élèves, et non par 5, le nombre de notes différentes.
C'est l'erreur la plus fréquente de tout le chapitre.
:::

::: methode Calculer une moyenne pondérée en quatre étapes
1. Multiplie chaque valeur par son effectif.
2. Additionne tous ces produits.
3. Additionne tous les effectifs.
4. Divise le premier total par le second.
:::

## 7. La médiane

::: definition Médiane
La **médiane** est la valeur qui partage la série ordonnée en **deux groupes de même effectif** : autant d'individus en dessous qu'au-dessus.
:::

::: formule
**Étape 1** : range les valeurs dans l'ordre croissant.
**Étape 2** : compte l'effectif total `n`.

Si `n` est **impair** : la médiane est la valeur de rang `(n + 1) ÷ 2`.
Si `n` est **pair** : la médiane est la **moyenne** des valeurs de rang `n ÷ 2` et `n ÷ 2 + 1`.
:::

::: exemple Cas impair
Série : 9, 10, 12, 14, 15. Effectif : `n = 5`, impair.
Rang de la médiane : `(5 + 1) ÷ 2 = 3`.
La 3ᵉ valeur est **12**. La médiane vaut 12.
:::

::: exemple Cas pair
Série : 8, 10, 12, 14, 15, 18. Effectif : `n = 6`, pair.
Rangs à considérer : `6 ÷ 2 = 3` et `4`.
3ᵉ valeur : 12. 4ᵉ valeur : 14.
Médiane : `(12 + 14) ÷ 2 = 13`.
:::

::: methode Trouver la médiane avec les effectifs cumulés
Quand la série est donnée en tableau, ne réécris pas toutes les valeurs.
1. Calcule les effectifs cumulés.
2. Cherche le rang de la médiane.
3. Repère la première colonne dont l'effectif cumulé **atteint ou dépasse** ce rang.
:::

::: exemple La médiane du tableau des notes
| Note | 8 | 10 | 12 | 14 | 16 |
|---|---|---|---|---|---|
| Effectif cumulé | 3 | 9 | 17 | 22 | 25 |

`n = 25`, impair. Rang de la médiane : `(25 + 1) ÷ 2 = 13`.
Le 13ᵉ élève se trouve dans la colonne où le cumul passe de 9 à 17, donc à la note **12**.
La médiane vaut **12**.
:::

::: piege La médiane n'est pas au milieu des valeurs
Elle est au milieu des **individus**, pas au milieu de l'échelle des notes.
Sur la série 0, 1, 2, 3, 100, la médiane vaut 2 et non 50.
:::

## 8. L'étendue

::: definition Étendue
L'**étendue** est la différence entre la plus grande et la plus petite valeur de la série.
Elle mesure la **dispersion** : l'écart entre les extrêmes.
:::

::: formule
`étendue = valeur la plus grande − valeur la plus petite`
:::

::: exemple Sur la série des notes
Valeur maximale : 16. Valeur minimale : 8.
Étendue : `16 − 8 = 8`.
:::

::: piege L'étendue ne dit rien du milieu
Les séries 0, 10, 20 et 0, 0, 20 ont toutes deux une étendue de 20, mais leurs moyennes valent 10 et environ 6,7.
L'étendue ne regarde que les **deux extrêmes**, elle ignore tout le reste.
:::

## 9. Moyenne ou médiane

::: grille
| | **Moyenne** | **Médiane** |
|---|---|---|
| Ce qu'elle utilise | **toutes** les valeurs | seulement le **rang** |
| Sensible aux valeurs extrêmes | **oui**, beaucoup | **non** |
| Se calcule sur un caractère qualitatif | non | non |
| À privilégier quand | les valeurs sont regroupées | il y a des valeurs très éloignées |
:::

::: exemple Le cas qui montre la différence
Salaires mensuels dans une petite entreprise, en euros :
`1500, 1600, 1600, 1700, 1800, 12000`.

**Moyenne** : `(1500 + 1600 + 1600 + 1700 + 1800 + 12000) ÷ 6 = 20200 ÷ 6 ≈ 3367`.
**Médiane** : `n = 6`, pair. 3ᵉ valeur : 1600. 4ᵉ valeur : 1700. Médiane : `(1600 + 1700) ÷ 2 = 1650`.

Cinq personnes sur six gagnent **moins** que la moyenne. La médiane décrit bien mieux la situation ordinaire.
:::

::: retenir La règle de choix
Quand une série contient quelques valeurs **très éloignées** des autres, la **médiane** est plus honnête.
Quand les valeurs sont **regroupées**, la moyenne et la médiane sont proches et la moyenne suffit.
:::

::: aide La question à se poser
*Y a-t-il une valeur beaucoup plus grande ou beaucoup plus petite que les autres ?*
Si oui, calcule les deux indicateurs et compare-les. L'écart entre eux est en lui-même une information.
:::

## 10. Lire un graphique

::: grille
| Type de graphique | À quoi il sert |
|---|---|
| **Diagramme en bâtons** | comparer des effectifs |
| **Diagramme circulaire** | montrer des parts d'un tout |
| **Histogramme** | répartir en classes de valeurs |
| **Courbe** | montrer une évolution dans le temps |
:::

::: methode Lire un graphique en quatre étapes
1. Lis le **titre** : de quoi parle-t-on ?
2. Lis les **axes** et leurs **unités**.
3. Regarde où commence l'axe vertical : à zéro ou ailleurs ?
4. Seulement ensuite, lis les valeurs.
:::

::: formule
**Le diagramme circulaire**
L'angle d'un secteur est proportionnel à l'effectif :
`angle = (effectif ÷ effectif total) × 360°`
:::

::: exemple Un calcul d'angle
Sur 25 élèves, 8 ont eu 12.
Angle : `(8 ÷ 25) × 360 = 0,32 × 360 = 115,2°`.
On arrondit à **115°** pour le tracé.
:::

## 11. Les graphiques trompeurs

::: piege L'axe qui ne part pas de zéro
Si l'axe vertical commence à 95 au lieu de 0, une hausse de 95 à 100 occupe toute la hauteur du graphique.
L'écart réel est de 5 %, l'écart visuel paraît énorme.
C'est le procédé le plus courant pour exagérer une variation.
:::

::: piege Le changement d'échelle en cours de route
Un axe où les graduations passent de 1 en 1 puis de 10 en 10 déforme complètement la courbe.
Vérifie toujours que les graduations sont **régulières**.
:::

::: piege L'effet de volume
Un dessin en trois dimensions double en largeur et en hauteur : sa surface est multipliée par 4, son volume apparent par 8.
Une valeur doublée paraît alors huit fois plus grande.
:::

::: methode Contrôler un graphique en trois questions
1. L'axe vertical part-il de **zéro** ?
2. Les graduations sont-elles **régulières** ?
3. Le graphique montre-t-il des **nombres** ou des **surfaces** ?
:::

::: retenir Le lien avec la lecture de l'information
Un graphique n'est pas une preuve : c'est une **mise en forme** de données.
La même série de nombres peut produire deux images très différentes.
Lire les axes avant les couleurs est le réflexe à installer.
:::

## 12. Les pièges à éviter

::: piege 1. Le dénominateur de la moyenne pondérée
On divise par l'**effectif total**, pas par le nombre de valeurs différentes.
:::

::: piege 2. Valeur et effectif
Dans un tableau, la première ligne donne les **valeurs**, la seconde les **effectifs**. Les confondre fausse tout.
:::

::: piege 3. La médiane sans ranger
Il faut **toujours** ranger la série dans l'ordre croissant avant de chercher la médiane.
:::

::: piege 4. La médiane en effectif pair
Elle est la **moyenne des deux valeurs centrales**, pas l'une des deux.
:::

::: piege 5. L'étendue
C'est une **différence**, pas un intervalle : on écrit `8`, et non `de 8 à 16`.
:::

::: piege 6. La somme des fréquences
Elle vaut **1**, ou 100 %. Un total différent signale une erreur.
:::

::: piege 7. La moyenne d'un caractère qualitatif
Elle n'existe pas. On ne calcule pas la moyenne d'une couleur.
:::

::: piege 8. L'axe qui ne part pas de zéro
Le premier réflexe devant un graphique est de regarder où commence l'axe vertical.
:::

::: cocher
- Je construis un tableau d'effectifs et de fréquences dont le total vaut 1
- Je calcule une moyenne pondérée en divisant par l'effectif total
- Je trouve une médiane dans les deux cas de parité
- Je sais dire quand la médiane est plus honnête que la moyenne
- Je repère un graphique dont l'axe ne part pas de zéro
:::
