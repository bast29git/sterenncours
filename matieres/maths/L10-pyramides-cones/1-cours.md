---
type: cours
matiere: maths
lecon: L10
titre: Pyramides et cônes
resume: Les solides à pointe : vocabulaire de la pyramide et du cône, patrons et représentation en perspective, formule du volume et son coefficient un tiers, sections planes, et calculs mêlant Pythagore et conversions d'unités.
duree: 3 séances de 45 min
competences:
  - Chercher
  - Représenter
  - Calculer
  - Raisonner
  - Communiquer
objectifs:
  - Nommer les éléments d'une pyramide et d'un cône
  - Représenter ces solides en perspective cavalière
  - Construire et reconnaître un patron
  - Calculer un volume avec la formule du tiers
  - Effectuer les conversions d'unités de volume
  - Déterminer une hauteur avec le théorème de Pythagore
---

::: plan
**Séance 1 : décrire les solides**

1. La pyramide
2. Le cône de révolution
3. La perspective cavalière
4. Les patrons

*🔁 Pause de 5 minutes*

**Séance 2 : calculer les volumes**

5. La formule du volume
6. Pourquoi un tiers
7. Les unités de volume
8. Les calculs types

**Séance 3 : aller plus loin**

9. Pythagore dans un solide
10. Les sections planes
11. Problèmes concrets
12. Les pièges à éviter
:::

::: materiel
- Une règle, un compas, une équerre
- Du papier quadrillé et du papier calque
- Une calculatrice
- Du carton pour construire un patron
:::

## 1. La pyramide

::: definition Pyramide
Une **pyramide** est un solide dont la **base** est un polygone et dont les autres faces sont des **triangles** ayant un sommet commun, appelé le **sommet** de la pyramide.
:::

::: grille
| Élément | Définition |
|---|---|
| **Base** | le polygone sur lequel repose la pyramide |
| **Sommet** | le point commun à toutes les faces triangulaires |
| **Faces latérales** | les triangles reliant la base au sommet |
| **Arêtes latérales** | les segments reliant le sommet aux sommets de la base |
| **Hauteur** | le segment perpendiculaire à la base, joignant le sommet à la base |
| **Apothème** | la hauteur d'une face latérale, pour une pyramide régulière |
:::

::: formule
**Compter les éléments**
Si la base a `n` côtés, la pyramide a :
`n + 1` **faces**, la base plus `n` triangles ;
`n + 1` **sommets**, ceux de la base plus le sommet ;
`2n` **arêtes**, `n` sur la base et `n` latérales.

Pour une pyramide à base carrée, `n = 4` : 5 faces, 5 sommets, 8 arêtes.
:::

::: definition Pyramide régulière
Une pyramide est **régulière** quand sa base est un polygone régulier et que sa hauteur tombe exactement au **centre** de la base.
Toutes ses faces latérales sont alors des triangles isocèles identiques.
:::

::: piege La hauteur n'est pas l'arête latérale
La **hauteur** est perpendiculaire à la base ; elle est **intérieure** au solide.
L'**arête latérale** est le segment visible qui relie le sommet à un coin de la base.
L'arête est toujours **plus longue** que la hauteur : confondre les deux fausse tout calcul de volume.
:::

## 2. Le cône de révolution

::: definition Cône de révolution
Un **cône de révolution** est le solide obtenu en faisant tourner un **triangle rectangle** autour de l'un de ses côtés de l'angle droit.
Sa base est un **disque**, et sa surface latérale se termine en un **sommet**.
:::

::: grille
| Élément | Définition |
|---|---|
| **Base** | le disque, de rayon `r` |
| **Sommet** | le point où converge la surface latérale |
| **Hauteur** | le segment perpendiculaire à la base, du sommet au centre du disque |
| **Génératrice** | le segment reliant le sommet à un point du bord du disque |
:::

::: formule
**La relation entre les trois longueurs**
La hauteur `h`, le rayon `r` et la génératrice `g` forment un **triangle rectangle**.
D'après le théorème de Pythagore :

`g² = h² + r²`

Cette relation permet de calculer n'importe laquelle des trois à partir des deux autres.
:::

::: retenir Le cône est la version « ronde » de la pyramide
Une pyramide dont la base aurait un très grand nombre de côtés ressemblerait de plus en plus à un cône.
C'est pourquoi les deux solides partagent **exactement la même formule** de volume.
:::

## 3. La perspective cavalière

::: methode Dessiner une pyramide à base carrée en quatre étapes
1. Trace la base : le carré vu de biais devient un **parallélogramme**.
2. Place le **centre** de la base, à l'intersection des diagonales.
3. Trace la **hauteur** verticale depuis ce centre, en **pointillés** puisqu'elle est cachée.
4. Relie le sommet aux quatre coins de la base.
:::

::: grille
| Règle de la perspective cavalière | Conséquence |
|---|---|
| Les arêtes **cachées** se tracent en **pointillés** | on distingue l'avant de l'arrière |
| Les droites **parallèles** restent parallèles | le carré devient un parallélogramme |
| Les longueurs **sur les fuyantes** sont réduites | souvent de moitié |
| Les angles droits **ne sont pas conservés** | un carré n'a plus l'air d'un carré |
:::

::: piege Ce qu'on voit n'est pas ce qui est
Sur un dessin en perspective, une face carrée apparaît comme un parallélogramme, et un cercle comme une ellipse.
Il ne faut **jamais** mesurer sur le dessin : les longueurs réelles sont celles données par l'énoncé ou le codage.
:::

## 4. Les patrons

::: definition Patron
Un **patron** est la figure plane obtenue en dépliant la surface d'un solide, sans déchirure ni recouvrement.
En le découpant et en le pliant, on reconstitue exactement le solide.
:::

::: grille
| Solide | Patron |
|---|---|
| **Pyramide à base carrée** | un carré entouré de quatre triangles isocèles |
| **Pyramide à base triangulaire** | un triangle entouré de trois triangles |
| **Cône** | un disque et un **secteur de disque** |
:::

::: formule
**Le patron du cône**
La surface latérale se déplie en un **secteur de disque** de rayon `g`, la génératrice.
L'arc de ce secteur a la même longueur que la **circonférence de la base**, soit `2 × π × r`.

L'angle du secteur se calcule par : `angle = 360 × r ÷ g`
:::

::: exemple Un calcul d'angle
Un cône a un rayon `r = 3 cm` et une génératrice `g = 9 cm`.
`angle = 360 × 3 ÷ 9 = 360 × 0,333... = **120°**`.
Le patron comporte donc un disque de 3 cm de rayon et un secteur de 120° dans un disque de 9 cm de rayon.
:::

::: methode Vérifier qu'un patron est correct, en trois contrôles
1. Le **nombre de faces** correspond-il au solide ?
2. Les côtés qui doivent se rejoindre ont-ils la **même longueur** ?
3. Peut-on plier mentalement sans **recouvrement** ni trou ?
:::

🔁 **Point de pause.** Reprends après cinq minutes. La suite passe au calcul.

## 5. La formule du volume

::: formule
**Volume d'une pyramide**
`V = aire de la base × hauteur ÷ 3`

**Volume d'un cône**
`V = π × r² × h ÷ 3`

C'est la même formule : l'aire de la base d'un cône vaut `π × r²`.
:::

::: methode Calculer un volume, en quatre étapes
1. Identifie la **base** et calcule son **aire**.
2. Identifie la **hauteur**, celle qui est perpendiculaire à la base.
3. Multiplie l'aire par la hauteur.
4. Divise par **3**.
:::

::: exemple Une pyramide à base carrée
Base : un carré de côté `6 cm`. Hauteur : `10 cm`.
Aire de la base : `6 × 6 = 36 cm²`.
Volume : `36 × 10 ÷ 3 = 360 ÷ 3 = **120 cm³**`.
:::

::: exemple Un cône
Rayon `4 cm`, hauteur `9 cm`.
Aire de la base : `π × 4² = π × 16 ≈ 50,27 cm²`.
Volume : `50,27 × 9 ÷ 3 ≈ 150,8 cm³`.

Valeur exacte : `V = 16π × 9 ÷ 3 = 48π cm³ ≈ **150,8 cm³**`.
:::

::: piege La hauteur, pas l'arête ni la génératrice
La formule emploie la hauteur **perpendiculaire à la base**.
Employer l'arête latérale ou la génératrice donne un volume trop grand.
Quand l'énoncé donne l'une de ces longueurs, il faut d'abord calculer la hauteur avec Pythagore.
:::

## 6. Pourquoi un tiers

::: formule
**La comparaison avec le prisme**
Un prisme et une pyramide de **même base** et de **même hauteur** ne contiennent pas la même quantité.
La pyramide contient exactement **un tiers** du prisme.

`V_pyramide = V_prisme ÷ 3`
:::

::: exemple L'expérience qui le montre
Prends un récipient en forme de pyramide et un récipient en forme de prisme, de même base et de même hauteur.
Remplis la pyramide de sable et verse dans le prisme. Recommence.
Il faut exactement **trois** pyramides pleines pour remplir le prisme.
:::

::: retenir Le rapport vaut aussi pour le cône
Un cône et un cylindre de même base et de même hauteur suivent la même règle : le cône contient **un tiers** du cylindre.
Retenir « les solides à pointe valent un tiers du solide droit correspondant » évite d'apprendre deux formules.
:::

## 7. Les unités de volume

::: grille
| Unité | Équivalence |
|---|---|
| `1 dm³` | `1 L` |
| `1 cm³` | `1 mL` |
| `1 m³` | `1 000 L` |
| `1 m³` | `1 000 dm³` |
| `1 dm³` | `1 000 cm³` |
:::

::: formule
**La règle des conversions de volume**
Chaque changement d'unité de longueur multiplie ou divise le volume par **1 000**, et non par 10.
C'est parce qu'un volume est un produit de **trois** longueurs : `10 × 10 × 10 = 1 000`.
:::

::: piege L'erreur la plus coûteuse du chapitre
`1 m³` ne vaut **pas** `100 cm³` mais `1 000 000 cm³`.
En effet : `1 m = 100 cm`, donc `1 m³ = 100 × 100 × 100 = 1 000 000 cm³`.
Un facteur 10 000 d'erreur est aussitôt visible si l'on contrôle la vraisemblance.
:::

::: methode Convertir sans erreur
1. Écris la conversion des **longueurs** : `1 m = 100 cm`.
2. Élève au **cube** : `1 m³ = 100³ cm³ = 1 000 000 cm³`.
3. Applique ce facteur au nombre.
:::

## 8. Les calculs types

::: exemple Calculer une hauteur à partir du volume
Une pyramide a une base carrée de `5 cm` de côté et un volume de `75 cm³`. Quelle est sa hauteur ?

`V = aire × h ÷ 3`, donc `h = 3 × V ÷ aire`.
Aire de la base : `5 × 5 = 25 cm²`.
`h = 3 × 75 ÷ 25 = 225 ÷ 25 = **9 cm**`.
:::

::: exemple Calculer un rayon à partir du volume
Un cône a une hauteur de `12 cm` et un volume de `100π cm³`. Quel est son rayon ?

`V = π × r² × h ÷ 3`, donc `r² = 3 × V ÷ (π × h)`.
`r² = 3 × 100π ÷ (π × 12) = 300π ÷ 12π = 25`.
`r = **5 cm**`.
:::

::: methode Isoler une grandeur dans la formule
1. Écris la formule complète.
2. Multiplie les deux membres par **3** pour supprimer la division.
3. Divise par tout ce qui accompagne la grandeur cherchée.
4. Si la grandeur est au carré, prends la **racine carrée** en dernier.
:::

## 9. Pythagore dans un solide

::: formule
**Dans un cône**
`g² = h² + r²`, où `g` est la génératrice, `h` la hauteur et `r` le rayon.
:::

::: exemple Trouver la hauteur d'un cône
Un cône a un rayon de `6 cm` et une génératrice de `10 cm`. Quelle est sa hauteur ?

`g² = h² + r²` donne `h² = g² − r²`.
`h² = 10² − 6² = 100 − 36 = 64`.
`h = √64 = **8 cm**`.

On peut alors calculer le volume : `V = π × 36 × 8 ÷ 3 = 96π ≈ 301,6 cm³`.
:::

::: exemple Trouver la hauteur d'une pyramide régulière
Une pyramide régulière à base carrée a une base de côté `8 cm` et des arêtes latérales de `12 cm`.

**Étape 1** : la hauteur tombe au centre du carré. La distance du centre à un sommet du carré est la **moitié de la diagonale**.
Diagonale du carré : `d² = 8² + 8² = 128`, donc `d = √128 ≈ 11,31 cm`.
Demi-diagonale : `11,31 ÷ 2 ≈ 5,66 cm`.

**Étape 2** : le triangle formé par la hauteur, la demi-diagonale et l'arête latérale est rectangle.
`12² = h² + 5,66²` donne `h² = 144 − 32 = 112`.
`h = √112 ≈ **10,58 cm**`.

Remarque que `5,66² = 32` exactement, puisque la demi-diagonale au carré vaut `128 ÷ 4 = 32`. Travailler avec les valeurs exactes évite les erreurs d'arrondi.
:::

::: piege Choisir le bon triangle rectangle
Dans une pyramide, plusieurs triangles rectangles coexistent.
Avec l'**arête latérale**, on emploie la **demi-diagonale** de la base.
Avec l'**apothème**, hauteur d'une face, on emploie la **demi-longueur d'un côté**.
Se tromper de triangle donne un résultat faux sans qu'aucune alerte n'apparaisse.
:::

## 10. Les sections planes

::: grille
| Solide | Plan de coupe | Section obtenue |
|---|---|---|
| **Pyramide** | parallèle à la base | un polygone **semblable** à la base, plus petit |
| **Cône** | parallèle à la base | un **disque** plus petit |
| **Cône** | passant par le sommet et perpendiculaire à la base | un **triangle isocèle** |
| **Pyramide** | passant par le sommet | un **triangle** |
:::

::: formule
**La réduction**
Une section parallèle à la base produit une figure **réduite** de la figure de base.
Si la section est à la hauteur `k` fois la hauteur totale depuis le sommet, alors :
les **longueurs** sont multipliées par `k` ;
les **aires** sont multipliées par `k²` ;
les **volumes** sont multipliés par `k³`.
:::

::: exemple Une section à mi-hauteur
Un cône de rayon `6 cm` et de hauteur `12 cm` est coupé à mi-hauteur, parallèlement à la base.
Le petit cône du haut a une hauteur de `6 cm`, soit `k = 0,5`.
Son rayon vaut `6 × 0,5 = **3 cm**`.
Son aire de base vaut `0,5² = 0,25`, soit le quart de l'aire initiale.
Son volume vaut `0,5³ = 0,125`, soit **le huitième** du volume initial.

Ce dernier résultat surprend souvent : couper à mi-hauteur ne partage pas le volume en deux.
:::

## 11. Problèmes concrets

::: exemple Un cornet de glace
Un cornet a la forme d'un cône de rayon `3 cm` et de hauteur `12 cm`.

Volume : `V = π × 3² × 12 ÷ 3 = π × 9 × 4 = 36π ≈ **113,1 cm³**`.
Conversion : `113,1 cm³ = 113,1 mL`, soit un peu plus de `11 cL`.
:::

::: exemple Un tas de sable
Un tas de sable a la forme d'un cône de `4 m` de diamètre et `1,5 m` de hauteur. Combien de mètres cubes contient-il ?

Rayon : `4 ÷ 2 = 2 m`.
`V = π × 2² × 1,5 ÷ 3 = π × 4 × 0,5 = 2π ≈ **6,28 m³**`.

Si un camion transporte `5 m³`, il faudra **deux** voyages.
:::

::: methode Résoudre un problème concret, en cinq étapes
1. **Identifie** le solide et fais un schéma.
2. **Relève** les données et convertis-les dans une **même unité**.
3. Vérifie qu'on te donne bien la **hauteur** et non une autre longueur.
4. Applique la formule et calcule.
5. **Contrôle la vraisemblance** du résultat et donne l'unité.
:::

::: aide Le contrôle de vraisemblance
Un cornet de glace de 113 cm³ correspond à peu près à un verre : c'est plausible.
Un tas de sable de 6,28 m³ tiendrait dans une petite pièce : c'est plausible aussi.
Un résultat de 113 000 cm³ pour un cornet signalerait immédiatement une erreur de conversion.
:::

## 12. Les pièges à éviter

::: piege 1. La hauteur
C'est le segment **perpendiculaire à la base**, jamais l'arête latérale ni la génératrice.
:::

::: piege 2. Oublier le tiers
`V = aire × hauteur ÷ 3`. Oublier la division par 3 triple le résultat.
:::

::: piege 3. Le rayon et le diamètre
La formule emploie le **rayon**. Un énoncé donne souvent le diamètre : divise d'abord par 2.
:::

::: piege 4. Les conversions de volume
Chaque changement d'unité multiplie ou divise par **1 000**, pas par 10.
:::

::: piege 5. `1 m³` en cm³
`1 m³ = 1 000 000 cm³`, et non `100 cm³`.
:::

::: piege 6. Le bon triangle rectangle
Arête latérale avec demi-diagonale, apothème avec demi-côté.
:::

::: piege 7. La section à mi-hauteur
Elle ne partage pas le volume en deux : le petit cône vaut le **huitième**.
:::

::: piege 8. Mesurer sur un dessin en perspective
Les longueurs y sont déformées. On n'emploie que les données de l'énoncé.
:::

::: cocher
- Je nomme les six éléments d'une pyramide et les quatre d'un cône
- Je construis un patron et je calcule l'angle du secteur d'un cône
- J'applique la formule du volume sans oublier le tiers
- Je convertis les unités de volume en multipliant par 1 000
- Je calcule une hauteur avec Pythagore en choisissant le bon triangle
:::
