---
type: cours
matiere: maths
lecon: L12
titre: Algorithmique et programmation
resume: Écrire et lire un algorithme : les variables, les trois structures de base que sont la séquence, le test et la boucle, les opérateurs de comparaison, le déroulement pas à pas d'un programme, et la construction de figures géométriques par un lutin.
duree: 3 séances de 45 min
competences:
  - Chercher
  - Modéliser
  - Représenter
  - Raisonner
  - Communiquer
objectifs:
  - Définir un algorithme et une variable
  - Employer l'affectation et les opérations sur les variables
  - Écrire et lire un test conditionnel
  - Écrire une boucle bornée et une boucle non bornée
  - Dérouler un programme pas à pas dans un tableau
  - Programmer le tracé d'une figure géométrique
---

::: plan
**Séance 1 : les bases**

1. Qu'est-ce qu'un algorithme
2. Les variables et l'affectation
3. Les entrées et les sorties
4. La séquence d'instructions

*🔁 Pause de 5 minutes*

**Séance 2 : les structures de contrôle**

5. Les tests conditionnels
6. Les opérateurs de comparaison
7. Les boucles bornées
8. Les boucles non bornées

**Séance 3 : dérouler et construire**

9. Dérouler un programme pas à pas
10. Programmer une figure
11. Repérer et corriger une erreur
12. Les pièges à éviter
:::

::: materiel
- Une feuille pour les tableaux de déroulement
- Une calculatrice
- Un ordinateur avec un environnement de programmation par blocs, si disponible
- Une règle et un rapporteur pour les figures
:::

## 1. Qu'est-ce qu'un algorithme

::: definition Algorithme
Un **algorithme** est une suite finie d'**instructions** précises et non ambiguës, qui permet d'obtenir un résultat à partir de données.
Un **programme** est la traduction d'un algorithme dans un langage compris par une machine.
:::

::: grille
| Exigence | Ce que cela signifie |
|---|---|
| **Finie** | l'algorithme se termine après un nombre limité d'étapes |
| **Précise** | chaque instruction dit exactement quoi faire |
| **Non ambiguë** | deux personnes qui l'exécutent obtiennent le même résultat |
| **Exécutable** | chaque instruction est réalisable par celui qui l'exécute |
:::

::: exemple Une recette est-elle un algorithme ?
« Faire cuire à feu doux jusqu'à ce que ce soit bon » n'est **pas** un algorithme : « bon » n'est pas mesurable, l'instruction est ambiguë.
« Faire cuire 12 minutes à 180 degrés » en est un : l'instruction est précise et donne le même résultat pour tous.
:::

::: retenir Pourquoi cette exigence de précision
Une machine n'interprète pas, elle exécute.
Elle ne devine jamais l'intention : si l'instruction est ambiguë, elle produira un résultat inattendu sans signaler d'erreur.
C'est la difficulté principale de la programmation, et elle est plus logique que technique.
:::

## 2. Les variables et l'affectation

::: definition Variable
Une **variable** est un emplacement de la mémoire, désigné par un **nom**, qui contient une **valeur**.
Cette valeur peut changer au cours de l'exécution : c'est pour cela qu'on parle de variable.
:::

::: formule
**L'affectation**
`x ← 5` se lit « `x` prend la valeur 5 ».
L'affectation **remplace** l'ancienne valeur par la nouvelle : l'ancienne est perdue.
:::

::: exemple Une suite d'affectations
```
x ← 3
y ← 7
x ← x + y
```
Après la première ligne, `x` vaut 3. Après la deuxième, `y` vaut 7.
La troisième ligne calcule d'abord `x + y`, c'est-à-dire `3 + 7 = 10`, puis met ce résultat dans `x`.
À la fin : `x` vaut **10** et `y` vaut **7**.
:::

::: piege `x ← x + 1` n'est pas une équation
En mathématiques, `x = x + 1` n'a aucune solution.
En algorithmique, `x ← x + 1` signifie « prends la valeur actuelle de `x`, ajoute 1, et range le résultat dans `x` ».
La flèche indique un **ordre**, pas une égalité. C'est la confusion la plus fréquente du chapitre.
:::

::: formule
**L'ordre d'exécution d'une affectation**
1. On calcule d'abord **tout ce qui est à droite** de la flèche.
2. On range ensuite ce résultat dans la variable à gauche.

C'est pourquoi `x ← x + y` fonctionne : `x` est lu avant d'être écrasé.
:::

## 3. Les entrées et les sorties

::: grille
| Instruction | Rôle |
|---|---|
| `Saisir x` | demander une valeur à l'utilisateur et la ranger dans `x` |
| `Afficher x` | montrer la valeur de `x` |
| `Afficher "texte"` | montrer un message |
:::

::: exemple Un algorithme complet
```
Saisir a
Saisir b
s ← a + b
Afficher s
```
Cet algorithme demande deux nombres, calcule leur somme et l'affiche.
Il comporte les trois éléments d'un programme : des **entrées**, un **traitement**, une **sortie**.
:::

::: piege Afficher n'est pas calculer
`Afficher a + b` montre le résultat mais ne le **conserve** pas : si l'on veut le réutiliser plus loin, il faut d'abord le ranger dans une variable.
:::

## 4. La séquence d'instructions

::: definition Séquence
Une **séquence** est une suite d'instructions exécutées **dans l'ordre**, de la première à la dernière.
C'est la structure la plus simple, et la plus fréquente.
:::

::: exemple L'ordre compte
```
x ← 2        |  x ← 2
x ← x × 3    |  x ← x + 5
x ← x + 5    |  x ← x × 3
```
À gauche : `x` vaut 2, puis 6, puis **11**.
À droite : `x` vaut 2, puis 7, puis **21**.

Les mêmes instructions dans un ordre différent donnent des résultats différents.
:::

::: retenir Les trois structures de base
Toute la programmation repose sur **trois** structures seulement :
1. la **séquence**, faire les choses dans l'ordre ;
2. le **test**, faire quelque chose seulement si une condition est vraie ;
3. la **boucle**, répéter quelque chose.
Aucun programme, si complexe soit-il, n'emploie autre chose.
:::

🔁 **Point de pause.** Reprends après cinq minutes. La suite introduit les deux autres structures.

## 5. Les tests conditionnels

::: formule
**La structure du test**
```
Si condition Alors
    instructions A
Sinon
    instructions B
Fin Si
```
Si la condition est **vraie**, on exécute A ; sinon, on exécute B. On n'exécute **jamais** les deux.
:::

::: exemple Un test simple
```
Saisir n
Si n > 0 Alors
    Afficher "positif"
Sinon
    Afficher "négatif ou nul"
Fin Si
```
Pour `n = 5`, le programme affiche « positif ». Pour `n = −2`, il affiche « négatif ou nul ». Pour `n = 0`, il affiche également « négatif ou nul », puisque `0 > 0` est faux.
:::

::: formule
**Le test sans Sinon**
```
Si condition Alors
    instructions
Fin Si
```
Si la condition est fausse, on ne fait simplement rien et on continue après le `Fin Si`.
:::

::: exemple Des tests imbriqués
```
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
Ce programme distingue les **trois** cas. On place un test à l'intérieur d'un autre : c'est ce qu'on appelle des tests **imbriqués**.
:::

## 6. Les opérateurs de comparaison

::: grille
| Opérateur | Signification | Exemple vrai |
|---|---|---|
| `=` | égal à | `5 = 5` |
| `≠` | différent de | `5 ≠ 3` |
| `<` | strictement inférieur | `3 < 5` |
| `>` | strictement supérieur | `5 > 3` |
| `≤` | inférieur ou égal | `5 ≤ 5` |
| `≥` | supérieur ou égal | `5 ≥ 3` |
:::

::: grille
| Opérateur logique | Signification |
|---|---|
| `ET` | les deux conditions doivent être vraies |
| `OU` | au moins une des deux doit être vraie |
| `NON` | inverse le résultat |
:::

::: exemple Combiner des conditions
`Si n > 0 ET n < 10 Alors` → vrai pour `n = 5`, faux pour `n = 15`.
`Si n < 0 OU n > 10 Alors` → vrai pour `n = 15`, vrai pour `n = −3`, faux pour `n = 5`.
:::

::: piege Le strict et le large
`n > 0` exclut zéro. `n ≥ 0` l'inclut.
Un décalage d'un seul cas suffit à rendre un programme faux, et cette erreur ne provoque aucun message : elle donne simplement un résultat erroné pour une valeur particulière.
:::

## 7. Les boucles bornées

::: definition Boucle bornée
Une **boucle bornée** répète un bloc d'instructions un **nombre de fois connu à l'avance**.
:::

::: formule
**La structure**
```
Pour i allant de 1 à n
    instructions
Fin Pour
```
Le bloc est exécuté exactement `n` fois. La variable `i` prend successivement les valeurs `1`, `2`, ... jusqu'à `n`.
:::

::: exemple Calculer une somme
```
s ← 0
Pour i allant de 1 à 5
    s ← s + i
Fin Pour
Afficher s
```
La variable `s` vaut successivement `0`, `1`, `3`, `6`, `10`, puis `15`.
Le programme affiche **15**, c'est-à-dire `1 + 2 + 3 + 4 + 5`.
:::

::: piege L'initialisation
Sans la ligne `s ← 0` au début, la variable `s` n'aurait aucune valeur et le premier `s ← s + i` échouerait.
**Toute variable accumulatrice doit être initialisée avant la boucle.** C'est l'oubli le plus fréquent en programmation.
:::

::: retenir Ce qui va dans la boucle, et ce qui reste dehors
Ce qui doit être fait **une seule fois**, comme l'initialisation ou l'affichage final, reste **hors** de la boucle.
Ce qui doit être **répété** va à l'intérieur.
Placer un `Afficher` à l'intérieur de la boucle au lieu de l'extérieur change complètement la sortie du programme.
:::

## 8. Les boucles non bornées

::: definition Boucle non bornée
Une **boucle non bornée** répète un bloc **tant qu'une condition reste vraie**.
On ne sait pas à l'avance combien de fois elle s'exécutera.
:::

::: formule
**La structure**
```
Tant que condition
    instructions
Fin Tant que
```
La condition est testée **avant** chaque passage. Si elle est fausse dès le départ, le bloc n'est jamais exécuté.
:::

::: exemple Doubler jusqu'à dépasser 100
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
Les valeurs de `n` : 1, 2, 4, 8, 16, 32, 64, 128.
La boucle s'arrête quand `n = 128`, puisque `128 ≤ 100` est faux.
Le programme affiche `n = **128**` et `c = **7**`.
:::

::: piege La boucle infinie
Si la condition ne devient jamais fausse, le programme ne s'arrête pas.
```
n ← 1
Tant que n ≤ 100
    Afficher n
Fin Tant que
```
Ici `n` ne change jamais : la boucle tourne indéfiniment.
**Toute boucle non bornée doit contenir une instruction qui fait progresser vers la condition d'arrêt.**
:::

::: grille
| | **Boucle bornée** | **Boucle non bornée** |
|---|---|---|
| Nombre de répétitions | **connu** à l'avance | inconnu |
| Mot-clé | `Pour` | `Tant que` |
| Risque | aucun | boucle **infinie** |
| Employer quand | on sait combien de fois | on sait à quelle condition s'arrêter |
:::

## 9. Dérouler un programme pas à pas

::: methode Construire un tableau de déroulement
1. Écris une **colonne par variable**, plus une colonne pour les affichages.
2. Écris une **ligne par instruction exécutée**, dans l'ordre réel.
3. Reporte à chaque ligne la valeur **de toutes** les variables, même celles qui n'ont pas changé.
4. Lis la dernière ligne pour connaître l'état final.
:::

::: exemple Un déroulement complet
```
x ← 4
y ← 1
Pour i allant de 1 à 3
    y ← y × x
Fin Pour
Afficher y
```

| Instruction | `x` | `y` | `i` | Affichage |
|---|---|---|---|---|
| `x ← 4` | 4 | – | – | |
| `y ← 1` | 4 | 1 | – | |
| tour 1 : `y ← y × x` | 4 | 4 | 1 | |
| tour 2 : `y ← y × x` | 4 | 16 | 2 | |
| tour 3 : `y ← y × x` | 4 | 64 | 3 | |
| `Afficher y` | 4 | 64 | 3 | **64** |

Le programme calcule `4³ = 64`.
:::

::: retenir Pourquoi dérouler
C'est la seule méthode fiable pour comprendre ce que fait un programme qu'on n'a pas écrit, et pour trouver une erreur dans un programme qu'on a écrit.
Deviner ce que fait un programme en le lisant conduit presque toujours à une erreur d'un tour de boucle.
:::

## 10. Programmer une figure

::: grille
| Instruction du lutin | Effet |
|---|---|
| `avancer de d` | se déplacer de `d` pixels dans la direction actuelle |
| `tourner de a degrés` | pivoter de `a` degrés |
| `stylo en position d'écriture` | commencer à tracer |
| `stylo relevé` | se déplacer sans tracer |
| `aller à (x ; y)` | se placer à un point donné |
:::

::: exemple Tracer un carré
```
Répéter 4 fois
    avancer de 100
    tourner de 90 degrés
Fin Répéter
```
Le lutin trace quatre côtés égaux séparés par quatre angles droits : c'est un carré de 100 pixels de côté.
:::

::: formule
**L'angle de rotation d'un polygone régulier**
Pour tracer un polygone régulier à `n` côtés, le lutin doit tourner à chaque sommet de :

`angle = 360 ÷ n`

Carré : `360 ÷ 4 = 90°`. Triangle équilatéral : `360 ÷ 3 = 120°`. Pentagone : `360 ÷ 5 = 72°`.
:::

::: piege L'angle de rotation n'est pas l'angle du polygone
L'angle **intérieur** d'un triangle équilatéral vaut `60°`.
Mais le lutin tourne de `120°` à chaque sommet, car il pivote de l'**angle extérieur**.
Les deux sont supplémentaires : `60 + 120 = 180`.
C'est l'erreur la plus fréquente dans les tracés programmés.
:::

::: exemple Un programme paramétré
```
Saisir n
Saisir c
Répéter n fois
    avancer de c
    tourner de (360 ÷ n) degrés
Fin Répéter
```
Ce programme trace **n'importe quel** polygone régulier, à partir de son nombre de côtés et de la longueur du côté.
Un programme paramétré vaut bien mieux qu'un programme écrit pour un seul cas.
:::

## 11. Repérer et corriger une erreur

::: grille
| Type d'erreur | Symptôme | Exemple |
|---|---|---|
| **Variable non initialisée** | résultat imprévisible ou message d'erreur | `s ← s + i` sans `s ← 0` avant |
| **Erreur d'un tour** | résultat presque juste | `Pour i de 1 à n−1` au lieu de `1 à n` |
| **Instruction mal placée** | sortie répétée ou manquante | `Afficher` dans la boucle au lieu d'après |
| **Condition inversée** | comportement inverse | `>` au lieu de `<` |
| **Boucle infinie** | le programme ne s'arrête pas | rien ne fait progresser la condition |
| **Strict ou large** | faux pour une seule valeur | `>` au lieu de `≥` |
:::

::: methode Trouver une erreur, en quatre étapes
1. **Dérouler** le programme pas à pas dans un tableau, avec une valeur simple.
2. Comparer chaque ligne au résultat **attendu**.
3. Repérer la **première** ligne où les deux divergent.
4. Examiner l'instruction qui précède immédiatement : c'est presque toujours elle.
:::

::: aide L'erreur la plus courante en 4ᵉ
L'oubli de l'**initialisation** d'une variable accumulatrice.
Prends le réflexe : chaque fois que tu écris `s ← s + quelque chose` dans une boucle, vérifie qu'une ligne `s ← 0` figure **avant** la boucle.
:::

## 12. Les pièges à éviter

::: piege 1. L'affectation n'est pas une égalité
`x ← x + 1` est un **ordre**, pas une équation. On calcule à droite, on range à gauche.
:::

::: piege 2. L'ordre des instructions
Les mêmes instructions dans un ordre différent donnent des résultats différents.
:::

::: piege 3. L'initialisation
Toute variable accumulatrice doit recevoir une valeur **avant** la boucle.
:::

::: piege 4. Dedans ou dehors
Ce qui se fait une seule fois reste **hors** de la boucle.
:::

::: piege 5. Le strict et le large
`>` exclut la valeur, `≥` l'inclut. Un seul cas de différence suffit à fausser un programme.
:::

::: piege 6. La boucle infinie
Une boucle `Tant que` doit contenir une instruction qui fait progresser vers l'arrêt.
:::

::: piege 7. L'angle de rotation
Le lutin tourne de l'angle **extérieur**, soit `360 ÷ n`, et non de l'angle intérieur du polygone.
:::

::: piege 8. Lire au lieu de dérouler
Deviner ce que fait un programme conduit presque toujours à une erreur d'un tour. Il faut **dérouler**.
:::

::: cocher
- Je distingue l'affectation d'une égalité mathématique
- J'initialise toujours mes variables accumulatrices
- J'écris un test avec le bon opérateur, strict ou large
- Je choisis entre boucle bornée et boucle non bornée
- Je déroule un programme dans un tableau pour trouver une erreur
:::
