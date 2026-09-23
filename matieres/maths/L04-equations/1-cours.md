---
type: cours
matiere: maths
lecon: L04
titre: Équations du premier degré
resume: Ce qu'est une équation, ce que signifie résoudre, les deux règles qui permettent de transformer une équation, la méthode complète, et comment mettre un problème en équation.
duree: 3 séances de 45 min
competences:
  - Chercher
  - Modéliser
  - Calculer
  - Raisonner
objectifs:
  - Distinguer une équation d'une expression
  - Tester si un nombre est solution d'une équation
  - Résoudre une équation du type ax + b = c
  - Résoudre une équation avec des inconnues des deux côtés
  - Mettre un problème en équation
  - Vérifier une solution et rédiger une conclusion
---

::: plan
**Séance 1 : comprendre une équation**

1. Équation, inconnue, solution
2. Tester un nombre
3. Les deux règles de transformation
4. Résoudre ax + b = c

*🔁 Pause de 5 minutes*

**Séance 2 : résoudre plus loin**

5. Inconnues des deux côtés
6. Équations avec parenthèses
7. Équations avec fractions
8. Les cas particuliers

**Séance 3 : mettre en équation**

9. Passer d'un énoncé à une équation
10. Deux problèmes types
11. Rédiger une solution complète
12. Les pièges à éviter
:::

::: materiel
- Une feuille de brouillon quadrillée
- Une règle pour tracer la barre verticale de séparation des membres
- Une calculatrice, uniquement pour la vérification
:::

## 1. Équation, inconnue, solution

::: definition Équation
Une **équation** est une **égalité** qui contient une ou plusieurs lettres, et qui n'est vraie que pour certaines valeurs de ces lettres.
:::

::: definition Inconnue
L'**inconnue** est la lettre dont on cherche la valeur. On la note le plus souvent `x`.
:::

::: definition Solution
Une **solution** est une valeur de l'inconnue qui rend l'égalité **vraie**.
**Résoudre** une équation, c'est trouver **toutes** ses solutions.
:::

::: grille
| Écriture | Ce que c'est | Ce qu'on en fait |
|---|---|---|
| `3x + 5` | une **expression** | on la réduit, on la développe, on la calcule |
| `3x + 5 = 20` | une **équation** | on la **résout** |
| `3(x + 2) = 3x + 6` | une **identité** | elle est vraie pour tout `x` |
:::

::: piege Une expression ne se résout pas
`3x + 5` ne peut pas être « résolu » : il n'y a pas de signe égal, donc rien à rendre vrai.
On ne résout que ce qui contient un **signe égal**.
:::

::: definition Membres d'une équation
Ce qui est à **gauche** du signe égal s'appelle le **membre de gauche**.
Ce qui est à **droite** s'appelle le **membre de droite**.
:::

## 2. Tester un nombre

::: methode Vérifier si un nombre est solution
::: etapes
1. Je calcule le **membre de gauche** en remplaçant `x` par la valeur.
2. Je calcule le **membre de droite** de la même façon.
3. Je **compare** les deux résultats.
4. S'ils sont **égaux**, le nombre est solution. Sinon, il ne l'est pas.
:::
:::

::: exemple Tester deux nombres
L'équation est `3x + 5 = 20`.

**Test de `x = 4` :**
Membre de gauche : `3 × 4 + 5 = 12 + 5 = 17`.
Membre de droite : `20`.
`17 ≠ 20`, donc `4` n'est **pas** solution.

**Test de `x = 5` :**
Membre de gauche : `3 × 5 + 5 = 15 + 5 = 20`.
Membre de droite : `20`.
`20 = 20`, donc `5` **est** solution.
:::

::: retenir
On calcule les deux membres **séparément**, puis on compare.
On n'écrit jamais une suite d'égalités qui relierait les deux membres : ce serait supposer vrai ce qu'on cherche à vérifier.
:::

## 3. Les deux règles de transformation

::: formule Règle 1 : addition et soustraction
On peut **ajouter** ou **soustraire** un même nombre aux deux membres d'une équation sans changer ses solutions.

Si `a = b`, alors `a + c = b + c` et `a − c = b − c`.
:::

::: formule Règle 2 : multiplication et division
On peut **multiplier** ou **diviser** les deux membres par un même nombre **non nul** sans changer ses solutions.

Si `a = b` et `c ≠ 0`, alors `a × c = b × c` et `a ÷ c = b ÷ c`.
:::

::: exemple L'image de la balance
Une équation est comme une balance en équilibre.
Ajouter `3 kg` sur les deux plateaux ne change rien à l'équilibre.
Doubler le contenu des deux plateaux non plus.
En revanche, ajouter `3 kg` d'un seul côté casse l'équilibre : c'est exactement l'erreur à ne jamais commettre.
:::

<figure class="schema">
<svg width="440" height="180" viewBox="0 0 440 180" role="img" aria-label="Une balance en équilibre : le plateau de gauche porte 3x plus 5, le plateau de droite porte 20. Toute opération doit être faite des deux côtés.">
  <line class="trait" x1="60" y1="60" x2="380" y2="60"/>
  <line class="trait" x1="220" y1="60" x2="220" y2="140"/>
  <polygon class="plein" points="220,140 195,165 245,165"/>
  <line class="trait" x1="60" y1="60" x2="60" y2="95"/>
  <line class="trait" x1="380" y1="60" x2="380" y2="95"/>
  <rect class="bande" x="14" y="95" width="92" height="40" rx="6"/>
  <rect class="bande" x="334" y="95" width="92" height="40" rx="6"/>
  <text x="60" y="121" text-anchor="middle" font-size="17">3x + 5</text>
  <text x="380" y="121" text-anchor="middle" font-size="17">20</text>
  <text class="legende" x="220" y="40" text-anchor="middle">tout ce qu'on fait d'un côté,</text>
  <text class="legende" x="220" y="24" text-anchor="middle">on le fait de l'autre</text>
</svg>
<figcaption>Une équation se comporte comme une balance : on peut ajouter, retrancher, multiplier ou diviser, à condition de le faire sur les deux plateaux à la fois.</figcaption>
</figure>

::: piege La division par zéro
La règle 2 précise **non nul**. Multiplier les deux membres par `0` donnerait `0 = 0`, ce qui est vrai mais ne dit plus rien sur `x`.
On perdrait toute l'information de l'équation.
:::

## 4. Résoudre ax + b = c

::: methode Résoudre une équation du premier degré
::: etapes
1. Je **fais passer les nombres** du côté de l'inconnue vers l'autre membre, en soustrayant ou en ajoutant des deux côtés.
2. J'obtiens une équation de la forme `ax = d`.
3. Je **divise les deux membres** par `a`.
4. J'obtiens `x = ...`
5. Je **vérifie** en remplaçant dans l'équation de départ.
6. Je **conclus** par une phrase.
:::
:::

::: exemple Résoudre 3x + 5 = 20
`3x + 5 = 20`

Je soustrais `5` aux deux membres :
`3x + 5 − 5 = 20 − 5`
`3x = 15`

Je divise les deux membres par `3` :
`3x ÷ 3 = 15 ÷ 3`
`x = 5`

**Vérification.** Membre de gauche pour `x = 5` : `3 × 5 + 5 = 20`. Membre de droite : `20`. Égalité vérifiée.

**Conclusion.** La solution de l'équation est `x = 5`.
:::

::: exemple Un cas avec une soustraction
`7x − 12 = 30`

J'ajoute `12` aux deux membres :
`7x = 42`

Je divise par `7` :
`x = 6`

**Vérification.** `7 × 6 − 12 = 42 − 12 = 30`. Correct.
:::

::: exemple Un résultat fractionnaire
`4x + 1 = 10`

`4x = 9`
`x = 9/4`, soit `2,25`.

Une solution n'est pas obligatoirement un nombre entier. On laisse la fraction si elle est irréductible : c'est une réponse exacte, alors que `2,25` n'est exact que par chance ici.
:::

::: pause
Fin de la première séance. Les règles et la résolution de base sont posées.
:::

## 5. Inconnues des deux côtés

::: methode Quand l'inconnue figure des deux côtés
::: etapes
1. Je choisis le membre où je veux **rassembler les `x`**, de préférence celui où le coefficient est le plus grand.
2. Je **soustrais** aux deux membres le terme en `x` de l'autre côté.
3. Je **rassemble les nombres** dans l'autre membre.
4. Je **divise** et je vérifie.
:::
:::

::: exemple Résoudre 5x + 3 = 2x + 18
`5x + 3 = 2x + 18`

Je soustrais `2x` aux deux membres :
`5x − 2x + 3 = 18`
`3x + 3 = 18`

Je soustrais `3` aux deux membres :
`3x = 15`

Je divise par `3` :
`x = 5`

**Vérification.** Gauche : `5 × 5 + 3 = 28`. Droite : `2 × 5 + 18 = 28`. Égalité vérifiée.
:::

::: exemple Un cas où le coefficient devient négatif
`2x + 9 = 6x − 7`

Ici, `6x` est plus grand que `2x` : je rassemble à droite.
Je soustrais `2x` aux deux membres : `9 = 4x − 7`.
J'ajoute `7` : `16 = 4x`.
Je divise par `4` : `4 = x`, donc `x = 4`.

**Vérification.** Gauche : `2 × 4 + 9 = 17`. Droite : `6 × 4 − 7 = 17`. Correct.
:::

::: aide Pourquoi rassembler du côté du plus grand coefficient
Ce n'est pas obligatoire, mais cela évite d'obtenir un coefficient négatif devant `x`, donc une division par un nombre négatif. On réduit ainsi le risque d'erreur de signe.
Les deux méthodes donnent évidemment la même solution.
:::

## 6. Équations avec parenthèses

::: methode L'ordre de travail
::: etapes
1. Je **développe** toutes les parenthèses.
2. Je **réduis** chaque membre séparément.
3. Je **rassemble** les `x` d'un côté et les nombres de l'autre.
4. Je **divise** et je vérifie.
:::
:::

::: exemple Résoudre 3(x + 4) = 2x + 19
Je développe : `3x + 12 = 2x + 19`.
Je soustrais `2x` : `x + 12 = 19`.
Je soustrais `12` : `x = 7`.

**Vérification.** Gauche : `3 × (7 + 4) = 3 × 11 = 33`. Droite : `2 × 7 + 19 = 33`. Correct.
:::

::: exemple Avec un moins devant une parenthèse
`5x − 2(x − 3) = 15`

Je développe en surveillant les signes : `−2(x − 3) = −2x + 6`.
`5x − 2x + 6 = 15`
`3x + 6 = 15`
`3x = 9`
`x = 3`

**Vérification.** `5 × 3 − 2 × (3 − 3) = 15 − 0 = 15`. Correct.
:::

::: piege La faute reportée du chapitre précédent
Si le développement de `−2(x − 3)` est raté, l'équation devient fausse dès la première ligne, et tout le reste est perdu, même si la technique de résolution est correcte.
C'est pourquoi la leçon sur le calcul littéral doit être solide avant celle-ci.
:::

## 7. Équations avec fractions

::: methode Faire disparaître les dénominateurs
::: etapes
1. Je repère le **dénominateur commun** de toutes les fractions.
2. Je **multiplie les deux membres** par ce dénominateur commun.
3. Les fractions disparaissent : je résous comme d'habitude.
:::
:::

::: exemple Résoudre x/3 + 2 = 5
Je multiplie les deux membres par `3` :
`3 × (x/3 + 2) = 3 × 5`
`x + 6 = 15`
`x = 9`

**Vérification.** `9/3 + 2 = 3 + 2 = 5`. Correct.
:::

::: exemple Deux dénominateurs différents
`x/2 + x/3 = 5`

Le dénominateur commun de `2` et `3` est `6`. Je multiplie les deux membres par `6` :
`6 × x/2 + 6 × x/3 = 30`
`3x + 2x = 30`
`5x = 30`
`x = 6`

**Vérification.** `6/2 + 6/3 = 3 + 2 = 5`. Correct.
:::

::: piege Multiplier tous les termes, sans exception
Dans `x/3 + 2 = 5`, multiplier par `3` doit toucher **aussi** le `2` et le `5`.
Écrire `x + 2 = 5` serait faux : le `2` n'aurait pas été multiplié.
Le contrôle : après multiplication, il ne doit plus rester aucune fraction, et chaque terme doit avoir changé.
:::

## 8. Les cas particuliers

::: exemple Une équation sans solution
`2x + 5 = 2x + 9`

Je soustrais `2x` aux deux membres : `5 = 9`.
C'est **faux** pour toute valeur de `x`.
L'équation n'a donc **aucune solution**.
:::

::: exemple Une équation à une infinité de solutions
`3(x + 2) = 3x + 6`

Je développe : `3x + 6 = 3x + 6`.
C'est **vrai** quelle que soit la valeur de `x`.
L'équation a donc une **infinité de solutions** : tout nombre convient. On dit que c'est une **identité**.
:::

::: retenir Comment reconnaître ces deux cas
Les `x` disparaissent des deux côtés en même temps.
Il reste alors une égalité entre deux **nombres**.
Si elle est **fausse** : aucune solution. Si elle est **vraie** : une infinité.
:::

::: piege Une solution nulle n'est pas une absence de solution
`5x = 0` donne `x = 0`. Il y a bien **une** solution, qui se trouve être le nombre zéro.
C'est très différent d'une équation qui n'a aucune solution.
:::

::: pause
Fin de la deuxième séance. Toutes les techniques de résolution sont posées.
:::

## 9. Passer d'un énoncé à une équation

::: methode Mettre un problème en équation
::: etapes
1. Je **choisis l'inconnue** et je l'écris en toutes lettres : « Soit `x` le nombre de ... ».
2. J'**exprime** les autres quantités en fonction de `x`.
3. Je **traduis** la phrase qui contient une égalité.
4. Je **résous** l'équation obtenue.
5. Je **vérifie** que la solution a un sens dans le problème.
6. Je **réponds** par une phrase complète.
:::
:::

::: grille
| Formulation en français | Traduction |
|---|---|
| la somme de `x` et de 7 | `x + 7` |
| 5 de plus que `x` | `x + 5` |
| 5 de moins que `x` | `x − 5` |
| le double de `x` | `2x` |
| le triple de `x` | `3x` |
| la moitié de `x` | `x/2` |
| `x` augmenté de 20 % | `1,2 × x` |
| 3 fois plus que `x` | `3x` |
:::

::: piege « 5 de moins que x » et « 5 moins x »
`5 de moins que x` s'écrit `x − 5`.
`5 moins x` s'écrit `5 − x`.
Ce ne sont pas les mêmes expressions, et pour `x = 2` elles ne donnent même pas le même signe.
Lire l'énoncé lentement, en identifiant qui est retranché à qui, évite cette erreur.
:::

## 10. Deux problèmes types

::: exemple Problème 1 : un nombre et son triple
« Le triple d'un nombre, augmenté de 7, vaut 31. Quel est ce nombre ? »

**Choix de l'inconnue.** Soit `x` le nombre cherché.
**Mise en équation.** Le triple de `x` est `3x`. Augmenté de `7`, cela donne `3x + 7`. Cette quantité vaut `31`.
`3x + 7 = 31`
**Résolution.** `3x = 24`, donc `x = 8`.
**Vérification.** `3 × 8 + 7 = 24 + 7 = 31`. Correct.
**Conclusion.** Le nombre cherché est **8**.
:::

::: exemple Problème 2 : un partage
« Deux amis se partagent 48 euros. Le premier reçoit 6 euros de plus que le second. Combien reçoit chacun ? »

**Choix de l'inconnue.** Soit `x` la somme reçue par le **second**.
**Expression des autres quantités.** Le premier reçoit `x + 6`.
**Mise en équation.** Le total vaut `48` :
`x + (x + 6) = 48`
**Résolution.**
`2x + 6 = 48`
`2x = 42`
`x = 21`
**Autre quantité.** Le premier reçoit `21 + 6 = 27`.
**Vérification.** `21 + 27 = 48`, et `27 − 21 = 6`. Les deux conditions de l'énoncé sont respectées.
**Conclusion.** Le premier reçoit **27 euros**, le second **21 euros**.
:::

::: retenir Le point le plus important
Le choix de l'inconnue n'est pas anodin. Ici, poser `x` pour le **second** évite les nombres négatifs intermédiaires.
On peut choisir l'autre, l'équation devient `x + (x − 6) = 48`, et on trouve `x = 27`. Le résultat final est le même, ce qui est rassurant.
:::

## 11. Rédiger une solution complète

::: retenir Les cinq lignes attendues
1. **Le choix de l'inconnue**, écrit en français : « Soit `x` ... ».
2. **L'équation**, écrite une fois proprement.
3. **Les étapes de résolution**, une par ligne, alignées sur le signe égal.
4. **La vérification**, avec les deux membres calculés séparément.
5. **La conclusion**, en une phrase qui répond à la question posée.
:::

::: piege Une résolution sans conclusion perd des points
Trouver `x = 8` ne répond pas à la question « quel est ce nombre ? ».
La conclusion doit reprendre les mots de l'énoncé et donner l'unité quand il y en a une : « Le nombre cherché est 8 », « Le premier reçoit 27 euros ».
:::

::: info Ce que vérifie vraiment la vérification
Elle ne vérifie pas seulement le calcul : elle vérifie aussi que la solution a un **sens** dans le problème.
Si une équation donne `x = −3` pour un nombre de personnes, le calcul est peut-être juste, mais la mise en équation est fausse.
:::

## 12. Les pièges à éviter

::: grille
| Piège | Ce qui est faux | Ce qui est juste |
|---|---|---|
| Expression et équation | on résout `3x + 5` | on ne résout que ce qui a un **signe égal** |
| Opération d'un seul côté | `3x + 5 = 20` donne `3x = 20` | il faut soustraire `5` **des deux côtés** |
| Division par zéro | on peut diviser par n'importe quoi | jamais par **zéro** |
| Fractions | on multiplie seulement le terme fractionnaire | on multiplie **tous** les termes |
| Parenthèses | on résout avant de développer | on **développe d'abord** |
| Aucune solution | `5 = 9` veut dire `x = 0` | cela veut dire **aucune solution** |
| Solution nulle | `x = 0` veut dire pas de solution | il y a bien **une** solution |
| Conclusion | `x = 8` suffit | il faut une **phrase** qui répond |
:::

::: retenir
Trois phrases suffisent à retenir le chapitre.
**Tout ce qu'on fait d'un côté, on le fait de l'autre.**
**On développe d'abord, on rassemble ensuite, on divise en dernier.**
**On vérifie toujours, et on conclut par une phrase.**
:::

::: cocher
- Je sais distinguer une expression, une équation et une identité
- Je sais tester si un nombre est solution en calculant les deux membres
- Je connais les deux règles de transformation et leurs limites
- Je sais résoudre une équation du type ax + b = c
- Je sais résoudre avec des inconnues des deux côtés
- Je sais résoudre une équation avec parenthèses ou avec fractions
- Je sais reconnaître une équation sans solution et une identité
- Je sais mettre un problème en équation en choisissant mon inconnue
- Je sais rédiger une solution complète avec vérification et conclusion
:::
