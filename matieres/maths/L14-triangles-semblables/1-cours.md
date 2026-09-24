---
type: cours
matiere: maths
lecon: L14
titre: Triangles semblables, agrandissement et réduction
resume: Reconnaître deux triangles semblables, calculer le coefficient d'agrandissement ou de réduction, en déduire une longueur inconnue, et savoir ce que devient l'aire.
duree: 2 séances de 45 min
competences:
  - Chercher
  - Raisonner
  - Calculer
objectifs:
  - Reconnaître deux triangles semblables grâce à leurs angles
  - Écrire les côtés qui se correspondent et calculer le coefficient
  - Calculer une longueur inconnue avec un tableau de proportionnalité
  - Expliquer ce que devient l'aire quand on agrandit ou réduit une figure
---

::: plan
**Séance 1 : reconnaître et nommer**

1. Deux figures qui ont la même forme
2. Ce que « semblables » veut dire pour deux triangles
3. Les côtés qui se correspondent
4. Le coefficient d'agrandissement ou de réduction

**Séance 2 : calculer**

5. Trouver une longueur inconnue
6. Reconnaître des triangles semblables sans mesurer
7. Ce que devient l'aire
8. Les pièges à éviter
:::

::: materiel
- Une règle graduée et un rapporteur
- Une calculatrice
- Deux feuilles : une pour les figures, une pour les calculs
:::

::: info Ce que dit le programme
En 4ᵉ, on apprend à **reconnaître des triangles semblables** et à utiliser la **proportionnalité des longueurs** pour calculer une longueur. C'est la base qui prépare le théorème de Thalès, vu en 3ᵉ.
:::

## 1. Deux figures qui ont la même forme

Quand Sterenn dessine un personnage au feutre puis le reproduit en plus grand sur une autre feuille, elle garde la même forme : les angles du visage ne changent pas, seules les longueurs sont multipliées par un même nombre. Le dessin est un **agrandissement**. Si elle le refait en plus petit, c'est une **réduction**.

::: definition Agrandissement et réduction
Agrandir ou réduire une figure, c'est **multiplier toutes ses longueurs par un même nombre**, appelé **coefficient**, sans changer ses angles.
- Coefficient supérieur à 1 : agrandissement.
- Coefficient compris entre 0 et 1 : réduction.
:::

::: exemple Une photo en deux formats
Une photo mesure 10 cm sur 15 cm. Son tirage en 20 cm sur 30 cm est un agrandissement de coefficient 2 : chaque longueur a été multipliée par 2. Les angles des coins restent des angles droits.
:::

🔁 Pause. Redis en une phrase la différence entre agrandir et déformer.

## 2. Ce que « semblables » veut dire pour deux triangles

Deux triangles sont **semblables** quand l'un est un agrandissement ou une réduction de l'autre. Ils ont exactement la même forme, pas forcément la même taille.

::: definition Triangles semblables
Deux triangles sont semblables quand leurs **angles sont égaux deux à deux**. Alors leurs **côtés sont proportionnels** : les longueurs de l'un s'obtiennent en multipliant celles de l'autre par un même coefficient.
:::

::: retenir La double propriété
Angles égaux **et** côtés proportionnels vont toujours ensemble. Si l'un est vrai, l'autre l'est aussi.
:::

::: exemple Deux triangles semblables
Le triangle ABC a des angles de 90°, 60° et 30°. Le triangle DEF a aussi des angles de 90°, 60° et 30°. Ils sont semblables. Si AB = 3 cm et DE = 6 cm, avec AB et DE les côtés en face des angles de 30°, alors chaque côté de DEF mesure le double du côté correspondant de ABC.
:::

## 3. Les côtés qui se correspondent

Pour comparer deux triangles semblables, il faut savoir **quel côté va avec quel côté**. La règle est simple : un côté est en face d'un angle. Deux côtés se correspondent quand ils sont **en face du même angle**.

::: methode Trouver les côtés correspondants
::: etapes
1. Je repère les **angles égaux** dans les deux triangles, avec le rapporteur ou avec le codage de la figure.
2. Pour chaque angle, je nomme le **côté en face** dans chaque triangle.
3. J'écris les correspondances **dans un tableau**, un côté au-dessus de l'autre.
:::
:::

::: exemple Le tableau des correspondances
Dans ABC, l'angle de 30° est en A, le côté en face est BC. Dans DEF, l'angle de 30° est en D, le côté en face est EF. Donc BC correspond à EF.

| Triangle ABC | BC | AC | AB |
|---|---|---|---|
| Triangle DEF | EF | DF | DE |
:::

::: piege Le nom des points ne dit pas la correspondance
AB ne correspond pas forcément à DE parce que ce sont les « premiers » côtés. Seul l'angle en face décide. Vérifie toujours avec les angles.
:::

🔁 Pause. Sur ta figure, colorie de la même couleur les deux côtés qui se correspondent.

## 4. Le coefficient d'agrandissement ou de réduction

Une fois les côtés correspondants connus, le **coefficient** est le quotient d'une longueur du grand triangle par la longueur correspondante du petit.

::: formule Coefficient
coefficient = longueur dans la figure d'arrivée ÷ longueur correspondante dans la figure de départ
:::

::: exemple Calculer le coefficient
BC = 4 cm et EF = 10 cm sont deux côtés correspondants. Coefficient de ABC vers DEF : 10 ÷ 4 = **2,5**. C'est un agrandissement, car 2,5 est plus grand que 1. De DEF vers ABC, le coefficient vaut 4 ÷ 10 = **0,4** : une réduction.
:::

::: retenir Deux sens, deux coefficients
Le coefficient dépend du sens. De petit vers grand, il est supérieur à 1. De grand vers petit, il est entre 0 et 1. Les deux sont inverses l'un de l'autre : 2,5 × 0,4 = 1.
:::

## 5. Trouver une longueur inconnue

C'est l'usage principal du chapitre. On connaît un coefficient, ou deux côtés correspondants, et on cherche un troisième côté.

::: methode Calculer une longueur avec deux triangles semblables
::: etapes
1. Je vérifie que les triangles sont **semblables** (angles égaux).
2. J'écris le **tableau des côtés correspondants**.
3. Je calcule le **coefficient** avec deux longueurs connues qui se correspondent.
4. Je **multiplie** la longueur connue par le coefficient pour trouver la longueur cherchée.
5. Je **contrôle** : la longueur trouvée est plus grande dans le grand triangle, plus petite dans le petit.
:::
:::

::: exemple Un calcul complet
ABC et DEF sont semblables. BC = 4 cm correspond à EF = 10 cm. AC = 3 cm correspond à DF, inconnu.
Coefficient : 10 ÷ 4 = 2,5.
DF = AC × 2,5 = 3 × 2,5 = **7,5 cm**.
Contrôle : DF est dans le grand triangle, et 7,5 est plus grand que 3.
:::

::: formule Le tableau de proportionnalité
| Petit triangle | 4 | 3 |
|---|---|---|
| Grand triangle | 10 | ? |

? = 3 × 10 ÷ 4 = 7,5. C'est le produit en croix vu en proportionnalité.
:::

🔁 Pause. Refais ce calcul sur ta feuille sans regarder, puis compare.

## 6. Reconnaître des triangles semblables sans mesurer

Deux triangles ont toujours des angles dont la somme vaut 180°. Il suffit donc que **deux angles** de l'un soient égaux à deux angles de l'autre : le troisième l'est forcément.

::: retenir Deux angles suffisent
Si deux triangles ont deux angles égaux deux à deux, ils sont semblables. Pas besoin de vérifier le troisième angle ni de mesurer les côtés.
:::

::: exemple La configuration en « sablier »
Deux droites qui se coupent en un point O, et deux droites parallèles qui les coupent de part et d'autre de O, dessinent deux triangles. Les angles en O sont égaux (opposés par le sommet) et les angles formés avec les parallèles sont égaux (alternes-internes). Les deux triangles sont semblables. C'est cette figure que tu retrouveras en 3ᵉ avec le théorème de Thalès.
:::

::: exemple La configuration « emboîtée »
Un triangle ABC ; un point M sur le côté AB, un point N sur le côté AC, avec (MN) parallèle à (BC). Le triangle AMN et le triangle ABC ont le même angle en A et des angles égaux en M et B (correspondants). Ils sont semblables : AMN est une réduction de ABC.
:::

## 7. Ce que devient l'aire

Quand toutes les longueurs sont multipliées par un coefficient k, l'aire n'est pas multipliée par k, mais par **k × k**, c'est-à-dire k².

::: formule Aire d'une figure agrandie ou réduite
Longueurs × k → aire × k²
:::

::: exemple Deux carrés
Un carré de côté 2 cm a une aire de 4 cm². On multiplie le côté par 3 : le côté mesure 6 cm et l'aire 36 cm². L'aire a été multipliée par 9, soit 3².
:::

::: exemple Un triangle réduit
Un triangle d'aire 20 cm² est réduit avec le coefficient 0,5. La nouvelle aire vaut 20 × 0,5² = 20 × 0,25 = **5 cm²**.
:::

::: piege Deux fois plus grand ne veut pas dire deux fois plus d'aire
Un dessin agrandi « au double » demande quatre fois plus de feutre. Les longueurs doublent, l'aire quadruple.
:::

## 8. Les pièges à éviter

::: piege Les cinq erreurs les plus fréquentes
1. Associer les côtés d'après le nom des points au lieu des angles en face.
2. Inverser le coefficient : diviser au lieu de multiplier.
3. Oublier de vérifier que les triangles sont semblables avant de calculer.
4. Multiplier l'aire par k au lieu de k².
5. Écrire un résultat sans unité, ou avec la mauvaise unité.
:::

::: retenir Ce qu'il faut retenir
- Semblables : mêmes angles, côtés proportionnels.
- Deux angles égaux suffisent pour conclure.
- Le coefficient se calcule avec deux côtés correspondants : arrivée ÷ départ.
- Longueur inconnue : longueur connue × coefficient.
- Aire : multipliée par k².
:::
