---
type: cours
matiere: maths
lecon: L08
titre: Le théorème de Pythagore et sa réciproque
resume: Calculer une longueur dans un triangle rectangle, et démontrer qu'un triangle est rectangle, ou qu'il ne l'est pas.
duree: 2 séances de 45 min
competences:
  - Représenter
  - Raisonner
  - Calculer
  - Communiquer
objectifs:
  - Reconnaître l'hypoténuse d'un triangle rectangle
  - Calculer la longueur de l'hypoténuse à partir des deux autres côtés
  - Calculer la longueur d'un côté de l'angle droit
  - Démontrer qu'un triangle est rectangle avec la réciproque
  - Démontrer qu'un triangle n'est pas rectangle
  - Rédiger une démonstration complète en trois temps
---

::: plan
**Séance 1 : calculer une longueur**

1. Le vocabulaire du triangle rectangle
2. Le théorème de Pythagore
3. Calculer l'hypoténuse
4. La racine carrée
5. Calculer un côté de l'angle droit

*🔁 Pause de 5 minutes*

6. Rédiger une démonstration

**Séance 2 : démontrer**

7. La réciproque : démontrer qu'un triangle est rectangle
8. Démontrer qu'un triangle n'est **pas** rectangle
9. Valeurs exactes et valeurs arrondies
10. Les pièges à éviter
:::

::: materiel
- Une calculatrice avec la touche `√`
- Une règle graduée et une équerre
- Du papier quadrillé pour les figures
:::

## 1. Le vocabulaire du triangle rectangle

::: definition Triangle rectangle
Un **triangle rectangle** est un triangle qui possède **un angle droit** (90°).
Un triangle ne peut avoir qu'**un seul** angle droit.
:::

::: definition Hypoténuse
L'**hypoténuse** est le côté **opposé à l'angle droit**.
C'est toujours le **côté le plus long** du triangle rectangle.
Les deux autres côtés, ceux qui forment l'angle droit, s'appellent les **côtés de l'angle droit**.
:::

<figure class="schema">
<svg width="440" height="290" viewBox="0 0 440 290" role="img" aria-label="Triangle ABC rectangle en A. Le côté BC, opposé à l'angle droit, est l'hypoténuse : c'est le côté le plus long.">
  <polygon class="zone" points="110,230 350,230 110,100"/>
  <path class="angle" d="M 110 202 L 138 202 L 138 230"/>
  <text x="100" y="252" text-anchor="end">A</text>
  <text x="360" y="252" text-anchor="start">B</text>
  <text x="100" y="96" text-anchor="end">C</text>
  <text class="legende" x="230" y="256" text-anchor="middle">côté de l'angle droit</text>
  <text class="legende" x="98" y="168" text-anchor="end">côté</text>
  <text class="legende" x="248" y="146" text-anchor="start">hypoténuse</text>
  <text class="legende" x="152" y="196" text-anchor="start">90°</text>
</svg>
<figcaption>Le triangle ABC est rectangle en A. L'angle droit est marqué en rouge. L'hypoténuse est le côté [BC] : c'est celui qui ne touche pas l'angle droit, et c'est toujours le plus long.</figcaption>
</figure>

::: methode Trouver l'hypoténuse en 3 secondes
::: etapes
1. Je repère le **petit carré** de l'angle droit sur la figure.
2. Je pose mon doigt dessus.
3. L'hypoténuse est le côté que mon doigt **ne touche pas**.
:::
:::

::: piege « Rectangle en A » : lire l'énoncé, pas la figure
Quand l'énoncé dit « le triangle ABC est **rectangle en A** », cela signifie que l'angle droit est au sommet **A**. L'hypoténuse est donc **[BC]**, le côté formé par les deux autres lettres.
Cette information est dans le **texte** : elle ne dépend pas de la façon dont la figure est dessinée, et une figure peut être trompeuse.
:::

## 2. Le théorème de Pythagore

::: formule Théorème de Pythagore
Si un triangle **ABC** est **rectangle en A**, alors :
:::

::: formule-cle
BC² = AB² + AC²
:::

En mots : dans un triangle rectangle, le **carré de l'hypoténuse** est égal à la
**somme des carrés des deux autres côtés**.

::: info À quoi ça sert vraiment
Ce théorème permet de calculer une longueur **sans la mesurer**. C'est ce que font un géomètre qui ne peut pas traverser une rivière, un charpentier qui calcule un versant de toit, ou un logiciel de jeu vidéo qui calcule une distance à l'écran.
:::

## 3. Calculer l'hypoténuse

::: exemple Calculer BC
Le triangle ABC est rectangle en A, avec **AB = 6 cm** et **AC = 8 cm**.
Calculer la longueur BC.

::: etapes
1. J'écris le théorème : BC² = AB² + AC²
2. Je remplace par les nombres : BC² = 6² + 8²
3. Je calcule les carrés : BC² = 36 + 64
4. J'additionne : BC² = 100
5. Je cherche la longueur : BC = √100 = **10**
6. Je conclus avec l'unité : **BC = 10 cm**
:::
:::

::: piege On calcule BC², pas BC
À l'étape 4, on a trouvé **100**. Ce n'est **pas** la longueur : c'est le **carré**
de la longueur. Il reste une étape : prendre la racine carrée.
Oublier cette étape est l'erreur la plus fréquente de tout le chapitre.
:::

## 4. La racine carrée

::: definition Racine carrée
La **racine carrée** d'un nombre positif *a*, notée **√a**, est le nombre **positif**
dont le carré vaut *a*.
:::

::: formule-cle
√a = b   signifie   b² = a   (avec b ≥ 0)
:::

::: exemple Quelques racines à connaître par cœur
| n | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 15 | 20 | 25 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| n² | 1 | 4 | 9 | 16 | 25 | 36 | 49 | 64 | 81 | 100 | 121 | 144 | 169 | 225 | 400 | 625 |

Lire ce tableau **dans les deux sens** :
- de haut en bas : 12² = 144 ;
- de bas en haut : √144 = 12.
:::

::: piege √(a + b) n'est pas √a + √b
Vérifions sur un exemple : √(9 + 16) = √25 = **5**.
Mais √9 + √16 = 3 + 4 = **7**.
5 ≠ 7 : la racine carrée **ne se distribue pas** sur une addition.
C'est exactement pour cette raison qu'on additionne **d'abord** les carrés, et qu'on prend la racine **ensuite**, jamais l'inverse.
:::

::: pause
Fin du premier bloc. Reprends après la pause à la partie 5.
:::

## 5. Calculer un côté de l'angle droit

Quand l'inconnue n'est **pas** l'hypoténuse, on **soustrait** au lieu d'additionner.

::: exemple Calculer AC
Le triangle ABC est rectangle en A. L'hypoténuse mesure **BC = 13 cm**
et un côté de l'angle droit mesure **AB = 5 cm**. Calculer AC.

::: etapes
1. J'écris le théorème : BC² = AB² + AC²
2. Je remplace : 13² = 5² + AC²
3. Je calcule : 169 = 25 + AC²
4. J'isole l'inconnue : AC² = 169 − 25
5. Je calcule : AC² = 144
6. Je prends la racine : AC = √144 = **12**
7. Je conclus : **AC = 12 cm**
:::
:::

::: methode Additionner ou soustraire ? La question à se poser
::: etapes
1. Je repère **quelle longueur est inconnue**.
2. Je me demande : **est-ce l'hypoténuse ?**
3. **Oui** → j'**additionne** les carrés des deux autres côtés.
4. **Non** → je **soustrais** : (hypoténuse)² − (côté connu)².
5. Dans les deux cas, je termine par la **racine carrée**.
:::
:::

::: piege Le résultat doit être cohérent
L'hypoténuse est **toujours** le côté le plus long.
Si le calcul donne un côté de l'angle droit **plus grand** que l'hypoténuse, c'est qu'on a additionné au lieu de soustraire. Ce contrôle prend 2 secondes et rattrape l'erreur la plus coûteuse.
:::

## 6. Rédiger une démonstration

En 4ᵉ, on n'attend plus seulement le bon résultat : on attend une **rédaction** qui montre **pourquoi** on a le droit de faire ce calcul.

::: methode Les trois temps d'une démonstration
::: etapes
1. **Je pose le cadre** : nommer le triangle et dire où est l'angle droit.
   *« Le triangle ABC est rectangle en A. »*
2. **Je cite le théorème** : dire que je l'applique, et écrire l'égalité générale.
   *« D'après le théorème de Pythagore, BC² = AB² + AC². »*
3. **Je calcule et je conclus** : remplacer, calculer, et donner la réponse avec son unité.
   *« Donc BC² = 36 + 64 = 100, d'où BC = √100 = 10. BC mesure 10 cm. »*
:::
:::

::: exemple Une rédaction complète, telle qu'on l'attend
> Le triangle RST est rectangle en R.
> D'après le théorème de Pythagore : ST² = RS² + RT².
> Or RS = 9 cm et RT = 12 cm.
> Donc ST² = 9² + 12² = 81 + 144 = 225.
> Donc ST = √225 = 15.
> **L'hypoténuse [ST] mesure 15 cm.**
:::

::: info Les mots qui rapportent des points
**« D'après le théorème de Pythagore »**, **« Or »**, **« Donc »**.
Ces trois connecteurs montrent le raisonnement. Une copie qui ne contient que des calculs, même justes, perd les points de la compétence *Communiquer*.
:::

::: pause
Fin de la séance 1. La séance 2 commence à la partie 7.
:::

## 7. La réciproque : démontrer qu'un triangle est rectangle

Jusqu'ici, on **savait** que le triangle était rectangle et on cherchait une longueur.
Maintenant on fait l'inverse : on **connaît les trois longueurs** et on veut savoir si le triangle est rectangle.

::: formule Réciproque du théorème de Pythagore
Dans un triangle, si le **carré du plus grand côté** est **égal** à la **somme des carrés des deux autres côtés**, alors ce triangle est **rectangle**, et l'**angle droit est opposé au plus grand côté**.
:::

::: methode Utiliser la réciproque en 4 étapes
::: etapes
1. **J'identifie le plus grand côté.** C'est le seul candidat possible au rôle d'hypoténuse.
2. **Je calcule séparément** le carré du plus grand côté, dans un premier calcul.
3. **Je calcule séparément** la somme des carrés des deux autres, dans un second calcul.
4. **Je compare les deux résultats**, puis je conclus par une phrase.
:::
:::

::: exemple Le triangle EFG est-il rectangle ?
EF = 9 cm, FG = 12 cm, EG = 15 cm.

Le plus grand côté est **[EG]**, qui mesure 15 cm.

- D'un côté : EG² = 15² = **225**
- De l'autre : EF² + FG² = 9² + 12² = 81 + 144 = **225**

Les deux résultats sont **égaux**.
D'après la réciproque du théorème de Pythagore, le triangle EFG est **rectangle en F**
(le sommet opposé au plus grand côté [EG]).
:::

::: piege Deux calculs séparés, jamais une seule ligne
On n'écrit **jamais** « 15² = 9² + 12² » dès le départ : ce serait écrire d'emblée ce qu'on cherche à prouver. On calcule les deux membres **séparément**, puis on constate l'égalité. C'est ce qui fait la différence entre une démonstration et une affirmation.
:::

## 8. Démontrer qu'un triangle n'est **pas** rectangle

La même méthode sert aussi à prouver qu'un triangle **n'est pas** rectangle : il suffit que les deux calculs donnent des résultats **différents**.

::: exemple Le triangle KLM est-il rectangle ?
KL = 7 cm, LM = 8 cm, KM = 12 cm.

Le plus grand côté est **[KM]**, qui mesure 12 cm.

- D'un côté : KM² = 12² = **144**
- De l'autre : KL² + LM² = 7² + 8² = 49 + 64 = **113**

144 ≠ 113.
Donc, d'après la réciproque du théorème de Pythagore, le triangle KLM **n'est pas rectangle**.
:::

::: retenir Le même outil répond aux deux questions
- Les deux calculs sont **égaux** → le triangle **est** rectangle.
- Les deux calculs sont **différents** → le triangle **n'est pas** rectangle.

Dans les deux cas, la rédaction est identique : plus grand côté, deux calculs séparés, comparaison, conclusion.
:::

## 9. Valeurs exactes et valeurs arrondies

Très souvent, la racine carrée « ne tombe pas juste ».

::: exemple Un cas qui ne tombe pas juste
Triangle rectangle avec des côtés de l'angle droit de **5 cm** et **7 cm**.

BC² = 5² + 7² = 25 + 49 = 74
BC = √74

√74 est la **valeur exacte**. La calculatrice affiche 8,602325267…
Arrondi au dixième : **BC ≈ 8,6 cm**.
:::

::: piege Arrondir seulement à la fin
Si un calcul comporte plusieurs étapes, on garde les valeurs **exactes** jusqu'au bout et on n'arrondit **qu'au dernier moment**. Arrondir en cours de route fait dériver le résultat final.
:::

::: info Le bon symbole
On écrit **=** pour une valeur exacte (BC = √74) et **≈** pour une valeur arrondie (BC ≈ 8,6 cm). Utiliser **=** avec une valeur arrondie est une erreur comptée en contrôle.
:::

## 10. Les pièges à éviter : récapitulatif

::: grille
| Piège | Ce qui se passe | Le réflexe qui l'évite |
|---|---|---|
| Se tromper d'hypoténuse | On additionne alors qu'il fallait soustraire | Poser le doigt sur l'angle droit : l'hypoténuse est le côté non touché |
| S'arrêter au carré | On répond 100 au lieu de 10 | Se relire : « est-ce que ma dernière opération est une racine ? » |
| Écrire √(a+b) = √a + √b | Résultat faux dès le premier calcul | Tester mentalement sur 9 et 16 : 5 ≠ 7 |
| Additionner pour la réciproque | On prouve ce qu'on voulait montrer | Toujours **deux calculs séparés**, puis comparaison |
| Arrondir trop tôt | Le résultat final est faux au dixième près | Garder la valeur exacte jusqu'à la dernière ligne |
| Oublier l'unité | Points perdus même avec le bon nombre | La conclusion est une **phrase**, pas un nombre |
| Écrire = au lieu de ≈ | Points perdus en rédaction | ≈ dès qu'il y a un arrondi |
:::

::: retenir L'essentiel de la leçon
- **Hypoténuse** = côté opposé à l'angle droit = côté le plus long.
- **Théorème** : si rectangle en A, alors **BC² = AB² + AC²** → sert à **calculer une longueur**.
- Inconnue = hypoténuse → **j'additionne**. Sinon → **je soustrais**. Toujours finir par **√**.
- **Réciproque** : deux calculs séparés, on compare → sert à **démontrer** qu'un triangle est rectangle, ou qu'il ne l'est pas.
- Une démonstration se rédige en trois temps : **cadre**, **théorème**, **calcul et conclusion**.
- **=** pour l'exact, **≈** pour l'arrondi.
:::

::: aide Et maintenant ?
1. Passe à la **fiche de révision** (`2-revision`) et restitue les mots-clés sans regarder.
2. Puis fais les exercices **1 à 8** de la fiche `3-exercices` (niveau *Application*).
3. Positionne-toi enfin sur la **grille d'évaluation** (`4-evaluation`).
:::
