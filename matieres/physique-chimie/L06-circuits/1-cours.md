---
type: cours
matiere: physique-chimie
lecon: L06
titre: Circuits électriques
resume: Le circuit électrique : ses constituants et son schéma normalisé, les montages en série et en dérivation, l'intensité et la tension avec leurs lois, la loi d'Ohm, la puissance et l'énergie, et les règles de sécurité domestique.
duree: 3 séances de 45 min
competences:
  - Pratiquer des démarches scientifiques
  - Concevoir et réaliser une expérience
  - Pratiquer des langages
  - Adopter un comportement responsable
objectifs:
  - Schématiser un circuit avec les symboles normalisés
  - Distinguer un montage en série et un montage en dérivation
  - Mesurer et calculer une intensité avec les lois des nœuds
  - Mesurer et calculer une tension avec la loi des mailles
  - Employer la loi d'Ohm
  - Expliquer les dispositifs de sécurité d'une installation domestique
---

::: plan
**Séance 1 : le circuit et ses montages**

1. Les constituants d'un circuit
2. Le schéma normalisé
3. Le montage en série
4. Le montage en dérivation

*🔁 Pause de 5 minutes*

**Séance 2 : intensité et tension**

5. L'intensité du courant
6. Les lois de l'intensité
7. La tension
8. Les lois de la tension

**Séance 3 : loi d'Ohm et sécurité**

9. La loi d'Ohm
10. Puissance et énergie
11. La sécurité domestique
12. Les pièges à éviter
:::

::: materiel
- Une pile plate ou un générateur
- Deux lampes, des fils, un interrupteur
- Un multimètre
- Une règle pour les schémas
:::

## 1. Les constituants d'un circuit

::: definition Circuit électrique
Un **circuit électrique** est une **boucle fermée** de matériaux conducteurs reliant les deux bornes d'un générateur.
Si la boucle est ouverte quelque part, aucun courant ne circule.
:::

::: grille
| Constituant | Rôle |
|---|---|
| **Générateur** | fournit l'énergie électrique : pile, batterie, alternateur |
| **Récepteur** | convertit cette énergie : lampe, moteur, résistance |
| **Fils de connexion** | transportent le courant |
| **Interrupteur** | ouvre ou ferme le circuit |
:::

::: formule
**Le sens conventionnel du courant**
À l'extérieur du générateur, le courant circule de la borne **`+`** vers la borne **`−`**.

C'est une convention choisie au XIXᵉ siècle. Les électrons, découverts plus tard, circulent en réalité dans le sens inverse, mais toute l'électricité s'écrit avec le sens conventionnel.
:::

::: piege Conducteur et isolant
Un **conducteur** laisse passer le courant : métaux, eau salée, graphite, corps humain.
Un **isolant** ne le laisse pas passer : plastique, verre, air sec, bois sec.
Le corps humain est un **conducteur**, ce qui est la raison de toutes les règles de sécurité du point 11.
:::

## 2. Le schéma normalisé

::: grille
| Élément | Symbole |
|---|---|
| Pile | un trait long et un trait court parallèles |
| Générateur continu | un rectangle avec les signes `+` et `−` |
| Lampe | un cercle barré d'une croix |
| Interrupteur ouvert | un trait oblique décollé |
| Interrupteur fermé | un trait droit |
| Résistance | un rectangle allongé |
| Moteur | un cercle avec la lettre `M` |
| Ampèremètre | un cercle avec la lettre `A` |
| Voltmètre | un cercle avec la lettre `V` |
| Fil | un trait droit |
:::

::: methode Réaliser un schéma en quatre règles
1. Les fils se tracent **à la règle**, en traits droits, jamais à main levée.
2. Le circuit prend la forme d'un **rectangle**, les angles sont droits.
3. Les symboles se placent **au milieu** d'un côté, jamais dans un angle.
4. On indique le **sens du courant** par une flèche sur un fil.
:::

::: piege Le schéma n'est pas un dessin
On ne dessine pas une pile qui ressemble à une pile.
Le symbole normalisé est compris dans le monde entier, contrairement à un dessin.
Un schéma juste avec un mauvais symbole est un schéma faux.
:::

## 3. Le montage en série

::: definition Montage en série
Dans un montage **en série**, tous les dipôles sont placés **les uns à la suite des autres**, sur une **boucle unique**.
Le courant n'a qu'un seul chemin possible.
:::

::: grille
| Propriété | Conséquence |
|---|---|
| Une seule boucle | l'ordre des dipôles n'a aucune importance |
| Un seul chemin | si un dipôle est retiré, **tout s'éteint** |
| Ajout d'une lampe | les lampes brillent **moins** |
:::

::: exemple Deux lampes en série
Avec une seule lampe, elle brille normalement.
Avec deux lampes en série sur le même générateur, les deux brillent **plus faiblement**, et de façon identique.
Si on dévisse l'une des deux, l'autre s'éteint aussi : la boucle est ouverte.
:::

::: retenir Pourquoi la guirlande ancienne s'éteignait entièrement
Les vieilles guirlandes montaient toutes les ampoules **en série**.
Une seule ampoule grillée ouvrait la boucle et éteignait toute la guirlande.
Les guirlandes modernes emploient des dérivations, ce qui évite ce défaut.
:::

## 4. Le montage en dérivation

::: definition Montage en dérivation
Dans un montage **en dérivation**, le circuit comporte **plusieurs boucles**.
Le courant se sépare en un point appelé **nœud**, puis se rassemble en un autre nœud.
:::

::: grille
| Propriété | Conséquence |
|---|---|
| Plusieurs boucles | chaque branche est **indépendante** |
| Un dipôle retiré | les autres continuent de fonctionner |
| Ajout d'une lampe | les autres **ne changent pas** de luminosité |
:::

::: definition Nœud, branche, maille
Un **nœud** est un point où au moins **trois fils** se rejoignent.
Une **branche** est une portion de circuit entre deux nœuds.
Une **maille** est une boucle fermée du circuit.
:::

::: exemple L'installation d'une maison
Toutes les prises et tous les éclairages d'un logement sont montés **en dérivation**.
C'est pour cela qu'éteindre une lampe n'éteint pas le réfrigérateur, et qu'une ampoule grillée n'affecte rien d'autre.
:::

🔁 **Point de pause.** Reprends après cinq minutes. La suite introduit les deux grandeurs à mesurer.

## 5. L'intensité du courant

::: definition Intensité
L'**intensité** mesure le **débit** du courant électrique : la quantité de charges qui traverse une section du circuit chaque seconde.
Elle se note `I` et s'exprime en **ampères**, de symbole `A`.
:::

::: grille
| Grandeur | Symbole | Unité | Appareil |
|---|---|---|---|
| Intensité | `I` | ampère, `A` | ampèremètre |
:::

::: formule
**Brancher un ampèremètre**
Il se branche **en série**, dans la branche où l'on veut mesurer.
Il faut donc **ouvrir le circuit** pour l'insérer.
On entre par la borne `mA` ou `A` et on sort par la borne `COM`.
:::

::: piege Ne jamais brancher un ampèremètre en dérivation
Sa résistance est presque nulle : branché en dérivation aux bornes d'un générateur, il crée un **court-circuit** et se détruit, ou fait fondre le fusible.
C'est l'erreur de manipulation la plus grave du chapitre.
:::

::: grille
| Ordre de grandeur | Situation |
|---|---|
| `0,01 A` | une diode électroluminescente |
| `0,3 A` | une petite lampe de poche |
| `5 A` | un ordinateur portable en charge |
| `10 A` | un four électrique |
| `0,03 A` | le seuil dangereux pour le corps humain |
:::

## 6. Les lois de l'intensité

::: formule
**Loi d'unicité de l'intensité, en série**
Dans un circuit en série, l'intensité est **la même en tout point**.

`I1 = I2 = I3 = ...`
:::

::: formule
**Loi des nœuds, en dérivation**
La somme des intensités qui **arrivent** à un nœud est égale à la somme de celles qui en **repartent**.

`I = I1 + I2`
:::

::: exemple Un calcul aux nœuds
Un générateur débite `I = 0,8 A`. Le circuit se sépare en deux branches.
Dans la première, on mesure `I1 = 0,3 A`.
Alors `I2 = I − I1 = 0,8 − 0,3 = **0,5 A**`.
:::

::: retenir L'image qui aide, et sa limite
On compare souvent le courant à l'eau dans un tuyau : à un embranchement, le débit total se répartit.
L'image est utile pour la loi des nœuds. Elle devient trompeuse pour la tension, qui ne se laisse pas décrire aussi simplement.
:::

## 7. La tension

::: definition Tension
La **tension** entre deux points mesure la différence d'état électrique entre ces deux points.
C'est elle qui « pousse » le courant.
Elle se note `U` et s'exprime en **volts**, de symbole `V`.
:::

::: formule
**Brancher un voltmètre**
Il se branche **en dérivation**, directement aux bornes du dipôle étudié.
On n'ouvre **pas** le circuit.
On branche la borne `V` du côté `+` et la borne `COM` de l'autre côté.
:::

::: grille
| Ordre de grandeur | Situation |
|---|---|
| `1,5 V` | une pile bâton |
| `4,5 V` | une pile plate |
| `12 V` | une batterie de voiture |
| `230 V` | une prise domestique en France |
| `400 000 V` | une ligne à très haute tension |
:::

::: piege Tension et intensité ne se mesurent pas de la même façon
L'**ampèremètre** se branche **en série** : il faut ouvrir le circuit.
Le **voltmètre** se branche **en dérivation** : on ne touche pas au circuit.
Inverser les deux est l'erreur la plus fréquente en travaux pratiques.
:::

## 8. Les lois de la tension

::: formule
**Loi d'additivité des tensions, en série**
La tension aux bornes du générateur est égale à la **somme** des tensions aux bornes des récepteurs.

`U = U1 + U2 + ...`
:::

::: formule
**Loi d'unicité des tensions, en dérivation**
Les dipôles branchés en dérivation ont **la même tension** à leurs bornes.

`U = U1 = U2`
:::

::: exemple Deux lampes en série
Un générateur de `6 V` alimente deux lampes identiques en série.
Chaque lampe reçoit `6 ÷ 2 = **3 V**`.
C'est pourquoi elles brillent moins qu'une seule lampe sous `6 V`.
:::

::: exemple Deux lampes en dérivation
Le même générateur de `6 V` alimente deux lampes en dérivation.
Chaque lampe reçoit **`6 V`**, la tension totale.
Elles brillent donc normalement toutes les deux, mais le générateur débite deux fois plus d'intensité et s'use deux fois plus vite.
:::

::: grille
| | **En série** | **En dérivation** |
|---|---|---|
| Intensité | **même partout** | se **partage** aux nœuds |
| Tension | s'**additionne** | **même** pour chaque branche |
:::

::: retenir Le tableau à connaître par cœur
Ce tableau de quatre cases résume la moitié du chapitre.
Retiens qu'en série, c'est l'**intensité** qui est commune ; en dérivation, c'est la **tension**.
Chaque grandeur est commune dans un montage et se partage dans l'autre.
:::

## 9. La loi d'Ohm

::: definition Résistance
Une **résistance** est un dipôle qui s'oppose au passage du courant.
Elle se note `R` et s'exprime en **ohms**, de symbole `Ω`.
:::

::: formule
**La loi d'Ohm**
`U = R × I`

avec `U` en volts, `R` en ohms et `I` en ampères.

Les deux formes dérivées :
`R = U ÷ I` et `I = U ÷ R`
:::

::: exemple Trois calculs
**Calculer `U`** : une résistance de `100 Ω` est traversée par `0,05 A`.
`U = 100 × 0,05 = **5 V**`.

**Calculer `I`** : une résistance de `220 Ω` est sous `4,4 V`.
`I = 4,4 ÷ 220 = **0,02 A**`.

**Calculer `R`** : un dipôle sous `6 V` est traversé par `0,3 A`.
`R = 6 ÷ 0,3 = **20 Ω**`.
:::

::: piege Les unités
La loi d'Ohm n'est valable qu'avec les unités du système international : **volt, ohm, ampère**.
Une intensité donnée en milliampères doit être convertie : `50 mA = 0,05 A`.
Oublier cette conversion donne un résultat mille fois trop grand.
:::

::: methode Choisir la bonne forme de la loi d'Ohm
1. Repère la grandeur **cherchée**.
2. Repère les deux grandeurs **connues**.
3. Écris la forme qui isole la grandeur cherchée.
4. Convertis toutes les données en unités du système international **avant** de calculer.
:::

## 10. Puissance et énergie

::: definition Puissance électrique
La **puissance** est l'énergie transférée chaque seconde.
Elle se note `P` et s'exprime en **watts**, de symbole `W`.
:::

::: formule
`P = U × I`

avec `P` en watts, `U` en volts et `I` en ampères.
:::

::: formule
**L'énergie consommée**
`E = P × t`

avec `E` en joules, `P` en watts et `t` en **secondes**.

En pratique domestique, on emploie le **kilowattheure** : `E` en kWh, `P` en kW et `t` en heures.
`1 kWh = 3 600 000 J`.
:::

::: exemple Le calcul d'une facture
Un radiateur de `2 000 W` fonctionne `3 heures par jour` pendant `30 jours`.
Puissance en kilowatts : `2 000 W = 2 kW`.
Durée totale : `3 × 30 = 90 heures`.
Énergie : `E = 2 × 90 = **180 kWh**`.
À `0,20 € le kWh`, cela représente `180 × 0,20 = **36 €**`.
:::

::: grille
| Appareil | Puissance typique |
|---|---|
| Diode électroluminescente | `0,1 W` |
| Ampoule basse consommation | `10 W` |
| Ordinateur portable | `60 W` |
| Four électrique | `2 000 W` |
| Plaque à induction | `3 000 W` |
:::

## 11. La sécurité domestique

::: grille
| Dispositif | Ce qu'il protège | Comment |
|---|---|---|
| **Fusible** | l'installation | fond si l'intensité dépasse un seuil |
| **Disjoncteur** | l'installation | coupe le circuit, se réarme |
| **Disjoncteur différentiel** | **les personnes** | détecte une fuite de courant vers la terre |
| **Fil de terre** | les personnes | conduit le courant de fuite vers le sol |
:::

::: definition Court-circuit
Un **court-circuit** se produit quand les deux bornes d'un générateur sont reliées par un fil sans récepteur.
La résistance devient presque nulle, l'intensité devient très grande, les fils chauffent et peuvent provoquer un incendie.
:::

::: formule
**Pourquoi un court-circuit est dangereux**
D'après la loi d'Ohm, `I = U ÷ R`.
Si `R` tend vers zéro, `I` devient très grande.
C'est exactement ce que le fusible et le disjoncteur sont là pour interrompre.
:::

::: piege Le corps humain est conducteur
Un courant de `0,03 A`, soit `30 mA`, traversant la poitrine peut être **mortel**.
Sous `230 V`, avec une peau humide dont la résistance tombe à quelques milliers d'ohms, ce seuil est atteint immédiatement.
C'est pourquoi le disjoncteur différentiel coupe dès `30 mA` de fuite.
:::

::: retenir Les cinq règles à respecter
1. Ne jamais toucher un appareil électrique avec les **mains mouillées**.
2. Ne jamais utiliser d'appareil électrique dans une **baignoire** ou sous la douche.
3. Ne jamais ouvrir un appareil **branché**.
4. Ne jamais surcharger une **multiprise** en cumulant des appareils de forte puissance.
5. Ne jamais remplacer un fusible par un fil de fortune : il ne fondrait plus.
:::

## 12. Les pièges à éviter

::: piege 1. Le branchement des appareils de mesure
L'**ampèremètre en série**, le **voltmètre en dérivation**. Jamais l'inverse.
:::

::: piege 2. L'ampèremètre en dérivation
Il provoque un court-circuit et se détruit. C'est l'erreur de manipulation la plus grave.
:::

::: piege 3. Le tableau des quatre lois
En série, l'intensité est commune et la tension s'additionne. En dérivation, c'est l'inverse.
:::

::: piege 4. Les unités de la loi d'Ohm
Volt, ohm, ampère. Convertir les milliampères **avant** de calculer.
:::

::: piege 5. Le kilowattheure
`P` en kilowatts et `t` en heures. Mélanger les watts et les heures donne un résultat faux.
:::

::: piege 6. Le schéma normalisé
On emploie les symboles, pas des dessins. Les fils se tracent à la règle.
:::

::: piege 7. Le fusible et le différentiel
Le fusible protège l'**installation**, le différentiel protège les **personnes**. Ce ne sont pas les mêmes rôles.
:::

::: piege 8. Le corps humain
Il est **conducteur**. Le seuil dangereux est de `30 mA`, une valeur atteinte instantanément sous `230 V`.
:::

::: cocher
- Je schématise un circuit avec les symboles normalisés et une règle
- Je distingue série et dérivation et je connais le tableau des quatre lois
- Je branche un ampèremètre en série et un voltmètre en dérivation
- J'applique la loi d'Ohm après avoir converti les unités
- Je sais expliquer à quoi sert un disjoncteur différentiel
:::
