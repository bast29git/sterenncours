---
type: revision
matiere: physique-chimie
lecon: L06
titre: Circuits électriques : fiche de révision
resume: Tout le chapitre en deux pages : les symboles, série contre dérivation, le tableau des quatre lois, les branchements des appareils de mesure, la loi d'Ohm, puissance et énergie, la sécurité, les huit pièges et un auto-test de 10 questions.
duree: 15 min
competences:
  - Pratiquer des langages
  - Adopter un comportement responsable
objectifs:
  - Retrouver seule le tableau des quatre lois
  - Appliquer la loi d'Ohm avec les bonnes unités
---

::: plan
1. Les symboles normalisés
2. Série et dérivation
3. Le tableau des quatre lois
4. Les appareils de mesure
5. La loi d'Ohm
6. Puissance, énergie, sécurité
7. Les mots-clés
8. Les huit pièges
9. Auto-test de 10 questions
:::

## 1. Les symboles normalisés

::: grille
| Élément | Symbole |
|---|---|
| Pile | un trait long et un trait court parallèles |
| Générateur continu | rectangle avec `+` et `−` |
| Lampe | cercle barré d'une croix |
| Interrupteur ouvert | trait oblique décollé |
| Résistance | rectangle allongé |
| Moteur | cercle avec `M` |
| Ampèremètre | cercle avec `A` |
| Voltmètre | cercle avec `V` |
:::

::: formule-cle
Les fils se tracent **à la règle**, le circuit prend la forme d'un **rectangle**, les symboles se placent au **milieu d'un côté** et une flèche indique le sens du courant.
Le courant conventionnel va de la borne **`+`** vers la borne **`−`** à l'extérieur du générateur.
:::

## 2. Série et dérivation

::: grille
| | **Série** | **Dérivation** |
|---|---|---|
| Nombre de boucles | une seule | plusieurs |
| Chemin du courant | unique | il se partage aux **nœuds** |
| Si un dipôle est retiré | **tout s'éteint** | les autres continuent |
| Si on ajoute une lampe | toutes brillent **moins** | les autres **ne changent pas** |
:::

::: formule-cle
Un **nœud** est un point où au moins trois fils se rejoignent.
Une **branche** est une portion entre deux nœuds. Une **maille** est une boucle fermée.
Toute l'installation d'un logement est montée **en dérivation**.
:::

## 3. Le tableau des quatre lois

::: grille
| | **En série** | **En dérivation** |
|---|---|---|
| **Intensité** | **même partout** : `I1 = I2` | se **partage** : `I = I1 + I2` |
| **Tension** | s'**additionne** : `U = U1 + U2` | **même** : `U = U1 = U2` |
:::

::: formule-cle
En série, c'est l'**intensité** qui est commune.
En dérivation, c'est la **tension**.
Chaque grandeur est commune dans un montage et se partage dans l'autre.
:::

::: retenir Deux exemples chiffrés
Générateur `6 V`, deux lampes **en série** : chacune reçoit `3 V`, elles brillent moins.
Générateur `6 V`, deux lampes **en dérivation** : chacune reçoit `6 V`, elles brillent normalement, mais le générateur s'use deux fois plus vite.
:::

## 4. Les appareils de mesure

::: grille
| Grandeur | Symbole | Unité | Appareil | Branchement |
|---|---|---|---|---|
| Intensité | `I` | ampère, `A` | ampèremètre | **en série** |
| Tension | `U` | volt, `V` | voltmètre | **en dérivation** |
| Résistance | `R` | ohm, `Ω` | ohmmètre | hors circuit |
:::

::: piege Ne jamais brancher un ampèremètre en dérivation
Sa résistance est presque nulle : il provoquerait un **court-circuit** et se détruirait.
C'est l'erreur de manipulation la plus grave du chapitre.
:::

## 5. La loi d'Ohm

::: formule-cle
`U = R × I` · `R = U ÷ I` · `I = U ÷ R`
avec `U` en **volts**, `R` en **ohms**, `I` en **ampères**.
:::

::: grille
| Cherché | Connu | Calcul | Exemple |
|---|---|---|---|
| `U` | `R` et `I` | `U = R × I` | `100 × 0,05 = 5 V` |
| `I` | `U` et `R` | `I = U ÷ R` | `4,4 ÷ 220 = 0,02 A` |
| `R` | `U` et `I` | `R = U ÷ I` | `6 ÷ 0,3 = 20 Ω` |
:::

::: piege Les unités d'abord
`50 mA = 0,05 A`. Oublier cette conversion donne un résultat **mille fois** trop grand.
Convertis toujours **avant** de calculer.
:::

## 6. Puissance, énergie, sécurité

::: formule-cle
`P = U × I`, avec `P` en watts.
`E = P × t`, avec `E` en joules et `t` en secondes.
En usage domestique : `E` en kWh, `P` en **kilowatts**, `t` en **heures**. `1 kWh = 3 600 000 J`.
:::

::: retenir Un calcul de facture
Radiateur de `2 000 W` soit `2 kW`, `3 h` par jour pendant `30 jours` : `90 h` au total.
`E = 2 × 90 = 180 kWh`. À `0,20 € le kWh` : `36 €`.
:::

::: grille
| Dispositif | Protège | Comment |
|---|---|---|
| **Fusible** | l'installation | fond au-delà d'un seuil |
| **Disjoncteur** | l'installation | coupe et se réarme |
| **Disjoncteur différentiel** | **les personnes** | détecte une fuite vers la terre, dès `30 mA` |
| **Fil de terre** | les personnes | conduit la fuite vers le sol |
:::

::: piege Le corps humain est conducteur
`30 mA` traversant la poitrine peut être **mortel**. Sous `230 V` avec une peau humide, ce seuil est atteint immédiatement.
Un **court-circuit** annule la résistance : d'après `I = U ÷ R`, l'intensité devient très grande et les fils chauffent.
:::

## 7. Les mots-clés

::: motscles
- Circuit fermé
- Générateur
- Récepteur
- Dipôle
- Série
- Dérivation
- Nœud
- Branche
- Maille
- Intensité
- Ampère
- Ampèremètre
- Tension
- Volt
- Voltmètre
- Résistance
- Ohm
- Loi d'Ohm
- Puissance
- Kilowattheure
- Court-circuit
- Fusible
- Disjoncteur différentiel
:::

## 8. Les huit pièges

::: piege 1. Le branchement des appareils
Ampèremètre **en série**, voltmètre **en dérivation**. Jamais l'inverse.
:::

::: piege 2. L'ampèremètre en dérivation
Court-circuit immédiat et destruction de l'appareil.
:::

::: piege 3. Le tableau des quatre lois
En série l'intensité est commune, en dérivation c'est la tension.
:::

::: piege 4. Les unités de la loi d'Ohm
Volt, ohm, ampère. Convertir les milliampères avant de calculer.
:::

::: piege 5. Le kilowattheure
`P` en kilowatts, `t` en heures.
:::

::: piege 6. Le schéma
Symboles normalisés, fils tracés à la règle.
:::

::: piege 7. Fusible et différentiel
Le fusible protège l'installation, le différentiel protège les personnes.
:::

::: piege 8. Le corps humain
Il est conducteur. Seuil dangereux : `30 mA`.
:::

## 9. Auto-test

Réponds sans regarder la fiche de cours. Les réponses sont juste en dessous.

::: exercice 1 | application | 10 min | ecran
1. Dans quel sens circule le courant conventionnel ?
2. Que se passe-t-il si on retire une lampe d'un circuit en série ? Et en dérivation ?
3. Donne les quatre lois du tableau intensité et tension.
4. Comment branche-t-on un ampèremètre ? Et un voltmètre ?
5. Que risque-t-on en branchant un ampèremètre en dérivation ?
6. Donne les trois formes de la loi d'Ohm.
7. Une résistance de `150 Ω` est traversée par `40 mA`. Calcule la tension.
8. Comment calcule-t-on une puissance électrique ?
9. Quelle est la différence entre un fusible et un disjoncteur différentiel ?
10. Quel est le seuil dangereux pour le corps humain ?

::: corrige
1. De la borne **`+`** vers la borne **`−`**, à l'extérieur du générateur. C'est une convention : les électrons circulent en réalité en sens inverse.
2. **En série**, tout s'éteint : la boucle unique est ouverte. **En dérivation**, les autres continuent de fonctionner, car chaque branche est indépendante.
3. **En série** : l'intensité est la même partout, les tensions s'additionnent. **En dérivation** : les intensités s'additionnent aux nœuds, la tension est la même pour chaque branche.
4. L'**ampèremètre en série**, il faut donc ouvrir le circuit. Le **voltmètre en dérivation**, directement aux bornes du dipôle, sans toucher au circuit.
5. Un **court-circuit** : sa résistance est presque nulle, l'intensité devient très grande et l'appareil se détruit, ou le fusible fond.
6. `U = R × I`, `R = U ÷ I`, `I = U ÷ R`, avec volt, ohm et ampère.
7. Conversion d'abord : `40 mA = 0,04 A`. Puis `U = 150 × 0,04 = **6 V**`.
8. `P = U × I`, avec `P` en watts, `U` en volts et `I` en ampères.
9. Le **fusible** protège l'**installation** contre les surintensités : il fond quand le courant dépasse un seuil. Le **disjoncteur différentiel** protège les **personnes** : il détecte une fuite de courant vers la terre et coupe dès `30 mA`.
10. **`30 mA`**, soit `0,03 A`, traversant la poitrine. Sous `230 V` avec une peau humide, ce seuil est atteint immédiatement.
:::
:::

::: cocher
- Je connais le tableau des quatre lois par cœur
- Je branche correctement les deux appareils de mesure
- J'applique la loi d'Ohm après conversion des unités
- J'ai eu au moins 8 bonnes réponses sur 10 à l'auto-test
:::
