---
type: cours
matiere: maths
lecon: L07
titre: Probabilités
resume: Expérience aléatoire, issues et événements, calcul d'une probabilité en situation d'équiprobabilité, événement contraire, expériences à deux épreuves avec arbre et tableau, et lien entre fréquence observée et probabilité.
duree: 3 séances de 45 min
competences:
  - Chercher
  - Modéliser
  - Représenter
  - Calculer
  - Raisonner
objectifs:
  - Reconnaître une expérience aléatoire et lister ses issues
  - Calculer la probabilité d'un événement en situation d'équiprobabilité
  - Employer la probabilité de l'événement contraire
  - Construire un arbre et un tableau à deux épreuves
  - Distinguer fréquence observée et probabilité
  - Repérer les raisonnements faux sur le hasard
---

::: plan
**Séance 1 : le vocabulaire et le calcul de base**

1. L'expérience aléatoire
2. Issues et événements
3. Calculer une probabilité
4. Les trois valeurs repères

*🔁 Pause de 5 minutes*

**Séance 2 : les outils**

5. L'événement contraire
6. Les expériences à deux épreuves
7. L'arbre des possibles
8. Le tableau à double entrée

**Séance 3 : comprendre le hasard**

9. Fréquence et probabilité
10. La loi des grands nombres
11. Les raisonnements faux
12. Les pièges à éviter
:::

::: materiel
- Un dé à six faces
- Une pièce de monnaie
- Une calculatrice
- Du papier pour tracer les arbres
:::

## 1. L'expérience aléatoire

::: definition Expérience aléatoire
Une **expérience aléatoire** est une expérience dont on connaît tous les résultats possibles, mais dont on ne peut pas prévoir lequel se produira.
Exemples : lancer un dé, tirer une carte, faire tourner une roue.
:::

::: grille
| Expérience | Aléatoire ? | Pourquoi |
|---|---|---|
| Lancer un dé | **oui** | six résultats possibles, aucun prévisible |
| Lâcher un objet | **non** | il tombe à tous les coups |
| Tirer une boule dans un sac | **oui** | plusieurs résultats possibles |
| Additionner 3 et 4 | **non** | le résultat est toujours 7 |
:::

::: piege « Aléatoire » ne veut pas dire « inconnu »
On connaît parfaitement la **liste** des résultats possibles.
Ce qu'on ignore, c'est **lequel** sortira. C'est très différent.
:::

## 2. Issues et événements

::: definition Issue et événement
Une **issue** est un résultat possible de l'expérience.
Un **événement** est un ensemble d'issues, décrit par une phrase.
:::

::: exemple Sur le lancer d'un dé
**Issues** : 1, 2, 3, 4, 5, 6. Il y en a six.
**Événement** « obtenir un nombre pair » : c'est l'ensemble `{2 ; 4 ; 6}`, soit trois issues.
**Événement** « obtenir 7 » : c'est l'ensemble vide, aucune issue. Il est **impossible**.
**Événement** « obtenir un nombre inférieur à 10 » : les six issues. Il est **certain**.
:::

::: grille
| Type d'événement | Nombre d'issues | Probabilité |
|---|---|---|
| **Impossible** | aucune | `0` |
| **Possible** | au moins une, pas toutes | entre `0` et `1` |
| **Certain** | toutes | `1` |
:::

::: methode Lister les issues sans en oublier
1. Écris-les dans un **ordre fixe**, du plus petit au plus grand ou dans l'ordre alphabétique.
2. Compte-les.
3. Vérifie que ce nombre correspond bien à la situation décrite.
:::

## 3. Calculer une probabilité

::: definition Équiprobabilité
Il y a **équiprobabilité** quand toutes les issues ont la même chance de se produire.
C'est le cas d'un dé équilibré, d'une pièce non truquée, d'un tirage au hasard dans un sac.
:::

::: formule
**En situation d'équiprobabilité**

`probabilité d'un événement = nombre d'issues favorables ÷ nombre d'issues possibles`
:::

::: exemple Trois calculs sur un dé
Probabilité d'obtenir un 4 : une issue favorable sur six. `P = 1 ÷ 6 ≈ 0,17`, soit environ 17 %.
Probabilité d'obtenir un nombre pair : trois issues favorables sur six. `P = 3 ÷ 6 = 0,5`, soit 50 %.
Probabilité d'obtenir un nombre inférieur à 3 : les issues 1 et 2, donc deux sur six. `P = 2 ÷ 6 = 1 ÷ 3 ≈ 0,33`.
:::

::: piege La formule n'est valable que si les issues sont équiprobables
Sur une roue dont un secteur occupe la moitié du disque et les trois autres un sixième chacun, on ne divise pas par 4.
Il faut alors raisonner sur les **surfaces**, pas sur le nombre de secteurs.
:::

::: methode Calculer une probabilité en quatre étapes
1. Liste **toutes** les issues possibles et compte-les.
2. Vérifie qu'elles sont bien **équiprobables**.
3. Compte les issues **favorables** à l'événement.
4. Divise le second nombre par le premier.
:::

## 4. Les trois valeurs repères

::: grille
| Probabilité | Signification |
|---|---|
| `0` | l'événement est **impossible** |
| `0,5` | il a **une chance sur deux** |
| `1` | il est **certain** |
:::

::: formule
Une probabilité est toujours un nombre **compris entre 0 et 1**.
`0 ≤ P ≤ 1`
Elle peut s'écrire en fraction, en décimal ou en pourcentage : `1 ÷ 4`, `0,25`, `25 %` désignent la même chose.
:::

::: piege Une probabilité ne dépasse jamais 1
Un résultat supérieur à 1 ou négatif signale forcément une erreur de calcul.
C'est le contrôle de vraisemblance le plus rapide.
:::

::: retenir La somme des probabilités de toutes les issues
Elle vaut toujours **1**.
Sur un dé : `1/6 + 1/6 + 1/6 + 1/6 + 1/6 + 1/6 = 6/6 = 1`.
C'est un second contrôle très efficace.
:::

🔁 **Point de pause.** Reprends après cinq minutes. La suite ajoute les outils pour les situations moins simples.

## 5. L'événement contraire

::: definition Événement contraire
L'**événement contraire** d'un événement `A` est celui qui se produit exactement quand `A` ne se produit pas.
On le note `non A`.
:::

::: formule
`P(non A) = 1 − P(A)`

Autrement dit : `P(A) + P(non A) = 1`.
:::

::: exemple Le calcul par le contraire
On lance deux dés. Quelle est la probabilité d'obtenir **au moins un 6** ?

Compter directement demande d'énumérer beaucoup de cas.
Passons par le contraire : « **aucun** 6 ».
Chaque dé a 5 chances sur 6 de ne pas donner 6. Sur 36 issues possibles, celles sans aucun 6 sont `5 × 5 = 25`.
`P(aucun 6) = 25 ÷ 36`.
Donc `P(au moins un 6) = 1 − 25/36 = 11/36 ≈ 0,31`.
:::

::: retenir Quand penser au contraire
Dès qu'un énoncé contient « **au moins** » ou « **au moins un** ».
Compter l'inverse est presque toujours beaucoup plus rapide, et moins risqué.
:::

## 6. Les expériences à deux épreuves

::: definition Expérience à deux épreuves
C'est une expérience formée de **deux tirages successifs** ou de deux lancers.
Chaque résultat est alors un **couple**, par exemple `(3 ; 5)` pour deux dés.
:::

::: formule
**Nombre d'issues d'une expérience à deux épreuves**
`nombre total = nombre d'issues de la 1ʳᵉ épreuve × nombre d'issues de la 2ᵉ`

Deux dés : `6 × 6 = 36` issues.
Deux pièces : `2 × 2 = 4` issues.
:::

::: grille
| Situation | 1ʳᵉ épreuve | 2ᵉ épreuve | Total |
|---|---|---|---|
| Deux pièces | 2 | 2 | **4** |
| Deux dés | 6 | 6 | **36** |
| Un dé puis une pièce | 6 | 2 | **12** |
| Tirage avec remise, sac de 5 boules | 5 | 5 | **25** |
| Tirage sans remise, sac de 5 boules | 5 | **4** | **20** |
:::

::: piege Avec remise ou sans remise
**Avec remise** : on repose la boule, la seconde épreuve a autant d'issues que la première.
**Sans remise** : il y a **une boule de moins**, donc une issue de moins.
Lis toujours l'énoncé sur ce point avant de compter.
:::

## 7. L'arbre des possibles

::: definition Arbre des possibles
Un **arbre** représente toutes les issues d'une expérience à plusieurs épreuves.
Chaque branche du premier niveau est une issue de la première épreuve ; on repart de chacune pour la seconde.
:::

::: exemple L'arbre de deux lancers de pièce
Premier niveau : `P` ou `F`.
De `P` partent `P` et `F`. De `F` partent `P` et `F`.
Les quatre chemins donnent : `(P ; P)`, `(P ; F)`, `(F ; P)`, `(F ; F)`.

Probabilité d'obtenir deux fois pile : **une** issue sur quatre, soit `1 ÷ 4 = 0,25`.
Probabilité d'obtenir exactement un pile : **deux** issues, `(P ; F)` et `(F ; P)`, soit `2 ÷ 4 = 0,5`.
:::

::: piege `(P ; F)` et `(F ; P)` sont deux issues distinctes
L'ordre compte dans un arbre.
Obtenir pile puis face n'est pas la même issue qu'obtenir face puis pile, même si le « résultat » semble identique.
Les oublier revient à compter 3 issues au lieu de 4, et toutes les probabilités deviennent fausses.
:::

::: methode Tracer un arbre sans erreur
1. Écris les issues de la première épreuve, alignées verticalement.
2. De **chacune**, fais partir toutes les issues de la seconde épreuve.
3. Compte les chemins : leur nombre doit être le produit calculé au point 6.
4. Lis les issues en suivant chaque chemin de gauche à droite.
:::

## 8. Le tableau à double entrée

::: definition Tableau à double entrée
Quand les deux épreuves ont beaucoup d'issues, un tableau est plus lisible qu'un arbre.
On place la première épreuve en ligne, la seconde en colonne, et on lit les couples dans les cases.
:::

::: exemple La somme de deux dés
On construit un tableau 6 par 6 où chaque case contient la **somme** des deux dés.

| + | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| **1** | 2 | 3 | 4 | 5 | 6 | 7 |
| **2** | 3 | 4 | 5 | 6 | 7 | 8 |
| **3** | 4 | 5 | 6 | 7 | 8 | 9 |
| **4** | 5 | 6 | 7 | 8 | 9 | 10 |
| **5** | 6 | 7 | 8 | 9 | 10 | 11 |
| **6** | 7 | 8 | 9 | 10 | 11 | 12 |

Le tableau contient **36 cases**, une par issue.
Probabilité d'obtenir une somme de 7 : on compte les cases contenant 7, il y en a **6**. `P = 6 ÷ 36 = 1 ÷ 6`.
Probabilité d'obtenir 12 : une seule case. `P = 1 ÷ 36`.
:::

::: retenir Pourquoi 7 est la somme la plus probable
Elle s'obtient de six façons différentes, alors que 2 et 12 ne s'obtiennent chacun que d'une seule.
Les sommes **ne sont pas équiprobables**, alors que les 36 couples le sont.
C'est exactement pourquoi il faut compter les **issues**, jamais les résultats.
:::

## 9. Fréquence et probabilité

::: definition Fréquence observée
La **fréquence** d'un résultat est ce qu'on a réellement obtenu en répétant l'expérience : nombre de succès divisé par nombre d'essais.
La **probabilité** est ce qu'on attend en théorie.
:::

::: grille
| | **Probabilité** | **Fréquence** |
|---|---|---|
| Nature | théorique, calculée | observée, mesurée |
| Se calcule | avant l'expérience | après l'expérience |
| Change d'une série à l'autre | non | **oui** |
:::

::: exemple Un exemple chiffré
On lance 20 fois une pièce et on obtient 13 piles.
**Fréquence observée** : `13 ÷ 20 = 0,65`.
**Probabilité théorique** : `0,5`.

L'écart ne prouve pas que la pièce est truquée : sur 20 lancers, un tel écart est banal.
:::

## 10. La loi des grands nombres

::: formule
**La loi des grands nombres**
Quand on répète une expérience aléatoire un **très grand nombre** de fois, la fréquence observée se rapproche de la probabilité théorique.
:::

::: exemple Le rapprochement, en chiffres
| Nombre de lancers | Piles obtenus | Fréquence |
|---|---|---|
| 20 | 13 | 0,65 |
| 100 | 57 | 0,57 |
| 1 000 | 512 | 0,512 |
| 10 000 | 5 023 | 0,5023 |

La fréquence se rapproche de 0,5. Remarque cependant que l'**écart en nombre** de piles, lui, ne diminue pas : il est de 3 sur 20 lancers, de 23 sur 10 000. C'est la **proportion** qui se stabilise, pas l'écart absolu.
:::

::: retenir Ce que la loi ne dit pas
Elle ne dit **pas** qu'après plusieurs piles, face devient plus probable.
Elle dit seulement que sur un très grand nombre de lancers, la proportion tend vers 0,5.
La différence entre ces deux énoncés est le sujet du point suivant.
:::

## 11. Les raisonnements faux

::: piege « Ça fait cinq fois face, pile va sortir »
**Faux.** La pièce n'a aucune mémoire. À chaque lancer, la probabilité reste `0,5`, quels que soient les résultats précédents.
Ce raisonnement porte un nom : l'erreur du joueur.
:::

::: piege « J'ai plus de chances avec les numéros 1, 2, 3, 4, 5, 6 qu'avec une combinaison au hasard »
**Faux.** Toutes les combinaisons ont exactement la même probabilité.
`1, 2, 3, 4, 5, 6` paraît improbable parce qu'elle est **remarquable**, pas parce qu'elle est rare.
:::

::: piege « Il y a deux issues, donc une chance sur deux »
**Faux** en général. Ce raisonnement ne vaut que si les deux issues sont **équiprobables**.
« Gagner ou ne pas gagner au loto » fait bien deux issues, mais elles ne sont évidemment pas équiprobables.
:::

::: piege « Ce numéro n'est pas sorti depuis longtemps, il est dû »
**Faux**, c'est la même erreur que la première. Un tirage ne rattrape rien.
:::

::: methode Contrôler un raisonnement sur le hasard en trois questions
1. Les issues que je compte sont-elles **équiprobables** ?
2. Ai-je bien compté **toutes** les issues, dans l'ordre ?
3. Est-ce que je prête une **mémoire** au hasard ?
:::

## 12. Les pièges à éviter

::: piege 1. L'équiprobabilité non vérifiée
La formule `favorables ÷ possibles` n'est valable que si toutes les issues ont la même chance.
:::

::: piege 2. Une probabilité hors de l'intervalle
Un résultat négatif ou supérieur à 1 est forcément faux.
:::

::: piege 3. L'ordre dans un arbre
`(P ; F)` et `(F ; P)` sont deux issues différentes.
:::

::: piege 4. Avec remise ou sans remise
Sans remise, la seconde épreuve a une issue de moins.
:::

::: piege 5. Compter les sommes au lieu des couples
Les 36 couples de deux dés sont équiprobables ; les sommes, non.
:::

::: piege 6. Confondre fréquence et probabilité
La fréquence est observée et varie ; la probabilité est théorique et fixe.
:::

::: piege 7. L'erreur du joueur
Le hasard n'a pas de mémoire. Aucun résultat n'est « dû ».
:::

::: piege 8. « Deux issues donc une chance sur deux »
Faux dès que les deux issues ne sont pas équiprobables.
:::

::: cocher
- Je liste toutes les issues d'une expérience sans en oublier
- Je calcule une probabilité et je vérifie qu'elle est entre 0 et 1
- Je passe par l'événement contraire dès que je lis « au moins »
- Je construis un arbre et un tableau à deux épreuves
- Je sais expliquer pourquoi le hasard n'a pas de mémoire
:::
