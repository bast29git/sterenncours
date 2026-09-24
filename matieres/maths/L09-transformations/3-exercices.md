---
type: exercices
matiere: maths
lecon: L09
titre: Translation et rotation : exercices corrigés
resume: 20 exercices progressifs, de la construction sur quadrillage à la reconnaissance d'une transformation et à l'analyse d'une frise, avec un corrigé détaillé pas à pas pour chacun.
duree: 3 séances de 45 min
competences:
  - Chercher
  - Représenter
  - Raisonner
  - Communiquer
objectifs:
  - Construire une image par translation et par rotation
  - Énoncer les propriétés conservées
  - Reconnaître une transformation et en trouver les éléments
  - Décrire une frise et justifier un pavage
---

::: plan
**Série A : vocabulaire et translation** (exercices 1 à 5)
**Série B : la rotation** (exercices 6 à 11)

*🔁 Pause*

**Série C : reconnaître et enchaîner** (exercices 12 à 16)
**Série D : frises, pavages et devoir type** (exercices 17 à 20)
:::

::: materiel
- Règle, compas, équerre, rapporteur
- Papier quadrillé et papier calque
:::

## Série A : vocabulaire et translation

::: exercice 1 | application | 4 min | ecran
Pour chaque transformation, indique ce qui la définit.

1. La symétrie axiale. · 2. La symétrie centrale. · 3. La translation. · 4. La rotation.

::: corrige
1. Une **droite**, appelée l'axe.
2. Un **point**, appelé le centre.
3. Un **vecteur**, qui donne une direction, un sens et une longueur.
4. Trois éléments : un **centre**, un **angle** et un **sens**.

Retiens que la rotation est la seule qui demande trois éléments. Un énoncé qui n'en donne que deux ne définit rien.
:::
:::

::: exercice 2 | application | 5 min | ecran
Sur un quadrillage, `A(1 ; 2)` a pour image `A'(5 ; 4)` par une translation.

1. Décris le déplacement en carreaux.
2. Donne l'image de `B(3 ; 1)`.
3. Donne l'image de `C(0 ; 6)`.
4. Donne l'antécédent de `D'(7 ; 7)`.

::: corrige
1. De `1` à `5` en abscisse : **4 carreaux vers la droite**. De `2` à `4` en ordonnée : **2 carreaux vers le haut**.
2. `B'(3 + 4 ; 1 + 2) = **B'(7 ; 3)**`.
3. `C'(0 + 4 ; 6 + 2) = **C'(4 ; 8)**`.
4. On applique le déplacement **à l'envers** : `D(7 − 4 ; 7 − 2) = **D(3 ; 5)**`.

Le point 4 est le seul qui demande de réfléchir : pour remonter à l'antécédent, on soustrait au lieu d'ajouter.
:::
:::

::: exercice 3 | application | 6 min | ecran
Sur papier quadrillé, place le triangle `ABC` avec `A(1 ; 2)`, `B(4 ; 2)`, `C(2 ; 5)`.

1. Construis son image par la translation « 3 carreaux à droite, 1 carreau vers le bas ».
2. Donne les coordonnées des trois images.
3. Vérifie une longueur.

::: corrige
1. On applique le déplacement à chaque sommet, **un à la fois**.
2. `A'(1 + 3 ; 2 − 1) = **A'(4 ; 1)**` · `B'(4 + 3 ; 2 − 1) = **B'(7 ; 1)**` · `C'(2 + 3 ; 5 − 1) = **C'(5 ; 4)**`.
3. `AB` est horizontal et mesure `4 − 1 = 3` carreaux. `A'B'` est horizontal aussi et mesure `7 − 4 = 3` carreaux. La longueur est bien **conservée**.

Vérification supplémentaire possible : `AA'C'C` doit être un parallélogramme, puisque `A` et `C` se déplacent du même vecteur.
:::
:::

::: exercice 4 | entrainement | 6 min | ecran
Vrai ou faux ? Justifie chaque réponse en une phrase.

1. Une translation peut avoir un point invariant.
2. Une translation conserve les aires.
3. Une translation retourne la figure.
4. Deux translations de sens opposés ont la même direction.

::: corrige
1. **Faux**, sauf si le vecteur est nul, auquel cas la figure ne bouge pas. Une translation de vecteur non nul déplace **tous** les points sans exception.
2. **Vrai.** Les quatre transformations du chapitre conservent les longueurs, donc les aires.
3. **Faux.** Seule la symétrie axiale retourne la figure. Une translation la fait simplement **glisser**, en conservant le sens de parcours.
4. **Vrai.** La direction est celle de la droite, elle est identique ; seul le **sens**, c'est-à-dire le parcours emprunté sur cette droite, diffère.
:::
:::

::: exercice 5 | entrainement | 7 min | main
On donne trois points : `A(2 ; 1)`, `B(5 ; 3)` et `M(1 ; 4)`.

1. Construis l'image `M'` de `M` par la translation qui transforme `A` en `B`.
2. Quel quadrilatère forment `A`, `B`, `M'` et `M` ? Justifie.
3. Vérifie ta construction par le calcul des coordonnées.

::: corrige
1. La translation qui envoie `A(2 ; 1)` sur `B(5 ; 3)` correspond au déplacement « 3 à droite, 2 en haut ». Appliqué à `M(1 ; 4)`, il donne `M'(4 ; 6)`.
2. `ABM'M` est un **parallélogramme**. En effet, `[AM']` et `[BM]` ont le même milieu : le milieu de `[AM']` est `((2+4)÷2 ; (1+6)÷2) = (3 ; 3,5)`, et celui de `[BM]` est `((5+1)÷2 ; (3+4)÷2) = (3 ; 3,5)`. Un quadrilatère dont les diagonales ont le même milieu est un parallélogramme.
3. `M'(1 + 3 ; 4 + 2) = (4 ; 6)`. Le calcul confirme la construction.

C'est la caractérisation de la translation : `M'` est l'image de `M` par la translation qui transforme `A` en `B` exactement quand `ABM'M` est un parallélogramme.
:::
:::

## Série B : la rotation

::: exercice 6 | application | 5 min | main
Pour chaque rotation, dis si l'énoncé est complet. Si non, précise ce qui manque.

1. « La rotation de centre `O` et d'angle `60°` dans le sens horaire. »
2. « La rotation de centre `O` et d'angle `90°`. »
3. « La rotation d'angle `45°` dans le sens antihoraire. »
4. « La rotation de centre `O` et d'angle `180°`. »

::: corrige
1. **Complet** : centre, angle et sens sont donnés.
2. **Incomplet** : il manque le **sens**. Il existe deux rotations de centre `O` et d'angle `90°`, et elles donnent des images différentes.
3. **Incomplet** : il manque le **centre**.
4. **Complet**, exceptionnellement. À `180°`, les deux sens donnent le même résultat : le sens devient inutile. C'est le seul angle dans ce cas, et cette rotation est la symétrie centrale de centre `O`.
:::
:::

::: exercice 7 | application | 7 min | main
Place un point `O` et un point `M` tel que `OM = 5 cm`.

1. Construis l'image `M'` de `M` par la rotation de centre `O`, d'angle `90°`, dans le sens antihoraire.
2. Construis l'image `M''` de `M` par la même rotation dans le sens horaire.
3. Mesure `M'M''`. Que constates-tu ?

::: corrige
1. On trace `[OM]`, on reporte `90°` au rapporteur depuis `[OM]` en tournant dans le sens antihoraire, puis on place `M'` à `5 cm` de `O` sur la demi-droite obtenue.
2. Même méthode, mais en tournant dans l'autre sens : `M''` se retrouve de l'autre côté de `[OM]`.
3. L'angle `M'OM''` vaut `90 + 90 = 180°`. Les points `M'`, `O` et `M''` sont donc **alignés**, et `O` est le milieu de `[M'M'']`. La longueur `M'M''` vaut `5 + 5 = **10 cm**`.

Cet exercice montre concrètement pourquoi le sens est indispensable : les deux images sont distantes de 10 cm.
:::
:::

::: exercice 8 | application | 5 min | main
Sur quadrillage, le centre `O` est à l'origine. Le point `A` est repéré par le déplacement « 3 à droite, 2 en haut » depuis `O`.

1. Donne le déplacement de l'image de `A` par la rotation de `90°` dans le sens antihoraire.
2. Donne celui par la rotation de `90°` dans le sens horaire.
3. Donne celui par la rotation de `180°`.

::: corrige
1. On **échange** les deux nombres et on change le signe du premier : « **2 à gauche, 3 en haut** ».
2. On échange et on change le signe du second : « **2 à droite, 3 en bas** ».
3. On change les deux signes : « **3 à gauche, 2 en bas** ». C'est bien la symétrie centrale de centre `O`.

Vérification : appliquer deux fois la rotation de `90°` antihoraire à « 3 droite, 2 haut » donne d'abord « 2 gauche, 3 haut », puis « 3 gauche, 2 bas ». On retrouve bien le résultat du point 3.
:::
:::

::: exercice 9 | entrainement | 7 min | main
Trace un triangle `ABC` quelconque et place un point `O` à l'extérieur du triangle.

1. Construis l'image de `ABC` par la rotation de centre `O` et d'angle `90°` dans le sens horaire.
2. Vérifie ta construction au papier calque.
3. Mesure `BC` et `B'C'`. Que constates-tu ?

::: corrige
1. On construit l'image de **chaque sommet** séparément, par la méthode en quatre étapes : tracer `[OA]`, reporter `90°` dans le sens horaire, tracer la demi-droite, reporter `OA` au compas. On recommence pour `B` et pour `C`, puis on relie `A'`, `B'` et `C'` **dans le même ordre**.
2. On décalque le triangle et le point `O`, on plante la pointe du compas sur `O` et on fait tourner le calque d'un quart de tour dans le sens horaire. Les sommets décalqués doivent tomber exactement sur `A'`, `B'` et `C'`.
3. `BC = B'C'`. La rotation **conserve les longueurs**, comme les trois autres transformations du chapitre. Si tu trouves une différence de plus d'un millimètre, c'est une erreur de construction, pas une propriété.
:::
:::

::: exercice 10 | entrainement | 6 min | main
Complète ce tableau des propriétés.

| Propriété | Sym. axiale | Sym. centrale | Translation | Rotation |
|---|---|---|---|---|
| Longueurs | ……… | ……… | ……… | ……… |
| Angles | ……… | ……… | ……… | ……… |
| Sens de parcours | ……… | ……… | ……… | ……… |

::: corrige
| Propriété | Sym. axiale | Sym. centrale | Translation | Rotation |
|---|---|---|---|---|
| Longueurs | conservées | conservées | conservées | conservées |
| Angles | conservés | conservés | conservés | conservés |
| **Sens de parcours** | **inversé** | conservé | conservé | conservé |

Les deux premières lignes sont entièrement remplies de « conservées » : c'est vrai aussi pour les aires, le parallélisme, l'alignement et les milieux. Une seule ligne distingue les quatre transformations, la dernière.
:::
:::

::: exercice 11 | approfondissement | 8 min | main
Un carré `ABCD` de centre `O` est tracé, les sommets nommés dans le sens horaire.

1. Quelle est l'image de `A` par la rotation de centre `O`, d'angle `90°`, dans le sens horaire ?
2. Quelle est l'image du carré par cette rotation ?
3. Pour quels angles la rotation de centre `O` laisse-t-elle le carré globalement inchangé ?
4. Même question pour un triangle équilatéral de centre `O`.

::: corrige
1. Les quatre sommets sont à égale distance de `O` et régulièrement espacés de `360 ÷ 4 = 90°`. Une rotation de `90°` dans le sens horaire envoie donc `A` sur le sommet suivant dans ce sens, c'est-à-dire **`B`**.
2. Le carré est envoyé **sur lui-même** : `A` va en `B`, `B` en `C`, `C` en `D` et `D` en `A`. La figure est globalement inchangée, même si les sommets ont changé de place.
3. Pour les angles multiples de `90°` : **`90°`, `180°`, `270°` et `360°`**. Le carré a un axe de symétrie de rotation d'ordre 4.
4. Le triangle équilatéral a trois sommets régulièrement espacés de `360 ÷ 3 = 120°`. Les angles sont donc **`120°`, `240°` et `360°`**.

Règle générale : un polygone régulier à `n` côtés est inchangé par les rotations d'angle multiple de `360 ÷ n` degrés autour de son centre.
:::
:::

*🔁 Pause. Reprends après une vraie coupure.*

## Série C : reconnaître et enchaîner

::: exercice 12 | entrainement | 7 min | main
Pour chaque description, identifie la transformation.

1. La figure a glissé de 5 carreaux vers la droite, sans changer d'orientation.
2. La lettre `R` de la figure apparaît en miroir sur l'image.
3. La figure est à l'envers, et le milieu de chaque segment reliant un point à son image est toujours le même point.
4. La figure a tourné d'un quart de tour autour d'un point.

::: corrige
1. Une **translation**. Aucun retournement, aucune rotation, un simple glissement identique pour tous les points.
2. Une **symétrie axiale**. C'est la seule transformation qui inverse le sens de parcours, donc qui produit un effet de miroir.
3. Une **symétrie centrale**, de centre ce point commun. C'est aussi la rotation de `180°` de même centre.
4. Une **rotation** de `90°`. Pour la décrire complètement, il resterait à préciser le centre et le sens.

La méthode en quatre questions de la fiche de cours traite ces quatre cas dans l'ordre.
:::
:::

::: exercice 13 | entrainement | 7 min | main
Deux triangles `ABC` et `A'B'C'` sont superposables, et `A'B'C'` n'est pas retourné par rapport à `ABC`.

1. Quelles transformations restent possibles ?
2. Comment décides-tu entre elles ?
3. Si c'est une rotation, comment trouves-tu le centre ?

::: corrige
1. Puisque la figure n'est pas retournée, on élimine la symétrie axiale. Restent la **translation**, la **symétrie centrale** et la **rotation**.
2. On trace les segments `[AA']`, `[BB']` et `[CC']`. S'ils sont **parallèles et de même longueur**, c'est une **translation**. S'ils se coupent tous en un même point qui est le **milieu** de chacun, c'est une **symétrie centrale**. Sinon, c'est une **rotation**.
3. On trace la **médiatrice** de `[AA']` et la **médiatrice** de `[BB']`. Leur point d'intersection est le centre `O`. On mesure ensuite l'angle `AOA'` au rapporteur pour obtenir l'angle, et on observe le sens du parcours pour le préciser.

Pourquoi les médiatrices ? Parce que le centre est à égale distance de `A` et de `A'`, donc sur la médiatrice de `[AA']` ; et à égale distance de `B` et de `B'`, donc sur celle de `[BB']`.
:::
:::

::: exercice 14 | entrainement | 6 min | main
Complète.

1. L'enchaînement de deux translations donne ………
2. L'enchaînement de deux symétries centrales donne ………
3. L'enchaînement de deux symétries axiales d'axes parallèles donne ………
4. L'enchaînement de deux symétries axiales d'axes sécants donne ………

::: corrige
1. Une **translation**, dont le déplacement est la somme des deux déplacements.
2. Une **translation**.
3. Une **translation**, dont la longueur vaut le **double** de la distance entre les deux axes, dans la direction perpendiculaire aux axes.
4. Une **rotation**, de centre le point d'intersection des deux axes.

Le principe commun : chaque symétrie axiale retourne la figure. Deux symétries axiales la retournent donc deux fois, ce qui la remet à l'endroit. La composée ne retourne pas, elle est donc soit une translation, soit une rotation.
:::
:::

::: exercice 15 | entrainement | 7 min | main
Deux droites parallèles `(d1)` et `(d2)` sont distantes de `3 cm`. Un point `M` se trouve à `1 cm` de `(d1)`, du côté opposé à `(d2)`.

1. Construis `M1`, symétrique de `M` par rapport à `(d1)`.
2. Construis `M2`, symétrique de `M1` par rapport à `(d2)`.
3. Calcule `MM2`.
4. Quelle transformation envoie `M` sur `M2` ?

::: corrige
Plaçons-nous sur un axe perpendiculaire aux deux droites, gradué en centimètres. Posons `(d1)` à la graduation `0` et `(d2)` à la graduation `3`. Le point `M` est à `1 cm` de `(d1)` du côté opposé à `(d2)`, donc à la graduation `−1`.

1. `M1` est le symétrique de `M` par rapport à `(d1)` : il est à la même distance de l'autre côté, donc à la graduation `+1`.
2. `M2` est le symétrique de `M1` par rapport à `(d2)` : `M1` est à `3 − 1 = 2 cm` de `(d2)`, donc `M2` est à `2 cm` de l'autre côté, à la graduation `3 + 2 = 5`.
3. `MM2 = 5 − (−1) = **6 cm**`.
4. C'est une **translation**, perpendiculaire aux deux axes. Sa longueur, `6 cm`, vaut bien le **double** de la distance entre les deux droites, `3 cm`. Ce résultat ne dépend pas de la position de `M` : essaie avec un autre point de départ, tu retrouveras `6 cm`.
:::
:::

::: exercice 16 | approfondissement | 8 min | main
Sur un quadrillage, on place `A(1 ; 1)`, `B(4 ; 1)`, `C(4 ; 3)` et leurs images `A'(1 ; 5)`, `B'(1 ; 2)`, `C'(3 ; 2)`.

1. Les longueurs sont-elles conservées ? Vérifie sur deux côtés.
2. Les segments `[AA']`, `[BB']`, `[CC']` ont-ils tous le même déplacement ?
3. Trouve le centre de la transformation par le calcul.
4. Donne l'angle et le sens.

::: corrige
1. `AB` est horizontal, de longueur `4 − 1 = 3`. `A'B'` est vertical, de longueur `5 − 2 = 3`. Égalité vérifiée.
   `BC` est vertical, de longueur `3 − 1 = 2`. `B'C'` est horizontal, de longueur `3 − 1 = 2`. Égalité vérifiée aussi.
   Les longueurs sont donc **conservées** : il s'agit bien d'une des transformations du chapitre.

2. `A` à `A'` : de `(1 ; 1)` à `(1 ; 5)`, soit le déplacement « 0 et +4 ».
   `B` à `B'` : de `(4 ; 1)` à `(1 ; 2)`, soit « −3 et +1 ».
   Les deux déplacements sont **différents**, ce n'est donc **pas une translation**.

3. Le centre `O(x ; y)` est à égale distance de chaque point et de son image.
   **De `OA = OA'`** : `(x − 1)² + (y − 1)² = (x − 1)² + (y − 5)²`. Les termes en `x` se simplifient, il reste `(y − 1)² = (y − 5)²`, d'où `y = **3**`.
   **De `OB = OB'`**, avec `y = 3` : `(x − 4)² + (3 − 1)² = (x − 1)² + (3 − 2)²`
   `x² − 8x + 16 + 4 = x² − 2x + 1 + 1`
   `−8x + 20 = −2x + 2`, donc `6x = 18` et `x = **3**`.
   Le centre est **`O(3 ; 3)`**.

4. Depuis `O`, le point `A(1 ; 1)` correspond au déplacement « −2 et −2 », et son image `A'(1 ; 5)` au déplacement « −2 et +2 ».
   Pour passer de « −2 et −2 » à « −2 et +2 » sur quadrillage, on échange les deux nombres et on change le signe du second : c'est la règle de la rotation de `90°` dans le **sens horaire**.
   Vérifions sur `B` : depuis `O`, `B(4 ; 1)` correspond à « +1 et −2 ». Après échange et changement de signe du second, on obtient « −2 et −1 », ce qui donne `(3 − 2 ; 3 − 1) = (1 ; 2)`, soit exactement `B'`. La règle se confirme.

**Réponse complète** : rotation de centre `O(3 ; 3)`, d'angle `90°`, dans le sens horaire.
:::
:::

## Série D : frises, pavages et devoir type

::: exercice 17 | entrainement | 8 min | main
Sterenn dessine aux feutres une frise pour la couverture de son carnet. Observe une frise formée d'un motif en forme de `L` répété horizontalement, chaque motif étant décalé de 2 carreaux vers la droite, tous à l'endroit.

1. Quel est le motif de base ?
2. Quelle transformation passe d'un motif au suivant ?
3. Existe-t-il un axe de symétrie horizontal ? Justifie.
4. Décris une frise obtenue à partir du même motif mais avec un demi-tour sur deux.

::: corrige
1. Le motif de base est le `L` seul, c'est le plus petit élément qui, répété, engendre toute la frise.
2. Une **translation** horizontale de 2 carreaux vers la droite.
3. **Non**, pas ici. Un axe de symétrie horizontal exigerait que le motif soit lui-même symétrique par rapport à cet axe, ce que la forme en `L` n'est pas : son symétrique serait un `L` retourné vers le haut.
4. Un motif sur deux serait tourné de `180°`, c'est-à-dire à l'envers. La frise serait alors invariante par une **rotation de demi-tour** centrée entre deux motifs consécutifs, en plus de la translation qui passe d'un motif au motif de même sens, soit 4 carreaux.
:::
:::

::: exercice 18 | entrainement | 7 min | main
1. Quels polygones réguliers pavent le plan à eux seuls ?
2. Justifie par un calcul d'angles.
3. Pourquoi le pentagone régulier ne convient-il pas ?

::: corrige
1. Le **triangle équilatéral**, le **carré** et l'**hexagone régulier**.
2. Autour d'un sommet du pavage, les angles doivent totaliser exactement `360°`, sans trou ni chevauchement.
   Triangle équilatéral : angle de `60°`, et `360 ÷ 60 = 6`. Six triangles se rejoignent en chaque sommet.
   Carré : angle de `90°`, et `360 ÷ 90 = 4`. Quatre carrés se rejoignent.
   Hexagone régulier : angle de `120°`, et `360 ÷ 120 = 3`. Trois hexagones se rejoignent.
3. L'angle du pentagone régulier vaut `108°`. Or `360 ÷ 108 ≈ 3,33` : ce n'est pas un nombre entier. Trois pentagones laissent un trou de `360 − 324 = 36°`, et quatre se chevaucheraient de `432 − 360 = 72°`. Aucun assemblage n'est donc possible.

La condition est purement arithmétique : l'angle du polygone doit **diviser exactement** `360°`.
:::
:::

::: exercice 19 | approfondissement | 8 min | main
On veut prouver qu'une translation conserve les longueurs.

Soient `A` et `B` deux points, et `A'` et `B'` leurs images par une même translation.

1. Que peut-on dire des quadrilatères formés ?
2. Rédige la démonstration en trois phrases.

::: corrige
1. Par définition de la translation, `A` et `B` subissent le **même déplacement**. Le quadrilatère `ABB'A'` a donc `[AA']` et `[BB']` parallèles et de même longueur.
2. Démonstration :
   « Par définition de la translation, les segments `[AA']` et `[BB']` sont parallèles et de même longueur. Un quadrilatère qui possède deux côtés opposés parallèles et de même longueur est un **parallélogramme** : `ABB'A'` en est donc un. Or, dans un parallélogramme, les côtés opposés ont la même longueur, donc `A'B' = AB` : la translation conserve bien les longueurs. »

Cette démonstration utilise une propriété du parallélogramme vue en 5ᵉ. Elle montre que les propriétés des transformations ne sont pas des règles arbitraires : elles se démontrent.
:::
:::

::: exercice 20 | approfondissement | 45 min | main
**Devoir type. Quatre parties. Barème sur 20 points, indiqué à la fin.**

**Partie A. Vocabulaire et propriétés**

a. Indique ce qui définit chacune des quatre transformations du chapitre.
b. Cite quatre propriétés conservées par toutes les quatre.
c. Quelle propriété n'est pas conservée par la symétrie axiale ? Explique en une phrase ce que cela signifie concrètement.
d. À quelle transformation la rotation de `180°` est-elle égale ? Pourquoi le sens n'y change-t-il rien ?

**Partie B. Construction par translation**

Sur papier quadrillé, place `A(2 ; 1)`, `B(6 ; 1)`, `C(6 ; 4)`, `D(2 ; 4)`.

a. Quelle est la nature du quadrilatère `ABCD` ? Justifie.
b. Construis son image par la translation « 2 carreaux à gauche, 3 carreaux vers le haut ». Donne les coordonnées des quatre images.
c. Calcule l'aire de `ABCD` et celle de son image. Que constates-tu ?
d. Donne l'antécédent du point `P'(1 ; 6)` par cette même translation.

**Partie C. Construction par rotation**

Sur papier quadrillé, place `O(4 ; 4)`, `E(7 ; 4)` et `F(7 ; 6)`.

a. Construis l'image de `E` par la rotation de centre `O`, d'angle `90°`, dans le sens antihoraire. Donne ses coordonnées.
b. Fais de même pour `F`.
c. Vérifie que `EF = E'F'`.
d. Quelle serait l'image de `E` par la rotation de centre `O` et d'angle `180°` ? Quelle autre transformation donne le même résultat ?

**Partie D. Reconnaître et justifier**

a. Deux figures superposables ne sont pas retournées l'une par rapport à l'autre. Quelles transformations restent possibles ? Comment trancher entre elles ?
b. Explique en trois phrases comment trouver le centre d'une rotation à partir de deux points et de leurs images.
c. Un élève affirme : « un octogone régulier pave le plan à lui seul ». Réfute cette affirmation par un calcul. L'angle d'un octogone régulier vaut `135°`.

::: corrige
**Partie A**

a. La **symétrie axiale** est définie par une **droite**, son axe. La **symétrie centrale** est définie par un **point**, son centre. La **translation** est définie par un **vecteur**, qui donne une direction, un sens et une longueur. La **rotation** est définie par trois éléments : un **centre**, un **angle** et un **sens**.

b. Quatre parmi : les **longueurs**, les **angles**, les **aires**, le **parallélisme**, l'**alignement**, les **milieux**.

c. Le **sens de parcours**. Concrètement, si l'on parcourt la figure de départ dans le sens des aiguilles d'une montre, on parcourt son image par symétrie axiale dans le sens inverse : la figure apparaît « en miroir », comme la lettre `R` réfléchie dans une glace.

d. À la **symétrie centrale** de même centre. Le sens n'y change rien parce qu'un demi-tour dans un sens et un demi-tour dans l'autre amènent au même endroit : tourner de `180°` à droite ou de `180°` à gauche conduit exactement au point diamétralement opposé. C'est le seul angle pour lequel cela se produit.

**Partie B**

a. `ABCD` est un **rectangle**. En effet, `AB` est horizontal de longueur `6 − 2 = 4`, `DC` est horizontal de longueur `4` également, `AD` est vertical de longueur `4 − 1 = 3`, et `BC` est vertical de longueur `3`. Les côtés opposés sont parallèles deux à deux et les angles sont droits, puisque les côtés sont alternativement horizontaux et verticaux.

b. On applique « −2 en abscisse, +3 en ordonnée » à chaque sommet :
   `A'(0 ; 4)` · `B'(4 ; 4)` · `C'(4 ; 7)` · `D'(0 ; 7)`.

c. Aire de `ABCD` : `4 × 3 = **12** unités d'aire`. Aire de l'image : `A'B' = 4 − 0 = 4` et `A'D' = 7 − 4 = 3`, donc `4 × 3 = **12**`. Les deux aires sont **égales** : la translation conserve les aires, comme les trois autres transformations du chapitre.

d. Pour remonter à l'antécédent, on applique le déplacement **inverse**, soit « +2 en abscisse, −3 en ordonnée » : `P(1 + 2 ; 6 − 3) = **P(3 ; 3)**`.

**Partie C**

a. Depuis `O(4 ; 4)`, le point `E(7 ; 4)` correspond au déplacement « +3 et 0 ». Pour une rotation de `90°` antihoraire, on échange les deux nombres et on change le signe du premier : « 0 et +3 ». D'où `E'(4 + 0 ; 4 + 3) = **E'(4 ; 7)**`.

b. Depuis `O`, le point `F(7 ; 6)` correspond à « +3 et +2 ». Après échange et changement de signe du premier : « −2 et +3 ». D'où `F'(4 − 2 ; 4 + 3) = **F'(2 ; 7)**`.

c. `EF` : de `(7 ; 4)` à `(7 ; 6)`, segment vertical de longueur `2`. `E'F'` : de `(4 ; 7)` à `(2 ; 7)`, segment horizontal de longueur `2`. Les deux longueurs sont **égales**, la rotation conserve bien les longueurs. Remarque que le segment a changé de direction, ce qui est normal : c'est la **longueur** qui est conservée, pas la direction.

d. Pour une rotation de `180°`, on change les deux signes du déplacement : « +3 et 0 » devient « −3 et 0 ». D'où l'image `(4 − 3 ; 4) = **(1 ; 4)**`. La même image s'obtient par la **symétrie centrale de centre `O`**, puisque la rotation de `180°` et la symétrie centrale de même centre sont une seule et même transformation.

**Partie D**

a. Puisque les figures ne sont pas retournées, la **symétrie axiale** est éliminée. Restent la **translation**, la **symétrie centrale** et la **rotation**. Pour trancher, on trace les segments joignant chaque point à son image. S'ils sont parallèles et de même longueur, c'est une **translation**. S'ils se coupent tous en un même point qui est le milieu de chacun, c'est une **symétrie centrale**. Sinon, c'est une **rotation**.

b. « Le centre de la rotation est à égale distance de `A` et de son image `A'`, il appartient donc à la **médiatrice** de `[AA']`. Pour la même raison, il appartient à la médiatrice de `[BB']`. En traçant ces deux médiatrices, on obtient le centre `O` à leur intersection ; il reste à mesurer l'angle `AOA'` au rapporteur et à observer le sens du parcours pour décrire complètement la rotation. »

c. La condition pour qu'un polygone régulier pave le plan à lui seul est que son angle **divise exactement** `360°`, afin que plusieurs exemplaires se rejoignent parfaitement autour d'un sommet.
   Or `360 ÷ 135 ≈ 2,67`, qui n'est pas un nombre entier. Deux octogones laissent un trou de `360 − 270 = 90°`, et trois se chevaucheraient de `405 − 360 = 45°`.
   L'affirmation est donc **fausse** : l'octogone régulier ne pave pas le plan seul. Il le pave en revanche **avec des carrés**, dont l'angle de `90°` comble exactement le trou laissé par deux octogones : c'est un pavage bien connu, mais il utilise deux polygones différents, pas un seul.

**Barème indicatif**
Partie A : 5 points (2 pour les quatre définitions, 1 pour les propriétés, 1 pour le sens de parcours, 1 pour la rotation de 180°).
Partie B : 5 points (1 pour la nature justifiée, 2 pour la construction et les coordonnées, 1 pour les aires, 1 pour l'antécédent).
Partie C : 5 points (1,5 + 1,5 pour les deux images, 1 pour la vérification, 1 pour la rotation de 180°).
Partie D : 5 points (1,5 pour le tri des transformations, 1,5 pour la méthode du centre, 2 pour la réfutation chiffrée).
:::
:::

::: cocher
- J'ai fait tous les exercices de la série A
- J'ai fait tous les exercices de la série B
- J'ai fait tous les exercices de la série C
- J'ai traité le sujet de type devoir en temps limité
- J'ai comparé chaque réponse au corrigé avant de passer à la suite
:::
