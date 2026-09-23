---
type: cours
matiere: maths
lecon: L11
titre: Droites remarquables du triangle
resume: Les quatre familles de droites remarquables : médiatrices et centre du cercle circonscrit, hauteurs et orthocentre, médianes et centre de gravité, bissectrices et centre du cercle inscrit, avec leurs constructions, leurs propriétés et les cas particuliers.
duree: 3 séances de 45 min
competences:
  - Chercher
  - Représenter
  - Raisonner
  - Communiquer
objectifs:
  - Définir et construire les quatre droites remarquables
  - Énoncer la propriété caractéristique de chacune
  - Nommer les quatre points de concours et leur rôle
  - Construire un cercle circonscrit et un cercle inscrit
  - Employer la propriété des deux tiers de la médiane
  - Reconnaître les cas particuliers des triangles isocèle et équilatéral
---

::: plan
**Séance 1 : médiatrices et hauteurs**

1. Vocabulaire et rappel
2. Les médiatrices
3. Le cercle circonscrit
4. Les hauteurs

*🔁 Pause de 5 minutes*

**Séance 2 : médianes et bissectrices**

5. Les médianes
6. Le centre de gravité
7. Les bissectrices
8. Le cercle inscrit

**Séance 3 : comparer et appliquer**

9. Le tableau récapitulatif
10. Les cas particuliers
11. Problèmes de construction
12. Les pièges à éviter
:::

::: materiel
- Une règle, un compas, une équerre
- Un rapporteur
- Du papier blanc et un crayon bien taillé
:::

## 1. Vocabulaire et rappel

::: definition Droite remarquable
Une **droite remarquable** d'un triangle est une droite définie à partir d'un sommet ou d'un côté, et qui possède une propriété particulière.
Il en existe quatre familles, à raison de **trois** droites par famille, une par sommet ou par côté.
:::

::: formule
**Le fait commun aux quatre familles**
Dans chaque famille, les **trois droites sont concourantes** : elles se coupent toutes en un même point.
Ce n'est pas évident a priori, et c'est précisément ce qui les rend remarquables.
Chaque point de concours porte un nom et possède une propriété propre.
:::

::: grille
| Famille | Nombre | Point de concours |
|---|---|---|
| **Médiatrices** | 3 | centre du **cercle circonscrit** |
| **Hauteurs** | 3 | **orthocentre** |
| **Médianes** | 3 | **centre de gravité** |
| **Bissectrices** | 3 | centre du **cercle inscrit** |
:::

::: piege Ne confonds pas les quatre définitions
Trois d'entre elles partent d'un **sommet** : hauteur, médiane, bissectrice.
Une seule part d'un **côté** sans passer par un sommet : la médiatrice.
C'est le premier tri à faire quand on hésite.
:::

## 2. Les médiatrices

::: definition Médiatrice
La **médiatrice** d'un segment est la droite **perpendiculaire** à ce segment et passant par son **milieu**.
Dans un triangle, chaque côté a sa médiatrice : il y en a donc trois.
:::

::: formule
**La propriété caractéristique**
Un point appartient à la médiatrice d'un segment **si et seulement si** il est à **égale distance** des deux extrémités de ce segment.

`M appartient à la médiatrice de [AB]` équivaut à `MA = MB`.
:::

::: methode Construire une médiatrice au compas
1. Pointe le compas sur `A`, avec un écartement supérieur à la moitié de `AB`. Trace deux arcs, de part et d'autre du segment.
2. Sans changer l'écartement, pointe sur `B` et trace deux arcs qui coupent les précédents.
3. Trace la droite passant par les deux points d'intersection : c'est la médiatrice.
:::

::: retenir Pourquoi cette construction fonctionne
Les deux points d'intersection sont, par construction, à égale distance de `A` et de `B`.
Ils appartiennent donc tous deux à la médiatrice, qui est la droite les joignant.
La construction n'est pas une recette : elle applique directement la propriété caractéristique.
:::

## 3. Le cercle circonscrit

::: formule
**Le point de concours**
Les trois médiatrices d'un triangle sont **concourantes** en un point souvent noté `O`.
Ce point est à égale distance des **trois sommets** : `OA = OB = OC`.
C'est donc le centre d'un cercle passant par les trois sommets, appelé **cercle circonscrit**.
:::

::: exemple Pourquoi le point est équidistant des trois sommets
`O` appartient à la médiatrice de `[AB]`, donc `OA = OB`.
`O` appartient à la médiatrice de `[BC]`, donc `OB = OC`.
Par transitivité, `OA = OB = OC`. Le point est donc aussi sur la médiatrice de `[AC]`, ce qui démontre le concours des trois droites.
:::

::: grille
| Type de triangle | Position du centre `O` |
|---|---|
| **Acutangle**, trois angles aigus | à l'**intérieur** du triangle |
| **Rectangle** | sur le **milieu de l'hypoténuse** |
| **Obtusangle**, un angle obtus | à l'**extérieur** du triangle |
:::

::: retenir Le cas du triangle rectangle
Dans un triangle rectangle, le centre du cercle circonscrit est le **milieu de l'hypoténuse**.
Le rayon vaut donc la **moitié de l'hypoténuse**, et l'hypoténuse est un **diamètre** du cercle.
Cette propriété, vue en 4ᵉ, sera réutilisée en 3ᵉ.
:::

::: methode Construire un cercle circonscrit
1. Construis la médiatrice de **deux** côtés seulement, deux suffisent.
2. Leur point d'intersection est le centre `O`.
3. Pointe le compas en `O`, ouvre-le jusqu'à un sommet, et trace le cercle.
4. **Vérifie** : le cercle doit passer exactement par les trois sommets.
:::

## 4. Les hauteurs

::: definition Hauteur
La **hauteur** issue d'un sommet est la droite passant par ce sommet et **perpendiculaire** au côté opposé.
Il y en a trois, une par sommet.
:::

::: formule
**Le point de concours**
Les trois hauteurs sont concourantes en un point appelé l'**orthocentre**, souvent noté `H`.
:::

::: grille
| Type de triangle | Position de l'orthocentre |
|---|---|
| **Acutangle** | à l'**intérieur** |
| **Rectangle** | au **sommet de l'angle droit** |
| **Obtusangle** | à l'**extérieur** |
:::

::: piege La hauteur peut sortir du triangle
Dans un triangle obtusangle, deux des trois hauteurs tombent **hors** du triangle : il faut prolonger le côté opposé pour tracer le pied de la hauteur.
C'est la difficulté de construction la plus fréquente de ce chapitre.
:::

::: retenir Le lien avec l'aire
La hauteur sert au calcul de l'aire : `aire = base × hauteur associée ÷ 2`.
Le mot « hauteur » désigne ici la **longueur** du segment, du sommet au pied, et non la droite entière.
Un triangle a donc trois bases possibles, chacune avec sa hauteur, et les trois calculs donnent le même résultat.
:::

🔁 **Point de pause.** Reprends après cinq minutes. La suite présente les deux dernières familles.

## 5. Les médianes

::: definition Médiane
La **médiane** issue d'un sommet est la droite passant par ce sommet et par le **milieu du côté opposé**.
Il y en a trois.
:::

::: formule
**La propriété d'aire**
Une médiane partage le triangle en **deux triangles de même aire**.
En effet, les deux triangles obtenus ont des bases de même longueur, les deux moitiés du côté, et la même hauteur, celle issue du sommet.
:::

::: piege Médiane et médiatrice
La **médiane** part d'un **sommet** et va au **milieu** du côté opposé. Elle n'est pas perpendiculaire à ce côté, sauf cas particulier.
La **médiatrice** est **perpendiculaire** à un côté et passe par son milieu. Elle ne passe pas par un sommet, sauf cas particulier.
Les deux passent par un milieu : c'est ce qui les fait confondre.
:::

## 6. Le centre de gravité

::: formule
**Le point de concours**
Les trois médianes sont concourantes en un point appelé le **centre de gravité**, souvent noté `G`.
:::

::: formule
**La propriété des deux tiers**
Le centre de gravité est situé aux **deux tiers** de chaque médiane **en partant du sommet**.

Si `A'` est le milieu de `[BC]`, alors `AG = (2/3) × AA'` et `GA' = (1/3) × AA'`.
Autrement dit, `AG = 2 × GA'`.
:::

::: exemple Un calcul avec les deux tiers
Dans un triangle, la médiane `[AA']` mesure `9 cm`.
`AG = (2/3) × 9 = **6 cm**` et `GA' = (1/3) × 9 = **3 cm**`.
Vérification : `6 + 3 = 9`, et `6 = 2 × 3`.
:::

::: retenir Pourquoi « centre de gravité »
Si l'on découpe le triangle dans un carton homogène, il tient en équilibre exactement sur la pointe d'un crayon placée en `G`.
Ce n'est pas une image : c'est la définition physique du centre de masse d'une plaque triangulaire.
:::

::: piege Le centre de gravité est toujours à l'intérieur
Contrairement à l'orthocentre et au centre du cercle circonscrit, le centre de gravité est **toujours intérieur** au triangle, quelle que soit sa forme.
C'est une conséquence directe de la propriété des deux tiers.
:::

## 7. Les bissectrices

::: definition Bissectrice
La **bissectrice** d'un angle est la demi-droite qui **partage cet angle en deux angles égaux**.
Dans un triangle, chaque sommet porte un angle, donc une bissectrice : il y en a trois.
:::

::: formule
**La propriété caractéristique**
Un point appartient à la bissectrice d'un angle **si et seulement si** il est à **égale distance des deux côtés** de cet angle.

La distance d'un point à une droite se mesure **perpendiculairement** à cette droite.
:::

::: methode Construire une bissectrice au compas
1. Pointe le compas au **sommet** de l'angle et trace un arc qui coupe les deux côtés en deux points.
2. Pointe successivement sur ces deux points, avec le même écartement, et trace deux arcs qui se croisent.
3. Trace la demi-droite joignant le sommet à ce point d'intersection.
:::

::: piege Bissectrice et médiane
La **bissectrice** partage l'**angle** en deux parties égales.
La **médiane** partage le **côté opposé** en deux parties égales.
Elles ne coïncident que dans les cas particuliers du point 10.
:::

## 8. Le cercle inscrit

::: formule
**Le point de concours**
Les trois bissectrices sont concourantes en un point souvent noté `I`.
Ce point est à égale distance des **trois côtés**.
C'est donc le centre d'un cercle **tangent** aux trois côtés, appelé **cercle inscrit**.
:::

::: methode Construire un cercle inscrit
1. Construis la bissectrice de **deux** angles seulement.
2. Leur point d'intersection est le centre `I`.
3. Trace la **perpendiculaire** de `I` à l'un des côtés : le pied de cette perpendiculaire donne le rayon.
4. Trace le cercle de centre `I` et de ce rayon. Il doit **toucher** les trois côtés sans les traverser.
:::

::: piege Le rayon ne se prend pas au jugé
Pour tracer le cercle inscrit, on ne peut pas ouvrir le compas « jusqu'à toucher un côté » approximativement.
Il faut construire la **perpendiculaire** de `I` à un côté : c'est elle qui donne la distance exacte.
:::

::: retenir Le centre du cercle inscrit est toujours à l'intérieur
Comme le centre de gravité, le point `I` est **toujours intérieur** au triangle.
C'est logique : un cercle tangent aux trois côtés ne peut pas avoir son centre hors du triangle.
:::

## 9. Le tableau récapitulatif

::: grille
| Droite | Définition | Propriété | Point de concours | Position |
|---|---|---|---|---|
| **Médiatrice** | perpendiculaire à un côté en son milieu | équidistance des **deux extrémités** | centre du **cercle circonscrit**, `O` | intérieur, extérieur ou milieu de l'hypoténuse |
| **Hauteur** | passe par un sommet, perpendiculaire au côté opposé | sert au calcul de l'**aire** | **orthocentre**, `H` | intérieur, extérieur ou sommet de l'angle droit |
| **Médiane** | passe par un sommet et le **milieu** du côté opposé | partage en deux **aires égales** | **centre de gravité**, `G` | **toujours intérieur** |
| **Bissectrice** | partage un **angle** en deux | équidistance des **deux côtés** | centre du **cercle inscrit**, `I` | **toujours intérieur** |
:::

::: methode Identifier une droite sur une figure, en trois questions
1. Part-elle d'un **sommet** ? Non → c'est une médiatrice.
2. Si oui : est-elle **perpendiculaire** au côté opposé ? Oui → c'est une hauteur.
3. Sinon : passe-t-elle par le **milieu** du côté opposé ? Oui → médiane. Sinon, si elle coupe l'angle en deux → bissectrice.
:::

::: retenir Les deux points toujours intérieurs
`G`, le centre de gravité, et `I`, le centre du cercle inscrit.
Les deux autres, `O` et `H`, peuvent sortir du triangle.
Retenir cette distinction permet déjà de repérer une erreur de construction.
:::

## 10. Les cas particuliers

::: formule
**Dans un triangle isocèle**
Si le triangle `ABC` est isocèle en `A`, alors la hauteur, la médiane, la médiatrice et la bissectrice issues de `A` sont **confondues** en une seule droite : l'**axe de symétrie** du triangle.
:::

::: exemple La conséquence pratique
Dans un triangle isocèle en `A`, tracer la hauteur issue de `A` revient à tracer aussi la médiane, la médiatrice de `[BC]` et la bissectrice de l'angle `A`.
Un seul tracé suffit là où il en faudrait quatre dans un triangle quelconque.
:::

::: formule
**Dans un triangle équilatéral**
Les quatre points de concours sont **confondus** : `O = H = G = I`.
Ce point unique est le centre du triangle, et les trois axes de symétrie sont les trois droites remarquables confondues.
:::

::: retenir La réciproque est utile
Si dans un triangle la médiane et la hauteur issues d'un même sommet sont **confondues**, alors le triangle est **isocèle** en ce sommet.
C'est une méthode de démonstration courante : prouver une coïncidence pour en déduire une propriété du triangle.
:::

::: grille
| Triangle | Coïncidences |
|---|---|
| **Quelconque** | aucune |
| **Isocèle** | les quatre droites issues du sommet principal sont confondues |
| **Équilatéral** | les quatre points de concours sont confondus |
| **Rectangle** | `O` au milieu de l'hypoténuse, `H` au sommet de l'angle droit |
:::

## 11. Problèmes de construction

::: methode Construire un triangle et son cercle circonscrit
1. Construis le triangle avec les données de l'énoncé.
2. Trace les médiatrices de **deux** côtés au compas.
3. Note leur intersection `O`.
4. Trace le cercle de centre `O` passant par un sommet.
5. **Vérifie** qu'il passe par les deux autres.
:::

::: methode Construire un triangle et son cercle inscrit
1. Construis le triangle.
2. Trace les bissectrices de **deux** angles au compas.
3. Note leur intersection `I`.
4. Trace la perpendiculaire de `I` à un côté pour obtenir le rayon.
5. Trace le cercle. Il doit **toucher** les trois côtés.
:::

::: aide Pourquoi deux droites suffisent toujours
Puisque les trois droites d'une même famille sont concourantes, deux d'entre elles suffisent à déterminer le point.
Tracer la troisième n'apporte rien de plus, mais elle constitue une **vérification** utile : si elle ne passe pas par le point trouvé, c'est qu'une construction est fausse.
:::

::: exemple Un problème type
« Soit `ABC` un triangle avec `AB = 6 cm`, `AC = 5 cm` et `BC = 7 cm`. Construire le centre du cercle circonscrit et le centre de gravité. Que remarque-t-on ? »

Construction : deux médiatrices pour `O`, deux médianes pour `G`.
Observation : `O` et `G` sont **distincts**, puisque le triangle n'est ni isocèle ni équilatéral. Les deux sont ici intérieurs au triangle, car ses trois angles sont aigus.
:::

## 12. Les pièges à éviter

::: piege 1. Médiane et médiatrice
La **médiane** part d'un sommet, la **médiatrice** est perpendiculaire à un côté en son milieu.
:::

::: piege 2. Bissectrice et médiane
La bissectrice partage l'**angle**, la médiane partage le **côté opposé**.
:::

::: piege 3. La hauteur hors du triangle
Dans un triangle obtusangle, deux hauteurs tombent à l'extérieur : il faut prolonger le côté.
:::

::: piege 4. Les deux tiers
Le centre de gravité est aux deux tiers **en partant du sommet**, pas du milieu du côté.
:::

::: piege 5. Le rayon du cercle inscrit
Il se construit par la **perpendiculaire** de `I` à un côté, jamais au jugé.
:::

::: piege 6. Le centre du cercle circonscrit
Il peut être **hors** du triangle, contrairement à `G` et `I` qui sont toujours à l'intérieur.
:::

::: piege 7. Les cas particuliers
Dans un triangle isocèle, les quatre droites issues du sommet principal sont confondues : ce n'est vrai que **pour ce sommet**.
:::

::: piege 8. Deux droites suffisent
Il est inutile de tracer les trois droites d'une famille ; la troisième sert seulement de vérification.
:::

::: cocher
- Je définis les quatre droites remarquables sans les confondre
- Je construis une médiatrice et une bissectrice au compas
- Je connais les quatre points de concours et leur position
- J'applique la propriété des deux tiers de la médiane
- Je sais ce qui coïncide dans un triangle isocèle et dans un équilatéral
:::
