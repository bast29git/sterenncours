---
type: revision
matiere: maths
lecon: L10
titre: Pyramides et cônes : fiche de révision
resume: Tout le chapitre en deux pages : le vocabulaire des deux solides, les patrons, la formule du volume et son tiers, les conversions d'unités, Pythagore dans un solide, les sections planes, les huit pièges et un auto-test de 10 questions.
duree: 15 min
competences:
  - Calculer
  - Représenter
objectifs:
  - Retrouver seule la formule et les conversions
  - Choisir le bon triangle rectangle pour calculer une hauteur
---

::: plan
1. Le vocabulaire
2. Les patrons
3. La formule du volume
4. Les unités
5. Pythagore dans un solide
6. Les sections planes
7. Les mots-clés
8. Les huit pièges
9. Auto-test de 10 questions
:::

## 1. Le vocabulaire

::: grille
| Pyramide | Cône |
|---|---|
| **Base** : un polygone | **Base** : un disque de rayon `r` |
| **Sommet** : point commun aux faces | **Sommet** |
| **Faces latérales** : triangles | **Surface latérale** |
| **Arêtes latérales** | **Génératrice** `g` |
| **Hauteur** : perpendiculaire à la base | **Hauteur** `h` |
| **Apothème** : hauteur d'une face | |
:::

::: formule-cle
Base à `n` côtés : `n + 1` **faces**, `n + 1` **sommets**, `2n` **arêtes**.
Pyramide à base carrée : 5 faces, 5 sommets, 8 arêtes.
:::

::: piege La hauteur n'est pas l'arête latérale
La hauteur est **perpendiculaire à la base** et intérieure au solide.
L'arête latérale est toujours **plus longue**. Les confondre fausse tout calcul de volume.
:::

::: retenir La perspective cavalière
Arêtes cachées en **pointillés**, parallèles conservées, longueurs sur les fuyantes réduites, angles droits **non conservés**.
On ne mesure **jamais** sur un dessin en perspective : un carré y devient un parallélogramme, un cercle une ellipse.
:::

## 2. Les patrons

::: grille
| Solide | Patron |
|---|---|
| **Pyramide à base carrée** | un carré et quatre triangles isocèles |
| **Pyramide à base triangulaire** | un triangle et trois triangles |
| **Cône** | un disque et un **secteur de disque** de rayon `g` |
:::

::: formule-cle
Angle du secteur du patron d'un cône : `angle = 360 × r ÷ g`
Exemple : `r = 3 cm`, `g = 9 cm` → `360 × 3 ÷ 9 = 120°`.
:::

## 3. La formule du volume

::: formule-cle
**Pyramide** : `V = aire de la base × hauteur ÷ 3`
**Cône** : `V = π × r² × h ÷ 3`
C'est la même formule, puisque l'aire de la base d'un cône vaut `π × r²`.
:::

::: grille
| Étape | Ce qu'on fait |
|---|---|
| 1 | calculer l'**aire de la base** |
| 2 | identifier la **hauteur**, perpendiculaire à la base |
| 3 | multiplier l'aire par la hauteur |
| 4 | **diviser par 3** |
:::

::: retenir Pourquoi un tiers
Une pyramide et un prisme de **même base** et de **même hauteur** : la pyramide contient exactement **un tiers** du prisme.
Idem pour le cône et le cylindre. Retiens : les solides **à pointe** valent un tiers du solide droit correspondant.
:::

::: grille
| Chercher | Formule isolée |
|---|---|
| la hauteur | `h = 3 × V ÷ aire de la base` |
| le rayon d'un cône | `r² = 3 × V ÷ (π × h)`, puis racine carrée |
:::

## 4. Les unités

::: grille
| Unité | Équivalence |
|---|---|
| `1 dm³` | `1 L` |
| `1 cm³` | `1 mL` |
| `1 m³` | `1 000 L` = `1 000 dm³` |
| `1 dm³` | `1 000 cm³` |
| `1 m³` | **`1 000 000 cm³`** |
:::

::: formule-cle
Chaque changement d'unité de longueur multiplie ou divise le volume par **1 000**, pas par 10.
Un volume est un produit de **trois** longueurs : `10 × 10 × 10 = 1 000`.
:::

## 5. Pythagore dans un solide

::: formule-cle
**Dans un cône** : `g² = h² + r²`
La hauteur, le rayon et la génératrice forment un triangle rectangle.
Exemple : `r = 6`, `g = 10` → `h² = 100 − 36 = 64` → `h = 8 cm`.
:::

::: grille
| Longueur donnée | Triangle rectangle à employer |
|---|---|
| **Arête latérale** | hauteur, **demi-diagonale** de la base, arête |
| **Apothème**, hauteur d'une face | hauteur, **demi-côté** de la base, apothème |
:::

::: retenir Pyramide régulière à base carrée
Côté `c` → diagonale `d` avec `d² = c² + c²`.
Demi-diagonale au carré : `d² ÷ 4`, soit `c² ÷ 2`.
Pour `c = 8` : demi-diagonale au carré `= 32`, et avec une arête de 12 : `h² = 144 − 32 = 112`, donc `h ≈ 10,58 cm`.
:::

## 6. Les sections planes

::: grille
| Solide | Plan | Section |
|---|---|---|
| Pyramide | parallèle à la base | polygone **semblable**, plus petit |
| Cône | parallèle à la base | **disque** plus petit |
| Cône | par le sommet, perpendiculaire à la base | **triangle isocèle** |
:::

::: formule-cle
Section parallèle à la base, à un facteur `k` depuis le sommet :
les **longueurs** sont multipliées par `k` ;
les **aires** par `k²` ;
les **volumes** par `k³`.
Couper à mi-hauteur donne un petit cône dont le volume vaut le **huitième**, et non la moitié.
:::

## 7. Les mots-clés

::: motscles
- Pyramide
- Cône de révolution
- Base
- Sommet
- Face latérale
- Arête latérale
- Hauteur
- Apothème
- Génératrice
- Pyramide régulière
- Perspective cavalière
- Patron
- Secteur de disque
- Volume
- Section plane
- Réduction
- Coefficient k
:::

## 8. Les huit pièges

::: piege 1. La hauteur
Perpendiculaire à la base, jamais l'arête ni la génératrice.
:::

::: piege 2. Oublier le tiers
Oublier la division par 3 **triple** le résultat.
:::

::: piege 3. Rayon et diamètre
La formule emploie le **rayon** : divise d'abord le diamètre par 2.
:::

::: piege 4. Les conversions
Multiplier ou diviser par **1 000**, pas par 10.
:::

::: piege 5. `1 m³`
Il vaut `1 000 000 cm³`.
:::

::: piege 6. Le bon triangle rectangle
Arête avec demi-diagonale, apothème avec demi-côté.
:::

::: piege 7. La section à mi-hauteur
Le petit cône vaut le **huitième** du volume.
:::

::: piege 8. Mesurer sur un dessin
Les longueurs y sont déformées : on n'emploie que les données de l'énoncé.
:::

## 9. Auto-test

Réponds sans regarder la fiche de cours. Les réponses sont juste en dessous.

::: exercice 1 | application | 10 min | ecran
1. Combien de faces, sommets et arêtes a une pyramide à base carrée ?
2. Quelle est la différence entre la hauteur et l'arête latérale ?
3. Donne la formule du volume d'une pyramide et celle d'un cône.
4. Une pyramide a une base carrée de 6 cm de côté et 10 cm de hauteur. Calcule son volume.
5. Combien de cm³ vaut 1 m³ ?
6. Quelle relation lie `g`, `h` et `r` dans un cône ?
7. Un cône a un rayon de 6 cm et une génératrice de 10 cm. Calcule sa hauteur.
8. De quoi est composé le patron d'un cône ?
9. Une pyramide a une base carrée de 5 cm et un volume de 75 cm³. Calcule sa hauteur.
10. On coupe un cône à mi-hauteur. Quel volume représente le petit cône ?

::: corrige
1. **5 faces**, **5 sommets**, **8 arêtes**. Avec une base à `n` côtés : `n + 1` faces, `n + 1` sommets, `2n` arêtes.
2. La **hauteur** est perpendiculaire à la base et intérieure au solide. L'**arête latérale** relie le sommet à un coin de la base, et elle est toujours **plus longue**.
3. `V = aire de la base × hauteur ÷ 3` et `V = π × r² × h ÷ 3`. C'est la même formule.
4. Aire de la base : `6 × 6 = 36 cm²`. Volume : `36 × 10 ÷ 3 = **120 cm³**`.
5. `1 m = 100 cm`, donc `1 m³ = 100 × 100 × 100 = **1 000 000 cm³**`.
6. `g² = h² + r²`. Les trois longueurs forment un triangle rectangle.
7. `h² = 10² − 6² = 100 − 36 = 64`, donc `h = **8 cm**`.
8. D'un **disque** de rayon `r`, la base, et d'un **secteur de disque** de rayon `g`, la surface latérale dépliée. L'angle du secteur vaut `360 × r ÷ g`.
9. `h = 3 × V ÷ aire = 3 × 75 ÷ 25 = **9 cm**`.
10. Le facteur de réduction vaut `k = 0,5`. Les volumes sont multipliés par `k³ = 0,125`, soit **le huitième** du volume initial. Couper à mi-hauteur ne partage donc pas le volume en deux.
:::
:::

::: cocher
- Je connais la formule et je n'oublie plus le tiers
- Je convertis les volumes en multipliant par 1 000
- Je choisis le bon triangle rectangle pour calculer une hauteur
- J'ai eu au moins 8 bonnes réponses sur 10 à l'auto-test
:::
