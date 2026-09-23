---
type: revision
matiere: maths
lecon: L07
titre: Probabilités : fiche de révision
resume: Tout le chapitre en deux pages : le vocabulaire, la formule de l'équiprobabilité, l'événement contraire, l'arbre et le tableau à deux épreuves, fréquence contre probabilité, les huit pièges et un auto-test de 10 questions.
duree: 15 min
competences:
  - Calculer
  - Raisonner
objectifs:
  - Retrouver seule la formule et les valeurs repères
  - Repérer un raisonnement faux sur le hasard
---

::: plan
1. Le vocabulaire
2. La formule et les repères
3. L'événement contraire
4. Les expériences à deux épreuves
5. Le tableau des deux dés
6. Fréquence et probabilité
7. Les mots-clés
8. Les huit pièges
9. Auto-test de 10 questions
:::

## 1. Le vocabulaire

::: grille
| Mot | Définition |
|---|---|
| **Expérience aléatoire** | on connaît les résultats possibles, pas celui qui sortira |
| **Issue** | un résultat possible |
| **Événement** | un ensemble d'issues, décrit par une phrase |
| **Équiprobabilité** | toutes les issues ont la même chance |
| **Événement contraire** | il se produit quand l'autre ne se produit pas |
:::

::: grille
| Type d'événement | Issues | Probabilité |
|---|---|---|
| **Impossible** | aucune | `0` |
| **Possible** | au moins une, pas toutes | entre `0` et `1` |
| **Certain** | toutes | `1` |
:::

## 2. La formule et les repères

::: formule-cle
**En situation d'équiprobabilité**
`P = nombre d'issues favorables ÷ nombre d'issues possibles`

Une probabilité est toujours comprise entre **0 et 1**.
La somme des probabilités de toutes les issues vaut **1**.
:::

::: grille
| Événement, avec un dé | Issues favorables | Probabilité |
|---|---|---|
| Obtenir 4 | 1 | `1/6 ≈ 0,17` |
| Obtenir un nombre pair | 3 | `3/6 = 0,5` |
| Obtenir moins de 3 | 2 | `2/6 = 1/3 ≈ 0,33` |
| Obtenir 7 | 0 | `0` |
:::

::: piege L'équiprobabilité d'abord
La formule n'est valable que si **toutes** les issues ont la même chance.
Sur une roue à secteurs inégaux, il faut raisonner sur les **surfaces**.
:::

## 3. L'événement contraire

::: formule-cle
`P(non A) = 1 − P(A)`
Donc `P(A) + P(non A) = 1`.
:::

::: retenir Quand y penser
Dès qu'un énoncé contient « **au moins** ».
Deux dés, probabilité d'avoir au moins un 6 : les issues sans aucun 6 sont `5 × 5 = 25` sur 36.
`P(au moins un 6) = 1 − 25/36 = 11/36 ≈ 0,31`.
:::

## 4. Les expériences à deux épreuves

::: formule-cle
`nombre total d'issues = issues de la 1ʳᵉ épreuve × issues de la 2ᵉ`
Deux dés : `6 × 6 = 36`. Deux pièces : `2 × 2 = 4`.
:::

::: grille
| Situation | 1ʳᵉ | 2ᵉ | Total |
|---|---|---|---|
| Deux pièces | 2 | 2 | **4** |
| Deux dés | 6 | 6 | **36** |
| Un dé puis une pièce | 6 | 2 | **12** |
| Sac de 5 boules, **avec** remise | 5 | 5 | **25** |
| Sac de 5 boules, **sans** remise | 5 | **4** | **20** |
:::

::: piege L'ordre compte
`(P ; F)` et `(F ; P)` sont **deux issues distinctes**.
Les confondre donne 3 issues au lieu de 4, et toutes les probabilités deviennent fausses.
:::

## 5. Le tableau des deux dés

::: grille
| + | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| **1** | 2 | 3 | 4 | 5 | 6 | 7 |
| **2** | 3 | 4 | 5 | 6 | 7 | 8 |
| **3** | 4 | 5 | 6 | 7 | 8 | 9 |
| **4** | 5 | 6 | 7 | 8 | 9 | 10 |
| **5** | 6 | 7 | 8 | 9 | 10 | 11 |
| **6** | 7 | 8 | 9 | 10 | 11 | 12 |
:::

::: formule-cle
36 cases, une par issue. Somme 7 : **6 cases**, donc `6/36 = 1/6`. Somme 12 : **1 case**, donc `1/36`.
Les 36 **couples** sont équiprobables ; les **sommes**, non.
C'est pourquoi on compte toujours les issues, jamais les résultats.
:::

## 6. Fréquence et probabilité

::: grille
| | **Probabilité** | **Fréquence** |
|---|---|---|
| Nature | théorique, calculée | observée, mesurée |
| Quand | avant l'expérience | après l'expérience |
| Varie d'une série à l'autre | non | **oui** |
:::

::: formule-cle
**Loi des grands nombres** : quand on répète l'expérience un très grand nombre de fois, la fréquence observée se rapproche de la probabilité théorique.
Elle ne dit **pas** qu'après cinq faces, pile devient plus probable.
:::

::: piege L'erreur du joueur
Le hasard n'a **pas de mémoire**. À chaque lancer, la probabilité est la même, quels que soient les résultats précédents.
Aucun numéro n'est jamais « dû ».
:::

## 7. Les mots-clés

::: motscles
- Expérience aléatoire
- Issue
- Événement
- Événement impossible
- Événement certain
- Équiprobabilité
- Probabilité
- Événement contraire
- Avec remise
- Sans remise
- Arbre des possibles
- Tableau à double entrée
- Couple
- Fréquence
- Loi des grands nombres
- Erreur du joueur
:::

## 8. Les huit pièges

::: piege 1. L'équiprobabilité non vérifiée
La formule ne vaut que si toutes les issues ont la même chance.
:::

::: piege 2. Une probabilité hors de l'intervalle
Un résultat négatif ou supérieur à 1 est forcément faux.
:::

::: piege 3. L'ordre dans un arbre
`(P ; F)` et `(F ; P)` sont deux issues différentes.
:::

::: piege 4. Avec ou sans remise
Sans remise, la seconde épreuve a une issue de moins.
:::

::: piege 5. Compter les sommes
Les 36 couples sont équiprobables ; les sommes, non.
:::

::: piege 6. Fréquence et probabilité
L'une est observée et varie, l'autre est théorique et fixe.
:::

::: piege 7. L'erreur du joueur
Le hasard n'a pas de mémoire.
:::

::: piege 8. « Deux issues donc une chance sur deux »
Faux dès que les deux issues ne sont pas équiprobables.
:::

## 9. Auto-test

Réponds sans regarder la fiche de cours. Les réponses sont juste en dessous.

::: exercice 1 | application | 10 min | ecran
1. Qu'est-ce qu'une expérience aléatoire ?
2. Quelle est la différence entre une issue et un événement ?
3. Donne la formule de la probabilité en situation d'équiprobabilité.
4. Entre quelles valeurs une probabilité est-elle toujours comprise ?
5. Quelle est la probabilité d'obtenir un nombre pair avec un dé ?
6. Donne la formule de l'événement contraire.
7. Combien y a-t-il d'issues quand on lance deux dés ?
8. Combien y a-t-il d'issues pour un tirage de 2 boules sans remise dans un sac de 5 ?
9. Quelle est la différence entre fréquence et probabilité ?
10. « Ça fait cinq fois face, pile va sortir. » Est-ce vrai ? Explique.

::: corrige
1. Une expérience dont on connaît **tous les résultats possibles**, mais dont on ne peut pas prévoir lequel se produira.
2. Une **issue** est un résultat possible, par exemple obtenir 3 avec un dé. Un **événement** est un ensemble d'issues décrit par une phrase, par exemple « obtenir un nombre pair », qui regroupe 2, 4 et 6.
3. `P = nombre d'issues favorables ÷ nombre d'issues possibles`, à condition que les issues soient équiprobables.
4. Entre **0 et 1**, bornes comprises. Un résultat hors de cet intervalle signale une erreur.
5. Trois issues favorables sur six : `3 ÷ 6 = **0,5**`, soit 50 %.
6. `P(non A) = 1 − P(A)`. On y pense dès qu'un énoncé contient « au moins ».
7. `6 × 6 = **36** issues`, une par couple de résultats.
8. `5 × 4 = **20**`. Sans remise, la seconde épreuve a une boule de moins.
9. La **probabilité** est théorique, calculée avant l'expérience, et elle ne change pas. La **fréquence** est observée, mesurée après coup, et elle varie d'une série à l'autre.
10. **Non, c'est faux.** La pièce n'a aucune mémoire : la probabilité reste `0,5` à chaque lancer, quels que soient les résultats précédents. C'est l'erreur du joueur.
:::
:::

::: cocher
- Je liste toutes les issues sans en oublier
- Je vérifie que ma probabilité est bien entre 0 et 1
- Je passe par le contraire dès que je lis « au moins »
- J'ai eu au moins 8 bonnes réponses sur 10 à l'auto-test
:::
