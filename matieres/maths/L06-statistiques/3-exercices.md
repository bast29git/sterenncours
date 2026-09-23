---
type: exercices
matiere: maths
lecon: L06
titre: Statistiques : exercices corrigés
resume: 20 exercices progressifs, du tableau d'effectifs au choix de l'indicateur et à la lecture critique d'un graphique, avec un corrigé détaillé pas à pas pour chacun.
duree: 3 séances de 45 min
competences:
  - Chercher
  - Modéliser
  - Représenter
  - Calculer
  - Communiquer
objectifs:
  - Construire et lire un tableau statistique
  - Calculer moyenne, médiane et étendue
  - Choisir l'indicateur adapté et le justifier
  - Repérer et corriger un graphique trompeur
---

::: plan
**Série A : effectifs et fréquences** (exercices 1 à 5)
**Série B : les trois indicateurs** (exercices 6 à 11)

*🔁 Pause*

**Série C : choisir et interpréter** (exercices 12 à 16)
**Série D : graphiques et devoir type** (exercices 17 à 20)
:::

::: materiel
- Une calculatrice
- Une règle et du papier quadrillé
- Un rapporteur pour l'exercice 17
:::

## Série A : effectifs et fréquences

::: exercice 1 | application | 5 min | ecran
Voici les pointures des 20 membres du club de dessin, relevées pour commander des chaussons d'atelier.

`38, 39, 38, 40, 41, 39, 38, 40, 39, 41, 38, 39, 40, 38, 41, 39, 40, 38, 39, 40`

1. Construis le tableau des effectifs.
2. Vérifie que le total vaut 20.

::: corrige
On compte chaque pointure.

| Pointure | 38 | 39 | 40 | 41 | Total |
|---|---|---|---|---|---|
| Effectif | 6 | 6 | 5 | 3 | **20** |

Vérification : `6 + 6 + 5 + 3 = 20`. Le total correspond bien au nombre d'élèves.

Méthode : relis la liste une seule fois en cochant chaque valeur au fur et à mesure, plutôt que de la relire une fois par pointure. Tu divises le risque d'erreur par quatre.
:::
:::

::: exercice 2 | application | 5 min | ecran
Reprends le tableau de l'exercice 1.

1. Calcule la fréquence de chaque pointure.
2. Donne chaque fréquence en pourcentage.
3. Vérifie la somme.

::: corrige
1. `6 ÷ 20 = 0,3` · `6 ÷ 20 = 0,3` · `5 ÷ 20 = 0,25` · `3 ÷ 20 = 0,15`

| Pointure | 38 | 39 | 40 | 41 | Total |
|---|---|---|---|---|---|
| Fréquence | 0,30 | 0,30 | 0,25 | 0,15 | **1** |
| Pourcentage | 30 % | 30 % | 25 % | 15 % | **100 %** |

3. `0,30 + 0,30 + 0,25 + 0,15 = 1`. La somme vaut bien 1, le calcul est cohérent.
:::
:::

::: exercice 3 | application | 5 min | ecran
Complète les effectifs cumulés de ce tableau, puis réponds.

| Temps de trajet, en min | 5 | 10 | 15 | 20 | 30 |
|---|---|---|---|---|---|
| Effectif | 4 | 7 | 9 | 6 | 4 |

1. Complète la ligne des effectifs cumulés.
2. Combien d'élèves mettent 15 minutes ou moins ?
3. Combien en mettent plus de 20 ?

::: corrige
1.

| Temps | 5 | 10 | 15 | 20 | 30 |
|---|---|---|---|---|---|
| Effectif | 4 | 7 | 9 | 6 | 4 |
| Effectif cumulé | 4 | 11 | 20 | 26 | 30 |

Chaque cumul s'obtient en ajoutant l'effectif à celui de la colonne précédente : `4`, puis `4 + 7 = 11`, puis `11 + 9 = 20`, puis `20 + 6 = 26`, puis `26 + 4 = 30`.

2. **20 élèves**, c'est directement l'effectif cumulé de la colonne 15.
3. Ceux qui mettent plus de 20 minutes sont ceux de la colonne 30, soit **4 élèves**. On peut aussi calculer `30 − 26 = 4`.
:::
:::

::: exercice 4 | application | 4 min | ecran
Pour chaque caractère, dis s'il est quantitatif ou qualitatif, et si l'on peut en calculer la moyenne.

1. La taille des élèves. · 2. La couleur des yeux. · 3. Le nombre de frères et sœurs. · 4. Le sport pratiqué. · 5. La note de mathématiques.

::: corrige
1. **Quantitatif**, moyenne possible.
2. **Qualitatif**, moyenne impossible.
3. **Quantitatif**, moyenne possible.
4. **Qualitatif**, moyenne impossible.
5. **Quantitatif**, moyenne possible.

Le test : puis-je additionner deux valeurs et obtenir quelque chose qui a un sens ? `1,60 m + 1,70 m` a un sens ; `bleu + vert` n'en a aucun.
:::
:::

::: exercice 5 | entrainement | 6 min | ecran
Un tableau a été mal recopié. Trouve l'erreur et corrige-la.

| Valeur | 2 | 4 | 6 | 8 | Total |
|---|---|---|---|---|---|
| Effectif | 5 | 8 | 7 | 4 | 24 |
| Fréquence | 0,21 | 0,33 | 0,29 | 0,21 | 1,04 |

::: corrige
Le total des fréquences vaut **1,04**, alors qu'il doit valoir 1. Il y a donc une erreur.

Vérifions chaque fréquence :
`5 ÷ 24 ≈ 0,21` · `8 ÷ 24 ≈ 0,33` · `7 ÷ 24 ≈ 0,29` · `4 ÷ 24 ≈ 0,17`

La dernière fréquence est fausse : elle vaut **0,17** et non 0,21. Le total corrigé donne `0,21 + 0,33 + 0,29 + 0,17 = 1,00`.

Retiens la méthode : quand la somme des fréquences ne vaut pas 1, recalcule-les une par une. L'écart de `0,04` correspondait exactement à l'erreur de la dernière colonne.
:::
:::

## Série B : les trois indicateurs

::: exercice 6 | application | 4 min | ecran
Calcule la moyenne de chaque série.

1. `12, 15, 9, 14, 10`
2. `6, 6, 6, 6`
3. `0, 5, 10, 15, 20, 30`

::: corrige
1. Somme : `12 + 15 + 9 + 14 + 10 = 60`. Nombre de valeurs : 5. Moyenne : `60 ÷ 5 = **12**`.
2. Somme : `24`. Nombre : 4. Moyenne : `24 ÷ 4 = **6**`. Quand toutes les valeurs sont égales, la moyenne leur est égale.
3. Somme : `0 + 5 + 10 + 15 + 20 + 30 = 80`. Nombre : 6. Moyenne : `80 ÷ 6 ≈ **13,33**`.
:::
:::

::: exercice 7 | application | 6 min | ecran
Calcule la moyenne pondérée de cette série.

| Note | 8 | 10 | 12 | 14 | 16 |
|---|---|---|---|---|---|
| Effectif | 3 | 6 | 8 | 5 | 3 |

::: corrige
**Étape 1**, multiplier chaque note par son effectif :
`8 × 3 = 24` · `10 × 6 = 60` · `12 × 8 = 96` · `14 × 5 = 70` · `16 × 3 = 48`

**Étape 2**, additionner ces produits :
`24 + 60 + 96 + 70 + 48 = 298`

**Étape 3**, additionner les effectifs :
`3 + 6 + 8 + 5 + 3 = 25`

**Étape 4**, diviser :
`298 ÷ 25 = **11,92**`

Attention : le dénominateur est **25**, l'effectif total, et non 5, le nombre de notes différentes. Si tu avais divisé par 5, tu aurais trouvé 59,6, un résultat impossible pour une note sur 20. Ce contrôle de vraisemblance repère l'erreur immédiatement.
:::
:::

::: exercice 8 | application | 5 min | ecran
Détermine la médiane de chaque série.

1. `9, 10, 12, 14, 15`
2. `8, 10, 12, 14, 15, 18`
3. `7, 3, 9, 1, 5`

::: corrige
1. La série est déjà rangée. `n = 5`, impair. Rang : `(5 + 1) ÷ 2 = 3`. La 3ᵉ valeur est **12**.
2. Série rangée. `n = 6`, pair. Rangs `3` et `4` : les valeurs 12 et 14. Médiane : `(12 + 14) ÷ 2 = **13**`.
3. **Attention** : la série n'est pas rangée. On la range d'abord : `1, 3, 5, 7, 9`. `n = 5`, impair. Rang 3 : la valeur **5**.

Sans rangement préalable, on aurait lu 9, qui est la 3ᵉ valeur de la liste d'origine : une erreur complète.
:::
:::

::: exercice 9 | entrainement | 6 min | ecran
Détermine la médiane de cette série à l'aide des effectifs cumulés.

| Valeur | 5 | 10 | 15 | 20 | 30 |
|---|---|---|---|---|---|
| Effectif | 4 | 7 | 9 | 6 | 4 |

::: corrige
**Étape 1**, les effectifs cumulés : `4`, `11`, `20`, `26`, `30`.

**Étape 2**, l'effectif total vaut `30`, qui est **pair**. La médiane est donc la moyenne des valeurs de rang `30 ÷ 2 = 15` et `16`.

**Étape 3**, où se trouvent le 15ᵉ et le 16ᵉ individu ? Le cumul passe de 11 à 20 dans la colonne de la valeur 15 : les individus de rang 12 à 20 y sont tous. Les rangs 15 et 16 s'y trouvent donc.

**Étape 4**, les deux valeurs centrales valent toutes deux **15**. Médiane : `(15 + 15) ÷ 2 = **15**`.
:::
:::

::: exercice 10 | application | 4 min | ecran
Calcule l'étendue de chaque série.

1. `12, 15, 9, 14, 10`
2. `0, 0, 20`
3. `0, 10, 20`

::: corrige
1. Maximum 15, minimum 9. Étendue : `15 − 9 = **6**`.
2. Maximum 20, minimum 0. Étendue : `20 − 0 = **20**`.
3. Maximum 20, minimum 0. Étendue : `20 − 0 = **20**`.

Les séries 2 et 3 ont la **même étendue** mais des moyennes très différentes : `40 ÷ 3 ≈ 6,67` contre `30 ÷ 3 = 10`. L'étendue ne regarde que les deux extrêmes et ignore complètement ce qu'il y a entre eux.
:::
:::

::: exercice 11 | entrainement | 8 min | ecran
Voici les résultats de deux classes à un même contrôle.

**Classe A** : `8, 9, 10, 11, 12, 12, 13, 14, 15, 16`
**Classe B** : `2, 4, 6, 12, 13, 13, 14, 18, 19, 19`

1. Calcule la moyenne de chaque classe.
2. Calcule la médiane de chaque classe.
3. Calcule l'étendue de chaque classe.
4. Que peux-tu dire en comparant les deux classes ?

::: corrige
1. **Classe A** : `8+9+10+11+12+12+13+14+15+16 = 120`. Moyenne : `120 ÷ 10 = **12**`.
   **Classe B** : `2+4+6+12+13+13+14+18+19+19 = 120`. Moyenne : `120 ÷ 10 = **12**`.

2. Les deux séries sont rangées. `n = 10`, pair, donc rangs 5 et 6.
   **Classe A** : 5ᵉ = 12, 6ᵉ = 12. Médiane : `(12 + 12) ÷ 2 = **12**`.
   **Classe B** : 5ᵉ = 13, 6ᵉ = 13. Médiane : `(13 + 13) ÷ 2 = **13**`.

3. **Classe A** : `16 − 8 = **8**`. **Classe B** : `19 − 2 = **17**`.

4. Les deux classes ont **exactement la même moyenne**, et des médianes très proches. Pourtant elles ne se ressemblent pas du tout. L'étendue de la classe B est plus du double de celle de la classe A : les résultats y sont beaucoup plus **dispersés**, avec des élèves à 2 et d'autres à 19. Dans la classe A, tout le monde se tient entre 8 et 16.

Conclusion de méthode : la moyenne seule ne décrit pas une série. Il faut lui adjoindre au moins un indicateur de **dispersion**.
:::
:::

*🔁 Pause. Reprends après une vraie coupure.*

## Série C : choisir et interpréter

::: exercice 12 | entrainement | 8 min | ecran
Voici les salaires mensuels, en euros, des six employés d'une entreprise.

`1500, 1600, 1600, 1700, 1800, 12000`

1. Calcule la moyenne.
2. Calcule la médiane.
3. Combien d'employés gagnent moins que la moyenne ?
4. Lequel des deux indicateurs décrit le mieux la situation ? Justifie en deux phrases.

::: corrige
1. Somme : `1500 + 1600 + 1600 + 1700 + 1800 + 12000 = 20200`. Moyenne : `20200 ÷ 6 ≈ **3367 €**`.
2. `n = 6`, pair. Rangs 3 et 4 : `1600` et `1700`. Médiane : `(1600 + 1700) ÷ 2 = **1650 €**`.
3. **Cinq employés sur six** gagnent moins de 3367 €. Seul le sixième, à 12 000 €, gagne davantage.
4. La **médiane** décrit bien mieux la situation. Un seul salaire très élevé suffit à tirer la moyenne vers le haut, si bien qu'elle ne correspond à la situation d'aucun employé ordinaire. La médiane, qui ne regarde que le rang, reste à 1650 € quelle que soit la valeur du plus haut salaire.
:::
:::

::: exercice 13 | entrainement | 7 min | ecran
Dans chaque cas, dis quel indicateur tu choisirais et pourquoi, en une phrase.

1. Le prix moyen d'un logement dans une ville où quelques villas valent dix fois plus que les autres biens.
2. La taille moyenne des élèves d'une classe.
3. Le temps de trajet des élèves, avec un élève qui vient de très loin.
4. La note moyenne d'un contrôle où les notes vont de 8 à 16.

::: corrige
1. La **médiane** : quelques valeurs très élevées feraient monter la moyenne sans rien dire du prix qu'un habitant paiera réellement.
2. La **moyenne** : les tailles d'une classe sont regroupées, sans valeur aberrante, les deux indicateurs seraient d'ailleurs très proches.
3. La **médiane** : un seul trajet très long suffit à fausser la moyenne, alors que la médiane décrit le trajet d'un élève ordinaire.
4. La **moyenne** : l'étendue vaut 8, les valeurs sont regroupées, rien ne justifie de s'en écarter.

Règle générale : cherche d'abord s'il existe une valeur **très éloignée** des autres. C'est elle qui décide.
:::
:::

::: exercice 14 | entrainement | 7 min | ecran
La moyenne d'une classe de 20 élèves est de 11. On ajoute un 21ᵉ élève qui a obtenu 18.

1. Quelle était la somme des notes des 20 premiers élèves ?
2. Quelle est la nouvelle somme ?
3. Quelle est la nouvelle moyenne, arrondie au dixième ?

::: corrige
1. Si la moyenne vaut 11 pour 20 élèves, la somme vaut `11 × 20 = **220**`.
   Cette étape utilise la formule à l'envers : `somme = moyenne × effectif`.
2. On ajoute 18 : `220 + 18 = **238**`.
3. L'effectif est maintenant de 21 : `238 ÷ 21 ≈ **11,3**`.

La moyenne n'a gagné que 0,3 point, alors que la note ajoutée dépassait l'ancienne moyenne de 7 points. Un seul individu pèse peu quand l'effectif est grand : c'est précisément pourquoi une valeur aberrante est plus dangereuse dans une petite série.
:::
:::

::: exercice 15 | entrainement | 8 min | ecran
Une série de 5 valeurs a pour moyenne 10 et pour médiane 8.

1. Est-ce possible ? Justifie.
2. Propose une série de 5 nombres entiers qui vérifie ces deux conditions.
3. Que peux-tu dire de la forme de cette série ?

::: corrige
1. **Oui, c'est parfaitement possible.** La moyenne et la médiane sont deux indicateurs indépendants. La moyenne peut être supérieure à la médiane quand quelques grandes valeurs tirent la somme vers le haut.
2. Cherchons une série `a ≤ b ≤ c ≤ d ≤ e` avec `c = 8` et une somme de `10 × 5 = 50`.
   Prenons `4, 6, 8, 10, 22` : la médiane est bien la 3ᵉ valeur, `8`. La somme vaut `4 + 6 + 8 + 10 + 22 = 50`, donc la moyenne vaut `50 ÷ 5 = 10`.
   D'autres solutions existent, par exemple `2, 5, 8, 15, 20`.
3. Quand la **moyenne dépasse la médiane**, cela signale la présence d'une ou plusieurs valeurs nettement plus grandes que le reste. La série est « étirée vers le haut ». L'écart entre les deux indicateurs est donc lui-même une information sur la forme de la série.
:::
:::

::: exercice 16 | approfondissement | 8 min | main
Un article de presse affirme : « Le salaire moyen dans cette entreprise est de 3400 €, c'est une entreprise qui paie bien. »

1. Quelle information manque pour juger de cette affirmation ? Cite deux éléments.
2. Rédige une phrase plus honnête, en t'appuyant sur les données de l'exercice 12.

::: corrige
1. Deux éléments au minimum :
   - la **médiane**, car la moyenne seule ne dit rien de la répartition ;
   - l'**étendue** ou l'écart entre le plus haut et le plus bas salaire, qui révélerait la présence d'une valeur aberrante.
   On peut aussi citer l'effectif, car sur six personnes un seul salaire pèse énormément, et la répartition par poste.
2. Exemple : « Dans cette entreprise de six personnes, le salaire moyen est de 3400 €, mais le salaire médian n'est que de 1650 € : cinq employés sur six gagnent moins de 1800 €, un seul gagne 12 000 €. »

Le principe : une moyenne isolée n'est jamais une description suffisante. Elle doit être accompagnée d'au moins un indicateur de dispersion.
:::
:::

## Série D : graphiques et devoir type

::: exercice 17 | entrainement | 9 min | main
On souhaite représenter cette série par un diagramme circulaire.

| Sport | Football | Natation | Danse | Autre | Total |
|---|---|---|---|---|---|
| Effectif | 10 | 6 | 5 | 4 | 25 |

1. Calcule l'angle de chaque secteur, arrondi au degré.
2. Vérifie la somme des angles.
3. Trace le diagramme.

::: corrige
1. `angle = (effectif ÷ effectif total) × 360°`
   Football : `(10 ÷ 25) × 360 = 0,4 × 360 = **144°**`
   Natation : `(6 ÷ 25) × 360 = 0,24 × 360 = **86,4°**`, arrondi à **86°**
   Danse : `(5 ÷ 25) × 360 = 0,2 × 360 = **72°**`
   Autre : `(4 ÷ 25) × 360 = 0,16 × 360 = **57,6°**`, arrondi à **58°**

2. `144 + 86 + 72 + 58 = 360`. La somme est exacte.
   Quand les arrondis donnent 359 ou 361, on ajuste d'un degré le plus grand secteur : l'écart y est le moins visible.

3. Trace un cercle, puis reporte les angles au rapporteur en partant du même rayon, secteur après secteur. Chaque secteur porte son **libellé écrit** en plus de sa couleur : un diagramme qui ne repose que sur la couleur devient illisible en noir et blanc.
:::
:::

::: exercice 18 | entrainement | 7 min | ecran
Un graphique montre l'évolution du nombre d'adhérents d'un club : 95 en 2023, 100 en 2024. L'axe vertical commence à 94 et se termine à 101.

1. De combien d'adhérents le club a-t-il augmenté ?
2. Quelle est l'augmentation en pourcentage ?
3. Pourquoi ce graphique est-il trompeur ?
4. Comment le corriger ?

::: corrige
1. `100 − 95 = **5 adhérents**`.
2. `(5 ÷ 95) × 100 ≈ **5,3 %**`.
3. Parce que l'axe vertical ne part pas de zéro : il ne couvre que 7 unités, de 94 à 101. La barre de 2024 paraît alors plus de deux fois plus haute que celle de 2023, alors que l'augmentation réelle n'est que de 5,3 %. L'œil compare des **hauteurs de barres**, pas des nombres, et l'échelle tronquée fausse cette comparaison.
4. En faisant **partir l'axe vertical de zéro**. Les deux barres seraient alors presque de même hauteur, ce qui correspond à la réalité. Si l'on tient absolument à montrer le détail, on peut garder l'échelle réduite mais signaler clairement la rupture d'axe et indiquer les valeurs chiffrées sur les barres.
:::
:::

::: exercice 19 | approfondissement | 9 min | main
Trois affirmations sont tirées d'un même tableau. Dis pour chacune si elle est **exacte**, **inexacte** ou **impossible à vérifier**, et justifie.

| Note | 6 | 8 | 10 | 12 | 14 | 16 | 18 |
|---|---|---|---|---|---|---|---|
| Effectif | 2 | 3 | 5 | 7 | 6 | 4 | 3 |

1. « La majorité des élèves a la moyenne. »
2. « La note la plus fréquente est 12. »
3. « La classe a progressé depuis le dernier contrôle. »

::: corrige
Effectif total : `2 + 3 + 5 + 7 + 6 + 4 + 3 = 30`.

1. **Exacte.** Avoir la moyenne signifie avoir au moins 10. Les élèves concernés sont ceux des colonnes 10 à 18 : `5 + 7 + 6 + 4 + 3 = 25`. Cela fait `25 ÷ 30 ≈ 83 %`, donc bien une majorité.
2. **Exacte.** L'effectif le plus élevé est 7, dans la colonne de la note 12. On appelle cette valeur le **mode** de la série.
3. **Impossible à vérifier.** Le tableau ne donne les résultats que d'**un seul** contrôle. Sans les données du contrôle précédent, aucune comparaison n'est possible. Une affirmation de progression demande deux séries, pas une.

L'exercice montre trois cas distincts : une affirmation vérifiable par calcul, une vérifiable par lecture directe, et une qui excède ce que les données permettent de dire.
:::
:::

::: exercice 20 | approfondissement | 45 min | main
**Devoir type. Quatre parties. Barème sur 20 points, indiqué à la fin.**

**Partie A. Construire un tableau**

Voici les temps, en minutes, mis par 24 élèves pour venir au collège.

`5, 10, 15, 10, 20, 5, 15, 10, 25, 15, 10, 5, 20, 15, 10, 25, 15, 10, 5, 20, 15, 10, 15, 20`

a. Construis le tableau des effectifs et vérifie le total.
b. Ajoute la ligne des fréquences en pourcentage, arrondies au dixième.
c. Ajoute la ligne des effectifs cumulés.

**Partie B. Les trois indicateurs**

a. Calcule la moyenne, arrondie au dixième. Détaille les quatre étapes.
b. Détermine la médiane en utilisant les effectifs cumulés. Justifie.
c. Calcule l'étendue.

**Partie C. Interpréter**

a. Combien d'élèves mettent 15 minutes ou moins ?
b. Quel pourcentage cela représente-t-il ?
c. Un élève affirme : « la moitié des élèves met plus de 15 minutes ». A-t-il raison ? Justifie par un calcul.
d. Le collège veut avancer l'heure du bus de 10 minutes. Quel indicateur lui est le plus utile, la moyenne ou la médiane ? Justifie en deux phrases.

**Partie D. Graphique**

a. Calcule les angles pour représenter cette série par un diagramme circulaire. Arrondis au degré et vérifie la somme.
b. Un journal représente ces données par un diagramme en bâtons dont l'axe vertical commence à 1 au lieu de 0. Explique en trois phrases pourquoi c'est trompeur et comment le corriger.

::: corrige
**Partie A**

a. On compte chaque valeur.

| Temps, min | 5 | 10 | 15 | 20 | 25 | Total |
|---|---|---|---|---|---|---|
| Effectif | 4 | 7 | 7 | 4 | 2 | **24** |

Vérification : `4 + 7 + 7 + 4 + 2 = 24`. Le total correspond au nombre d'élèves.

b. `4 ÷ 24 ≈ 0,167` soit **16,7 %** · `7 ÷ 24 ≈ 0,292` soit **29,2 %** · **29,2 %** · **16,7 %** · `2 ÷ 24 ≈ 0,083` soit **8,3 %**.
Somme : `16,7 + 29,2 + 29,2 + 16,7 + 8,3 = 100,1 %`. L'écart de 0,1 point vient des arrondis, il est normal et doit être signalé.

c. Effectifs cumulés : `4`, `11`, `18`, `22`, `24`.

**Partie B**

a. **Étape 1**, les produits : `5 × 4 = 20` · `10 × 7 = 70` · `15 × 7 = 105` · `20 × 4 = 80` · `25 × 2 = 50`.
   **Étape 2**, la somme : `20 + 70 + 105 + 80 + 50 = 325`.
   **Étape 3**, l'effectif total : `24`.
   **Étape 4**, la division : `325 ÷ 24 ≈ **13,5 minutes**`.

b. `n = 24`, **pair**. La médiane est la moyenne des valeurs de rang `24 ÷ 2 = 12` et `13`.
   Les effectifs cumulés valent `4`, `11`, `18` : le cumul passe de 11 à 18 dans la colonne du temps 15. Les individus de rang 12 à 18 s'y trouvent donc, ce qui inclut les rangs 12 et 13.
   Les deux valeurs centrales valent toutes deux 15. Médiane : `(15 + 15) ÷ 2 = **15 minutes**`.

c. `25 − 5 = **20 minutes**`.

**Partie C**

a. C'est l'effectif cumulé de la colonne 15, soit **18 élèves**.

b. `(18 ÷ 24) × 100 = **75 %**`.

c. **Non, il a tort.** S'il y a 18 élèves à 15 minutes ou moins, il n'en reste que `24 − 18 = 6` au-delà, soit `(6 ÷ 24) × 100 = 25 %`. Un quart des élèves, et non la moitié, met plus de 15 minutes. L'élève a sans doute confondu la médiane, qui vaut 15, avec l'idée que la moitié des élèves se trouve strictement au-dessus : or les élèves qui mettent exactement 15 minutes sont nombreux, sept sur vingt-quatre, et ils comptent du côté « 15 minutes ou moins ».

d. La **médiane** est plus utile ici. Elle indique le temps qu'un élève ordinaire met réellement, alors que la moyenne, tirée vers le bas par les quatre élèves à 5 minutes, sous-estime le trajet de la majorité. Pour décider d'une heure de bus, ce qui compte est de couvrir la situation du plus grand nombre, pas de résumer l'ensemble par un seul nombre.

**Partie D**

a. `angle = (effectif ÷ 24) × 360°`
   5 min : `(4 ÷ 24) × 360 = 60°`
   10 min : `(7 ÷ 24) × 360 = 105°`
   15 min : `105°`
   20 min : `60°`
   25 min : `(2 ÷ 24) × 360 = 30°`
   Somme : `60 + 105 + 105 + 60 + 30 = **360°**`. Exact.

b. Si l'axe commence à 1, chaque barre perd une unité de hauteur : celle de l'effectif 7 mesure 6 unités et celle de l'effectif 4 en mesure 3, si bien que la première paraît **deux fois** plus haute alors qu'elle ne dépasse la seconde que de 75 %. La barre de l'effectif 2 se réduit à une seule unité et semble trois fois plus petite que celle de l'effectif 4, alors qu'elle en vaut la moitié. L'œil compare des hauteurs de barres, et une origine tronquée fausse toutes ces comparaisons : il faut faire **partir l'axe vertical de zéro** et, si besoin, écrire les effectifs au sommet de chaque barre.

**Barème indicatif**
Partie A : 5 points (2 pour le tableau et la vérification, 2 pour les fréquences, 1 pour les cumuls).
Partie B : 6 points (3 pour la moyenne détaillée, 2 pour la médiane justifiée, 1 pour l'étendue).
Partie C : 6 points (1 + 1 pour les lectures, 2 pour la réfutation chiffrée, 2 pour le choix justifié).
Partie D : 3 points (1,5 pour les angles et la vérification, 1,5 pour l'analyse du graphique).
:::
:::

::: cocher
- J'ai fait tous les exercices de la série A
- J'ai fait tous les exercices de la série B
- J'ai fait tous les exercices de la série C
- J'ai traité le sujet de type devoir en temps limité
- J'ai comparé chaque réponse au corrigé avant de passer à la suite
:::
