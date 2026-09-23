---
type: revision
matiere: maths
lecon: L11
titre: Droites remarquables du triangle : fiche de révision
resume: Tout le chapitre en deux pages : le tableau des quatre familles, les propriétés caractéristiques, les constructions au compas, la position des quatre points, les cas particuliers, les huit pièges et un auto-test de 10 questions.
duree: 15 min
competences:
  - Représenter
  - Raisonner
objectifs:
  - Retrouver seule les quatre définitions et leurs propriétés
  - Identifier une droite remarquable sur une figure
---

::: plan
1. Le tableau des quatre familles
2. Les médiatrices et le cercle circonscrit
3. Les hauteurs
4. Les médianes et les deux tiers
5. Les bissectrices et le cercle inscrit
6. Les cas particuliers
7. Les mots-clés
8. Les huit pièges
9. Auto-test de 10 questions
:::

## 1. Le tableau des quatre familles

::: grille
| Droite | Définition | Propriété | Point de concours |
|---|---|---|---|
| **Médiatrice** | perpendiculaire à un côté en son **milieu** | équidistance des **deux extrémités** | centre du **cercle circonscrit**, `O` |
| **Hauteur** | d'un sommet, **perpendiculaire** au côté opposé | sert au calcul de l'**aire** | **orthocentre**, `H` |
| **Médiane** | d'un sommet au **milieu** du côté opposé | partage en deux **aires égales** | **centre de gravité**, `G` |
| **Bissectrice** | partage un **angle** en deux | équidistance des **deux côtés** | centre du **cercle inscrit**, `I` |
:::

::: formule-cle
Dans chaque famille, les **trois droites sont concourantes**.
Trois droites partent d'un **sommet** : hauteur, médiane, bissectrice.
Une seule part d'un **côté** : la médiatrice. C'est le premier tri à faire.
:::

::: grille
| Point | Position |
|---|---|
| `O`, centre du cercle circonscrit | intérieur, extérieur, ou **milieu de l'hypoténuse** si le triangle est rectangle |
| `H`, orthocentre | intérieur, extérieur, ou **sommet de l'angle droit** |
| `G`, centre de gravité | **toujours intérieur** |
| `I`, centre du cercle inscrit | **toujours intérieur** |
:::

## 2. Les médiatrices et le cercle circonscrit

::: formule-cle
`M appartient à la médiatrice de [AB]` équivaut à `MA = MB`.
Le point `O` vérifie donc `OA = OB = OC` : c'est le centre du cercle passant par les **trois sommets**.
:::

::: grille
| Étape de construction au compas |
|---|
| 1. Pointer sur `A`, écartement supérieur à la moitié de `AB`, tracer deux arcs |
| 2. Pointer sur `B`, même écartement, tracer deux arcs qui coupent les précédents |
| 3. Tracer la droite passant par les deux points d'intersection |
:::

::: retenir Le triangle rectangle
Le centre du cercle circonscrit est le **milieu de l'hypoténuse**.
Le rayon vaut donc la **moitié de l'hypoténuse**, qui est un **diamètre** du cercle.
:::

## 3. Les hauteurs

::: formule-cle
La hauteur issue d'un sommet est **perpendiculaire au côté opposé**.
Les trois hauteurs se coupent en l'**orthocentre**.
`aire = base × hauteur associée ÷ 2` : les trois couples base-hauteur donnent le même résultat.
:::

::: piege La hauteur peut sortir du triangle
Dans un triangle obtusangle, **deux** hauteurs sur trois tombent hors du triangle : il faut prolonger le côté opposé.
C'est la difficulté de construction la plus fréquente du chapitre.
:::

## 4. Les médianes et les deux tiers

::: formule-cle
La médiane joint un sommet au **milieu** du côté opposé, et partage le triangle en deux triangles de **même aire**.
Le centre de gravité `G` est aux **deux tiers** de chaque médiane, **en partant du sommet** :
`AG = (2/3) × AA'` et `GA' = (1/3) × AA'`, donc `AG = 2 × GA'`.
:::

::: retenir Un exemple chiffré
Médiane `[AA']` de `9 cm` : `AG = 6 cm` et `GA' = 3 cm`.
Vérification : `6 + 3 = 9` et `6 = 2 × 3`.
Découpé dans du carton, le triangle tient en équilibre sur la pointe d'un crayon placée en `G`.
:::

## 5. Les bissectrices et le cercle inscrit

::: formule-cle
Un point appartient à la bissectrice d'un angle **si et seulement si** il est à égale distance des **deux côtés**, distance mesurée perpendiculairement.
Le point `I` est donc le centre d'un cercle **tangent** aux trois côtés.
:::

::: grille
| Étape de construction du cercle inscrit |
|---|
| 1. Tracer **deux** bissectrices au compas |
| 2. Leur intersection donne `I` |
| 3. Tracer la **perpendiculaire** de `I` à un côté : elle donne le rayon |
| 4. Tracer le cercle : il doit **toucher** les trois côtés |
:::

::: piege Le rayon ne se prend jamais au jugé
Il se construit par la perpendiculaire de `I` à un côté. Ouvrir le compas « jusqu'à toucher » donne un cercle faux.
:::

## 6. Les cas particuliers

::: grille
| Triangle | Coïncidences |
|---|---|
| **Quelconque** | aucune |
| **Isocèle en `A`** | hauteur, médiane, médiatrice et bissectrice issues de `A` **confondues** : c'est l'axe de symétrie |
| **Équilatéral** | les quatre points sont confondus : `O = H = G = I` |
| **Rectangle** | `O` au milieu de l'hypoténuse, `H` au sommet de l'angle droit |
:::

::: formule-cle
**La réciproque est utile en démonstration** : si la médiane et la hauteur issues d'un même sommet sont confondues, alors le triangle est **isocèle** en ce sommet.
:::

::: retenir Identifier une droite en trois questions
1. Part-elle d'un **sommet** ? Non → médiatrice.
2. Si oui : est-elle **perpendiculaire** au côté opposé ? Oui → hauteur.
3. Sinon : passe-t-elle par le **milieu** du côté opposé ? Oui → médiane. Sinon, si elle coupe l'angle en deux → bissectrice.
:::

## 7. Les mots-clés

::: motscles
- Médiatrice
- Hauteur
- Médiane
- Bissectrice
- Concourantes
- Point de concours
- Cercle circonscrit
- Orthocentre
- Centre de gravité
- Cercle inscrit
- Équidistance
- Tangent
- Deux tiers
- Axe de symétrie
- Triangle acutangle
- Triangle obtusangle
:::

## 8. Les huit pièges

::: piege 1. Médiane et médiatrice
La médiane part d'un **sommet**, la médiatrice est perpendiculaire à un côté en son milieu.
:::

::: piege 2. Bissectrice et médiane
La bissectrice partage l'**angle**, la médiane partage le **côté opposé**.
:::

::: piege 3. La hauteur hors du triangle
Dans un triangle obtusangle, il faut prolonger le côté.
:::

::: piege 4. Les deux tiers
En partant du **sommet**, pas du milieu du côté.
:::

::: piege 5. Le rayon du cercle inscrit
Par la **perpendiculaire** de `I` à un côté.
:::

::: piege 6. Le centre du cercle circonscrit
Il peut être **hors** du triangle, contrairement à `G` et `I`.
:::

::: piege 7. Les cas particuliers
Dans un triangle isocèle, la coïncidence ne vaut que pour le **sommet principal**.
:::

::: piege 8. Deux droites suffisent
La troisième ne sert que de **vérification**.
:::

## 9. Auto-test

Réponds sans regarder la fiche de cours. Les réponses sont juste en dessous.

::: exercice 1 | application | 10 min | ecran
1. Définis les quatre droites remarquables.
2. Quelle est la propriété caractéristique de la médiatrice ? Et de la bissectrice ?
3. Nomme les quatre points de concours.
4. Lesquels sont toujours à l'intérieur du triangle ?
5. Où se trouve le centre du cercle circonscrit d'un triangle rectangle ?
6. Où se trouve l'orthocentre d'un triangle rectangle ?
7. Énonce la propriété des deux tiers.
8. Une médiane mesure 12 cm. Calcule `AG` et `GA'`.
9. Que coïncide-t-il dans un triangle isocèle ? Et dans un équilatéral ?
10. Pourquoi deux droites d'une même famille suffisent-elles ?

::: corrige
1. La **médiatrice** d'un côté est perpendiculaire à ce côté et passe par son milieu. La **hauteur** passe par un sommet et est perpendiculaire au côté opposé. La **médiane** joint un sommet au milieu du côté opposé. La **bissectrice** partage un angle en deux angles égaux.
2. Médiatrice : un point y appartient si et seulement si il est à **égale distance des deux extrémités** du segment. Bissectrice : un point y appartient si et seulement si il est à **égale distance des deux côtés** de l'angle.
3. Le centre du **cercle circonscrit** `O`, l'**orthocentre** `H`, le **centre de gravité** `G`, le centre du **cercle inscrit** `I`.
4. `G` et `I`. Les deux autres peuvent sortir du triangle.
5. Au **milieu de l'hypoténuse**. Le rayon vaut donc la moitié de l'hypoténuse.
6. Au **sommet de l'angle droit**, puisque deux des côtés sont eux-mêmes perpendiculaires.
7. Le centre de gravité est situé aux **deux tiers** de chaque médiane **en partant du sommet** : `AG = (2/3) × AA'` et `AG = 2 × GA'`.
8. `AG = (2/3) × 12 = **8 cm**` et `GA' = (1/3) × 12 = **4 cm**`. Vérification : `8 + 4 = 12` et `8 = 2 × 4`.
9. Dans un triangle **isocèle**, la hauteur, la médiane, la médiatrice et la bissectrice issues du sommet principal sont **confondues**. Dans un **équilatéral**, les quatre points de concours sont confondus en un seul.
10. Parce que les trois droites d'une famille sont **concourantes** : deux suffisent à déterminer le point. La troisième n'apporte rien, mais elle sert de **vérification** : si elle ne passe pas par le point trouvé, une construction est fausse.
:::
:::

::: cocher
- Je ne confonds plus médiane, médiatrice et bissectrice
- Je construis une médiatrice et une bissectrice au compas
- Je connais la position des quatre points de concours
- J'ai eu au moins 8 bonnes réponses sur 10 à l'auto-test
:::
