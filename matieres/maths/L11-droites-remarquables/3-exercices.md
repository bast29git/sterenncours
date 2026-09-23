---
type: exercices
matiere: maths
lecon: L11
titre: Droites remarquables du triangle : exercices corrigés
resume: 20 exercices progressifs, des définitions aux constructions au compas, aux calculs avec les deux tiers et aux démonstrations, avec un corrigé détaillé pour chacun.
duree: 3 séances de 45 min
competences:
  - Chercher
  - Représenter
  - Raisonner
  - Communiquer
objectifs:
  - Distinguer les quatre droites remarquables
  - Construire au compas et à la règle
  - Employer les propriétés caractéristiques
  - Rédiger une démonstration courte
---

::: plan
**Série A : reconnaître et définir** (exercices 1 à 5)
**Série B : constructions** (exercices 6 à 11)

*🔁 Pause*

**Série C : calculs et propriétés** (exercices 12 à 16)
**Série D : démontrer et devoir type** (exercices 17 à 20)
:::

::: materiel
- Règle, compas, équerre, rapporteur
- Papier blanc, crayon bien taillé
- Calculatrice
:::

## Série A : reconnaître et définir

::: exercice 1 | application | 4 min | ecran
Associe chaque droite à sa définition.

Droites : médiatrice · hauteur · médiane · bissectrice

::: corrige
- **Médiatrice** d'un côté : droite **perpendiculaire** à ce côté et passant par son **milieu**.
- **Hauteur** issue d'un sommet : droite passant par ce sommet et **perpendiculaire au côté opposé**.
- **Médiane** issue d'un sommet : droite passant par ce sommet et par le **milieu du côté opposé**.
- **Bissectrice** d'un angle : demi-droite qui partage cet **angle** en deux angles égaux.

Premier tri utile : trois d'entre elles partent d'un **sommet**, hauteur, médiane et bissectrice. Une seule part d'un **côté** sans passer par un sommet : la médiatrice.
:::
:::

::: exercice 2 | application | 4 min | ecran
Associe chaque famille à son point de concours et à sa propriété.

::: corrige
| Famille | Point de concours | Propriété du point |
|---|---|---|
| **Médiatrices** | centre du **cercle circonscrit**, `O` | équidistant des trois **sommets** |
| **Hauteurs** | **orthocentre**, `H` | aucune propriété d'équidistance |
| **Médianes** | **centre de gravité**, `G` | aux deux tiers de chaque médiane |
| **Bissectrices** | centre du **cercle inscrit**, `I` | équidistant des trois **côtés** |

Retiens la symétrie entre les deux équidistances : les médiatrices donnent l'équidistance aux **sommets**, donc un cercle qui les traverse ; les bissectrices donnent l'équidistance aux **côtés**, donc un cercle qui les touche.
:::
:::

::: exercice 3 | application | 5 min | ecran
Pour chaque description, identifie la droite.

1. Elle part du sommet `A` et coupe `[BC]` en son milieu.
2. Elle est perpendiculaire à `[AB]` et passe par le milieu de `[AB]`.
3. Elle part de `A` et forme un angle droit avec `(BC)`.
4. Elle partage l'angle `BAC` en deux angles de même mesure.

::: corrige
1. La **médiane** issue de `A`.
2. La **médiatrice** de `[AB]`.
3. La **hauteur** issue de `A`.
4. La **bissectrice** de l'angle `A`.

Applique la méthode en trois questions : part-elle d'un sommet ? Est-elle perpendiculaire au côté opposé ? Passe-t-elle par le milieu de ce côté ?
:::
:::

::: exercice 4 | entrainement | 5 min | ecran
Vrai ou faux ? Justifie en une phrase.

1. Le centre de gravité peut se trouver hors du triangle.
2. L'orthocentre d'un triangle rectangle est au sommet de l'angle droit.
3. La médiane et la médiatrice issues d'un même côté sont toujours confondues.
4. Le centre du cercle inscrit est équidistant des trois sommets.

::: corrige
1. **Faux.** Le centre de gravité est **toujours intérieur** au triangle, c'est une conséquence de la propriété des deux tiers.
2. **Vrai.** Les deux côtés de l'angle droit sont perpendiculaires entre eux : ils portent donc chacun la hauteur issue de l'autre sommet, et les trois hauteurs se coupent au sommet de l'angle droit.
3. **Faux.** La médiane part d'un sommet, la médiatrice non. Elles ne coïncident que dans un triangle **isocèle**, pour le sommet principal.
4. **Faux.** Il est équidistant des trois **côtés**, ce qui permet de tracer un cercle tangent. C'est le centre du cercle **circonscrit** qui est équidistant des trois **sommets**.
:::
:::

::: exercice 5 | entrainement | 6 min | ecran
Complète le tableau de la position des points de concours.

| Type de triangle | `O` | `H` | `G` | `I` |
|---|---|---|---|---|
| Acutangle | ……… | ……… | ……… | ……… |
| Rectangle | ……… | ……… | ……… | ……… |
| Obtusangle | ……… | ……… | ……… | ……… |

::: corrige
| Type de triangle | `O` | `H` | `G` | `I` |
|---|---|---|---|---|
| **Acutangle** | intérieur | intérieur | intérieur | intérieur |
| **Rectangle** | **milieu de l'hypoténuse** | **sommet de l'angle droit** | intérieur | intérieur |
| **Obtusangle** | **extérieur** | **extérieur** | intérieur | intérieur |

La lecture du tableau est simple : `G` et `I` sont **toujours intérieurs**, `O` et `H` dépendent de la forme du triangle. Cette observation permet de repérer immédiatement une erreur de construction.
:::
:::

## Série B : constructions

::: exercice 6 | application | 6 min | main
Trace un segment `[AB]` de `7 cm`, puis construis sa médiatrice au compas. Décris tes étapes.

::: corrige
Étapes :
1. Pointe le compas sur `A`, avec un écartement **supérieur** à `3,5 cm`, la moitié de `AB`. Trace deux arcs, un de chaque côté du segment.
2. **Sans changer l'écartement**, pointe sur `B` et trace deux arcs qui coupent les précédents. Tu obtiens deux points d'intersection.
3. Trace la droite passant par ces deux points : c'est la médiatrice de `[AB]`.

**Pourquoi cela fonctionne** : les deux points d'intersection sont, par construction, à égale distance de `A` et de `B`. Ils appartiennent donc tous deux à la médiatrice, qui est la droite les joignant. La construction applique directement la propriété caractéristique.

**Vérification** : la droite obtenue doit couper `[AB]` perpendiculairement et exactement en son milieu, soit à 3,5 cm de chaque extrémité.
:::
:::

::: exercice 7 | entrainement | 8 min | main
Construis un triangle `ABC` avec `AB = 6 cm`, `AC = 5 cm` et `BC = 7 cm`, puis son cercle circonscrit.

::: corrige
Construction du triangle :
1. Trace `[BC]` de `7 cm`.
2. Pointe en `B`, ouvre le compas à `6 cm`, trace un arc.
3. Pointe en `C`, ouvre à `5 cm`, trace un arc. L'intersection donne `A`.

Construction du cercle circonscrit :
4. Trace la médiatrice de `[BC]` au compas.
5. Trace la médiatrice de `[AB]` au compas.
6. Leur intersection est le centre `O`.
7. Pointe en `O`, ouvre jusqu'à `A`, trace le cercle.

**Vérification** : le cercle doit passer exactement par `B` et `C` également. Si ce n'est pas le cas, une médiatrice est mal construite.

**Observation attendue** : le triangle a ses trois angles aigus, `O` se trouve donc à l'**intérieur**.
:::
:::

::: exercice 8 | entrainement | 7 min | main
Trace un triangle `ABC` avec un angle obtus en `A`, puis construis les trois hauteurs.

::: corrige
Étapes :
1. Trace un triangle obtusangle, par exemple avec un angle de `120°` en `A`.
2. La hauteur issue de `A` tombe **à l'intérieur** du triangle : trace la perpendiculaire à `(BC)` passant par `A`.
3. Les hauteurs issues de `B` et de `C` tombent **à l'extérieur** : il faut **prolonger** les côtés `(AC)` et `(AB)` au-delà de `A` pour y placer le pied de chaque hauteur.
4. Les trois droites se coupent en un point situé **hors du triangle** : c'est l'orthocentre `H`.

C'est la difficulté de construction la plus fréquente du chapitre. Retiens que la hauteur est une **droite**, pas un segment limité au triangle : elle peut parfaitement le rencontrer en dehors.
:::
:::

::: exercice 9 | entrainement | 7 min | main
Construis un triangle quelconque, puis son centre de gravité. Vérifie la propriété des deux tiers par la mesure.

::: corrige
Étapes :
1. Trace un triangle `ABC` quelconque.
2. Place `A'`, milieu de `[BC]`, au compas ou à la règle graduée. Trace la médiane `[AA']`.
3. Place `B'`, milieu de `[AC]`. Trace la médiane `[BB']`.
4. Leur intersection est le centre de gravité `G`.

Vérification par la mesure :
5. Mesure `AA'`, puis `AG`.
6. Calcule `AG ÷ AA'` : tu dois trouver environ `0,67`, c'est-à-dire `2/3`.
7. Mesure `GA'` et vérifie que `AG` vaut environ le **double** de `GA'`.

Un écart de un ou deux millimètres est normal, il vient de la précision du tracé. Un écart plus grand signale une erreur de construction, le plus souvent un milieu mal placé.
:::
:::

::: exercice 10 | entrainement | 7 min | main
Construis un triangle, puis la bissectrice de l'un de ses angles au compas.

::: corrige
Étapes :
1. Pointe le compas au **sommet** de l'angle, avec un écartement quelconque. Trace un arc qui coupe les deux côtés de l'angle en deux points, appelons-les `M` et `N`.
2. Pointe en `M`, avec un écartement supérieur à la moitié de `MN`, et trace un arc.
3. **Sans changer l'écartement**, pointe en `N` et trace un arc qui coupe le précédent en un point `P`.
4. Trace la demi-droite joignant le sommet à `P` : c'est la bissectrice.

**Vérification** au rapporteur : les deux angles obtenus doivent avoir exactement la même mesure.

Remarque que cette construction est très proche de celle de la médiatrice : dans les deux cas, on cherche un point à égale distance de deux points donnés.
:::
:::

::: exercice 11 | approfondissement | 9 min | main
Construis un triangle `ABC` avec `AB = 7 cm`, `AC = 6 cm` et `BC = 5 cm`, puis son cercle inscrit.

::: corrige
Construction du triangle : même méthode qu'à l'exercice 7, avec le compas.

Construction du cercle inscrit :
1. Trace la bissectrice de l'angle `A` au compas.
2. Trace la bissectrice de l'angle `B` au compas.
3. Leur intersection est le centre `I`.
4. Trace la **perpendiculaire** de `I` au côté `[BC]`, à l'équerre. Appelle `T` son pied.
5. Le rayon du cercle inscrit est `IT`. Pointe le compas en `I`, ouvre jusqu'à `T`, trace le cercle.

**Vérification** : le cercle doit **toucher** les trois côtés, sans les traverser ni s'en écarter.

Erreur à ne pas commettre : ouvrir le compas « jusqu'à ce que ça touche » approximativement. Le rayon doit être **construit** par la perpendiculaire, sinon le cercle coupera un côté et en manquera un autre.
:::
:::

*🔁 Pause. Reprends après une vraie coupure.*

## Série C : calculs et propriétés

::: exercice 12 | application | 5 min | ecran
Dans un triangle, la médiane `[AA']` mesure les longueurs suivantes. Calcule `AG` et `GA'`.

1. `AA' = 9 cm` · 2. `AA' = 12 cm` · 3. `AA' = 15 cm` · 4. `AA' = 7,5 cm`

::: corrige
On applique `AG = (2/3) × AA'` et `GA' = (1/3) × AA'`.

1. `AG = 6 cm` et `GA' = 3 cm`.
2. `AG = 8 cm` et `GA' = 4 cm`.
3. `AG = 10 cm` et `GA' = 5 cm`.
4. `AG = 5 cm` et `GA' = 2,5 cm`.

Contrôle systématique : la somme doit redonner la médiane entière, et `AG` doit valoir exactement le **double** de `GA'`.
:::
:::

::: exercice 13 | entrainement | 6 min | ecran
Dans un triangle, on sait que `AG = 10 cm`, où `G` est le centre de gravité et `[AA']` une médiane.

1. Calcule `GA'`.
2. Calcule `AA'`.
3. Que vaudrait `AG` si `GA'` mesurait `6 cm` ?

::: corrige
1. `AG = 2 × GA'`, donc `GA' = 10 ÷ 2 = **5 cm**`.
2. `AA' = AG + GA' = 10 + 5 = **15 cm**`. On peut vérifier : `(2/3) × 15 = 10`.
3. `AG = 2 × 6 = **12 cm**`, et la médiane entière mesurerait `18 cm`.

Retiens le rapport le plus commode à manipuler : `AG = 2 × GA'`. Il évite les fractions et se vérifie d'un coup d'œil.
:::
:::

::: exercice 14 | entrainement | 6 min | ecran
Un triangle rectangle a une hypoténuse de `10 cm`.

1. Où se trouve le centre de son cercle circonscrit ?
2. Quel est le rayon de ce cercle ?
3. Où se trouve son orthocentre ?
4. Que peut-on dire de l'hypoténuse par rapport au cercle ?

::: corrige
1. Au **milieu de l'hypoténuse**.
2. Le rayon vaut la **moitié de l'hypoténuse**, soit `10 ÷ 2 = **5 cm**`.
3. Au **sommet de l'angle droit**. Les deux côtés de l'angle droit étant perpendiculaires entre eux, chacun porte la hauteur issue de l'autre sommet.
4. L'hypoténuse est un **diamètre** du cercle circonscrit, puisqu'elle passe par le centre et joint deux points du cercle.

Cette propriété est fondamentale et sera réutilisée en 3ᵉ : tout triangle inscrit dans un cercle et dont un côté est un diamètre est **rectangle**.
:::
:::

::: exercice 15 | entrainement | 7 min | ecran
Dans un triangle `ABC` isocèle en `A`.

1. Quelles droites issues de `A` sont confondues ?
2. Comment s'appelle cette droite unique ?
3. Cette coïncidence vaut-elle aussi pour les sommets `B` et `C` ?
4. Que se passerait-il dans un triangle équilatéral ?

::: corrige
1. La **hauteur**, la **médiane**, la **médiatrice de `[BC]`** et la **bissectrice de l'angle `A`** sont toutes confondues.
2. C'est l'**axe de symétrie** du triangle isocèle.
3. **Non.** La coïncidence ne vaut que pour le **sommet principal**, celui d'où partent les deux côtés égaux. En `B` et en `C`, les quatre droites sont distinctes, comme dans un triangle quelconque.
4. Dans un triangle **équilatéral**, la coïncidence vaut pour les **trois** sommets. Les quatre points de concours sont alors confondus en un seul point : `O = H = G = I`, le centre du triangle.
:::
:::

::: exercice 16 | approfondissement | 8 min | main
On trace un triangle `ABC`. On constate que la hauteur issue de `A` et la médiane issue de `A` sont confondues.

1. Que peut-on en déduire sur le triangle ? Justifie.
2. Rédige la démonstration en trois phrases.

::: corrige
1. Le triangle est **isocèle en `A`**.
2. Démonstration :
   « Appelons `A'` le point d'intersection de cette droite avec `[BC]`. Puisque la droite est une **médiane**, `A'` est le milieu de `[BC]`. Puisqu'elle est aussi une **hauteur**, elle est perpendiculaire à `(BC)`.
   La droite `(AA')` est donc perpendiculaire à `[BC]` et passe par son milieu : c'est la **médiatrice** de `[BC]`.
   Or tout point de la médiatrice de `[BC]` est à égale distance de `B` et de `C`. Le point `A` appartient à cette droite, donc `AB = AC` : le triangle `ABC` est **isocèle en `A`**. »

Cette démonstration est un modèle du genre : on part d'une coïncidence constatée, on en déduit qu'une droite est une médiatrice, puis on applique la propriété caractéristique de la médiatrice. C'est exactement la démarche attendue en géométrie.
:::
:::

## Série D : démontrer et devoir type

::: exercice 17 | entrainement | 7 min | main
Un point `M` vérifie `MA = MB`. Que peut-on dire de sa position ? Rédige la réponse en deux phrases.

::: corrige
« Puisque `MA = MB`, le point `M` est à égale distance des deux extrémités du segment `[AB]`. Or un point est à égale distance des deux extrémités d'un segment si et seulement si il appartient à sa **médiatrice** : le point `M` appartient donc à la médiatrice de `[AB]`. »

Remarque la formulation « si et seulement si » : elle signifie que la propriété fonctionne dans les **deux sens**. On peut donc s'en servir pour démontrer qu'un point est sur la médiatrice, comme ici, ou pour déduire une égalité de longueurs à partir d'une position sur la médiatrice.
:::
:::

::: exercice 18 | approfondissement | 8 min | main
Démontre que le centre du cercle circonscrit est à égale distance des trois sommets.

::: corrige
« Appelons `O` le point d'intersection des médiatrices de `[AB]` et de `[BC]`.

Puisque `O` appartient à la médiatrice de `[AB]`, il est à égale distance de `A` et de `B` : `OA = OB`.

Puisque `O` appartient à la médiatrice de `[BC]`, il est à égale distance de `B` et de `C` : `OB = OC`.

En combinant ces deux égalités, on obtient `OA = OB = OC`. Le point `O` est donc à égale distance des trois sommets.

On en déduit deux conséquences. D'une part, `O` est le centre d'un cercle passant par `A`, `B` et `C`, appelé cercle **circonscrit**. D'autre part, puisque `OA = OC`, le point `O` appartient également à la médiatrice de `[AC]` : les **trois** médiatrices sont donc concourantes en `O`. »

Cette démonstration est remarquable : elle établit **en même temps** l'existence du cercle circonscrit et le concours des trois médiatrices, à partir d'une seule propriété caractéristique.
:::
:::

::: exercice 19 | approfondissement | 8 min | main
Explique en deux paragraphes pourquoi deux droites d'une même famille suffisent à déterminer le point de concours, et à quoi peut servir la troisième.

::: corrige
« Les trois droites d'une même famille sont **concourantes** : elles se coupent toutes en un même point. Deux droites sécantes se coupent en un point unique, et ce point appartient nécessairement à la troisième. Tracer deux droites détermine donc entièrement le point de concours, et la troisième n'apporte aucune information nouvelle.

La troisième conserve pourtant une utilité : elle sert de **vérification**. Si, une fois tracée, elle ne passe pas par le point trouvé, c'est qu'au moins une des trois constructions est fausse. C'est particulièrement précieux pour les médiatrices et les bissectrices, où une petite imprécision de compas se voit difficilement sur le tracé lui-même mais se traduit par un décalage visible du troisième trait. »

Critères de réussite : le raisonnement sur l'intersection de deux droites sécantes, et la fonction de contrôle de la troisième clairement identifiée.
:::
:::

::: exercice 20 | approfondissement | 45 min | main
**Devoir type. Quatre parties. Barème sur 20 points, indiqué à la fin.**

**Partie A. Définitions et propriétés**

a. Définis les quatre droites remarquables du triangle.
b. Donne la propriété caractéristique de la médiatrice et celle de la bissectrice.
c. Nomme les quatre points de concours et indique lesquels sont toujours intérieurs au triangle.
d. Où se trouvent `O` et `H` dans un triangle rectangle ?

**Partie B. Constructions**

Sur une feuille blanche, construis un triangle `ABC` avec `AB = 8 cm`, `AC = 6 cm` et `BC = 7 cm`.

a. Construis son cercle circonscrit. Décris tes étapes et donne la position du centre.
b. Construis son centre de gravité. Vérifie la propriété des deux tiers par la mesure.
c. Construis son cercle inscrit. Explique comment tu obtiens le rayon.

**Partie C. Calculs**

a. Dans un triangle, la médiane `[AA']` mesure `18 cm`. Calcule `AG` et `GA'`.
b. Dans un autre triangle, `GA' = 4,5 cm`. Calcule `AG` puis `AA'`.
c. Un triangle rectangle a une hypoténuse de `13 cm`. Donne le rayon de son cercle circonscrit et la position de son orthocentre.

**Partie D. Démonstration**

a. Un point `M` vérifie `MA = MB`. Que peut-on en déduire ? Justifie en deux phrases.
b. Dans un triangle `ABC`, la bissectrice issue de `A` et la médiane issue de `A` sont confondues. Démontre que le triangle est isocèle en `A`.
c. Explique en trois phrases pourquoi les quatre points de concours sont confondus dans un triangle équilatéral.

::: corrige
**Partie A**

a. La **médiatrice** d'un côté est la droite perpendiculaire à ce côté passant par son milieu. La **hauteur** issue d'un sommet passe par ce sommet et est perpendiculaire au côté opposé. La **médiane** issue d'un sommet joint ce sommet au milieu du côté opposé. La **bissectrice** d'un angle est la demi-droite qui partage cet angle en deux angles égaux.

b. **Médiatrice** : un point appartient à la médiatrice d'un segment si et seulement si il est à **égale distance des deux extrémités** de ce segment.
   **Bissectrice** : un point appartient à la bissectrice d'un angle si et seulement si il est à **égale distance des deux côtés** de cet angle, distance mesurée perpendiculairement.

c. Le centre du **cercle circonscrit** `O`, l'**orthocentre** `H`, le **centre de gravité** `G`, le centre du **cercle inscrit** `I`.
   Toujours intérieurs : **`G` et `I`**.

d. Dans un triangle rectangle, `O` se trouve au **milieu de l'hypoténuse** et `H` au **sommet de l'angle droit**.

**Partie B**

a. Construction : tracer `[AB]` de 8 cm ; pointer en `A` avec 6 cm et en `B` avec 7 cm, l'intersection des arcs donne `C`. Puis tracer les médiatrices de `[AB]` et de `[AC]` au compas ; leur intersection donne `O` ; tracer le cercle de centre `O` passant par `A` et vérifier qu'il passe par `B` et `C`.
   **Position** : le triangle a ses trois angles aigus, `O` est donc **à l'intérieur**.

b. Placer les milieux `A'` de `[BC]` et `B'` de `[AC]`, tracer les médianes `[AA']` et `[BB']`, leur intersection donne `G`.
   Vérification : mesurer `AA'` et `AG`, puis calculer `AG ÷ AA'`. On doit trouver environ `0,67`, et `AG` doit valoir environ le double de `GA'`. Un écart d'un ou deux millimètres est normal.

c. Tracer les bissectrices des angles `A` et `B` au compas, leur intersection donne `I`. Puis tracer à l'équerre la **perpendiculaire de `I` à un côté** : la longueur de ce segment est le rayon. Tracer le cercle de centre `I` et de ce rayon ; il doit toucher les trois côtés.
   Le rayon ne se prend jamais au jugé : il se construit.

**Partie C**

a. `AG = (2/3) × 18 = **12 cm**` et `GA' = (1/3) × 18 = **6 cm**`.
   Vérification : `12 + 6 = 18` et `12 = 2 × 6`.

b. `AG = 2 × GA' = 2 × 4,5 = **9 cm**`. Puis `AA' = 9 + 4,5 = **13,5 cm**`.
   Vérification : `(2/3) × 13,5 = 9`.

c. Rayon du cercle circonscrit : `13 ÷ 2 = **6,5 cm**`, puisque le centre est au milieu de l'hypoténuse.
   L'orthocentre se trouve au **sommet de l'angle droit**.

**Partie D**

a. « Puisque `MA = MB`, le point `M` est à égale distance des deux extrémités du segment `[AB]`. Or un point est à égale distance des deux extrémités d'un segment si et seulement si il appartient à sa médiatrice : le point `M` appartient donc à la **médiatrice de `[AB]`**. »

b. « Appelons `A'` le point d'intersection de cette droite avec `[BC]`. Puisque la droite est une médiane, `A'` est le **milieu** de `[BC]`. Puisqu'elle est aussi la bissectrice de l'angle `A`, elle partage cet angle en deux angles égaux.
   Considérons les deux triangles `ABA'` et `ACA'`. Ils ont le côté `[AA']` en commun, des côtés `[BA']` et `[CA']` de même longueur puisque `A'` est le milieu de `[BC]`, et des angles en `A` de même mesure puisque `(AA')` est la bissectrice.
   Ces deux triangles ont donc deux côtés et l'angle compris entre eux de même mesure : ils sont superposables. On en déduit `AB = AC`, donc le triangle `ABC` est **isocèle en `A`**. »

c. « Dans un triangle équilatéral, les trois côtés sont de même longueur, et le triangle est donc isocèle par rapport à **chacun** de ses trois sommets. Or dans un triangle isocèle, les quatre droites remarquables issues du sommet principal sont confondues : cette coïncidence vaut donc ici pour les trois sommets à la fois.
   Les quatre familles de droites sont par conséquent constituées des **mêmes trois droites**, qui sont aussi les trois axes de symétrie du triangle. Leurs points de concours ne peuvent donc être qu'un seul et même point, d'où `O = H = G = I`. »

**Barème indicatif**
Partie A : 5 points (2 pour les quatre définitions, 1,5 pour les deux propriétés, 1 pour les points et leur position, 0,5 pour le triangle rectangle).
Partie B : 6 points (2 pour le cercle circonscrit, 2 pour le centre de gravité vérifié, 2 pour le cercle inscrit et son rayon construit).
Partie C : 4 points (1,5 pour les deux tiers, 1,5 pour le calcul inverse, 1 pour le triangle rectangle).
Partie D : 5 points (1 pour la médiatrice, 2,5 pour la démonstration de l'isocèle, 1,5 pour l'équilatéral).
:::
:::

::: cocher
- J'ai fait tous les exercices de la série A
- J'ai fait tous les exercices de la série B
- J'ai fait tous les exercices de la série C
- J'ai traité le sujet de type devoir en temps limité
- J'ai comparé chaque réponse au corrigé avant de passer à la suite
:::
