---
type: revision
matiere: maths
lecon: L13
titre: Cosinus : fiche de révision
resume: Tout le chapitre en deux pages : le schéma, la formule, les deux calculs, les mots-clés, les pièges et un auto-test de 8 questions.
duree: 15 min
competences:
  - Représenter
  - Calculer
objectifs:
  - Retrouver seule la formule du cosinus et savoir dans quel sens l'utiliser
  - Repérer les cinq pièges du chapitre avant de faire l'erreur
---

::: plan
1. Le schéma à avoir en tête
2. La formule
3. Les deux calculs en 4 étapes
4. Les mots-clés
5. Les valeurs à connaître
6. Les cinq pièges
7. Auto-test en 8 questions
:::

## 1. Le schéma à avoir en tête

<figure class="schema">
<svg width="440" height="250" viewBox="0 0 440 250" role="img" aria-label="Triangle ABC rectangle en A, angle choisi en B. AB est le côté adjacent, BC l'hypoténuse.">
  <polygon class="zone" points="110,200 350,200 110,70"/>
  <path class="angle" d="M 110 172 L 138 172 L 138 200"/>
  <path class="angle" d="M 320 200 A 30 30 0 0 0 328 187" stroke-width="3"/>
  <text x="100" y="222" text-anchor="end">A</text>
  <text x="360" y="222" text-anchor="start">B</text>
  <text x="100" y="66" text-anchor="end">C</text>
  <text class="legende" x="230" y="226" text-anchor="middle">adjacent à B</text>
  <text class="legende" x="250" y="116" text-anchor="start">hypoténuse</text>
</svg>
<figcaption>Angle choisi en <strong>B</strong>. Adjacent : le côté qui touche B sans être l'hypoténuse.</figcaption>
</figure>

::: retenir La phrase qui résume tout
Le cosinus, c'est **le côté adjacent divisé par l'hypoténuse**. Le petit sur le grand. Toujours entre 0 et 1.
:::

## 2. La formule

::: formule-cle
Si ABC est rectangle en A, alors cos(B) = AB ÷ BC
:::

::: grille
| | Je cherche une longueur | Je cherche un angle |
|---|---|---|
| **Ce que je connais** | Un angle et une longueur | Le côté adjacent et l'hypoténuse |
| **La touche** | `cos` | `cos⁻¹` |
| **Le résultat** | En cm (ou m) | En degrés |
| **Le contrôle** | Adjacent < hypoténuse | Entre 0° et 90° |
:::

## 3. Les deux calculs en 4 étapes

::: methode Une longueur
::: etapes
1. Je repère l'angle, l'adjacent, l'hypoténuse.
2. J'écris cos(B) = AB ÷ BC.
3. Je remplace par les valeurs connues.
4. Adjacent → je **multiplie** ; hypoténuse → je **divise**.
:::
:::

::: methode Un angle
::: etapes
1. Je repère l'angle cherché, l'adjacent, l'hypoténuse.
2. J'écris cos(B) = AB ÷ BC.
3. Je calcule le quotient : un nombre entre 0 et 1.
4. Je tape `cos⁻¹` de ce nombre : j'obtiens l'angle.
:::
:::

## 4. Les mots-clés

::: motscles
- **Angle aigu** : un angle plus petit que 90°.
- **Hypoténuse** : le côté opposé à l'angle droit, le plus long.
- **Côté adjacent** : le côté de l'angle droit qui touche l'angle choisi.
- **Cosinus** : le quotient adjacent ÷ hypoténuse, sans unité.
- **cos⁻¹** : la touche qui retrouve l'angle à partir du cosinus.
- **Degré** : l'unité des angles ; la calculatrice doit afficher `DEG`.
:::

## 5. Les valeurs à connaître

::: grille
| Angle | 0° | 30° | 45° | 60° | 90° |
|---|---|---|---|---|---|
| **Cosinus** | 1 | ≈ 0,866 | ≈ 0,707 | 0,5 | 0 |
:::

::: retenir Le sens de variation
Plus l'angle **grandit**, plus le cosinus **diminue**. C'est pour cela que cos(60°) = 0,5 est plus petit que cos(30°).
:::

## 6. Les cinq pièges

::: piege À vérifier avant de rendre
1. La calculatrice est en **degrés** (cos 60 = 0,5).
2. Le côté adjacent **touche** l'angle et n'est **pas** l'hypoténuse.
3. Le cosinus est **plus petit que 1**.
4. `cos` donne un nombre, `cos⁻¹` donne un angle.
5. On arrondit **le résultat final**, pas le cosinus.
:::

## 7. Auto-test en 8 questions

::: cartes
- **Q1.** Le triangle KLM est rectangle en K. Quel est le côté adjacent à l'angle L ? → **[KL]**, le côté qui touche L sans être l'hypoténuse [LM].
- **Q2.** Quelle formule pour l'angle L dans ce triangle ? → **cos(L) = KL ÷ LM**.
- **Q3.** Un cosinus peut-il valoir 1,2 ? → **Non**, un cosinus est toujours compris entre 0 et 1.
- **Q4.** cos(60°) = ? → **0,5**.
- **Q5.** BC = 10 cm, angle B = 60°, rectangle en A. AB = ? → 10 × 0,5 = **5 cm**.
- **Q6.** AB = 5 cm, angle B = 60°, rectangle en A. BC = ? → 5 ÷ 0,5 = **10 cm**.
- **Q7.** AB = 6 cm, BC = 10 cm, rectangle en A. Angle B ≈ ? → cos(B) = 0,6, B = cos⁻¹(0,6) ≈ **53°**.
- **Q8.** L'énoncé donne deux longueurs et demande la troisième. Quel outil ? → **Pythagore**, pas le cosinus.
:::

::: aide Comment utiliser l'auto-test
Cache la partie droite de chaque carte avec la main. Réponds à voix haute, puis découvre. Une carte ratée, c'est une partie de la fiche de cours à relire, pas un échec.
:::

::: cocher
- J'ai retrouvé la formule sans regarder
- J'ai réussi au moins 6 cartes sur 8
- Je connais cos(60°), cos(45°) et cos(30°)
- Je sais dans quel cas je multiplie et dans quel cas je divise
:::
