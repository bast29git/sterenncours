---
type: cours
matiere: maths
lecon: L05
titre: Proportionnalité, pourcentages, vitesses
resume: Reconnaître une situation de proportionnalité, calculer une quatrième proportionnelle, appliquer et enchaîner des pourcentages, et traiter les grandeurs composées comme la vitesse et le débit.
duree: 3 séances de 45 min
competences:
  - Chercher
  - Modéliser
  - Calculer
  - Communiquer
objectifs:
  - Reconnaître une situation de proportionnalité
  - Calculer une quatrième proportionnelle par trois méthodes
  - Appliquer un pourcentage et calculer un pourcentage
  - Traiter des évolutions et des pourcentages successifs
  - Calculer une vitesse, une distance, une durée
  - Convertir des unités composées
---

::: plan
**Séance 1 : la proportionnalité**

1. Reconnaître une situation de proportionnalité
2. Le coefficient de proportionnalité
3. La quatrième proportionnelle
4. Représentation graphique

*🔁 Pause de 5 minutes*

**Séance 2 : les pourcentages**

5. Appliquer un pourcentage
6. Calculer un pourcentage
7. Augmenter et diminuer
8. Les pourcentages successifs

**Séance 3 : les grandeurs composées**

9. La vitesse
10. Les conversions
11. Débit et consommation
12. Les pièges à éviter
:::

::: materiel
- Une calculatrice
- Une feuille quadrillée pour les tableaux
- Une règle pour le graphique
:::

## 1. Reconnaître une situation de proportionnalité

::: definition Proportionnalité
Deux grandeurs sont **proportionnelles** si l'on passe de l'une à l'autre en multipliant **toujours par le même nombre**.
Ce nombre s'appelle le **coefficient de proportionnalité**.
:::

::: methode Tester la proportionnalité
::: etapes
1. Je dresse un **tableau** avec les deux grandeurs.
2. Je calcule le **quotient** de la deuxième par la première, pour chaque colonne.
3. Si tous les quotients sont **égaux**, il y a proportionnalité.
4. S'il y en a un seul de différent, il n'y a **pas** proportionnalité.
:::
:::

::: exemple Un cas de proportionnalité
| Nombre de croissants | 2 | 5 | 8 |
|---|---|---|---|
| Prix en euros | 2,40 | 6,00 | 9,60 |

`2,40 ÷ 2 = 1,20`. `6,00 ÷ 5 = 1,20`. `9,60 ÷ 8 = 1,20`.
Tous les quotients valent `1,20` : les deux grandeurs sont **proportionnelles**, et le coefficient est `1,20 €` par croissant.
:::

::: exemple Un cas de non-proportionnalité
| Âge en années | 5 | 10 | 20 |
|---|---|---|---|
| Taille en cm | 110 | 140 | 172 |

`110 ÷ 5 = 22`. `140 ÷ 10 = 14`. `172 ÷ 20 = 8,6`.
Les quotients sont différents : la taille **n'est pas proportionnelle** à l'âge. Cela se comprend : on ne grandit pas au même rythme à tout âge.
:::

::: piege Les situations qui ne sont jamais proportionnelles
Un abonnement avec une part fixe : `20 €` d'abonnement plus `0,50 €` par unité. Doubler le nombre d'unités ne double pas la facture.
L'aire d'un carré en fonction de son côté : doubler le côté multiplie l'aire par quatre.
La taille en fonction de l'âge, le temps de cuisson en fonction du poids d'un rôti au-delà d'une certaine taille.
:::

## 2. Le coefficient de proportionnalité

::: formule La définition
Si `y` est proportionnel à `x`, alors `y = k × x`, où `k` est le coefficient de proportionnalité.
On le calcule par `k = y ÷ x`.
:::

::: exemple Deux coefficients inverses
Un tissu coûte `12 €` le mètre.
Coefficient prix par mètre : `12`. Pour trouver le prix, on **multiplie** la longueur par `12`.
Coefficient mètre par euro : `1 ÷ 12 ≈ 0,083`. Pour trouver la longueur, on **divise** le prix par `12`.

Les deux coefficients sont **inverses** l'un de l'autre. Il faut savoir dans quel sens on travaille avant de multiplier.
:::

::: retenir
Le coefficient a une **unité** : euros par mètre, kilomètres par heure, grammes par centimètre cube.
Cette unité dit dans quel sens le coefficient s'emploie. C'est le meilleur contrôle contre les erreurs.
:::

## 3. La quatrième proportionnelle

::: definition Quatrième proportionnelle
Dans un tableau de proportionnalité où trois valeurs sont connues, la **quatrième proportionnelle** est la valeur manquante.
:::

::: methode Trois méthodes au choix
::: etapes
1. **Le coefficient** : je calcule `k`, puis je multiplie ou je divise.
2. **Le produit en croix** : si le tableau est `a` et `b` sur une ligne, `c` et `x` sur l'autre, alors `x = (b × c) ÷ a`.
3. **Le passage à l'unité** : je calcule la valeur pour `1`, puis je multiplie.
:::
:::

::: exemple Le même problème par trois méthodes
« 5 cahiers coûtent 7,50 €. Combien coûtent 8 cahiers ? »

**Par le coefficient.** `k = 7,50 ÷ 5 = 1,50 €` par cahier. Donc `8 × 1,50 = 12 €`.

**Par le produit en croix.**
| Cahiers | 5 | 8 |
|---|---|---|
| Prix | 7,50 | `x` |

`x = (7,50 × 8) ÷ 5 = 60 ÷ 5 = 12 €`.

**Par le passage à l'unité.** Un cahier coûte `7,50 ÷ 5 = 1,50 €`. Huit cahiers coûtent `8 × 1,50 = 12 €`.

Les trois donnent `12 €`. On choisit celle avec laquelle on se trompe le moins.
:::

::: piege Le produit en croix mal orienté
Dans un produit en croix, on multiplie les valeurs en **diagonale**, puis on divise par la troisième.
L'erreur classique consiste à multiplier deux valeurs de la même ligne. Un contrôle simple : le résultat doit être **cohérent**. Si 8 cahiers coûtent moins que 5, il y a une erreur.
:::

## 4. Représentation graphique

::: retenir La propriété graphique
Une situation de proportionnalité se représente par des points **alignés** avec l'**origine** du repère.
Si les points sont alignés mais que la droite ne passe pas par l'origine, il n'y a **pas** proportionnalité.
:::

<figure class="schema">
<svg width="420" height="220" viewBox="0 0 420 220" role="img" aria-label="Deux graphiques : à gauche une droite passant par l'origine, cas de proportionnalité ; à droite une droite qui coupe l'axe des ordonnées au-dessus de zéro, cas de non-proportionnalité.">
  <line class="repere" x1="30" y1="180" x2="180" y2="180"/>
  <line class="repere" x1="30" y1="180" x2="30" y2="40"/>
  <line class="trait" x1="30" y1="180" x2="170" y2="55"/>
  <circle class="plein" cx="65" cy="149" r="4"/><circle class="plein" cx="100" cy="118" r="4"/><circle class="plein" cx="135" cy="86" r="4"/>
  <text class="legende" x="105" y="205" text-anchor="middle">proportionnalité</text>
  <text class="legende" x="105" y="30" text-anchor="middle">passe par l'origine</text>
  <line class="repere" x1="240" y1="180" x2="390" y2="180"/>
  <line class="repere" x1="240" y1="180" x2="240" y2="40"/>
  <line class="trait" x1="240" y1="140" x2="380" y2="60"/>
  <circle class="plein" cx="275" cy="120" r="4"/><circle class="plein" cx="310" cy="100" r="4"/><circle class="plein" cx="345" cy="80" r="4"/>
  <circle class="creux" cx="240" cy="140" r="5"/>
  <text class="legende" x="315" y="205" text-anchor="middle">pas de proportionnalité</text>
  <text class="legende" x="315" y="30" text-anchor="middle">ne passe pas par l'origine</text>
</svg>
<figcaption>À gauche, les points sont alignés avec l'origine : il y a proportionnalité. À droite, ils sont alignés mais la droite coupe l'axe vertical au-dessus de zéro : c'est le cas d'un abonnement avec une part fixe.</figcaption>
</figure>

::: exemple Lire un graphique
Sur un graphique de proportionnalité, le coefficient se lit directement : c'est la valeur de `y` quand `x = 1`.
Si la droite passe par le point de coordonnées `(1 ; 2,5)`, alors `k = 2,5`.
:::

::: pause
Fin de la première séance. La proportionnalité est posée.
:::

## 5. Appliquer un pourcentage

::: formule La règle
Prendre `p %` d'un nombre, c'est le multiplier par `p ÷ 100`.

`25 %` de `80` = `80 × 25 ÷ 100 = 20`.
:::

::: grille
| Pourcentage | Multiplier par | Raccourci |
|---|---|---|
| `10 %` | `0,1` | diviser par 10 |
| `25 %` | `0,25` | diviser par 4 |
| `50 %` | `0,5` | diviser par 2 |
| `75 %` | `0,75` | trois quarts |
| `20 %` | `0,2` | diviser par 5 |
:::

::: exemple Trois applications
`15 %` de `240` = `240 × 0,15 = 36`.
`8 %` de `1 500` = `1 500 × 0,08 = 120`.
`120 %` de `50` = `50 × 1,2 = 60`. Un pourcentage peut dépasser 100.
:::

::: retenir Un pourcentage est une proportionnalité
`p %` est un coefficient de proportionnalité écrit autrement : `p %` signifie `p` pour `100`.
Tout ce qui vaut pour la proportionnalité vaut donc pour les pourcentages.
:::

## 6. Calculer un pourcentage

::: formule La règle
Pour savoir quel pourcentage une partie représente d'un total :

`pourcentage = (partie ÷ total) × 100`
:::

::: exemple Deux calculs
Sur `25` élèves, `15` font de l'espagnol. Quel pourcentage ?
`(15 ÷ 25) × 100 = 0,6 × 100 = 60 %`.

Une ville de `40 000` habitants en compte `3 200` de moins de 10 ans.
`(3 200 ÷ 40 000) × 100 = 8 %`.
:::

::: piege Ne pas confondre les deux questions
« Combien font 20 % de 60 ? » demande d'**appliquer** un pourcentage : on multiplie.
« 12 représente quel pourcentage de 60 ? » demande de **calculer** un pourcentage : on divise puis on multiplie par 100.
Lire lentement la question avant de choisir l'opération évite la moitié des erreurs.
:::

## 7. Augmenter et diminuer

::: formule Les coefficients multiplicateurs
Augmenter de `p %` revient à multiplier par `1 + p ÷ 100`.
Diminuer de `p %` revient à multiplier par `1 − p ÷ 100`.
:::

::: grille
| Évolution | Coefficient multiplicateur |
|---|---|
| `+ 10 %` | `1,10` |
| `+ 25 %` | `1,25` |
| `+ 100 %` | `2` |
| `− 10 %` | `0,90` |
| `− 25 %` | `0,75` |
| `− 50 %` | `0,5` |
:::

::: exemple Une remise
Un article coûte `80 €`. Il subit une remise de `30 %`.
`80 × 0,70 = 56 €`.

On peut aussi calculer la remise puis la soustraire : `80 × 0,30 = 24`, puis `80 − 24 = 56 €`.
La première méthode est plus rapide et fait moins d'étapes, donc moins d'erreurs.
:::

::: exemple Retrouver le prix initial
Après une hausse de `20 %`, un article coûte `90 €`. Quel était son prix avant ?
On ne soustrait pas `20 %` de `90`. Il faut **diviser** par le coefficient :
`90 ÷ 1,20 = 75 €`.

Vérification : `75 × 1,20 = 90`. Correct.
:::

::: piege L'erreur du retour en arrière
Après une hausse de `20 %`, il ne faut **pas** appliquer une baisse de `20 %` pour revenir au point de départ.
`100 × 1,20 = 120`, puis `120 × 0,80 = 96`, et non `100`.
Pour annuler une hausse de `20 %`, il faut **diviser** par `1,20`, ce qui correspond à une baisse d'environ `16,7 %`.
:::

## 8. Les pourcentages successifs

::: formule La règle
Pour enchaîner deux évolutions, on **multiplie** les coefficients.
On ne les additionne jamais.
:::

::: exemple Deux hausses
Un prix augmente de `10 %` puis de `20 %`.
Coefficient global : `1,10 × 1,20 = 1,32`, soit une hausse de **32 %**, et non de 30 %.

Vérification sur `100 €` : `100 × 1,10 = 110`, puis `110 × 1,20 = 132`.
:::

::: exemple Une hausse puis une baisse
Un prix augmente de `50 %` puis baisse de `50 %`.
Coefficient global : `1,50 × 0,50 = 0,75`, soit une **baisse de 25 %**.

Vérification sur `100 €` : `100 × 1,50 = 150`, puis `150 × 0,50 = 75`.
Le prix final est inférieur au prix de départ, alors que les deux pourcentages semblaient se compenser.
:::

::: piege Le piège le plus classique du chapitre
`+ 10 %` suivi de `− 10 %` ne ramène **pas** au point de départ.
`1,10 × 0,90 = 0,99`, soit une baisse de `1 %`.
La raison est que les deux pourcentages ne portent pas sur le même nombre : le second porte sur un nombre déjà augmenté.
:::

::: pause
Fin de la deuxième séance. Les pourcentages sont posés.
:::

## 9. La vitesse

::: definition Vitesse moyenne
La **vitesse moyenne** est le quotient de la distance parcourue par la durée du parcours.
:::

::: formule Les trois formules
`v = d ÷ t`
`d = v × t`
`t = d ÷ v`

Une seule est à retenir : les deux autres s'en déduisent.
:::

::: exemple Trois calculs
Un train parcourt `450 km` en `3 h`. `v = 450 ÷ 3 = 150 km/h`.
Une voiture roule à `90 km/h` pendant `2,5 h`. `d = 90 × 2,5 = 225 km`.
Un cycliste parcourt `60 km` à `20 km/h`. `t = 60 ÷ 20 = 3 h`.
:::

::: piege La durée en heures décimales
`2 h 30` ne s'écrit **pas** `2,30` dans un calcul, mais `2,5`, car `30 min` valent une **demi-heure**.
`1 h 15` s'écrit `1,25`. `3 h 45` s'écrit `3,75`.
Pour convertir, on divise les minutes par `60` : `45 ÷ 60 = 0,75`.
:::

::: exemple Une durée à retransformer
Un trajet dure `2,25 h`. Combien est-ce en heures et minutes ?
La partie entière donne `2 h`. La partie décimale `0,25` correspond à `0,25 × 60 = 15 min`.
Le trajet dure donc `2 h 15`.
:::

## 10. Les conversions

::: formule Vitesse
`1 m/s = 3,6 km/h`
Pour passer de `m/s` à `km/h`, on **multiplie par 3,6**.
Pour passer de `km/h` à `m/s`, on **divise par 3,6**.
:::

::: exemple Quatre conversions utiles
`10 m/s = 36 km/h`
`100 km/h ≈ 27,8 m/s`
`5 m/s = 18 km/h`, la vitesse d'un bon coureur
`1 000 km/h`, un avion de ligne, soit environ `278 m/s`
:::

::: info D'où vient le 3,6
En une seconde, on parcourt `1 m`. En une heure, soit `3 600` secondes, on parcourt donc `3 600 m`, c'est-à-dire `3,6 km`.
Le facteur n'est pas arbitraire : il vient du nombre de secondes dans une heure divisé par le nombre de mètres dans un kilomètre.
:::

::: piege La vitesse moyenne n'est pas la moyenne des vitesses
Un trajet se fait à `60 km/h` à l'aller et à `40 km/h` au retour. La vitesse moyenne n'est **pas** `50 km/h`.
Il faut calculer la distance totale et la durée totale, puis diviser. On passe plus de temps à la vitesse la plus lente, donc la vitesse moyenne est inférieure à `50 km/h`.
:::

## 11. Débit et consommation

::: definition Grandeur composée
Une **grandeur composée** est le quotient de deux grandeurs. Son unité comporte donc deux unités séparées par « par ».
:::

::: grille
| Grandeur | Formule | Unité |
|---|---|---|
| **Vitesse** | distance ÷ durée | `km/h`, `m/s` |
| **Débit** | volume ÷ durée | `L/min`, `m³/s` |
| **Consommation** | volume ÷ distance | `L/100 km` |
| **Masse volumique** | masse ÷ volume | `g/cm³` |
| **Prix unitaire** | prix ÷ quantité | `€/kg` |
| **Rendement** | production ÷ surface | `t/ha` |
:::

::: exemple Un débit
Un robinet remplit une baignoire de `160 L` en `8 min`.
`débit = 160 ÷ 8 = 20 L/min`.
Combien de temps pour remplir `240 L` ? `t = 240 ÷ 20 = 12 min`.
:::

::: exemple Une consommation
Une voiture consomme `6,5 L` aux `100 km`. Quelle quantité pour `350 km` ?
`6,5 × 3,5 = 22,75 L`.
On raisonne par proportionnalité : `350 km` représente `3,5` fois `100 km`.
:::

::: retenir Toutes ces grandeurs fonctionnent pareil
Une grandeur composée obéit exactement à la même logique que la vitesse : trois formules, une seule à retenir, les deux autres déduites.
Le contrôle est toujours le même : **l'unité du résultat doit être cohérente**.
:::

## 12. Les pièges à éviter

::: grille
| Piège | Ce qui est faux | Ce qui est juste |
|---|---|---|
| Proportionnalité | tout tableau est proportionnel | il faut **tester les quotients** |
| Graphique | des points alignés suffisent | la droite doit passer par l'**origine** |
| Pourcentage | appliquer et calculer, c'est pareil | l'un **multiplie**, l'autre **divise** |
| Retour en arrière | `+20 %` puis `−20 %` ramène au départ | cela donne `−4 %` |
| Successifs | on additionne les pourcentages | on **multiplie les coefficients** |
| Prix initial | on soustrait le pourcentage | on **divise** par le coefficient |
| Durée | `2 h 30` s'écrit `2,30` | il s'écrit `2,5` |
| Vitesse moyenne | c'est la moyenne des vitesses | c'est distance totale ÷ durée totale |
:::

::: retenir
Trois phrases suffisent à retenir le chapitre.
**Il y a proportionnalité si tous les quotients sont égaux.**
**Les pourcentages successifs se multiplient, jamais ne s'additionnent.**
**Une grandeur composée se traite avec trois formules dont une seule est à apprendre.**
:::

::: cocher
- Je sais tester la proportionnalité d'un tableau
- Je connais trois méthodes pour la quatrième proportionnelle
- Je sais reconnaître une proportionnalité sur un graphique
- Je sais appliquer un pourcentage et calculer un pourcentage
- Je connais les coefficients multiplicateurs de hausse et de baisse
- Je sais retrouver un prix initial après une évolution
- Je sais enchaîner deux pourcentages sans les additionner
- Je sais calculer une vitesse, une distance et une durée
- Je sais convertir des heures décimales et des unités composées
:::
