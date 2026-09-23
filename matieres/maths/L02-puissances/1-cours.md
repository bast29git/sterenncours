---
type: cours
matiere: maths
lecon: L02
titre: Puissances et notation scientifique
resume: Écrire un produit répété sous forme de puissance, manipuler les exposants positifs et négatifs, utiliser les puissances de 10, et écrire un nombre en notation scientifique.
duree: 3 séances de 45 min
competences:
  - Calculer
  - Raisonner
  - Modéliser
  - Communiquer
objectifs:
  - Écrire un produit de facteurs identiques sous forme de puissance
  - Calculer une puissance d'exposant positif ou négatif
  - Appliquer les trois règles de calcul sur les puissances
  - Utiliser les puissances de 10 et les préfixes associés
  - Écrire un nombre en notation scientifique
  - Comparer deux nombres écrits en notation scientifique
---

::: plan
**Séance 1 : ce qu'est une puissance**

1. Écrire plus court
2. Le vocabulaire
3. Les cas particuliers : exposants 0 et 1
4. Les exposants négatifs

*🔁 Pause de 5 minutes*

**Séance 2 : calculer avec les puissances**

5. Multiplier deux puissances du même nombre
6. Diviser deux puissances du même nombre
7. Une puissance de puissance
8. Les puissances de 10

**Séance 3 : la notation scientifique**

9. Écrire en notation scientifique
10. Comparer et ordonner
11. Les préfixes du quotidien
12. Les pièges à éviter
:::

::: materiel
- Une calculatrice avec la touche `x^y` ou `^`
- Une feuille de brouillon
:::

## 1. Écrire plus court

Certains calculs répètent le même facteur un grand nombre de fois. Les écrire en entier prend de la place et rend les erreurs faciles.

::: definition Puissance
Pour un nombre `a` et un entier `n` supérieur ou égal à 1 :
`aⁿ` est le produit de **n facteurs égaux à a**.

`a⁵ = a × a × a × a × a`
:::

::: exemple Deux écritures du même nombre
`2 × 2 × 2 × 2 × 2 × 2 = 2⁶`
On compte **six** facteurs, donc l'exposant est `6`.
`2⁶ = 64`.

`10 × 10 × 10 = 10³ = 1 000`
:::

::: retenir
L'exposant compte les **facteurs**, pas les multiplications.
Dans `2 × 2 × 2`, il y a **trois** facteurs mais **deux** signes de multiplication. C'est le nombre de facteurs qui donne l'exposant.
:::

## 2. Le vocabulaire

::: definition Base et exposant
Dans l'écriture `aⁿ` :
`a` s'appelle la **base**, c'est le nombre que l'on répète.
`n` s'appelle l'**exposant**, il dit combien de fois on le répète.
On lit `aⁿ` « a puissance n ».
:::

Deux lectures particulières existent, et il faut les connaître.

::: grille
| Écriture | Lecture courante | Valeur si `a = 3` |
|---|---|---|
| `a²` | a **au carré** | `3² = 9` |
| `a³` | a **au cube** | `3³ = 27` |
| `a⁴` | a puissance 4 | `3⁴ = 81` |
:::

::: piege Ne pas confondre la puissance et la multiplication
`2⁵` ne vaut **pas** `2 × 5 = 10`.
`2⁵ = 2 × 2 × 2 × 2 × 2 = 32`.
Le contrôle : une puissance grandit beaucoup plus vite qu'une multiplication. Si le résultat ressemble à `base × exposant`, c'est presque toujours une erreur.
:::

## 3. Les cas particuliers : exposants 0 et 1

Deux conventions complètent la définition. Elles ne se devinent pas : elles s'apprennent.

::: formule Les deux conventions
Pour tout nombre `a` **non nul** :
`a¹ = a`
`a⁰ = 1`
:::

::: info Pourquoi a⁰ vaut 1
Regardons les puissances de 2 en descendant : `2³ = 8`, `2² = 4`, `2¹ = 2`.
À chaque fois qu'on diminue l'exposant de 1, on **divise par 2**.
En continuant : `2⁰ = 2 ÷ 2 = 1`.
La convention n'est donc pas arbitraire : c'est la seule valeur qui prolonge la régularité.
:::

## 4. Les exposants négatifs

Le même raisonnement, poursuivi une case plus loin, donne le sens d'un exposant négatif.

::: exemple Continuer la descente
`2² = 4`, `2¹ = 2`, `2⁰ = 1`.
En divisant encore par 2 : `2⁻¹ = 1 ÷ 2 = 1/2`.
Puis : `2⁻² = 1/2 ÷ 2 = 1/4`.
:::

::: formule-cle
Pour tout nombre `a` non nul et tout entier `n` :
`a⁻ⁿ = 1 / aⁿ`
:::

::: grille
| Écriture | Valeur |
|---|---|
| `10⁻¹` | `0,1` |
| `10⁻²` | `0,01` |
| `10⁻³` | `0,001` |
| `2⁻³` | `1/8 = 0,125` |
| `5⁻²` | `1/25 = 0,04` |
:::

::: piege Un exposant négatif ne donne pas un nombre négatif
`2⁻³` vaut `0,125`, qui est **positif**.
L'exposant négatif signale un **inverse**, pas un signe.
Pour obtenir un résultat négatif, il faut une **base** négative et un exposant impair : `(-2)³ = -8`.
:::

::: piege La place des parenthèses change tout
`(-3)² = (-3) × (-3) = +9`.
`-3² = -(3 × 3) = -9`.
Sans parenthèses, l'exposant ne porte que sur le `3`, pas sur le signe. C'est l'erreur la plus fréquente du chapitre.
:::

::: pause
Fin de la première séance. La définition, les deux conventions et les exposants négatifs sont posés.
:::

## 5. Multiplier deux puissances du même nombre

::: formule Produit de puissances
`aᵐ × aⁿ = aᵐ⁺ⁿ`
On garde la base, on **additionne** les exposants.
:::

::: exemple Comprendre la règle plutôt que la retenir
`2³ × 2⁴ = (2 × 2 × 2) × (2 × 2 × 2 × 2)`
Au total, il y a `3 + 4 = 7` facteurs égaux à 2.
Donc `2³ × 2⁴ = 2⁷ = 128`.

La règle n'est pas une astuce : c'est le comptage des facteurs.
:::

::: piege La règle exige la même base
`2³ × 5³` ne fait pas `10⁶` ni `2⁶`.
Les bases sont différentes : on ne peut pas additionner les exposants.
Ici, il faut calculer : `8 × 125 = 1 000`.
:::

## 6. Diviser deux puissances du même nombre

::: formule Quotient de puissances
`aᵐ ÷ aⁿ = aᵐ⁻ⁿ`
On garde la base, on **soustrait** les exposants.
:::

::: exemple Un quotient
`5⁶ ÷ 5² = 5⁶⁻² = 5⁴ = 625`

Vérification : `5⁶ = 15 625` et `5² = 25`, or `15 625 ÷ 25 = 625`. Les deux méthodes donnent le même résultat.
:::

::: exemple Quand le résultat a un exposant négatif
`3² ÷ 3⁵ = 3²⁻⁵ = 3⁻³ = 1/27`

La règle fonctionne même quand la soustraction donne un nombre négatif : c'est justement à cela que servent les exposants négatifs.
:::

## 7. Une puissance de puissance

::: formule Puissance d'une puissance
`(aᵐ)ⁿ = aᵐ ˣ ⁿ`
On garde la base, on **multiplie** les exposants.
:::

::: exemple Comprendre la troisième règle
`(2³)² = 2³ × 2³ = 2³⁺³ = 2⁶ = 64`
On a bien `3 × 2 = 6`.
:::

::: retenir Les trois règles en une phrase
**Produit : on additionne. Quotient : on soustrait. Puissance de puissance : on multiplie.**
Dans les trois cas, la **base ne change pas**, et elle doit être la même.
:::

::: piege Une confusion fréquente
`(2³)² = 2⁶ = 64`, parce qu'on multiplie les exposants.
`2³ × 2² = 2⁵ = 32`, parce qu'on les additionne.
Le repère : une **parenthèse** avec un exposant à l'extérieur, c'est une multiplication d'exposants. Un **signe ×** entre deux puissances, c'est une addition.
:::

## 8. Les puissances de 10

Ce sont les plus utiles, parce qu'elles décrivent notre façon d'écrire les nombres.

::: grille
| Puissance | Valeur | Écriture |
|---|---|---|
| `10³` | 1 000 | 1 suivi de **3** zéros |
| `10⁶` | 1 000 000 | 1 suivi de **6** zéros |
| `10⁰` | 1 | |
| `10⁻¹` | 0,1 | |
| `10⁻³` | 0,001 | **3** chiffres après la virgule |
| `10⁻⁶` | 0,000 001 | **6** chiffres après la virgule |
:::

::: formule-cle
`10ⁿ` avec `n` positif : **1 suivi de n zéros**.
`10⁻ⁿ` : **n chiffres après la virgule**, le dernier étant un 1.
:::

::: exemple Multiplier par une puissance de 10
Multiplier par `10³`, c'est décaler la virgule de **3 rangs vers la droite**.
`4,27 × 10³ = 4 270`

Multiplier par `10⁻²`, c'est décaler la virgule de **2 rangs vers la gauche**.
`4,27 × 10⁻² = 0,0427`
:::

::: pause
Fin de la deuxième séance. Les trois règles et les puissances de 10 sont posées.
:::

## 9. Écrire en notation scientifique

::: definition Notation scientifique
Un nombre est écrit en **notation scientifique** quand il se présente sous la forme
`a × 10ⁿ`
où `a` est un nombre décimal dont la **partie entière comporte un seul chiffre**, compris entre 1 et 9, et où `n` est un entier relatif.
:::

::: grille
| Nombre | Notation scientifique | Correct ? |
|---|---|---|
| `4 270` | `4,27 × 10³` | oui |
| `4 270` | `42,7 × 10²` | non : 42 a deux chiffres |
| `4 270` | `0,427 × 10⁴` | non : la partie entière est 0 |
| `0,000 58` | `5,8 × 10⁻⁴` | oui |
:::

::: methode Écrire un nombre en notation scientifique
::: etapes
1. Je place la virgule **juste après le premier chiffre non nul**.
2. Je compte de **combien de rangs** la virgule a bougé.
3. Si elle a bougé vers la **gauche**, l'exposant est **positif**.
4. Si elle a bougé vers la **droite**, l'exposant est **négatif**.
:::
:::

::: exemple Un grand nombre
Écrire `38 400 000` en notation scientifique.

Je place la virgule après le `3` : `3,84`.
La virgule a bougé de **7 rangs vers la gauche**.
L'exposant est donc `+7`.

`38 400 000 = 3,84 × 10⁷`
:::

::: exemple Un petit nombre
Écrire `0,000 062` en notation scientifique.

Le premier chiffre non nul est le `6`. Je place la virgule juste après : `6,2`.
La virgule a bougé de **5 rangs vers la droite**.
L'exposant est donc `-5`.

`0,000 062 = 6,2 × 10⁻⁵`
:::

::: aide Un contrôle qui ne trompe pas
Un nombre **plus grand que 1** a un exposant **positif**.
Un nombre **plus petit que 1** a un exposant **négatif**.
Si le signe de l'exposant ne correspond pas, c'est qu'on a compté dans le mauvais sens.
:::

## 10. Comparer et ordonner

::: methode Comparer deux nombres en notation scientifique
::: etapes
1. Je compare d'abord les **exposants**. Le plus grand exposant donne le plus grand nombre.
2. Si les exposants sont **égaux**, je compare les nombres `a` devant.
:::
:::

::: exemple Deux comparaisons
`3,2 × 10⁵` et `9,8 × 10⁴` : l'exposant `5` est plus grand que `4`, donc `3,2 × 10⁵` est le plus grand, même si `3,2` est plus petit que `9,8`.

`4,1 × 10⁶` et `4,7 × 10⁶` : les exposants sont égaux, on compare `4,1` et `4,7`. Donc `4,7 × 10⁶` est le plus grand.
:::

::: piege Ne pas comparer les nombres de devant en premier
`9,8 × 10⁴` semble plus grand que `3,2 × 10⁵` parce que `9,8 > 3,2`. C'est faux.
`9,8 × 10⁴ = 98 000` et `3,2 × 10⁵ = 320 000`.
**L'exposant décide en premier**, toujours.
:::

## 11. Les préfixes du quotidien

::: grille
| Préfixe | Symbole | Puissance | Exemple |
|---|---|---|---|
| kilo | k | `10³` | 1 km = 1 000 m |
| méga | M | `10⁶` | 1 Mo = 1 000 000 octets |
| giga | G | `10⁹` | 1 Go |
| téra | T | `10¹²` | 1 To |
| milli | m | `10⁻³` | 1 mm = 0,001 m |
| micro | µ | `10⁻⁶` | 1 µm |
| nano | n | `10⁻⁹` | 1 nm |
:::

::: exemple Une conversion
Un fichier fait `3,5 Go`. Combien d'octets cela représente-t-il ?

`1 Go = 10⁹ octets`.
`3,5 × 10⁹ = 3 500 000 000` octets.
:::

::: info Ces préfixes servent partout
Le nanomètre sert à mesurer un atome en physique-chimie, le kilomètre à mesurer le déplacement des plaques en SVT, le mégaoctet à peser un fichier. Ce sont les mêmes puissances de 10 dans les trois cas.
:::

## 12. Les pièges à éviter

::: grille
| Piège | Ce qui est faux | Ce qui est juste |
|---|---|---|
| Puissance et produit | `2⁵ = 10` | `2⁵ = 32` |
| Exposant négatif | `2⁻³ = -8` | `2⁻³ = 0,125` |
| Parenthèses | `-3² = 9` | `-3² = -9`, mais `(-3)² = 9` |
| Bases différentes | `2³ × 5³ = 10⁶` | on calcule : `8 × 125 = 1 000` |
| Produit et puissance de puissance | `(2³)² = 2⁵` | `(2³)² = 2⁶` |
| Notation scientifique | `42,7 × 10²` | `4,27 × 10³` |
| Comparaison | `9,8 × 10⁴ > 3,2 × 10⁵` | l'**exposant** décide en premier |
:::

::: retenir
Trois phrases suffisent à retenir le chapitre.
**L'exposant compte les facteurs, pas les multiplications.**
**Produit : on additionne les exposants. Quotient : on soustrait. Puissance de puissance : on multiplie.**
**En notation scientifique, le nombre devant a un seul chiffre avant la virgule.**
:::

::: cocher
- Je sais écrire un produit répété sous forme de puissance
- Je connais les valeurs de `a⁰` et de `a¹`
- Je sais calculer une puissance d'exposant négatif
- Je sais placer les parenthèses pour `(-3)²` et `-3²`
- Je connais les trois règles de calcul et je sais quand les employer
- Je sais écrire une puissance de 10, positive ou négative
- Je sais écrire un nombre en notation scientifique
- Je sais comparer deux nombres en notation scientifique
- Je connais les préfixes kilo, méga, giga, milli, micro, nano
:::
