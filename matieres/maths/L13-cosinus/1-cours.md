---
type: cours
matiere: maths
lecon: L13
titre: Le cosinus d'un angle aigu
resume: Dans un triangle rectangle, relier un angle aigu à deux longueurs. Calculer une longueur quand on connaît un angle, calculer un angle quand on connaît deux longueurs.
duree: 2 séances de 45 min
competences:
  - Représenter
  - Raisonner
  - Calculer
  - Communiquer
objectifs:
  - Nommer le côté adjacent à un angle aigu et l'hypoténuse d'un triangle rectangle
  - Écrire la formule du cosinus avec les bonnes lettres
  - Calculer une longueur à partir d'un angle et d'une longueur
  - Calculer la mesure d'un angle à partir de deux longueurs, avec la touche cos⁻¹
  - Contrôler un résultat : un cosinus est toujours compris entre 0 et 1
  - Rédiger un calcul en trois temps, comme pour Pythagore
---

::: plan
**Séance 1 : la formule**

1. Un angle, deux côtés
2. La définition du cosinus
3. La calculatrice en mode degrés
4. Calculer une longueur

**Séance 2 : les angles et la rédaction**

5. Calculer un angle
6. Cosinus ou Pythagore ?
7. Les pièges à éviter
:::

::: materiel
- Une calculatrice avec les touches `cos` et `cos⁻¹` (parfois notée `acos` ou `arccos`)
- Une équerre et une règle graduée
- La fiche de révision de Pythagore (`maths/L08`), pour le vocabulaire du triangle rectangle
:::

::: info Ce que dit le programme
En 4ᵉ, on apprend à **utiliser le cosinus** d'un angle aigu dans un triangle rectangle. Le sinus et la tangente arrivent en 3ᵉ. Cette leçon prépare directement le brevet.
:::

## 1. Un angle, deux côtés

Dans un triangle rectangle, tu connais déjà l'**hypoténuse** : le côté qui ne touche pas l'angle droit, toujours le plus long.

Maintenant, on choisit **un angle aigu** du triangle. On l'appelle l'angle qui nous intéresse. Par rapport à cet angle, les deux autres côtés portent un nom.

::: definition Côté adjacent
Le **côté adjacent** à un angle aigu est le côté de l'angle droit **qui touche cet angle**.
« Adjacent » veut dire « à côté ». Le côté adjacent est *à côté* de l'angle, et ce n'est pas l'hypoténuse.
:::

<figure class="schema">
<svg width="440" height="250" viewBox="0 0 440 250" role="img" aria-label="Triangle ABC rectangle en A. L'angle marqué est en B. Le côté adjacent à cet angle est AB, l'hypoténuse est BC.">
  <polygon class="zone" points="110,200 350,200 110,70"/>
  <path class="angle" d="M 110 172 L 138 172 L 138 200"/>
  <path class="angle" d="M 320 200 A 30 30 0 0 0 328 187" stroke-width="3"/>
  <text x="100" y="222" text-anchor="end">A</text>
  <text x="360" y="222" text-anchor="start">B</text>
  <text x="100" y="66" text-anchor="end">C</text>
  <text class="legende" x="230" y="226" text-anchor="middle">AB = côté adjacent à l'angle B</text>
  <text class="legende" x="98" y="138" text-anchor="end">AC</text>
  <text class="legende" x="250" y="116" text-anchor="start">BC = hypoténuse</text>
</svg>
<figcaption>Angle choisi en <strong>B</strong>. Le côté adjacent est <strong>[AB]</strong> : il touche B et ce n'est pas l'hypoténuse.</figcaption>
</figure>

::: exemple Le même triangle, un autre angle
Si on choisit l'angle en **C** au lieu de l'angle en B, le côté adjacent change : c'est **[AC]**.
L'hypoténuse, elle, ne change jamais : c'est toujours **[BC]**.
:::

::: methode Trouver le côté adjacent en deux questions
::: etapes
1. **Quel côté touche l'angle choisi ?** Il y en a deux.
2. **Lequel des deux n'est pas l'hypoténuse ?** C'est lui, le côté adjacent.
:::
:::

::: pause
:::

## 2. La définition du cosinus

Voici l'idée de toute la leçon. Dans un triangle rectangle, si on connaît un angle aigu, le rapport entre le côté adjacent et l'hypoténuse est **toujours le même**, quelle que soit la taille du triangle.

Ce rapport porte un nom : le **cosinus** de l'angle.

::: definition Cosinus d'un angle aigu
Dans un triangle rectangle, le cosinus d'un angle aigu est le **quotient** de la longueur du côté adjacent par la longueur de l'hypoténuse.
:::

::: formule-cle
Si ABC est rectangle en A, alors cos(B) = AB ÷ BC, c'est-à-dire côté adjacent ÷ hypoténuse
:::

::: retenir Pour retenir l'ordre
**Le cosinus, c'est le petit sur le grand.** Le côté adjacent en haut, l'hypoténuse en bas.
Comme l'hypoténuse est le plus long côté, le résultat est **toujours plus petit que 1**.
:::

::: exemple Un calcul de cosinus
Le triangle ABC est rectangle en A, avec AB = 6 cm et BC = 10 cm.
Angle choisi : B. Côté adjacent : [AB]. Hypoténuse : [BC].
cos(B) = AB ÷ BC = 6 ÷ 10 = **0,6**.
Le cosinus n'a **pas d'unité** : c'est un quotient de deux longueurs en centimètres, les centimètres s'annulent.
:::

::: piege Le cosinus est un nombre, pas une longueur
0,6 n'est pas « 0,6 cm ». C'est un nombre compris entre 0 et 1. Si tu trouves un cosinus plus grand que 1, tu as inversé les deux longueurs ou pris le mauvais côté.
:::

## 3. La calculatrice en mode degrés

Avant tout calcul, vérifie que ta calculatrice est en **degrés**. Sur l'écran, tu dois voir `DEG` ou `D`. Si tu vois `RAD` ou `GRAD`, change de mode : tous tes résultats seraient faux.

::: methode Vérifier le mode en trois secondes
::: etapes
1. Tape `cos 60` puis `=`.
2. Tu dois lire **0,5**.
3. Si tu lis autre chose, la calculatrice n'est pas en degrés.
:::
:::

::: retenir Trois cosinus à connaître
- cos(60°) = **0,5**
- cos(45°) ≈ **0,707**
- cos(30°) ≈ **0,866**
Plus l'angle est **grand**, plus le cosinus est **petit**. cos(0°) = 1 et cos(90°) = 0.
:::

::: pause
:::

## 4. Calculer une longueur

C'est le premier usage du cosinus. Tu connais **un angle** et **une longueur**, tu cherches **l'autre longueur** parmi le côté adjacent et l'hypoténuse.

::: methode Calculer une longueur en quatre temps
::: etapes
1. **Je repère** : l'angle connu, le côté adjacent, l'hypoténuse. J'écris lequel je connais.
2. **J'écris la formule** avec les lettres du triangle : cos(B) = AB ÷ BC.
3. **Je remplace** ce que je connais, y compris la valeur de l'angle.
4. **Je calcule** l'inconnue, puis j'arrondis au dixième si l'énoncé le demande.
:::
:::

::: exemple Cas 1 : on cherche le côté adjacent
Le triangle ABC est rectangle en A, avec BC = 8 cm et l'angle B qui mesure 40°. Calculer AB au dixième.

1. Angle connu : B = 40°. Côté adjacent : [AB], c'est l'inconnue. Hypoténuse : BC = 8 cm.
2. Dans le triangle ABC rectangle en A : cos(B) = AB ÷ BC.
3. cos(40°) = AB ÷ 8.
4. Donc AB = 8 × cos(40°) ≈ 8 × 0,766 ≈ **6,1 cm**.

**Contrôle** : 6,1 est plus petit que 8. Le côté adjacent est plus court que l'hypoténuse. C'est cohérent.
:::

::: exemple Cas 2 : on cherche l'hypoténuse
Le triangle DEF est rectangle en D, avec DE = 6 cm et l'angle E qui mesure 35°. Calculer EF au dixième.

1. Angle connu : E = 35°. Côté adjacent : DE = 6 cm. Hypoténuse : [EF], c'est l'inconnue.
2. Dans le triangle DEF rectangle en D : cos(E) = DE ÷ EF.
3. cos(35°) = 6 ÷ EF.
4. Donc EF = 6 ÷ cos(35°) ≈ 6 ÷ 0,819 ≈ **7,3 cm**.

**Contrôle** : 7,3 est plus grand que 6. L'hypoténuse est le plus long côté. C'est cohérent.
:::

::: retenir Multiplier ou diviser ?
- Je cherche le **côté adjacent** → je **multiplie** l'hypoténuse par le cosinus.
- Je cherche l'**hypoténuse** → je **divise** le côté adjacent par le cosinus.
Le résultat doit rester cohérent : l'hypoténuse est toujours la plus longue.
:::

::: piege Ne pas arrondir le cosinus trop tôt
Garde toute la précision de la calculatrice pendant le calcul. Tape `8 × cos 40 =` en une seule fois. N'écris 0,766 que dans la rédaction, et arrondis seulement le **résultat final**.
:::

::: pause
:::

## 5. Calculer un angle

Deuxième usage. Tu connais **le côté adjacent et l'hypoténuse**, tu cherches **la mesure de l'angle**. C'est le calcul inverse : la touche `cos⁻¹` de la calculatrice donne l'angle dont on connaît le cosinus.

::: methode Calculer un angle en quatre temps
::: etapes
1. **Je repère** l'angle cherché, son côté adjacent et l'hypoténuse.
2. **J'écris la formule** : cos(B) = AB ÷ BC.
3. **Je calcule le cosinus** : cos(B) = 6 ÷ 10 = 0,6.
4. **Je passe à l'angle** avec la touche `cos⁻¹` : B = cos⁻¹(0,6) ≈ 53°.
:::
:::

::: exemple Un angle à calculer
Le triangle ABC est rectangle en A, avec AB = 6 cm et BC = 10 cm. Calculer l'angle B au degré près.

Dans le triangle ABC rectangle en A : cos(B) = AB ÷ BC = 6 ÷ 10 = 0,6.
Donc B = cos⁻¹(0,6) ≈ **53°**.

**Contrôle** : 0,6 est entre 0 et 1, et 53° est entre 0° et 90°. C'est cohérent.
:::

::: info Sur la calculatrice
La touche `cos⁻¹` s'obtient souvent avec `2nde` ou `SHIFT` puis `cos`. Sur certains modèles, elle s'appelle `acos` ou `arccos`. C'est la même chose.
:::

::: piege Si la calculatrice affiche une erreur
`cos⁻¹` refuse tout nombre plus grand que 1. Si tu obtiens `ERROR`, tu as divisé dans le mauvais sens : reprends avec le petit côté en haut et l'hypoténuse en bas.
:::

## 6. Cosinus ou Pythagore ?

Les deux outils vivent dans le triangle rectangle. Il faut choisir le bon dès la lecture de l'énoncé.

::: grille
| Ce que l'énoncé donne | Ce qu'on cherche | L'outil |
|---|---|---|
| **Deux longueurs** | La troisième longueur | Théorème de **Pythagore** |
| **Un angle** et une longueur | Une longueur | **Cosinus** |
| **Deux longueurs** (adjacent et hypoténuse) | Un angle | **Cosinus** avec `cos⁻¹` |
| **Trois longueurs** | Le triangle est-il rectangle ? | **Réciproque** de Pythagore |
:::

::: retenir Le mot déclencheur
Dès qu'un **angle en degrés** apparaît dans l'énoncé, ou qu'on te demande **un angle**, c'est le cosinus.
:::

::: exemple Rédaction complète, en trois temps
« Dans le triangle MNP rectangle en M, on a cos(N) = MN ÷ NP.
Or MN = 4,5 cm et NP = 6 cm, donc cos(N) = 4,5 ÷ 6 = 0,75.
Donc N = cos⁻¹(0,75) ≈ 41°. »
**Premier temps** : le cadre (le triangle, l'angle droit, la formule).
**Deuxième temps** : les valeurs et le calcul.
**Troisième temps** : la conclusion avec l'unité (cm ou °).
:::

::: pause
:::

## 7. Les pièges à éviter

::: piege Les cinq erreurs les plus fréquentes
1. **Calculatrice en radians** : cos 60 doit donner 0,5.
2. **Mauvais côté** : le côté adjacent touche l'angle et n'est pas l'hypoténuse.
3. **Division dans le mauvais sens** : le cosinus est toujours plus petit que 1.
4. **Confondre `cos` et `cos⁻¹`** : `cos` transforme un angle en nombre, `cos⁻¹` transforme un nombre en angle.
5. **Arrondir trop tôt** : on arrondit le résultat final, pas le cosinus au milieu du calcul.
:::

::: aide Un moyen de vérifier chaque résultat
Une longueur trouvée doit respecter : **côté adjacent < hypoténuse**.
Un angle trouvé doit être compris entre **0° et 90°**.
Si l'un des deux n'est pas respecté, le calcul est à reprendre. Pas besoin de l'adulte pour le savoir.
:::

::: retenir Ce qu'il faut savoir refaire seule
- Nommer le côté adjacent et l'hypoténuse pour un angle donné.
- Écrire cos(B) = AB ÷ BC avec les lettres de n'importe quel triangle.
- Calculer une longueur : multiplier pour le côté adjacent, diviser pour l'hypoténuse.
- Calculer un angle avec `cos⁻¹`.
- Contrôler : cosinus entre 0 et 1, angle entre 0° et 90°.
:::

::: cocher
- Je sais trouver le côté adjacent à un angle donné
- Je sais que le cosinus est un nombre entre 0 et 1, sans unité
- Ma calculatrice est en degrés et cos 60 donne 0,5
- Je sais calculer une longueur avec le cosinus
- Je sais calculer un angle avec cos⁻¹
- Je sais choisir entre cosinus et Pythagore à la lecture de l'énoncé
:::
