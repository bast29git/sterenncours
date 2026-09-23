---
type: cours
matiere: maths
lecon: L03
titre: Calcul littéral : développer, réduire, factoriser
resume: À quoi sert une lettre en mathématiques, comment réduire une expression, comment développer avec la distributivité simple et double, et comment factoriser en repérant le facteur commun.
duree: 3 séances de 45 min
competences:
  - Chercher
  - Calculer
  - Raisonner
  - Représenter
objectifs:
  - Comprendre ce que représente une lettre dans une expression
  - Réduire une expression littérale
  - Développer avec la distributivité simple
  - Développer avec la double distributivité
  - Factoriser en repérant un facteur commun
  - Tester une égalité pour une valeur donnée
---

::: plan
**Séance 1 : les bases du calcul littéral**

1. À quoi sert une lettre
2. Les conventions d'écriture
3. Réduire une expression
4. Substituer une valeur

*🔁 Pause de 5 minutes*

**Séance 2 : développer**

5. La distributivité simple
6. Le piège du signe moins
7. La double distributivité
8. Développer et réduire

**Séance 3 : factoriser**

9. Ce qu'est factoriser
10. Repérer le facteur commun
11. Vérifier son travail
12. Les pièges à éviter
:::

::: materiel
- Une feuille de brouillon quadrillée
- Deux crayons de couleur pour marquer les flèches de distributivité
- Une calculatrice, uniquement pour les vérifications finales
:::

## 1. À quoi sert une lettre

::: definition Expression littérale
Une **expression littérale** est une expression de calcul qui contient une ou plusieurs **lettres**.
Chaque lettre représente un nombre qu'on ne connaît pas encore, ou un nombre qui peut varier.
:::

::: exemple Trois usages différents de la lettre
`P = 4 × c` : le périmètre d'un carré, pour **n'importe quel** côté `c`. La lettre exprime une règle générale.
`2x + 3 = 11` : ici `x` désigne **un nombre précis** qu'il faut trouver. C'est une équation.
`a + b = b + a` : ici les lettres servent à énoncer une **propriété toujours vraie**.
:::

::: retenir
Une lettre, c'est un nombre dont on ne dit pas encore la valeur.
Toutes les règles de calcul des nombres continuent donc de s'appliquer.
:::

::: info Pourquoi c'est utile
Sans lettres, il faudrait réécrire un calcul pour chaque cas particulier. Avec une lettre, on écrit une formule **une seule fois** et elle marche pour tous les nombres.
C'est ce qui permet d'écrire les formules de périmètre, d'aire, de vitesse ou de pourcentage sous une forme unique.
:::

## 2. Les conventions d'écriture

::: formule Les quatre règles d'écriture
1. On **supprime** le signe `×` devant une lettre ou une parenthèse : `3 × a` s'écrit `3a`.
2. Le **nombre s'écrit avant** la lettre : on écrit `3a`, jamais `a3`.
3. `1 × a` s'écrit **`a`**, et `−1 × a` s'écrit **`−a`**.
4. `a × a` s'écrit **`a²`**.
:::

::: grille
| Écriture longue | Écriture simplifiée |
|---|---|
| `5 × x` | `5x` |
| `x × y` | `xy` |
| `1 × y` | `y` |
| `−1 × b` | `−b` |
| `3 × (x + 2)` | `3(x + 2)` |
| `x × x` | `x²` |
| `2 × x × x` | `2x²` |
:::

::: piege On ne supprime jamais le signe entre deux nombres
`3 × 5` ne s'écrit pas `35`, qui est un autre nombre.
La suppression du signe `×` n'est autorisée que **devant une lettre ou une parenthèse**.
:::

## 3. Réduire une expression

::: definition Réduire
**Réduire** une expression, c'est l'écrire avec le **moins de termes possible**, en regroupant ceux qui se ressemblent.
:::

::: definition Termes semblables
Deux termes sont **semblables** s'ils ont exactement la **même partie littérale**.
`3x` et `5x` sont semblables. `3x` et `3x²` ne le sont pas. `3x` et `3y` non plus.
:::

::: formule La règle
On additionne les **nombres devant** les termes semblables, et on **garde** la partie littérale.
`3x + 5x = 8x`
:::

::: exemple Réduire pas à pas
Réduire `4x + 3 + 2x − 7`.

Je regroupe les termes en `x` : `4x + 2x = 6x`.
Je regroupe les nombres seuls : `3 − 7 = −4`.
Résultat : **`6x − 4`**.
:::

::: piege On n'additionne que ce qui se ressemble
`3x + 2` ne fait pas `5x`, ni `5`. Ces deux termes ne sont pas semblables : on ne peut pas les regrouper.
L'expression `3x + 2` est déjà réduite. C'est une réponse complète, même si elle paraît courte.
:::

::: exemple Un cas avec des carrés
Réduire `2x² + 5x − x² + 3x`.

Termes en `x²` : `2x² − x² = x²`. Attention : `x²` seul veut dire `1x²`.
Termes en `x` : `5x + 3x = 8x`.
Résultat : **`x² + 8x`**.
:::

## 4. Substituer une valeur

::: definition Substituer
**Substituer**, c'est remplacer chaque lettre par une valeur donnée, puis effectuer le calcul.
:::

::: methode Substituer sans se tromper
::: etapes
1. Je **réécris** l'expression en remplaçant chaque lettre par la valeur **entre parenthèses**.
2. Je calcule les **puissances** en premier.
3. Je calcule les **multiplications et divisions**.
4. Je calcule les **additions et soustractions**.
:::
:::

::: exemple Calculer pour x = 3
Calculer `2x² + 5x − 1` pour `x = 3`.

`2 × (3)² + 5 × (3) − 1`
`= 2 × 9 + 15 − 1`
`= 18 + 15 − 1`
`= 32`
:::

::: exemple Calculer pour une valeur négative
Calculer `x² − 3x` pour `x = −2`.

`(−2)² − 3 × (−2)`
`= 4 − (−6)`
`= 4 + 6`
`= 10`

Les parenthèses sont indispensables : `(−2)² = 4`, alors que `−2²` vaudrait `−4`.
:::

::: piege Le carré d'un nombre négatif
`(−2)²` vaut **`4`** : on met le nombre `−2` au carré.
`−2²` vaut **`−4`** : on met `2` au carré, puis on prend l'opposé.
Écrire les parenthèses lors de la substitution évite complètement ce piège.
:::

::: pause
Fin de la première séance. Les conventions, la réduction et la substitution sont posées.
:::

## 5. La distributivité simple

::: formule La règle
Pour tous les nombres `k`, `a` et `b` :
`k(a + b) = ka + kb`
`k(a − b) = ka − kb`

On multiplie le facteur de devant par **chaque terme** de la parenthèse.
:::

<figure class="schema">
<svg width="420" height="150" viewBox="0 0 420 150" role="img" aria-label="Schéma de la distributivité simple : le facteur k est relié par deux flèches au terme a et au terme b de la parenthèse.">
  <text x="60" y="80" font-size="22" text-anchor="middle">k</text>
  <text x="140" y="80" font-size="22" text-anchor="middle">(</text>
  <text x="180" y="80" font-size="22" text-anchor="middle">a</text>
  <text x="222" y="80" font-size="22" text-anchor="middle">+</text>
  <text x="264" y="80" font-size="22" text-anchor="middle">b</text>
  <text x="304" y="80" font-size="22" text-anchor="middle">)</text>
  <path class="fleche" d="M 62 60 Q 120 20 178 60"/>
  <polygon class="pointe" points="178,60 168,50 176,46"/>
  <path class="fleche" d="M 62 96 Q 165 140 262 96"/>
  <polygon class="pointe" points="262,96 252,104 260,108"/>
  <text class="legende" x="210" y="20" text-anchor="middle">k × a</text>
  <text class="legende" x="330" y="120" text-anchor="start">k × b</text>
</svg>
<figcaption>Deux flèches, deux produits. Le facteur placé devant la parenthèse multiplie chacun des termes qu'elle contient, sans exception.</figcaption>
</figure>

::: exemple Trois développements simples
`3(x + 4) = 3 × x + 3 × 4 = 3x + 12`

`5(2x − 7) = 5 × 2x − 5 × 7 = 10x − 35`

`x(x + 3) = x × x + x × 3 = x² + 3x`
:::

::: piege On n'oublie aucun terme
`3(x + 4)` ne fait pas `3x + 4`. Le `3` doit multiplier **les deux** termes.
Le réflexe : tracer les deux flèches au crayon avant de calculer.
:::

## 6. Le piège du signe moins

::: formule Le facteur négatif
Quand le facteur devant la parenthèse est **négatif**, il change le signe de **chaque** terme.
`−k(a + b) = −ka − kb`
`−k(a − b) = −ka + kb`
:::

::: exemple Développer avec un moins
`−2(x + 5) = −2 × x + (−2) × 5 = −2x − 10`

`−3(2x − 4) = −3 × 2x − (−3) × 4 = −6x + 12`
:::

::: exemple Le cas de la parenthèse précédée d'un moins seul
`7 − (x + 2)`

Le signe moins devant la parenthèse équivaut à `−1 ×`.
`7 − 1 × (x + 2) = 7 − x − 2 = 5 − x`
:::

::: piege La faute la plus fréquente de toute la leçon
`7 − (x + 2)` ne fait pas `7 − x + 2`.
Le moins s'applique à **toute** la parenthèse, donc aussi au `+2`, qui devient `−2`.
Quand une parenthèse est précédée d'un moins, **tous** les signes à l'intérieur changent.
:::

::: aide Comment vérifier en dix secondes
Prends une valeur au hasard, par exemple `x = 1`.
Expression de départ : `7 − (1 + 2) = 7 − 3 = 4`.
Ta réponse `5 − x` donne `5 − 1 = 4`. Les deux résultats concordent : le développement est probablement juste.
La réponse fausse `7 − x + 2` donnerait `7 − 1 + 2 = 8`, ce qui ne correspond pas.
:::

## 7. La double distributivité

::: formule La règle
Pour tous les nombres `a`, `b`, `c` et `d` :
`(a + b)(c + d) = ac + ad + bc + bd`

Chaque terme de la première parenthèse multiplie chaque terme de la seconde. Il y a donc toujours **quatre produits**.
:::

::: methode Développer un double produit
::: etapes
1. Je multiplie le **premier terme** de la première parenthèse par le **premier** de la seconde.
2. Puis par le **second** de la seconde.
3. Je multiplie le **second terme** de la première parenthèse par le **premier** de la seconde.
4. Puis par le **second** de la seconde.
5. J'obtiens **quatre produits**, je les écris tous, puis je réduis.
:::
:::

::: exemple Développer (x + 2)(x + 5)
`(x + 2)(x + 5)`
`= x × x + x × 5 + 2 × x + 2 × 5`
`= x² + 5x + 2x + 10`
`= x² + 7x + 10`
:::

::: exemple Un cas avec des signes moins
`(x − 3)(x + 4)`
`= x × x + x × 4 − 3 × x − 3 × 4`
`= x² + 4x − 3x − 12`
`= x² + x − 12`
:::

::: exemple Un cas avec deux coefficients
`(2x + 1)(3x − 5)`
`= 2x × 3x − 2x × 5 + 1 × 3x − 1 × 5`
`= 6x² − 10x + 3x − 5`
`= 6x² − 7x − 5`
:::

::: piege Quatre produits, pas deux
`(x + 2)(x + 5)` ne fait pas `x² + 10`.
Multiplier les premiers termes entre eux et les seconds entre eux laisse tomber deux produits sur quatre.
Le contrôle : compter les produits avant de réduire. Il doit y en avoir **exactement quatre**.
:::

## 8. Développer et réduire

::: exemple Une expression à deux développements
Développer et réduire `3(x + 2) + 4(x − 1)`.

`3(x + 2) = 3x + 6`
`4(x − 1) = 4x − 4`
Somme : `3x + 6 + 4x − 4 = 7x + 2`
:::

::: exemple Avec une soustraction entre les deux
Développer et réduire `5(x + 3) − 2(x − 4)`.

`5(x + 3) = 5x + 15`
`−2(x − 4) = −2x + 8`
Somme : `5x + 15 − 2x + 8 = 3x + 23`

Le point délicat est le `−2(x − 4)`, qui donne `+8` et non `−8`.
:::

::: retenir L'ordre de travail
1. Je **développe** chaque parenthèse séparément, en surveillant les signes.
2. Je **recopie** tous les termes obtenus.
3. Je **réduis** en regroupant les termes semblables.
On ne développe pas et on ne réduit pas en même temps : c'est ainsi qu'on perd des termes.
:::

::: pause
Fin de la deuxième séance. La distributivité simple et double est posée.
:::

## 9. Ce qu'est factoriser

::: definition Factoriser
**Factoriser**, c'est transformer une **somme** en **produit**.
C'est l'opération inverse du développement.
:::

::: grille
| Sens | Point de départ | Résultat |
|---|---|---|
| **Développer** | un produit : `3(x + 4)` | une somme : `3x + 12` |
| **Factoriser** | une somme : `3x + 12` | un produit : `3(x + 4)` |
:::

::: formule La règle
`ka + kb = k(a + b)`

On repère le **facteur commun** `k`, on l'écrit devant, et on place dans la parenthèse ce qui reste.
:::

::: info Pourquoi factoriser
Un produit est bien plus facile à étudier qu'une somme. En particulier, un produit est nul si et seulement si l'un de ses facteurs est nul : c'est ce qui permettra, en 3ᵉ, de résoudre des équations qu'on ne sait pas résoudre autrement.
:::

## 10. Repérer le facteur commun

::: methode Factoriser en trois gestes
::: etapes
1. Je repère ce qui est **présent dans tous les termes** : un nombre, une lettre, ou les deux.
2. J'écris ce **facteur commun** devant une parenthèse.
3. Dans la parenthèse, j'écris **ce qui reste** de chaque terme, avec son signe.
4. Je **vérifie** en développant : je dois retrouver l'expression de départ.
:::
:::

::: exemple Facteur commun numérique
`6x + 15`

`6 = 3 × 2` et `15 = 3 × 5`. Le facteur commun est `3`.
`6x + 15 = 3 × 2x + 3 × 5 = 3(2x + 5)`

Vérification : `3(2x + 5) = 6x + 15`. Correct.
:::

::: exemple Facteur commun littéral
`x² + 7x`

`x² = x × x` et `7x = x × 7`. Le facteur commun est `x`.
`x² + 7x = x(x + 7)`

Vérification : `x(x + 7) = x² + 7x`. Correct.
:::

::: exemple Facteur commun mixte
`4x² − 6x`

Pour les nombres : `4` et `6` ont `2` en commun.
Pour les lettres : `x²` et `x` ont `x` en commun.
Le facteur commun est donc `2x`.
`4x² − 6x = 2x × 2x − 2x × 3 = 2x(2x − 3)`

Vérification : `2x(2x − 3) = 4x² − 6x`. Correct.
:::

::: exemple Facteur commun sous forme de parenthèse
`(x + 1)(x + 5) + (x + 1)(2x − 3)`

Le facteur commun est le groupe `(x + 1)` tout entier.
`= (x + 1)[(x + 5) + (2x − 3)]`
`= (x + 1)(x + 5 + 2x − 3)`
`= (x + 1)(3x + 2)`
:::

::: piege Le terme qui disparaît
`5x + 5` se factorise en `5(x + 1)`, et non en `5(x)`.
Quand un terme est **égal** au facteur commun, ce qui reste vaut `1`, et non rien du tout.
Même piège avec `x² + x = x(x + 1)`.
:::

## 11. Vérifier son travail

::: retenir Trois vérifications utiles
**Après un développement** : je compte les termes obtenus. Distributivité simple, deux produits. Double distributivité, quatre produits.
**Après une factorisation** : je redéveloppe. Je dois retrouver exactement l'expression de départ.
**Dans tous les cas** : je teste avec une valeur, par exemple `x = 2`. Les deux expressions doivent donner le même nombre.
:::

::: exemple Le test numérique à l'œuvre
Je prétends que `(x + 3)(x − 1) = x² + 2x − 3`.

Pour `x = 2` :
Membre de gauche : `(2 + 3)(2 − 1) = 5 × 1 = 5`.
Membre de droite : `2² + 2 × 2 − 3 = 4 + 4 − 3 = 5`.
Les deux valeurs coïncident : le développement est très probablement correct.
:::

::: piege Le test ne prouve pas, il détecte
Si les deux valeurs sont **différentes**, il y a une erreur : c'est certain.
Si elles sont **égales**, il est très probable que ce soit juste, mais ce n'est pas une démonstration. Un test avec `x = 0` ou `x = 1` peut masquer une erreur.
On choisit donc plutôt `x = 2` ou `x = 3`.
:::

## 12. Les pièges à éviter

::: grille
| Piège | Ce qui est faux | Ce qui est juste |
|---|---|---|
| Réduction | `3x + 2 = 5x` | `3x + 2` est **déjà réduit** |
| Distributivité oubliée | `3(x + 4) = 3x + 4` | `3(x + 4) = 3x + 12` |
| Moins devant la parenthèse | `7 − (x + 2) = 7 − x + 2` | `= 7 − x − 2 = 5 − x` |
| Double produit | `(x + 2)(x + 5) = x² + 10` | quatre produits : `x² + 7x + 10` |
| Carré d'un négatif | `(−2)² = −4` | `(−2)² = 4` |
| Factorisation incomplète | `5x + 5 = 5(x)` | `5x + 5 = 5(x + 1)` |
| Écriture | `a3` | `3a` |
| Signe entre deux nombres | `3 × 5 = 35` | on **garde** le `×` entre deux nombres |
:::

::: retenir
Trois phrases suffisent à retenir le chapitre.
**Développer, c'est passer d'un produit à une somme ; factoriser, c'est l'inverse.**
**Un moins devant une parenthèse change tous les signes à l'intérieur.**
**Une factorisation se vérifie toujours en redéveloppant.**
:::

::: cocher
- Je sais écrire une expression littérale avec les bonnes conventions
- Je sais réduire une expression en regroupant les termes semblables
- Je sais substituer une valeur, y compris négative, avec les parenthèses
- Je sais développer avec la distributivité simple
- Je sais traiter un facteur négatif et un moins devant une parenthèse
- Je sais développer un double produit en écrivant les quatre produits
- Je sais développer puis réduire une expression à deux parenthèses
- Je sais repérer un facteur commun numérique, littéral ou mixte
- Je sais vérifier une factorisation en redéveloppant
:::
