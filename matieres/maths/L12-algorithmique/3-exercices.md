---
type: exercices
matiere: maths
lecon: L12
titre: Algorithmique et programmation : exercices corrigés
resume: 20 exercices progressifs, de l'affectation au déroulement de programmes, à la correction d'erreurs et au tracé de figures, avec un corrigé détaillé pour chacun.
duree: 3 séances de 45 min
competences:
  - Chercher
  - Modéliser
  - Représenter
  - Raisonner
objectifs:
  - Dérouler un programme dans un tableau
  - Écrire un test et une boucle
  - Repérer et corriger une erreur
  - Programmer le tracé d'une figure
---

::: plan
**Série A : variables et affectation** (exercices 1 à 5)
**Série B : tests et boucles** (exercices 6 à 11)

*🔁 Pause*

**Série C : dérouler et corriger** (exercices 12 à 16)
**Série D : figures et devoir type** (exercices 17 à 20)
:::

::: materiel
- Une feuille pour les tableaux de déroulement
- Une calculatrice
- Un ordinateur si disponible
:::

## Série A : variables et affectation

::: exercice 1 | application | 4 min | ecran
Que valent les variables à la fin de chaque programme ?

1. `x ← 5` puis `x ← 8`
2. `a ← 3` puis `b ← a` puis `a ← 10`
3. `n ← 2` puis `n ← n × n`

::: corrige
1. `x` vaut **8**. L'affectation remplace l'ancienne valeur, qui est perdue.
2. `a` vaut **10** et `b` vaut **3**. La ligne `b ← a` a copié la valeur de `a` à ce moment-là, soit 3. Modifier `a` ensuite ne change pas `b`.
3. `n` vaut **4**. On calcule d'abord `2 × 2`, puis on range le résultat dans `n`.

Le point 2 est le plus instructif : une affectation copie une **valeur**, pas un lien. Les deux variables restent indépendantes.
:::
:::

::: exercice 2 | application | 5 min | ecran
Déroule ces programmes et donne les valeurs finales.

1. `x ← 3`, `y ← 7`, `x ← x + y`
2. `a ← 10`, `b ← 4`, `a ← a − b`, `b ← a × 2`
3. `s ← 0`, `s ← s + 5`, `s ← s + 3`, `s ← s × 2`

::: corrige
1. `x` vaut `3 + 7 = **10**`, `y` vaut **7**.
2. `a` vaut `10 − 4 = 6`, puis `b` vaut `6 × 2 = 12`. Résultat : `a = **6**`, `b = **12**`. Attention, `b` est calculé avec la **nouvelle** valeur de `a`.
3. `s` vaut 0, puis 5, puis 8, puis `8 × 2 = **16**`.
:::
:::

::: exercice 3 | entrainement | 5 min | ecran
Un élève écrit : « `x ← x + 1` est impossible, car aucun nombre n'est égal à lui-même plus un. »

1. Où est l'erreur de raisonnement ?
2. Explique en deux phrases ce que fait réellement cette instruction.

::: corrige
1. L'élève lit la flèche comme un signe **égal** mathématique. Or `←` n'exprime pas une égalité : c'est un **ordre** donné à la machine.
2. « L'instruction demande de prendre la valeur actuellement rangée dans `x`, d'y ajouter 1, puis de ranger le résultat dans `x`, en écrasant l'ancienne valeur. Si `x` valait 7 avant, il vaut 8 après : à aucun moment un nombre n'est égal à lui-même plus un. »

C'est la confusion la plus fréquente du chapitre. Retiens la règle d'exécution : on calcule **tout ce qui est à droite**, puis on range à **gauche**.
:::
:::

::: exercice 4 | application | 5 min | ecran
Écris un algorithme qui demande deux nombres, calcule leur moyenne et l'affiche.

::: corrige
```
Saisir a
Saisir b
m ← (a + b) ÷ 2
Afficher m
```

Remarque les **parenthèses** : sans elles, `a + b ÷ 2` calculerait `a + (b ÷ 2)`, ce qui n'est pas la moyenne. Les priorités opératoires s'appliquent en programmation comme en mathématiques.

Le programme comporte bien les trois éléments attendus : des **entrées** avec `Saisir`, un **traitement** avec le calcul, une **sortie** avec `Afficher`.
:::
:::

::: exercice 5 | entrainement | 6 min | ecran
On veut échanger les valeurs de deux variables `a` et `b`.

1. Pourquoi `a ← b` puis `b ← a` ne fonctionne-t-il pas ?
2. Propose un algorithme correct.

::: corrige
1. Prenons `a = 3` et `b = 7`. Après `a ← b`, la variable `a` vaut 7, mais la valeur 3 est **perdue**. La ligne `b ← a` range alors 7 dans `b` : les deux variables valent 7, et l'échange a échoué.
2. Il faut une **variable temporaire** pour conserver la valeur avant de l'écraser :
```
t ← a
a ← b
b ← t
```
Déroulement avec `a = 3` et `b = 7` : `t` vaut 3, puis `a` vaut 7, puis `b` vaut 3. L'échange est réussi.

Ce problème est un classique de l'algorithmique : il illustre qu'une affectation **détruit** l'ancienne valeur, et qu'il faut parfois la sauvegarder d'abord.
:::
:::

## Série B : tests et boucles

::: exercice 6 | application | 5 min | ecran
Que fait ce programme pour chaque valeur de `n` ?

```
Si n > 10 Alors
    Afficher "grand"
Sinon
    Afficher "petit"
Fin Si
```

1. `n = 15` · 2. `n = 10` · 3. `n = 3` · 4. `n = −2`

::: corrige
1. `15 > 10` est **vrai** : affiche **« grand »**.
2. `10 > 10` est **faux**, car l'opérateur est strict : affiche **« petit »**.
3. `3 > 10` est faux : affiche **« petit »**.
4. `−2 > 10` est faux : affiche **« petit »**.

Le point 2 est le piège : avec `≥`, le programme aurait affiché « grand ». Un seul caractère change le comportement du programme pour une valeur précise, sans provoquer aucun message d'erreur.
:::
:::

::: exercice 7 | entrainement | 6 min | ecran
Écris un algorithme qui demande un nombre et affiche « positif », « nul » ou « négatif ».

::: corrige
```
Saisir n
Si n > 0 Alors
    Afficher "positif"
Sinon
    Si n = 0 Alors
        Afficher "nul"
    Sinon
        Afficher "négatif"
    Fin Si
Fin Si
```

Il s'agit de tests **imbriqués** : le second test se trouve entièrement à l'intérieur du `Sinon` du premier. On ne peut pas traiter trois cas avec un seul test, qui n'en distingue que deux.

Vérification : pour `n = 5`, le premier test est vrai, on affiche « positif ». Pour `n = 0`, le premier est faux, on entre dans le `Sinon`, le second test est vrai, on affiche « nul ». Pour `n = −3`, les deux tests sont faux, on affiche « négatif ».
:::
:::

::: exercice 8 | application | 5 min | ecran
Que valent ces conditions pour `n = 7` ?

1. `n > 0 ET n < 10` · 2. `n > 0 ET n < 5` · 3. `n < 0 OU n > 5` · 4. `n = 7 ET n ≠ 7`

::: corrige
1. `7 > 0` vrai **et** `7 < 10` vrai → **vrai**.
2. `7 > 0` vrai **et** `7 < 5` faux → **faux**. Avec `ET`, les deux doivent être vraies.
3. `7 < 0` faux **ou** `7 > 5` vrai → **vrai**. Avec `OU`, une seule suffit.
4. `7 = 7` vrai **et** `7 ≠ 7` faux → **faux**. Cette condition est d'ailleurs fausse pour **toute** valeur : elle se contredit elle-même.
:::
:::

::: exercice 9 | application | 6 min | ecran
Déroule ce programme et donne l'affichage.

```
s ← 0
Pour i allant de 1 à 5
    s ← s + i
Fin Pour
Afficher s
```

::: corrige
| Tour | `i` | `s` avant | `s` après |
|---|---|---|---|
| initial | · | · | 0 |
| 1 | 1 | 0 | 1 |
| 2 | 2 | 1 | 3 |
| 3 | 3 | 3 | 6 |
| 4 | 4 | 6 | 10 |
| 5 | 5 | 10 | 15 |

Le programme affiche **15**, c'est-à-dire `1 + 2 + 3 + 4 + 5`.

Remarque que `Afficher s` se trouve **après** le `Fin Pour` : le programme n'affiche donc qu'une seule valeur. Placé à l'intérieur de la boucle, il aurait affiché les cinq valeurs intermédiaires.
:::
:::

::: exercice 10 | entrainement | 6 min | ecran
Déroule ce programme.

```
n ← 1
c ← 0
Tant que n ≤ 100
    n ← n × 2
    c ← c + 1
Fin Tant que
Afficher n
Afficher c
```

::: corrige
| Tour | `n` avant | condition | `n` après | `c` |
|---|---|---|---|---|
| 1 | 1 | `1 ≤ 100` vrai | 2 | 1 |
| 2 | 2 | vrai | 4 | 2 |
| 3 | 4 | vrai | 8 | 3 |
| 4 | 8 | vrai | 16 | 4 |
| 5 | 16 | vrai | 32 | 5 |
| 6 | 32 | vrai | 64 | 6 |
| 7 | 64 | vrai | 128 | 7 |
| · | 128 | `128 ≤ 100` **faux** | · | · |

Le programme affiche `n = **128**` et `c = **7**`.

La variable `c` compte le nombre de passages dans la boucle. C'est un usage très courant : on ne connaît pas à l'avance combien de tours seront nécessaires, et le compteur le révèle.
:::
:::

::: exercice 11 | approfondissement | 8 min | main
Écris un algorithme qui calcule la somme des entiers de 1 à `n`, où `n` est saisi par l'utilisateur. Déroule-le ensuite pour `n = 4`.

::: corrige
```
Saisir n
s ← 0
Pour i allant de 1 à n
    s ← s + i
Fin Pour
Afficher s
```

Déroulement pour `n = 4` :

| Instruction | `n` | `i` | `s` |
|---|---|---|---|
| `Saisir n` | 4 | · | · |
| `s ← 0` | 4 | · | 0 |
| tour 1 | 4 | 1 | 1 |
| tour 2 | 4 | 2 | 3 |
| tour 3 | 4 | 3 | 6 |
| tour 4 | 4 | 4 | 10 |
| `Afficher s` | 4 | 4 | **10** |

Le programme affiche **10**, ce qui correspond bien à `1 + 2 + 3 + 4`.

Deux points essentiels : la ligne `s ← 0` **avant** la boucle, sans laquelle rien ne fonctionne ; et l'emploi de `n` comme borne, qui rend le programme **paramétré** au lieu d'être écrit pour un seul cas.
:::
:::

*🔁 Pause. Reprends après une vraie coupure.*

## Série C : dérouler et corriger

::: exercice 12 | entrainement | 7 min | ecran
Déroule ce programme dans un tableau complet.

```
x ← 4
y ← 1
Pour i allant de 1 à 3
    y ← y × x
Fin Pour
Afficher y
```

Que calcule-t-il ?

::: corrige
| Instruction | `x` | `y` | `i` | Affichage |
|---|---|---|---|---|
| `x ← 4` | 4 | · | · | |
| `y ← 1` | 4 | 1 | · | |
| tour 1 | 4 | 4 | 1 | |
| tour 2 | 4 | 16 | 2 | |
| tour 3 | 4 | 64 | 3 | |
| `Afficher y` | 4 | 64 | 3 | **64** |

Le programme calcule **`4³`**, c'est-à-dire `x` élevé à la puissance 3.

En remplaçant `3` par `n` dans la boucle, on obtiendrait un programme calculant `x` à la puissance `n`. L'initialisation de `y` à **1** est essentielle : avec `y ← 0`, tous les produits vaudraient 0.
:::
:::

::: exercice 13 | entrainement | 7 min | ecran
Ce programme devait afficher la somme des entiers de 1 à 10. Il affiche autre chose.

```
Pour i allant de 1 à 10
    s ← s + i
    Afficher s
Fin Pour
```

1. Repère les deux erreurs.
2. Corrige le programme.

::: corrige
1. Deux erreurs :
   - la variable `s` n'est **pas initialisée** avant la boucle : la première addition n'a aucune valeur de départ ;
   - l'instruction `Afficher s` se trouve **à l'intérieur** de la boucle : le programme affiche dix valeurs au lieu d'une seule.
2. Version corrigée :
```
s ← 0
Pour i allant de 1 à 10
    s ← s + i
Fin Pour
Afficher s
```
Le programme affiche maintenant **55**, c'est-à-dire `1 + 2 + ... + 10`.

Ces deux erreurs sont les plus fréquentes en 4ᵉ. Prends le réflexe : chaque fois que tu écris `s ← s + quelque chose` dans une boucle, vérifie qu'une ligne `s ← 0` figure avant, et demande-toi si l'affichage doit se faire une fois ou à chaque tour.
:::
:::

::: exercice 14 | entrainement | 7 min | ecran
Ces programmes contiennent chacun une erreur. Identifie-la et corrige.

1.
```
n ← 1
Tant que n ≤ 50
    Afficher n
Fin Tant que
```
2.
```
Pour i allant de 1 à 5
    p ← p × i
Fin Pour
```
3.
```
Si n ≥ 10 Alors
    Afficher "petit"
Sinon
    Afficher "grand"
Fin Si
```

::: corrige
1. **Boucle infinie** : rien ne modifie `n`, la condition `n ≤ 50` reste éternellement vraie. Correction : ajouter `n ← n + 1` à l'intérieur de la boucle.
2. **Variable non initialisée**. De plus, pour un produit, l'initialisation doit valoir **1** et non 0, sinon tous les produits seraient nuls. Correction : ajouter `p ← 1` avant la boucle.
3. **Condition inversée** : si `n ≥ 10`, le nombre est grand, pas petit. Correction : échanger les deux affichages, ou remplacer `≥` par `<`.

L'erreur 3 est la plus sournoise : le programme fonctionne parfaitement, ne produit aucun message, et donne systématiquement le contraire du résultat attendu.
:::
:::

::: exercice 15 | entrainement | 7 min | ecran
Déroule ce programme pour `n = 12`, puis pour `n = 7`.

```
Saisir n
r ← n
Tant que r ≥ 3
    r ← r − 3
Fin Tant que
Afficher r
```

Que calcule ce programme ?

::: corrige
**Pour `n = 12`** : `r` vaut 12, puis 9, 6, 3, 0. La boucle s'arrête car `0 ≥ 3` est faux. Affichage : **0**.

**Pour `n = 7`** : `r` vaut 7, puis 4, puis 1. La boucle s'arrête car `1 ≥ 3` est faux. Affichage : **1**.

Ce programme calcule le **reste de la division euclidienne de `n` par 3**. En effet, il retranche 3 autant de fois que possible, et ce qui subsiste est précisément le reste.

Vérification : `12 = 3 × 4 + 0` et `7 = 3 × 2 + 1`. Les restes sont bien 0 et 1.
:::
:::

::: exercice 16 | approfondissement | 8 min | main
Écris un algorithme qui demande dix nombres et affiche le plus grand.

::: corrige
```
Saisir x
max ← x
Pour i allant de 2 à 10
    Saisir x
    Si x > max Alors
        max ← x
    Fin Si
Fin Pour
Afficher max
```

Explication de la méthode : on lit le **premier** nombre hors de la boucle et on le prend comme maximum provisoire. Puis, pour chacun des neuf suivants, on compare : s'il dépasse le maximum actuel, il le remplace.

Pourquoi ne pas initialiser `max ← 0` ? Parce que si les dix nombres saisis étaient tous négatifs, le programme afficherait 0, qui ne figure pas parmi eux. Prendre le **premier élément** comme valeur de départ évite ce piège dans tous les cas.

Remarque aussi la boucle qui part de `2` et non de `1` : le premier nombre a déjà été lu.
:::
:::

## Série D : figures et devoir type

::: exercice 17 | application | 5 min | ecran
Un lutin doit tracer les polygones réguliers suivants. De combien doit-il tourner à chaque sommet ?

1. Carré · 2. Triangle équilatéral · 3. Pentagone · 4. Hexagone · 5. Décagone, dix côtés

::: corrige
On applique `angle = 360 ÷ n`.

1. Carré : `360 ÷ 4 = **90°**`.
2. Triangle : `360 ÷ 3 = **120°**`.
3. Pentagone : `360 ÷ 5 = **72°**`.
4. Hexagone : `360 ÷ 6 = **60°**`.
5. Décagone : `360 ÷ 10 = **36°**`.

Attention : c'est l'angle **extérieur**, celui dont pivote le lutin. L'angle **intérieur** du triangle équilatéral vaut 60°, mais le lutin tourne de 120°. Les deux sont supplémentaires.

Observe aussi que plus le polygone a de côtés, plus l'angle est petit, et plus la figure se rapproche d'un cercle.
:::
:::

::: exercice 18 | entrainement | 7 min | main
1. Écris le programme qui trace un hexagone régulier de 80 pixels de côté.
2. Modifie-le pour qu'il trace n'importe quel polygone régulier, à partir de deux valeurs saisies.

::: corrige
1.
```
Répéter 6 fois
    avancer de 80
    tourner de 60 degrés
Fin Répéter
```

2.
```
Saisir n
Saisir c
Répéter n fois
    avancer de c
    tourner de (360 ÷ n) degrés
Fin Répéter
```

Le second programme est nettement supérieur : il est **paramétré**. Une seule version traite tous les cas, au lieu d'écrire un programme différent par polygone. C'est l'un des principaux intérêts de la programmation : généraliser plutôt que répéter.

Vérification : pour `n = 6` et `c = 80`, le programme tourne de `360 ÷ 6 = 60°`, ce qui redonne exactement le premier programme.
:::
:::

::: exercice 19 | approfondissement | 8 min | main
Écris un programme qui trace une suite de cinq carrés de tailles croissantes : 20, 40, 60, 80 et 100 pixels de côté, tous partant du même point.

::: corrige
```
Pour k allant de 1 à 5
    c ← k × 20
    Répéter 4 fois
        avancer de c
        tourner de 90 degrés
    Fin Répéter
Fin Pour
```

Explication : la boucle extérieure gère les **cinq carrés**, la boucle intérieure trace **chaque carré**. C'est une boucle **imbriquée**, et c'est une structure très courante.

La variable `c` est recalculée à chaque tour extérieur : `20`, `40`, `60`, `80`, `100`. Puisque chaque carré se termine exactement là où il a commencé, avec la même orientation, les cinq carrés partent bien du même point sans qu'il soit nécessaire de repositionner le lutin.

Nombre total d'instructions de tracé : `5 × 4 = 20` déplacements et 20 rotations.
:::
:::

::: exercice 20 | approfondissement | 45 min | main
**Devoir type. Quatre parties. Barème sur 20 points, indiqué à la fin.**

**Partie A. Variables et affectation**

a. Qu'est-ce qu'un algorithme ? Cite trois exigences.
b. Que signifie `x ← 7` ? En quoi cela diffère-t-il de `x = 7` en mathématiques ?
c. Donne les valeurs finales : `a ← 5`, `b ← 2`, `a ← a × b`, `b ← a − b`.
d. Explique pourquoi `a ← b` puis `b ← a` n'échange pas deux valeurs. Propose un algorithme correct.

**Partie B. Tests et boucles**

a. Écris la structure d'un test avec `Sinon`.
b. Que vaut la condition `n > 0 ET n ≤ 10` pour `n = 10` ? Pour `n = 11` ? Pour `n = 0` ?
c. Quelle est la différence entre une boucle bornée et une boucle non bornée ? Donne la syntaxe de chacune.
d. Écris un algorithme qui demande un nombre et affiche « pair » ou « impair ». On dispose de l'instruction `reste(n ; 2)` qui donne le reste de la division de `n` par 2.

**Partie C. Dérouler et corriger**

a. Déroule ce programme dans un tableau complet et donne l'affichage.
```
p ← 1
Pour i allant de 1 à 4
    p ← p × 2
Fin Pour
Afficher p
```
b. Que calcule-t-il ?

c. Ce programme devait afficher la somme des entiers de 1 à 20. Trouve les deux erreurs et corrige-le.
```
Pour i allant de 1 à 20
    s ← s + i
    Afficher s
Fin Pour
```

d. Pourquoi ce programme ne s'arrête-t-il jamais ? Corrige-le.
```
n ← 10
Tant que n > 0
    Afficher n
Fin Tant que
```

**Partie D. Figures**

a. De combien un lutin doit-il tourner pour tracer un octogone régulier ?
b. Écris le programme qui trace un octogone régulier de 50 pixels de côté.
c. Écris un programme paramétré traçant n'importe quel polygone régulier.
d. Explique en deux phrases pourquoi le lutin tourne de 120° pour un triangle équilatéral, alors que les angles de ce triangle mesurent 60°.

::: corrige
**Partie A**

a. Un **algorithme** est une suite d'instructions permettant d'obtenir un résultat à partir de données. Trois exigences parmi : il doit être **fini**, c'est-à-dire se terminer ; **précis**, chaque instruction disant exactement quoi faire ; **non ambigu**, deux personnes l'exécutant obtenant le même résultat ; et **exécutable**, chaque instruction étant réalisable.

b. `x ← 7` signifie « `x` **prend la valeur** 7 » : c'est un **ordre** donné à la machine, qui écrase l'ancienne valeur. En mathématiques, `x = 7` est une **affirmation** d'égalité, qui peut être vraie ou fausse mais ne modifie rien. C'est pourquoi `x ← x + 1` a un sens en algorithmique alors que `x = x + 1` n'a aucune solution.

c. `a` vaut `5 × 2 = **10**`, puis `b` vaut `10 − 2 = **8**`. Attention : `b` est calculé avec la **nouvelle** valeur de `a`.

d. Avec `a = 3` et `b = 7` : après `a ← b`, la variable `a` vaut 7 et la valeur 3 est **perdue**. La ligne `b ← a` range alors 7 dans `b` : les deux valent 7. Il faut une **variable temporaire** :
```
t ← a
a ← b
b ← t
```

**Partie B**

a.
```
Si condition Alors
    instructions A
Sinon
    instructions B
Fin Si
```
On exécute A **ou** B, jamais les deux.

b. Pour `n = 10` : `10 > 0` vrai et `10 ≤ 10` vrai → **vrai**.
   Pour `n = 11` : `11 ≤ 10` faux → **faux**.
   Pour `n = 0` : `0 > 0` faux → **faux**.

c. La boucle **bornée** répète un nombre de fois **connu à l'avance** ; la boucle **non bornée** répète **tant qu'une condition** reste vraie, sans qu'on sache combien de fois, avec un risque de boucle infinie.
```
Pour i allant de 1 à n        |   Tant que condition
    instructions               |       instructions
Fin Pour                       |   Fin Tant que
```

d.
```
Saisir n
Si reste(n ; 2) = 0 Alors
    Afficher "pair"
Sinon
    Afficher "impair"
Fin Si
```

**Partie C**

a.
| Instruction | `p` | `i` | Affichage |
|---|---|---|---|
| `p ← 1` | 1 | · | |
| tour 1 | 2 | 1 | |
| tour 2 | 4 | 2 | |
| tour 3 | 8 | 3 | |
| tour 4 | 16 | 4 | |
| `Afficher p` | 16 | 4 | **16** |

b. Il calcule **`2⁴`**, c'est-à-dire 2 élevé à la puissance 4. L'initialisation de `p` à **1** est essentielle : avec `p ← 0`, tous les produits vaudraient 0.

c. Deux erreurs : la variable `s` n'est pas **initialisée**, et `Afficher s` se trouve **dans** la boucle au lieu d'être après. Version corrigée :
```
s ← 0
Pour i allant de 1 à 20
    s ← s + i
Fin Pour
Afficher s
```
Le programme affiche alors **210**.

d. Rien ne modifie `n` à l'intérieur de la boucle : la condition `n > 0` reste éternellement vraie, c'est une **boucle infinie**. Correction :
```
n ← 10
Tant que n > 0
    Afficher n
    n ← n − 1
Fin Tant que
```
Le programme affiche maintenant 10, 9, 8, ... jusqu'à 1, puis s'arrête.

**Partie D**

a. `360 ÷ 8 = **45°**`.

b.
```
Répéter 8 fois
    avancer de 50
    tourner de 45 degrés
Fin Répéter
```

c.
```
Saisir n
Saisir c
Répéter n fois
    avancer de c
    tourner de (360 ÷ n) degrés
Fin Répéter
```

d. « Le lutin ne pivote pas de l'angle intérieur du polygone mais de l'angle **extérieur**, celui dont il doit changer de direction pour aborder le côté suivant. Ces deux angles sont **supplémentaires** : pour un triangle équilatéral, l'angle intérieur vaut 60° et l'angle extérieur `180 − 60 = 120°`, ce qui correspond bien à `360 ÷ 3`. »

**Barème indicatif**
Partie A : 5 points (1 pour la définition, 1,5 pour l'affectation, 1 pour les valeurs, 1,5 pour l'échange).
Partie B : 5 points (1 pour la structure, 1 pour les conditions, 1,5 pour les boucles, 1,5 pour l'algorithme).
Partie C : 6 points (2 pour le déroulement, 0,5 pour l'identification, 2 pour les deux erreurs corrigées, 1,5 pour la boucle infinie).
Partie D : 4 points (0,5 pour l'angle, 1 pour l'octogone, 1,5 pour le programme paramétré, 1 pour l'explication).
:::
:::

::: cocher
- J'ai fait tous les exercices de la série A
- J'ai fait tous les exercices de la série B
- J'ai fait tous les exercices de la série C
- J'ai traité le sujet de type devoir en temps limité
- J'ai comparé chaque réponse au corrigé avant de passer à la suite
:::
