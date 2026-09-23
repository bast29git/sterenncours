---
type: revision
matiere: maths
lecon: L12
titre: Algorithmique et programmation : fiche de révision
resume: Tout le chapitre en deux pages : l'affectation, les trois structures de base, les opérateurs, les deux types de boucles, la méthode de déroulement, le tracé de figures, les huit pièges et un auto-test de 10 questions.
duree: 15 min
competences:
  - Modéliser
  - Raisonner
objectifs:
  - Retrouver seule la syntaxe des trois structures
  - Dérouler un programme dans un tableau
---

::: plan
1. L'algorithme et les variables
2. Les trois structures de base
3. Les tests et les opérateurs
4. Les deux types de boucles
5. Dérouler un programme
6. Tracer une figure
7. Les mots-clés
8. Les huit pièges
9. Auto-test de 10 questions
:::

## 1. L'algorithme et les variables

::: formule-cle
Un **algorithme** est une suite **finie** d'instructions **précises** et **non ambiguës**.
Une machine n'interprète pas, elle exécute : elle ne devine jamais l'intention.
:::

::: formule-cle
**L'affectation** : `x ← 5` se lit « `x` prend la valeur 5 ».
On calcule d'abord **tout ce qui est à droite**, puis on range le résultat à **gauche**.
`x ← x + 1` est donc un **ordre**, pas une équation.
:::

::: grille
| Instruction | Rôle |
|---|---|
| `Saisir x` | demander une valeur et la ranger dans `x` |
| `Afficher x` | montrer la valeur de `x` |
| `x ← expression` | ranger le résultat dans `x` |
:::

::: retenir Un exemple à dérouler
```
x ← 3
y ← 7
x ← x + y
```
À la fin : `x` vaut **10**, `y` vaut **7**. L'ancienne valeur de `x` est perdue.
:::

## 2. Les trois structures de base

::: grille
| Structure | Rôle |
|---|---|
| **Séquence** | faire les instructions dans l'ordre |
| **Test** | faire quelque chose **si** une condition est vraie |
| **Boucle** | **répéter** un bloc |
:::

::: formule-cle
Aucun programme, si complexe soit-il, n'emploie autre chose que ces **trois** structures.
:::

::: retenir L'ordre compte
`x ← 2` puis `x ← x × 3` puis `x ← x + 5` donne **11**.
`x ← 2` puis `x ← x + 5` puis `x ← x × 3` donne **21**.
Les mêmes instructions dans un ordre différent donnent des résultats différents.
:::

## 3. Les tests et les opérateurs

::: formule-cle
```
Si condition Alors
    instructions A
Sinon
    instructions B
Fin Si
```
On exécute A **ou** B, jamais les deux. Le `Sinon` est facultatif.
:::

::: grille
| Opérateur | Sens | Opérateur | Sens |
|---|---|---|---|
| `=` | égal à | `≠` | différent de |
| `<` | strictement inférieur | `>` | strictement supérieur |
| `≤` | inférieur ou égal | `≥` | supérieur ou égal |
| `ET` | les deux vraies | `OU` | au moins une vraie |
:::

::: piege Le strict et le large
`n > 0` exclut zéro, `n ≥ 0` l'inclut.
Un décalage d'un seul cas suffit à fausser un programme, **sans aucun message d'erreur**.
:::

## 4. Les deux types de boucles

::: grille
| | **Boucle bornée** | **Boucle non bornée** |
|---|---|---|
| Syntaxe | `Pour i allant de 1 à n` | `Tant que condition` |
| Répétitions | nombre **connu** à l'avance | nombre inconnu |
| Risque | aucun | boucle **infinie** |
| Employer quand | on sait **combien** de fois | on sait **à quelle condition** s'arrêter |
:::

::: formule-cle
**Exemple de boucle bornée**
```
s ← 0
Pour i allant de 1 à 5
    s ← s + i
Fin Pour
Afficher s
```
Affiche **15**. Sans la ligne `s ← 0`, le programme échoue : **toute variable accumulatrice doit être initialisée**.
:::

::: formule-cle
**Exemple de boucle non bornée**
```
n ← 1
Tant que n ≤ 100
    n ← n × 2
Fin Tant que
```
`n` prend les valeurs 1, 2, 4, 8, 16, 32, 64, **128**, puis la boucle s'arrête.
Toute boucle `Tant que` doit contenir une instruction qui fait **progresser** vers l'arrêt, faute de quoi elle est infinie.
:::

::: retenir Dedans ou dehors
Ce qui se fait **une seule fois**, initialisation et affichage final, reste **hors** de la boucle.
Ce qui doit être **répété** va à l'intérieur.
:::

## 5. Dérouler un programme

::: grille
| Étape | Ce qu'on fait |
|---|---|
| 1 | une **colonne par variable**, plus une pour les affichages |
| 2 | une **ligne par instruction** exécutée, dans l'ordre réel |
| 3 | reporter la valeur de **toutes** les variables à chaque ligne |
| 4 | lire la dernière ligne pour l'état final |
:::

::: formule-cle
**Exemple**
```
x ← 4
y ← 1
Pour i allant de 1 à 3
    y ← y × x
Fin Pour
```
`y` prend les valeurs 1, puis 4, 16, **64**. Le programme calcule `4³`.
:::

::: retenir Pourquoi dérouler plutôt que lire
Deviner ce que fait un programme conduit presque toujours à une erreur d'un tour de boucle.
Le déroulement est la seule méthode fiable pour comprendre un programme ou pour y trouver une erreur.
:::

## 6. Tracer une figure

::: grille
| Instruction | Effet |
|---|---|
| `avancer de d` | se déplacer de `d` pixels |
| `tourner de a degrés` | pivoter |
| `stylo en position d'écriture` | commencer à tracer |
| `stylo relevé` | se déplacer sans tracer |
:::

::: formule-cle
**Angle de rotation d'un polygone régulier à `n` côtés** : `angle = 360 ÷ n`
Carré : `90°`. Triangle équilatéral : `120°`. Pentagone : `72°`.
:::

::: piege L'angle de rotation n'est pas l'angle du polygone
L'angle intérieur d'un triangle équilatéral vaut `60°`, mais le lutin tourne de `120°` : il pivote de l'angle **extérieur**.
Les deux sont supplémentaires : `60 + 120 = 180`.
:::

::: retenir Le programme paramétré
```
Saisir n
Saisir c
Répéter n fois
    avancer de c
    tourner de (360 ÷ n) degrés
Fin Répéter
```
Ce programme trace **n'importe quel** polygone régulier. Un programme paramétré vaut bien mieux qu'un programme écrit pour un seul cas.
:::

## 7. Les mots-clés

::: motscles
- Algorithme
- Programme
- Instruction
- Variable
- Affectation
- Saisir / Afficher
- Séquence
- Test conditionnel
- Si / Alors / Sinon
- Opérateur de comparaison
- ET / OU
- Boucle bornée
- Boucle non bornée
- Pour / Tant que
- Initialisation
- Boucle infinie
- Déroulement
- Angle extérieur
:::

## 8. Les huit pièges

::: piege 1. L'affectation
`x ← x + 1` est un **ordre**, pas une équation.
:::

::: piege 2. L'ordre des instructions
Il change le résultat.
:::

::: piege 3. L'initialisation
Toute variable accumulatrice doit être initialisée **avant** la boucle.
:::

::: piege 4. Dedans ou dehors
Ce qui se fait une seule fois reste hors de la boucle.
:::

::: piege 5. Le strict et le large
`>` exclut, `≥` inclut.
:::

::: piege 6. La boucle infinie
Une boucle `Tant que` doit faire progresser vers l'arrêt.
:::

::: piege 7. L'angle de rotation
`360 ÷ n`, l'angle **extérieur**.
:::

::: piege 8. Lire au lieu de dérouler
Il faut construire le tableau, pas deviner.
:::

## 9. Auto-test

Réponds sans regarder la fiche de cours. Les réponses sont juste en dessous.

::: exercice 1 | application | 10 min | ecran
1. Qu'est-ce qu'un algorithme ? Cite deux exigences.
2. Que signifie `x ← 5` ?
3. Après `x ← 3`, `y ← 7`, `x ← x + y`, que valent `x` et `y` ?
4. Quelles sont les trois structures de base de la programmation ?
5. Quelle est la différence entre `>` et `≥` ?
6. Quelle est la différence entre une boucle bornée et une boucle non bornée ?
7. Que se passe-t-il si on oublie `s ← 0` avant une boucle qui fait `s ← s + i` ?
8. Qu'est-ce qu'une boucle infinie, et comment l'éviter ?
9. De combien le lutin doit-il tourner pour tracer un pentagone régulier ?
10. Quelle est la méthode fiable pour comprendre un programme qu'on n'a pas écrit ?

::: corrige
1. Une suite **finie** d'instructions **précises** et **non ambiguës** permettant d'obtenir un résultat. Deux exigences parmi : finie, précise, non ambiguë, exécutable.
2. « `x` prend la valeur 5 ». C'est une **affectation** : elle remplace l'ancienne valeur, qui est perdue.
3. `x` vaut **10** et `y` vaut **7**. On calcule d'abord `3 + 7`, puis on range le résultat dans `x`.
4. La **séquence**, le **test** et la **boucle**. Aucun programme n'emploie autre chose.
5. `>` est **strict**, il exclut la valeur ; `≥` est **large**, il l'inclut. `5 > 5` est faux, `5 ≥ 5` est vrai.
6. La boucle **bornée**, avec `Pour`, répète un nombre de fois **connu à l'avance**. La boucle **non bornée**, avec `Tant que`, répète tant qu'une condition est vraie, sans qu'on sache combien de fois.
7. La variable `s` n'a aucune valeur de départ, et la première addition échoue ou donne un résultat imprévisible. C'est l'oubli le plus fréquent en programmation.
8. Une boucle dont la condition ne devient **jamais fausse** : le programme ne s'arrête pas. Pour l'éviter, il faut qu'une instruction **à l'intérieur** de la boucle fasse progresser vers la condition d'arrêt.
9. `360 ÷ 5 = **72°**`. Attention, c'est l'angle **extérieur** : l'angle intérieur d'un pentagone régulier vaut 108°.
10. Le **dérouler pas à pas** dans un tableau, une colonne par variable et une ligne par instruction exécutée. Deviner en lisant conduit presque toujours à une erreur d'un tour de boucle.
:::
:::

::: cocher
- Je distingue l'affectation d'une égalité
- J'initialise toujours mes variables accumulatrices
- Je choisis entre Pour et Tant que
- J'ai eu au moins 8 bonnes réponses sur 10 à l'auto-test
:::
