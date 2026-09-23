---
type: exercices
matiere: physique-chimie
lecon: L06
titre: Circuits électriques : exercices corrigés
resume: 20 exercices progressifs, du schéma normalisé aux calculs de loi d'Ohm et de facture, jusqu'à l'analyse d'une installation domestique, avec un corrigé détaillé pas à pas.
duree: 3 séances de 45 min
competences:
  - Pratiquer des démarches scientifiques
  - Concevoir et réaliser une expérience
  - Pratiquer des langages
  - Adopter un comportement responsable
objectifs:
  - Schématiser et analyser un circuit
  - Appliquer les quatre lois de l'intensité et de la tension
  - Calculer avec la loi d'Ohm et avec la puissance
  - Expliquer les dispositifs de sécurité
---

::: plan
**Série A : schémas et montages** (exercices 1 à 5)
**Série B : intensité et tension** (exercices 6 à 11)

*🔁 Pause*

**Série C : loi d'Ohm, puissance, énergie** (exercices 12 à 16)
**Série D : sécurité et devoir type** (exercices 17 à 20)
:::

::: materiel
- Une règle pour les schémas
- Une calculatrice
:::

## Série A : schémas et montages

::: exercice 1 | application | 4 min | ecran
Associe chaque symbole à son élément.

1. Un cercle barré d'une croix. · 2. Un rectangle allongé. · 3. Un cercle avec la lettre `A`. · 4. Un cercle avec la lettre `V`. · 5. Un trait long et un trait court parallèles.

::: corrige
1. Une **lampe**.
2. Une **résistance**.
3. Un **ampèremètre**.
4. Un **voltmètre**.
5. Une **pile**.

Retiens que le trait long représente la borne `+` et le trait court la borne `−` : c'est le seul symbole où l'orientation porte une information.
:::
:::

::: exercice 2 | application | 5 min | main
Schématise un circuit comportant une pile, un interrupteur fermé et deux lampes en série. Indique le sens du courant.

::: corrige
Le schéma se trace en **rectangle**, à la règle.
Sur le côté gauche, le symbole de la pile. Sur le côté du haut, l'interrupteur fermé, représenté par un trait droit. Sur le côté droit et sur le côté du bas, les deux lampes, chacune au milieu de son côté.
Une flèche placée sur un fil indique le sens du courant : il sort de la borne `+` de la pile et parcourt le circuit jusqu'à la borne `−`.

Critères de réussite : quatre traits droits formant un rectangle, symboles au milieu des côtés et jamais dans un angle, flèche présente, bornes de la pile repérables.
:::
:::

::: exercice 3 | application | 5 min | ecran
Pour chaque situation, dis s'il s'agit d'un montage en série ou en dérivation.

1. Les deux lampes s'éteignent quand on en dévisse une.
2. Éteindre le plafonnier n'éteint pas le réfrigérateur.
3. Le circuit ne comporte qu'une seule boucle.
4. Le courant se sépare en un nœud.
5. Ajouter une lampe fait baisser la luminosité de toutes les autres.

::: corrige
1. **Série** : la boucle unique est ouverte, plus rien ne circule.
2. **Dérivation** : chaque branche est indépendante.
3. **Série**, par définition.
4. **Dérivation** : un nœud n'existe que s'il y a plusieurs branches.
5. **Série** : la tension du générateur se partage entre un nombre croissant de lampes.
:::
:::

::: exercice 4 | application | 5 min | ecran
Vrai ou faux ? Justifie en une phrase.

1. Dans un circuit en série, l'ordre des dipôles modifie le fonctionnement.
2. Le corps humain est un isolant.
3. Un nœud est un point où au moins trois fils se rejoignent.
4. Toute l'installation d'une maison est montée en série.

::: corrige
1. **Faux.** Sur une boucle unique, l'intensité est la même partout : déplacer un dipôle ne change rien au fonctionnement du circuit.
2. **Faux.** Le corps humain est **conducteur**, surtout quand la peau est humide. C'est la raison de toutes les règles de sécurité électrique.
3. **Vrai.** C'est la définition : moins de trois fils ne créent aucune séparation du courant.
4. **Faux.** Elle est montée **en dérivation**, ce qui permet d'éteindre une lampe sans couper le reste et évite qu'une ampoule grillée n'affecte l'installation entière.
:::
:::

::: exercice 5 | entrainement | 6 min | ecran
Une ancienne guirlande de Noël comporte 20 ampoules. Quand une seule grille, toute la guirlande s'éteint.

1. De quel montage s'agit-il ? Justifie.
2. Pourquoi les 20 ampoules brillent-elles faiblement ?
3. Les guirlandes modernes n'ont plus ce défaut. Quel montage emploient-elles ?
4. Quel inconvénient ce nouveau montage présente-t-il pour l'alimentation ?

::: corrige
1. **En série.** Une ampoule grillée ouvre la boucle unique, et plus aucun courant ne circule : toute la guirlande s'éteint.
2. Parce que la tension du générateur se **partage** entre les 20 ampoules. Si l'alimentation délivre `230 V`, chaque ampoule ne reçoit que `230 ÷ 20 = 11,5 V`, ce qui explique une luminosité modeste.
3. Une **dérivation**, ou un montage mixte associant plusieurs groupes en dérivation. Chaque branche étant indépendante, une ampoule grillée n'éteint que celle-là.
4. Chaque branche reçoit la **tension totale** et le générateur doit fournir la **somme** de toutes les intensités. Il débite donc beaucoup plus de courant qu'en série, ce qui demande une alimentation plus puissante.
:::
:::

## Série B : intensité et tension

::: exercice 6 | application | 4 min | ecran
Complète.

1. L'intensité se note ………, s'exprime en ……… et se mesure avec un ………
2. La tension se note ………, s'exprime en ……… et se mesure avec un ………
3. L'ampèremètre se branche en ………
4. Le voltmètre se branche en ………

::: corrige
1. `I`, en **ampères** de symbole `A`, avec un **ampèremètre**.
2. `U`, en **volts** de symbole `V`, avec un **voltmètre**.
3. **En série**, ce qui oblige à ouvrir le circuit pour l'insérer.
4. **En dérivation**, directement aux bornes du dipôle, sans toucher au circuit.
:::
:::

::: exercice 7 | application | 5 min | ecran
Un générateur débite une intensité de `0,8 A`. Le circuit se sépare en deux branches. Dans la première, on mesure `0,3 A`.

1. Quelle loi appliques-tu ?
2. Calcule l'intensité dans la seconde branche.
3. Que vaudrait l'intensité dans chaque branche si les deux étaient identiques ?

::: corrige
1. La **loi des nœuds** : la somme des intensités qui arrivent à un nœud est égale à la somme de celles qui en repartent.
2. `I2 = I − I1 = 0,8 − 0,3 = **0,5 A**`.
3. Si les deux branches étaient identiques, le courant se partagerait également : `0,8 ÷ 2 = **0,4 A**` dans chacune.

Vérification du point 2 : `0,3 + 0,5 = 0,8`, ce qui correspond bien à l'intensité débitée.
:::
:::

::: exercice 8 | application | 5 min | ecran
Un générateur de `9 V` alimente trois lampes identiques **en série**.

1. Quelle loi appliques-tu ?
2. Quelle tension reçoit chaque lampe ?
3. Si l'intensité mesurée dans la première lampe vaut `0,2 A`, que vaut-elle dans la troisième ?

::: corrige
1. La **loi d'additivité des tensions** : la tension du générateur est la somme des tensions aux bornes des récepteurs.
2. Les trois lampes étant identiques, elles se partagent la tension à parts égales : `9 ÷ 3 = **3 V**` chacune.
3. `**0,2 A**`. En série, l'intensité est **la même en tout point** du circuit : elle ne se partage pas.

Cet exercice mobilise les deux lois du montage en série : la tension s'additionne, l'intensité est commune.
:::
:::

::: exercice 9 | application | 5 min | ecran
Un générateur de `12 V` alimente deux lampes **en dérivation**. La première est traversée par `0,4 A`, la seconde par `0,25 A`.

1. Quelle tension reçoit chaque lampe ?
2. Quelle intensité le générateur débite-t-il ?
3. Les deux lampes sont-elles identiques ? Justifie.

::: corrige
1. `**12 V**` chacune. En dérivation, la tension est la **même** pour toutes les branches.
2. Loi des nœuds : `I = 0,4 + 0,25 = **0,65 A**`.
3. **Non.** Sous la même tension de `12 V`, elles ne sont pas traversées par la même intensité. D'après la loi d'Ohm, `R = U ÷ I`, leurs résistances diffèrent : `12 ÷ 0,4 = 30 Ω` pour la première, `12 ÷ 0,25 = 48 Ω` pour la seconde. Ce sont donc deux lampes différentes.
:::
:::

::: exercice 10 | entrainement | 6 min | ecran
Pour chaque erreur de manipulation, dis ce qui se passe et pourquoi.

1. On branche un ampèremètre en dérivation aux bornes d'une pile.
2. On branche un voltmètre en série dans un circuit.
3. On relie directement les deux bornes d'une pile par un fil.

::: corrige
1. La résistance de l'ampèremètre est **presque nulle**. Branché directement aux bornes de la pile, il crée un **court-circuit** : d'après `I = U ÷ R`, l'intensité devient très grande. L'appareil se détruit, ou son fusible interne fond. C'est l'erreur de manipulation la plus grave du chapitre.
2. La résistance du voltmètre est au contraire **très grande**. Placé en série, il bloque presque tout le courant : le circuit ne fonctionne plus, la lampe reste éteinte. Rien n'est détruit, mais la mesure n'a aucun sens.
3. C'est un **court-circuit**. L'intensité devient très grande, le fil et la pile chauffent fortement, et la pile se décharge en quelques instants. Sur une installation domestique, c'est le mécanisme qui déclenche un incendie, et c'est précisément ce que le fusible interrompt.
:::
:::

::: exercice 11 | approfondissement | 8 min | main
Un circuit comporte un générateur de `6 V`, puis se sépare en deux branches. La branche A contient une lampe. La branche B contient deux lampes identiques en série.

1. Quelle tension reçoit la lampe de la branche A ?
2. Quelle tension reçoit chaque lampe de la branche B ?
3. Dans quelle branche les lampes brillent-elles le plus ? Justifie.
4. Si on dévisse une lampe de la branche B, que devient la lampe de la branche A ?

::: corrige
1. La branche A est en dérivation avec le générateur : elle reçoit la tension totale, soit `**6 V**`.
2. Les deux lampes de la branche B sont en série entre elles. Cette branche reçoit `6 V`, qui se partagent entre les deux lampes identiques : `6 ÷ 2 = **3 V**` chacune.
3. Dans la **branche A**. Sa lampe reçoit `6 V`, contre `3 V` pour chacune de celles de la branche B. Une tension plus élevée aux bornes d'une même lampe donne une luminosité plus forte.
4. Elle **continue de briller normalement**, sous `6 V`. Les deux branches sont indépendantes : ouvrir la branche B n'affecte pas la branche A. Seules les deux lampes de la branche B s'éteignent.

Ce montage mixte combine les deux types : il faut raisonner branche par branche, en appliquant la loi de la dérivation entre les branches et celle de la série à l'intérieur d'une branche.
:::
:::

*🔁 Pause. Reprends après une vraie coupure.*

## Série C : loi d'Ohm, puissance, énergie

::: exercice 12 | application | 5 min | ecran
Applique la loi d'Ohm.

1. `R = 100 Ω`, `I = 0,05 A`. Calcule `U`.
2. `U = 4,4 V`, `R = 220 Ω`. Calcule `I`.
3. `U = 6 V`, `I = 0,3 A`. Calcule `R`.
4. `R = 150 Ω`, `I = 40 mA`. Calcule `U`.

::: corrige
1. `U = R × I = 100 × 0,05 = **5 V**`.
2. `I = U ÷ R = 4,4 ÷ 220 = **0,02 A**`, soit `20 mA`.
3. `R = U ÷ I = 6 ÷ 0,3 = **20 Ω**`.
4. **Conversion d'abord** : `40 mA = 0,04 A`. Puis `U = 150 × 0,04 = **6 V**`.

Sans la conversion du point 4, on aurait obtenu `150 × 40 = 6 000 V`, un résultat mille fois trop grand et manifestement absurde. Le contrôle de vraisemblance repère ce genre d'erreur immédiatement.
:::
:::

::: exercice 13 | entrainement | 6 min | ecran
Un conducteur ohmique est soumis à différentes tensions. On relève les intensités.

| `U` en V | 2 | 4 | 6 | 8 |
|---|---|---|---|---|
| `I` en A | 0,04 | 0,08 | 0,12 | 0,16 |

1. Calcule `U ÷ I` pour chaque colonne.
2. Que constates-tu ?
3. Quelle est la résistance de ce conducteur ?
4. Quelle intensité passerait sous `10 V` ?

::: corrige
1. `2 ÷ 0,04 = 50` · `4 ÷ 0,08 = 50` · `6 ÷ 0,12 = 50` · `8 ÷ 0,16 = 50`.
2. Le rapport `U ÷ I` est **constant**. La tension et l'intensité sont donc **proportionnelles**, ce qui est exactement ce qu'exprime la loi d'Ohm.
3. `R = **50 Ω**`, la valeur constante du rapport.
4. `I = U ÷ R = 10 ÷ 50 = **0,2 A**`.

Remarque que ce tableau est un tableau de proportionnalité dont le coefficient est la résistance. C'est ainsi que la loi d'Ohm a été établie expérimentalement.
:::
:::

::: exercice 14 | application | 5 min | ecran
Calcule la puissance ou l'intensité.

1. Un appareil sous `230 V` est traversé par `5 A`. Calcule sa puissance.
2. Une lampe de `60 W` fonctionne sous `230 V`. Calcule l'intensité.
3. Un four de `2 000 W` fonctionne sous `230 V`. Calcule l'intensité, arrondie au dixième.

::: corrige
1. `P = U × I = 230 × 5 = **1 150 W**`.
2. `I = P ÷ U = 60 ÷ 230 ≈ **0,26 A**`.
3. `I = 2 000 ÷ 230 ≈ **8,7 A**`.

Compare les points 2 et 3 : un four tire environ 33 fois plus de courant qu'une lampe. C'est la raison pour laquelle on ne branche jamais deux appareils de forte puissance sur la même multiprise.
:::
:::

::: exercice 15 | entrainement | 7 min | ecran
Un radiateur de `2 000 W` fonctionne 3 heures par jour pendant 30 jours. Le kilowattheure coûte `0,20 €`.

1. Convertis la puissance en kilowatts.
2. Calcule la durée totale de fonctionnement.
3. Calcule l'énergie consommée en kWh.
4. Calcule le coût.
5. Combien coûterait la même consommation exprimée en joules ?

::: corrige
1. `2 000 W = **2 kW**`.
2. `3 × 30 = **90 heures**`.
3. `E = P × t = 2 × 90 = **180 kWh**`.
4. `180 × 0,20 = **36 €**`.
5. `1 kWh = 3 600 000 J`, donc `180 kWh = 180 × 3 600 000 = **648 000 000 J**`, soit `648 MJ`. Le coût est évidemment le même, `36 €` : seule l'unité change, pas la quantité d'énergie.

Le point 5 montre pourquoi le kilowattheure est employé en pratique domestique : le nombre en joules est trop grand pour être manipulé commodément.
:::
:::

::: exercice 16 | approfondissement | 8 min | main
Une multiprise supporte au maximum `16 A` sous `230 V`.

1. Calcule la puissance maximale qu'elle peut supporter.
2. On y branche un four de `2 000 W`, une bouilloire de `2 200 W` et un grille-pain de `900 W`. Calcule la puissance totale.
3. Que se passe-t-il ? Justifie par un calcul d'intensité.
4. Quel dispositif intervient alors, et pourquoi ?

::: corrige
1. `P = U × I = 230 × 16 = **3 680 W**`.
2. `2 000 + 2 200 + 900 = **5 100 W**`.
3. La puissance demandée dépasse largement le maximum supporté. Calculons l'intensité correspondante : `I = P ÷ U = 5 100 ÷ 230 ≈ **22,2 A**`, contre `16 A` admissibles. Les fils de la multiprise, dimensionnés pour `16 A`, s'échauffent fortement : l'isolant peut fondre et un incendie peut se déclarer.
4. Le **fusible** ou le **disjoncteur** du circuit intervient. Il détecte la surintensité et coupe le courant avant que les fils n'atteignent une température dangereuse. C'est précisément son rôle : il protège l'**installation**, pas les personnes.

Cet exercice explique la règle domestique : on ne cumule jamais plusieurs appareils de forte puissance sur une même multiprise.
:::
:::

## Série D : sécurité et devoir type

::: exercice 17 | entrainement | 7 min | ecran
1. Qu'est-ce qu'un court-circuit ?
2. Explique par la loi d'Ohm pourquoi il est dangereux.
3. Quelle est la différence entre un fusible et un disjoncteur ?
4. Que protège un disjoncteur différentiel, et à partir de quelle valeur agit-il ?

::: corrige
1. Un **court-circuit** se produit quand les deux bornes d'un générateur sont reliées par un conducteur **sans récepteur**.
2. D'après `I = U ÷ R`, si la résistance `R` devient presque nulle, l'intensité `I` devient très grande. Les fils, traversés par un courant bien supérieur à celui pour lequel ils sont dimensionnés, s'échauffent fortement, leur isolant peut fondre et un incendie peut se déclarer.
3. Les deux protègent l'installation contre les surintensités. Le **fusible** contient un fil qui **fond** et doit être remplacé après chaque coupure. Le **disjoncteur** ouvre un contact et se **réarme** simplement, sans remplacement.
4. Il protège les **personnes**. Il compare le courant qui entre et celui qui sort : si une partie s'échappe vers la terre, à travers un corps par exemple, il détecte cette différence et coupe. Il agit dès **`30 mA`**, valeur choisie parce que c'est le seuil à partir duquel un courant traversant la poitrine devient dangereux.
:::
:::

::: exercice 18 | entrainement | 7 min | main
Pour chaque situation, dis si elle est dangereuse et pourquoi.

1. Toucher un interrupteur avec les mains mouillées.
2. Utiliser un sèche-cheveux dans une baignoire.
3. Ouvrir un grille-pain débranché pour retirer une tartine coincée.
4. Remplacer un fusible grillé par un fil de cuivre.
5. Brancher une lampe de chevet sur une multiprise déjà occupée par un chargeur de téléphone.

::: corrige
1. **Dangereux.** L'eau diminue fortement la résistance de la peau, qui peut passer de plusieurs dizaines de milliers d'ohms à quelques milliers. Sous `230 V`, l'intensité traversant le corps dépasse alors largement les `30 mA` dangereux.
2. **Très dangereux**, et interdit. L'eau du bain est conductrice et reliée à la terre : la moindre défaillance de l'appareil fait passer un courant important à travers le corps. C'est l'un des accidents domestiques les plus souvent mortels.
3. **Sans danger** pour ce qui est de l'électricité, puisque l'appareil est débranché : aucune tension n'est présente. La règle est de toujours débrancher avant d'ouvrir, et elle est ici respectée. Attention toutefois aux parties encore chaudes.
4. **Très dangereux.** Un fil de cuivre ne fond pas à l'intensité prévue : la protection disparaît. En cas de surintensité, rien n'interrompt le courant et les fils de l'installation chauffent jusqu'à l'incendie.
5. **Sans danger.** Une lampe consomme quelques watts et un chargeur quelques dizaines : leur total reste très inférieur aux `3 680 W` que supporte une multiprise. La règle ne vise que les appareils de **forte** puissance, chauffants pour l'essentiel.
:::
:::

::: exercice 19 | approfondissement | 8 min | main
Une installation domestique comporte un circuit d'éclairage protégé par un disjoncteur de `10 A` et un circuit de prises protégé par un disjoncteur de `16 A`, le tout sous `230 V`.

1. Calcule la puissance maximale de chaque circuit.
2. Pourquoi le circuit d'éclairage est-il protégé par un disjoncteur de plus faible calibre ?
3. Toutes les lampes du logement sont-elles en série ou en dérivation ? Justifie par une conséquence pratique.
4. Pourquoi un disjoncteur de `16 A` ne protège-t-il pas une personne ?

::: corrige
1. Éclairage : `P = 230 × 10 = **2 300 W**`. Prises : `P = 230 × 16 = **3 680 W**`.
2. Parce que les lampes consomment peu : quelques watts à quelques dizaines de watts chacune. Un calibre de `10 A` suffit largement, et un calibre plus faible permet d'employer des fils de plus petite section, moins coûteux, tout en coupant plus tôt en cas de défaut.
3. **En dérivation.** La conséquence pratique est décisive : éteindre une lampe n'éteint pas les autres, et une ampoule grillée n'affecte aucune autre pièce. Un montage en série rendrait l'installation inutilisable.
4. Parce qu'il ne se déclenche qu'à partir de `16 A`, soit plus de **cinq cents fois** le seuil dangereux de `30 mA`. Un courant de `50 mA` traversant une personne peut être mortel sans jamais faire réagir ce disjoncteur, qui ne voit qu'une intensité très faible. C'est exactement le rôle du **disjoncteur différentiel**, qui compare le courant entrant et le courant sortant et coupe dès qu'une fuite de `30 mA` apparaît.
:::
:::

::: exercice 20 | approfondissement | 45 min | main
**Devoir type. Quatre parties. Barème sur 20 points, indiqué à la fin.**

**Partie A. Schéma et vocabulaire**

a. Cite les quatre constituants d'un circuit et le rôle de chacun.
b. Dans quel sens circule le courant conventionnel ? Que sait-on de la réalité physique ?
c. Définis un nœud, une branche et une maille.
d. Schématise un circuit comportant un générateur, un interrupteur, une lampe et une résistance en série. Indique le sens du courant.

**Partie B. Les quatre lois**

a. Énonce les quatre lois de l'intensité et de la tension, en série et en dérivation.
b. Un générateur de `12 V` alimente trois lampes identiques **en série**. Quelle tension reçoit chacune ? Si l'intensité vaut `0,15 A` dans la première, que vaut-elle dans la troisième ?
c. Le même générateur alimente trois lampes identiques **en dérivation**, chacune traversée par `0,15 A`. Quelle tension reçoit chacune ? Quelle intensité le générateur débite-t-il ?
d. Dans lequel des deux montages le générateur s'usera-t-il le plus vite ? Justifie.

**Partie C. Loi d'Ohm et énergie**

a. Énonce la loi d'Ohm et ses deux formes dérivées, avec les unités.
b. Une résistance de `470 Ω` est traversée par `25 mA`. Calcule la tension. Attention aux unités.
c. Un chauffe-eau de `2 400 W` fonctionne 2 heures par jour pendant 31 jours. Le kWh coûte `0,22 €`. Calcule l'énergie consommée et le coût.
d. Sous `230 V`, quelle intensité traverse ce chauffe-eau ? Arrondis au dixième.

**Partie D. Sécurité**

a. Explique par un calcul pourquoi un court-circuit est dangereux.
b. Quelle est la différence de rôle entre un fusible et un disjoncteur différentiel ?
c. Une multiprise de `16 A` sous `230 V` reçoit un four de `2 000 W`, une bouilloire de `2 200 W` et un fer à repasser de `1 800 W`. Calcule la puissance totale et l'intensité correspondante. Conclus.
d. Cite trois règles de sécurité domestique et justifie chacune en une phrase.

::: corrige
**Partie A**

a. Le **générateur** fournit l'énergie électrique. Le **récepteur** la convertit en une autre forme, lumière pour une lampe, mouvement pour un moteur, chaleur pour une résistance. Les **fils de connexion** transportent le courant. L'**interrupteur** ouvre ou ferme le circuit.

b. Le courant conventionnel circule de la borne **`+`** vers la borne **`−`** à l'extérieur du générateur. En réalité, ce sont les **électrons** qui se déplacent, et ils vont dans le **sens inverse**. La convention a été fixée avant la découverte de l'électron, et elle a été conservée parce que tous les raisonnements et toutes les formules de l'électricité s'écrivent avec elle.

c. Un **nœud** est un point où au moins trois fils se rejoignent. Une **branche** est une portion de circuit comprise entre deux nœuds. Une **maille** est une boucle fermée du circuit.

d. Le schéma se trace en rectangle, à la règle. Sur le côté gauche, le générateur avec ses bornes `+` et `−`. Sur le côté du haut, l'interrupteur. Sur le côté droit, la lampe. Sur le côté du bas, la résistance, représentée par un rectangle allongé. Une flèche sur un fil indique le sens du courant, de `+` vers `−`.

**Partie B**

a. **En série** : l'intensité est **la même en tout point**, `I1 = I2 = I3`. Les tensions **s'additionnent**, `U = U1 + U2 + U3`.
**En dérivation** : les intensités **s'additionnent aux nœuds**, `I = I1 + I2 + I3`. La tension est **la même** pour chaque branche, `U = U1 = U2 = U3`.

b. Les trois lampes identiques en série se partagent la tension : `12 ÷ 3 = **4 V**` chacune.
L'intensité dans la troisième vaut `**0,15 A**`, la même que dans la première : en série, elle est identique en tout point.

c. Chaque lampe reçoit `**12 V**`, la tension totale.
Le générateur débite `I = 0,15 × 3 = **0,45 A**`.

d. Dans le montage **en dérivation**. Il y débite `0,45 A` contre `0,15 A` en série, soit **trois fois plus**. Or l'énergie fournie par unité de temps vaut `P = U × I` : à tension égale, une intensité trois fois plus grande signifie une puissance trois fois plus grande, donc une usure trois fois plus rapide.

**Partie C**

a. `U = R × I`, avec `U` en **volts**, `R` en **ohms** et `I` en **ampères**.
Formes dérivées : `R = U ÷ I` et `I = U ÷ R`.

b. **Conversion d'abord** : `25 mA = 0,025 A`.
`U = 470 × 0,025 = **11,75 V**`.
Sans conversion, on aurait trouvé `11 750 V`, résultat mille fois trop grand et manifestement absurde pour une résistance de laboratoire.

c. Puissance en kilowatts : `2 400 W = 2,4 kW`.
Durée totale : `2 × 31 = 62 heures`.
Énergie : `E = 2,4 × 62 = **148,8 kWh**`.
Coût : `148,8 × 0,22 = **32,74 €**`.

d. `I = P ÷ U = 2 400 ÷ 230 ≈ **10,4 A**`.

**Partie D**

a. Un court-circuit relie les deux bornes du générateur **sans récepteur** : la résistance du circuit devient presque nulle. D'après `I = U ÷ R`, une résistance qui tend vers zéro fait tendre l'intensité vers une valeur très grande. Par exemple, sous `230 V` avec une résistance résiduelle de `0,5 Ω`, on obtiendrait `I = 230 ÷ 0,5 = 460 A`, à comparer aux `16 A` que supporte un circuit de prises. Les fils s'échauffent alors très rapidement, leur isolant fond et un incendie peut se déclarer.

b. Le **fusible** protège l'**installation** : il fond quand l'intensité dépasse un seuil, ce qui évite l'échauffement des fils. Le **disjoncteur différentiel** protège les **personnes** : il compare le courant entrant et le courant sortant, et coupe dès qu'une fuite de `30 mA` apparaît, signe qu'une partie du courant passe ailleurs que dans le circuit prévu, à travers un corps par exemple. Les seuils diffèrent d'un facteur cinq cents : un disjoncteur de `16 A` ne peut donc en aucun cas protéger une personne.

c. Puissance totale : `2 000 + 2 200 + 1 800 = **6 000 W**`.
Intensité : `I = 6 000 ÷ 230 ≈ **26,1 A**`.
Conclusion : cette valeur dépasse largement les `16 A` admissibles par la multiprise. Le disjoncteur du circuit coupera, et si la protection était défaillante, les fils de la multiprise s'échaufferaient jusqu'à un risque d'incendie. On ne cumule jamais trois appareils chauffants sur une même multiprise.

d. Trois règles au choix, avec leur justification :
- **Ne jamais toucher un appareil électrique avec les mains mouillées** : l'eau diminue fortement la résistance de la peau, ce qui laisse passer un courant bien plus important à tension égale.
- **Ne jamais utiliser d'appareil électrique dans une baignoire** : l'eau est conductrice et reliée à la terre, si bien qu'un défaut même minime fait passer un courant important à travers le corps.
- **Ne jamais ouvrir un appareil branché** : tant qu'il est relié au secteur, des parties internes sont sous `230 V` et un contact suffit à créer un accident.
- **Ne jamais remplacer un fusible par un fil de fortune** : ce fil ne fondrait pas au seuil prévu, et la protection contre les surintensités disparaîtrait entièrement.
- **Ne jamais surcharger une multiprise** : au-delà de l'intensité admissible, les fils s'échauffent et leur isolant peut fondre.

**Barème indicatif**
Partie A : 5 points (1,5 pour les constituants, 1 pour le sens du courant, 1 pour les définitions, 1,5 pour le schéma).
Partie B : 6 points (2 pour les quatre lois, 1,5 pour le montage en série, 1,5 pour le montage en dérivation, 1 pour la comparaison justifiée).
Partie C : 5 points (1 pour l'énoncé de la loi, 1,5 pour le calcul avec conversion, 1,5 pour l'énergie et le coût, 1 pour l'intensité).
Partie D : 4 points (1,5 pour le court-circuit chiffré, 1 pour la différence de rôle, 1 pour la multiprise, 0,5 pour les règles).
:::
:::

::: cocher
- J'ai fait tous les exercices de la série A
- J'ai fait tous les exercices de la série B
- J'ai fait tous les exercices de la série C
- J'ai traité le sujet de type devoir en temps limité
- J'ai comparé chaque réponse au corrigé avant de passer à la suite
:::
