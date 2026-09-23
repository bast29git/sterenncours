---
type: cours
matiere: maths
lecon: L01
titre: Nombres relatifs et fractions
resume: Calculer avec des nombres positifs et négatifs, additionner et soustraire des fractions, les multiplier, les diviser, et respecter l'ordre des opérations.
duree: 3 séances de 45 min
competences:
  - Calculer
  - Raisonner
  - Représenter
  - Communiquer
objectifs:
  - Additionner et soustraire deux nombres relatifs
  - Multiplier et diviser deux nombres relatifs, et donner le signe du résultat
  - Mettre deux fractions au même dénominateur
  - Additionner et soustraire deux fractions
  - Multiplier et diviser deux fractions
  - Appliquer les priorités opératoires dans un calcul à plusieurs opérations
---

::: plan
**Séance 1 : les nombres relatifs**

1. Ce qu'est un nombre relatif
2. Additionner deux nombres relatifs
3. Soustraire, c'est ajouter l'opposé
4. Multiplier et diviser : la règle des signes

*🔁 Pause de 5 minutes*

**Séance 2 : les fractions**

5. Ce qu'est une fraction
6. Simplifier une fraction
7. Additionner et soustraire des fractions
8. Multiplier des fractions
9. Diviser des fractions

**Séance 3 : tout assembler**

10. Les priorités opératoires
11. Fractions et relatifs dans le même calcul
12. Les pièges à éviter
:::

::: materiel
- Une calculatrice
- Une feuille de brouillon
- Le tableau des tables de multiplication si besoin, sans hésiter
:::

## 1. Ce qu'est un nombre relatif

::: definition Nombre relatif
Un **nombre relatif** est un nombre qui porte un **signe** : `+` ou `-`.
Les nombres **positifs** sont au-dessus de zéro : `+3`, `+7,5`.
Les nombres **négatifs** sont en dessous de zéro : `-3`, `-7,5`.
Zéro n'est ni positif ni négatif.
:::

Quand un nombre n'a pas de signe écrit, il est **positif**. On écrit `5` pour `+5`.

::: definition Distance à zéro
La **distance à zéro** d'un nombre relatif, c'est ce nombre **sans son signe**.
La distance à zéro de `-7` est `7`.
La distance à zéro de `+7` est `7` aussi.
:::

::: definition Opposé
L'**opposé** d'un nombre est le nombre qui a la **même distance à zéro** et le **signe contraire**.
L'opposé de `+4` est `-4`.
L'opposé de `-9` est `+9`.
Un nombre et son opposé s'annulent : `-9 + 9 = 0`.
:::

<figure class="schema">
<svg width="520" height="120" viewBox="0 0 520 120" role="img" aria-label="Une droite graduée de moins 5 à plus 5. Les nombres négatifs sont à gauche de zéro, les positifs à droite. Moins 3 et plus 3 sont à la même distance de zéro.">
  <line class="axe" x1="30" y1="60" x2="490" y2="60"/>
  <g class="graduations">
    <line x1="70" y1="52" x2="70" y2="68"/><line x1="112" y1="52" x2="112" y2="68"/>
    <line x1="154" y1="52" x2="154" y2="68"/><line x1="196" y1="52" x2="196" y2="68"/>
    <line x1="238" y1="52" x2="238" y2="68"/><line x1="280" y1="46" x2="280" y2="74"/>
    <line x1="322" y1="52" x2="322" y2="68"/><line x1="364" y1="52" x2="364" y2="68"/>
    <line x1="406" y1="52" x2="406" y2="68"/><line x1="448" y1="52" x2="448" y2="68"/>
  </g>
  <text x="70" y="90" text-anchor="middle">-5</text>
  <text x="154" y="90" text-anchor="middle">-3</text>
  <text x="280" y="92" text-anchor="middle">0</text>
  <text x="406" y="90" text-anchor="middle">+3</text>
  <text x="448" y="90" text-anchor="middle">+4</text>
  <text class="legende" x="150" y="30" text-anchor="middle">négatifs</text>
  <text class="legende" x="410" y="30" text-anchor="middle">positifs</text>
  <path class="fleche" d="M 154 44 L 280 44"/>
  <path class="fleche" d="M 406 44 L 280 44"/>
</svg>
<figcaption>Sur la droite graduée, les nombres négatifs sont à gauche de zéro et les positifs à droite. Les nombres -3 et +3 sont à la même distance de zéro : ce sont deux opposés.</figcaption>
</figure>

## 2. Additionner deux nombres relatifs

Il y a deux cas, et deux seulement.

::: formule Addition de deux relatifs
**Cas 1 : les deux nombres ont le même signe.**
On additionne les distances à zéro, et on garde le signe commun.

**Cas 2 : les deux nombres ont des signes différents.**
On soustrait la plus petite distance à zéro de la plus grande, et on garde le signe du nombre le plus éloigné de zéro.
:::

::: exemple Cas 1 : même signe
Calculer `(-5) + (-8)`.

Les deux nombres sont négatifs : même signe.
J'additionne les distances à zéro : `5 + 8 = 13`.
Je garde le signe commun, le signe `-`.

`(-5) + (-8) = -13`
:::

::: exemple Cas 2 : signes différents
Calculer `(-9) + (+4)`.

Les signes sont différents.
Je soustrais la plus petite distance à zéro de la plus grande : `9 - 4 = 5`.
Le nombre le plus éloigné de zéro est `-9`, qui est négatif. Je garde le signe `-`.

`(-9) + (+4) = -5`
:::

::: methode Additionner deux relatifs
::: etapes
1. Je regarde les **deux signes**.
2. S'ils sont **identiques** : j'additionne les distances à zéro, je garde le signe.
3. S'ils sont **différents** : je soustrais la petite distance de la grande.
4. Dans ce cas, je regarde lequel des deux nombres est **le plus loin de zéro** : c'est son signe que je garde.
:::
:::

::: piege Ne pas confondre le signe du résultat et le signe du plus grand chiffre
Dans `(-9) + (+4)`, le résultat est négatif parce que `9` est plus grand que `4`, et que le `9` porte le signe `-`.
Dans `(-4) + (+9)`, le résultat est **positif** : `+5`. C'est le même calcul de distances, mais le nombre le plus éloigné de zéro est cette fois `+9`.
Il faut donc toujours comparer les **distances à zéro** avant de choisir le signe.
:::

## 3. Soustraire, c'est ajouter l'opposé

::: formule-cle
Soustraire un nombre, c'est **ajouter son opposé**.
`a - b = a + (-b)`
:::

Cette règle transforme **toute** soustraction en addition. On n'a donc jamais qu'une seule technique à connaître : celle de l'addition.

::: exemple Transformer une soustraction
Calculer `(-6) - (+7)`.

Je soustrais `+7`, donc j'ajoute son opposé, `-7` :
`(-6) - (+7) = (-6) + (-7)`
Les deux nombres sont négatifs : j'additionne les distances, je garde le signe.
`6 + 7 = 13`

`(-6) - (+7) = -13`
:::

::: exemple Soustraire un nombre négatif
Calculer `(+3) - (-8)`.

Je soustrais `-8`, donc j'ajoute son opposé, `+8` :
`(+3) - (-8) = (+3) + (+8)`
Les deux nombres sont positifs.
`3 + 8 = 11`

`(+3) - (-8) = +11`
:::

::: retenir
Soustraire un nombre **négatif** fait **augmenter** le résultat.
C'est la seule situation où un calcul avec un nombre négatif donne un résultat plus grand qu'au départ.
:::

## 4. Multiplier et diviser : la règle des signes

Pour la multiplication et la division, on sépare le calcul en **deux questions** indépendantes : quel est le signe, et quelle est la distance à zéro.

::: formule Règle des signes
Pour un produit ou un quotient de **deux** nombres :

- deux signes **identiques** donnent un résultat **positif** ;
- deux signes **différents** donnent un résultat **négatif**.
:::

::: grille
| Premier nombre | Deuxième nombre | Signe du résultat |
|---|---|---|
| positif | positif | **positif** |
| négatif | négatif | **positif** |
| positif | négatif | **négatif** |
| négatif | positif | **négatif** |
:::

::: exemple Un produit
Calculer `(-6) × (+7)`.

Signe : les deux signes sont différents, donc le résultat est **négatif**.
Distance à zéro : `6 × 7 = 42`.

`(-6) × (+7) = -42`
:::

::: exemple Un quotient
Calculer `(-45) ÷ (-9)`.

Signe : les deux signes sont identiques, donc le résultat est **positif**.
Distance à zéro : `45 ÷ 9 = 5`.

`(-45) ÷ (-9) = +5`
:::

::: methode Compter les signes moins dans un produit long
Quand le produit comporte plusieurs facteurs, on compte les signes `-`.
::: etapes
1. Je compte combien de facteurs sont **négatifs**.
2. Si ce nombre est **pair**, le résultat est **positif**.
3. Si ce nombre est **impair**, le résultat est **négatif**.
4. Je calcule ensuite le produit des distances à zéro.
:::
:::

::: exemple Un produit de quatre facteurs
Calculer `(-2) × (+3) × (-5) × (-1)`.

Facteurs négatifs : `-2`, `-5` et `-1`, soit **trois**. Trois est impair, donc le résultat est **négatif**.
Produit des distances : `2 × 3 × 5 × 1 = 30`.

`(-2) × (+3) × (-5) × (-1) = -30`
:::

::: piege La règle des signes ne s'applique pas à l'addition
`(-3) × (-4) = +12`, parce que c'est un **produit**.
`(-3) + (-4) = -7`, parce que c'est une **addition**.
Deux moins qui se suivent ne donnent un plus que dans une multiplication, une division, ou une soustraction de nombre négatif. Jamais dans une addition de deux négatifs.
:::

::: pause
Fin de la première séance. Les relatifs sont posés : addition, soustraction, règle des signes.
:::

## 5. Ce qu'est une fraction

::: definition Fraction
Une **fraction** est un quotient de deux nombres entiers.
Dans `3/4`, le `3` est le **numérateur** et le `4` le **dénominateur**.
Le dénominateur dit en combien de parts égales on partage, le numérateur dit combien de parts on prend.
:::

::: definition Fractions égales
Multiplier ou diviser le numérateur **et** le dénominateur par un même nombre non nul ne change pas la fraction.
`3/4 = 6/8 = 15/20`
:::

## 6. Simplifier une fraction

::: methode Simplifier une fraction
::: etapes
1. Je cherche un nombre qui divise **à la fois** le numérateur et le dénominateur.
2. Je divise les deux par ce nombre.
3. Je recommence tant que c'est possible.
4. Je m'arrête quand plus aucun nombre, à part 1, ne divise les deux.
:::
:::

::: exemple Simplifier 42/56
`42` et `56` sont tous les deux divisibles par `2` :
`42 ÷ 2 = 21` et `56 ÷ 2 = 28`, donc `42/56 = 21/28`.

`21` et `28` sont tous les deux divisibles par `7` :
`21 ÷ 7 = 3` et `28 ÷ 7 = 4`, donc `21/28 = 3/4`.

`3` et `4` n'ont plus de diviseur commun autre que 1.

`42/56 = 3/4`
:::

::: info Les critères de divisibilité qui servent le plus
Un nombre est divisible par **2** s'il se termine par 0, 2, 4, 6 ou 8.
Par **3** si la somme de ses chiffres est dans la table de 3.
Par **5** s'il se termine par 0 ou 5.
Par **9** si la somme de ses chiffres est dans la table de 9.
:::

## 7. Additionner et soustraire des fractions

C'est le point le plus important du chapitre, et celui qui demande le plus de rigueur.

::: formule Addition de fractions
On ne peut additionner deux fractions que si elles ont le **même dénominateur**.
On additionne alors les **numérateurs**, et on **garde** le dénominateur.

`a/c + b/c = (a + b)/c`
:::

::: piege On n'additionne jamais les dénominateurs
`1/2 + 1/3` ne fait **pas** `2/5`.
Pour s'en convaincre : `2/5` est plus petit que `1/2`. Or, ajouter quelque chose à `1/2` doit donner un résultat **plus grand** que `1/2`.
Le bon résultat est `5/6`, que l'on va calculer ci-dessous.
:::

::: methode Additionner deux fractions de dénominateurs différents
::: etapes
1. Je cherche un dénominateur **commun** : souvent, le plus grand des deux s'il est dans la table de l'autre.
2. Sinon, je prends le **produit** des deux dénominateurs : cela marche toujours.
3. Je transforme chaque fraction pour qu'elle ait ce dénominateur.
4. J'additionne les numérateurs et je garde le dénominateur.
5. Je simplifie le résultat si c'est possible.
:::
:::

::: exemple Cas facile : un dénominateur est dans la table de l'autre
Calculer `3/4 + 5/12`.

`12` est dans la table de `4` : `4 × 3 = 12`. Le dénominateur commun sera `12`.
Je transforme la première fraction : `3/4 = (3 × 3)/(4 × 3) = 9/12`.
La seconde ne change pas.

`3/4 + 5/12 = 9/12 + 5/12 = 14/12`

Je simplifie : `14` et `12` sont divisibles par `2`.
`14 ÷ 2 = 7` et `12 ÷ 2 = 6`.

`3/4 + 5/12 = 7/6`
:::

::: exemple Cas général : on multiplie les dénominateurs
Calculer `1/2 + 1/3`.

`3` n'est pas dans la table de `2`. Je prends le produit : `2 × 3 = 6`.
`1/2 = (1 × 3)/(2 × 3) = 3/6`
`1/3 = (1 × 2)/(3 × 2) = 2/6`

`1/2 + 1/3 = 3/6 + 2/6 = 5/6`

`5` et `6` n'ont pas de diviseur commun : le résultat est déjà simplifié.
:::

::: exemple Une soustraction
Calculer `5/6 - 3/8`.

`8` n'est pas dans la table de `6`. Le produit `6 × 8 = 48` marcherait, mais `24` est plus petit et convient aussi : `24 = 6 × 4` et `24 = 8 × 3`.
`5/6 = (5 × 4)/(6 × 4) = 20/24`
`3/8 = (3 × 3)/(8 × 3) = 9/24`

`5/6 - 3/8 = 20/24 - 9/24 = 11/24`

`11` est un nombre premier et ne divise pas `24` : le résultat est simplifié.
:::

## 8. Multiplier des fractions

::: formule Produit de deux fractions
On multiplie les numérateurs entre eux, et les dénominateurs entre eux.
**Aucun dénominateur commun n'est nécessaire.**

`a/b × c/d = (a × c)/(b × d)`
:::

::: exemple Un produit simple
Calculer `2/3 × 5/7`.

Numérateurs : `2 × 5 = 10`.
Dénominateurs : `3 × 7 = 21`.

`2/3 × 5/7 = 10/21`
:::

::: exemple Simplifier avant de multiplier
Calculer `4/9 × 3/8`.

Je peux simplifier **avant** : `4` et `8` se divisent par `4`, `3` et `9` se divisent par `3`.
`4 ÷ 4 = 1` et `8 ÷ 4 = 2`
`3 ÷ 3 = 1` et `9 ÷ 3 = 3`

Le calcul devient `1/3 × 1/2 = 1/6`.

`4/9 × 3/8 = 1/6`

Vérification sans simplifier : `4 × 3 = 12` et `9 × 8 = 72`, soit `12/72`. En divisant les deux par `12` : `1/6`. Même résultat.
:::

::: retenir
Simplifier **avant** de multiplier donne exactement le même résultat, avec des nombres beaucoup plus petits. C'est toujours le bon réflexe.
:::

## 9. Diviser des fractions

::: definition Inverse
L'**inverse** d'une fraction, c'est cette fraction **retournée**.
L'inverse de `3/5` est `5/3`.
L'inverse de `4` est `1/4`, car `4` s'écrit `4/1`.
Zéro n'a pas d'inverse.
:::

::: formule-cle
Diviser par une fraction, c'est **multiplier par son inverse**.
`a/b ÷ c/d = a/b × d/c`
:::

::: exemple Une division de fractions
Calculer `3/4 ÷ 2/5`.

Je multiplie par l'inverse de `2/5`, c'est-à-dire par `5/2` :
`3/4 ÷ 2/5 = 3/4 × 5/2 = (3 × 5)/(4 × 2) = 15/8`

`3/4 ÷ 2/5 = 15/8`
:::

::: piege On retourne la deuxième fraction, pas la première
Dans `3/4 ÷ 2/5`, c'est `2/5` qui se retourne, parce que c'est par elle qu'on divise.
Retourner `3/4` donnerait `4/3 × 2/5 = 8/15`, qui est un autre nombre.
Le repère : **la fraction qui bouge est celle qui suit le signe de division**.
:::

::: pause
Fin de la deuxième séance. Les quatre opérations sur les fractions sont posées.
:::

## 10. Les priorités opératoires

Quand un calcul comporte plusieurs opérations, l'ordre dans lequel on les fait n'est pas libre.

::: formule L'ordre des opérations
1. Ce qui est entre **parenthèses**, en commençant par les plus intérieures.
2. Les **puissances**.
3. Les **multiplications** et les **divisions**, de gauche à droite.
4. Les **additions** et les **soustractions**, de gauche à droite.
:::

::: exemple Un calcul à plusieurs étages
Calculer `7 - 3 × (2 + 4)`.

Parenthèses d'abord : `2 + 4 = 6`.
Le calcul devient `7 - 3 × 6`.
Multiplication ensuite : `3 × 6 = 18`.
Le calcul devient `7 - 18`.
Soustraction pour finir : `7 - 18 = -11`.

`7 - 3 × (2 + 4) = -11`
:::

::: piege De gauche à droite, vraiment
`20 - 8 - 5` se lit de gauche à droite : `(20 - 8) - 5 = 12 - 5 = 7`.
Faire d'abord `8 - 5 = 3` puis `20 - 3 = 17` donne un résultat faux.
Même chose pour la division : `24 ÷ 6 ÷ 2 = (24 ÷ 6) ÷ 2 = 4 ÷ 2 = 2`, et non `24 ÷ 3 = 8`.
:::

## 11. Fractions et relatifs dans le même calcul

Les deux règles se combinent sans se gêner : le **signe** se traite comme pour les relatifs, les **numérateurs et dénominateurs** comme pour les fractions.

::: exemple Un produit de fractions négatives
Calculer `(-2/3) × (5/(-4))`.

Signe : deux signes différents dans chaque écriture. Comptons les `-` : il y en a **deux**, donc le résultat est **positif**.
Distances : `2 × 5 = 10` et `3 × 4 = 12`, soit `10/12`.
Je simplifie par `2` : `10 ÷ 2 = 5` et `12 ÷ 2 = 6`.

`(-2/3) × (5/(-4)) = 5/6`
:::

::: exemple Une somme de fractions de signes contraires
Calculer `-3/4 + 5/6`.

Dénominateur commun : `12`, car `12 = 4 × 3` et `12 = 6 × 2`.
`-3/4 = -9/12`
`5/6 = 10/12`

Les signes sont différents : je soustrais les distances, `10 - 9 = 1`, et je garde le signe du plus éloigné de zéro, `10/12`, qui est positif.

`-3/4 + 5/6 = 1/12`
:::

## 12. Les pièges à éviter

::: grille
| Piège | Ce qui est faux | Ce qui est juste |
|---|---|---|
| Additionner les dénominateurs | `1/2 + 1/3 = 2/5` | `1/2 + 1/3 = 5/6` |
| Appliquer la règle des signes à une addition | `(-3) + (-4) = +7` | `(-3) + (-4) = -7` |
| Retourner la mauvaise fraction | `3/4 ÷ 2/5 = 8/15` | `3/4 ÷ 2/5 = 15/8` |
| Oublier les priorités | `7 - 3 × 6 = 24` | `7 - 3 × 6 = -11` |
| Chercher un dénominateur commun pour multiplier | inutile et source d'erreurs | on multiplie directement |
| Ne pas simplifier le résultat | `14/12` | `7/6` |
:::

::: retenir
Trois phrases suffisent à retenir tout le chapitre.
**Soustraire, c'est ajouter l'opposé.**
**Diviser, c'est multiplier par l'inverse.**
**On n'additionne que des fractions de même dénominateur.**
:::

::: cocher
- Je sais additionner deux nombres relatifs de même signe
- Je sais additionner deux nombres relatifs de signes différents
- Je sais transformer une soustraction en addition
- Je connais la règle des signes pour un produit et pour un quotient
- Je sais simplifier une fraction
- Je sais mettre deux fractions au même dénominateur
- Je sais additionner et soustraire deux fractions
- Je sais multiplier deux fractions
- Je sais diviser deux fractions
- Je sais appliquer les priorités opératoires
:::
