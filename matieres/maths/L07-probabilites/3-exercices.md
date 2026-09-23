---
type: exercices
matiere: maths
lecon: L07
titre: Probabilités : exercices corrigés
resume: 20 exercices progressifs, du vocabulaire à l'arbre des possibles et au raisonnement critique sur le hasard, avec un corrigé détaillé pas à pas pour chacun.
duree: 3 séances de 45 min
competences:
  - Chercher
  - Modéliser
  - Représenter
  - Calculer
  - Raisonner
objectifs:
  - Lister les issues d'une expérience aléatoire
  - Calculer une probabilité et la vérifier
  - Construire un arbre et un tableau à deux épreuves
  - Réfuter un raisonnement faux sur le hasard
---

::: plan
**Série A : vocabulaire et calcul de base** (exercices 1 à 5)
**Série B : événement contraire et deux épreuves** (exercices 6 à 11)

*🔁 Pause*

**Série C : arbres, tableaux et fréquences** (exercices 12 à 16)
**Série D : raisonner et devoir type** (exercices 17 à 20)
:::

::: materiel
- Un dé, une pièce
- Une calculatrice
- Du papier pour les arbres
:::

## Série A : vocabulaire et calcul de base

::: exercice 1 | application | 4 min | ecran
Pour chaque expérience, dis si elle est aléatoire et justifie en une phrase.

1. Lancer un dé à six faces.
2. Lâcher une pomme d'une table.
3. Tirer une carte dans un jeu de 32.
4. Calculer `7 × 8`.
5. Faire tourner une roue de loterie.

::: corrige
1. **Aléatoire** : six résultats possibles, aucun prévisible.
2. **Non aléatoire** : la pomme tombe à tous les coups, le résultat est certain.
3. **Aléatoire** : 32 résultats possibles, aucun prévisible.
4. **Non aléatoire** : le résultat vaut toujours 56.
5. **Aléatoire** : plusieurs secteurs possibles, aucun prévisible.

Retiens la définition exacte : on connaît la **liste** des résultats possibles, on ignore **lequel** sortira.
:::
:::

::: exercice 2 | application | 5 min | ecran
On lance un dé à six faces équilibré.

1. Liste toutes les issues.
2. Liste les issues de l'événement « obtenir un multiple de 3 ».
3. Liste les issues de l'événement « obtenir un nombre supérieur à 4 ».
4. L'événement « obtenir 0 » est-il possible ?

::: corrige
1. Les six issues : `1 ; 2 ; 3 ; 4 ; 5 ; 6`.
2. Les multiples de 3 parmi ces issues : `{3 ; 6}`, soit **deux issues**.
3. Les nombres strictement supérieurs à 4 : `{5 ; 6}`, soit **deux issues**.
4. **Non**, c'est un événement **impossible** : aucune issue ne lui correspond, sa probabilité vaut `0`.

Au point 3, attention au mot « supérieur » : sans « ou égal », 4 n'est pas compté.
:::
:::

::: exercice 3 | application | 5 min | ecran
Calcule la probabilité de chaque événement pour un lancer de dé.

1. Obtenir un 5.
2. Obtenir un nombre pair.
3. Obtenir un multiple de 3.
4. Obtenir un nombre inférieur ou égal à 4.
5. Obtenir un nombre entre 1 et 6.

::: corrige
1. Une issue favorable sur six : `P = 1 ÷ 6 ≈ **0,17**`.
2. Trois issues favorables, `{2 ; 4 ; 6}` : `P = 3 ÷ 6 = **0,5**`.
3. Deux issues, `{3 ; 6}` : `P = 2 ÷ 6 = 1 ÷ 3 ≈ **0,33**`.
4. Quatre issues, `{1 ; 2 ; 3 ; 4}` : `P = 4 ÷ 6 = 2 ÷ 3 ≈ **0,67**`.
5. Les six issues : `P = 6 ÷ 6 = **1**`. C'est un événement **certain**.

Contrôle systématique : chacune de ces cinq valeurs est bien comprise entre 0 et 1.
:::
:::

::: exercice 4 | application | 5 min | ecran
Un sac contient 4 boules rouges, 3 boules vertes et 5 boules bleues. On en tire une au hasard.

1. Combien y a-t-il d'issues ?
2. Calcule la probabilité de tirer une boule rouge.
3. Calcule la probabilité de tirer une boule verte.
4. Calcule la probabilité de tirer une boule bleue.
5. Vérifie ton travail.

::: corrige
1. `4 + 3 + 5 = **12 issues**`, une par boule.
2. `P(rouge) = 4 ÷ 12 = 1 ÷ 3 ≈ **0,33**`.
3. `P(verte) = 3 ÷ 12 = 1 ÷ 4 = **0,25**`.
4. `P(bleue) = 5 ÷ 12 ≈ **0,42**`.
5. Vérification : `4/12 + 3/12 + 5/12 = 12/12 = **1**`. La somme des probabilités de toutes les issues vaut bien 1, le calcul est cohérent.

Ce contrôle par la somme est le plus rapide et le plus sûr. Prends l'habitude de le faire systématiquement.
:::
:::

::: exercice 5 | entrainement | 6 min | ecran
Une roue est partagée en quatre secteurs : un secteur rouge occupe la **moitié** du disque, et trois secteurs, vert, bleu et jaune, occupent chacun **un sixième**.

1. Peut-on dire que la probabilité du rouge vaut `1 ÷ 4` ? Justifie.
2. Calcule la probabilité de chaque couleur.
3. Vérifie la somme.

::: corrige
1. **Non.** Il y a bien quatre secteurs, mais ils ne sont **pas équiprobables** : le rouge occupe une surface trois fois plus grande que chacun des autres. La formule `favorables ÷ possibles` ne s'applique qu'en cas d'équiprobabilité. Ici, il faut raisonner sur les **surfaces**.
2. `P(rouge) = **1 ÷ 2 = 0,5**`. `P(vert) = P(bleu) = P(jaune) = **1 ÷ 6 ≈ 0,17**`.
3. `1/2 + 1/6 + 1/6 + 1/6 = 3/6 + 3/6 = 6/6 = **1**`. La somme vaut bien 1.

Cet exercice est le contre-exemple à retenir : compter les secteurs sans regarder leur taille est le piège numéro un du chapitre.
:::
:::

## Série B : événement contraire et deux épreuves

::: exercice 6 | application | 4 min | ecran
Donne l'événement contraire de chacun, puis sa probabilité, pour un lancer de dé.

1. « Obtenir un 6 »
2. « Obtenir un nombre pair »
3. « Obtenir un nombre supérieur à 2 »

::: corrige
1. Contraire : « **ne pas obtenir 6** », c'est-à-dire obtenir 1, 2, 3, 4 ou 5. `P = 1 − 1/6 = **5/6 ≈ 0,83**`.
2. Contraire : « obtenir un nombre **impair** ». `P = 1 − 0,5 = **0,5**`.
3. Contraire : « obtenir un nombre **inférieur ou égal à 2** », donc 1 ou 2. `P = 1 − 4/6 = 2/6 = **1/3 ≈ 0,33**`.

Attention au point 3 : le contraire de « supérieur à 2 » est « inférieur **ou égal** à 2 », et non « inférieur à 2 ». Oublier l'égalité fait perdre une issue.
:::
:::

::: exercice 7 | entrainement | 7 min | ecran
On lance deux dés à six faces.

1. Combien y a-t-il d'issues ?
2. Calcule la probabilité de n'obtenir **aucun** 6.
3. Déduis-en la probabilité d'obtenir **au moins un** 6.
4. Pourquoi la méthode par le contraire est-elle plus rapide ici ?

::: corrige
1. `6 × 6 = **36 issues**`.
2. Pour n'avoir aucun 6, chaque dé doit donner un résultat parmi `{1 ; 2 ; 3 ; 4 ; 5}`, soit 5 possibilités. Cela fait `5 × 5 = 25` issues favorables. `P(aucun 6) = 25 ÷ 36 ≈ **0,69**`.
3. `P(au moins un 6) = 1 − 25/36 = **11/36 ≈ 0,31**`.
4. Parce que compter directement les issues contenant au moins un 6 demande de les énumérer une par une : celles où le premier dé donne 6, celles où le second donne 6, en prenant garde à ne pas compter deux fois le couple `(6 ; 6)`. Le risque d'erreur est élevé. Le contraire, lui, se calcule d'un seul produit.

Vérification possible : les issues avec au moins un 6 sont les 6 de la ligne du 6, plus les 6 de la colonne du 6, moins le couple `(6 ; 6)` compté deux fois, soit `6 + 6 − 1 = 11`. On retrouve bien 11.
:::
:::

::: exercice 8 | application | 5 min | ecran
Calcule le nombre d'issues de chaque expérience.

1. On lance une pièce puis un dé.
2. On lance trois pièces.
3. Un sac contient 6 boules, on en tire 2 **avec** remise.
4. Un sac contient 6 boules, on en tire 2 **sans** remise.

::: corrige
1. `2 × 6 = **12 issues**`.
2. `2 × 2 × 2 = **8 issues**`.
3. `6 × 6 = **36 issues**` : la boule est reposée, le second tirage a toujours 6 possibilités.
4. `6 × 5 = **30 issues**` : après le premier tirage, il ne reste que 5 boules.

La différence entre les points 3 et 4 tient à un seul mot de l'énoncé. Repère-le avant de compter.
:::
:::

::: exercice 9 | entrainement | 6 min | ecran
On lance deux pièces.

1. Trace l'arbre des possibles.
2. Liste les quatre issues.
3. Calcule la probabilité d'obtenir deux fois pile.
4. Calcule la probabilité d'obtenir exactement un pile.
5. Un élève affirme : « il y a trois résultats, deux piles, deux faces, ou un de chaque, donc la probabilité d'un de chaque vaut 1/3 ». Où est l'erreur ?

::: corrige
1. Premier niveau : `P` et `F`. De chacun repartent `P` et `F`. Quatre chemins au total.
2. `(P ; P)`, `(P ; F)`, `(F ; P)`, `(F ; F)`.
3. Une issue favorable sur quatre : `P = 1 ÷ 4 = **0,25**`.
4. Deux issues favorables, `(P ; F)` et `(F ; P)` : `P = 2 ÷ 4 = **0,5**`.
5. L'erreur est de compter des **résultats** au lieu d'**issues**. Les trois « résultats » qu'il décrit ne sont pas équiprobables : « un de chaque » correspond à **deux** issues distinctes, alors que « deux piles » n'en correspond qu'à une. La formule ne s'applique qu'à des issues équiprobables, et ce sont les quatre couples qui le sont, pas les trois résultats.

C'est exactement la même erreur que celle qui consisterait à compter les sommes de deux dés plutôt que les couples.
:::
:::

::: exercice 10 | entrainement | 7 min | ecran
Un sac contient 3 boules numérotées 1, 2 et 3. On en tire deux **sans** remise.

1. Combien y a-t-il d'issues ?
2. Liste-les toutes.
3. Calcule la probabilité que la somme des deux numéros vaille 5.
4. Calcule la probabilité que le premier numéro tiré soit plus grand que le second.

::: corrige
1. `3 × 2 = **6 issues**`.
2. `(1 ; 2)`, `(1 ; 3)`, `(2 ; 1)`, `(2 ; 3)`, `(3 ; 1)`, `(3 ; 2)`. On les écrit dans l'ordre pour n'en oublier aucune.
3. Les sommes valant 5 : `(2 ; 3)` et `(3 ; 2)`, soit **deux issues**. `P = 2 ÷ 6 = **1/3 ≈ 0,33**`.
4. Les issues où le premier dépasse le second : `(2 ; 1)`, `(3 ; 1)`, `(3 ; 2)`, soit **trois issues**. `P = 3 ÷ 6 = **0,5**`.

Le résultat du point 4 était prévisible : par symétrie, il y a autant d'issues croissantes que décroissantes, et aucune égalité n'est possible sans remise.
:::
:::

::: exercice 11 | approfondissement | 8 min | main
Une urne contient 2 boules blanches et 3 boules noires. On tire deux boules **avec** remise.

1. Combien y a-t-il d'issues ?
2. Calcule la probabilité d'obtenir deux boules blanches.
3. Calcule la probabilité d'obtenir au moins une boule noire.
4. Reprends la question 2 dans le cas d'un tirage **sans** remise.

::: corrige
1. `5 × 5 = **25 issues**`.
2. Pour obtenir deux blanches, il faut une blanche au premier tirage, 2 possibilités sur 5, et une blanche au second, encore 2 sur 5. Cela fait `2 × 2 = 4` issues favorables sur 25. `P = 4 ÷ 25 = **0,16**`.
3. Le contraire de « au moins une noire » est « **aucune noire** », c'est-à-dire « deux blanches », dont la probabilité vient d'être calculée. `P(au moins une noire) = 1 − 0,16 = **0,84**`.
4. **Sans remise**, il reste 4 boules au second tirage, dont une seule blanche. Le nombre total d'issues devient `5 × 4 = 20`, et les issues favorables `2 × 1 = 2`. `P = 2 ÷ 20 = **0,1**`.

La probabilité passe de 0,16 à 0,1 : retirer une boule blanche du sac diminue nettement la chance d'en tirer une seconde. C'est tout l'effet du « sans remise ».
:::
:::

*🔁 Pause. Reprends après une vraie coupure.*

## Série C : arbres, tableaux et fréquences

::: exercice 12 | entrainement | 8 min | ecran
On lance deux dés et on s'intéresse à la **somme** obtenue.

1. Combien y a-t-il d'issues ?
2. Combien de cases du tableau donnent une somme de 7 ?
3. Calcule la probabilité d'obtenir 7.
4. Calcule la probabilité d'obtenir 2, puis 12.
5. Pourquoi 7 est-elle la somme la plus probable ?

::: corrige
1. **36 issues**, une par couple.
2. Les couples donnant 7 : `(1;6)`, `(2;5)`, `(3;4)`, `(4;3)`, `(5;2)`, `(6;1)`, soit **6 cases**.
3. `P(7) = 6 ÷ 36 = **1/6 ≈ 0,17**`.
4. Somme 2 : seul `(1;1)`, donc `P = **1/36 ≈ 0,03**`. Somme 12 : seul `(6;6)`, donc `P = **1/36**`.
5. Parce que 7 s'obtient de **six façons différentes**, alors que 2 et 12 ne s'obtiennent chacun que d'une seule. Les 36 couples sont équiprobables ; les sommes, elles, ne le sont pas, puisque chacune correspond à un nombre différent de couples.
:::
:::

::: exercice 13 | entrainement | 7 min | ecran
Reprends le tableau des sommes de deux dés.

1. Calcule la probabilité d'obtenir une somme supérieure ou égale à 10.
2. Calcule la probabilité d'obtenir une somme paire.
3. Calcule la probabilité d'obtenir un double.

::: corrige
1. Les sommes valant 10, 11 ou 12 : `10` apparaît 3 fois, `(4;6)`, `(5;5)`, `(6;4)` ; `11` apparaît 2 fois, `(5;6)` et `(6;5)` ; `12` apparaît 1 fois. Total : `3 + 2 + 1 = 6` cases. `P = 6 ÷ 36 = **1/6 ≈ 0,17**`.
2. Une somme est paire quand les deux dés ont la **même parité** : tous deux pairs, `3 × 3 = 9` cas, ou tous deux impairs, `3 × 3 = 9` cas. Total : `18` cases. `P = 18 ÷ 36 = **0,5**`.
3. Les doubles sont `(1;1)`, `(2;2)`, `(3;3)`, `(4;4)`, `(5;5)`, `(6;6)`, soit **6 cases**. `P = 6 ÷ 36 = **1/6 ≈ 0,17**`.
:::
:::

::: exercice 14 | entrainement | 7 min | ecran
On lance 20 fois une pièce et on obtient 13 piles.

1. Calcule la fréquence observée de pile.
2. Quelle est la probabilité théorique de pile ?
3. La pièce est-elle truquée ? Justifie en deux phrases.
4. Que se passerait-il si on lançait 10 000 fois ?

::: corrige
1. `13 ÷ 20 = **0,65**`.
2. `**0,5**`, si la pièce est équilibrée.
3. **On ne peut pas le dire.** Sur seulement 20 lancers, un écart de cette taille est banal : obtenir 13 piles au lieu de 10 arrive fréquemment par le seul jeu du hasard. Une fréquence observée diffère toujours de la probabilité théorique, et l'écart est d'autant plus grand que le nombre d'essais est petit.
4. D'après la **loi des grands nombres**, la fréquence observée se rapprocherait de 0,5. Sur 10 000 lancers, une fréquence de 0,65 serait en revanche extrêmement improbable et constituerait un indice sérieux de truquage.
:::
:::

::: exercice 15 | entrainement | 7 min | ecran
Voici une série d'essais réels.

| Nombre de lancers | 20 | 100 | 1 000 | 10 000 |
|---|---|---|---|---|
| Piles obtenus | 13 | 57 | 512 | 5 023 |

1. Calcule la fréquence à chaque étape.
2. Que constates-tu ?
3. Calcule l'écart en **nombre** de piles par rapport à la moitié des lancers.
4. Que constates-tu cette fois ?

::: corrige
1. `13 ÷ 20 = 0,65` · `57 ÷ 100 = 0,57` · `512 ÷ 1000 = 0,512` · `5023 ÷ 10000 = 0,5023`.
2. La fréquence se **rapproche de 0,5** à mesure que le nombre de lancers augmente. C'est la loi des grands nombres.
3. Moitié des lancers : 10, 50, 500, 5000. Écarts : `13 − 10 = 3` · `57 − 50 = 7` · `512 − 500 = 12` · `5023 − 5000 = 23`.
4. L'écart **en nombre** de piles, lui, **augmente**. C'est la **proportion** qui se stabilise, pas l'écart absolu.

Cette distinction est essentielle : la loi des grands nombres ne dit pas que les écarts se compensent, elle dit qu'ils deviennent négligeables **rapportés au nombre d'essais**.
:::
:::

::: exercice 16 | approfondissement | 8 min | main
Pour chacune de ces affirmations, dis si elle est vraie ou fausse, et explique l'erreur en deux phrases quand elle est fausse.

1. « Ça fait cinq fois face, donc pile a plus de chances au prochain lancer. »
2. « La combinaison 1, 2, 3, 4, 5, 6 a moins de chances de sortir qu'une combinaison au hasard. »
3. « Il y a deux issues au loto, gagner ou perdre, donc j'ai une chance sur deux. »
4. « Ce numéro n'est pas sorti depuis six mois, il est dû. »

::: corrige
1. **Faux.** La pièce n'a aucune mémoire : à chaque lancer, la probabilité de pile reste `0,5`, quels que soient les résultats précédents. C'est l'erreur du joueur, le raisonnement faux le plus répandu sur le hasard.
2. **Faux.** Toutes les combinaisons ont exactement la même probabilité. `1, 2, 3, 4, 5, 6` nous paraît improbable parce qu'elle est **remarquable** pour notre œil, pas parce qu'elle serait plus rare.
3. **Faux.** Le raisonnement « deux issues donc une chance sur deux » n'est valable que si les deux issues sont **équiprobables**, ce qui n'est évidemment pas le cas ici. Gagner correspond à une seule combinaison parmi des millions.
4. **Faux.** C'est la même erreur qu'au point 1 : aucun tirage ne rattrape les précédents. Le hasard n'a pas de mémoire et rien n'est jamais « dû ».
:::
:::

## Série D : raisonner et devoir type

::: exercice 17 | entrainement | 8 min | main
Une roue de loterie comporte 8 secteurs égaux : 1 est marqué « gros lot », 3 sont marqués « petit lot », 4 sont marqués « perdu ».

1. Calcule la probabilité de chaque résultat.
2. Vérifie la somme.
3. Calcule la probabilité de gagner quelque chose.
4. Un joueur fait tourner la roue deux fois. Combien d'issues ?
5. Quelle est la probabilité de perdre les deux fois ?

::: corrige
1. Les 8 secteurs sont égaux, donc équiprobables.
   `P(gros lot) = 1 ÷ 8 = **0,125**` · `P(petit lot) = 3 ÷ 8 = **0,375**` · `P(perdu) = 4 ÷ 8 = **0,5**`.
2. `1/8 + 3/8 + 4/8 = 8/8 = **1**`. Cohérent.
3. « Gagner quelque chose » regroupe le gros lot et le petit lot, soit 4 secteurs : `P = 4 ÷ 8 = **0,5**`. On pouvait aussi passer par le contraire : `1 − 0,5 = 0,5`.
4. `8 × 8 = **64 issues**`.
5. Perdre les deux fois : `4 × 4 = 16` issues favorables sur 64. `P = 16 ÷ 64 = **0,25**`.
:::
:::

::: exercice 18 | approfondissement | 9 min | main
Dans une classe de 30 élèves, 18 font de l'anglais en première langue, et parmi eux 7 font aussi de l'espagnol. Les 12 autres élèves font tous de l'espagnol.

On choisit un élève au hasard.

1. Combien d'élèves font de l'espagnol ?
2. Calcule la probabilité que l'élève choisi fasse de l'espagnol.
3. Calcule la probabilité qu'il fasse de l'anglais **et** de l'espagnol.
4. Calcule la probabilité qu'il ne fasse **que** de l'anglais.

::: corrige
1. Ceux qui font de l'espagnol sont les 7 bilingues plus les 12 autres élèves : `7 + 12 = **19 élèves**`.
2. `P = 19 ÷ 30 ≈ **0,63**`.
3. Les élèves faisant les deux sont les 7 bilingues : `P = 7 ÷ 30 ≈ **0,23**`.
4. Ceux qui ne font que de l'anglais sont les 18 anglicistes moins les 7 bilingues : `18 − 7 = 11`. `P = 11 ÷ 30 ≈ **0,37**`.

Vérification globale : `11` ne font que l'anglais, `7` font les deux, `12` ne font que l'espagnol. Total : `11 + 7 + 12 = 30`. Tous les élèves sont comptés une seule fois.
:::
:::

::: exercice 19 | approfondissement | 8 min | main
On tire au hasard une carte dans un jeu de 32 cartes : 8 valeurs, 7, 8, 9, 10, valet, dame, roi, as, réparties en 4 couleurs, pique, cœur, carreau, trèfle.

1. Calcule la probabilité de tirer un roi.
2. Calcule la probabilité de tirer un cœur.
3. Calcule la probabilité de tirer le roi de cœur.
4. Calcule la probabilité de tirer un roi **ou** un cœur. Attention au piège.

::: corrige
1. Il y a 4 rois : `P = 4 ÷ 32 = **1/8 = 0,125**`.
2. Il y a 8 cœurs : `P = 8 ÷ 32 = **1/4 = 0,25**`.
3. Une seule carte : `P = **1/32 ≈ 0,03**`.
4. Le piège serait d'additionner `4 + 8 = 12`. Mais le **roi de cœur** serait alors compté **deux fois**, une fois comme roi et une fois comme cœur. Il faut donc le retirer une fois : `4 + 8 − 1 = 11` cartes favorables.
   `P = 11 ÷ 32 ≈ **0,34**`.

Retiens la méthode : quand deux catégories se **recoupent**, on additionne puis on retire ce qui appartient aux deux. C'est le même raisonnement qu'à l'exercice 7, avec le couple `(6 ; 6)`.
:::
:::

::: exercice 20 | approfondissement | 45 min | main
**Devoir type. Quatre parties. Barème sur 20 points, indiqué à la fin.**

**Partie A. Vocabulaire et calcul de base**

Un sac contient 5 jetons rouges, 4 jetons verts et 3 jetons jaunes. On en tire un au hasard.

a. Combien y a-t-il d'issues ? Sont-elles équiprobables ? Justifie.
b. Calcule la probabilité de chaque couleur et vérifie la somme.
c. Calcule la probabilité de ne pas tirer un jeton rouge, de deux façons différentes.
d. Donne un exemple d'événement impossible et un exemple d'événement certain dans cette situation.

**Partie B. Deux épreuves**

On tire successivement deux jetons du même sac.

a. Combien y a-t-il d'issues **avec** remise ? Et **sans** remise ?
b. **Avec** remise, calcule la probabilité d'obtenir deux jetons rouges.
c. **Sans** remise, calcule la probabilité d'obtenir deux jetons rouges.
d. Explique en deux phrases pourquoi les deux résultats diffèrent.

**Partie C. Arbre et tableau**

On lance une pièce puis un dé.

a. Combien y a-t-il d'issues ?
b. Trace l'arbre des possibles.
c. Calcule la probabilité d'obtenir « pile et un nombre pair ».
d. Calcule la probabilité d'obtenir « face **ou** un 6 ». Attention au recoupement.

**Partie D. Raisonner**

a. Une pièce est tombée six fois sur face. Un joueur affirme que pile est plus probable au septième lancer. Réfute cette affirmation en trois phrases.
b. On lance 50 fois un dé et le 6 sort 12 fois. La fréquence observée vaut-elle la probabilité théorique ? Le dé est-il truqué ? Justifie.
c. Énonce la loi des grands nombres, puis dis clairement ce qu'elle **ne** dit **pas**.

::: corrige
**Partie A**

a. `5 + 4 + 3 = **12 issues**`, une par jeton. Elles sont **équiprobables** car le tirage se fait au hasard et tous les jetons sont supposés identiques au toucher : aucun n'a plus de chance d'être pris qu'un autre.

b. `P(rouge) = 5 ÷ 12 ≈ **0,42**` · `P(vert) = 4 ÷ 12 = 1/3 ≈ **0,33**` · `P(jaune) = 3 ÷ 12 = 1/4 = **0,25**`.
   Vérification : `5/12 + 4/12 + 3/12 = 12/12 = **1**`.

c. **Première façon**, par comptage direct : les jetons non rouges sont les 4 verts et les 3 jaunes, soit 7. `P = 7 ÷ 12 ≈ 0,58`.
   **Seconde façon**, par l'événement contraire : `P(non rouge) = 1 − 5/12 = 7/12 ≈ 0,58`.
   Les deux méthodes donnent le même résultat, ce qui constitue une vérification.

d. Événement **impossible** : « tirer un jeton bleu », aucune issue ne lui correspond, sa probabilité vaut 0. Événement **certain** : « tirer un jeton rouge, vert ou jaune », les douze issues lui correspondent, sa probabilité vaut 1.

**Partie B**

a. **Avec** remise : `12 × 12 = **144 issues**`. **Sans** remise : `12 × 11 = **132 issues**`.

b. Avec remise, il y a 5 jetons rouges aux deux tirages : `5 × 5 = 25` issues favorables.
   `P = 25 ÷ 144 ≈ **0,17**`.

c. Sans remise, le premier tirage offre 5 rouges sur 12, le second n'en offre plus que 4 sur 11 : `5 × 4 = 20` issues favorables sur 132.
   `P = 20 ÷ 132 = 5 ÷ 33 ≈ **0,15**`.

d. Sans remise, le premier jeton rouge tiré **quitte le sac** : il reste un rouge de moins et un jeton de moins au total, ce qui diminue la chance d'en tirer un second. Avec remise, la situation est identique aux deux tirages, et la probabilité du second est indépendante du premier.

**Partie C**

a. `2 × 6 = **12 issues**`.

b. Premier niveau : `P` et `F`. De `P` partent six branches, 1 à 6 ; de `F` également. Douze chemins au total, ce qui confirme le calcul de la question a.

c. « Pile et un nombre pair » : le premier résultat est imposé, et le second doit valoir 2, 4 ou 6. Cela fait **3 issues favorables** sur 12.
   `P = 3 ÷ 12 = **1/4 = 0,25**`.

d. Le piège est d'additionner. Les issues avec face sont au nombre de **6**, celles avec un 6 au nombre de **2**, à savoir `(P ; 6)` et `(F ; 6)`. Mais l'issue `(F ; 6)` appartient aux deux groupes et serait comptée deux fois.
   Issues favorables : `6 + 2 − 1 = 7`. `P = 7 ÷ 12 ≈ **0,58**`.

**Partie D**

a. La pièce n'a **aucune mémoire** : elle ne conserve pas la trace des lancers précédents, et rien dans sa forme ne change entre le sixième et le septième lancer. La probabilité de pile au septième lancer vaut donc exactement `0,5`, comme à tous les autres. Ce raisonnement porte un nom, l'**erreur du joueur**, et il consiste à confondre ce qui vaut sur un très grand nombre d'essais avec ce qui vaudrait pour le prochain essai.

b. La fréquence observée vaut `12 ÷ 50 = **0,24**`, alors que la probabilité théorique vaut `1 ÷ 6 ≈ 0,17`. Les deux valeurs sont donc **différentes**, mais cela ne prouve rien : sur 50 lancers seulement, un tel écart reste courant. On attendrait environ 8 ou 9 sorties du 6 ; en obtenir 12 n'a rien d'exceptionnel. Pour conclure à un truquage, il faudrait un très grand nombre de lancers et un écart qui persiste.

c. **Énoncé** : quand on répète une expérience aléatoire un très grand nombre de fois, la fréquence observée d'un résultat se rapproche de sa probabilité théorique.
   **Ce qu'elle ne dit pas** : elle ne dit pas qu'un résultat en retard va être « rattrapé », ni qu'après plusieurs faces pile devient plus probable. Elle ne dit pas non plus que l'écart en nombre de succès diminue : cet écart augmente au contraire, c'est la **proportion** qui se stabilise.

**Barème indicatif**
Partie A : 6 points (1,5 pour les issues et l'équiprobabilité justifiée, 2 pour les probabilités et la vérification, 1,5 pour les deux méthodes, 1 pour les deux exemples).
Partie B : 5 points (1 pour les deux comptages, 1,5 avec remise, 1,5 sans remise, 1 pour l'explication).
Partie C : 5 points (1 pour le comptage, 1,5 pour l'arbre, 1 pour le point c, 1,5 pour le point d et son recoupement).
Partie D : 4 points (1,5 pour la réfutation, 1,5 pour la lecture de la fréquence, 1 pour l'énoncé et sa limite).
:::
:::
