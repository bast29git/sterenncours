---
type: cours
matiere: maths
lecon: L09
titre: Translation et rotation
resume: Les transformations du plan : symétrie axiale et centrale rappelées, translation définie par un vecteur, rotation définie par un centre, un angle et un sens, propriétés conservées, et reconnaissance d'une transformation dans une frise ou un pavage.
duree: 3 séances de 45 min
competences:
  - Chercher
  - Représenter
  - Raisonner
  - Communiquer
objectifs:
  - Rappeler les deux symétries et leurs propriétés
  - Construire l'image d'un point et d'une figure par une translation
  - Construire l'image d'un point et d'une figure par une rotation
  - Énoncer les propriétés conservées par ces transformations
  - Reconnaître la transformation qui envoie une figure sur une autre
  - Décrire une frise ou un pavage
---

::: plan
**Séance 1 : rappels et translation**

1. Ce qu'est une transformation
2. Les deux symétries, rappel
3. La translation
4. Construire une image par translation

*🔁 Pause de 5 minutes*

**Séance 2 : la rotation**

5. La rotation
6. Construire une image par rotation
7. Les cas particuliers
8. Les propriétés conservées

**Séance 3 : reconnaître et décrire**

9. Reconnaître une transformation
10. Enchaîner deux transformations
11. Frises et pavages
12. Les pièges à éviter
:::

::: materiel
- Une règle graduée, un compas, une équerre
- Un rapporteur
- Du papier quadrillé et du papier calque
:::

## 1. Ce qu'est une transformation

::: definition Transformation
Une **transformation du plan** associe à chaque point du plan un **unique** point, appelé son **image**.
La figure de départ s'appelle l'**antécédent**, la figure obtenue s'appelle l'**image**.
:::

::: grille
| Transformation | Définie par | Notation usuelle |
|---|---|---|
| **Symétrie axiale** | un **axe**, une droite | `s` d'axe `(d)` |
| **Symétrie centrale** | un **centre**, un point | `s` de centre `O` |
| **Translation** | un **vecteur** | `t` de vecteur donné |
| **Rotation** | un **centre**, un **angle**, un **sens** | `r` de centre `O` |
:::

::: retenir Le point commun des quatre
Toutes conservent les **longueurs**, les **angles**, les **aires** et le **parallélisme**.
On dit qu'elles produisent une figure **superposable** à celle de départ.
C'est ce qui les distingue d'un agrandissement ou d'une réduction.
:::

## 2. Les deux symétries, rappel

::: definition Symétrie axiale
Le symétrique d'un point `M` par rapport à une droite `(d)` est le point `M'` tel que `(d)` soit la **médiatrice** du segment `[MM']`.
Autrement dit : `(d)` est perpendiculaire à `[MM']` et passe par son milieu.
:::

::: definition Symétrie centrale
Le symétrique d'un point `M` par rapport à un point `O` est le point `M'` tel que `O` soit le **milieu** du segment `[MM']`.
C'est aussi la rotation de centre `O` et d'angle `180°`.
:::

::: grille
| | **Symétrie axiale** | **Symétrie centrale** |
|---|---|---|
| Définie par | une droite | un point |
| Effet sur la figure | elle est **retournée** | elle est **remise à l'endroit** |
| Sens de parcours | **inversé** | **conservé** |
| Point invariant | tous ceux de l'axe | le centre seulement |
:::

::: piege Le sens de parcours
Dans une symétrie **axiale**, si on parcourt la figure `ABC` dans le sens des aiguilles d'une montre, on parcourt `A'B'C'` dans le **sens inverse**.
C'est le seul des quatre cas où cela se produit. C'est pourquoi on dit qu'une symétrie axiale « retourne » la figure.
:::

## 3. La translation

::: definition Translation
Une **translation** fait **glisser** toute la figure, sans la tourner ni la retourner.
Elle est définie par un **vecteur**, qui donne à la fois une **direction**, un **sens** et une **longueur**.
:::

::: formule
**La caractérisation d'une translation**
`M'` est l'image de `M` par la translation qui transforme `A` en `B` lorsque :
`ABM'M` est un **parallélogramme**.

Autrement dit : `[AM']` et `[BM]` ont le **même milieu**, et `(AB)` est parallèle à `(MM')` avec `AB = MM'`.
:::

::: exemple Une translation sur quadrillage
Sur un quadrillage, une translation se décrit par un **déplacement** : « 3 carreaux à droite et 2 carreaux vers le haut ».
Chaque point de la figure subit **exactement** ce même déplacement.
Si `A(1 ; 1)` a pour image `A'(4 ; 3)`, alors `B(2 ; 5)` a pour image `B'(5 ; 7)`.
:::

::: retenir Ce qui caractérise la translation
**Tous** les points se déplacent de la même façon : même direction, même sens, même longueur.
Aucun point n'est invariant, sauf si le vecteur est nul.
:::

::: piege Direction et sens ne sont pas la même chose
La **direction** est celle de la droite : horizontale, verticale, oblique.
Le **sens** précise lequel des deux parcours possibles on emprunte sur cette direction.
Une translation vers la droite et une translation vers la gauche ont la même direction mais des sens opposés.
:::

## 4. Construire une image par translation

::: methode Construire l'image d'un point, en trois étapes
1. Repère le déplacement : combien de carreaux horizontalement, combien verticalement, et dans quel sens.
2. Applique **exactement** ce déplacement au point à transformer.
3. Vérifie que le quadrilatère formé par les deux points de départ et les deux images est bien un parallélogramme.
:::

::: methode Construire l'image d'une figure
1. Construis l'image de **chaque sommet** séparément.
2. Relie les images dans le **même ordre** que la figure de départ.
3. Vérifie une longueur : elle doit être identique à celle de la figure de départ.
:::

::: exemple Un triangle translaté
Triangle `ABC` avec `A(1 ; 2)`, `B(4 ; 2)`, `C(2 ; 5)`.
Translation : 3 carreaux à droite, 1 carreau vers le bas.
Images : `A'(4 ; 1)`, `B'(7 ; 1)`, `C'(5 ; 4)`.

Vérification : `AB = 3` et `A'B' = 7 − 4 = 3`. La longueur est conservée.
:::

::: aide Si tu perds le fil sur le quadrillage
Compte les carreaux **un point à la fois**, en notant le déplacement au crayon à côté de chaque sommet.
Ne traite jamais deux sommets en même temps : c'est là que les erreurs se glissent.
:::

🔁 **Point de pause.** Reprends après cinq minutes. La suite introduit la transformation la plus délicate du chapitre.

## 5. La rotation

::: definition Rotation
Une **rotation** fait **tourner** la figure autour d'un point fixe.
Elle est définie par trois éléments : un **centre**, un **angle** et un **sens**.
:::

::: formule
**La caractérisation d'une rotation**
`M'` est l'image de `M` par la rotation de centre `O`, d'angle `a` et de sens donné lorsque :
`OM' = OM` **et** l'angle `MOM'` vaut `a`, mesuré dans le sens indiqué.
:::

::: grille
| Élément | Rôle |
|---|---|
| **Le centre** | le point fixe autour duquel tout tourne |
| **L'angle** | de combien de degrés on tourne |
| **Le sens** | horaire, comme les aiguilles d'une montre, ou antihoraire |
:::

::: piege Les trois éléments sont indispensables
« La rotation de centre `O` et d'angle `90°` » ne définit **rien** : il en existe deux, une dans chaque sens, qui donnent des images différentes.
Un énoncé complet précise toujours le sens.
:::

::: retenir Le seul point invariant
Le **centre** `O` est le seul point qui ne bouge pas, puisque `OO = 0`.
Tous les autres points décrivent un arc de cercle centré en `O`.
:::

## 6. Construire une image par rotation

::: methode Construire l'image d'un point, en quatre étapes
1. Trace le segment `[OM]`.
2. Reporte l'angle demandé au rapporteur, à partir de `[OM]`, **dans le sens indiqué**.
3. Trace la demi-droite obtenue.
4. Au compas, reporte la longueur `OM` sur cette demi-droite : tu obtiens `M'`.
:::

::: exemple Une rotation de 90°
Point `M`, centre `O`, rotation de `90°` dans le sens antihoraire.
On mesure `OM = 4 cm`.
On trace `[OM]`, on reporte `90°` depuis `[OM]` en tournant dans le sens antihoraire, puis on place `M'` à `4 cm` de `O` sur la nouvelle demi-droite.
Vérification : `OM' = OM = 4 cm`.
:::

::: methode Sur quadrillage, la rotation de 90° est immédiate
Quand le centre est un nœud du quadrillage et l'angle vaut `90°`, on n'a pas besoin du rapporteur.
Le déplacement « 3 à droite, 2 en haut » devient, après une rotation de `90°` dans le sens antihoraire, « 2 à gauche, 3 en haut ».
On **échange** les deux nombres et on change un signe.
:::

::: aide Le papier calque, l'outil le plus sûr
Décalque la figure et le centre. Plante la pointe du compas sur le centre, puis fais tourner le calque de l'angle voulu.
Tu vois alors directement où arrive chaque sommet. C'est la vérification la plus rapide de toute construction par rotation.
:::

## 7. Les cas particuliers

::: grille
| Angle | Sens | Ce que c'est |
|---|---|---|
| `0°` | indifférent | la figure ne bouge pas |
| `90°` | horaire ou antihoraire | quart de tour |
| `180°` | **le sens n'a plus d'importance** | **symétrie centrale** |
| `360°` | indifférent | la figure revient à sa position |
:::

::: retenir La rotation de 180°
C'est exactement la **symétrie centrale** de même centre.
À `180°`, tourner dans un sens ou dans l'autre donne le même résultat : c'est le seul angle pour lequel le sens ne change rien.
:::

::: piege Une rotation de 360° n'est pas « rien »
Elle ramène la figure à sa position de départ, mais ce n'est pas la même chose que ne rien faire quand on décrit un mouvement.
En géométrie de 4ᵉ, on considère toutefois que l'image est identique à l'antécédent.
:::

## 8. Les propriétés conservées

::: grille
| Propriété | Symétrie axiale | Symétrie centrale | Translation | Rotation |
|---|---|---|---|---|
| Longueurs | **conservées** | **conservées** | **conservées** | **conservées** |
| Angles | **conservés** | **conservés** | **conservés** | **conservés** |
| Aires | **conservées** | **conservées** | **conservées** | **conservées** |
| Parallélisme | **conservé** | **conservé** | **conservé** | **conservé** |
| Alignement | **conservé** | **conservé** | **conservé** | **conservé** |
| Milieux | **conservés** | **conservés** | **conservés** | **conservés** |
| Sens de parcours | **inversé** | conservé | conservé | conservé |
:::

::: formule
**Ce qu'il faut retenir de ce tableau**
Les quatre transformations conservent **tout ce qui se mesure**.
Une seule ligne les distingue : le **sens de parcours**, inversé par la symétrie axiale seulement.
:::

::: retenir Ce qui n'est pas conservé
La **position** dans le plan, évidemment, et l'**orientation** dans le cas de la symétrie axiale.
Une transformation qui change aussi les longueurs n'appartient pas à ce chapitre : ce sont les agrandissements et les réductions, qui multiplient toutes les longueurs par un même nombre.
:::

## 9. Reconnaître une transformation

::: methode Identifier la transformation, en quatre questions
1. La figure a-t-elle été **retournée** ? Si oui, c'est une **symétrie axiale**.
2. Sinon, a-t-elle simplement **glissé**, sans tourner ? Si oui, c'est une **translation**.
3. Sinon, a-t-elle **tourné** d'un demi-tour ? Si oui, c'est une **symétrie centrale**.
4. Sinon, c'est une **rotation** : il reste à trouver le centre, l'angle et le sens.
:::

::: exemple La question 1 en pratique
Repère un détail **non symétrique** de la figure, par exemple un petit trait ou une lettre.
Si ce détail apparaît « en miroir » sur l'image, la figure a été retournée.
S'il garde la même orientation relative, elle ne l'a pas été.
:::

::: methode Trouver le centre d'une symétrie centrale
Trace les segments joignant chaque point à son image.
Ces segments se coupent tous en un même point : c'est le **centre**.
On peut aussi prendre le **milieu** de l'un d'eux.
:::

::: methode Trouver le centre d'une rotation
1. Trace la **médiatrice** de `[AA']`.
2. Trace la **médiatrice** de `[BB']`.
3. Leur point d'intersection est le **centre** de la rotation.
4. Mesure ensuite l'angle `AOA'` au rapporteur pour obtenir l'angle.
:::

## 10. Enchaîner deux transformations

::: grille
| Enchaînement | Résultat |
|---|---|
| Deux translations | une **translation** |
| Deux symétries centrales | une **translation** |
| Deux symétries axiales d'axes **parallèles** | une **translation** |
| Deux symétries axiales d'axes **sécants** | une **rotation** de centre leur intersection |
| Deux rotations de même centre | une **rotation** de même centre |
:::

::: exemple Deux symétries axiales parallèles
Deux droites parallèles distantes de `3 cm`.
Le symétrique du symétrique d'un point se retrouve à `6 cm` du point de départ, dans la direction perpendiculaire aux axes.
La composée est une **translation** dont la longueur vaut **le double** de la distance entre les axes.
:::

::: retenir La règle du retournement
Chaque symétrie axiale **retourne** la figure.
Deux symétries axiales la retournent donc **deux fois**, ce qui la remet à l'endroit : la composée ne retourne pas, c'est pourquoi elle est une translation ou une rotation.
:::

## 11. Frises et pavages

::: definition Frise et pavage
Une **frise** est un motif répété par translations le long d'une **bande**.
Un **pavage** recouvre tout le plan par répétition d'un motif, **sans trou ni chevauchement**.
:::

::: methode Décrire une frise en trois points
1. Identifie le **motif de base**, le plus petit élément répété.
2. Identifie la **translation** qui passe d'un motif au suivant.
3. Cherche s'il existe d'autres transformations : symétries d'axe horizontal, d'axe vertical, rotations de demi-tour.
:::

::: exemple Trois frises courantes
**Frise par translation seule** : le motif glisse, toujours identique.
**Frise par symétrie d'axe vertical** : un motif sur deux est retourné horizontalement.
**Frise par demi-tour** : un motif sur deux est à l'envers.
:::

::: retenir Les pavages du plan
Seuls trois polygones réguliers pavent le plan à eux seuls : le **triangle équilatéral**, le **carré** et l'**hexagone régulier**.
La raison est arithmétique : leurs angles, `60°`, `90°` et `120°`, divisent exactement `360°`.
Un pentagone régulier, dont l'angle vaut `108°`, ne le peut pas.
:::

## 12. Les pièges à éviter

::: piege 1. Les trois éléments d'une rotation
Centre, angle **et sens**. Sans le sens, la rotation n'est pas définie.
:::

::: piege 2. Direction et sens
La direction est celle de la droite, le sens précise lequel des deux parcours on emprunte.
:::

::: piege 3. Le sens de parcours
Seule la symétrie axiale l'inverse. C'est la ligne qui distingue les quatre transformations.
:::

::: piege 4. La rotation de 180°
C'est la symétrie centrale de même centre, et le sens n'y change rien.
:::

::: piege 5. L'ordre des sommets
On relie les images dans le **même ordre** que la figure de départ, sinon la figure obtenue est fausse.
:::

::: piege 6. Le centre d'une rotation
Il se trouve à l'intersection des **médiatrices** de `[AA']` et `[BB']`, pas au milieu de `[AA']`.
:::

::: piege 7. Les longueurs
Elles sont **toujours** conservées. Une image plus grande signale une erreur de construction.
:::

::: piege 8. Le pavage
Seuls le triangle équilatéral, le carré et l'hexagone régulier pavent le plan seuls.
:::

::: cocher
- Je construis l'image d'une figure par translation sur quadrillage
- Je construis l'image d'un point par rotation au compas et au rapporteur
- Je connais les six propriétés conservées et la seule qui ne l'est pas
- Je reconnais la transformation en quatre questions
- Je sais trouver le centre d'une symétrie centrale et d'une rotation
:::
