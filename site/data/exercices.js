/* =========================================================================
   exercices.js : banque d'exercices interactifs, par leçon.
   Clé : "<matiere>/<ref>". Types : qcm, vraifaux, saisie.
   Les explications sont toujours rédigées : une réponse fausse doit
   apprendre quelque chose, pas seulement signaler l'erreur.
   ========================================================================= */
window.EXERCICES = {
  'maths/L08': {
    titre: 'Le théorème de Pythagore et sa réciproque',
    items: [
      {
        type: 'qcm',
        q: 'Le triangle ABC est <strong>rectangle en A</strong>. Quel côté est l\'hypoténuse ?',
        choix: ['[AB]', '[AC]', '[BC]'],
        reponse: 2,
        explication: "L'angle droit est au sommet A. L'hypoténuse est le côté opposé à cet angle, donc celui formé par les deux autres lettres : [BC]."
      },
      {
        type: 'vraifaux',
        q: "Dans un triangle rectangle, l'hypoténuse est toujours le côté le plus long.",
        reponse: true,
        explication: "Vrai. L'hypoténuse fait face à l'angle le plus grand du triangle, l'angle droit. Elle est donc toujours plus longue que les deux autres côtés. C'est aussi un bon moyen de vérifier un résultat."
      },
      {
        type: 'qcm',
        q: 'Un triangle est rectangle en A, avec AB = 6 cm et AC = 8 cm. Combien mesure BC ?',
        choix: ['10 cm', '14 cm', '100 cm', '48 cm'],
        reponse: 0,
        explication: "BC² = 6² + 8² = 36 + 64 = 100, donc BC = √100 = 10 cm. Attention : 100 est le carré de la longueur, pas la longueur. 14 correspondrait à 6 + 8, ce qui n'est jamais la bonne opération."
      },
      {
        type: 'saisie',
        q: 'Le triangle RST est rectangle en R, avec RS = 9 cm et RT = 12 cm. Combien mesure ST, en cm ?',
        reponses: ['15', '15 cm', 'st = 15', 'st = 15 cm'],
        explication: "ST² = 9² + 12² = 81 + 144 = 225, donc ST = √225 = 15 cm. C'est le trio 9-12-15, qui est le trio 3-4-5 multiplié par 3."
      },
      {
        type: 'saisie',
        q: "Un triangle rectangle a une hypoténuse de 13 cm et un côté de l'angle droit de 5 cm. Combien mesure l'autre côté, en cm ?",
        reponses: ['12', '12 cm'],
        explication: "L'inconnue n'est pas l'hypoténuse, donc on soustrait : c² = 13² − 5² = 169 − 25 = 144, donc c = √144 = 12 cm. C'est le trio 5-12-13."
      },
      {
        type: 'qcm',
        q: 'Combien vaut √(9 + 16) ?',
        choix: ['5', '7', '25', '12,5'],
        reponse: 0,
        explication: "√(9 + 16) = √25 = 5. La réponse 7 correspond à √9 + √16 = 3 + 4 : c'est l'erreur classique. La racine carrée ne se distribue pas sur une addition. On additionne d'abord, on prend la racine ensuite."
      },
      {
        type: 'vraifaux',
        q: "Quand l'inconnue est l'hypoténuse, on soustrait les carrés des deux autres côtés.",
        reponse: false,
        explication: "Faux. Quand l'inconnue est l'hypoténuse, on <strong>additionne</strong>. On soustrait seulement quand l'inconnue est un côté de l'angle droit, en retirant son carré à celui de l'hypoténuse."
      },
      {
        type: 'qcm',
        q: 'Un triangle a pour côtés 6 cm, 8 cm et 10 cm. Est-il rectangle ?',
        choix: ['Oui, car 10² = 6² + 8²', 'Non, car 10 ≠ 6 + 8', 'On ne peut pas savoir sans la figure'],
        reponse: 0,
        explication: "Le plus grand côté est 10. D'un côté 10² = 100, de l'autre 6² + 8² = 36 + 64 = 100. Les deux résultats sont égaux, donc d'après la réciproque du théorème de Pythagore le triangle est rectangle. Les trois longueurs suffisent : la figure n'est pas nécessaire."
      },
      {
        type: 'qcm',
        q: 'Un triangle a pour côtés 7 cm, 8 cm et 12 cm. Est-il rectangle ?',
        choix: ['Oui', 'Non', 'Il faudrait connaître les angles'],
        reponse: 1,
        explication: "Le plus grand côté est 12. D'un côté 12² = 144, de l'autre 7² + 8² = 49 + 64 = 113. 144 ≠ 113, donc le triangle n'est pas rectangle. La réciproque sert aussi à démontrer qu'un triangle n'est pas rectangle."
      },
      {
        type: 'saisie',
        q: 'Combien vaut 15² ?',
        reponses: ['225'],
        explication: "15² = 15 × 15 = 225. Les carrés utiles à connaître par cœur vont jusqu'à 15² = 225, plus 20² = 400 et 25² = 625."
      },
      {
        type: 'qcm',
        q: 'Quelle phrase doit obligatoirement précéder le calcul dans une démonstration ?',
        choix: ['« Je calcule »', '« D\'après le théorème de Pythagore »', '« On voit sur la figure que »', '« Le triangle a l\'air rectangle »'],
        reponse: 1,
        explication: "C'est cette phrase qui justifie qu'on a le droit d'écrire l'égalité. Une copie qui n'aligne que des calculs, même justes, perd les points de la compétence Communiquer. Une figure ne démontre jamais rien : elle illustre."
      },
      {
        type: 'qcm',
        q: 'Pourquoi écrit-on BC ≈ 8,6 cm plutôt que BC = 8,6 cm ?',
        choix: ['Parce que le calcul est approximatif', 'Parce que 8,6 est une valeur arrondie de √74', 'Parce qu\'on ne connaît pas l\'unité', 'Parce que BC est une longueur'],
        reponse: 1,
        explication: "La valeur exacte est √74. Dès qu'on écrit un arrondi, on utilise le signe ≈. Le calcul, lui, est parfaitement exact : c'est seulement l'écriture décimale qui est approchée."
      },
      {
        type: 'saisie',
        q: "Une échelle de 4 m est posée contre un mur vertical, son pied à 1,5 m du mur. À quelle hauteur touche-t-elle le mur ? Réponds en mètres, arrondi au dixième.",
        reponses: ['3,7', '3.7', '3,7 m', '3.7 m'],
        explication: "Le mur et le sol forment un angle droit, et l'échelle est l'hypoténuse. h² = 4² − 1,5² = 16 − 2,25 = 13,75, donc h = √13,75 ≈ 3,7 m. On soustrait, parce que l'inconnue n'est pas l'hypoténuse."
      },
      {
        type: 'vraifaux',
        q: 'Un triangle peut avoir deux angles droits.',
        reponse: false,
        explication: "Faux. La somme des angles d'un triangle vaut 180°. Deux angles droits en feraient déjà 180, et il ne resterait rien pour le troisième : la figure ne se refermerait pas."
      },
      {
        type: 'qcm',
        q: 'Lequel de ces trios est un trio pythagoricien ?',
        choix: ['3 - 4 - 6', '5 - 12 - 13', '6 - 7 - 8', '2 - 3 - 4'],
        reponse: 1,
        explication: "5² + 12² = 25 + 144 = 169 = 13². Les trios à connaître sont 3-4-5, 5-12-13 et 8-15-17, ainsi que tous leurs multiples. Quand ils apparaissent dans un énoncé, le résultat tombe juste."
      }
    ]
  },

  'maths/L01': {
    titre: 'Nombres relatifs et fractions',
    items: [
      {
        type: 'qcm',
        q: 'Combien vaut <strong>(-5) + (-8)</strong> ?',
        choix: ['-13', '+13', '-3', '+3'],
        reponse: 0,
        explication: "Les deux nombres sont négatifs : on additionne les distances à zéro, 5 + 8 = 13, et on garde le signe commun. Le résultat est -13. La règle qui transforme deux moins en plus ne vaut que pour un produit ou un quotient, jamais pour une addition."
      },
      {
        type: 'qcm',
        q: 'Combien vaut <strong>(-12) + (+4)</strong> ?',
        choix: ['-16', '-8', '+8', '+16'],
        reponse: 1,
        explication: "Les signes sont différents : on soustrait la plus petite distance de la plus grande, 12 - 4 = 8. Le nombre le plus éloigné de zéro est -12, qui est négatif : le résultat est donc -8."
      },
      {
        type: 'qcm',
        q: 'Combien vaut <strong>(+3) - (-8)</strong> ?',
        choix: ['-11', '-5', '+5', '+11'],
        reponse: 3,
        explication: "Soustraire un nombre, c'est ajouter son opposé : (+3) - (-8) = (+3) + (+8) = +11. C'est la seule situation où un calcul faisant intervenir un nombre négatif donne un résultat plus grand qu'au départ."
      },
      {
        type: 'vraifaux',
        q: 'Dans un produit, deux signes moins donnent un résultat positif.',
        reponse: true,
        explication: "Vrai pour un produit et pour un quotient : deux signes identiques donnent un résultat positif. Mais c'est faux pour une addition : (-3) + (-4) vaut -7, et non +7."
      },
      {
        type: 'qcm',
        q: 'Quel est le signe de <strong>(-2) × (+3) × (-5) × (-1)</strong> ?',
        choix: ['Positif', 'Négatif', 'Nul', 'On ne peut pas savoir'],
        reponse: 1,
        explication: "On compte les facteurs négatifs : -2, -5 et -1, soit trois. Trois est impair, donc le résultat est négatif. Le produit des distances vaut 2 × 3 × 5 × 1 = 30 : le résultat est -30."
      },
      {
        type: 'saisie',
        q: 'Simplifie la fraction <strong>42/56</strong> au maximum. Écris ta réponse sous la forme a/b.',
        reponses: ['3/4', '3 / 4'],
        explication: "42 et 56 se divisent tous les deux par 2, ce qui donne 21/28. Puis 21 et 28 se divisent par 7, ce qui donne 3/4. On pouvait aussi diviser directement par 14. Le résultat est 3/4."
      },
      {
        type: 'qcm',
        q: 'Combien vaut <strong>1/2 + 1/3</strong> ?',
        choix: ['2/5', '5/6', '1/6', '2/6'],
        reponse: 1,
        explication: "On n'additionne jamais les dénominateurs. Ici 3 n'est pas dans la table de 2 : on prend le produit, 6. Alors 1/2 = 3/6 et 1/3 = 2/6, donc la somme vaut 5/6. Contrôle utile : le résultat doit être plus grand que 1/2, ce que 2/5 n'est pas."
      },
      {
        type: 'saisie',
        q: 'Combien vaut <strong>3/4 + 5/12</strong> ? Donne la fraction simplifiée, sous la forme a/b.',
        reponses: ['7/6', '7 / 6'],
        explication: "12 est dans la table de 4, donc le dénominateur commun est 12. 3/4 devient 9/12, et 9/12 + 5/12 = 14/12. On simplifie par 2 : 7/6. Un résultat non simplifié n'est pas faux, mais il n'est pas terminé."
      },
      {
        type: 'qcm',
        q: 'Combien vaut <strong>2/3 × 6/7</strong> ?',
        choix: ['8/10', '4/7', '12/7', '2/7'],
        reponse: 1,
        explication: "Pour un produit, aucun dénominateur commun n'est nécessaire : on multiplie ligne par ligne. 2 × 6 = 12 et 3 × 7 = 21, soit 12/21, qui se simplifie par 3 en 4/7. On pouvait aussi simplifier avant : 6 et 3 par 3, ce qui donne 2/1 × 2/7 = 4/7."
      },
      {
        type: 'qcm',
        q: 'Combien vaut <strong>3/4 ÷ 2/5</strong> ?',
        choix: ['6/20', '8/15', '15/8', '5/6'],
        reponse: 2,
        explication: "Diviser par une fraction, c'est multiplier par son inverse : 3/4 × 5/2 = 15/8. La fraction qui se retourne est celle qui suit le signe de division. Retourner la première donnerait 8/15, qui est la réponse piège."
      },
      {
        type: 'saisie',
        q: "Quel est l'inverse de <strong>5</strong> ? Écris ta réponse sous la forme a/b.",
        reponses: ['1/5', '1 / 5'],
        explication: "Tout nombre entier s'écrit comme une fraction de dénominateur 1 : 5 se lit 5/1, donc son inverse est 1/5. À ne pas confondre avec l'opposé de 5, qui est -5 : l'opposé change le signe, l'inverse retourne la fraction."
      },
      {
        type: 'vraifaux',
        q: "Pour multiplier deux fractions, il faut d'abord les mettre au même dénominateur.",
        reponse: false,
        explication: "Faux. Le dénominateur commun ne sert qu'à l'addition et à la soustraction. Pour un produit, on multiplie directement les numérateurs entre eux et les dénominateurs entre eux."
      },
      {
        type: 'qcm',
        q: 'Combien vaut <strong>7 - 3 × (2 + 4)</strong> ?',
        choix: ['24', '-11', '18', '4'],
        reponse: 1,
        explication: "Les parenthèses d'abord : 2 + 4 = 6. Puis la multiplication : 3 × 6 = 18. Enfin la soustraction : 7 - 18 = -11. Calculer de gauche à droite sans hiérarchie donnerait 4 × 6 = 24, qui est la réponse piège."
      },
      {
        type: 'saisie',
        q: 'Combien vaut <strong>20 - 8 - 5</strong> ?',
        reponses: ['7', '+7'],
        explication: "Les soustractions se traitent de gauche à droite : (20 - 8) - 5 = 12 - 5 = 7. Faire d'abord 8 - 5 = 3 puis 20 - 3 donnerait 17, ce qui est faux. La règle vaut aussi pour les divisions successives."
      },
      {
        type: 'qcm',
        q: "Dans une classe de 30 élèves, 2/5 font de l'espagnol. Combien cela fait-il d'élèves ?",
        choix: ['6', '12', '15', '10'],
        reponse: 1,
        explication: "Prendre 2/5 d'un nombre, c'est le diviser par 5 puis multiplier par 2 : 30 ÷ 5 = 6, puis 6 × 2 = 12. La réponse 6 correspond à 1/5 seulement : on a oublié de multiplier par le numérateur."
      },
      {
        type: 'qcm',
        q: 'Combien vaut <strong>(-45) ÷ (-9)</strong> ?',
        choix: ['-5', '+5', '-54', '+54'],
        reponse: 1,
        explication: "Deux signes identiques dans un quotient donnent un résultat positif, et 45 ÷ 9 = 5. Le résultat est donc +5. Le signe et la distance à zéro se traitent séparément : c'est ce qui rend la règle simple."
      },
      {
        type: 'saisie',
        q: 'Combien vaut <strong>5/6 - 3/8</strong> ? Donne la fraction simplifiée, sous la forme a/b.',
        reponses: ['11/24', '11 / 24'],
        explication: "Le plus petit dénominateur commun de 6 et 8 est 24. Alors 5/6 = 20/24 et 3/8 = 9/24, donc la différence vaut 11/24. Comme 11 est premier et ne divise pas 24, le résultat est déjà simplifié."
      },
      {
        type: 'qcm',
        q: "Quel est l'opposé de <strong>-7</strong> ?",
        choix: ['-1/7', '+7', '1/7', '-7'],
        reponse: 1,
        explication: "L'opposé a la même distance à zéro et le signe contraire : c'est +7. Ne pas confondre avec l'inverse, qui retourne une fraction : l'inverse de -7 serait -1/7."
      },
      {
        type: 'vraifaux',
        q: 'Soustraire un nombre négatif fait augmenter le résultat.',
        reponse: true,
        explication: "Vrai. Soustraire, c'est ajouter l'opposé : (+3) - (-8) = (+3) + (+8) = +11. C'est la seule situation où un calcul faisant intervenir un nombre négatif donne un résultat plus grand qu'au départ."
      },
      {
        type: 'qcm',
        q: 'Un réservoir de 180 litres est rempli aux <strong>2/3</strong>. Combien contient-il ?',
        choix: ['60 L', '90 L', '120 L', '135 L'],
        reponse: 2,
        explication: "Prendre 2/3 d'un nombre, c'est le diviser par 3 puis multiplier par 2 : 180 ÷ 3 = 60, puis 60 × 2 = 120 litres. La réponse 60 correspond au tiers seulement."
      }
    ]
  },

  'francais/L01': {
    titre: "Dire l'amour : la poésie lyrique",
    items: [
      {
        type: 'qcm',
        q: 'Comment s\'appelle un vers de <strong>12 syllabes</strong> ?',
        choix: ['Un octosyllabe', 'Un décasyllabe', 'Un alexandrin', 'Un sonnet'],
        reponse: 2,
        explication: "Un vers de 12 syllabes est un alexandrin, le vers le plus fréquent de la poésie française. L'octosyllabe en compte 8, le décasyllabe 10. Le sonnet n'est pas un vers mais un poème entier de 14 vers."
      },
      {
        type: 'qcm',
        q: 'Combien de syllabes compte le vers : <strong>« Le ciel est, par-dessus le toit »</strong> ?',
        choix: ['6', '7', '8', '9'],
        reponse: 2,
        explication: "Le / ciel / est / par / de / ssus / le / toit, soit 8 syllabes : c'est un octosyllabe. Le « e » de « dessus » compte, parce qu'il est suivi de la consonne « s ». Ce vers est de Verlaine."
      },
      {
        type: 'vraifaux',
        q: 'Le « e » muet en fin de vers compte comme une syllabe.',
        reponse: false,
        explication: "Faux, et sans exception. Un « e » en fin de vers ne compte jamais. Dans le vers, en revanche, il compte devant une consonne et ne compte pas devant une voyelle."
      },
      {
        type: 'qcm',
        q: 'Dans « une ros<strong>e</strong> ouverte », le « e » de « rose » compte-t-il ?',
        choix: ['Oui, il précède une consonne', 'Non, il précède une voyelle', 'Oui, toujours', 'Non, jamais dans un poème'],
        reponse: 1,
        explication: "Il est suivi de la voyelle « ou » de « ouverte » : il ne se prononce pas. On lit u-ne-ro-s'ou-ver-te. Dans « une rose rouge », le même « e » compterait, car « rouge » commence par une consonne."
      },
      {
        type: 'qcm',
        q: 'Un poème dont les rimes suivent le schéma <strong>ABBA</strong> a des rimes…',
        choix: ['suivies', 'croisées', 'embrassées', 'pauvres'],
        reponse: 2,
        explication: "ABBA, ce sont des rimes embrassées : les deux rimes B sont encadrées par les deux rimes A. AABB donne des rimes suivies, ABAB des rimes croisées. « Pauvre » ne désigne pas une disposition mais la qualité d'une rime."
      },
      {
        type: 'saisie',
        q: 'Comment s\'appelle une strophe de <strong>4 vers</strong> ?',
        reponses: ['quatrain', 'un quatrain', 'le quatrain'],
        explication: "Une strophe de 4 vers est un quatrain. De 3 vers, un tercet ; de 2 vers, un distique ; de 6 vers, un sizain. Un sonnet est fait de deux quatrains puis de deux tercets."
      },
      {
        type: 'saisie',
        q: 'Combien de vers compte un <strong>sonnet</strong> ?',
        reponses: ['14', 'quatorze', '14 vers'],
        explication: "Un sonnet compte 14 vers : deux quatrains (4 + 4) puis deux tercets (3 + 3), soit 4 + 4 + 3 + 3 = 14. Son dernier vers s'appelle la chute, et porte souvent la pointe du poème."
      },
      {
        type: 'qcm',
        q: '<strong>« Ses yeux sont comme deux étoiles. »</strong> De quelle image s\'agit-il ?',
        choix: ['Une comparaison', 'Une métaphore', 'Une personnification', 'Un champ lexical'],
        reponse: 0,
        explication: "Le mot outil « comme » est présent : c'est une comparaison. Sans ce mot, par exemple « les étoiles de son regard », ce serait une métaphore. C'est le seul critère de distinction, et il est mécanique."
      },
      {
        type: 'qcm',
        q: '<strong>« Les étoiles de son regard. »</strong> De quelle image s\'agit-il ?',
        choix: ['Une comparaison', 'Une métaphore', 'Une personnification', 'Une rime riche'],
        reponse: 1,
        explication: "Le rapprochement entre le regard et les étoiles est fait sans mot outil : c'est une métaphore. Elle est plus forte que la comparaison, parce qu'elle ne prévient pas : elle affirme au lieu de comparer."
      },
      {
        type: 'qcm',
        q: '<strong>« Le vent gémit dans les arbres. »</strong> De quelle image s\'agit-il ?',
        choix: ['Une comparaison', 'Une métaphore', 'Une personnification', 'Une diérèse'],
        reponse: 2,
        explication: "Gémir est une action humaine, prêtée ici au vent : c'est une personnification. Son effet le plus fréquent est de rendre le décor vivant, ici plutôt triste ou menaçant."
      },
      {
        type: 'vraifaux',
        q: 'Pour distinguer une comparaison d\'une métaphore, il faut se demander laquelle est la plus belle.',
        reponse: false,
        explication: "Faux. La seule question à se poser est : y a-t-il un mot de comparaison (comme, tel, pareil à, semblable à) ? Si oui, comparaison ; si non, métaphore. Le critère est mécanique, et c'est ce qui le rend fiable."
      },
      {
        type: 'qcm',
        q: 'La rime <strong>« rose » / « pose »</strong> est…',
        choix: ['pauvre', 'suffisante', 'riche', 'inexistante'],
        reponse: 1,
        explication: "On compte les sons communs en fin de vers : « o » et « z », soit deux sons. Deux sons communs donnent une rime suffisante. Un seul son donnerait une rime pauvre, trois ou plus une rime riche."
      },
      {
        type: 'vraifaux',
        q: '« Tabac » et « lilas » riment ensemble.',
        reponse: false,
        explication: "Faux. Le « c » de tabac et le « s » de lilas ne se prononcent pas. On compte les sons entendus, jamais les lettres écrites. À l'inverse, « beau » et « eau » riment très bien, malgré des orthographes différentes."
      },
      {
        type: 'qcm',
        q: 'Quel relevé prouve le mieux qu\'un poème est <strong>lyrique</strong> ?',
        choix: ["Le nombre de vers du poème", "Le pronom « je » et un champ lexical du sentiment", "La présence de rimes riches", "La longueur des strophes"],
        reponse: 1,
        explication: "Le registre lyrique exprime des sentiments personnels : on le prouve par le pronom « je », un champ lexical du sentiment, et souvent une adresse ou une exclamation. Le nombre de vers et la qualité des rimes relèvent de la forme, pas du registre."
      },
      {
        type: 'qcm',
        q: "Dans un paragraphe d'analyse, que faut-il écrire <strong>après</strong> avoir nommé le procédé ?",
        choix: ["Rien, le repérage suffit", "Que l'image est belle", "L'effet produit sur le lecteur", "Le nombre de syllabes du vers"],
        reponse: 2,
        explication: "Le paragraphe se fait en quatre temps : annoncer, citer, analyser en nommant le procédé, puis dire l'effet produit. S'arrêter au repérage ne vaut aucun point, et « cette image est belle » n'apprend rien sur ce poème en particulier."
      },
      {
        type: 'qcm',
        q: 'Comment appelle-t-on une strophe de <strong>3 vers</strong> ?',
        choix: ['Un distique', 'Un tercet', 'Un quatrain', 'Un sizain'],
        reponse: 1,
        explication: "Une strophe de 3 vers est un tercet. Un distique en compte 2, un quatrain 4, un sizain 6. Un sonnet se compose de deux quatrains puis de deux tercets."
      },
      {
        type: 'qcm',
        q: 'Le schéma <strong>ABAB</strong> désigne des rimes…',
        choix: ['suivies', 'croisées', 'embrassées', 'riches'],
        reponse: 1,
        explication: "ABAB, ce sont des rimes croisées : elles alternent une sur deux. AABB donne des rimes suivies, ABBA des rimes embrassées. « Riche » qualifie la qualité d'une rime, pas sa disposition."
      },
      {
        type: 'saisie',
        q: 'Comment appelle-t-on le dernier vers d\'un sonnet, souvent frappant ?',
        reponses: ['la chute', 'chute', 'une chute'],
        explication: "On l'appelle la chute. C'est souvent là que se trouve la pointe du poème, l'idée que le lecteur emporte. Chez Ronsard, « Cueillez dès aujourd'hui les roses de la vie » en est un exemple célèbre."
      },
      {
        type: 'qcm',
        q: "Qu'est-ce qu'un <strong>champ lexical</strong> ?",
        choix: [
          "L'ensemble des rimes d'un poème",
          "L'ensemble des mots d'un texte qui se rapportent au même thème",
          "Le nombre de syllabes d'un vers",
          "La strophe finale d'un poème"
        ],
        reponse: 1,
        explication: "Un champ lexical réunit les mots d'un texte qui se rapportent au même thème : cœur, aimer, flamme et tendresse forment le champ lexical de l'amour. Le relever est l'une des trois preuves du registre lyrique."
      },
      {
        type: 'qcm',
        q: "Dans « <strong>Sa chevelure, une nuit sans étoiles</strong> », quel procédé et quel effet ?",
        choix: [
          'Une comparaison, qui éclaircit la description',
          'Une métaphore, qui transforme la chevelure en étendue sombre',
          'Une personnification, qui donne vie à la chevelure',
          'Aucun procédé particulier'
        ],
        reponse: 1,
        explication: "Aucun mot de comparaison ne relie les deux termes : c'est une métaphore. La chevelure devient une étendue où l'on peut se perdre, et la précision « sans étoiles » retire toute lumière, ce qui ajoute de l'inquiétude à la beauté."
      }
    ]
  },

  'physique-chimie/L01': {
    titre: 'Atomes et molécules',
    items: [
      {
        type: 'qcm',
        q: "Quelle est la charge du <strong>noyau</strong> d'un atome ?",
        choix: ['Négative', 'Positive', 'Nulle', 'Variable selon l\'atome'],
        reponse: 1,
        explication: "Le noyau porte une charge positive, les électrons qui l'entourent une charge négative. Les deux se compensent exactement, ce qui rend l'atome globalement neutre."
      },
      {
        type: 'vraifaux',
        q: "Le noyau occupe presque tout le volume de l'atome.",
        reponse: false,
        explication: "Faux. Le noyau contient presque toute la masse, mais il est environ 100 000 fois plus petit que l'atome : l'essentiel du volume est du vide. C'est la confusion entre masse et volume qui trompe ici."
      },
      {
        type: 'saisie',
        q: 'Quel est le symbole chimique du <strong>sodium</strong> ?',
        reponses: ['Na'],
        explication: "Le sodium s'écrit Na, du latin natrium. Attention à la casse : première lettre majuscule, seconde minuscule. NA ou na seraient faux."
      },
      {
        type: 'qcm',
        q: 'Que désigne le symbole <strong>Fe</strong> ?',
        choix: ['Le fluor', 'Le fer', 'Le francium', 'Le phosphore'],
        reponse: 1,
        explication: "Fe désigne le fer, du latin ferrum. Les symboles sont identiques dans toutes les langues du monde, ce qui explique que certains ne ressemblent pas au nom français."
      },
      {
        type: 'qcm',
        q: "Dans la formule <strong>H₂SO₄</strong>, combien y a-t-il d'atomes de soufre ?",
        choix: ['0', '1', '2', '4'],
        reponse: 1,
        explication: "Le S n'a pas d'indice : quand il n'y a pas de chiffre, il y a un seul atome. La formule contient donc 2 hydrogènes, 1 soufre et 4 oxygènes, soit 7 atomes au total."
      },
      {
        type: 'saisie',
        q: "Combien d'atomes au total contient une molécule de <strong>CH₄</strong> ?",
        reponses: ['5', '5 atomes', 'cinq'],
        explication: "CH₄ contient 1 atome de carbone et 4 atomes d'hydrogène, soit 1 + 4 = 5 atomes. C'est la formule du méthane, le gaz naturel."
      },
      {
        type: 'qcm',
        q: "Dans <strong>Ca(OH)₂</strong>, combien y a-t-il d'atomes d'oxygène ?",
        choix: ['1', '2', '3', '4'],
        reponse: 1,
        explication: "L'indice 2 placé après la parenthèse multiplie tout le groupe OH. Il y a donc 2 oxygènes et 2 hydrogènes, plus 1 calcium, soit 5 atomes en tout."
      },
      {
        type: 'qcm',
        q: 'Que désigne <strong>3 H₂O</strong> ?',
        choix: ['Une molécule à 9 atomes', 'Trois molécules d\'eau', 'Trois atomes d\'hydrogène', 'Une molécule H₆O₃'],
        reponse: 1,
        explication: "Le grand chiffre placé devant est un coefficient : il compte les molécules. 3 H₂O, ce sont trois molécules d'eau séparées. Le petit chiffre en indice, lui, compte les atomes à l'intérieur d'une molécule."
      },
      {
        type: 'saisie',
        q: "Combien d'atomes d'oxygène y a-t-il dans <strong>4 CO₂</strong> ?",
        reponses: ['8', '8 atomes', 'huit'],
        explication: "Chaque molécule de CO₂ contient 2 oxygènes, et il y a 4 molécules : 4 × 2 = 8 atomes d'oxygène. Il y a aussi 4 atomes de carbone, soit 12 atomes au total."
      },
      {
        type: 'qcm',
        q: "Quelle différence y a-t-il entre <strong>CO</strong> et <strong>Co</strong> ?",
        choix: [
          'Aucune, seule la casse change',
          'CO est le monoxyde de carbone, Co est le cobalt',
          'CO est un métal, Co est un gaz',
          'Les deux désignent le carbone'
        ],
        reponse: 1,
        explication: "CO s'écrit avec deux majuscules : ce sont deux symboles, carbone et oxygène, et la molécule est le monoxyde de carbone, un gaz toxique. Co, majuscule puis minuscule, est un symbole unique, celui du cobalt, un métal. En chimie, la casse change la substance."
      },
      {
        type: 'qcm',
        q: "L'air est-il un corps pur ou un mélange ?",
        choix: ['Un corps pur', 'Un mélange', 'Cela dépend de la température', 'Ni l\'un ni l\'autre'],
        reponse: 1,
        explication: "L'air est un mélange : il contient environ 78 % de diazote, 21 % de dioxygène, ainsi que de l'argon et du dioxyde de carbone. Un corps pur ne contiendrait qu'une seule sorte d'entité chimique."
      },
      {
        type: 'vraifaux',
        q: "Un jus de fruit « pur jus » est un corps pur au sens chimique.",
        reponse: false,
        explication: "Faux. En chimie, « pur » signifie « une seule sorte de molécules ». Un pur jus contient de l'eau, des sucres, des acides et des vitamines : c'est un mélange. Le mot n'a pas le même sens dans la vie courante et en chimie."
      },
      {
        type: 'qcm',
        q: "Qu'est-ce qui distingue l'ion <strong>Na⁺</strong> de l'atome <strong>Na</strong> ?",
        choix: [
          'L\'ion a gagné un électron',
          'L\'ion a perdu un électron',
          'L\'ion a un noyau plus gros',
          'Il n\'y a aucune différence'
        ],
        reponse: 1,
        explication: "Le signe + indique une charge positive, donc un déficit d'électrons : l'ion sodium a perdu un électron. Un ion négatif, comme Cl⁻, en a au contraire gagné un."
      },
      {
        type: 'vraifaux',
        q: "Quand de la glace fond dans un récipient fermé, la masse totale diminue.",
        reponse: false,
        explication: "Faux, la masse se conserve. Les molécules d'eau restent les mêmes et en même nombre : seule leur disposition change. C'est le volume qui diminue, parce que la glace occupe plus de place que l'eau liquide."
      },
      {
        type: 'qcm',
        q: "Pourquoi l'eau salée conduit-elle le courant, alors que l'eau distillée le conduit très mal ?",
        choix: [
          'Parce que le sel est un métal',
          'Parce que les ions du sel se déplacent librement dans l\'eau',
          'Parce que l\'eau salée est plus chaude',
          'Parce que le sel casse les molécules d\'eau'
        ],
        reponse: 1,
        explication: "En se dissolvant, le sel NaCl libère des ions Na⁺ et Cl⁻ qui peuvent se déplacer dans l'eau : ce sont eux qui transportent le courant. L'eau distillée contient très peu d'ions, donc presque rien pour le transporter."
      },
      {
        type: 'saisie',
        q: "Combien d'atomes au total contient <strong>H₂SO₄</strong> ?",
        reponses: ['7', '7 atomes', 'sept'],
        explication: "2 hydrogènes + 1 soufre + 4 oxygènes = 7 atomes, de trois sortes différentes. Le soufre n'a pas d'indice : il y en a donc un seul, et non zéro."
      },
      {
        type: 'qcm',
        q: "Quelle est la formule du <strong>méthane</strong> ?",
        choix: ['CH₄', 'CO₂', 'NH₃', 'C₂H₆'],
        reponse: 0,
        explication: "CH₄ : un atome de carbone et quatre atomes d'hydrogène. C'est le constituant principal du gaz naturel. NH₃ est l'ammoniac, CO₂ le dioxyde de carbone."
      },
      {
        type: 'vraifaux',
        q: "Le fer d'un clou est un corps pur.",
        reponse: true,
        explication: "Vrai : il ne contient qu'une seule sorte d'entité, des atomes de fer Fe. L'acier, en revanche, est un mélange de fer et de carbone, et c'est ce carbone qui le rend plus dur."
      },
      {
        type: 'qcm',
        q: "Dans quel état les molécules sont-elles <strong>serrées mais en désordre</strong>, et glissent les unes sur les autres ?",
        choix: ['Solide', 'Liquide', 'Gaz', 'Aucun'],
        reponse: 1,
        explication: "C'est l'état liquide. Dans un solide elles sont serrées et ordonnées, immobiles à leur place ; dans un gaz elles sont très éloignées et rapides. Le liquide est le seul état qui a un volume propre sans avoir de forme propre."
      },
      {
        type: 'qcm',
        q: "Pourquoi une bouteille d'eau pleine et bouchée éclate-t-elle au congélateur ?",
        choix: [
          'Parce que la masse de l\'eau augmente en gelant',
          'Parce que le volume de l\'eau augmente en gelant',
          'Parce que les molécules se transforment',
          'Parce que le plastique se rétracte'
        ],
        reponse: 1,
        explication: "En gelant, l'eau augmente de volume d'environ 9 %, ce qui fait monter la pression dans une bouteille fermée. La masse, elle, ne change pas d'un gramme : les molécules sont les mêmes et en même nombre."
      }
    ]
  },

  'svt/L01': {
    titre: 'Structure de la Terre et tectonique des plaques',
    items: [
      {
        type: 'qcm',
        q: 'Quelles sont les couches de la Terre, de la surface vers le centre ?',
        choix: [
          'Croûte, noyau, manteau, graine',
          'Manteau, croûte, noyau externe, noyau interne',
          'Croûte, manteau, noyau externe, noyau interne',
          'Lithosphère, croûte, manteau, noyau'
        ],
        reponse: 2,
        explication: "L'ordre est croûte, manteau, noyau externe, noyau interne. Le manteau représente à lui seul l'essentiel du volume terrestre, avec environ 2 900 km d'épaisseur, alors que la croûte n'en fait que 5 à 70."
      },
      {
        type: 'vraifaux',
        q: 'Le manteau terrestre est liquide.',
        reponse: false,
        explication: "Faux. Le manteau est solide : il se déforme très lentement, sur des millions d'années, mais il n'est pas en fusion. La seule couche liquide de la Terre est le noyau externe. Le magma n'existe qu'en petites poches, à des endroits précis."
      },
      {
        type: 'qcm',
        q: 'Que contient la <strong>lithosphère</strong>, en plus de la croûte ?',
        choix: [
          'Le noyau externe',
          'La partie supérieure du manteau',
          'Toute l\'asthénosphère',
          'Rien, la lithosphère c\'est la croûte'
        ],
        reponse: 1,
        explication: "La lithosphère est la couche rigide de surface, d'environ 100 km d'épaisseur : elle comprend la croûte et le sommet du manteau. C'est elle qui est découpée en plaques, et elle glisse sur l'asthénosphère, plus déformable."
      },
      {
        type: 'qcm',
        q: 'Quelle roche compose principalement la <strong>croûte océanique</strong> ?',
        choix: ['Le granite', 'Le basalte', 'Le calcaire', 'Le marbre'],
        reponse: 1,
        explication: "La croûte océanique est faite de basalte, une roche dense. La croûte continentale, elle, est faite de granite, moins dense. C'est cette différence de densité qui décide laquelle des deux plaques plonge en subduction."
      },
      {
        type: 'qcm',
        q: "Lors d'une subduction, quelle plaque plonge ?",
        choix: [
          'La plaque continentale, plus épaisse',
          'La plaque océanique, plus dense',
          'La plus ancienne des deux',
          'Cela dépend de la vitesse'
        ],
        reponse: 1,
        explication: "C'est toujours la plaque océanique qui plonge, parce que le basalte qui la compose est plus dense que le granite continental. Une plaque continentale est trop légère : quand deux continents se rencontrent, ils se plissent et forment des montagnes."
      },
      {
        type: 'qcm',
        q: "Que se passe-t-il à une <strong>dorsale océanique</strong> ?",
        choix: [
          'Une plaque plonge dans le manteau',
          'Deux plaques glissent l\'une contre l\'autre',
          'Du magma remonte et forme de la croûte neuve',
          'Deux continents entrent en collision'
        ],
        reponse: 2,
        explication: "À une dorsale, les plaques s'écartent, du magma remonte par la fissure, refroidit au contact de l'eau et forme de la croûte océanique neuve. C'est ce qui fait s'élargir l'océan, d'environ 2 cm par an pour l'Atlantique."
      },
      {
        type: 'qcm',
        q: 'À quelle vitesse les plaques se déplacent-elles ?',
        choix: [
          'Quelques mètres par an',
          'Quelques centimètres par an',
          'Quelques kilomètres par siècle',
          'Elles ne se déplacent pas'
        ],
        reponse: 1,
        explication: "Quelques centimètres par an, à peu près la vitesse à laquelle poussent les ongles. Ce qui rend le déplacement énorme n'est pas la vitesse mais la durée : 2 cm par an font 20 km en un million d'années."
      },
      {
        type: 'saisie',
        q: "Une plaque avance de 2 cm par an. De combien de <strong>kilomètres</strong> avance-t-elle en 1 million d'années ?",
        reponses: ['20', '20 km', '20km'],
        explication: "2 × 1 000 000 = 2 000 000 cm. Or 2 000 000 cm font 20 000 m, soit 20 km. Ce calcul est le meilleur exercice de changement d'échelle du chapitre : une vitesse imperceptible produit un déplacement considérable."
      },
      {
        type: 'qcm',
        q: "Pourquoi les fonds océaniques n'ont-ils jamais plus de 200 millions d'années ?",
        choix: [
          'Parce que les océans sont récents',
          'Parce que la croûte océanique est recyclée en subduction',
          'Parce que l\'eau détruit les roches',
          'Parce qu\'on ne sait pas les dater au-delà'
        ],
        reponse: 1,
        explication: "La croûte océanique naît aux dorsales et disparaît dans les zones de subduction : elle est recyclée en permanence. Les continents, trop légers pour plonger, restent en surface et conservent des roches de 4 milliards d'années."
      },
      {
        type: 'qcm',
        q: 'Comment appelle-t-on le moteur du déplacement des plaques ?',
        choix: [
          'La rotation de la Terre',
          'La convection du manteau',
          'L\'attraction de la Lune',
          'L\'érosion des continents'
        ],
        reponse: 1,
        explication: "La convection mantellique : la matière chaude et peu dense remonte, la matière refroidie redescend, ce qui entraîne les plaques. Le poids de la plaque déjà engagée en subduction tire aussi le reste vers le bas."
      },
      {
        type: 'vraifaux',
        q: 'Les séismes et les volcans sont répartis au hasard sur la planète.',
        reponse: false,
        explication: "Faux. Reportés sur un planisphère, ils dessinent des lignes qui coïncident avec les frontières de plaques. L'intérieur d'une plaque est au contraire très stable. C'est l'argument le plus visuel du chapitre."
      },
      {
        type: 'qcm',
        q: "Un séisme se produit à 450 km de profondeur. À quel type de frontière ?",
        choix: [
          'Une dorsale',
          'Une zone de subduction',
          'Une faille coulissante',
          'Ce n\'est pas possible'
        ],
        reponse: 1,
        explication: "Seule une zone de subduction produit des séismes aussi profonds, jusqu'à 700 km : c'est la plaque plongeante, restée rigide, qui casse en s'enfonçant. Les séismes de dorsale et de faille coulissante sont superficiels, autour de 10 km."
      },
      {
        type: 'qcm',
        q: 'Pourquoi la théorie de Wegener a-t-elle été rejetée en 1912 ?',
        choix: [
          'Ses observations étaient fausses',
          'Il ne pouvait pas expliquer le mécanisme du déplacement',
          'Il n\'avait aucune preuve',
          'Les fossiles le contredisaient'
        ],
        reponse: 1,
        explication: "Ses observations étaient justes : côtes emboîtables, fossiles identiques, chaînes continues. Ce qui manquait, c'était le mécanisme. En sciences, constater un fait ne suffit pas : il faut aussi dire par quoi il est produit. Les années 1960 ont fourni ce mécanisme."
      },
      {
        type: 'qcm',
        q: "Deux plaques <strong>continentales</strong> entrent en collision. Que se forme-t-il ?",
        choix: [
          'Une fosse océanique',
          'Une dorsale',
          'Une chaîne de montagnes',
          'Un volcan sous-marin'
        ],
        reponse: 2,
        explication: "Aucune des deux n'est assez dense pour plonger : la croûte se plisse et s'épaissit, formant une chaîne de montagnes. C'est l'origine de l'Himalaya, né de la rencontre entre la plaque indienne et la plaque eurasiatique."
      },
      {
        type: 'saisie',
        q: "Comment s'appelle la couche déformable sur laquelle glissent les plaques ?",
        reponses: ['asthenosphere', 'asthénosphère', "l'asthénosphère", "l'asthenosphere"],
        explication: "L'asthénosphère est la partie du manteau située sous la lithosphère. Elle reste solide, mais se déforme plus facilement : c'est sur elle que glissent les plaques rigides."
      },
      {
        type: 'qcm',
        q: "Quelle roche compose principalement la <strong>croûte continentale</strong> ?",
        choix: ['Le basalte', 'Le granite', 'Le calcaire', 'Le sel'],
        reponse: 1,
        explication: "Le granite, moins dense que le basalte de la croûte océanique. Cette différence de densité explique que la plaque continentale ne plonge jamais : quand deux continents se rencontrent, ils se plissent en montagnes."
      },
      {
        type: 'qcm',
        q: "Comment appelle-t-on la fosse très profonde qui se creuse là où une plaque plonge ?",
        choix: ['Une dorsale', 'Une faille', 'Une fosse océanique', 'Un rift'],
        reponse: 2,
        explication: "Une fosse océanique. Celle du Japon dépasse 8 000 m de profondeur. Elle marque l'endroit précis où la plaque océanique commence à s'enfoncer sous l'autre plaque."
      },
      {
        type: 'saisie',
        q: "Combien de kilomètres fait environ le rayon de la Terre ?",
        reponses: ['6370', '6 370', '6370 km', '6 370 km', '6400', '6 400'],
        explication: "Environ 6 370 km. À comparer au forage le plus profond jamais réalisé, 12 km : on n'a donc jamais traversé la croûte. Tout ce qu'on sait de l'intérieur vient des ondes sismiques."
      },
      {
        type: 'vraifaux',
        q: "La lithosphère et la croûte désignent la même chose.",
        reponse: false,
        explication: "Faux. La croûte se définit par sa composition ; la lithosphère par son comportement mécanique. La lithosphère, rigide et épaisse d'environ 100 km, comprend la croûte ET le sommet du manteau. C'est elle qui est découpée en plaques."
      },
      {
        type: 'qcm',
        q: "La mer Rouge s'élargit d'environ 1,5 cm par an. Quel type de frontière s'y trouve ?",
        choix: ['Convergente', 'Divergente', 'Coulissante', 'Aucune'],
        reponse: 1,
        explication: "Une frontière divergente : les deux rives s'écartent et de la croûte océanique neuve se forme entre elles. Si le mouvement continue, la mer Rouge deviendra un océan. On assiste en direct à la naissance d'un océan."
      }
    ]
  },

  'histoire-geo/H1': {
    titre: 'Négoces internationaux et traite négrière',
    items: [
      {
        type: 'qcm',
        q: "D'où part le navire dans le <strong>commerce triangulaire</strong> ?",
        choix: ["D'Afrique", "D'Europe", "D'Amérique", "Des Antilles"],
        reponse: 1,
        explication: "Le navire part d'un port européen, comme Nantes ou Liverpool, chargé d'armes, de tissus, d'alcool et de verroterie. Il échange ces marchandises en Afrique, vend les captifs en Amérique, et rentre en Europe chargé de produits coloniaux."
      },
      {
        type: 'qcm',
        q: "Que transporte le navire lors du trajet <strong>Afrique vers Amérique</strong> ?",
        choix: ['Des armes et des tissus', 'Du sucre et du café', 'Des personnes capturées et réduites en esclavage', 'De l\'or'],
        reponse: 2,
        explication: "C'est le « passage du milieu », une traversée de six à dix semaines. Environ 13 % des personnes embarquées n'y survivent pas. Les armes et les tissus correspondent au premier trajet, le sucre et le café au troisième."
      },
      {
        type: 'saisie',
        q: 'Quel est le premier port négrier français au XVIIIᵉ siècle ?',
        reponses: ['Nantes', 'nantes'],
        explication: "Nantes arme environ 1 400 expéditions négrières entre 1700 et 1792, qui déportent près de 450 000 personnes. Bordeaux, La Rochelle et Le Havre participent aussi à ce commerce. Liverpool est le premier port négrier d'Europe."
      },
      {
        type: 'saisie',
        q: 'En quelle année le <strong>Code noir</strong> est-il promulgué ?',
        reponses: ['1685'],
        explication: "Le Code noir est promulgué en 1685 par Louis XIV. Il qualifie les personnes réduites en esclavage de biens meubles, c'est-à-dire d'objets pouvant être vendus, donnés ou hérités. Il organise et légalise l'esclavage dans les colonies françaises."
      },
      {
        type: 'qcm',
        q: "Quel statut juridique le Code noir donne-t-il aux personnes réduites en esclavage ?",
        choix: ['Celui de travailleur sous contrat', 'Celui de bien meuble', 'Celui de mineur', 'Celui d\'étranger'],
        reponse: 1,
        explication: "Le statut de bien meuble : la personne est juridiquement un objet mobilier, qui entre dans une succession et se partage entre héritiers comme un meuble. C'est la négation par la loi de son humanité."
      },
      {
        type: 'vraifaux',
        q: "L'esclavage n'a été aboli qu'une seule fois en France, en 1848.",
        reponse: false,
        explication: "Faux. Il y a eu deux abolitions : une première en 1794 par la Convention, annulée par le rétablissement de l'esclavage en 1802 sous Bonaparte, puis l'abolition définitive de 1848. C'est l'erreur la plus fréquente du chapitre."
      },
      {
        type: 'saisie',
        q: "En quelle année <strong>Haïti</strong> devient-elle indépendante ?",
        reponses: ['1804'],
        explication: "En 1804, au terme d'une révolte commencée en 1791 et menée notamment par Toussaint Louverture. Haïti est la première république née d'une révolte d'esclaves victorieuse, 44 ans avant l'abolition définitive en France."
      },
      {
        type: 'qcm',
        q: "Qu'est-ce que le <strong>marronnage</strong> ?",
        choix: [
          'Une culture coloniale',
          'La fuite hors de la plantation',
          'Un impôt payé par les colons',
          'Le nom du voyage transatlantique'
        ],
        reponse: 1,
        explication: "Le marronnage est la fuite d'une personne réduite en esclavage hors de la plantation. Les « marrons » formaient parfois des communautés autonomes dans les montagnes ou les forêts. C'est l'une des formes de résistance, avec le sabotage, la conservation des langues et les révoltes."
      },
      {
        type: 'qcm',
        q: "Environ combien de personnes ont été déportées par la <strong>traite atlantique</strong> ?",
        choix: ['1 million', '3 millions', '12 millions', '50 millions'],
        reponse: 2,
        explication: "Environ 12 millions de personnes du XVIᵉ au XIXᵉ siècle, dont environ 1,5 million sont mortes pendant la traversée. Ces chiffres sont des estimations, établies à partir des registres de bord et des archives portuaires."
      },
      {
        type: 'vraifaux',
        q: "Le taux de mortalité de la traversée était connu des armateurs et intégré à leurs calculs.",
        reponse: true,
        explication: "Vrai, et c'est le point le plus important du chapitre. Les armateurs prévoyaient une perte d'environ un huitième et achetaient en conséquence. La mortalité n'était donc pas un accident subi, mais un coût accepté du système."
      },
      {
        type: 'qcm',
        q: "Qu'est-ce qu'une <strong>économie de plantation</strong> ?",
        choix: [
          'Une agriculture vivrière tournée vers la population locale',
          'Une colonie spécialisée dans une culture destinée à l\'exportation',
          'Un commerce entre colonies voisines',
          'Une exploitation minière'
        ],
        reponse: 1,
        explication: "La colonie ne produit qu'une ou deux cultures, destinées à la métropole, et ne produit pas sa propre nourriture : elle dépend entièrement de l'extérieur. Ce système enrichit les ports européens, pas les territoires qui produisent."
      },
      {
        type: 'qcm',
        q: "Quelle colonie produisait à elle seule environ 40 % du sucre mondial en 1789 ?",
        choix: ['La Martinique', 'La Jamaïque', 'Saint-Domingue', 'Le Brésil'],
        reponse: 2,
        explication: "Saint-Domingue, l'actuelle Haïti, était alors la colonie la plus riche du monde : environ 40 % du sucre et 60 % du café mondiaux, avec 500 000 personnes réduites en esclavage pour 30 000 colons. Elle représentait les deux tiers du commerce extérieur français."
      },
      {
        type: 'qcm',
        q: "Devant un document historique, quelle question rapporte le plus de points et s'oublie le plus souvent ?",
        choix: [
          'Quelle est sa nature ?',
          'Qui en est l\'auteur ?',
          'Dans quel but a-t-il été produit ?',
          'De quand date-t-il ?'
        ],
        reponse: 2,
        explication: "La question du but. Un registre de bord de navire négrier n'a pas été écrit pour dénoncer, mais pour compter : c'est précisément ce qui en fait une source fiable. Dire pourquoi un document a été produit change la lecture qu'on en fait."
      },
      {
        type: 'vraifaux',
        q: "L'indemnisation prévue par l'abolition de 1848 a été versée aux personnes libérées.",
        reponse: false,
        explication: "Faux. Elle a été versée aux anciens propriétaires, pour la perte de leur « bien ». Cette asymétrie, les exploitants dédommagés et les victimes non, est au cœur des débats actuels sur la mémoire de l'esclavage et les réparations."
      },
      {
        type: 'qcm',
        q: "Pourquoi l'abolition n'arrive-t-elle qu'après la Révolution, alors que les philosophes critiquent l'esclavage dès 1748 ?",
        choix: [
          'Parce que leurs textes étaient interdits',
          'Parce que la traite représentait une part énorme de la richesse française',
          'Parce que personne ne les lisait',
          'Parce que le roi y était favorable'
        ],
        reponse: 1,
        explication: "Saint-Domingue représentait à elle seule les deux tiers du commerce extérieur français, et les ports de Nantes, Bordeaux et La Rochelle en vivaient. Les intérêts économiques ont longtemps résisté aux arguments moraux : il a fallu la Révolution et la révolte de 1791."
      },
      {
        type: 'saisie',
        q: "En quelle année a lieu la <strong>première</strong> abolition de l'esclavage en France ?",
        reponses: ['1794'],
        explication: "1794, votée par la Convention. Elle est annulée en 1802 par le rétablissement de l'esclavage sous Bonaparte. L'abolition définitive n'arrive qu'en 1848, portée par Victor Schœlcher."
      },
      {
        type: 'qcm',
        q: "Quel est le premier port négrier d'<strong>Europe</strong> ?",
        choix: ['Nantes', 'Bordeaux', 'Liverpool', 'Lisbonne'],
        reponse: 2,
        explication: "Liverpool est le premier port négrier européen. Nantes est le premier port négrier français, avec environ 1 400 expéditions armées entre 1700 et 1792."
      },
      {
        type: 'qcm',
        q: "Dans la cale d'un navire négrier, chaque personne disposait d'environ…",
        choix: ['2 m² et pouvait se lever', '0,64 m² sans pouvoir se redresser', '4 m² partagés à deux', 'une cabine individuelle'],
        reponse: 1,
        explication: "Environ 40 cm sur 160 cm, soit 0,64 m², sans possibilité de se redresser. C'est près de trois fois moins qu'un lit d'une place. Cette organisation visait à maximiser le nombre de personnes embarquées par voyage."
      },
      {
        type: 'qcm',
        q: "Qui dirige la révolte de Saint-Domingue de 1791 ?",
        choix: ['Victor Schœlcher', 'Toussaint Louverture', 'Condorcet', 'Olaudah Equiano'],
        reponse: 1,
        explication: "Toussaint Louverture est l'une des principales figures de cette révolte, qui aboutit en 1804 à l'indépendance d'Haïti. Schœlcher porte l'abolition française de 1848 ; Condorcet et Equiano sont des abolitionnistes du XVIIIᵉ siècle."
      },
      {
        type: 'qcm',
        q: "Que dit la loi Taubira de <strong>2001</strong> ?",
        choix: [
          "Elle abolit l'esclavage",
          "Elle reconnaît la traite et l'esclavage comme crime contre l'humanité",
          "Elle indemnise les anciens propriétaires",
          "Elle interdit la traite"
        ],
        reponse: 1,
        explication: "La loi Taubira de 2001 reconnaît la traite transatlantique et l'esclavage comme un crime contre l'humanité. L'abolition date de 1848, l'interdiction de la traite de 1815, et l'indemnisation de 1848 a été versée aux anciens propriétaires."
      }
    ]
  },

  'emc/L01': {
    titre: 'Les libertés fondamentales',
    items: [
      {
        type: 'qcm',
        q: "D'après l'article 4 de la Déclaration de 1789, la liberté consiste à pouvoir faire…",
        choix: [
          'tout ce que l\'on veut',
          'tout ce qui ne nuit pas à autrui',
          'tout ce que la loi autorise expressément',
          'tout ce que le maire permet'
        ],
        reponse: 1,
        explication: "« La liberté consiste à pouvoir faire tout ce qui ne nuit pas à autrui. » La liberté est donc très large par principe, et ce sont les limites qui doivent être justifiées, pas la liberté elle-même."
      },
      {
        type: 'qcm',
        q: "Qui seul peut fixer les limites à une liberté fondamentale ?",
        choix: ['Le maire', 'Le préfet', 'La loi', "Le chef d'établissement"],
        reponse: 2,
        explication: "L'article 4 est explicite : « Ces bornes ne peuvent être déterminées que par la loi. » Un maire ou un préfet peuvent prendre des mesures locales, mais seulement dans le cadre fixé par la loi, et leurs décisions sont contrôlables par le juge."
      },
      {
        type: 'qcm',
        q: "La liberté d'association est une liberté…",
        choix: ['individuelle', 'collective', 'ni l\'une ni l\'autre', 'réservée aux majeurs'],
        reponse: 1,
        explication: "Elle est collective, parce qu'elle suppose d'être plusieurs pour l'exercer. Les libertés individuelles s'exercent seul : liberté de conscience, liberté d'aller et venir, droit à la vie privée."
      },
      {
        type: 'vraifaux',
        q: "Une limite à une liberté est toujours une atteinte injustifiée.",
        reponse: false,
        explication: "Faux. Une limite prévue par la loi, poursuivant un but légitime comme l'ordre public ou les droits d'autrui, et proportionnée, est parfaitement légitime. Ce qui compte n'est pas l'existence de la limite, mais sa justification."
      },
      {
        type: 'qcm',
        q: "Que signifie qu'une limite est <strong>proportionnée</strong> ?",
        choix: [
          'Qu\'elle est votée à la majorité',
          'Qu\'elle atteint son but sans aller au-delà de ce qui est nécessaire',
          'Qu\'elle s\'applique à tout le monde',
          'Qu\'elle est temporaire'
        ],
        reponse: 1,
        explication: "La proportionnalité est le critère que le juge examine le plus souvent. S'il existe une mesure moins restrictive qui produirait le même résultat, la limite choisie n'est pas proportionnée et peut être annulée."
      },
      {
        type: 'vraifaux',
        q: "Il faut une autorisation pour organiser une manifestation en France.",
        reponse: false,
        explication: "Faux. Il faut une déclaration préalable en préfecture, en général trois jours avant, et non une autorisation. La différence est essentielle : l'administration organise la sécurité, mais ne peut pas refuser une manifestation parce qu'elle en désapprouve le motif."
      },
      {
        type: 'qcm',
        q: "La liberté d'expression protège-t-elle l'<strong>injure</strong> ?",
        choix: [
          'Oui, tout peut se dire',
          'Non, ni l\'injure, ni la diffamation, ni l\'appel à la haine',
          'Oui, sauf sur Internet',
          'Cela dépend de la personne visée'
        ],
        reponse: 1,
        explication: "L'injure, la diffamation, l'appel à la haine et l'apologie du terrorisme ne sont pas protégés : ils portent atteinte aux droits d'autrui ou à la sécurité. En revanche, une opinion qui choque ou qui dérange reste protégée."
      },
      {
        type: 'saisie',
        q: "Comment s'appelle la procédure d'urgence permettant de saisir le juge en 48 heures ?",
        reponses: ['refere-liberte', 'référé-liberté', 'le référé-liberté', 'refere liberte', 'référé liberté'],
        explication: "Le référé-liberté permet à toute personne de saisir le juge administratif quand une autorité publique porte une atteinte grave et manifestement illégale à une liberté fondamentale. Le juge doit statuer dans les 48 heures."
      },
      {
        type: 'qcm',
        q: "En août 2016, le Conseil d'État a suspendu des arrêtés municipaux interdisant certaines tenues sur les plages. Sur quel raisonnement ?",
        choix: [
          'Un maire ne peut jamais limiter une liberté',
          'Il n\'existait pas de risque avéré pour l\'ordre public',
          'Les arrêtés n\'étaient pas affichés',
          'La loi l\'interdisait expressément'
        ],
        reponse: 1,
        explication: "Le Conseil d'État a jugé qu'un maire ne peut restreindre une liberté fondamentale que s'il existe un risque avéré pour l'ordre public, ce qui n'était pas démontré. Cet exemple montre qu'une autorité publique n'a jamais le dernier mot."
      },
      {
        type: 'qcm',
        q: "Un journal publie des photos d'une personne célèbre chez elle. Quel critère le juge examine-t-il ?",
        choix: [
          'La notoriété de la personne',
          'Si l\'information relève du débat d\'intérêt général',
          'Le tirage du journal',
          'L\'accord des voisins'
        ],
        reponse: 1,
        explication: "Le juge regarde si l'information participe au débat d'intérêt général. Une photo prise dans un cadre privé, sans lien avec les fonctions publiques de la personne, n'en relève pas : la vie privée l'emporte alors sur la liberté de la presse."
      },
      {
        type: 'qcm',
        q: "Un cortège bloque un axe routier. Quelle est la bonne façon de traiter ce conflit de libertés ?",
        choix: [
          'Interdire la manifestation',
          'Interdire la circulation définitivement',
          'Aménager : parcours déclaré, horaires, déviations',
          'Laisser les deux groupes s\'arranger'
        ],
        reponse: 2,
        explication: "On cherche un arbitrage proportionné qui préserve autant que possible les deux libertés. Une interdiction totale supprimerait une liberté fondamentale là où un aménagement suffit : elle serait disproportionnée."
      },
      {
        type: 'vraifaux',
        q: "« Je trouve que c'est injuste » est un argument recevable en EMC.",
        reponse: false,
        explication: "Faux. Un ressenti n'est pas un argument. Un argument s'appuie sur un principe, sur un texte, ou sur une conséquence concrète. « Cette mesure n'est pas proportionnée, car un aménagement d'horaires aurait suffi », voilà un argument."
      },
      {
        type: 'qcm',
        q: "Combien de temps le juge a-t-il pour répondre à un référé-liberté ?",
        choix: ['24 heures', '48 heures', 'Une semaine', 'Un mois'],
        reponse: 1,
        explication: "48 heures. Ce délai très court est ce qui rend la procédure utile : une atteinte à une liberté qui ne serait jugée que des mois plus tard aurait déjà produit tous ses effets."
      },
      {
        type: 'qcm',
        q: "Dans un argument complet en EMC, que vient-il après l'exemple ?",
        choix: ['La conclusion', "L'objection", 'Une citation', 'Le résumé'],
        reponse: 1,
        explication: "Les cinq temps sont : position, argument, exemple, objection, réponse à l'objection. Envisager l'objection est ce qui distingue un raisonnement d'une opinion assénée, et c'est souvent ce qui manque."
      },
      {
        type: 'vraifaux',
        q: "En EMC, deux élèves d'avis opposés peuvent obtenir la même excellente note.",
        reponse: true,
        explication: "Vrai. On n'évalue pas l'opinion mais la qualité du raisonnement : la position est-elle claire, l'argument est-il autre chose qu'un ressenti, l'objection est-elle prise au sérieux. C'est la règle du jeu de la matière."
      },
      {
        type: 'qcm',
        q: "En quelle année a été adoptée la <strong>Déclaration des droits de l'homme et du citoyen</strong> ?",
        choix: ['1789', '1848', '1948', '1958'],
        reponse: 0,
        explication: "1789. Elle a aujourd'hui valeur constitutionnelle en France. La Déclaration universelle des droits de l'homme date de 1948, et la Constitution de la Vᵉ République de 1958."
      },
      {
        type: 'qcm',
        q: "La liberté de <strong>conscience</strong> est une liberté…",
        choix: ['individuelle', 'collective', 'réservée aux majeurs', 'suspendue en cas de crise'],
        reponse: 0,
        explication: "Individuelle : elle s'exerce seul. Les libertés collectives supposent d'être plusieurs : réunion, association, manifestation, liberté syndicale."
      },
      {
        type: 'qcm',
        q: "Quel motif de limitation n'est <strong>pas</strong> reconnu comme légitime ?",
        choix: [
          "Protéger l'ordre public",
          "Protéger la santé publique",
          "Éviter qu'une opinion ne choque",
          "Protéger les droits d'autrui"
        ],
        reponse: 2,
        explication: "Choquer n'est pas nuire. Une opinion qui dérange reste protégée : c'est même le cœur de la liberté d'expression. Les motifs légitimes sont l'ordre public, la santé publique, les droits d'autrui et la protection des mineurs."
      },
      {
        type: 'qcm',
        q: "Qui vérifie qu'une <strong>loi</strong> respecte la Constitution ?",
        choix: ['Le Conseil d\'État', 'Le Conseil constitutionnel', 'Le préfet', 'Le Parlement lui-même'],
        reponse: 1,
        explication: "Le Conseil constitutionnel. Le Conseil d'État, lui, est la plus haute juridiction administrative : il contrôle les décisions des autorités publiques, comme les arrêtés d'un maire ou d'un préfet."
      },
      {
        type: 'vraifaux',
        q: "Une mesure de police qui limite une liberté peut être de durée indéterminée.",
        reponse: false,
        explication: "Faux. Une mesure de police doit être limitée dans le temps et dans l'espace, et rester proportionnée. Une interdiction générale et permanente transforme une réponse à une gêne ponctuelle en suppression durable d'une liberté."
      }
    ]
  },

  'anglais-lv1/L01': {
    titre: 'Talking about the future',
    items: [
      {
        type: 'qcm',
        q: 'Complète : <strong>He ……… come tomorrow.</strong>',
        choix: ['wills', 'will', 'will to', 'is will'],
        reponse: 1,
        explication: "will est invariable : il ne prend jamais de s, quelle que soit la personne. On dit he will come, exactement comme I will come. Et jamais de to après will."
      },
      {
        type: 'qcm',
        q: 'Quelle phrase est correcte ?',
        choix: ['I will to help you.', 'I will helping you.', 'I will help you.', 'I will helps you.'],
        reponse: 2,
        explication: "Après will, on emploie la base verbale seule : ni to, ni -ing, ni -s. La bonne forme est I will help you, souvent contractée en I'll help you."
      },
      {
        type: 'saisie',
        q: "Quelle est la contraction négative de <strong>will not</strong> ?",
        reponses: ["won't", 'wont', 'will not'],
        explication: "La contraction est won't. La forme willn't n'existe pas en anglais : c'est l'une des irrégularités à mémoriser telle quelle."
      },
      {
        type: 'qcm',
        q: 'Complète : <strong>Look at those clouds! It ……… rain.</strong>',
        choix: ['will', 'is going to', 'is raining', 'rains'],
        reponse: 1,
        explication: "Il y a un indice visible sous les yeux, les nuages : on emploie be going to. Avec will, on exprimerait une simple opinion, comme dans I think it will rain tomorrow, où l'on n'a aucune preuve."
      },
      {
        type: 'qcm',
        q: 'Complète : <strong>The phone is ringing. I ……… answer it.</strong>',
        choix: ["'ll", "'m going to", "'m answering", 'answer'],
        reponse: 0,
        explication: "La décision est prise à l'instant, pendant la conversation : c'est exactement le rôle de will. Avec be going to, on dirait que la décision était déjà prise avant que le téléphone ne sonne, ce qui n'a pas de sens ici."
      },
      {
        type: 'qcm',
        q: "Quelle forme pour : « Je vois le dentiste demain à 15 h, le rendez-vous est pris » ?",
        choix: [
          'I will see the dentist at 3 p.m.',
          "I'm going to see the dentist at 3 p.m.",
          "I'm seeing the dentist at 3 p.m.",
          'I see the dentist at 3 p.m.'
        ],
        reponse: 2,
        explication: "Un rendez-vous fixé avec une heure précise appelle le présent continu à valeur de futur. C'est la forme la plus proche du français « je vois le dentiste à 15 h »."
      },
      {
        type: 'vraifaux',
        q: "On peut écrire « gonna » dans un devoir d'anglais.",
        reponse: false,
        explication: "Faux. gonna est une prononciation relâchée de going to, correcte à l'oral et dans les chansons, mais comptée comme une faute à l'écrit scolaire. On écrit toujours going to."
      },
      {
        type: 'qcm',
        q: '<strong>Will you come? </strong>Quelle est la bonne réponse courte affirmative ?',
        choix: ['Yes, I come.', 'Yes, I will come.', 'Yes, I will.', 'Yes, I am.'],
        reponse: 2,
        explication: "La réponse courte reprend uniquement l'auxiliaire de la question, ici will, sans répéter le verbe principal. Avec une question en Are you going to…, on répondrait Yes, I am."
      },
      {
        type: 'qcm',
        q: 'Complète : <strong>……… she going to travel next year?</strong>',
        choix: ['Do', 'Is', 'Will', 'Does'],
        reponse: 1,
        explication: "Dans la structure be going to, c'est l'auxiliaire be qui passe devant le sujet pour former la question : Is she going to travel? On ne fait jamais appel à do dans cette construction."
      },
      {
        type: 'saisie',
        q: 'Traduis en anglais : <strong>après-demain</strong>.',
        reponses: ['the day after tomorrow', 'day after tomorrow'],
        explication: "the day after tomorrow, littéralement « le jour après demain ». L'anglais n'a pas de mot unique comme le français : il faut retenir l'expression entière."
      },
      {
        type: 'qcm',
        q: "Quelle est la différence entre <strong>in two days</strong> et <strong>within two days</strong> ?",
        choix: [
          'Aucune',
          'in = au bout de deux jours ; within = avant la fin du deuxième jour',
          'in = avant deux jours ; within = après deux jours',
          'within ne s\'emploie pas avec une durée'
        ],
        reponse: 1,
        explication: "in two days veut dire « dans deux jours », au bout de ce délai. within two days veut dire « sous deux jours », donc avant la fin du deuxième. Cette nuance revient souvent dans les consignes et les annonces."
      },
      {
        type: 'qcm',
        q: 'Mets à la forme négative : <strong>We are meeting them at seven.</strong>',
        choix: [
          "We don't meeting them at seven.",
          "We aren't meeting them at seven.",
          "We won't meeting them at seven.",
          'We not are meeting them at seven.'
        ],
        reponse: 1,
        explication: "Le not se place après l'auxiliaire are, ce qui donne aren't. On peut aussi écrire We're not meeting them at seven. L'auxiliaire do n'intervient jamais dans une forme en be + -ing."
      },
      {
        type: 'vraifaux',
        q: "« I'm going. » suffit à exprimer un futur.",
        reponse: false,
        explication: "Faux. Le présent continu n'a valeur de futur que s'il est accompagné d'un moment précis : I'm going at 6 p.m., I'm going on Monday. Sans cette indication, la phrase se comprend comme un présent : « je pars, là, maintenant »."
      },
      {
        type: 'qcm',
        q: "Première question à se poser pour choisir la forme du futur ?",
        choix: [
          'Le verbe est-il régulier ?',
          'Y a-t-il un rendez-vous fixé avec une heure ou une date ?',
          'La phrase est-elle longue ?',
          'Le sujet est-il à la troisième personne ?'
        ],
        reponse: 1,
        explication: "L'arbre de décision commence toujours par le rendez-vous fixé, qui appelle le présent continu. Si la réponse est non, on demande si la décision était déjà prise, ce qui appelle be going to. Sinon, c'est will."
      },
      {
        type: 'qcm',
        q: "Traduis : <strong>I'm looking forward to it.</strong>",
        choix: [
          'Je regarde devant moi.',
          "J'ai hâte.",
          'Je cherche quelque chose.',
          "Je m'en occupe."
        ],
        reponse: 1,
        explication: "to look forward to signifie « attendre avec impatience », « avoir hâte ». C'est une formule très fréquente en fin de lettre ou de message : I'm looking forward to hearing from you."
      },
      {
        type: 'qcm',
        q: 'Complète : <strong>I think it ……… be sunny tomorrow.</strong>',
        choix: ['is going to', 'will', 'is', 'am going to'],
        reponse: 1,
        explication: "La présence de I think signale une opinion, sans preuve visible : c'est will. On emploierait be going to seulement devant un indice présent sous les yeux, comme des nuages qui s'amoncellent."
      },
      {
        type: 'saisie',
        q: 'Traduis : <strong>la semaine prochaine</strong>.',
        reponses: ['next week'],
        explication: "next week, sans article ni préposition : on dit I'm leaving next week, et non in the next week. Même construction pour next month, next year, next summer."
      },
      {
        type: 'qcm',
        q: 'Quelle phrase est <strong>incorrecte</strong> ?',
        choix: [
          "I'm meeting Sarah at 6 p.m.",
          "I'm going to learn Japanese.",
          "Look! It will rain.",
          "I'll answer the phone."
        ],
        reponse: 2,
        explication: "Look! signale un indice visible : il faut donc be going to, soit Look! It's going to rain. Les trois autres phrases sont correctes, chacune avec la forme adaptée à sa situation."
      },
      {
        type: 'qcm',
        q: 'Réponds brièvement : <strong>Are they going to come?</strong> (non)',
        choix: ["No, they don't.", "No, they aren't.", "No, they won't.", "No, they not."],
        reponse: 1,
        explication: "La réponse courte reprend l'auxiliaire de la question. Ici l'auxiliaire est are, donc No, they aren't, ou No, they're not. won't répondrait à une question en Will they…"
      },
      {
        type: 'qcm',
        q: "Quelle forme pour : « <strong>Nous partons pour Londres lundi, les billets sont pris</strong> » ?",
        choix: [
          "We will fly to London on Monday.",
          "We're going to fly to London on Monday.",
          "We're flying to London on Monday.",
          "We fly to London on Monday."
        ],
        reponse: 2,
        explication: "Les billets sont pris et la date est fixée : c'est un rendez-vous, donc le présent continu. be going to conviendrait pour une intention sans date, et will pour une décision prise à l'instant."
      }
    ]
  },

  'espagnol-lv2/L01': {
    titre: 'Presentarse y la vida cotidiana',
    items: [
      {
        type: 'qcm',
        q: 'Traduis : <strong>J\'ai treize ans.</strong>',
        choix: ['Soy trece años.', 'Tengo trece años.', 'Estoy trece años.', 'Hago trece años.'],
        reponse: 1,
        explication: "Pour l'âge, l'espagnol emploie tener, comme le français emploie avoir. L'erreur vient souvent de l'anglais, où l'on dit I am thirteen. En espagnol, ser ne sert jamais à dire l'âge."
      },
      {
        type: 'saisie',
        q: 'Conjugue <strong>hablar</strong> à la première personne du singulier.',
        reponses: ['hablo', 'yo hablo'],
        explication: "hablo. Le radical est habl-, obtenu en retirant -ar, et la terminaison de yo au premier groupe est -o. Le pronom yo est facultatif : la terminaison suffit à dire qui parle."
      },
      {
        type: 'qcm',
        q: 'Complète : <strong>Nosotros ……… en España.</strong> (vivir)',
        choix: ['vivemos', 'vivimos', 'vivamos', 'vivemos'],
        reponse: 1,
        explication: "vivimos. C'est justement à nosotros que les groupes en -er et en -ir diffèrent : comemos contre vivimos. Partout ailleurs, leurs terminaisons sont identiques."
      },
      {
        type: 'qcm',
        q: 'Traduis : <strong>Il est une heure.</strong>',
        choix: ['Son las una.', 'Es la una.', 'Es las una.', 'Son la una.'],
        reponse: 1,
        explication: "Es la una, au singulier, parce que una est un singulier. Pour toutes les autres heures, on emploie le pluriel : son las dos, son las tres. C'est la faute la plus fréquente sur cette partie."
      },
      {
        type: 'saisie',
        q: 'Traduis : <strong>Il est trois heures et demie.</strong>',
        reponses: ['son las tres y media', 'Son las tres y media'],
        explication: "Son las tres y media. Le pluriel son las s'impose dès qu'il ne s'agit pas d'une heure. « Et quart » se dit y cuarto, « moins le quart » menos cuarto."
      },
      {
        type: 'qcm',
        q: 'Où se place le pronom dans <strong>« je me lève »</strong> ?',
        choix: ['Levanto me.', 'Me levanto.', 'Levantome.', 'Se levanto.'],
        reponse: 1,
        explication: "Me levanto : le pronom se place avant le verbe conjugué. En revanche, après un infinitif, il se colle à la fin : voy a levantarme. Ce double fonctionnement est la principale difficulté du chapitre."
      },
      {
        type: 'qcm',
        q: 'Traduis : <strong>Je vais me coucher.</strong>',
        choix: ['Voy a me acostar.', 'Me voy a acostar me.', 'Voy a acostarme.', 'Voy acostar me.'],
        reponse: 2,
        explication: "Voy a acostarme. Après un infinitif, le pronom se colle à la fin du verbe, en un seul mot. La forme me voy a acostar existe aussi, mais acostarme est la construction à retenir en priorité."
      },
      {
        type: 'vraifaux',
        q: "En espagnol, on doit toujours écrire le pronom sujet devant le verbe.",
        reponse: false,
        explication: "Faux. Le pronom sujet s'omet le plus souvent, parce que la terminaison du verbe suffit à dire qui parle : on dit hablo español, pas yo hablo español. On ne le met que pour insister ou pour lever une ambiguïté."
      },
      {
        type: 'qcm',
        q: 'Que signifie <strong>mañana por la mañana</strong> ?',
        choix: ['Ce matin', 'Demain matin', 'Tous les matins', 'Hier matin'],
        reponse: 1,
        explication: "Demain matin. mañana sans article signifie « demain », la mañana avec article signifie « le matin ». La répétition n'est donc pas une erreur : elle combine les deux sens."
      },
      {
        type: 'qcm',
        q: "Quelle est la différence entre <strong>¿por qué?</strong> et <strong>porque</strong> ?",
        choix: [
          'Aucune, c\'est une variante orthographique',
          '¿Por qué? pose la question, porque donne la réponse',
          'porque pose la question, ¿por qué? y répond',
          'Le premier s\'emploie à l\'écrit, le second à l\'oral'
        ],
        reponse: 1,
        explication: "¿Por qué? en deux mots et avec accent signifie « pourquoi ? ». porque en un mot et sans accent signifie « parce que ». ¿Por qué estudias español? Porque me gusta."
      },
      {
        type: 'qcm',
        q: 'Complète : <strong>Ella ……… francesa.</strong>',
        choix: ['tiene', 'es', 'está', 'hay'],
        reponse: 1,
        explication: "Es : la nationalité et l'identité se disent avec ser. On réserve tener à l'âge et à la possession. Ella es francesa, mais ella tiene catorce años."
      },
      {
        type: 'saisie',
        q: "Traduis : <strong>Comment t'appelles-tu ?</strong> (avec les signes)",
        reponses: ['¿Cómo te llamas?', '¿Como te llamas?', '¿Cómo te llamas ?'],
        explication: "¿Cómo te llamas? Ne pas oublier le signe ouvrant ¿ ni l'accent sur cómo. Tous les mots interrogatifs portent un accent écrit, qui ne change pas la prononciation mais signale la question."
      },
      {
        type: 'qcm',
        q: "Quelle phrase demande l'horaire d'une action ?",
        choix: ['¿Qué hora es?', '¿A qué hora te levantas?', '¿Cuántos años tienes?', '¿Dónde vives?'],
        reponse: 1,
        explication: "¿A qué hora…? demande à quelle heure a lieu une action, et la réponse commence par a las : me levanto a las siete. ¿Qué hora es? demande seulement l'heure qu'il est."
      },
      {
        type: 'qcm',
        q: "Conjugue le verbe inconnu <strong>beber</strong> (boire) à <strong>tú</strong>.",
        choix: ['bebas', 'bebes', 'bebis', 'beber'],
        reponse: 1,
        explication: "bebes. beber se termine par -er, le radical est beb-, et la terminaison de tú au deuxième groupe est -es. La méthode fonctionne pour tout verbe régulier, même rencontré pour la première fois."
      },
      {
        type: 'qcm',
        q: 'Traduis : <strong>Nous nous réveillons.</strong>',
        choix: ['Nos despertamos.', 'Se despertamos.', 'Despertamos nos.', 'Me despertamos.'],
        reponse: 0,
        explication: "Nos despertamos. Le pronom change avec la personne : me, te, se, nos, os, se. À nosotros, c'est nos, et il se place avant le verbe conjugué."
      },
      {
        type: 'saisie',
        q: 'Conjugue <strong>comer</strong> à la personne <strong>nosotros</strong>.',
        reponses: ['comemos', 'nosotros comemos'],
        explication: "comemos. C'est précisément à nosotros que les groupes en -er et en -ir se distinguent : comemos contre vivimos. Partout ailleurs, leurs terminaisons sont identiques."
      },
      {
        type: 'qcm',
        q: 'Traduis : <strong>Il est quatre heures moins le quart.</strong>',
        choix: [
          'Son las cuatro menos cuarto.',
          'Es la cuatro menos cuarto.',
          'Son las tres y cuarenta y cinco.',
          'Son las cuatro y cuarto.'
        ],
        reponse: 0,
        explication: "Son las cuatro menos cuarto : l'espagnol exprime 15 h 45 comme « quatre heures moins le quart », exactement comme le français. Le pluriel son las s'impose dès qu'il ne s'agit pas d'une heure."
      },
      {
        type: 'saisie',
        q: 'Traduis : <strong>Où habites-tu ?</strong> (avec les signes)',
        reponses: ['¿Dónde vives?', '¿Donde vives?', '¿Dónde vives ?'],
        explication: "¿Dónde vives? Ne pas oublier le signe ouvrant ¿ ni l'accent sur dónde. Tous les mots interrogatifs portent un accent écrit, qui signale la question sans changer la prononciation."
      },
      {
        type: 'qcm',
        q: "Quel verbe emploie-t-on pour dire sa <strong>nationalité</strong> ?",
        choix: ['tener', 'ser', 'estar', 'haber'],
        reponse: 1,
        explication: "ser : ella es francesa. On réserve tener à l'âge et à la possession : ella tiene catorce años. Confondre les deux est l'erreur la plus fréquente du chapitre."
      },
      {
        type: 'qcm',
        q: "Dans un récit de journée, quel mot signifie « <strong>ensuite</strong> » ?",
        choix: ['primero', 'después', 'finalmente', 'todos los días'],
        reponse: 1,
        explication: "después. Les connecteurs à connaître sont primero (d'abord), después et luego (ensuite, puis), más tarde (plus tard) et finalmente (enfin). Ils organisent le récit et rapportent des points en production."
      }
    ]
  },

  'maths/L02': {
    titre: 'Puissances et notation scientifique',
    items: [
      {
        type: 'qcm',
        q: 'Combien vaut <strong>2⁵</strong> ?',
        choix: ['10', '25', '32', '16'],
        reponse: 2,
        explication: "2⁵ = 2 × 2 × 2 × 2 × 2 = 32. La réponse 10 confond la puissance avec la multiplication 2 × 5. Une puissance grandit beaucoup plus vite qu'un produit : c'est un bon contrôle."
      },
      {
        type: 'saisie',
        q: 'Écris <strong>3 × 3 × 3 × 3</strong> sous forme de puissance.',
        reponses: ['3^4', '3⁴', '3**4'],
        explication: "3⁴ : il y a quatre facteurs. L'exposant compte les facteurs, pas les signes de multiplication. Ici il y a quatre 3 mais seulement trois signes ×."
      },
      {
        type: 'qcm',
        q: 'Combien vaut <strong>7⁰</strong> ?',
        choix: ['0', '1', '7', "Cela n'existe pas"],
        reponse: 1,
        explication: "Toute puissance d'exposant 0, pour une base non nulle, vaut 1. Ce n'est pas arbitraire : 2³ = 8, 2² = 4, 2¹ = 2, et chaque descente divise par 2, donc 2⁰ = 2 ÷ 2 = 1."
      },
      {
        type: 'qcm',
        q: 'Combien vaut <strong>2⁻³</strong> ?',
        choix: ['-8', '-6', '0,125', '6'],
        reponse: 2,
        explication: "Un exposant négatif signale un inverse : 2⁻³ = 1/2³ = 1/8 = 0,125. Le résultat est positif. Pour obtenir un nombre négatif, il faudrait une base négative et un exposant impair."
      },
      {
        type: 'qcm',
        q: 'Combien vaut <strong>(-3)²</strong> ?',
        choix: ['-9', '+9', '-6', '+6'],
        reponse: 1,
        explication: "(-3)² = (-3) × (-3) = +9. Deux facteurs négatifs donnent un produit positif. Attention : sans les parenthèses, -3² vaut -9, parce que l'exposant ne porte alors que sur le 3."
      },
      {
        type: 'qcm',
        q: 'Combien vaut <strong>-3²</strong> ?',
        choix: ['-9', '+9', '-6', '9 ou -9 selon le contexte'],
        reponse: 0,
        explication: "Sans parenthèses, l'exposant ne gouverne que le 3 : -3² = -(3 × 3) = -9. La place des parenthèses change le résultat, et c'est le piège le plus fréquent du chapitre."
      },
      {
        type: 'saisie',
        q: 'Simplifie en une seule puissance : <strong>3⁵ × 3²</strong>.',
        reponses: ['3^7', '3⁷', '3**7'],
        explication: "Même base : on additionne les exposants, 5 + 2 = 7, donc 3⁷. Ce n'est pas une astuce mais un comptage : 3⁵ apporte cinq facteurs, 3² en apporte deux, soit sept en tout."
      },
      {
        type: 'qcm',
        q: 'Simplifie : <strong>6⁷ ÷ 6⁴</strong>.',
        choix: ['6³', '6¹¹', '6²⁸', '1³'],
        reponse: 0,
        explication: "Pour un quotient de même base, on soustrait les exposants : 7 - 4 = 3, donc 6³ = 216. La règle fonctionne aussi quand la soustraction donne un nombre négatif, ce qui produit un exposant négatif."
      },
      {
        type: 'qcm',
        q: 'Simplifie : <strong>(5²)³</strong>.',
        choix: ['5⁵', '5⁶', '5⁸', '5⁹'],
        reponse: 1,
        explication: "Une parenthèse avec un exposant à l'extérieur : on multiplie les exposants, 2 × 3 = 6, donc 5⁶. La réponse 5⁵ correspondrait à 5² × 5³, où l'on additionne. Le repère : parenthèse, on multiplie ; signe ×, on additionne."
      },
      {
        type: 'vraifaux',
        q: '<strong>2³ × 5³</strong> se simplifie en <strong>10³</strong> par la règle des puissances.',
        reponse: false,
        explication: "Faux. Les règles exigent la même base, or ici elles sont différentes. Il faut calculer : 8 × 125 = 1 000. Le résultat vaut effectivement 10³, mais par coïncidence : avec 2³ × 5², le même raisonnement donnerait un résultat faux."
      },
      {
        type: 'saisie',
        q: "Combien vaut <strong>10⁻³</strong> ? Donne l'écriture décimale.",
        reponses: ['0,001', '0.001'],
        explication: "10⁻³ = 0,001 : trois chiffres après la virgule. La règle miroir : 10ⁿ s'écrit 1 suivi de n zéros, et 10⁻ⁿ a n chiffres après la virgule."
      },
      {
        type: 'qcm',
        q: 'Combien vaut <strong>3,5 × 10³</strong> ?',
        choix: ['35', '350', '3 500', '35 000'],
        reponse: 2,
        explication: "Multiplier par 10³ décale la virgule de trois rangs vers la droite : 3,5 devient 3 500. Multiplier par 10⁻² la décalerait de deux rangs vers la gauche."
      },
      {
        type: 'qcm',
        q: 'Quelle est la notation scientifique de <strong>4 270</strong> ?',
        choix: ['42,7 × 10²', '4,27 × 10³', '0,427 × 10⁴', '427 × 10¹'],
        reponse: 1,
        explication: "La partie entière doit comporter un seul chiffre, de 1 à 9 : seul 4,27 × 10³ convient. 42,7 en a deux, 0,427 a une partie entière nulle, 427 en a trois."
      },
      {
        type: 'saisie',
        q: 'Écris <strong>0,000 45</strong> en notation scientifique. (forme a × 10^n)',
        reponses: ['4,5 × 10^-4', '4,5x10^-4', '4.5 × 10^-4', '4,5 10^-4', '4,5*10^-4', '4,5e-4'],
        explication: "Le premier chiffre non nul est le 4 : on place la virgule juste après, ce qui donne 4,5. La virgule a avancé de 4 rangs vers la droite, donc l'exposant est -4 : 4,5 × 10⁻⁴. Un nombre plus petit que 1 a toujours un exposant négatif."
      },
      {
        type: 'qcm',
        q: 'Lequel est le plus grand ?',
        choix: ['9,8 × 10⁴', '3,2 × 10⁵', 'Ils sont égaux', 'On ne peut pas savoir'],
        reponse: 1,
        explication: "L'exposant décide en premier : 5 l'emporte sur 4, donc 3,2 × 10⁵ = 320 000 est plus grand que 9,8 × 10⁴ = 98 000, même si 9,8 semble plus grand que 3,2."
      },
      {
        type: 'qcm',
        q: "Corrige cette écriture : <strong>73,5 × 10⁴</strong>.",
        choix: ['7,35 × 10³', '7,35 × 10⁵', '0,735 × 10⁵', '735 × 10³'],
        reponse: 1,
        explication: "73,5 a deux chiffres avant la virgule. On décale d'un rang vers la gauche, ce qui augmente l'exposant de 1 : 7,35 × 10⁵. Les deux écritures valent bien 735 000."
      },
      {
        type: 'qcm',
        q: 'Que vaut le préfixe <strong>nano</strong> ?',
        choix: ['10⁻³', '10⁻⁶', '10⁻⁹', '10⁹'],
        reponse: 2,
        explication: "nano vaut 10⁻⁹. milli vaut 10⁻³, micro 10⁻⁶. Un atome mesure environ 0,1 nm, soit 10⁻¹⁰ m : ce sont les mêmes puissances de 10 qu'en physique-chimie."
      },
      {
        type: 'qcm',
        q: 'Calcule : <strong>(3 × 10⁴) × (2 × 10³)</strong>.',
        choix: ['5 × 10⁷', '6 × 10⁷', '6 × 10¹²', '5 × 10¹²'],
        reponse: 1,
        explication: "On traite séparément les nombres et les puissances : 3 × 2 = 6, et 10⁴ × 10³ = 10⁷. Résultat : 6 × 10⁷. Les exposants s'additionnent, ils ne se multiplient pas."
      },
      {
        type: 'qcm',
        q: "Calcule : <strong>(5 × 10⁻³) × (6 × 10⁷)</strong>, en notation scientifique.",
        choix: ['30 × 10⁴', '3 × 10⁵', '11 × 10⁴', '3 × 10⁴'],
        reponse: 1,
        explication: "5 × 6 = 30 et 10⁻³ × 10⁷ = 10⁴, ce qui donne 30 × 10⁴. Mais 30 a deux chiffres : il faut remettre en forme, soit 3 × 10⁵. C'est l'étape qu'on oublie le plus souvent."
      },
      {
        type: 'qcm',
        q: "La lumière parcourt 3 × 10⁸ m par seconde, et le Soleil est à 1,5 × 10¹¹ m. Combien de temps met sa lumière ?",
        choix: ['50 secondes', '500 secondes', '5 000 secondes', '5 secondes'],
        reponse: 1,
        explication: "Temps = distance ÷ vitesse = (1,5 × 10¹¹) ÷ (3 × 10⁸). On sépare : 1,5 ÷ 3 = 0,5 et 10¹¹ ÷ 10⁸ = 10³, soit 0,5 × 10³ = 500 secondes, c'est-à-dire environ 8 minutes et 20 secondes."
      }
    ]
  },

  'francais/L02': {
    titre: 'Individu et société : confrontations de valeurs',
    items: [
      {
        type: 'qcm',
        q: "Qu'est-ce qu'une <strong>didascalie</strong> ?",
        choix: [
          'Une longue réplique',
          "Une indication de l'auteur sur le décor, les gestes ou le ton",
          'Un malentendu entre deux personnages',
          'La partie chantée d\'une pièce'
        ],
        reponse: 1,
        explication: "La didascalie est une indication de mise en scène, imprimée en italique et jamais prononcée. Elle donne souvent des informations que le dialogue ne contient pas : qui est seul, comment on parle, ce qu'on fait."
      },
      {
        type: 'vraifaux',
        q: 'Les didascalies sont prononcées par les comédiens.',
        reponse: false,
        explication: "Faux, et sans exception. Ce sont des indications destinées au metteur en scène et aux comédiens, pas au public. On les repère à l'italique et souvent aux parenthèses."
      },
      {
        type: 'qcm',
        q: "Quelle est la différence entre une <strong>tirade</strong> et un <strong>monologue</strong> ?",
        choix: [
          'La tirade est plus longue',
          'Le monologue est en vers',
          "La tirade s'adresse à quelqu'un, le monologue est dit par un personnage seul",
          'Il n\'y a aucune différence'
        ],
        reponse: 2,
        explication: "Le critère n'est pas la longueur mais la présence d'un interlocuteur. Une tirade de deux pages devant trois personnages reste une tirade ; deux lignes dites seul en scène forment déjà un monologue."
      },
      {
        type: 'qcm',
        q: 'Quand change-t-on de <strong>scène</strong> dans une pièce ?',
        choix: [
          'Quand le décor change',
          "Quand un personnage entre ou sort",
          'Toutes les dix répliques',
          'Quand le sujet de la conversation change'
        ],
        reponse: 1,
        explication: "Une scène se délimite par l'entrée ou la sortie d'un personnage, même si le décor et le sujet ne bougent pas. C'est le changement d'acte qui correspond en général à un changement de décor ou de temps."
      },
      {
        type: 'saisie',
        q: "Comment appelle-t-on une parole entendue du public mais pas des autres personnages ?",
        reponses: ['un aparté', 'aparté', 'aparte', 'un aparte'],
        explication: "Un aparté. Il n'est possible que grâce à la double énonciation : au théâtre, une réplique s'adresse en même temps au personnage et au public. L'aparté ne garde que le second destinataire."
      },
      {
        type: 'qcm',
        q: "Qu'est-ce que la <strong>double énonciation</strong> ?",
        choix: [
          'Un personnage qui répète deux fois la même chose',
          "Une réplique qui s'adresse à la fois au personnage et au public",
          'Deux personnages qui parlent en même temps',
          'Une pièce jouée deux soirs de suite'
        ],
        reponse: 1,
        explication: "Une même phrase a deux destinataires simultanés : l'interlocuteur sur scène et la salle. C'est elle qui permet l'aparté, et qui crée du comique ou de la tension quand le spectateur en sait plus qu'un personnage."
      },
      {
        type: 'qcm',
        q: "Lequel de ces mots désigne une <strong>valeur</strong> ?",
        choix: ['une table', 'le mardi', "l'honneur", 'une réplique'],
        reponse: 2,
        explication: "L'honneur est un principe auquel on tient et qui guide les choix : c'est une valeur. Liberté, justice, amitié, argent en sont d'autres. Une valeur n'est ni vraie ni fausse : elle se défend."
      },
      {
        type: 'qcm',
        q: "Quelle est la <strong>quatrième</strong> question à se poser devant un conflit de valeurs ?",
        choix: [
          'Qui parle le plus ?',
          'Que risque chacun s\'il cède ?',
          'Qui a raison ?',
          'Combien de scènes dure le conflit ?'
        ],
        reponse: 1,
        explication: "« Que risque chacun ? » C'est elle qui transforme un résumé en analyse : mesurer l'enjeu révèle souvent un déséquilibre, comme entre la vie entière d'Élise et la dot que risque Harpagon."
      },
      {
        type: 'qcm',
        q: "Dans <em>L'Avare</em>, quelles valeurs s'opposent entre Harpagon et sa fille Élise ?",
        choix: [
          "L'honneur et la réputation",
          "L'argent et l'amour",
          "L'État et la famille",
          'La sincérité et la politesse'
        ],
        reponse: 1,
        explication: "Harpagon défend l'argent, c'est-à-dire la conservation de sa fortune ; Élise défend l'amour et le droit de choisir sa vie. Le déséquilibre entre les deux enjeux est ce qui rend Harpagon ridicule."
      },
      {
        type: 'qcm',
        q: "« Selon l'INSEE, 300 000 personnes n'ont pas de logement. » Ce procédé cherche à…",
        choix: ['persuader', 'convaincre', 'délibérer', 'émouvoir'],
        reponse: 1,
        explication: "Convaincre : on s'adresse à la raison avec une donnée vérifiable et une source. Persuader viserait les sentiments, par exemple en décrivant une nuit dehors. Délibérer, ce serait peser le pour et le contre avec soi-même."
      },
      {
        type: 'qcm',
        q: "« Imagine ta petite soeur à sa place. Tu accepterais ça ? » Ce procédé cherche à…",
        choix: ['convaincre', 'persuader', 'délibérer', 'informer'],
        reponse: 1,
        explication: "Persuader : l'auteur vise l'émotion par l'identification et l'indignation. Aucun fait n'est apporté. Ni l'un ni l'autre n'est « meilleur » : ce qui est attendu, c'est de nommer le procédé et de dire ce qu'il produit."
      },
      {
        type: 'qcm',
        q: "« Il a tout perdu : son travail, sa maison, ses amis, sa santé. » Quel procédé ?",
        choix: ['Une question rhétorique', 'Une énumération', 'Une opposition', 'Un exemple'],
        reponse: 1,
        explication: "Une énumération. Son effet est d'écraser par le nombre : chaque élément pris seul serait discutable, mais la série donne une impression d'accablement qui décourage l'objection."
      },
      {
        type: 'qcm',
        q: "« Lui n'a rien ; son patron a tout. » Quel procédé ?",
        choix: ['Une énumération', 'Une opposition', 'Un exemple', 'Un aparté'],
        reponse: 1,
        explication: "Une opposition, ou antithèse : deux idées contraires placées côte à côte. Le lecteur perçoit l'écart d'un seul coup d'oeil, sans qu'on ait besoin de le lui expliquer."
      },
      {
        type: 'qcm',
        q: "Quel effet produit une <strong>question rhétorique</strong> ?",
        choix: [
          "Elle laisse le lecteur libre de répondre",
          "Elle fait croire au lecteur qu'il trouve seul une réponse qui lui est imposée",
          'Elle allonge le texte',
          "Elle apporte une preuve"
        ],
        reponse: 1,
        explication: "La réponse est évidente et n'est pas attendue : le lecteur croit la trouver lui-même, ce qui le rend complice de la thèse sans qu'il ait eu à l'accepter explicitement. Dire cet effet est ce qui rapporte les points."
      },
      {
        type: 'vraifaux',
        q: "Écrire « il y a une question rhétorique » suffit dans une analyse.",
        reponse: false,
        explication: "Faux. Nommer un procédé ne vaut rien tant qu'on n'a pas dit ce qu'il produit sur le lecteur, et en quoi il sert la thèse défendue. C'est l'erreur qui coûte le plus de points en analyse de texte."
      },
      {
        type: 'qcm',
        q: "Quels sont les quatre temps d'un <strong>paragraphe argumenté</strong> ?",
        choix: [
          'Introduction, développement, transition, conclusion',
          'Thèse, argument, exemple, conclusion',
          'Question, réponse, preuve, résumé',
          'Sujet, verbe, complément, ponctuation'
        ],
        reponse: 1,
        explication: "Thèse, argument, exemple, conclusion. L'exemple est le temps le plus souvent oublié, et c'est celui qui distingue une opinion d'un raisonnement. La conclusion doit ajouter quelque chose, pas répéter la thèse."
      },
      {
        type: 'qcm',
        q: "« Il faut lire parce que c'est bien de lire. » Quel est le défaut de cet argument ?",
        choix: [
          "Il est trop long",
          "Il répète la thèse au lieu de la soutenir",
          "Il manque de vocabulaire",
          "Il n'y a pas de faute"
        ],
        reponse: 1,
        explication: "C'est un raisonnement circulaire : l'argument reformule la thèse sans apporter de raison distincte. Un argument valable dirait par exemple que la lecture est le seul exercice qui oblige à suivre une pensée longue sans interruption."
      },
      {
        type: 'qcm',
        q: "Dans <em>Antigone</em>, quelles valeurs s'affrontent ?",
        choix: [
          "L'amour et l'argent",
          "Le devoir envers l'État et le devoir envers la famille",
          'La sincérité et la politesse',
          'La jeunesse et la vieillesse'
        ],
        reponse: 1,
        explication: "Créon défend la loi et l'ordre public ; Antigone défend le respect dû aux morts et à son frère. Le conflit est insoluble parce que les deux valeurs sont légitimes : Créon n'est pas un tyran capricieux."
      },
      {
        type: 'qcm',
        q: "Un personnage dit « je suis parfaitement calme », avec la didascalie <em>tremblant de rage</em>. Que faut-il en conclure ?",
        choix: [
          "L'auteur s'est trompé",
          "Il faut suivre le dialogue et ignorer la didascalie",
          "L'écart entre la parole et le corps révèle ce que le personnage cache",
          'La didascalie remplace la réplique'
        ],
        reponse: 2,
        explication: "L'écart est voulu : il montre au spectateur ce que l'interlocuteur n'entend pas. C'est l'un des relevés les plus rentables dans une analyse, parce qu'il révèle un personnage sans qu'aucune réplique n'ait à le dire."
      },
      {
        type: 'qcm',
        q: "Qu'est-ce qu'un <strong>coup de théâtre</strong> ?",
        choix: [
          'Un malentendu entre deux personnages',
          'Un retournement brutal et inattendu de la situation',
          'Une réplique dite au public',
          "La dernière scène d'un acte"
        ],
        reponse: 1,
        explication: "Un retournement brutal, par exemple la découverte au dernier acte qu'un orphelin est l'héritier d'une fortune. À ne pas confondre avec le quiproquo, qui est un malentendu, ni avec l'aparté, qui s'adresse au public."
      }
    ]
  }
,
  'physique-chimie/L02': {
    titre: 'Transformations chimiques',
    items: [
      {
        type: 'qcm',
        q: 'Un glaçon fond dans un verre. De quelle transformation s\'agit-il ?',
        choix: ['Chimique', 'Physique', 'Ni l\'une ni l\'autre'],
        reponse: 1,
        explication: "Physique. Avant et après, ce sont les mêmes molécules d'eau H₂O : seule leur disposition change. Le test à retenir : les molécules de la fin sont-elles les mêmes qu'au début ?"
      },
      {
        type: 'qcm',
        q: 'Une feuille de papier brûle. De quelle transformation s\'agit-il ?',
        choix: ['Physique', 'Chimique', 'Un changement d\'état'],
        reponse: 1,
        explication: "Chimique. Il se forme du dioxyde de carbone, de la vapeur d'eau et des cendres : des espèces qui n'existaient pas au départ. Les molécules du papier ont été détruites et leurs atomes réorganisés."
      },
      {
        type: 'vraifaux',
        q: 'Un produit est une espèce chimique présente avant la transformation.',
        reponse: false,
        explication: "Faux. Un produit est formé pendant la transformation : il n'existe pas au départ. Ce qui est présent au début et consommé, c'est un réactif."
      },
      {
        type: 'qcm',
        q: 'Dans le bilan « méthane + dioxygène → dioxyde de carbone + eau », quels sont les réactifs ?',
        choix: ['Le dioxyde de carbone et l\'eau', 'Le méthane et le dioxygène', 'Le méthane seulement'],
        reponse: 1,
        explication: "Les réactifs sont à gauche de la flèche : le méthane et le dioxygène. Le dioxyde de carbone et l'eau sont à droite, ce sont les produits."
      },
      {
        type: 'qcm',
        q: 'Comment se lit la flèche d\'une équation chimique ?',
        choix: ['« égale »', '« donne »', '« plus »'],
        reponse: 1,
        explication: "Elle se lit « donne » ou « se transforme en ». Ce n'est pas une égalité de nombres mais un sens de transformation : les réactifs deviennent les produits."
      },
      {
        type: 'vraifaux',
        q: 'Pour équilibrer une équation, on a le droit de changer un indice dans une formule.',
        reponse: false,
        explication: "Faux. On ajoute un coefficient DEVANT la formule. Changer H₂O en H₄O reviendrait à inventer une molécule qui n'existe pas. L'indice décrit la molécule, le coefficient compte les molécules."
      },
      {
        type: 'saisie',
        q: 'Complète le coefficient manquant : H₂ + O₂ → ___ H₂O (après avoir mis 2 devant H₂).',
        reponses: ['2', 'deux'],
        explication: "L'équation équilibrée est 2 H₂ + O₂ → 2 H₂O. Vérification : hydrogène, 4 à gauche et 4 à droite. Oxygène, 2 à gauche et 2 à droite."
      },
      {
        type: 'qcm',
        q: 'Quelle est l\'équation équilibrée de la combustion du méthane ?',
        choix: ['CH₄ + O₂ → CO₂ + H₂O', 'CH₄ + 2 O₂ → CO₂ + 2 H₂O', 'CH₄ + O₂ → CO₂ + 2 H₂O'],
        reponse: 1,
        explication: "CH₄ + 2 O₂ → CO₂ + 2 H₂O. Carbone : 1 et 1. Hydrogène : 4 et 4. Oxygène : 4 à gauche (2 × 2) et 4 à droite (2 dans CO₂ plus 2 dans 2 H₂O)."
      },
      {
        type: 'qcm',
        q: 'Dans l\'équation 4 Fe + 3 O₂ → 2 Fe₂O₃, combien y a-t-il d\'atomes d\'oxygène à droite ?',
        choix: ['3', '5', '6'],
        reponse: 2,
        explication: "2 × 3 = 6 atomes d'oxygène. Le coefficient 2 multiplie toute la formule Fe₂O₃, qui contient 3 oxygènes. À gauche : 3 × 2 = 6 également, l'équation est bien équilibrée."
      },
      {
        type: 'saisie',
        q: 'On brûle 12 g de carbone avec 32 g de dioxygène. Quelle masse de dioxyde de carbone se forme, en grammes ?',
        reponses: ['44', '44 g', '44g'],
        explication: "12 + 32 = 44 g. La masse totale se conserve : la masse des réactifs consommés est égale à la masse des produits formés. C'est la loi de Lavoisier."
      },
      {
        type: 'vraifaux',
        q: 'Quand une bûche brûle dans une cheminée, une partie de la matière disparaît réellement.',
        reponse: false,
        explication: "Faux. Rien ne disparaît : le dioxyde de carbone et la vapeur d'eau formés partent dans l'air et ne sont plus sur la balance. En récipient fermé, la masse ne change pas d'un gramme."
      },
      {
        type: 'qcm',
        q: 'Qui a établi la loi de conservation de la masse en 1789 ?',
        choix: ['Lavoisier', 'Newton', 'Mendeleïev'],
        reponse: 0,
        explication: "Antoine Lavoisier. Il pesait ses expériences dans des récipients fermés, ce qui lui a permis de montrer que la masse gagnée par un métal qui brûle vient du gaz de l'air, et de nulle part ailleurs."
      },
      {
        type: 'qcm',
        q: 'Dans une combustion, comment appelle-t-on le dioxygène ?',
        choix: ['Le combustible', 'Le comburant', 'Le produit'],
        reponse: 1,
        explication: "Le comburant : c'est ce qui permet de brûler. Le combustible, c'est ce qui brûle (bois, méthane, papier). Ne pas inverser les deux mots, ils se ressemblent mais désignent des rôles opposés."
      },
      {
        type: 'saisie',
        q: 'Cite le troisième élément du triangle du feu, à côté du combustible et du comburant (deux mots).',
        reponses: ['energie d\'activation', "énergie d'activation", 'energie activation', "l'énergie d'activation", 'energie d activation'],
        explication: "L'énergie d'activation : l'étincelle, la flamme ou la forte chaleur qui déclenche. Retirer un seul des trois sommets du triangle suffit à éteindre un feu."
      },
      {
        type: 'qcm',
        q: 'Pourquoi un couvercle posé sur une poêle en feu l\'éteint-il ?',
        choix: ['Il refroidit l\'huile', 'Il prive le feu de dioxygène', 'Il supprime le combustible'],
        reponse: 1,
        explication: "Le couvercle empêche l'air d'atteindre l'huile enflammée : on retire le comburant. L'eau, elle, serait dangereuse sur une friture : elle se vaporise brutalement et projette l'huile en flammes."
      },
      {
        type: 'qcm',
        q: 'Une flamme jaune et fumeuse qui dépose des traces noires indique :',
        choix: ['une combustion complète', 'une combustion incomplète', 'un excès de dioxygène'],
        reponse: 1,
        explication: "Une combustion incomplète : le dioxygène manque. Les traces noires sont de la suie, du carbone non oxydé. Une combustion complète donne une flamme bleue et nette."
      },
      {
        type: 'qcm',
        q: 'Quel gaz dangereux se forme lors d\'une combustion incomplète ?',
        choix: ['Le dioxyde de carbone CO₂', 'Le monoxyde de carbone CO', 'Le diazote N₂'],
        reponse: 1,
        explication: "Le monoxyde de carbone CO. Il est incolore et inodore, donc indétectable par les sens, et il prend la place du dioxygène dans le sang. C'est pourquoi une pièce chauffée au gaz doit toujours rester ventilée."
      },
      {
        type: 'vraifaux',
        q: 'Il faut boucher les grilles d\'aération d\'une pièce chauffée au gaz pour éviter les courants d\'air.',
        reponse: false,
        explication: "Faux, et c'est dangereux. Les grilles apportent le dioxygène nécessaire à la combustion. Sans air, la combustion devient incomplète et produit du monoxyde de carbone, mortel à faible dose."
      },
      {
        type: 'saisie',
        q: 'Équilibre la combustion du propane : C₃H₈ + ___ O₂ → 3 CO₂ + 4 H₂O. Quel coefficient manque ?',
        reponses: ['5', 'cinq'],
        explication: "5. À droite il y a 3 × 2 = 6 oxygènes dans 3 CO₂, plus 4 × 1 = 4 dans 4 H₂O, soit 10 en tout. Il faut donc 5 molécules O₂ à gauche, car 5 × 2 = 10."
      },
      {
        type: 'qcm',
        q: 'En équilibrant le butane, on trouve 13 oxygènes à droite, un nombre impair. Que fait-on ?',
        choix: ['On met 6,5 devant O₂', 'On double tous les coefficients', 'On change un indice'],
        reponse: 1,
        explication: "On double toute l'équation, ce qui donne 2 C₄H₁₀ + 13 O₂ → 8 CO₂ + 10 H₂O. On ne peut pas prendre une demi-molécule, et on ne touche jamais aux indices."
      }
    ]
  }
,
  'svt/L02': {
    titre: 'Les séismes',
    items: [
      {
        type: 'qcm',
        q: 'Qu\'est-ce qui provoque un séisme ?',
        choix: ['Une explosion sous la surface', 'La rupture brutale de roches soumises à des contraintes', 'Le refroidissement du noyau'],
        reponse: 1,
        explication: "Les contraintes dues au mouvement des plaques s'accumulent dans les roches, qui se déforment puis cassent d'un coup. Toute l'énergie accumulée part alors sous forme d'ondes."
      },
      {
        type: 'qcm',
        q: 'Où se trouve le foyer d\'un séisme ?',
        choix: ['À la surface du sol', 'En profondeur, sur la faille', 'Au centre de la Terre'],
        reponse: 1,
        explication: "Le foyer, ou hypocentre, est le point de départ de la rupture, en profondeur sur la faille. L'épicentre, lui, est le point de la surface situé juste à la verticale du foyer."
      },
      {
        type: 'vraifaux',
        q: 'Le séisme crée la faille au moment où il se produit.',
        reponse: false,
        explication: "Faux. Dans la grande majorité des cas la faille existe déjà : c'est une cassure ancienne, donc une zone de faiblesse. Le séisme est un rejeu, un nouveau glissement le long de cette cassure."
      },
      {
        type: 'qcm',
        q: 'Que transporte une onde sismique ?',
        choix: ['De la roche', 'De l\'énergie', 'De l\'eau souterraine'],
        reponse: 1,
        explication: "De l'énergie, sous forme de vibration. La matière reste sur place et se contente d'osciller, comme un bouchon sur une vague."
      },
      {
        type: 'vraifaux',
        q: 'Plus le foyer est profond, plus les dégâts en surface sont importants.',
        reponse: false,
        explication: "Faux, c'est l'inverse. Plus le foyer est profond, plus les ondes se sont atténuées avant d'atteindre la surface. À énergie égale, un foyer à 10 km fait bien plus de dégâts qu'un foyer à 300 km."
      },
      {
        type: 'qcm',
        q: 'Comment s\'appelle le tracé enregistré par un sismographe ?',
        choix: ['Un sismogramme', 'Un séismographe', 'Un épicentrogramme'],
        reponse: 0,
        explication: "Un sismogramme. Le temps est en abscisse, l'amplitude des vibrations du sol en ordonnée. C'est de l'amplitude maximale qu'on déduit la magnitude."
      },
      {
        type: 'saisie',
        q: 'Combien de stations faut-il au minimum pour localiser un épicentre par triangulation ?',
        reponses: ['3', 'trois'],
        explication: "Trois. Une station donne la distance mais pas la direction : on trace un cercle. Deux cercles se coupent en deux points, ce qui laisse une ambiguïté. Le troisième cercle tranche."
      },
      {
        type: 'qcm',
        q: 'La magnitude d\'un séisme mesure :',
        choix: ['les effets observés dans une ville', 'l\'énergie libérée au foyer', 'la profondeur du foyer'],
        reponse: 1,
        explication: "L'énergie libérée au foyer. Elle est unique pour un séisme donné, quel que soit l'endroit où on l'observe. Les effets observés en un lieu, c'est l'intensité."
      },
      {
        type: 'qcm',
        q: 'Quand la magnitude augmente de 1, l\'énergie libérée est multipliée par environ :',
        choix: ['2', '10', '30'],
        reponse: 2,
        explication: "Environ 30. C'est l'amplitude des ondes qui est multipliée par 10. Un séisme de magnitude 7 libère donc environ 30 × 30 = 900 fois plus d'énergie qu'un séisme de magnitude 5."
      },
      {
        type: 'vraifaux',
        q: 'L\'échelle de magnitude s\'arrête à 9.',
        reponse: false,
        explication: "Faux. L'échelle n'a pas de maximum théorique. Le record mesuré avoisine 9,5, mais cette limite vient de la longueur maximale des failles terrestres, pas de l'échelle elle-même."
      },
      {
        type: 'qcm',
        q: 'Comment note-t-on une intensité sismique ?',
        choix: ['En chiffres romains, de I à XII', 'Avec un nombre décimal comme 6,3', 'En pourcentage'],
        reponse: 0,
        explication: "En chiffres romains, de I à XII. Elle s'obtient par observation des effets : sur les personnes, les objets, les bâtiments et le paysage."
      },
      {
        type: 'qcm',
        q: 'Un même séisme de magnitude 6,3 est ressenti dans trois villes. Combien y a-t-il de magnitudes et combien d\'intensités ?',
        choix: ['Une magnitude, trois intensités', 'Trois magnitudes, une intensité', 'Trois de chaque'],
        reponse: 0,
        explication: "Une seule magnitude, puisqu'elle mesure l'énergie libérée au foyer, et une intensité par lieu, puisqu'elle mesure les effets sur place. C'est la distinction la plus souvent ratée en contrôle."
      },
      {
        type: 'vraifaux',
        q: 'Deux villes situées à la même distance de l\'épicentre subissent forcément la même intensité.',
        reponse: false,
        explication: "Faux. L'intensité dépend aussi de la nature du sol, car les sols meubles amplifient les secousses, et de la qualité des constructions. À distance égale, l'écart peut être de plusieurs degrés."
      },
      {
        type: 'qcm',
        q: 'Où se concentrent les séismes à la surface du globe ?',
        choix: ['Au hasard', 'Aux limites des plaques tectoniques', 'Au centre des continents'],
        reponse: 1,
        explication: "Aux limites des plaques. La carte des séismes et la carte des plaques se superposent presque parfaitement : les contraintes se concentrent là où les plaques se frottent, plongent ou se heurtent."
      },
      {
        type: 'qcm',
        q: 'Quelle limite de plaques produit les foyers les plus profonds ?',
        choix: ['La dorsale', 'La subduction', 'Le coulissage'],
        reponse: 1,
        explication: "La subduction : une plaque plonge sous l'autre, et les foyers s'enfoncent progressivement, parfois jusqu'à plusieurs centaines de kilomètres. Les dorsales, elles, donnent des foyers superficiels."
      },
      {
        type: 'saisie',
        q: 'Complète la relation : risque = aléa × enjeux × ________',
        reponses: ['vulnerabilite', 'vulnérabilité', 'la vulnérabilité', 'vulnerabilité'],
        explication: "risque = aléa × enjeux × vulnérabilité. S'il n'y a personne ni rien à détruire, le risque est nul même si l'aléa est fort. C'est le seul des trois facteurs sur lequel une société agit vraiment."
      },
      {
        type: 'vraifaux',
        q: 'On sait aujourd\'hui prévoir la date à laquelle un séisme se produira.',
        reponse: false,
        explication: "Faux. On sait dire où les séismes se produisent, et à peu près avec quelle force, mais pas quand. C'est pourquoi on mise sur la prévention, qui réduit les conséquences, et non sur la prévision."
      },
      {
        type: 'qcm',
        q: 'Que permet une alerte précoce de quelques secondes ?',
        choix: ['Prévoir le séisme avant qu\'il commence', 'Arrêter les trains et couper le gaz avant les ondes destructrices', 'Empêcher la rupture de la faille'],
        reponse: 1,
        explication: "Elle exploite la différence de vitesse entre les ondes rapides peu destructrices et les ondes lentes qui font les dégâts. Le séisme a déjà commencé : ce n'est pas de la prévision, c'est de la détection."
      },
      {
        type: 'qcm',
        q: 'Que garantit une norme parasismique ?',
        choix: ['Que le bâtiment ne sera pas endommagé', 'Que le bâtiment ne s\'effondrera pas pendant la secousse', 'Que le séisme sera moins fort'],
        reponse: 1,
        explication: "Qu'il ne s'effondrera pas, pour laisser aux occupants le temps de sortir vivants. Le bâtiment peut être fissuré et devoir être démoli ensuite : il aura pourtant fait exactement son travail."
      },
      {
        type: 'qcm',
        q: 'Pendant une secousse, à l\'intérieur d\'un bâtiment, que faut-il faire ?',
        choix: ['Courir dehors immédiatement', 'Prendre l\'ascenseur', 'Se mettre sous une table solide, loin des fenêtres'],
        reponse: 2,
        explication: "Se protéger sur place sous une table solide ou contre un mur porteur, loin des vitres, en protégeant sa tête. On ne sort qu'une fois la secousse terminée, par les escaliers, jamais par l'ascenseur."
      }
    ]
  }
,
  'histoire-geo/H2': {
    titre: "L'Europe des Lumières",
    items: [
      {
        type: 'qcm',
        q: 'Entre quelles années se situe le XVIII<sup>e</sup> siècle ?',
        choix: ['1700 à 1799', '1701 à 1800', '1750 à 1850'],
        reponse: 1,
        explication: "De 1701 à 1800. Le premier siècle commence en l'an 1 et il n'y a pas d'année zéro : chaque siècle va donc de l'année 01 à l'année 00 suivante."
      },
      {
        type: 'qcm',
        q: 'Les Lumières sont un mouvement :',
        choix: ['uniquement français', 'européen', 'limité à la ville de Paris'],
        reponse: 1,
        explication: "Européen. On parle d'Enlightenment en Angleterre, d'Aufklärung dans les pays de langue allemande, d'Ilustración en Espagne. Les idées circulent par les traductions, les voyages et la correspondance."
      },
      {
        type: 'qcm',
        q: 'Au XVIII<sup>e</sup> siècle, un « philosophe » est avant tout :',
        choix: ['un penseur retiré du monde', 'un écrivain engagé qui publie et débat', 'un professeur d\'université'],
        reponse: 1,
        explication: "Un écrivain engagé. Il écrit pour être lu, discute dans les salons, publie des textes courts et cherche à transformer la société par les idées. Ce n'est pas un savant enfermé dans son cabinet."
      },
      {
        type: 'saisie',
        q: 'Quel philosophe a écrit « De l\'esprit des lois » en 1748 ?',
        reponses: ['montesquieu', 'Montesquieu', 'de montesquieu'],
        explication: "Montesquieu. Il y expose la séparation des trois pouvoirs, législatif, exécutif et judiciaire, et écrit qu'« il faut que, par la disposition des choses, le pouvoir arrête le pouvoir »."
      },
      {
        type: 'qcm',
        q: 'Quels sont les trois pouvoirs distingués par Montesquieu ?',
        choix: ['royal, religieux, militaire', 'législatif, exécutif, judiciaire', 'national, régional, local'],
        reponse: 1,
        explication: "Le législatif fait les lois, l'exécutif les applique et gouverne, le judiciaire juge ceux qui ne les respectent pas. Ces trois pouvoirs doivent être confiés à des organes différents."
      },
      {
        type: 'qcm',
        q: 'Qui a écrit « Du contrat social » en 1762 ?',
        choix: ['Voltaire', 'Rousseau', 'Diderot'],
        reponse: 1,
        explication: "Rousseau. Il y défend la souveraineté du peuple : le pouvoir ne vient ni de Dieu ni de la naissance, mais d'un contrat par lequel les citoyens se donnent à eux-mêmes leurs lois."
      },
      {
        type: 'vraifaux',
        q: 'Tous les philosophes des Lumières défendent les mêmes idées politiques.',
        reponse: false,
        explication: "Faux. Voltaire espère des réformes venues d'un roi éclairé, Rousseau défend la souveraineté du peuple, Montesquieu une monarchie tempérée. Ils partagent une méthode et des adversaires, pas un programme."
      },
      {
        type: 'qcm',
        q: 'Dans quelle affaire Voltaire s\'engage-t-il à partir de 1762 ?',
        choix: ['L\'affaire Calas', 'L\'affaire Dreyfus', 'L\'affaire du collier'],
        reponse: 0,
        explication: "L'affaire Calas. Ce marchand protestant de Toulouse, accusé sans preuve d'avoir tué son fils, est torturé puis exécuté. Voltaire mobilise l'opinion et obtient sa réhabilitation en 1765."
      },
      {
        type: 'qcm',
        q: 'Qui dirige l\'Encyclopédie ?',
        choix: ['Voltaire et Rousseau', 'Diderot et D\'Alembert', 'Montesquieu et Condorcet'],
        reponse: 1,
        explication: "Diderot et D'Alembert. Elle paraît de 1751 à 1772 : 17 volumes de texte, 11 volumes de planches, environ 72 000 articles rédigés par plus de 150 auteurs."
      },
      {
        type: 'saisie',
        q: 'En quelle année paraît le premier volume de l\'Encyclopédie ?',
        reponses: ['1751', 'en 1751'],
        explication: "1751. La publication s'étend jusqu'en 1772, malgré une condamnation royale en 1759 : l'ouvrage continue de paraître grâce à des complicités, dont celle de Malesherbes, chargé du contrôle des livres."
      },
      {
        type: 'qcm',
        q: 'À quoi sert un « renvoi » dans l\'Encyclopédie ?',
        choix: ['À gagner de la place', 'À faire faire au lecteur un rapprochement critique non écrit', 'À citer ses sources'],
        reponse: 1,
        explication: "L'article « Anthropophages » renvoie à « Eucharistie » : la critique n'est jamais imprimée, c'est le lecteur qui la fait dans sa tête. On ne peut pas censurer ce qui n'est pas écrit."
      },
      {
        type: 'vraifaux',
        q: 'L\'Encyclopédie était assez bon marché pour être lue par le peuple.',
        reponse: false,
        explication: "Faux. Une souscription complète coûtait plusieurs mois de salaire d'un ouvrier qualifié. Elle se diffuse dans la noblesse et la bourgeoisie cultivées, en France et dans toute l'Europe."
      },
      {
        type: 'qcm',
        q: 'Que fait-on dans un salon au XVIII<sup>e</sup> siècle ?',
        choix: ['On lit et on discute, invité par une femme de la haute société', 'On assiste à un office religieux', 'On achète des livres interdits'],
        reponse: 0,
        explication: "Le salon est tenu par une femme, comme Madame Geoffrin ou Julie de Lespinasse. Elle choisit les invités, dirige la conversation, met les auteurs en relation et les finance parfois."
      },
      {
        type: 'qcm',
        q: 'Qu\'est-ce que la censure au XVIII<sup>e</sup> siècle en France ?',
        choix: ['Une taxe sur les livres', 'Le contrôle par l\'État et l\'Église de ce qui est imprimé', 'Une académie de correcteurs'],
        reponse: 1,
        explication: "Un livre doit obtenir un privilège royal pour paraître légalement. Un ouvrage jugé dangereux peut être saisi et brûlé, et son auteur emprisonné ou exilé."
      },
      {
        type: 'qcm',
        q: 'Quel moyen les auteurs utilisent-ils pour contourner la censure ?',
        choix: ['Publier à l\'étranger sous une fausse adresse', 'Écrire uniquement en latin', 'Attendre la mort du roi'],
        reponse: 0,
        explication: "Ils publient à Amsterdam, Genève ou Londres, souvent sans nom d'auteur et avec une fausse adresse d'éditeur, puis font entrer les exemplaires en fraude. Ils recourent aussi à la critique indirecte et aux renvois."
      },
      {
        type: 'qcm',
        q: 'Dans les « Lettres persanes », Montesquieu critique la France en la faisant décrire par :',
        choix: ['un paysan', 'deux voyageurs persans', 'un moine'],
        reponse: 1,
        explication: "Deux voyageurs persans imaginaires s'étonnent de coutumes que le lecteur français trouve naturelles. Ce n'est pas l'auteur qui critique : c'est un personnage étranger qui s'interroge, ce qui déjoue la censure."
      },
      {
        type: 'qcm',
        q: 'Qu\'est-ce que le despotisme éclairé ?',
        choix: ['Une monarchie devenue démocratique', 'Un pouvoir absolu qui mène des réformes inspirées des Lumières', 'Un régime sans roi'],
        reponse: 1,
        explication: "Frédéric II en Prusse, Catherine II en Russie, Joseph II en Autriche réforment par le haut, sans partager le pouvoir. Ils prennent des Lumières ce qui renforce l'État et écartent ce qui le limiterait."
      },
      {
        type: 'saisie',
        q: 'Qui publie en 1791 la « Déclaration des droits de la femme et de la citoyenne » ?',
        reponses: ['olympe de gouges', 'Olympe de Gouges', 'de gouges', 'olympe degouges'],
        explication: "Olympe de Gouges. Elle reprend article par article la Déclaration de 1789 et écrit que « la femme a le droit de monter sur l'échafaud ; elle doit avoir également celui de monter à la tribune ». Elle est guillotinée en 1793."
      },
      {
        type: 'vraifaux',
        q: 'Les Lumières ont obtenu l\'abolition de l\'esclavage au XVIII<sup>e</sup> siècle.',
        reponse: false,
        explication: "Faux. Plusieurs textes le condamnent, comme l'article « Esclavage » de l'Encyclopédie ou les Réflexions de Condorcet en 1781, mais la plupart réclament une abolition progressive. L'abolition définitive en France date de 1848."
      },
      {
        type: 'qcm',
        q: 'Quel lien y a-t-il entre les Lumières et la Révolution française ?',
        choix: ['Les Lumières ont causé la Révolution', 'Les Lumières ont fourni le vocabulaire et les principes des textes révolutionnaires', 'Il n\'y a aucun lien'],
        reponse: 1,
        explication: "Ce sont les crises financière, sociale et politique de 1788-1789 qui déclenchent la Révolution. Mais l'article 3 de la Déclaration de 1789, sur la souveraineté de la Nation, vient tout droit de Rousseau."
      }
    ]
  }
,
  'francais/L06': {
    titre: 'Les expansions du nom',
    items: [
      {
        type: 'qcm',
        q: 'Quel est le noyau du groupe nominal « le chapeau de paille de ma grand-mère » ?',
        choix: ['chapeau', 'paille', 'grand-mère'],
        reponse: 0,
        explication: "Le noyau est « chapeau » : c'est de lui qu'on parle. « Paille » et « grand-mère » ne font que le préciser. Le test : on peut dire « le chapeau », pas « la paille de ma grand-mère » avec le même sens."
      },
      {
        type: 'qcm',
        q: 'Combien y a-t-il de sortes d\'expansions du nom ?',
        choix: ['Deux', 'Trois', 'Cinq'],
        reponse: 1,
        explication: "Trois : l'adjectif qualificatif épithète, le complément du nom, et la proposition subordonnée relative. Toutes les trois peuvent se supprimer sans rendre la phrase incorrecte."
      },
      {
        type: 'qcm',
        q: 'Quelle expansion contient toujours un verbe conjugué ?',
        choix: ['L\'adjectif épithète', 'Le complément du nom', 'La proposition relative'],
        reponse: 2,
        explication: "La proposition relative. C'est le critère de reconnaissance le plus fiable : « une route qui monte » contient le verbe « monte », alors que « une route étroite » et « une route de montagne » n'en ont aucun."
      },
      {
        type: 'qcm',
        q: 'Dans « une chemise en lin », quelle est la nature de « en lin » ?',
        choix: ['Adjectif épithète', 'Complément du nom', 'Proposition relative'],
        reponse: 1,
        explication: "Un complément du nom, introduit par la préposition « en ». Il indique ici la matière. Les prépositions les plus fréquentes sont de, à, en, pour, sans, avec, par."
      },
      {
        type: 'vraifaux',
        q: 'Dans « Elle regarde la route », le groupe « la route » est une expansion du nom.',
        reponse: false,
        explication: "Faux. Il complète le verbe « regarde », c'est un complément d'objet. Une expansion complète un nom et se supprime librement ; ici, « elle regarde » resterait en suspens."
      },
      {
        type: 'qcm',
        q: 'Dans « la mer semble calme », l\'adjectif « calme » est :',
        choix: ['épithète', 'attribut du sujet', 'complément du nom'],
        reponse: 1,
        explication: "Attribut du sujet : le verbe d'état « semble » sépare le nom de l'adjectif. Sans verbe entre les deux, comme dans « une mer calme », ce serait une épithète."
      },
      {
        type: 'saisie',
        q: 'Accorde : « des maisons au toit (rouge) ». Écris l\'adjectif correctement.',
        reponses: ['rouge'],
        explication: "« rouge », sans s. L'adjectif complète « toit », qui est au singulier, et non « maisons ». On écrirait « aux toits rouges » si le complément était au pluriel."
      },
      {
        type: 'saisie',
        q: 'Accorde : « une veste et un pantalon (neuf) ».',
        reponses: ['neufs'],
        explication: "« neufs ». Quand un adjectif complète deux noms de genres différents, il se met au masculin pluriel. Si les deux noms étaient féminins, on écrirait le féminin pluriel."
      },
      {
        type: 'qcm',
        q: 'Complète : « la chanson ___ j\'écoute ».',
        choix: ['qui', 'que', 'dont'],
        reponse: 1,
        explication: "« que » : j'écoute quoi ? la chanson. Le pronom est complément d'objet direct. Test rapide : remplaçable par « la », donc « que ». Remplaçable par « elle », ce serait « qui »."
      },
      {
        type: 'qcm',
        q: 'Complète : « la chanson ___ me plaît ».',
        choix: ['qui', 'que', 'où'],
        reponse: 0,
        explication: "« qui » : qui me plaît ? la chanson. Le pronom est sujet du verbe « plaît ». Remplaçable par « elle », donc « qui »."
      },
      {
        type: 'saisie',
        q: 'Complète : « le livre ___ je t\'ai parlé ».',
        reponses: ['dont'],
        explication: "« dont », parce qu'on dit « parler DE quelque chose ». Le « de » est déjà contenu dans « dont » : on n'écrit jamais « dont je t'ai parlé de »."
      },
      {
        type: 'vraifaux',
        q: 'Le pronom relatif « où » ne peut indiquer qu\'un lieu.',
        reponse: false,
        explication: "Faux. Il indique aussi le temps : « le jour où tu es arrivé », « l'année où nous avons déménagé ». C'est un emploi fréquemment raté en dictée."
      },
      {
        type: 'qcm',
        q: 'Quelle phrase est correcte ?',
        choix: ['C\'est moi qui est responsable.', 'C\'est moi qui suis responsable.', 'C\'est moi qui était responsable.'],
        reponse: 1,
        explication: "« C'est moi qui suis responsable. » Le verbe de la relative s'accorde avec l'antécédent du pronom « qui », ici « moi », donc la première personne du singulier."
      },
      {
        type: 'qcm',
        q: 'Dans « la personne dont je connais le frère », quelle formulation serait fautive ?',
        choix: ['dont je connais le frère', 'dont je connais son frère', 'de qui je connais le frère'],
        reponse: 1,
        explication: "« dont je connais son frère » est fautif : « dont » contient déjà l'idée de « de cette personne », donc « son » fait doublon. C'est l'erreur la plus fréquente avec ce pronom."
      },
      {
        type: 'qcm',
        q: 'Quelle différence entre « un homme grand » et « un grand homme » ?',
        choix: ['Aucune', 'Le premier parle de la taille, le second de l\'importance', 'Le second est incorrect'],
        reponse: 1,
        explication: "Placé après le nom, l'adjectif garde son sens propre : la taille. Placé avant, il prend souvent un sens figuré : l'importance. Même chose pour « un livre cher » et « un cher ami »."
      },
      {
        type: 'qcm',
        q: 'Que change la virgule dans « Les élèves, fatigués, sont rentrés » ?',
        choix: ['Rien', 'Tous les élèves sont rentrés, et ils étaient fatigués', 'Seuls les élèves fatigués sont rentrés'],
        reponse: 1,
        explication: "Avec les virgules, l'adjectif est détaché : il commente l'ensemble du groupe. Sans virgules, « les élèves fatigués sont rentrés » trie : seuls ceux qui étaient fatigués sont partis."
      },
      {
        type: 'qcm',
        q: 'Comment appelle-t-on un adjectif séparé du nom par une virgule ?',
        choix: ['Une apposition', 'Une épithète détachée', 'Un attribut'],
        reponse: 1,
        explication: "Une épithète détachée. L'apposition, elle, est un groupe nominal placé à côté d'un autre nom : « Paris, capitale de la France, compte deux millions d'habitants »."
      },
      {
        type: 'qcm',
        q: 'Dans « un verre de vin » et « un verre en verre », qu\'est-ce qui change le sens ?',
        choix: ['Le nom qui suit', 'La préposition', 'La place du complément'],
        reponse: 1,
        explication: "La préposition. « de » indique le contenu, « en » indique la matière. C'est elle qu'il faut lire, pas seulement le nom qui suit : « une tasse de thé » et « une tasse à thé » ne désignent pas la même chose."
      },
      {
        type: 'qcm',
        q: 'Dans « le toit de la maison qui domine le village », la relative complète :',
        choix: ['toit', 'maison', 'village'],
        reponse: 1,
        explication: "Elle complète « maison », le nom qui précède immédiatement le pronom. C'est pourquoi on rapproche toujours un pronom relatif de son antécédent : sinon la phrase devient ambiguë."
      },
      {
        type: 'vraifaux',
        q: 'Plus un groupe nominal a d\'expansions, plus la description est précise.',
        reponse: false,
        explication: "Faux. Au-delà de deux ou trois expansions, la phrase devient illisible et les informations se répètent. Une description est précise quand chaque mot ajoute quelque chose, pas quand elle est longue."
      }
    ]
  }
,
  'histoire-geo/G1': {
    titre: "Espaces et paysages de l'urbanisation",
    items: [
      {
        type: 'saisie',
        q: 'En quelle année la population urbaine mondiale a-t-elle dépassé la population rurale ?',
        reponses: ['2007', 'en 2007'],
        explication: "2007. C'est la date charnière du chapitre : pour la première fois dans l'histoire, plus d'un humain sur deux vit en ville. On prévoit 68 % d'urbains en 2050."
      },
      {
        type: 'qcm',
        q: 'Que recouvre le mot « urbanisation » ?',
        choix: ['Seulement la hausse du nombre d\'urbains', 'La hausse du nombre d\'urbains ET l\'extension spatiale des villes', 'Seulement la construction d\'immeubles'],
        reponse: 1,
        explication: "Les deux à la fois. Une ville peut s'étendre beaucoup tout en perdant des habitants dans son centre : c'est le cas de nombreuses villes européennes."
      },
      {
        type: 'qcm',
        q: 'Qu\'est-ce que l\'exode rural ?',
        choix: ['Le retour des citadins à la campagne', 'Le départ durable des habitants des campagnes vers les villes', 'Le tourisme vert'],
        reponse: 1,
        explication: "Le départ durable des ruraux vers les villes. Massif en Europe au XIXᵉ siècle, il est aujourd'hui le principal moteur de l'urbanisation en Afrique et en Asie."
      },
      {
        type: 'qcm',
        q: 'Paris compte 2,1 millions d\'habitants, 10,8 millions et environ 13 millions selon la délimitation. À quoi correspondent 13 millions ?',
        choix: ['La ville', 'L\'agglomération', 'L\'aire urbaine'],
        reponse: 2,
        explication: "L'aire urbaine : l'agglomération plus toutes les communes dont une part importante des habitants vient y travailler. 2,1 millions, c'est la commune ; 10,8 millions, l'agglomération au bâti continu."
      },
      {
        type: 'qcm',
        q: 'Qu\'est-ce qui définit une métropole ?',
        choix: ['Son nombre d\'habitants', 'Ses fonctions de commandement', 'Sa superficie'],
        reponse: 1,
        explication: "Les fonctions de commandement : économiques, politiques, culturelles et de communication. Une ville peut être très peuplée sans commander quoi que ce soit au-delà d'elle-même."
      },
      {
        type: 'vraifaux',
        q: 'Mégapole et mégalopole sont deux mots pour la même chose.',
        reponse: false,
        explication: "Faux. Une mégapole est UNE agglomération de plus de 10 millions d'habitants. Une mégalopole est un chapelet de grandes villes presque continues, comme Boston-Washington."
      },
      {
        type: 'qcm',
        q: 'Quelle est la première aire urbaine mondiale ?',
        choix: ['New York', 'Tokyo', 'Shanghai'],
        reponse: 1,
        explication: "Tokyo, avec environ 37 millions d'habitants dans son aire urbaine. New York abrite la première bourse mondiale et le siège de l'ONU, Shanghai le premier port à conteneurs du monde."
      },
      {
        type: 'qcm',
        q: 'Quand on s\'éloigne du centre d\'une ville, en général :',
        choix: ['la densité augmente et le bâti monte', 'la densité baisse et le bâti s\'abaisse', 'rien ne change'],
        reponse: 1,
        explication: "La densité baisse, les bâtiments sont plus bas et plus dispersés, et les espaces verts ou agricoles apparaissent. C'est le principe d'organisation observable dans la plupart des villes du monde."
      },
      {
        type: 'qcm',
        q: 'Qu\'est-ce que la périurbanisation ?',
        choix: ['La rénovation des centres anciens', 'L\'extension pavillonnaire sur d\'anciennes communes rurales', 'La destruction des bidonvilles'],
        reponse: 1,
        explication: "L'extension de la ville par lotissements et zones d'activités sur des communes autrefois rurales. Les habitants y vivent mais travaillent dans l'agglomération : la voiture devient indispensable."
      },
      {
        type: 'qcm',
        q: 'Pourquoi un ménage part-il s\'installer en périurbain ?',
        choix: ['D\'abord pour le prix du logement', 'Uniquement par goût de la nature', 'Pour se rapprocher de son travail'],
        reponse: 0,
        explication: "D'abord pour un arbitrage économique : on obtient une maison avec jardin pour le prix d'un appartement. En contrepartie, le temps de trajet et le budget transport augmentent fortement."
      },
      {
        type: 'saisie',
        q: 'Comment appelle-t-on la hausse des loyers d\'un quartier rénové, qui en chasse les habitants modestes ?',
        reponses: ['gentrification', 'la gentrification', 'gentrificaton'],
        explication: "La gentrification. Le quartier va mieux, mais les gens qui y vivaient n'y sont plus. C'est pourquoi les politiques urbaines imposent des quotas de logements sociaux dans les rénovations."
      },
      {
        type: 'vraifaux',
        q: 'En géographie, le mot « banlieue » désigne les quartiers pauvres.',
        reponse: false,
        explication: "Faux. Le mot est neutre : il désigne les communes qui entourent la ville-centre. Neuilly-sur-Seine et Clichy-sous-Bois sont toutes deux en banlieue parisienne, avec des situations sociales opposées."
      },
      {
        type: 'qcm',
        q: 'Un paysage montre des tours de bureaux vitrées, une large avenue, un métro aérien, aucun logement. De quelle zone s\'agit-il ?',
        choix: ['Un espace périurbain', 'Un quartier d\'affaires', 'Un centre-ville ancien'],
        reponse: 1,
        explication: "Un quartier d'affaires. Les indices : tours récentes, fonction « travailler » seule visible, forte desserte en transports. Il se vide le soir puisque personne n'y habite."
      },
      {
        type: 'qcm',
        q: 'Un paysage montre des maisons identiques avec jardin, des rues en impasse, deux voitures par maison, des champs au fond. De quelle zone s\'agit-il ?',
        choix: ['Une banlieue de grands ensembles', 'Un espace périurbain', 'Un quartier d\'affaires'],
        reponse: 1,
        explication: "Un espace périurbain. Les indices : bâti bas et répétitif, densité faible, absence de commerce et de transport en commun, champs à l'arrière-plan. Les deux voitures signalent la dépendance automobile."
      },
      {
        type: 'qcm',
        q: 'Où se situe le quartier d\'affaires de La Défense par rapport à Paris ?',
        choix: ['Au cœur historique', 'À la limite ouest de l\'agglomération', 'À 50 km du centre'],
        reponse: 1,
        explication: "À la limite ouest de l'agglomération. Le centre historique parisien est protégé : on ne pouvait pas y construire de tours. À New York, au contraire, les tours de Manhattan sont au cœur de la ville."
      },
      {
        type: 'qcm',
        q: 'Dans les pays en développement, quel est le principal moteur de l\'urbanisation ?',
        choix: ['La périurbanisation', 'L\'exode rural et la croissance naturelle', 'Le tourisme'],
        reponse: 1,
        explication: "L'exode rural et une forte croissance naturelle. Les habitants arrivent plus vite que les logements et les réseaux ne peuvent être construits : c'est de là que naissent les quartiers informels."
      },
      {
        type: 'qcm',
        q: 'Combien de personnes vivent dans un habitat précaire dans le monde ?',
        choix: ['Environ 100 millions', 'Environ 1 milliard', 'Environ 3 milliards'],
        reponse: 1,
        explication: "Environ 1 milliard, soit près d'un urbain sur quatre. Le quartier de Dharavi, à Bombay, compte à lui seul environ 700 000 habitants sur 2,4 km²."
      },
      {
        type: 'vraifaux',
        q: 'Les bidonvilles sont des espaces sans activité économique.',
        reponse: false,
        explication: "Faux. Dharavi abrite des milliers d'ateliers de recyclage, de poterie et de textile. Ce qui manque n'est pas le travail, ce sont les droits, les titres de propriété et les réseaux d'eau et d'assainissement."
      },
      {
        type: 'qcm',
        q: 'Quelle réponse publique conserve le tissu social et économique d\'un quartier informel ?',
        choix: ['La destruction', 'Le relogement loin des emplois', 'La réhabilitation sur place'],
        reponse: 2,
        explication: "La réhabilitation sur place. Elle est lente, coûteuse et juridiquement complexe, mais elle ne détruit ni les emplois ni les liens existants, contrairement au relogement en périphérie."
      },
      {
        type: 'qcm',
        q: 'Un quartier neuf a des toits végétalisés mais se trouve à 28 km du centre, sans transport en commun. Est-il durable ?',
        choix: ['Oui, grâce aux toits végétalisés', 'Non, car son bilan réel est mauvais', 'On ne peut pas savoir'],
        reponse: 1,
        explication: "Non. Les économies faites sur le bâtiment sont annulées par les déplacements quotidiens imposés et par les terres agricoles consommées. Le critère est le bilan global, pas l'apparence verte."
      }
    ]
  }
,
  'maths/L03': {
    titre: 'Calcul littéral : développer, réduire, factoriser',
    items: [
      {
        type: 'qcm',
        q: 'Comment simplifie-t-on l\'écriture de <strong>1 × x × x</strong> ?',
        choix: ['1x2', '2x', 'x²'],
        reponse: 2,
        explication: "x². Le coefficient 1 ne s'écrit pas, et une lettre multipliée par elle-même donne un carré. Attention : 2x signifierait x + x, ce qui n'est pas la même chose."
      },
      {
        type: 'qcm',
        q: 'Quelle écriture est correcte ?',
        choix: ['a5', '5a', '5 a ×'],
        reponse: 1,
        explication: "5a. Le nombre s'écrit toujours avant la lettre, et le signe × disparaît devant une lettre. En revanche, entre deux nombres on garde toujours le signe : 3 × 5 ne s'écrit jamais 35."
      },
      {
        type: 'saisie',
        q: 'Réduis : 5x + 3 − 2x + 8',
        reponses: ['3x + 11', '3x+11', '11 + 3x'],
        explication: "3x + 11. On regroupe les termes en x : 5x − 2x = 3x. Puis les nombres seuls : 3 + 8 = 11. On n'additionne jamais un terme en x avec un nombre seul."
      },
      {
        type: 'vraifaux',
        q: 'L\'expression 3x + 2 peut se réduire en 5x.',
        reponse: false,
        explication: "Faux. 3x et 2 ne sont pas des termes semblables : l'un a une partie littérale, l'autre non. L'expression 3x + 2 est déjà réduite, c'est une réponse complète."
      },
      {
        type: 'qcm',
        q: 'Que vaut (−2)² ?',
        choix: ['−4', '4', '−2'],
        reponse: 1,
        explication: "4. On met le nombre −2 au carré, et moins par moins donne plus. Attention : −2² vaut −4, car on élève 2 au carré puis on prend l'opposé. D'où l'importance des parenthèses à la substitution."
      },
      {
        type: 'saisie',
        q: 'Calcule x² − 4x pour x = −1.',
        reponses: ['5'],
        explication: "(−1)² − 4 × (−1) = 1 − (−4) = 1 + 4 = 5. Les deux pièges sont le carré du négatif, qui donne +1, et la soustraction d'un nombre négatif, qui devient une addition."
      },
      {
        type: 'qcm',
        q: 'Développe 3(x + 4).',
        choix: ['3x + 4', '3x + 12', 'x + 12'],
        reponse: 1,
        explication: "3x + 12. Le facteur 3 multiplie LES DEUX termes de la parenthèse. Le réflexe : tracer deux flèches au crayon avant de calculer, une par terme."
      },
      {
        type: 'qcm',
        q: 'Développe −2(x − 5).',
        choix: ['−2x − 10', '−2x + 10', '2x + 10'],
        reponse: 1,
        explication: "−2x + 10. Le facteur négatif change le signe de chaque terme : (−2) × x = −2x, et (−2) × (−5) = +10. Moins par moins donne plus."
      },
      {
        type: 'saisie',
        q: 'Développe et réduis : 7 − (x + 2)',
        reponses: ['5 - x', '5 − x', '5-x', '- x + 5', '−x + 5'],
        explication: "5 − x. C'est l'erreur la plus fréquente du chapitre : le moins porte sur TOUTE la parenthèse, donc le +2 devient −2. On obtient 7 − x − 2, soit 5 − x, et non 7 − x + 2."
      },
      {
        type: 'qcm',
        q: 'Combien de produits obtient-on en développant (a + b)(c + d) ?',
        choix: ['Deux', 'Trois', 'Quatre'],
        reponse: 2,
        explication: "Quatre : ac, ad, bc et bd. Chaque terme de la première parenthèse multiplie chaque terme de la seconde. Compter les produits avant de réduire est le meilleur contrôle."
      },
      {
        type: 'saisie',
        q: 'Développe et réduis : (x + 2)(x + 5)',
        reponses: ['x² + 7x + 10', 'x^2 + 7x + 10', 'x2 + 7x + 10', 'x²+7x+10'],
        explication: "x² + 5x + 2x + 10 = x² + 7x + 10. Réponse fausse fréquente : x² + 10, qui oublie les deux produits du milieu."
      },
      {
        type: 'qcm',
        q: 'Que vaut (x + 4)² ?',
        choix: ['x² + 16', 'x² + 8x + 16', 'x² + 4x + 16'],
        reponse: 1,
        explication: "x² + 8x + 16. On réécrit (x + 4)(x + 4) puis on développe les quatre produits. Le carré d'une somme n'est jamais la somme des carrés."
      },
      {
        type: 'qcm',
        q: 'Développe (2x + 3)(2x − 3).',
        choix: ['4x² − 9', '4x² + 9', '4x² − 12x − 9'],
        reponse: 0,
        explication: "4x² − 6x + 6x − 9 = 4x² − 9. Les deux termes du milieu s'annulent exactement. C'est un cas remarquable qu'on retrouvera souvent."
      },
      {
        type: 'qcm',
        q: 'Que signifie « factoriser » ?',
        choix: ['Transformer une somme en produit', 'Transformer un produit en somme', 'Calculer une valeur'],
        reponse: 0,
        explication: "Transformer une somme en produit. C'est l'opération inverse du développement, qui transforme un produit en somme. On repère un facteur commun et on l'écrit devant une parenthèse."
      },
      {
        type: 'saisie',
        q: 'Factorise : 6x + 15',
        reponses: ['3(2x + 5)', '3(2x+5)', '3 (2x + 5)'],
        explication: "3(2x + 5). Le facteur commun est 3, car 6 = 3 × 2 et 15 = 3 × 5. Vérification en redéveloppant : 3 × 2x + 3 × 5 = 6x + 15."
      },
      {
        type: 'saisie',
        q: 'Factorise : x² + 7x',
        reponses: ['x(x + 7)', 'x(x+7)', 'x (x + 7)'],
        explication: "x(x + 7). Le facteur commun est x, puisque x² = x × x et 7x = x × 7. Vérification : x × x + x × 7 = x² + 7x."
      },
      {
        type: 'qcm',
        q: 'Factorise 4x² − 6x.',
        choix: ['2(2x² − 3x)', 'x(4x − 6)', '2x(2x − 3)'],
        reponse: 2,
        explication: "2x(2x − 3). Les trois réponses sont des factorisations valables, mais seule la troisième est complète : elle sort à la fois le 2 des nombres et le x des lettres."
      },
      {
        type: 'qcm',
        q: 'Factorise 5x + 5.',
        choix: ['5(x)', '5(x + 1)', '5x(1 + 1)'],
        reponse: 1,
        explication: "5(x + 1). Quand un terme est égal au facteur commun, ce qui reste vaut 1, et non rien du tout. Vérification : 5 × x + 5 × 1 = 5x + 5."
      },
      {
        type: 'qcm',
        q: 'Comment vérifier rapidement un développement ?',
        choix: ['En recommençant le calcul', 'En testant les deux expressions avec x = 2', 'En regardant la longueur du résultat'],
        reponse: 1,
        explication: "En testant une valeur, de préférence 2 ou 3. Si les deux résultats diffèrent, il y a certainement une erreur. S'ils coïncident, c'est probablement juste : le test détecte, il ne prouve pas."
      },
      {
        type: 'vraifaux',
        q: 'Pour vérifier une factorisation, on peut redévelopper et comparer à l\'expression de départ.',
        reponse: true,
        explication: "Vrai, et c'est la meilleure méthode. Développer et factoriser sont deux opérations inverses : en redéveloppant, on doit retrouver exactement l'expression initiale, terme pour terme."
      }
    ]
  }
,
  'maths/L04': {
    titre: 'Équations du premier degré',
    items: [
      {
        type: 'qcm',
        q: 'Laquelle de ces écritures est une équation ?',
        choix: ['4x − 9', '2(x + 1)', '4x − 9 = 3'],
        reponse: 2,
        explication: "Une équation contient un signe égal. Les deux autres écritures sont des expressions : on peut les développer ou les réduire, mais on ne peut pas les résoudre."
      },
      {
        type: 'vraifaux',
        q: 'x = 3 est solution de 2x + 4 = 10.',
        reponse: true,
        explication: "Vrai. Membre de gauche : 2 × 3 + 4 = 10. Membre de droite : 10. Les deux sont égaux. On calcule toujours les deux membres SÉPARÉMENT avant de comparer."
      },
      {
        type: 'qcm',
        q: 'Que peut-on faire à une équation sans changer ses solutions ?',
        choix: ['Ajouter un nombre au membre de gauche seulement', 'Ajouter un même nombre aux deux membres', 'Multiplier les deux membres par zéro'],
        reponse: 1,
        explication: "Ajouter un même nombre aux deux membres. C'est l'image de la balance : ce qu'on met sur un plateau, on le met sur l'autre. Multiplier par zéro donnerait 0 = 0 et ferait perdre toute l'information."
      },
      {
        type: 'saisie',
        q: 'Résous : 3x + 5 = 20. Donne la valeur de x.',
        reponses: ['5', 'x = 5', 'x=5'],
        explication: "On soustrait 5 aux deux membres : 3x = 15. On divise les deux membres par 3 : x = 5. Vérification : 3 × 5 + 5 = 20."
      },
      {
        type: 'saisie',
        q: 'Résous : 7x − 12 = 30.',
        reponses: ['6', 'x = 6', 'x=6'],
        explication: "On ajoute 12 aux deux membres : 7x = 42. On divise par 7 : x = 6. Vérification : 7 × 6 − 12 = 42 − 12 = 30."
      },
      {
        type: 'qcm',
        q: 'Pour résoudre 4x = 20, que fait-on ?',
        choix: ['On divise les deux membres par 4', 'On multiplie les deux membres par 4', 'On soustrait 4 aux deux membres'],
        reponse: 0,
        explication: "On divise par 4, ce qui donne x = 5. Multiplier donnerait 80, une erreur fréquente : quand le nombre multiplie l'inconnue, on divise pour l'isoler."
      },
      {
        type: 'saisie',
        q: 'Résous : 5x + 3 = 2x + 18.',
        reponses: ['5', 'x = 5', 'x=5'],
        explication: "On soustrait 2x aux deux membres : 3x + 3 = 18. Puis 3x = 15, donc x = 5. Vérification : gauche 28, droite 28."
      },
      {
        type: 'qcm',
        q: 'Dans 3x + 20 = 8x − 5, de quel côté vaut-il mieux rassembler les x ?',
        choix: ['À gauche', 'À droite', 'Cela ne change rien au résultat mais à droite évite un coefficient négatif'],
        reponse: 2,
        explication: "Les deux méthodes donnent x = 5. Mais rassembler du côté du plus grand coefficient, ici 8x à droite, évite d'obtenir un coefficient négatif et une division par un nombre négatif."
      },
      {
        type: 'saisie',
        q: 'Résous : 2(x + 5) = 18.',
        reponses: ['4', 'x = 4', 'x=4'],
        explication: "On développe d'abord : 2x + 10 = 18. Puis 2x = 8, donc x = 4. On développe TOUJOURS avant de rassembler les termes."
      },
      {
        type: 'saisie',
        q: 'Résous : 7x − 2(x − 3) = 21.',
        reponses: ['3', 'x = 3', 'x=3'],
        explication: "−2(x − 3) donne −2x + 6, et non −2x − 6. L'équation devient 5x + 6 = 21, donc 5x = 15 et x = 3. Le moins devant la parenthèse change tous les signes."
      },
      {
        type: 'qcm',
        q: 'Pour résoudre x/3 + 2 = 5, on multiplie les deux membres par 3. Qu\'obtient-on ?',
        choix: ['x + 2 = 5', 'x + 6 = 15', 'x + 6 = 5'],
        reponse: 1,
        explication: "x + 6 = 15. La multiplication touche TOUS les termes, y compris le 2 qui devient 6 et le 5 qui devient 15. On trouve ensuite x = 9."
      },
      {
        type: 'saisie',
        q: 'Résous : x/2 + x/3 = 5.',
        reponses: ['6', 'x = 6', 'x=6'],
        explication: "Le dénominateur commun de 2 et 3 est 6. En multipliant tout par 6 : 3x + 2x = 30, soit 5x = 30 et x = 6. Vérification : 6/2 + 6/3 = 3 + 2 = 5."
      },
      {
        type: 'qcm',
        q: 'En résolvant, on obtient 5 = 9. Que conclut-on ?',
        choix: ['x = 0', 'L\'équation n\'a aucune solution', 'L\'équation a une infinité de solutions'],
        reponse: 1,
        explication: "Aucune solution. Les x ont disparu des deux côtés et il reste une égalité entre nombres qui est fausse : aucune valeur de x ne peut rendre l'équation vraie."
      },
      {
        type: 'qcm',
        q: 'En résolvant, on obtient 6 = 6. Que conclut-on ?',
        choix: ['Aucune solution', 'Une infinité de solutions', 'x = 6'],
        reponse: 1,
        explication: "Une infinité de solutions : l'égalité est vraie pour tout nombre. C'est le cas de 3(x + 2) = 3x + 6, qu'on appelle une identité."
      },
      {
        type: 'vraifaux',
        q: 'Si x = 0 est solution, cela signifie que l\'équation n\'a pas de solution.',
        reponse: false,
        explication: "Faux. x = 0 est UNE solution, qui se trouve être le nombre zéro. C'est très différent d'une équation qu'aucune valeur ne rend vraie."
      },
      {
        type: 'qcm',
        q: 'Comment traduit-on « 5 de moins que x » ?',
        choix: ['5 − x', 'x − 5', 'x/5'],
        reponse: 1,
        explication: "x − 5. Attention : « 5 moins x » s'écrirait 5 − x, ce qui est différent. Lire lentement pour repérer qui est retranché à qui évite cette erreur classique."
      },
      {
        type: 'saisie',
        q: 'Traduis en équation : « le triple d\'un nombre, augmenté de 7, vaut 31 ». Quelle est la valeur du nombre ?',
        reponses: ['8', 'x = 8', 'x=8'],
        explication: "L'équation est 3x + 7 = 31. On soustrait 7 : 3x = 24, donc x = 8. Vérification : 3 × 8 + 7 = 31."
      },
      {
        type: 'qcm',
        q: 'Deux amis se partagent 48 euros, le premier recevant 6 euros de plus. Quelle équation traduit la situation, si x est la part du second ?',
        choix: ['x + 6 = 48', 'x + (x + 6) = 48', '2x = 48 + 6'],
        reponse: 1,
        explication: "x + (x + 6) = 48, soit 2x + 6 = 48. On trouve x = 21 pour le second et 27 pour le premier. Vérification : 21 + 27 = 48 et 27 − 21 = 6."
      },
      {
        type: 'qcm',
        q: 'Un rectangle a une longueur de 5 cm de plus que sa largeur x, et un périmètre de 46 cm. Quelle équation écrit-on ?',
        choix: ['x + (x + 5) = 46', '2(x + 5) + 2x = 46', 'x(x + 5) = 46'],
        reponse: 1,
        explication: "Le périmètre vaut 2 × longueur + 2 × largeur, soit 2(x + 5) + 2x = 46. On trouve x = 9 : la largeur fait 9 cm et la longueur 14 cm."
      },
      {
        type: 'vraifaux',
        q: 'Une résolution est complète quand on a écrit « x = 8 ».',
        reponse: false,
        explication: "Faux. Il manque la vérification, qui calcule les deux membres séparément, et la conclusion, qui répond à la question posée avec les mots de l'énoncé et l'unité : « Le nombre cherché est 8 »."
      }
    ]
  }
,
  'anglais-lv1/L02': {
    titre: 'Obligation, advice, permission',
    items: [
      {
        type: 'qcm',
        q: 'Quelle phrase est correcte ?',
        choix: ['She must to leave now.', 'She musts leave now.', 'She must leave now.'],
        reponse: 2,
        explication: "Un modal est suivi de la base verbale, sans « to », et ne prend jamais de « s » à la troisième personne. Les deux premières phrases cumulent chacune une de ces erreurs."
      },
      {
        type: 'qcm',
        q: 'Quelle est la forme interrogative de « She must wear a uniform » ?',
        choix: ['Does she must wear a uniform?', 'Must she wear a uniform?', 'Do she must wear a uniform?'],
        reponse: 1,
        explication: "Must she wear a uniform ? Un modal forme sa question par inversion, sans l'auxiliaire « do ». Celui-ci n'est nécessaire que pour les verbes ordinaires."
      },
      {
        type: 'saisie',
        q: 'Corrige cette phrase : « He have to work on Saturdays. » Écris le mot correct à la place de « have ».',
        reponses: ['has'],
        explication: "« has ». Contrairement aux modaux, « have to » est un verbe ordinaire : il s'accorde et prend un « s » à la troisième personne du singulier."
      },
      {
        type: 'qcm',
        q: 'D\'où vient l\'obligation dans « I have to wear a uniform at school » ?',
        choix: ['De celui qui parle', 'De l\'extérieur', 'De personne'],
        reponse: 1,
        explication: "De l'extérieur : c'est l'école qui impose l'uniforme. « must » exprimerait au contraire une obligation que celui qui parle s'impose à lui-même."
      },
      {
        type: 'saisie',
        q: 'Mets au passé : « I must take the bus. » Écris la phrase complète.',
        reponses: ['i had to take the bus', 'I had to take the bus.', 'i had to take the bus.', 'I had to take the bus'],
        explication: "I had to take the bus. « must » n'existe qu'au présent : il n'a ni passé ni futur. On passe donc obligatoirement par « had to »."
      },
      {
        type: 'qcm',
        q: 'Comment dit-on « je devrai partir tôt » ?',
        choix: ['I will must leave early.', 'I will have to leave early.', 'I musted leave early.'],
        reponse: 1,
        explication: "I will have to leave early. On ne peut jamais faire suivre un modal d'un autre modal : « will must » est impossible. Et « musted » n'existe pas."
      },
      {
        type: 'qcm',
        q: 'Que signifie « You mustn\'t take photos here » ?',
        choix: ['Tu n\'es pas obligée de photographier', 'Il est interdit de photographier', 'Tu peux photographier si tu veux'],
        reponse: 1,
        explication: "Il est interdit. C'est la distinction la plus importante du chapitre : mustn't interdit, alors que don't have to libère. Les traduire tous les deux par « tu ne dois pas » crée un contresens."
      },
      {
        type: 'qcm',
        q: 'Que signifie « You don\'t have to wear a tie » ?',
        choix: ['Il est interdit de porter une cravate', 'Tu n\'es pas obligé d\'en porter une', 'Tu dois en porter une'],
        reponse: 1,
        explication: "Tu n'es pas obligé. Le port de la cravate reste autorisé : il est simplement facultatif. Pour l'interdire, il faudrait écrire « You mustn't wear a tie »."
      },
      {
        type: 'qcm',
        q: 'Sur une notice de médicament, comment traduire « il ne faut surtout pas mélanger avec de l\'alcool » ?',
        choix: ['You don\'t have to take this with alcohol.', 'You mustn\'t take this with alcohol.', 'You shouldn\'t have to take this with alcohol.'],
        reponse: 1,
        explication: "You mustn't take this with alcohol. C'est une interdiction stricte. La première phrase signifierait qu'on peut le faire mais que ce n'est pas obligatoire : l'erreur aurait ici une conséquence sanitaire."
      },
      {
        type: 'saisie',
        q: 'Complète : « You look tired. You ______ go to bed early. » (un conseil)',
        reponses: ['should'],
        explication: "should. C'est un conseil, pas une obligation : on laisse à l'autre la liberté de ne pas le suivre. « must » serait beaucoup trop fort dans cette situation."
      },
      {
        type: 'qcm',
        q: 'Range ces formes de la plus souple à la plus forte.',
        choix: ['must, should, could, had better', 'could, should, had better, must', 'should, could, must, had better'],
        reponse: 1,
        explication: "could (suggestion), should (conseil), had better (conseil pressant), must (obligation). Quatre degrés à connaître pour adapter sa phrase à la situation."
      },
      {
        type: 'vraifaux',
        q: '« You\'d better hurry » parle du passé, à cause de « had ».',
        reponse: false,
        explication: "Faux. Malgré la forme « had », « had better » parle du présent et du futur : « tu ferais mieux de te dépêcher ». C'est une exception qu'on retient telle quelle."
      },
      {
        type: 'qcm',
        q: 'Après « had better », quelle forme du verbe emploie-t-on ?',
        choix: ['la base verbale sans to', 'l\'infinitif avec to', 'le participe passé'],
        reponse: 0,
        explication: "La base verbale sans « to » : You'd better leave. La négation se construit en « had better not » : You'd better not be late."
      },
      {
        type: 'qcm',
        q: 'Que demande « Can you swim? »',
        choix: ['As-tu le droit de nager ici ?', 'Sais-tu nager ?', 'Veux-tu nager ?'],
        reponse: 1,
        explication: "Sais-tu nager ? « can » exprime ici la capacité. Pour demander l'autorisation, on dirait « May I swim here? ». Le français « peux-tu » recouvre les deux sens, pas l'anglais."
      },
      {
        type: 'qcm',
        q: 'Quelle formule est la plus formelle pour demander une permission ?',
        choix: ['Can I ...?', 'Could I ...?', 'May I ...?'],
        reponse: 2,
        explication: "May I ...? est la plus formelle, adaptée à un adulte inconnu ou à un lieu officiel. « Could I » est poli, « Can I » est courant entre proches."
      },
      {
        type: 'saisie',
        q: 'Écris la forme négative de « can » en un seul mot (forme pleine).',
        reponses: ['cannot', 'can not', 'can\'t', 'cant'],
        explication: "cannot, contracté en can't. C'est le seul modal dont la forme pleine négative s'écrit en un seul mot : on n'écrit pas « can not » en deux mots en anglais standard."
      },
      {
        type: 'qcm',
        q: 'Comment refuser poliment une demande en anglais ?',
        choix: ['No, you can\'t.', 'I\'m afraid you can\'t.', 'You mustn\'t ask.'],
        reponse: 1,
        explication: "I'm afraid you can't. La première réponse est grammaticalement correcte mais très sèche : en anglais, on adoucit presque toujours un refus par une formule d'excuse."
      },
      {
        type: 'qcm',
        q: 'Un panneau indique « Casque obligatoire ». Comment l\'écrire en anglais ?',
        choix: ['You don\'t have to wear a helmet.', 'You must wear a helmet.', 'You should wear a helmet.'],
        reponse: 1,
        explication: "You must wear a helmet, ou You have to wear a helmet. « should » serait un simple conseil, et la première phrase dirait l'inverse de ce qu'indique le panneau."
      },
      {
        type: 'qcm',
        q: 'Une note d\'école dit : « L\'uniforme n\'est pas exigé le vendredi. » Comment le traduire ?',
        choix: ['You mustn\'t wear a uniform on Fridays.', 'You don\'t have to wear a uniform on Fridays.', 'You can\'t wear a uniform on Fridays.'],
        reponse: 1,
        explication: "You don't have to wear a uniform on Fridays. L'uniforme reste autorisé : il n'est simplement plus obligatoire. Les deux autres phrases l'interdiraient."
      },
      {
        type: 'vraifaux',
        q: 'La forme négative de « I must go » peut se remplacer par « I don\'t have to go » sans changer le sens.',
        reponse: false,
        explication: "Faux. « I mustn't go » signifie qu'il m'est interdit d'y aller, alors que « I don't have to go » signifie que je n'y suis pas obligé. À la forme affirmative, must et have to sont proches ; à la négative, ils s'opposent."
      }
    ]
  }
,
  'espagnol-lv2/L02': {
    titre: 'Ser, estar, hay',
    items: [
      {
        type: 'saisie',
        q: 'Complète : « Yo ___ española. » (verbe ser)',
        reponses: ['soy'],
        explication: "soy. La nationalité se dit toujours avec ser, qui définit ce que la personne est. Les six formes sont soy, eres, es, somos, sois, son."
      },
      {
        type: 'saisie',
        q: 'Complète avec estar, accent compris : « Tú ___ cansado. »',
        reponses: ['estás', 'estas'],
        explication: "estás, avec un accent écrit sur le a. Seules estoy et estamos s'écrivent sans accent ; estás, está, estáis et están en portent un, et l'oublier est une faute."
      },
      {
        type: 'qcm',
        q: 'Complète : « Madrid ___ en España. »',
        choix: ['es', 'está', 'hay'],
        reponse: 1,
        explication: "está. Le lieu se dit TOUJOURS avec estar, même pour une ville qui ne bouge jamais. La règle ne dépend pas de la durée mais du type d'information."
      },
      {
        type: 'qcm',
        q: 'Complète : « Mi padre ___ profesor. »',
        choix: ['es', 'está', 'hay'],
        reponse: 0,
        explication: "es. La profession se dit avec ser, comme la nationalité, la matière, la possession et l'heure : tout ce qui définit ce qu'une personne ou une chose est."
      },
      {
        type: 'qcm',
        q: 'Comment dit-on « je suis fatiguée » ?',
        choix: ['Soy cansada.', 'Estoy cansada.', 'Hay cansada.'],
        reponse: 1,
        explication: "Estoy cansada. La fatigue est un état passager : c'est le domaine de estar. « Soy cansada » n'a pas de sens en espagnol."
      },
      {
        type: 'qcm',
        q: 'Complète : « ___ las tres de la tarde. »',
        choix: ['Son', 'Están', 'Hay'],
        reponse: 0,
        explication: "Son. L'heure se dit avec ser, et au pluriel à partir de deux heures. On dit seulement « Es la una » au singulier, pour une heure."
      },
      {
        type: 'vraifaux',
        q: 'On dit « La fiesta está en mi casa ».',
        reponse: false,
        explication: "Faux. On dit « La fiesta es en mi casa ». C'est l'exception à connaître : un ÉVÉNEMENT a lieu, il ne se situe pas, donc il prend ser. Un objet ou une personne prendrait estar."
      },
      {
        type: 'qcm',
        q: 'Complète : « En mi calle ___ una farmacia. »',
        choix: ['hay', 'está', 'es'],
        reponse: 0,
        explication: "hay. On signale l'existence d'une pharmacie qu'on n'a pas encore nommée, avec un article indéfini. Pour dire où elle se trouve ensuite, on dirait « La farmacia está... »."
      },
      {
        type: 'qcm',
        q: 'Complète : « La farmacia ___ al lado del banco. »',
        choix: ['hay', 'está', 'es'],
        reponse: 1,
        explication: "está. L'article défini « la » montre qu'on parle d'une pharmacie déjà connue : on dit alors où elle se trouve. Introduire avec hay, situer avec estar."
      },
      {
        type: 'vraifaux',
        q: 'On peut écrire « Hay el libro en la mesa ».',
        reponse: false,
        explication: "Faux. hay n'est jamais suivi d'un article défini. Dès qu'on parle d'une chose précise et connue, on emploie estar : « El libro está en la mesa »."
      },
      {
        type: 'saisie',
        q: 'Traduis : « Il y a trois chaises. »',
        reponses: ['hay tres sillas', 'Hay tres sillas.', 'hay tres sillas.', 'Hay tres sillas'],
        explication: "Hay tres sillas. hay est invariable : il ne se conjugue jamais, même devant un pluriel. On n'écrit ni « hayn » ni « hays »."
      },
      {
        type: 'qcm',
        q: 'Que signifie « El profesor está aburrido » ?',
        choix: ['Le professeur est ennuyeux', 'Le professeur s\'ennuie', 'Le professeur est absent'],
        reponse: 1,
        explication: "Le professeur s'ennuie. Avec ser, « es aburrido » signifierait qu'il est ennuyeux. C'est le même adjectif pour deux sens opposés selon le verbe."
      },
      {
        type: 'qcm',
        q: 'Comment dit-on « je suis prêt » ?',
        choix: ['Soy listo.', 'Estoy listo.', 'Hay listo.'],
        reponse: 1,
        explication: "Estoy listo. Avec ser, « soy listo » signifie « je suis intelligent ». C'est l'un des huit adjectifs qui changent complètement de sens selon le verbe."
      },
      {
        type: 'qcm',
        q: '« La manzana está verde » signifie :',
        choix: ['La pomme est de couleur verte', 'La pomme n\'est pas mûre', 'La pomme est pourrie'],
        reponse: 1,
        explication: "La pomme n'est pas mûre. Avec ser, « la puerta es verde » désignerait bien la couleur. Avec estar, verde indique un état passager : le fruit n'est pas encore mûr."
      },
      {
        type: 'saisie',
        q: 'Comment dit-on « elle a quinze ans » ? Écris la phrase complète.',
        reponses: ['tiene quince años', 'Tiene quince años.', 'tiene quince anos', 'Tiene quince años'],
        explication: "Tiene quince años. L'âge se dit avec tener, comme en français avec « avoir ». Ni « es quince años » ni « está quince años » n'existent."
      },
      {
        type: 'qcm',
        q: 'Que demande « ¿Cómo eres? »',
        choix: ['Comment vas-tu ?', 'Comment es-tu physiquement et de caractère ?', 'Où es-tu ?'],
        reponse: 1,
        explication: "Comment es-tu, physiquement et de caractère. Pour demander comment quelqu'un va, on dit « ¿Cómo estás? », à quoi on répond « Estoy bien », jamais « Soy bien »."
      },
      {
        type: 'qcm',
        q: 'Quelle préposition signifie « sous » ?',
        choix: ['encima de', 'debajo de', 'delante de'],
        reponse: 1,
        explication: "debajo de. encima de veut dire « sur », delante de « devant ». Les autres à connaître : detrás de (derrière), al lado de (à côté de), enfrente de (en face de)."
      },
      {
        type: 'qcm',
        q: 'Dans une description de chambre, quel est le bon ordre ?',
        choix: ['D\'abord estar pour situer, ensuite hay', 'D\'abord hay pour dire ce qui existe, ensuite estar pour situer', 'Peu importe l\'ordre'],
        reponse: 1,
        explication: "D'abord hay, ensuite estar. On introduit les objets avec hay et un article indéfini, puis on les situe avec estar et un article défini. Inverser sonne artificiel en espagnol."
      },
      {
        type: 'saisie',
        q: 'Complète : « Nosotras ___ contentas. » (verbe estar)',
        reponses: ['estamos'],
        explication: "estamos, sans accent. Attention aussi à l'accord de l'adjectif : « contentas » au féminin pluriel, puisque le sujet est « nosotras »."
      },
      {
        type: 'qcm',
        q: 'Quelle règle est la plus fiable pour choisir entre ser et estar ?',
        choix: ['ser pour ce qui ne change pas, estar pour ce qui change', 'ser pour ce que la chose EST, estar pour OÙ elle est et COMMENT elle va', 'ser au présent, estar aux autres temps'],
        reponse: 1,
        explication: "La seconde. La règle de la durée échoue sur « Madrid está en España », qui est pourtant définitif. Ce qui compte, c'est le type d'information : définir ou situer."
      }
    ]
  }
,
  'physique-chimie/L03': {
    titre: 'Masse volumique et états de la matière',
    items: [
      {
        type: 'qcm',
        q: 'Quelle est la formule de la masse volumique ?',
        choix: ['ρ = m × V', 'ρ = m ÷ V', 'ρ = V ÷ m'],
        reponse: 1,
        explication: "ρ = m ÷ V. C'est la masse d'une unité de volume. Les deux formes dérivées s'en déduisent : m = ρ × V et V = m ÷ ρ."
      },
      {
        type: 'saisie',
        q: 'Quelle est la masse volumique de l\'eau, en g/cm³ ?',
        reponses: ['1', '1,0', '1.0', '1 g/cm3', '1,0 g/cm³'],
        explication: "1,0 g/cm³, soit 1000 kg/m³. C'est la valeur pivot de tout le chapitre : elle sert à prévoir ce qui flotte et ce qui coule. Le gramme a d'ailleurs été défini à partir de l'eau."
      },
      {
        type: 'qcm',
        q: 'Combien vaut 1 mL en cm³ ?',
        choix: ['0,1 cm³', '1 cm³', '10 cm³'],
        reponse: 1,
        explication: "1 mL = 1 cm³. Les autres équivalences à connaître : 1 L = 1000 mL = 1000 cm³ = 1 dm³, et 1 m³ = 1000 L."
      },
      {
        type: 'saisie',
        q: 'Un objet a une masse de 54 g et un volume de 20 cm³. Quelle est sa masse volumique en g/cm³ ?',
        reponses: ['2,7', '2.7', '2,7 g/cm3', '2,7 g/cm³'],
        explication: "ρ = 54 ÷ 20 = 2,7 g/cm³. Cette valeur correspond à celle de l'aluminium : l'objet est donc vraisemblablement en aluminium."
      },
      {
        type: 'saisie',
        q: 'Quelle est la masse de 50 cm³ de fer ? (ρ = 7,9 g/cm³). Réponds en grammes.',
        reponses: ['395', '395 g'],
        explication: "m = ρ × V = 7,9 × 50 = 395 g. Quand on cherche la masse, on multiplie la masse volumique par le volume."
      },
      {
        type: 'qcm',
        q: 'Un élève écrit : m = 2 kg, V = 500 cm³, donc ρ = 2 ÷ 500 = 0,004. Quelle est l\'erreur ?',
        choix: ['Il a inversé la formule', 'Il a mélangé les unités', 'Il n\'y a pas d\'erreur'],
        reponse: 1,
        explication: "Il a mélangé kilogrammes et centimètres cubes. Il faut convertir : 2 kg = 2000 g, donc ρ = 2000 ÷ 500 = 4,0 g/cm³. Un résultat aberrant signale presque toujours une unité oubliée."
      },
      {
        type: 'qcm',
        q: 'On verse 60 mL d\'eau, on plonge un objet, le niveau monte à 82 mL. Quel est le volume de l\'objet ?',
        choix: ['82 cm³', '22 cm³', '142 cm³'],
        reponse: 1,
        explication: "82 − 60 = 22 cm³. Le volume de l'objet est la DIFFÉRENCE entre les deux niveaux, jamais le niveau final seul."
      },
      {
        type: 'qcm',
        q: 'Pourquoi la méthode du déplacement d\'eau échoue-t-elle avec un morceau de sucre ?',
        choix: ['Le sucre flotte', 'Le sucre se dissout', 'Le sucre est trop petit'],
        reponse: 1,
        explication: "Le sucre se dissout : il disparaît avant qu'on puisse lire le niveau. On utiliserait un liquide où il ne se dissout pas, comme l'huile, ou on calculerait le volume géométriquement."
      },
      {
        type: 'qcm',
        q: 'Qu\'est-ce qu\'une erreur de parallaxe ?',
        choix: ['Une éprouvette mal graduée', 'Une lecture faite avec l\'œil mal placé', 'Un calcul faux'],
        reponse: 1,
        explication: "C'est l'erreur commise quand l'œil n'est pas au niveau de la surface du liquide. Regarder de haut décale la lecture de plusieurs millilitres, alors que l'appareil est parfaitement correct."
      },
      {
        type: 'saisie',
        q: 'Quel est le volume d\'un cube de 4 cm de côté, en cm³ ?',
        reponses: ['64', '64 cm3', '64 cm³'],
        explication: "4 × 4 × 4 = 64 cm³. Pour une forme régulière, on calcule : la méthode du déplacement d'eau ne sert que pour les formes irrégulières."
      },
      {
        type: 'qcm',
        q: 'Un corps flotte sur un liquide si :',
        choix: ['sa masse est plus faible', 'sa masse volumique est inférieure à celle du liquide', 'son volume est plus petit'],
        reponse: 1,
        explication: "Si sa masse volumique est inférieure à celle du liquide. Ni la masse totale ni le volume ne décident seuls : c'est le rapport des deux qui compte."
      },
      {
        type: 'vraifaux',
        q: 'La glace flotte sur l\'eau parce qu\'elle est moins dense que l\'eau liquide.',
        reponse: true,
        explication: "Vrai : 0,92 g/cm³ contre 1,0. C'est une exception rare dans la nature, car pour presque toutes les substances le solide est plus dense que le liquide et coule."
      },
      {
        type: 'qcm',
        q: 'Pourquoi un paquebot de 100 000 tonnes flotte-t-il alors qu\'une bille d\'acier coule ?',
        choix: ['Parce qu\'il est plus grand', 'Parce que sa masse volumique moyenne, air intérieur compris, est inférieure à celle de l\'eau', 'Parce qu\'il avance'],
        reponse: 1,
        explication: "La coque d'acier entoure surtout de l'air : la masse volumique moyenne du navire tourne autour de 0,8 g/cm³. La bille, elle, est pleine d'acier à 7,8 g/cm³."
      },
      {
        type: 'qcm',
        q: 'Une mesure donne ρ = 8,85 g/cm³. Quelle conclusion est correcte ?',
        choix: ['C\'est du cuivre.', 'C\'est vraisemblablement du cuivre.', 'On ne peut rien dire.'],
        reponse: 1,
        explication: "« Vraisemblablement ». Toute mesure comporte une incertitude, et plusieurs matériaux ont des masses volumiques voisines. Une masse volumique est un indice fort, pas une preuve."
      },
      {
        type: 'qcm',
        q: 'Comment appelle-t-on le passage de l\'état gazeux à l\'état liquide ?',
        choix: ['La condensation', 'La liquéfaction', 'La sublimation'],
        reponse: 1,
        explication: "La liquéfaction. Au sens strict du programme, la condensation va du gaz vers le SOLIDE, comme le givre. La buée sur une vitre est donc une liquéfaction."
      },
      {
        type: 'qcm',
        q: 'Quelle différence entre l\'ébullition et l\'évaporation ?',
        choix: ['Aucune, ce sont des synonymes', 'L\'ébullition se fait à une température précise et dans toute la masse, l\'évaporation à toute température et en surface', 'L\'évaporation ne concerne que l\'eau'],
        reponse: 1,
        explication: "Les deux sont des vaporisations. L'ébullition a lieu à 100 °C pour l'eau, dans toute la masse, avec des bulles. L'évaporation a lieu à toute température, seulement en surface : c'est pourquoi une flaque sèche sans bouillir."
      },
      {
        type: 'vraifaux',
        q: 'Lors d\'un changement d\'état, la masse se conserve.',
        reponse: true,
        explication: "Vrai. Ce sont les mêmes molécules, en même nombre : seule leur disposition change. Le volume, lui, peut varier énormément."
      },
      {
        type: 'qcm',
        q: 'On congèle 500 g d\'eau. Quelle est la masse de glace obtenue ?',
        choix: ['460 g', '500 g', '543 g'],
        reponse: 1,
        explication: "500 g. La masse se conserve. En revanche le volume passe d'environ 500 cm³ à 543 cm³, car la glace est moins dense : 500 ÷ 0,92 ≈ 543."
      },
      {
        type: 'qcm',
        q: 'Pourquoi une bouteille pleine éclate-t-elle au congélateur ?',
        choix: ['La masse de l\'eau augmente', 'L\'eau augmente de volume d\'environ 9 % en gelant', 'Le verre se rétracte au froid'],
        reponse: 1,
        explication: "L'eau se dilate en gelant, d'environ 9 %. Dans une bouteille pleine et fermée, il n'y a pas de place pour cette expansion : la pression fait céder les parois. Le même phénomène fissure les routes."
      },
      {
        type: 'qcm',
        q: 'Un litre d\'eau liquide donne environ 1700 litres de vapeur. Que devient la masse ?',
        choix: ['Elle est multipliée par 1700', 'Elle reste d\'un kilogramme', 'Elle est divisée par 1700'],
        reponse: 1,
        explication: "Elle reste d'un kilogramme : la masse se conserve. C'est le volume qui est multiplié par 1700, donc la masse volumique qui est divisée par 1700. C'est ce qui rend une cocotte-minute dangereuse sous pression."
      }
    ]
  }
,
  'svt/L03': {
    titre: 'Le volcanisme',
    items: [
      {
        type: 'qcm',
        q: 'Quelle est la différence entre le magma et la lave ?',
        choix: ['Ce sont deux matières différentes', 'C\'est la même matière : magma en profondeur, lave en surface', 'La lave est plus chaude que le magma'],
        reponse: 1,
        explication: "C'est la même matière. On parle de magma en profondeur, avec ses gaz dissous, et de lave une fois arrivée en surface, après qu'elle en a perdu une grande partie."
      },
      {
        type: 'vraifaux',
        q: 'Le manteau terrestre est entièrement liquide.',
        reponse: false,
        explication: "Faux. Le manteau est solide, bien que déformable. Le magma se forme localement, par fusion partielle, dans trois situations précises seulement."
      },
      {
        type: 'qcm',
        q: 'Sous une dorsale océanique, qu\'est-ce qui provoque la fusion des roches ?',
        choix: ['Une baisse de pression', 'Un apport d\'eau', 'Un choc de météorite'],
        reponse: 0,
        explication: "Une baisse de pression : le manteau remonte sous la dorsale, la pression diminue et la roche fond partiellement. En subduction, c'est l'eau qui abaisse le point de fusion."
      },
      {
        type: 'qcm',
        q: 'En zone de subduction, pourquoi l\'eau fait-elle fondre les roches ?',
        choix: ['Elle les refroidit', 'Elle abaisse leur température de fusion', 'Elle les dissout'],
        reponse: 1,
        explication: "Elle abaisse leur température de fusion, exactement comme le sel fait fondre la glace sur une route sans que l'air se réchauffe. Des roches qui seraient restées solides fondent alors partiellement."
      },
      {
        type: 'saisie',
        q: 'Comment appelle-t-on le réservoir où le magma s\'accumule avant l\'éruption ? (deux mots)',
        reponses: ['chambre magmatique', 'la chambre magmatique'],
        explication: "La chambre magmatique, située à quelques kilomètres de profondeur. Le magma en remonte par la cheminée, un conduit étroit, pour sortir au cratère."
      },
      {
        type: 'vraifaux',
        q: 'Un volcan est une montagne creuse remplie de lave.',
        reponse: false,
        explication: "Faux. C'est un empilement de couches déposées par les éruptions successives. Seule une cheminée étroite le traverse ; tout le reste du cône est de la roche solide."
      },
      {
        type: 'qcm',
        q: 'Quelle est la forme caractéristique d\'un volcan effusif ?',
        choix: ['Étroit et très pentu', 'Large et peu pentu, en bouclier', 'Parfaitement conique'],
        reponse: 1,
        explication: "En bouclier : la lave fluide s'étale loin avant de se figer, donc les pentes sont douces. Un volcan explosif, dont la lave est visqueuse, est au contraire étroit et pentu."
      },
      {
        type: 'qcm',
        q: 'Qu\'est-ce qui rend une éruption explosive plutôt qu\'effusive ?',
        choix: ['La quantité de gaz contenue dans le magma', 'La viscosité du magma', 'La profondeur de la chambre magmatique'],
        reponse: 1,
        explication: "La viscosité. Un magma fluide peut contenir beaucoup de gaz : il les relâche au fur et à mesure. Un magma visqueux les retient prisonniers jusqu'à la rupture brutale."
      },
      {
        type: 'qcm',
        q: 'Quel facteur rend un magma plus visqueux ?',
        choix: ['Une température élevée', 'Une forte teneur en silice', 'Une faible profondeur'],
        reponse: 1,
        explication: "Une forte teneur en silice, et aussi une température basse. À l'inverse, un magma chaud et pauvre en silice est fluide, donc effusif."
      },
      {
        type: 'qcm',
        q: 'Qu\'est-ce qu\'une nuée ardente ?',
        choix: ['Une coulée de lave très rapide', 'Un mélange de gaz brûlants, de cendres et de blocs dévalant les pentes', 'Un nuage de vapeur d\'eau'],
        reponse: 1,
        explication: "Un mélange de gaz brûlants, de cendres et de blocs, à plusieurs centaines de degrés et jusqu'à plus de 500 km/h. C'est le phénomène volcanique le plus meurtrier."
      },
      {
        type: 'qcm',
        q: 'Existe-t-il une protection efficace contre une nuée ardente une fois déclenchée ?',
        choix: ['Oui, un abri renforcé', 'Non, seule l\'évacuation préventive protège', 'Oui, il suffit de fuir en voiture'],
        reponse: 1,
        explication: "Non. Elle est trop rapide pour être fuie, assez chaude pour tuer par les voies respiratoires, et elle contourne les obstacles. Seule l'évacuation décidée AVANT l'éruption protège."
      },
      {
        type: 'saisie',
        q: 'Combien de morts la nuée ardente de la Montagne Pelée a-t-elle faits à Saint-Pierre en 1902 ? (en milliers, écris le nombre)',
        reponses: ['28000', '28 000', '28000 morts', 'environ 28000', '28 000 morts'],
        explication: "Environ 28 000 morts en quelques minutes, avec deux ou trois survivants seulement. Le volcan donnait pourtant des signes depuis des semaines, mais une élection approchait et les autorités ont minimisé le danger."
      },
      {
        type: 'vraifaux',
        q: 'Le Piton de la Fournaise, qui entre en éruption une à deux fois par an, est le volcan français le plus dangereux.',
        reponse: false,
        explication: "Faux. Il est effusif : ses coulées fluides s'écoulent lentement dans une zone inhabitée. La Montagne Pelée, explosive, entre en éruption bien plus rarement mais a fait 28 000 morts en 1902."
      },
      {
        type: 'qcm',
        q: 'Où se trouve environ 75 % des volcans actifs émergés ?',
        choix: ['Dans la ceinture de feu du Pacifique', 'En Europe', 'Sur les dorsales atlantiques'],
        reponse: 0,
        explication: "Dans la ceinture de feu du Pacifique, du Chili au Japon en passant par l'Alaska. Elle correspond aux zones de subduction qui entourent la plaque pacifique."
      },
      {
        type: 'qcm',
        q: 'Quel volcanisme trouve-t-on en zone de subduction ?',
        choix: ['Effusif', 'Explosif', 'Aucun'],
        reponse: 1,
        explication: "Explosif. L'eau libérée par la plaque plongeante produit un magma riche en silice et en gaz, donc visqueux. Les dorsales et les points chauds donnent au contraire un volcanisme effusif."
      },
      {
        type: 'vraifaux',
        q: 'Un volcan inactif depuis 9 000 ans peut être considéré comme définitivement éteint.',
        reponse: false,
        explication: "Faux. Le Chaitén, au Chili, dormait depuis plus de 9 000 ans quand il est entré en éruption en 2008. Les volcanologues préfèrent parler de volcans actifs, endormis, ou sans activité connue depuis telle date."
      },
      {
        type: 'qcm',
        q: 'Pourquoi 800 millions de personnes vivent-elles près d\'un volcan actif ?',
        choix: ['Par ignorance du danger', 'Parce que les sols volcaniques sont très fertiles', 'Parce que les terrains y sont interdits ailleurs'],
        reponse: 1,
        explication: "Les cendres enrichissent la terre en minéraux et donnent des rendements agricoles élevés. Le bénéfice est quotidien et certain, le risque rare et incertain : le choix n'a rien d'irrationnel."
      },
      {
        type: 'qcm',
        q: 'Quel signe précurseur indique que la chambre magmatique se remplit ?',
        choix: ['Une déformation, un gonflement du sol', 'Une baisse de température des sources', 'Un ciel dégagé'],
        reponse: 0,
        explication: "Le gonflement du sol. Les autres signes : des séismes de plus en plus fréquents, un changement de composition des gaz émis, une hausse de température des sources chaudes."
      },
      {
        type: 'qcm',
        q: 'Que permet la surveillance volcanique ?',
        choix: ['De prévoir le jour exact de l\'éruption', 'De dire qu\'une éruption approche, sans en préciser la date ni l\'intensité', 'D\'empêcher l\'éruption'],
        reponse: 1,
        explication: "De dire qu'une éruption approche, souvent avec plusieurs jours ou semaines d'avance. La décision d'évacuer reste un pari : trop tard elle tue, trop souvent elle décrédibilise l'alerte suivante."
      },
      {
        type: 'qcm',
        q: 'En 1991 au Pinatubo, l\'éruption fut l\'une des plus puissantes du siècle. Pourquoi le bilan fut-il de 800 morts et non de dizaines de milliers ?',
        choix: ['Le volcan était moins dangereux que prévu', 'Plus de 60 000 personnes avaient été évacuées avant l\'éruption', 'La région était inhabitée'],
        reponse: 1,
        explication: "Les volcanologues ont convaincu les autorités d'évacuer préventivement. Comparé à Saint-Pierre en 1902, où l'on n'a pas évacué, cet exemple montre que le bilan dépend autant de la décision politique que du volcan."
      }
    ]
  }
,
  'francais/L03': {
    titre: 'La fiction pour interroger le réel : le réalisme',
    items: [
      {
        type: 'qcm',
        q: 'De quel siècle date le mouvement réaliste ?',
        choix: ['Le XVIII<sup>e</sup>', 'Le XIX<sup>e</sup>', 'Le XX<sup>e</sup>'],
        reponse: 1,
        explication: "Le XIXᵉ siècle. Le mouvement s'affirme vers 1850 et domine la seconde moitié du siècle, à l'époque de la révolution industrielle et de l'apparition de la photographie."
      },
      {
        type: 'qcm',
        q: 'À quel mouvement le réalisme s\'oppose-t-il ?',
        choix: ['Au romantisme', 'Au classicisme', 'Au surréalisme'],
        reponse: 0,
        explication: "Au romantisme, qui privilégiait le héros exceptionnel, les sentiments extrêmes et les lieux rêvés. Le réalisme préfère le personnage ordinaire, la vie quotidienne et les lieux vérifiables."
      },
      {
        type: 'saisie',
        q: 'Quel auteur a écrit « Germinal » en 1885, après être descendu dans une mine du Nord ?',
        reponses: ['zola', 'Zola', 'emile zola', 'Émile Zola', 'emile zola'],
        explication: "Émile Zola. Il a pris des notes pendant plusieurs jours sur place : salaires, durées de travail, vocabulaire des mineurs. Le roman est une fiction, mais tout ce qui l'entoure est vérifiable."
      },
      {
        type: 'qcm',
        q: 'Qui a écrit « Madame Bovary » en 1857 ?',
        choix: ['Balzac', 'Flaubert', 'Maupassant'],
        reponse: 1,
        explication: "Flaubert. Il fut poursuivi la même année pour « outrage à la morale publique », puis acquitté : montrer une femme adultère sans la condamner explicitement semblait déjà une approbation."
      },
      {
        type: 'vraifaux',
        q: 'Un roman réaliste raconte une histoire qui s\'est réellement passée.',
        reponse: false,
        explication: "Faux. C'est une fiction : personnages et intrigue sont inventés. Ce qui est réaliste, c'est la MANIÈRE de raconter : lieux vérifiables, métiers exacts, comportements plausibles."
      },
      {
        type: 'qcm',
        q: 'Qu\'est-ce que « l\'effet de réel » ?',
        choix: ['Le fait de raconter une histoire vraie', 'L\'impression de vérité produite par des procédés précis', 'Une figure de style'],
        reponse: 1,
        explication: "L'impression de vérité produite par des procédés : lieux réels, dates, chiffres, vocabulaire technique, détails gratuits, notations sensorielles. Le lecteur oublie qu'il lit une fiction."
      },
      {
        type: 'qcm',
        q: 'Pourquoi un romancier réaliste mentionne-t-il un objet qui ne servira jamais à l\'intrigue ?',
        choix: ['Par étourderie', 'Pour produire l\'effet de réel', 'Pour allonger le texte'],
        reponse: 1,
        explication: "Un monde inventé ne contiendrait que des objets utiles. Un détail gratuit signale que le monde existe indépendamment du récit : c'est le procédé du « détail inutile », le plus efficace de tous."
      },
      {
        type: 'qcm',
        q: 'Quel type de notation sensorielle produit l\'effet de réel le plus fort ?',
        choix: ['La visuelle', 'L\'olfactive ou l\'auditive', 'Aucune, elles se valent'],
        reponse: 1,
        explication: "Les notations non visuelles. Une odeur ou un bruit surprend et ne peut pas venir d'une image : le lecteur doit se le représenter physiquement. Zola les emploie systématiquement."
      },
      {
        type: 'qcm',
        q: 'Dans un roman réaliste, à quoi sert principalement la description d\'un logement ?',
        choix: ['À faire joli', 'À caractériser celui qui l\'habite', 'À reposer le lecteur'],
        reponse: 1,
        explication: "Le lieu ressemble à celui qui l'habite. Décrire une pièce, c'est décrire une vie : ses moyens, ses goûts, son passé, ses illusions. Sauter une description, c'est souvent rater l'essentiel."
      },
      {
        type: 'qcm',
        q: 'Que suggère « un vieux fauteuil de cuir dont le dossier s\'affaissait » ?',
        choix: ['Un intérieur neuf et riche', 'Un milieu qui a eu des moyens et n\'en a plus', 'Un mobilier bon marché dès l\'origine'],
        reponse: 1,
        explication: "Le cuir indique une qualité d'origine, l'usure une longue durée sans remplacement. Le détail dit le déclassement social sans que le mot soit écrit."
      },
      {
        type: 'qcm',
        q: 'Combien y a-t-il de points de vue narratifs ?',
        choix: ['Deux', 'Trois', 'Cinq'],
        reponse: 1,
        explication: "Trois : omniscient, interne et externe. Ils se distinguent par ce que le narrateur sait et montre, et donc par ce que le lecteur apprend."
      },
      {
        type: 'qcm',
        q: '« Elle entra. Elle ignorait que son frère l\'attendait depuis deux heures. » Quel point de vue ?',
        choix: ['Omniscient', 'Interne', 'Externe'],
        reponse: 0,
        explication: "Omniscient. Le narrateur sait ce qu'elle IGNORE, et il sait ce que fait le frère depuis deux heures : il dispose d'informations qu'aucun personnage présent ne possède."
      },
      {
        type: 'qcm',
        q: '« Elle entra. Quelqu\'un était assis dans l\'ombre ; elle ne distinguait pas son visage. » Quel point de vue ?',
        choix: ['Omniscient', 'Interne', 'Externe'],
        reponse: 1,
        explication: "Interne. « Elle ne distinguait pas » limite explicitement ce qui est rapporté à la perception d'un seul personnage : le lecteur ne voit que ce qu'elle voit."
      },
      {
        type: 'qcm',
        q: '« L\'homme se leva, prit son chapeau et sortit. » Quel point de vue ?',
        choix: ['Omniscient', 'Interne', 'Externe'],
        reponse: 2,
        explication: "Externe. Aucune pensée n'est donnée, aucune explication : on ne voit que des gestes, comme une caméra. C'est le point de vue qui crée le plus de suspense."
      },
      {
        type: 'qcm',
        q: 'Quel point de vue convient le mieux pour faire éprouver la peur d\'un personnage ?',
        choix: ['Omniscient', 'Interne', 'Externe'],
        reponse: 1,
        explication: "Interne : il enferme le lecteur dans la perception du personnage. Ce que celui-ci ne voit pas, le lecteur ne le voit pas non plus, ce qui reproduit la situation de quelqu'un qui a peur."
      },
      {
        type: 'vraifaux',
        q: 'Le point de vue reste le même du début à la fin d\'un roman.',
        reponse: false,
        explication: "Faux. Il peut changer d'un passage à l'autre, parfois dans la même page. La bonne question n'est jamais « quel est le point de vue du roman » mais « quel est celui de CE passage, et pourquoi »."
      },
      {
        type: 'qcm',
        q: 'Le narrateur réaliste juge-t-il ses personnages ?',
        choix: ['Oui, explicitement', 'Non, le jugement est suggéré par le choix des détails', 'Il n\'y a aucun jugement'],
        reponse: 1,
        explication: "Le jugement est suggéré, jamais énoncé. Le lecteur tire lui-même la conclusion, ce qui lui donne plus de force. C'est justement cette discrétion qui rendait ces romans scandaleux."
      },
      {
        type: 'qcm',
        q: 'Quelle relation entre réalisme et naturalisme ?',
        choix: ['Ce sont des mouvements opposés', 'Le naturalisme prolonge le réalisme', 'Le naturalisme est antérieur'],
        reponse: 1,
        explication: "Le naturalisme prolonge le réalisme. Zola prétend appliquer au roman la méthode des sciences expérimentales. Tout naturaliste est réaliste, mais tout réaliste n'est pas naturaliste."
      },
      {
        type: 'vraifaux',
        q: 'Dans un roman réaliste, l\'auteur s\'efface vraiment et laisse voir le monde tel quel.',
        reponse: false,
        explication: "Faux. Chaque détail a été choisi : lesquels montrer, dans quel ordre, avec quels adjectifs, et surtout lesquels taire. L'apparente neutralité est le résultat d'un travail très maîtrisé."
      },
      {
        type: 'qcm',
        q: 'Dans une description, où se trouve souvent l\'élément le plus important ?',
        choix: ['Au tout début', 'Là où le regard s\'arrête, à la fin du parcours', 'Au milieu'],
        reponse: 1,
        explication: "Là où le regard s'arrête. L'auteur organise le parcours du regard, du général au détail, et le point d'arrivée porte en général l'information qui caractérise le lieu ou son habitant."
      }
    ]
  }
,
  'francais/L07': {
    titre: 'Le discours rapporté',
    items: [
      {
        type: 'qcm',
        q: 'Combien y a-t-il de formes de discours rapporté ?',
        choix: ['Deux', 'Trois', 'Quatre'],
        reponse: 2,
        explication: "Quatre : le discours direct, le discours indirect, le discours narrativisé et le discours indirect libre. Chacune place le lecteur à une distance différente du personnage."
      },
      {
        type: 'qcm',
        q: 'Quelle forme rapporte les paroles exactement telles qu\'elles ont été prononcées ?',
        choix: ['Le discours direct', 'Le discours indirect', 'Le discours narrativisé'],
        reponse: 0,
        explication: "Le discours direct. Il se reconnaît à trois marques : un verbe de parole, des deux-points, et des guillemets ou des tirets."
      },
      {
        type: 'qcm',
        q: 'Quelle phrase est correcte ?',
        choix: ['« Je pars, il dit. »', '« Je pars, dit-il. »', '« Je pars, il a dit. »'],
        reponse: 1,
        explication: "« Je pars, dit-il. » L'incise exige l'inversion du sujet et du verbe, avec un trait d'union quand le sujet est un pronom. C'est une règle sans exception."
      },
      {
        type: 'vraifaux',
        q: 'Dans un dialogue, il faut mettre des guillemets à chaque réplique.',
        reponse: false,
        explication: "Faux. On ouvre les guillemets une seule fois au début et on les ferme une seule fois à la fin. Les tirets, après un retour à la ligne, suffisent à marquer les changements d'interlocuteur."
      },
      {
        type: 'qcm',
        q: 'Que change le verbe de parole dans « Ce n\'est rien », murmura-t-elle ?',
        choix: ['Rien, c\'est décoratif', 'Il suggère la fragilité, alors que « trancha » suggérerait l\'autorité', 'Il indique le volume sonore uniquement'],
        reponse: 1,
        explication: "Le verbe de parole ne dit pas seulement qu'on parle, il dit comment. Les paroles sont identiques mais « dit », « murmura » et « trancha » construisent trois situations différentes."
      },
      {
        type: 'saisie',
        q: 'Transforme au discours indirect : « Il dit : Je suis fatigué. » (introducteur au présent)',
        reponses: ["il dit qu'il est fatigué", "Il dit qu'il est fatigué.", "il dit qu'il est fatigué.", "Il dit qu'il est fatigué"],
        explication: "Il dit qu'il est fatigué. L'introducteur étant au présent, les temps ne changent pas : seuls la ponctuation et le pronom sont modifiés."
      },
      {
        type: 'qcm',
        q: 'Après un verbe introducteur au passé, que devient un présent ?',
        choix: ['Il reste au présent', 'Il devient imparfait', 'Il devient passé simple'],
        reponse: 1,
        explication: "Il devient imparfait : « Il a dit qu'il partait ». C'est la concordance des temps : après un introducteur au passé, les temps reculent d'un cran."
      },
      {
        type: 'qcm',
        q: 'Après un verbe introducteur au passé, que devient un futur ?',
        choix: ['Il reste au futur', 'Il devient conditionnel présent', 'Il devient imparfait'],
        reponse: 1,
        explication: "Il devient conditionnel présent : « Il a dit qu'il partirait ». Attention, ce conditionnel n'exprime pas une condition : c'est un futur vu depuis le passé."
      },
      {
        type: 'saisie',
        q: 'Au discours indirect, que devient « demain » ?',
        reponses: ['le lendemain', 'lendemain'],
        explication: "« le lendemain ». De même, « hier » devient « la veille », « aujourd'hui » devient « ce jour-là », « ici » devient « là » et « maintenant » devient « alors »."
      },
      {
        type: 'saisie',
        q: 'Au discours indirect, que devient « hier » ?',
        reponses: ['la veille', 'veille'],
        explication: "« la veille ». Oublier de transformer les indicateurs de temps est l'une des erreurs les plus fréquentes : la phrase reste alors à cheval entre les deux discours."
      },
      {
        type: 'qcm',
        q: 'Transforme : « Il demande : Est-ce que tu viens ? »',
        choix: ['Il demande est-ce que je viens.', 'Il demande si je viens.', 'Il demande si je viens ?'],
        reponse: 1,
        explication: "Il demande si je viens. Trois choses disparaissent : « est-ce que », remplacé par « si », le point d'interrogation, et l'inversion du sujet et du verbe."
      },
      {
        type: 'qcm',
        q: 'Transforme : « Il demande : Où vas-tu ? »',
        choix: ['Il demande où vais-je.', 'Il demande où je vais.', 'Il demande où je vais ?'],
        reponse: 1,
        explication: "Il demande où je vais. Le mot interrogatif « où » est conservé, mais l'inversion disparaît et l'ordre redevient sujet puis verbe. Pas de point d'interrogation."
      },
      {
        type: 'qcm',
        q: 'Transforme : « Il demande : Qu\'est-ce que tu fais ? »',
        choix: ['Il demande qu\'est-ce que je fais.', 'Il demande ce que je fais.', 'Il demande que je fais.'],
        reponse: 1,
        explication: "Il demande ce que je fais. « Qu'est-ce que » devient toujours « ce que » au discours indirect. C'est le troisième cas à connaître pour les questions."
      },
      {
        type: 'vraifaux',
        q: 'Au discours indirect, le point d\'interrogation est conservé.',
        reponse: false,
        explication: "Faux, il disparaît. La phrase n'est plus une question : c'est une déclaration qui RAPPORTE une question. « Il demande si je viens. » se termine par un point."
      },
      {
        type: 'qcm',
        q: 'Quelle forme résume les paroles en quelques mots sans les rapporter ?',
        choix: ['Le discours indirect', 'Le discours narrativisé', 'Le discours indirect libre'],
        reponse: 1,
        explication: "Le discours narrativisé : « Il annonça sa démission ». Il est très rapide et permet de condenser une longue conversation, mais on perd les mots exacts et le ton."
      },
      {
        type: 'qcm',
        q: 'Comment reconnaît-on un discours indirect libre ?',
        choix: ['À ses guillemets', 'À l\'absence de verbe introducteur et de « que », avec des marques d\'oral conservées', 'À son verbe au présent'],
        reponse: 1,
        explication: "Les temps et pronoms sont ceux de l'indirect, imparfait et troisième personne, mais il n'y a ni « que » ni verbe introducteur, et la phrase garde exclamations, questions et rythme heurté."
      },
      {
        type: 'qcm',
        q: '« Il était fichu. Fichu ! Et après tout, qu\'avait-il fait de mal ? » Quelle forme ?',
        choix: ['Discours direct', 'Discours indirect', 'Discours indirect libre'],
        reponse: 2,
        explication: "Discours indirect libre. L'imparfait et le plus-que-parfait à la troisième personne viennent de l'indirect, mais l'exclamation et la question directe sont celles du personnage."
      },
      {
        type: 'qcm',
        q: 'Pourquoi les romanciers réalistes emploient-ils tant le discours indirect libre ?',
        choix: ['Parce qu\'il est plus court', 'Parce qu\'il fait entendre une pensée sans que le narrateur la prenne en charge', 'Parce qu\'il évite la ponctuation'],
        reponse: 1,
        explication: "Il permet de restituer le point de vue d'un personnage tout en gardant ses distances. Le lecteur ne sait plus si la phrase est du personnage ou du narrateur : c'est l'ambiguïté recherchée."
      },
      {
        type: 'qcm',
        q: 'Quelle forme choisir pour résumer une conversation de deux heures ?',
        choix: ['Le discours direct', 'Le discours narrativisé', 'Le discours indirect libre'],
        reponse: 1,
        explication: "Le discours narrativisé. Rapporter deux heures au discours direct prendrait des pages. On le réserve à ce qui n'est pas essentiel mot à mot, et on garde le direct pour les répliques qui comptent."
      },
      {
        type: 'qcm',
        q: 'Quelle forme rapproche le plus le lecteur du personnage ?',
        choix: ['Le discours direct', 'Le discours narrativisé', 'Le discours indirect'],
        reponse: 0,
        explication: "Le discours direct : on entend les mots exacts. Le narrativisé est à l'opposé, le plus distant. L'indirect et l'indirect libre se situent entre les deux, l'indirect libre étant le plus proche des deux."
      }
    ]
  }
,
  'histoire-geo/H3': {
    titre: 'La Révolution française et l\'Empire',
    items: [
      {
        type: 'qcm',
        q: 'Quels sont les trois ordres de l\'Ancien Régime ?',
        choix: ['Roi, nobles, paysans', 'Clergé, noblesse, tiers état', 'Riches, classe moyenne, pauvres'],
        reponse: 1,
        explication: "Le clergé, environ 0,5 % de la population, la noblesse, environ 1,5 %, et le tiers état, environ 98 %. Les deux premiers sont privilégiés, le troisième paie l'essentiel des impôts."
      },
      {
        type: 'vraifaux',
        q: 'Le tiers état est composé uniquement de paysans pauvres.',
        reponse: false,
        explication: "Faux. Il comprend les paysans et les ouvriers, mais aussi la bourgeoisie : marchands, avocats, médecins, parfois très riches. C'est elle qui prend la tête du mouvement en 1789."
      },
      {
        type: 'saisie',
        q: 'À quelle date a lieu la prise de la Bastille ? (jour et mois)',
        reponses: ['14 juillet', '14 juillet 1789', 'le 14 juillet'],
        explication: "Le 14 juillet 1789. La forteresse ne contenait que sept prisonniers : sa prise a une portée symbolique, pas militaire. Elle montre que le roi n'a plus le monopole de la force."
      },
      {
        type: 'qcm',
        q: 'Que se passe-t-il dans la nuit du 4 août 1789 ?',
        choix: ['La prise de la Bastille', 'L\'abolition des privilèges', 'L\'exécution du roi'],
        reponse: 1,
        explication: "L'abolition des privilèges, votée par les députés. C'est la fin juridique de la société d'ordres. Elle répond en partie à la Grande Peur qui agite alors les campagnes."
      },
      {
        type: 'saisie',
        q: 'À quelle date est adoptée la Déclaration des droits de l\'homme et du citoyen ? (jour et mois)',
        reponses: ['26 août', '26 août 1789', 'le 26 août'],
        explication: "Le 26 août 1789. Elle comporte 17 articles et renverse deux principes de l'Ancien Régime : le pouvoir ne vient plus de Dieu mais de la Nation, et les droits ne dépendent plus de la naissance."
      },
      {
        type: 'qcm',
        q: 'Que dit l\'article 1 de la Déclaration ?',
        choix: ['La souveraineté réside dans la Nation', 'Les hommes naissent et demeurent libres et égaux en droits', 'Nul ne peut être arrêté sans jugement'],
        reponse: 1,
        explication: "« Les hommes naissent et demeurent libres et égaux en droits. » La souveraineté de la Nation, c'est l'article 3, qui vient tout droit de Rousseau."
      },
      {
        type: 'qcm',
        q: 'De quel philosophe des Lumières vient l\'article 16, sur la séparation des pouvoirs ?',
        choix: ['Rousseau', 'Montesquieu', 'Voltaire'],
        reponse: 1,
        explication: "Montesquieu, dans « De l'esprit des lois » en 1748. L'article 3 sur la souveraineté vient de Rousseau, l'article 11 sur la liberté d'expression du combat de Voltaire."
      },
      {
        type: 'vraifaux',
        q: 'Après 1789, tous les Français majeurs peuvent voter.',
        reponse: false,
        explication: "Faux. La Constitution de 1791 instaure un suffrage CENSITAIRE : seuls votent les hommes qui paient un impôt suffisant, soit environ 4,3 millions sur 28 millions d'habitants. Les femmes en sont exclues."
      },
      {
        type: 'qcm',
        q: 'Que se passe-t-il à Varennes en juin 1791 ?',
        choix: ['Une bataille', 'L\'arrestation de Louis XVI en fuite', 'La signature de la Constitution'],
        reponse: 1,
        explication: "Louis XVI tente de fuir pour rejoindre les armées étrangères. Reconnu et arrêté, il apparaît désormais comme un traître : l'idée républicaine, jusque-là marginale, devient une option sérieuse."
      },
      {
        type: 'saisie',
        q: 'En quelle année la Première République est-elle proclamée ?',
        reponses: ['1792', 'en 1792'],
        explication: "Le 21 septembre 1792, au lendemain de la victoire de Valmy. Louis XVI est exécuté quatre mois plus tard, le 21 janvier 1793."
      },
      {
        type: 'qcm',
        q: 'Pourquoi la guerre transforme-t-elle la Révolution à partir de 1792 ?',
        choix: ['Elle enrichit le pays', 'Toute opposition intérieure devient suspecte de trahison', 'Elle met fin aux débats politiques'],
        reponse: 1,
        explication: "La situation de survie justifie des mesures d'exception au nom du salut public, et un désaccord politique se transforme en accusation de collusion avec l'ennemi. C'est le contexte de la Terreur."
      },
      {
        type: 'qcm',
        q: 'Sur quelles années s\'étend la Terreur ?',
        choix: ['1789-1791', '1793-1794', '1799-1804'],
        reponse: 1,
        explication: "De septembre 1793 à juillet 1794. Mesures d'exception : loi des suspects, tribunal révolutionnaire, maximum des prix, levée en masse. Environ 17 000 exécutions après jugement."
      },
      {
        type: 'vraifaux',
        q: 'La majorité des victimes de la Terreur sont des nobles.',
        reponse: false,
        explication: "Faux. La majorité appartient au TIERS ÉTAT. L'image d'aristocrates montant à l'échafaud est largement fausse : la Terreur frappe d'abord ceux qui se trouvent du mauvais côté d'une dénonciation."
      },
      {
        type: 'qcm',
        q: 'Comment prend fin la Terreur ?',
        choix: ['Par un vote de la population', 'Par la chute de Robespierre, renversé par ses propres collègues', 'Par une invasion étrangère'],
        reponse: 1,
        explication: "Le 9 thermidor an II, le 27 juillet 1794. Ceux qui le renversent ne sont pas des modérés : beaucoup ont participé à la Terreur et craignent d'en devenir les prochaines victimes."
      },
      {
        type: 'qcm',
        q: 'Que se passe-t-il le 18 brumaire an VIII, le 9 novembre 1799 ?',
        choix: ['Le sacre de Napoléon', 'Le coup d\'État de Bonaparte', 'La proclamation de la République'],
        reponse: 1,
        explication: "Le coup d'État qui renverse le Directoire et installe le Consulat. Le Directoire, menacé par les royalistes et les radicaux, dépendait de l'armée : il finit par être renversé par un général."
      },
      {
        type: 'saisie',
        q: 'En quelle année Napoléon est-il sacré empereur ?',
        reponses: ['1804', 'en 1804'],
        explication: "Le 2 décembre 1804, à Notre-Dame. Il se couronne lui-même en présence du pape : le geste signifie qu'il ne tient pas son pouvoir de l'Église, mais de lui-même et du plébiscite."
      },
      {
        type: 'qcm',
        q: 'Qu\'est-ce qu\'un plébiscite ?',
        choix: ['Une élection entre plusieurs candidats', 'Un vote par oui ou non sur une décision déjà prise', 'Un impôt'],
        reponse: 1,
        explication: "Un vote par lequel les citoyens ratifient une décision déjà prise par le pouvoir. On ne choisit pas entre des candidats : c'est ce qui le distingue d'une élection libre."
      },
      {
        type: 'qcm',
        q: 'Quel acquis de 1789 Napoléon conserve-t-il ?',
        choix: ['La liberté de la presse', 'L\'égalité devant la loi', 'Les élections libres'],
        reponse: 1,
        explication: "L'égalité devant la loi, inscrite dans le Code civil de 1804. Il conserve aussi la fin des privilèges de naissance et la vente des biens nationaux, mais supprime les libertés politiques."
      },
      {
        type: 'qcm',
        q: 'Combien de journaux paraissent à Paris en 1811, contre plus de trois cents en 1789 ?',
        choix: ['Quatre', 'Cinquante', 'Deux cents'],
        reponse: 0,
        explication: "Quatre, tous surveillés. L'article 11 de la Déclaration n'a pas été abrogé, mais il est vidé de tout effet : un droit proclamé sans institution qui le garantisse peut rester lettre morte."
      },
      {
        type: 'vraifaux',
        q: 'L\'esclavage, aboli en 1794, a été rétabli par Napoléon en 1802.',
        reponse: true,
        explication: "Vrai. Il ne sera définitivement aboli qu'en 1848. Conserver les acquis de 1789 ne signifiait donc pas les étendre : le Code civil place aussi les femmes sous l'autorité de leur père puis de leur mari."
      }
    ]
  }
,
  'histoire-geo/G2': {
    titre: 'Des villes inégalement connectées',
    items: [
      {
        type: 'qcm',
        q: 'Qu\'est-ce que la mondialisation ?',
        choix: ['L\'unification politique du monde', 'La mise en relation croissante des parties du monde par des flux', 'La disparition des frontières'],
        reponse: 1,
        explication: "La mise en relation croissante des différentes parties du monde par la circulation des marchandises, des capitaux, des informations et des personnes. Elle ne supprime ni les États ni les frontières."
      },
      {
        type: 'qcm',
        q: 'Qu\'est-ce qu\'un hub ?',
        choix: ['Un point isolé du réseau', 'Un nœud majeur, plateforme de correspondance', 'Un câble sous-marin'],
        reponse: 1,
        explication: "Un nœud majeur qui concentre l'essentiel du trafic. Pour aller de Brest à Hô Chi Minh-Ville, il faut passer par Paris puis Dubaï : le réseau relie les nœuds puissants, pas les lieux proches."
      },
      {
        type: 'qcm',
        q: 'Par où passe l\'essentiel du trafic internet mondial ?',
        choix: ['Par les satellites', 'Par des câbles sous-marins en fibre optique', 'Par les ondes radio'],
        reponse: 1,
        explication: "Par des câbles sous-marins : plus de 99 % des données intercontinentales. Environ 550 câbles totalisent plus de 1,4 million de kilomètres. Les satellites servent surtout à la télévision et à la géolocalisation."
      },
      {
        type: 'saisie',
        q: 'Quelle part du commerce mondial en volume passe par la mer ? (en pourcentage)',
        reponses: ['80', '80%', '80 %', '80 pour cent', 'environ 80'],
        explication: "Environ 80 %. Le transport maritime reste de très loin le principal support des échanges de marchandises, grâce au conteneur qui en a divisé le coût par vingt."
      },
      {
        type: 'qcm',
        q: 'Pourquoi le conteneur a-t-il changé le commerce mondial ?',
        choix: ['C\'est une prouesse technologique', 'C\'est une norme partagée qui permet le passage direct du navire au train et au camion', 'Il est incassable'],
        reponse: 1,
        explication: "C'est une simple boîte métallique, mais aux dimensions normalisées partout. Décharger un navire est passé de plusieurs jours à quelques heures : le coût du transport maritime a été divisé par vingt."
      },
      {
        type: 'qcm',
        q: 'Qu\'est-ce qu\'une firme transnationale ?',
        choix: ['Une entreprise qui exporte', 'Une entreprise qui possède des filiales dans plusieurs pays et organise sa production à l\'échelle mondiale', 'Une entreprise d\'État'],
        reponse: 1,
        explication: "Elle conçoit dans un pays, fabrique dans un autre, assemble dans un troisième et vend partout. Ce découpage s'appelle la division internationale du travail."
      },
      {
        type: 'qcm',
        q: 'Qu\'est-ce qui définit une ville mondiale ?',
        choix: ['Sa population', 'Sa superficie', 'Sa capacité à commander d\'autres territoires et son niveau de connexion'],
        reponse: 2,
        explication: "Ni la population ni la superficie. Lagos compte plus d'habitants que Londres, mais commande infiniment moins : son influence reste régionale, celle de Londres est mondiale."
      },
      {
        type: 'qcm',
        q: 'Quelles sont les trois grandes aires de puissance ?',
        choix: ['Amérique du Nord, Europe occidentale, Asie orientale', 'Europe, Afrique, Amérique', 'Chine, Inde, États-Unis'],
        reponse: 0,
        explication: "Elles concentrent l'essentiel des sièges de firmes, des échanges financiers et du trafic de conteneurs. Les flux les plus intenses de la planète circulent entre ces trois pôles."
      },
      {
        type: 'vraifaux',
        q: 'Une mégapole et une mégalopole, c\'est la même chose.',
        reponse: false,
        explication: "Faux. Une mégapole est UNE agglomération de plus de 10 millions d'habitants, comme Le Caire ou Lagos. Une mégalopole est un chapelet de grandes villes presque continues, comme Boston-Washington."
      },
      {
        type: 'qcm',
        q: 'Quelle mégalopole rassemble environ 105 millions d\'habitants ?',
        choix: ['La mégalopolis américaine', 'La mégalopole japonaise', 'La dorsale européenne'],
        reponse: 1,
        explication: "La mégalopole japonaise, de Tokyo à Fukuoka sur plus de mille kilomètres. Elle rassemble environ 80 % de la population du pays, car le reste du Japon est montagneux et peu habitable."
      },
      {
        type: 'qcm',
        q: 'Deux classements de villes mondiales donnent des podiums différents. Pourquoi ?',
        choix: ['L\'un des deux est faux', 'Ils n\'ont pas retenu les mêmes critères', 'Les données sont fausses'],
        reponse: 1,
        explication: "Aucun n'est faux : ils ne mesurent pas la même chose. Pondérer la finance met Londres et New York en tête ; pondérer le fret met Shanghai et Singapour devant. La question à se poser : quels critères ?"
      },
      {
        type: 'qcm',
        q: 'Sur une carte de flux aériens, que signifie une zone presque vide ?',
        choix: ['Il n\'y a personne', 'Il n\'y a pas de connexion', 'Les données manquent'],
        reponse: 1,
        explication: "Une absence de connexion, pas de population. L'Afrique compte 1,5 milliard d'habitants mais peu de liaisons internationales : la carte des flux mesure la puissance, pas le peuplement."
      },
      {
        type: 'qcm',
        q: 'Combien coûte en moyenne le transport dans un pays enclavé, par rapport à un pays côtier comparable ?',
        choix: ['Autant', 'Environ deux fois plus', 'Environ dix fois plus'],
        reponse: 1,
        explication: "Environ deux fois plus. Toute marchandise doit traverser un pays tiers pour atteindre un port, avec transport terrestre, ruptures de charge, douanes et délais. Une frontière fermée coupe l'accès au monde."
      },
      {
        type: 'qcm',
        q: 'Qu\'est-ce qu\'une métropole relais ?',
        choix: ['Une ville mondiale de premier rang', 'Une grande ville qui redistribue à l\'échelle régionale ce qui vient des villes mondiales', 'Une ville sans aéroport'],
        reponse: 1,
        explication: "Nairobi joue ce rôle pour l'Afrique de l'Est, Dakar pour l'Afrique de l'Ouest. Elles n'ont pas d'influence mondiale directe, mais structurent les échanges d'une région entière."
      },
      {
        type: 'qcm',
        q: 'Quels sont les trois niveaux de la fracture numérique ?',
        choix: ['Accès, usage, compétences', 'Ville, campagne, montagne', 'Jeunes, adultes, seniors'],
        reponse: 0,
        explication: "L'accès, y a-t-il un réseau ; l'usage, peut-on se l'offrir ; les compétences, sait-on s'en servir. Résorber la première ne suffit pas : on peut avoir la fibre et ne pas savoir remplir un formulaire en ligne."
      },
      {
        type: 'saisie',
        q: 'Comment appelle-t-on le fait qu\'un droit existe mais ne soit pas exercé, faute de pouvoir accomplir la démarche ? (deux mots)',
        reponses: ['non-recours', 'le non-recours', 'non recours'],
        explication: "Le non-recours. Quand une démarche devient exclusivement numérique, une personne sans connexion fiable ou sans aisance informatique renonce à un droit qu'elle possède pourtant."
      },
      {
        type: 'vraifaux',
        q: 'La mondialisation supprime les distances.',
        reponse: false,
        explication: "Faux. Elle les rend INÉGALES. Deux villes très éloignées peuvent être reliées par un vol direct quotidien, alors que deux villes voisines ne le sont par aucun. Ce qui compte est le temps et le coût, pas les kilomètres."
      },
      {
        type: 'vraifaux',
        q: 'Avec la mondialisation, les frontières ont disparu.',
        reponse: false,
        explication: "Faux. Elles sont devenues SÉLECTIVES : très ouvertes aux capitaux et aux marchandises, beaucoup moins aux personnes. Certaines se sont même renforcées, avec des murs et des dispositifs de surveillance."
      },
      {
        type: 'qcm',
        q: 'L\'arrivée d\'un câble sous-marin dans un pays produit :',
        choix: ['uniquement des effets positifs', 'uniquement des effets négatifs', 'des capacités nouvelles et des dépendances nouvelles'],
        reponse: 2,
        explication: "Les deux à la fois : baisse du prix de l'accès et essor de services nouveaux, mais dépendance à une infrastructure étrangère et exposition à la concurrence mondiale. Une bonne réponse tient les deux."
      },
      {
        type: 'qcm',
        q: 'Que désigne la souveraineté numérique ?',
        choix: ['Le droit de vote en ligne', 'La capacité d\'un territoire à contrôler les infrastructures qui le connectent', 'La vitesse de connexion'],
        reponse: 1,
        explication: "Un territoire peut être parfaitement connecté sans contrôler ni les câbles, ni les centres de données, ni les plateformes qui le relient au monde. C'est aujourd'hui l'un des grands enjeux politiques de la mondialisation."
      }
    ]
  }
,
  'anglais-lv1/L03': {
    titre: 'Telling a story',
    items: [
      {
        type: 'saisie',
        q: 'Donne le prétérit de « go ».',
        reponses: ['went'],
        explication: "went. C'est l'un des cinq verbes irréguliers indispensables, avec be, have, do et say : un récit au passé est presque impossible à écrire sans eux."
      },
      {
        type: 'saisie',
        q: 'Donne le prétérit de « think ».',
        reponses: ['thought'],
        explication: "thought. Attention à l'orthographe : le groupe « ough » se retrouve dans bought, brought et fought, tous irréguliers."
      },
      {
        type: 'qcm',
        q: 'Quel est le prétérit du verbe « study » ?',
        choix: ['studyed', 'studied', 'studed'],
        reponse: 1,
        explication: "studied. Après une CONSONNE, le y devient i. Après une voyelle il se conserve : play donne played."
      },
      {
        type: 'qcm',
        q: 'Quel est le prétérit du verbe « stop » ?',
        choix: ['stoped', 'stopped', 'stopt'],
        reponse: 1,
        explication: "stopped. Pour un verbe d'une syllabe terminé par une seule consonne après une voyelle, on double la consonne finale avant d'ajouter -ed."
      },
      {
        type: 'vraifaux',
        q: 'Au prétérit, la troisième personne du singulier prend un s.',
        reponse: false,
        explication: "Faux. Toutes les personnes ont la même forme : I worked, he worked, they worked. Seul « be » change : I was, you were, he was, we were, they were."
      },
      {
        type: 'qcm',
        q: 'Quelle phrase est correcte ?',
        choix: ['She didn\'t went to school.', 'She didn\'t go to school.', 'She didn\'t goes to school.'],
        reponse: 1,
        explication: "She didn't go to school. Après « did » ou « didn't », on emploie la BASE VERBALE : le passé est déjà porté par l'auxiliaire. C'est l'erreur la plus fréquente du chapitre."
      },
      {
        type: 'qcm',
        q: 'Quelle question est correcte ?',
        choix: ['Did she took the bus?', 'Did she take the bus?', 'Did she takes the bus?'],
        reponse: 1,
        explication: "Did she take the bus ? Même règle qu'à la négative : après « did », la base verbale. La réponse courte serait « Yes, she did » ou « No, she didn't »."
      },
      {
        type: 'qcm',
        q: 'Comment met-on « She was tired » à la forme interrogative ?',
        choix: ['Did she be tired?', 'Was she tired?', 'Did she was tired?'],
        reponse: 1,
        explication: "Was she tired ? Le verbe « be » n'utilise jamais « did » : il se comporte comme un auxiliaire et fait sa question par inversion."
      },
      {
        type: 'qcm',
        q: 'Comment construit-on le prétérit continu ?',
        choix: ['did + verbe en -ing', 'was ou were + verbe en -ing', 'have + participe passé'],
        reponse: 1,
        explication: "was ou were + verbe en -ing : I was walking, they were walking. Il sert à décrire une action en cours, poser un décor ou marquer une action interrompue."
      },
      {
        type: 'qcm',
        q: 'Complète : « At 8 p.m. yesterday, I ___ a film. »',
        choix: ['watched', 'was watching', 'have watched'],
        reponse: 1,
        explication: "was watching. On décrit ce qui était EN COURS à un moment précis. « I watched three films yesterday » serait au simple, car il s'agit d'un fait accompli."
      },
      {
        type: 'qcm',
        q: 'Quelle est la différence entre le prétérit simple et le prétérit continu dans un récit ?',
        choix: ['Aucune', 'Le continu pose le décor, le simple raconte les événements', 'Le continu est plus poli'],
        reponse: 1,
        explication: "Le continu, c'est le plan large : il pleuvait, les gens marchaient. Le simple, c'est l'action : une porte claque, quelqu'un crie. Un bon récit alterne les deux, comme un film alterne les plans."
      },
      {
        type: 'saisie',
        q: 'Complète : « I ___ (read) when the phone rang. » Écris les deux mots manquants.',
        reponses: ['was reading'],
        explication: "was reading. L'action longue est au continu, l'action courte qui l'interrompt est au simple. C'est le schéma type de la combinaison des deux temps."
      },
      {
        type: 'qcm',
        q: 'Complète : « ___ I was cooking, the lights went out. »',
        choix: ['When', 'While', 'As soon as'],
        reponse: 1,
        explication: "While, qui introduit l'action longue au continu. « When » introduirait plutôt l'action courte : « When the lights went out, I was cooking » dit exactement la même chose autrement."
      },
      {
        type: 'vraifaux',
        q: '« When the phone rang, I was reading » et « While I was reading, the phone rang » ont le même sens.',
        reponse: true,
        explication: "Vrai. L'ordre des propositions et le connecteur changent, mais chaque verbe reste au même temps. Ce qui compte, ce n'est pas la place dans la phrase, c'est quel verbe est à quel temps."
      },
      {
        type: 'qcm',
        q: 'Quelle phrase est correcte ?',
        choix: ['I was knowing the answer.', 'I knew the answer.', 'I was knew the answer.'],
        reponse: 1,
        explication: "I knew the answer. « know » est un verbe d'état : il ne se met jamais au continu. Même famille : believe, understand, want, like, love, hate, need, seem."
      },
      {
        type: 'vraifaux',
        q: 'On peut écrire « I have seen him yesterday ».',
        reponse: false,
        explication: "Faux. Un repère de temps précis dans le passé, comme yesterday, last week ou in 2019, impose le PRÉTÉRIT : « I saw him yesterday »."
      },
      {
        type: 'qcm',
        q: 'Que signifie « actually » ?',
        choix: ['Actuellement', 'En fait', 'Éventuellement'],
        reponse: 1,
        explication: "En fait, en réalité. « Actuellement » se dit « currently », et « éventuellement » se dit « possibly ». Ce sont les trois faux amis les plus piégeux du chapitre."
      },
      {
        type: 'qcm',
        q: 'Que signifie « eventually » ?',
        choix: ['Éventuellement', 'Finalement, au bout du compte', 'Également'],
        reponse: 1,
        explication: "Finalement, au bout du compte. « Eventually, he came » signifie qu'il a fini par venir. Rien à voir avec « éventuellement »."
      },
      {
        type: 'qcm',
        q: 'Quel connecteur sert à conclure un récit ?',
        choix: ['At first', 'Meanwhile', 'In the end'],
        reponse: 2,
        explication: "In the end, ou finally, ou at last. « At first » ouvre le récit, « meanwhile » situe deux actions simultanées."
      },
      {
        type: 'qcm',
        q: 'Par quel verbe plus précis remplacer « I went out of the room quickly » ?',
        choix: ['I rushed out of the room.', 'I made out of the room.', 'I did out of the room.'],
        reponse: 0,
        explication: "I rushed out. Un verbe précis remplace un verbe plus un adverbe. De même, « understood suddenly » devient « realised », et « was very afraid » devient « was terrified »."
      }
    ]
  }
,
  'espagnol-lv2/L03': {
    titre: 'Gustar y la opinión',
    items: [
      {
        type: 'qcm',
        q: 'Comment dit-on « j\'aime le chocolat » en espagnol ?',
        choix: ['Yo gusto el chocolate.', 'Me gusta el chocolate.', 'Yo gusta el chocolate.'],
        reponse: 1,
        explication: "Me gusta el chocolate, littéralement « le chocolat me plaît ». La personne n'est jamais sujet de gustar : « yo gusto » signifierait « je plais »."
      },
      {
        type: 'qcm',
        q: 'Avec quoi le verbe gustar s\'accorde-t-il ?',
        choix: ['Avec la personne qui aime', 'Avec la chose aimée', 'Il ne s\'accorde jamais'],
        reponse: 1,
        explication: "Avec la chose aimée, qui est le vrai sujet du verbe. D'où « me gusta el libro » mais « me gustan los libros »."
      },
      {
        type: 'saisie',
        q: 'Complète : « Me ___ los libros. » (verbe gustar)',
        reponses: ['gustan'],
        explication: "gustan. « los libros » est un nom au PLURIEL, donc le verbe se met au pluriel. Le test unique : le mot qui suit est-il un nom pluriel ? Si oui, gustan."
      },
      {
        type: 'saisie',
        q: 'Complète : « Me ___ leer y escribir. » (verbe gustar)',
        reponses: ['gusta'],
        explication: "gusta, au SINGULIER. Même avec deux infinitifs, le verbe reste au singulier. Deux NOMS entraîneraient en revanche le pluriel : « me gustan el cine y el teatro »."
      },
      {
        type: 'qcm',
        q: 'Quel pronom emploie-t-on pour « il aime » ou « elle aime » ?',
        choix: ['lo', 'le', 'la'],
        reponse: 1,
        explication: "« le » dans les deux cas : le pronom ne change jamais selon le genre. Pour lever l'ambiguïté, on ajoute une forme tonique : « a Marta le gusta »."
      },
      {
        type: 'qcm',
        q: 'Où place-t-on la négation ?',
        choix: ['Me no gusta el café.', 'No me gusta el café.', 'Me gusta no el café.'],
        reponse: 1,
        explication: "No me gusta el café. L'ordre est toujours : no + pronom + verbe. C'est une différence avec le français, où la négation encadre le verbe."
      },
      {
        type: 'qcm',
        q: 'Quelle phrase est correcte ?',
        choix: ['A mí gusta el cine.', 'A mí me gusta el cine.', 'A mí me gusto el cine.'],
        reponse: 1,
        explication: "A mí me gusta el cine. La forme tonique s'AJOUTE au pronom, elle ne le remplace jamais. Cette redondance paraît étrange en français, elle est obligatoire en espagnol."
      },
      {
        type: 'qcm',
        q: 'Comment dit-on « j\'ai mal à la tête » ?',
        choix: ['Tengo mal la cabeza.', 'Me duele la cabeza.', 'Duelo la cabeza.'],
        reponse: 1,
        explication: "Me duele la cabeza, littéralement « la tête me fait mal ». Le verbe doler se construit exactement comme gustar : « me duelen los pies » au pluriel."
      },
      {
        type: 'saisie',
        q: 'Complète : « Me ___ los pies. » (verbe doler, j\'ai mal aux pieds)',
        reponses: ['duelen'],
        explication: "duelen. « los pies » est pluriel, donc le verbe aussi. C'est exactement la même règle d'accord que pour gustar : elle vaut pour toute la famille."
      },
      {
        type: 'qcm',
        q: 'Que signifie « me apetece un café » ?',
        choix: ['Je déteste le café', 'J\'ai envie d\'un café', 'Le café me manque'],
        reponse: 1,
        explication: "J'ai envie d'un café. Autres verbes de la famille : interesar (intéresser), molestar (déranger), faltar (manquer), quedar (rester), parecer (sembler)."
      },
      {
        type: 'vraifaux',
        q: 'On peut dire « me encanta mucho ».',
        reponse: false,
        explication: "Faux. « Encantar » signifie déjà « adorer » : ajouter « mucho » est un pléonasme. Pour nuancer, on dit « me gusta mucho »."
      },
      {
        type: 'qcm',
        q: 'Range de la plus positive à la plus négative : me gusta un poco, me encanta, no me gusta nada, me gusta mucho.',
        choix: ['me encanta, me gusta mucho, me gusta un poco, no me gusta nada', 'me gusta mucho, me encanta, no me gusta nada, me gusta un poco', 'me encanta, me gusta un poco, me gusta mucho, no me gusta nada'],
        reponse: 0,
        explication: "L'échelle complète : me encanta, me gusta mucho, me gusta, me gusta un poco, no me gusta, no me gusta nada, odio. Employer toujours la même formule coûte des points en rédaction."
      },
      {
        type: 'qcm',
        q: '« — Me gusta el cine. » Tu es d\'accord. Que réponds-tu ?',
        choix: ['A mí también.', 'A mí tampoco.', 'A mí sí.'],
        reponse: 0,
        explication: "A mí también. La phrase est positive et tu es d'accord : también. « Tampoco » ne s'emploie qu'après une phrase négative."
      },
      {
        type: 'qcm',
        q: '« — No me gusta el café. » Tu es d\'accord. Que réponds-tu ?',
        choix: ['A mí también.', 'A mí tampoco.', 'A mí no.'],
        reponse: 1,
        explication: "A mí tampoco. La phrase est négative et tu es d'accord : tampoco. Répondre « también » après une phrase négative est une faute de logique autant que de langue."
      },
      {
        type: 'qcm',
        q: '« — No me gusta bailar. » Tu n\'es pas d\'accord. Que réponds-tu ?',
        choix: ['A mí tampoco.', 'A mí sí.', 'A mí no.'],
        reponse: 1,
        explication: "A mí sí. Le tableau à quatre cases : positive et accord → también ; négative et accord → tampoco ; positive et désaccord → no ; négative et désaccord → sí."
      },
      {
        type: 'saisie',
        q: 'Comment dit-on « à mon avis » en espagnol ? (trois mots)',
        reponses: ['en mi opinión', 'en mi opinion'],
        explication: "En mi opinión. Autres formules : creo que, pienso que, me parece que, para mí. On en choisit UNE par phrase : on varie, on ne les empile pas."
      },
      {
        type: 'qcm',
        q: 'Quel connecteur sert à objecter ou à nuancer ?',
        choix: ['Además', 'Sin embargo', 'Por ejemplo'],
        reponse: 1,
        explication: "Sin embargo, qui signifie « cependant ». « Además » ajoute, « por ejemplo » illustre, « por eso » conclut. Varier les connecteurs est l'un des critères d'évaluation."
      },
      {
        type: 'qcm',
        q: 'Qu\'est-ce qui distingue un goût d\'une opinion argumentée ?',
        choix: ['Rien', 'La présence d\'une raison, introduite par porque', 'La longueur de la phrase'],
        reponse: 1,
        explication: "« Me gusta el fútbol » est un goût. « Me gusta el fútbol porque es un deporte de equipo » est une opinion. En production écrite, chaque affirmation appelle un porque ou un exemple."
      },
      {
        type: 'qcm',
        q: 'Que signifie l\'adjectif espagnol « largo » ?',
        choix: ['Large', 'Long', 'Lourd'],
        reponse: 1,
        explication: "Long. « Large » se dit « ancho ». C'est l'un des faux amis les plus fréquents, et il revient constamment dans les descriptions."
      },
      {
        type: 'qcm',
        q: 'Dans quel ordre s\'écrit une phrase complète avec forme tonique ?',
        choix: ['forme tonique + pronom + verbe + ce qui plaît', 'pronom + forme tonique + verbe', 'verbe + pronom + forme tonique'],
        reponse: 0,
        explication: "A mí (tonique) + me (pronom) + gusta (verbe) + el cine (ce qui plaît). La forme tonique sert à insister ou à préciser de qui on parle, mais le pronom reste obligatoire."
      }
    ]
  }
,
  'maths/L05': {
    titre: 'Proportionnalité, pourcentages, vitesses',
    items: [
      {
        type: 'qcm',
        q: 'Comment teste-t-on si un tableau est de proportionnalité ?',
        choix: ['On regarde si les nombres augmentent', 'On calcule les quotients : ils doivent tous être égaux', 'On additionne les colonnes'],
        reponse: 1,
        explication: "On divise la seconde grandeur par la première, colonne par colonne. Si tous les quotients sont égaux, il y a proportionnalité. Un seul quotient différent suffit à conclure que non."
      },
      {
        type: 'vraifaux',
        q: 'Sur un graphique, des points alignés suffisent à prouver la proportionnalité.',
        reponse: false,
        explication: "Faux. La droite doit en plus passer par l'ORIGINE. Une droite alignée qui coupe l'axe vertical au-dessus de zéro correspond à un abonnement avec part fixe : ce n'est pas proportionnel."
      },
      {
        type: 'saisie',
        q: '5 cahiers coûtent 7,50 €. Combien coûtent 8 cahiers, en euros ?',
        reponses: ['12', '12 €', '12€', '12 euros'],
        explication: "k = 7,50 ÷ 5 = 1,50 € par cahier, donc 8 × 1,50 = 12 €. On peut aussi faire le produit en croix : (7,50 × 8) ÷ 5 = 12."
      },
      {
        type: 'qcm',
        q: 'Un abonnement coûte 15 € par mois plus 2 € par séance. Est-ce proportionnel ?',
        choix: ['Oui', 'Non, car à zéro séance le prix n\'est pas nul', 'On ne peut pas savoir'],
        reponse: 1,
        explication: "Non. Dans une proportionnalité, à zéro correspond toujours zéro. Ici, sans aucune séance, on paie déjà 15 € : c'est une part fixe, et le graphique ne passe pas par l'origine."
      },
      {
        type: 'saisie',
        q: 'Calcule 30 % de 250.',
        reponses: ['75'],
        explication: "250 × 0,30 = 75. Prendre p % d'un nombre, c'est le multiplier par p ÷ 100."
      },
      {
        type: 'saisie',
        q: '18 représente quel pourcentage de 60 ? Réponds par un nombre.',
        reponses: ['30', '30%', '30 %'],
        explication: "(18 ÷ 60) × 100 = 30 %. Attention à ne pas confondre : appliquer un pourcentage MULTIPLIE, calculer un pourcentage DIVISE puis multiplie par 100."
      },
      {
        type: 'qcm',
        q: 'Par quel coefficient multiplier pour une hausse de 15 % ?',
        choix: ['0,15', '1,15', '15'],
        reponse: 1,
        explication: "1,15. Augmenter de p % revient à multiplier par 1 + p ÷ 100. Pour une baisse de 15 %, on multiplierait par 0,85."
      },
      {
        type: 'qcm',
        q: 'Par quel coefficient multiplier pour une baisse de 40 % ?',
        choix: ['0,40', '0,60', '1,40'],
        reponse: 1,
        explication: "0,60. Diminuer de 40 % revient à conserver 60 % du montant, donc à multiplier par 0,60."
      },
      {
        type: 'saisie',
        q: 'Un article à 80 € subit une remise de 30 %. Quel est son prix, en euros ?',
        reponses: ['56', '56 €', '56€'],
        explication: "80 × 0,70 = 56 €. La méthode par coefficient est plus sûre que de calculer la remise puis de la soustraire : une seule étape, donc moins d'erreurs."
      },
      {
        type: 'qcm',
        q: 'Après une hausse de 20 %, un article coûte 90 €. Quel était son prix initial ?',
        choix: ['72 €', '75 €', '70 €'],
        reponse: 1,
        explication: "90 ÷ 1,20 = 75 €. On DIVISE par le coefficient : soustraire 20 % de 90 donnerait 72 €, ce qui est faux, car le pourcentage portait sur le prix initial."
      },
      {
        type: 'qcm',
        q: 'Un prix augmente de 10 % puis de 20 %. Quelle est la hausse totale ?',
        choix: ['30 %', '32 %', '2 %'],
        reponse: 1,
        explication: "1,10 × 1,20 = 1,32, soit 32 %. Les pourcentages successifs se MULTIPLIENT, jamais ne s'additionnent : la seconde hausse s'applique à un montant déjà augmenté."
      },
      {
        type: 'qcm',
        q: 'Un prix augmente de 10 % puis baisse de 10 %. Quel est l\'effet global ?',
        choix: ['Retour au prix initial', 'Une baisse de 1 %', 'Une hausse de 1 %'],
        reponse: 1,
        explication: "1,10 × 0,90 = 0,99, soit une baisse de 1 %. Sur 100 € : 100 → 110 → 99. Les deux pourcentages ne portent pas sur le même nombre."
      },
      {
        type: 'qcm',
        q: 'Un magasin annonce −30 % puis −20 % supplémentaires. Quelle est la remise réelle ?',
        choix: ['50 %', '44 %', '56 %'],
        reponse: 1,
        explication: "0,70 × 0,80 = 0,56, donc on conserve 56 % du prix : la remise réelle est de 44 %. Annoncer −50 % serait trompeur."
      },
      {
        type: 'saisie',
        q: 'Un train parcourt 300 km en 2 h 30. Quelle est sa vitesse en km/h ?',
        reponses: ['120', '120 km/h', '120km/h'],
        explication: "2 h 30 s'écrit 2,5 en heures décimales, et non 2,30. Donc v = 300 ÷ 2,5 = 120 km/h."
      },
      {
        type: 'qcm',
        q: 'Comment écrit-on 3 h 45 en heures décimales ?',
        choix: ['3,45', '3,75', '3,45 h'],
        reponse: 1,
        explication: "3,75. On divise les minutes par 60 : 45 ÷ 60 = 0,75. De même, 2 h 30 s'écrit 2,5 et 1 h 15 s'écrit 1,25."
      },
      {
        type: 'saisie',
        q: 'Combien vaut 15 m/s en km/h ?',
        reponses: ['54', '54 km/h', '54km/h'],
        explication: "15 × 3,6 = 54 km/h. Le facteur 3,6 vient du fait qu'en une heure, soit 3600 secondes, on parcourt 3600 mètres, c'est-à-dire 3,6 kilomètres."
      },
      {
        type: 'qcm',
        q: 'Un trajet se fait à 60 km/h à l\'aller et 40 km/h au retour. Quelle est la vitesse moyenne ?',
        choix: ['50 km/h', '48 km/h', '52 km/h'],
        reponse: 1,
        explication: "48 km/h. Sur 120 km dans chaque sens : 2 h à l'aller, 3 h au retour, donc 240 ÷ 5 = 48. On passe plus de temps à la vitesse lente, qui pèse donc davantage."
      },
      {
        type: 'qcm',
        q: 'Un robinet remplit 180 L en 12 min. Quel est son débit ?',
        choix: ['15 L/min', '12 L/min', '20 L/min'],
        reponse: 0,
        explication: "180 ÷ 12 = 15 L/min. Le débit est une grandeur composée, comme la vitesse : trois formules dont une seule est à retenir."
      },
      {
        type: 'qcm',
        q: 'Une voiture consomme 6,5 L aux 100 km. Combien pour 350 km ?',
        choix: ['22,75 L', '18,5 L', '65 L'],
        reponse: 0,
        explication: "350 km représente 3,5 fois 100 km, donc 6,5 × 3,5 = 22,75 L. C'est une simple proportionnalité."
      },
      {
        type: 'vraifaux',
        q: 'Le coefficient de proportionnalité a toujours une unité.',
        reponse: true,
        explication: "Vrai : euros par mètre, kilomètres par heure, grammes par centimètre cube. Cette unité indique dans quel sens le coefficient s'emploie, et c'est le meilleur contrôle contre les erreurs."
      }
    ]
  }
,
  'physique-chimie/L04': {
    titre: 'Mouvements : vitesse et trajectoire',
    items: [
      {
        type: 'qcm',
        q: 'Que faut-il préciser pour décrire complètement un mouvement ?',
        choix: ['La vitesse seulement', 'Le référentiel, la trajectoire et la vitesse', 'La distance et la durée'],
        reponse: 1,
        explication: "Les trois. Dire « la voiture bouge » est incomplet : il faut toujours préciser par rapport à quoi on observe, quelle forme a le chemin, et à quel rythme la position change."
      },
      {
        type: 'qcm',
        q: 'Un passager assis dans un train qui roule est-il en mouvement ?',
        choix: ['Oui, toujours', 'Non, jamais', 'Cela dépend du référentiel'],
        reponse: 2,
        explication: "Cela dépend. Par rapport à son siège il est immobile, par rapport au quai il roule à 200 km/h, par rapport à un train croisé à la même vitesse il va à 400 km/h. Les trois réponses sont exactes."
      },
      {
        type: 'qcm',
        q: 'Quel référentiel emploie-t-on pour étudier le mouvement des planètes ?',
        choix: ['Terrestre', 'Géocentrique', 'Héliocentrique'],
        reponse: 2,
        explication: "Héliocentrique, centré sur le Soleil : les trajectoires y deviennent des ellipses simples. Le géocentrique, centré sur la Terre, sert pour la Lune et les satellites."
      },
      {
        type: 'vraifaux',
        q: 'Il existe un référentiel absolu, vrai pour tout le monde.',
        reponse: false,
        explication: "Faux. Le référentiel est une CONVENTION, choisie pour que la description soit la plus simple possible. Changer de référentiel ne change pas la réalité physique, seulement sa description."
      },
      {
        type: 'qcm',
        q: 'Quelle est la trajectoire d\'un ballon lancé vers un panier ?',
        choix: ['Rectiligne', 'Circulaire', 'Curviligne'],
        reponse: 2,
        explication: "Curviligne : la trajectoire est une courbe en arc. Rectiligne désignerait une droite, circulaire un cercle comme celui d'une nacelle de grande roue."
      },
      {
        type: 'qcm',
        q: 'Un point de la roue d\'un vélo décrit quelle trajectoire par rapport au sol ?',
        choix: ['Un cercle', 'Une courbe en boucles', 'Une droite'],
        reponse: 1,
        explication: "Une courbe en boucles, appelée cycloïde : le point avance en même temps qu'il tourne. Par rapport au CADRE du vélo, il décrirait en revanche un cercle."
      },
      {
        type: 'saisie',
        q: 'Un coureur parcourt 400 m en 50 s. Quelle est sa vitesse, en m/s ?',
        reponses: ['8', '8 m/s', '8m/s'],
        explication: "v = d ÷ t = 400 ÷ 50 = 8 m/s, soit environ 29 km/h. C'est l'ordre de grandeur d'un sprinteur sur une course de demi-fond."
      },
      {
        type: 'saisie',
        q: 'Convertis 20 m/s en km/h.',
        reponses: ['72', '72 km/h', '72km/h'],
        explication: "20 × 3,6 = 72 km/h. Le facteur 3,6 vient de 3600 secondes dans une heure divisées par 1000 mètres dans un kilomètre."
      },
      {
        type: 'saisie',
        q: 'Convertis 90 km/h en m/s.',
        reponses: ['25', '25 m/s', '25m/s'],
        explication: "90 ÷ 3,6 = 25 m/s. À cette vitesse, une seconde de réaction représente donc 25 mètres parcourus avant même de toucher la pédale de frein."
      },
      {
        type: 'qcm',
        q: 'Un marcheur à 15 m/s : est-ce plausible ?',
        choix: ['Oui', 'Non, cela ferait 54 km/h', 'On ne peut pas savoir'],
        reponse: 1,
        explication: "Non : 15 × 3,6 = 54 km/h, la vitesse d'une voiture en ville. Un marcheur avance vers 1,4 m/s, soit 5 km/h. Convertir en km/h est le meilleur contrôle de plausibilité."
      },
      {
        type: 'qcm',
        q: 'Quelle est la différence entre vitesse moyenne et vitesse instantanée ?',
        choix: ['Aucune', 'La moyenne résume un trajet, l\'instantanée décrit un instant', 'L\'instantanée est toujours plus grande'],
        reponse: 1,
        explication: "La vitesse moyenne rapporte la distance totale à la durée totale. L'instantanée est celle du compteur à un moment donné. Un trajet à 60 km/h de moyenne peut comporter des arrêts et des pointes à 90."
      },
      {
        type: 'qcm',
        q: 'Un trajet se fait à 60 km/h à l\'aller et 40 km/h au retour. Quelle est la vitesse moyenne ?',
        choix: ['50 km/h', '48 km/h', '55 km/h'],
        reponse: 1,
        explication: "48 km/h. Sur 120 km dans chaque sens : 2 h à l'aller, 3 h au retour. 240 ÷ 5 = 48. On passe plus de temps à la vitesse lente, qui pèse donc davantage."
      },
      {
        type: 'qcm',
        q: 'Sur une chronophotographie, les positions sont de plus en plus espacées. Quel mouvement ?',
        choix: ['Uniforme', 'Accéléré', 'Ralenti'],
        reponse: 1,
        explication: "Accéléré. L'intervalle de temps entre deux prises de vue étant constant, un espacement croissant signifie que l'objet parcourt plus de distance dans le même temps : sa vitesse augmente."
      },
      {
        type: 'saisie',
        q: 'Sur une chronophotographie prise toutes les 0,1 s, la distance entre deux positions vaut 2,4 cm. Quelle est la vitesse en m/s ?',
        reponses: ['0,24', '0.24', '0,24 m/s'],
        explication: "2,4 cm = 0,024 m. v = 0,024 ÷ 0,1 = 0,24 m/s. Penser à convertir les centimètres en mètres avant de diviser."
      },
      {
        type: 'vraifaux',
        q: 'Un mouvement uniforme est un mouvement à l\'arrêt.',
        reponse: false,
        explication: "Faux. Uniforme signifie à VITESSE CONSTANTE. Un TGV qui roule à 300 km/h sans changer d'allure est en mouvement uniforme."
      },
      {
        type: 'qcm',
        q: 'Sur un graphique distance-temps, que signifie une droite horizontale ?',
        choix: ['L\'objet est immobile', 'L\'objet avance à vitesse constante', 'L\'objet accélère'],
        reponse: 0,
        explication: "Il est immobile : la distance ne change plus. Attention, sur un graphique VITESSE-temps, une droite horizontale signifierait au contraire une vitesse constante. Toujours lire les axes."
      },
      {
        type: 'qcm',
        q: 'De quoi la distance d\'arrêt est-elle la somme ?',
        choix: ['Distance de réaction + distance de freinage', 'Vitesse + durée', 'Distance de freinage seulement'],
        reponse: 0,
        explication: "Des deux. La distance de réaction est parcourue avant même de toucher le frein, pendant environ une seconde. La distance de freinage commence ensuite."
      },
      {
        type: 'qcm',
        q: 'Si la vitesse double, par combien la distance de freinage est-elle multipliée ?',
        choix: ['Par 2', 'Par 4', 'Par 3'],
        reponse: 1,
        explication: "Par 4, car elle est proportionnelle au CARRÉ de la vitesse. La distance de réaction, elle, ne fait que doubler : elle est simplement proportionnelle à la vitesse."
      },
      {
        type: 'qcm',
        q: 'Que change l\'usage du téléphone au volant ?',
        choix: ['La distance de freinage', 'Le temps de réaction', 'La vitesse maximale'],
        reponse: 1,
        explication: "Le temps de réaction, qu'il allonge fortement. La distance de freinage dépend du véhicule et de la route. À 90 km/h, une seconde d'inattention ajoute déjà 25 mètres."
      },
      {
        type: 'qcm',
        q: 'Quelle est la distance d\'arrêt approximative à 90 km/h ?',
        choix: ['45 m', '70 m', '28 m'],
        reponse: 1,
        explication: "Environ 70 m : 25 m de réaction et 45 m de freinage. À 50 km/h elle n'est que de 28 m, et à 130 km/h elle atteint 130 m, soit plus d'un terrain de football."
      }
    ]
  }
,
  'physique-chimie/L05': {
    titre: 'Les forces',
    items: [
      {
        type: 'qcm',
        q: 'Quels sont les trois effets possibles d\'une action mécanique ?',
        choix: ['Chauffer, refroidir, éclairer', 'Mettre en mouvement ou arrêter, modifier le mouvement, déformer', 'Attirer, repousser, dissoudre'],
        reponse: 1,
        explication: "Une action mécanique peut mettre en mouvement ou arrêter, modifier un mouvement en vitesse ou en direction, et déformer. Une même action peut produire plusieurs effets à la fois."
      },
      {
        type: 'vraifaux',
        q: 'Une force peut exister sans qu\'un objet l\'exerce.',
        reponse: false,
        explication: "Faux. Une force implique toujours deux objets : celui qui l'exerce et celui qui la subit. On la nomme donc « force exercée par A sur B »."
      },
      {
        type: 'qcm',
        q: 'La résistance de l\'air sur un cycliste est une action :',
        choix: ['à distance', 'de contact', 'ni l\'une ni l\'autre'],
        reponse: 1,
        explication: "De contact : l'air touche le cycliste, même s'il est invisible. Seules la gravitation, le magnétisme et l'électricité agissent à distance."
      },
      {
        type: 'qcm',
        q: 'Dans le bilan des forces s\'exerçant sur un livre posé sur une table, que faut-il inclure ?',
        choix: ['Le poids, la réaction de la table, et la force du livre sur la table', 'Le poids et la réaction de la table', 'Seulement le poids'],
        reponse: 1,
        explication: "Seulement deux forces. Un bilan recense uniquement les forces exercées SUR l'objet d'étude. La force du livre sur la table existe, mais elle s'applique à la table."
      },
      {
        type: 'qcm',
        q: 'Combien de caractéristiques une force possède-t-elle ?',
        choix: ['Deux', 'Trois', 'Quatre'],
        reponse: 2,
        explication: "Quatre : le point d'application, la direction, le sens et la valeur. Sur une flèche, elles se lisent respectivement à l'origine, à l'orientation du trait, à la pointe et à la longueur."
      },
      {
        type: 'saisie',
        q: 'Quelle est l\'unité de force ? Écris son nom au singulier.',
        reponses: ['newton', 'le newton', 'Newton'],
        explication: "Le newton, de symbole N. Un newton correspond environ au poids d'une masse de 100 g, celui d'une petite pomme."
      },
      {
        type: 'qcm',
        q: 'Quelle est la différence entre le poids et la masse ?',
        choix: ['Aucune', 'La masse est une quantité de matière, le poids est une force', 'Le poids est plus précis'],
        reponse: 1,
        explication: "La masse se mesure en kilogrammes à la balance et ne change pas avec le lieu. Le poids est une force, se mesure en newtons au dynamomètre, et dépend de l'astre."
      },
      {
        type: 'saisie',
        q: 'Écris la relation entre le poids P, la masse m et l\'intensité de la pesanteur g.',
        reponses: ['P = m x g', 'P = m × g', 'p = m x g', 'P=m×g', 'P=mxg', 'P = mg'],
        explication: "P = m × g. P en newtons, m en kilogrammes, g en newtons par kilogramme. Sur Terre, g vaut environ 9,8 N/kg, souvent arrondi à 10."
      },
      {
        type: 'saisie',
        q: 'Calcule le poids d\'un objet de 30 kg sur Terre, avec g = 9,8 N/kg. Réponds en newtons.',
        reponses: ['294', '294 N', '294N'],
        explication: "P = 30 × 9,8 = 294 N. Avec g arrondi à 10, on trouverait 300 N. Un poids se donne toujours en newtons, jamais en kilogrammes."
      },
      {
        type: 'saisie',
        q: 'Un objet a un poids de 147 N. Quelle est sa masse en kg, avec g = 9,8 N/kg ?',
        reponses: ['15', '15 kg', '15kg'],
        explication: "m = P ÷ g = 147 ÷ 9,8 = 15 kg. Contrôler l'unité du résultat détecte la quasi-totalité des erreurs de formule."
      },
      {
        type: 'qcm',
        q: 'Un astronaute de 120 kg part sur la Lune. Que devient sa masse ?',
        choix: ['Elle est divisée par 6', 'Elle reste 120 kg', 'Elle devient nulle'],
        reponse: 1,
        explication: "Elle reste 120 kg : la masse est une quantité de matière, indépendante du lieu. C'est son POIDS qui est divisé par environ six, de 1176 N à 192 N."
      },
      {
        type: 'qcm',
        q: 'Combien vaut l\'intensité de la pesanteur sur la Lune ?',
        choix: ['9,8 N/kg', '1,6 N/kg', '3,7 N/kg'],
        reponse: 1,
        explication: "1,6 N/kg, soit environ six fois moins que sur Terre. Mars est à 3,7 N/kg et Jupiter à 24,8 N/kg."
      },
      {
        type: 'vraifaux',
        q: 'Dans une station spatiale, la masse des objets disparaît.',
        reponse: false,
        explication: "Faux. Seule la SENSATION de poids disparaît, car la station et tout ce qu'elle contient tombent ensemble. Pousser une caisse de 100 kg y demande le même effort que sur Terre."
      },
      {
        type: 'qcm',
        q: 'À quelle condition deux forces se compensent-elles ?',
        choix: ['Même direction, sens opposés, même valeur', 'Même sens et même valeur', 'Elles ne se compensent jamais'],
        reponse: 0,
        explication: "Les trois conditions doivent être réunies. Leur effet combiné est alors nul : l'objet immobile reste immobile, l'objet en mouvement continue en ligne droite à vitesse constante."
      },
      {
        type: 'vraifaux',
        q: 'Si les forces se compensent, l\'objet est forcément immobile.',
        reponse: false,
        explication: "Faux. Un parachutiste en chute stabilisée tombe à 200 km/h avec des forces compensées. Ce qui est nul, ce n'est pas la vitesse mais sa VARIATION."
      },
      {
        type: 'qcm',
        q: 'Pourquoi la vitesse d\'un parachutiste devient-elle constante en chute stabilisée ?',
        choix: ['Parce que le poids disparaît', 'Parce que la résistance de l\'air a augmenté jusqu\'à égaler le poids', 'Parce qu\'il freine avec les bras'],
        reponse: 1,
        explication: "La résistance de l'air augmente avec la vitesse. Tant que le poids l'emporte, la vitesse croît, donc la résistance aussi. Le processus s'arrête quand les deux sont égales."
      },
      {
        type: 'qcm',
        q: 'Dans quel sens s\'exerce une force de frottement ?',
        choix: ['Dans le sens du mouvement', 'Dans le sens opposé au mouvement', 'Perpendiculairement au mouvement'],
        reponse: 1,
        explication: "Toujours dans le sens opposé au mouvement. Une force de frottement ne peut donc jamais accélérer un objet : elle le freine, sans exception."
      },
      {
        type: 'qcm',
        q: 'Pourquoi un objet lancé sur une table finit-il par s\'arrêter ?',
        choix: ['Parce qu\'il n\'a plus de force', 'Parce que les frottements ne sont compensés par rien', 'Parce que son poids augmente'],
        reponse: 1,
        explication: "Les frottements sont une force non compensée dirigée contre le mouvement. Sans frottement, l'objet continuerait indéfiniment en ligne droite à vitesse constante : c'est le principe d'inertie."
      },
      {
        type: 'qcm',
        q: 'Quelle est la direction et le sens de la réaction d\'un support horizontal ?',
        choix: ['Horizontale, vers l\'avant', 'Verticale, vers le haut', 'Verticale, vers le bas'],
        reponse: 1,
        explication: "Perpendiculaire au support, donc verticale ici, et dirigée vers le haut. Sur un plan horizontal, elle compense exactement le poids quand l'objet est immobile."
      },
      {
        type: 'qcm',
        q: 'Un satellite en orbite subit une seule force, son poids. Son mouvement est-il modifié ?',
        choix: ['Non, il va tout droit', 'Oui, sa direction change en permanence', 'Non, les forces se compensent'],
        reponse: 1,
        explication: "Oui. Sa vitesse est constante en valeur, mais sa direction change sans arrêt : il est en chute permanente vers la Terre, qui se dérobe sous lui à mesure qu'il tombe."
      }
    ]
  }
,
  'svt/L04': {
    titre: 'Météorologie et climats',
    items: [
      {
        type: 'qcm',
        q: 'Sur quelle durée minimale calcule-t-on un climat ?',
        choix: ['Un an', 'Dix ans', 'Trente ans'],
        reponse: 2,
        explication: "Trente ans au minimum. La météorologie, elle, décrit l'état de l'atmosphère sur quelques heures à quelques jours. Le climat, c'est ce à quoi on s'attend ; la météo, ce qu'on obtient."
      },
      {
        type: 'vraifaux',
        q: 'Un hiver très froid prouve que le climat ne se réchauffe pas.',
        reponse: false,
        explication: "Faux. Le climat est une moyenne sur trente ans, qui peut augmenter tout en comportant des années froides. Conclure sur une tendance à partir d'un épisode, c'est juger une classe entière sur un seul élève."
      },
      {
        type: 'qcm',
        q: 'Quel instrument mesure la pression atmosphérique ?',
        choix: ['Le baromètre', 'L\'hygromètre', 'L\'anémomètre'],
        reponse: 0,
        explication: "Le baromètre, en hectopascals. L'hygromètre mesure l'humidité, l'anémomètre la vitesse du vent. La pression moyenne au niveau de la mer vaut 1013 hPa."
      },
      {
        type: 'qcm',
        q: 'Dans un anticyclone, quel temps règne en général ?',
        choix: ['Perturbé et pluvieux', 'Stable et sec', 'Venteux et froid'],
        reponse: 1,
        explication: "Stable et sec. Un anticyclone est une zone de HAUTE pression où l'air descend, ce qui empêche la formation de nuages. Une dépression, à basse pression, donne au contraire un temps perturbé."
      },
      {
        type: 'saisie',
        q: 'À combien de litres d\'eau par mètre carré correspond 1 mm de pluie ?',
        reponses: ['1', '1 litre', '1 L', 'un litre'],
        explication: "1 litre par mètre carré. Un orage de 30 mm dépose donc 30 litres par mètre carré, soit 300 000 litres sur un hectare : c'est ce qui explique les inondations soudaines."
      },
      {
        type: 'qcm',
        q: 'Pourquoi fait-il plus chaud à l\'équateur qu\'aux pôles ?',
        choix: ['Les pôles sont plus loin du Soleil', 'Les rayons arrivent perpendiculairement à l\'équateur et très inclinés aux pôles', 'L\'air y est plus épais'],
        reponse: 1,
        explication: "C'est l'inclinaison des rayons. La différence de distance est négligeable : le Soleil est à 150 millions de km, le rayon terrestre n'est que de 6400 km."
      },
      {
        type: 'saisie',
        q: 'Comment appelle-t-on la part du rayonnement solaire réfléchie par une surface ?',
        reponses: ['albédo', 'l\'albédo', 'albedo'],
        explication: "L'albédo. La neige fraîche a un albédo de 0,85 : elle renvoie 85 % de l'énergie. L'océan n'a qu'un albédo de 0,06 : il en absorbe presque toute."
      },
      {
        type: 'qcm',
        q: 'La banquise fond, laissant place à de l\'eau sombre. Que se passe-t-il ?',
        choix: ['L\'océan absorbe plus d\'énergie, ce qui accélère la fonte', 'Rien ne change', 'L\'océan refroidit l\'atmosphère'],
        reponse: 0,
        explication: "L'eau absorbe bien plus d'énergie que la glace. Elle se réchauffe, ce qui fait fondre plus de glace encore : c'est une rétroaction positive, et c'est pourquoi l'Arctique se réchauffe trois fois plus vite que la moyenne."
      },
      {
        type: 'qcm',
        q: 'Dans quel sens souffle le vent ?',
        choix: ['Des basses vers les hautes pressions', 'Des hautes vers les basses pressions', 'Toujours vers le nord'],
        reponse: 1,
        explication: "Des hautes pressions vers les basses pressions. L'air chaud, moins dense, monte ; l'air froid descend : ces mouvements créent les différences de pression qui engendrent le vent."
      },
      {
        type: 'qcm',
        q: 'Range ces zones de l\'équateur vers le pôle.',
        choix: ['équatoriale, tropicale, désertique, tempérée, polaire', 'équatoriale, tempérée, désertique, tropicale, polaire', 'tropicale, équatoriale, tempérée, désertique, polaire'],
        reponse: 0,
        explication: "Équatoriale, tropicale, désertique, tempérée, polaire. Cet ordre se retrouve en miroir dans les deux hémisphères : il découle directement de l'inclinaison des rayons solaires."
      },
      {
        type: 'qcm',
        q: 'Brest et Strasbourg sont à la même latitude, mais Brest a des hivers plus doux. Pourquoi ?',
        choix: ['Brest est plus au sud', 'Brest est au bord de l\'océan', 'Brest est plus basse en altitude'],
        reponse: 1,
        explication: "La proximité de l'océan. L'eau se réchauffe et se refroidit bien plus lentement que la terre : elle accumule la chaleur en été et la restitue en hiver. Strasbourg subit au contraire la continentalité."
      },
      {
        type: 'qcm',
        q: 'De combien la température baisse-t-elle environ par 100 m d\'altitude ?',
        choix: ['0,6 °C', '2 °C', '5 °C'],
        reponse: 0,
        explication: "Environ 0,6 °C par 100 m. Sur 1000 m de dénivelé, cela représente déjà 6 °C, ce qui explique la présence de neige en altitude alors qu'il pleut dans la vallée."
      },
      {
        type: 'qcm',
        q: 'Sans effet de serre naturel, quelle serait la température moyenne de la Terre ?',
        choix: ['0 °C', '−18 °C', '−50 °C'],
        reponse: 1,
        explication: "Environ −18 °C, au lieu de +15 °C. L'effet de serre naturel nous apporte donc environ 33 °C : sans lui, l'eau liquide et la vie telle que nous la connaissons n'existeraient pas."
      },
      {
        type: 'vraifaux',
        q: 'Il faudrait supprimer l\'effet de serre pour sauver la planète.',
        reponse: false,
        explication: "Faux, et c'est même l'inverse : sans lui la Terre serait gelée. Le problème n'est pas l'effet de serre mais son RENFORCEMENT rapide depuis l'ère industrielle."
      },
      {
        type: 'qcm',
        q: 'Quelle étape décrit correctement l\'effet de serre ?',
        choix: ['Les gaz réfléchissent les rayons du Soleil', 'Le sol réémet de l\'infrarouge, que les gaz absorbent et renvoient vers le sol', 'Les gaz chauffent directement l\'atmosphère'],
        reponse: 1,
        explication: "Le rayonnement solaire traverse l'atmosphère et chauffe le sol ; le sol réémet de l'infrarouge ; les gaz à effet de serre en absorbent une partie et la renvoient vers le bas."
      },
      {
        type: 'qcm',
        q: 'De combien la concentration de CO₂ a-t-elle augmenté depuis 1850 ?',
        choix: ['De 280 à 420 ppm environ, soit +50 %', 'De 100 à 150 ppm', 'Elle n\'a pas changé'],
        reponse: 0,
        explication: "D'environ 280 à plus de 420 parties par million. Les carottes de glace montrent qu'elle était restée entre 180 et 300 ppm pendant 800 000 ans : ni le niveau ni la vitesse n'ont d'équivalent."
      },
      {
        type: 'qcm',
        q: 'Quel argument montre l\'origine humaine du réchauffement actuel ?',
        choix: ['Il fait plus chaud en été', 'La signature chimique du carbone fossile retrouvée dans l\'atmosphère', 'Les volcans sont plus actifs'],
        reponse: 1,
        explication: "La signature isotopique du carbone fossile, à quoi s'ajoutent la chronologie, qui coïncide avec l'ère industrielle, et la quantité émise, qui correspond à l'augmentation observée. C'est la convergence qui fait preuve."
      },
      {
        type: 'qcm',
        q: 'Quelle conséquence l\'absorption de CO₂ a-t-elle sur les océans ?',
        choix: ['Ils deviennent plus salés', 'Ils s\'acidifient', 'Ils gèlent plus vite'],
        reponse: 1,
        explication: "Ils s'acidifient, ce qui fragilise les coquilles et les squelettes calcaires des coraux, des mollusques et de certains planctons. Le service rendu au climat a donc un coût."
      },
      {
        type: 'qcm',
        q: 'Quelle est la différence entre atténuation et adaptation ?',
        choix: ['Aucune', 'Atténuer réduit les émissions, s\'adapter prépare aux effets inévitables', 'Atténuer concerne les pays riches, s\'adapter les pays pauvres'],
        reponse: 1,
        explication: "Les deux sont nécessaires : atténuer sans adapter laisse subir des effets déjà engagés, adapter sans atténuer revient à courir après un problème qui grandit sans cesse."
      },
      {
        type: 'qcm',
        q: 'Qu\'appelle-t-on l\'inertie climatique ?',
        choix: ['Le refus d\'agir', 'Le fait que les effets d\'une décision ne se mesurent que des décennies plus tard', 'La lenteur des vents'],
        reponse: 1,
        explication: "Le CO₂ déjà émis reste des siècles dans l'atmosphère et les océans continuent de se dilater. Attendre d'observer les conséquences pour agir revient donc à garantir qu'elles se produiront."
      }
    ]
  }
,
  'francais/L04': {
    titre: 'La fiction pour interroger le réel : le fantastique',
    items: [
      {
        type: 'qcm',
        q: 'Sur quoi repose le fantastique ?',
        choix: ['La présence d\'un monstre', 'L\'hésitation entre une explication rationnelle et une explication surnaturelle', 'La violence du récit'],
        reponse: 1,
        explication: "L'hésitation. Un texte peut ne contenir aucune créature visible et être parfaitement fantastique, comme Le Horla, où le narrateur ne voit jamais la présence dont il constate les effets."
      },
      {
        type: 'qcm',
        q: 'Une porte s\'ouvre seule. À la fin, on découvre que c\'était le vent. De quel genre s\'agit-il ?',
        choix: ['Fantastique', 'Étrange', 'Merveilleux'],
        reponse: 1,
        explication: "L'étrange : le récit tranche pour une explication rationnelle. S'il affirmait qu'un fantôme l'a ouverte sans que personne ne s'en étonne, ce serait du merveilleux."
      },
      {
        type: 'qcm',
        q: 'Dans un conte de fées, l\'apparition d\'une fée relève :',
        choix: ['du fantastique', 'du merveilleux', 'de l\'étrange'],
        reponse: 1,
        explication: "Du merveilleux : le surnaturel y est admis d'emblée et n'étonne personne. Dans le fantastique, au contraire, il dérange et le personnage cherche désespérément une explication."
      },
      {
        type: 'qcm',
        q: 'Quel test rapide permet d\'identifier le genre d\'un texte ?',
        choix: ['Compter les pages', 'Se demander si le personnage s\'étonne', 'Regarder la date de publication'],
        reponse: 1,
        explication: "Se demander si le personnage s'étonne. S'il ne s'étonne pas, le surnaturel fait partie de l'ordre du monde : c'est du merveilleux. S'il est terrifié et cherche à expliquer, c'est du fantastique."
      },
      {
        type: 'saisie',
        q: 'Quel auteur a écrit « Le Horla » ?',
        reponses: ['maupassant', 'Maupassant', 'guy de maupassant', 'Guy de Maupassant'],
        explication: "Maupassant. Ce journal intime d'un homme persuadé qu'une présence invisible vit chez lui est le modèle du genre : les deux lectures, surnaturel ou folie, tiennent jusqu'à la dernière ligne."
      },
      {
        type: 'qcm',
        q: 'À quel siècle le fantastique se développe-t-il ?',
        choix: ['Au XVII<sup>e</sup>', 'Au XIX<sup>e</sup>', 'Au XX<sup>e</sup>'],
        reponse: 1,
        explication: "Au XIXᵉ siècle, en parallèle du réalisme. Il faut croire au monde rationnel pour qu'une entorse à ses lois fasse peur : un lecteur du Moyen Âge, qui admettait les miracles, n'aurait pas été troublé."
      },
      {
        type: 'vraifaux',
        q: 'Un récit fantastique doit commencer directement par l\'événement étrange.',
        reponse: false,
        explication: "Faux, et c'est l'erreur la plus fréquente. Pour qu'un événement paraisse inexplicable, il faut d'abord que le monde paraisse explicable. Plus le début est ordinaire, plus la suite est troublante."
      },
      {
        type: 'qcm',
        q: 'Quelle est la première étape d\'une gradation fantastique ?',
        choix: ['Un fait indéniable', 'Une sensation vague, un malaise', 'La confrontation'],
        reponse: 1,
        explication: "Une sensation vague. Viennent ensuite un détail anormal encore explicable, une répétition, un fait indéniable, puis la confrontation ou la fuite et la chute."
      },
      {
        type: 'qcm',
        q: 'Pourquoi une série d\'événements est-elle plus efficace qu\'un événement isolé ?',
        choix: ['Parce que c\'est plus long', 'Parce que chaque explication rationnelle devient plus improbable que la précédente', 'Parce que le lecteur s\'habitue'],
        reponse: 1,
        explication: "Un événement isolé peut toujours être balayé par la fatigue ou le hasard. Une série ferme progressivement ces échappatoires : un verre vidé une fois ne signifie rien, un verre vidé chaque nuit sous un linge scellé, si."
      },
      {
        type: 'qcm',
        q: 'Quelle personne et quel point de vue emploie-t-on dans un récit fantastique ?',
        choix: ['Troisième personne, point de vue omniscient', 'Première personne, point de vue interne', 'Deuxième personne'],
        reponse: 1,
        explication: "Première personne et point de vue interne : le lecteur ne sait que ce que sait le narrateur et partage son incertitude. Un narrateur omniscient détruirait immédiatement le doute."
      },
      {
        type: 'qcm',
        q: 'Que révèle un narrateur qui répète « Je ne suis pas fou » ?',
        choix: ['Qu\'il est parfaitement lucide', 'Qu\'il doute de lui-même, ce qui le rend peu fiable', 'Qu\'il ment au lecteur'],
        reponse: 1,
        explication: "L'insistance produit l'effet inverse : un homme sain d'esprit n'éprouve pas le besoin de le répéter. Le lecteur se retrouve alors avec deux lectures possibles, présence réelle ou folie, sans pouvoir choisir."
      },
      {
        type: 'qcm',
        q: 'Laquelle de ces formules est une marque du doute ?',
        choix: ['« Je vis clairement »', '« Il me sembla que »', '« Il était exactement neuf heures »'],
        reponse: 1,
        explication: "« Il me sembla que ». Les autres marques : « j'eus l'impression », « comme si », « peut-être », « une sorte de », « je ne sais quoi ». Un texte fantastique contient très peu d'affirmations nettes."
      },
      {
        type: 'qcm',
        q: 'Quelle phrase fait le plus peur ?',
        choix: ['Un monstre vert à trois yeux apparut dans le couloir.', 'Il y avait quelqu\'un dans le couloir. Je ne distinguais rien, mais je savais qu\'il me regardait.', 'Les deux se valent'],
        reponse: 1,
        explication: "La seconde. Elle laisse le lecteur compléter lui-même, et l'imagination va toujours plus loin qu'une description. Détailler une créature fixe une image précise, donc limitée."
      },
      {
        type: 'qcm',
        q: 'Dans « La Vénus d\'Ille » de Mérimée, quel motif fantastique est employé ?',
        choix: ['Le miroir', 'La statue vivante', 'Le double'],
        reponse: 1,
        explication: "La statue vivante : une Vénus de bronze semble refermer ses doigts sur une bague, avant qu'un homme ne meure écrasé. Le motif joue sur la frontière entre l'inerte et le vivant."
      },
      {
        type: 'qcm',
        q: 'Quelle fin fait basculer un récit dans le merveilleux ?',
        choix: ['« Et je me réveillai : ce n\'était qu\'un rêve »', '« C\'était le fantôme de ma grand-mère »', '« Le verre était de nouveau vide »'],
        reponse: 1,
        explication: "Nommer le fantôme tranche pour le surnaturel : le doute disparaît. « C'était un rêve » ferait au contraire basculer dans l'étrange, en annulant tout ce qui précède."
      },
      {
        type: 'vraifaux',
        q: 'Terminer un récit fantastique par « ce n\'était qu\'un rêve » est une bonne idée.',
        reponse: false,
        explication: "Faux. Cette fin annule tout ce qui précède : le lecteur a été mené en bateau et referme le texte déçu. C'est la fin la plus fréquente dans les rédactions, et la moins efficace."
      },
      {
        type: 'qcm',
        q: 'Quelle est la meilleure chute pour un récit fantastique ?',
        choix: ['Une chute qui explique tout', 'Une chute ouverte qui n\'explique rien', 'Une chute où le héros meurt'],
        reponse: 1,
        explication: "Une chute ouverte. Une explication dissipe le malaise : le lecteur referme le livre soulagé, donc indifférent. Une chute ouverte laisse la question active longtemps après la lecture."
      },
      {
        type: 'qcm',
        q: 'Sous quelle forme « Le Horla » est-il écrit ?',
        choix: ['Un journal intime', 'Une pièce de théâtre', 'Un poème'],
        reponse: 0,
        explication: "Un journal intime, ce qui permet de suivre l'esprit du narrateur jour après jour. Les autres formes typiques du genre sont la lettre, le témoignage écrit et le récit fait à un auditoire."
      },
      {
        type: 'qcm',
        q: 'Dans « La Cafetière » de Gautier, quel motif est employé ?',
        choix: ['L\'objet animé', 'La présence invisible', 'Le rêve'],
        reponse: 0,
        explication: "L'objet animé : les personnages d'une tapisserie descendent danser la nuit. Ce motif rend inquiétant un décor familier : ce qui menace n'est pas un intrus, c'est le mobilier de la pièce."
      },
      {
        type: 'vraifaux',
        q: 'Employer un miroir ou une maison hantée suffit à rendre un texte fantastique.',
        reponse: false,
        explication: "Faux. Aucun motif n'est fantastique en lui-même : ce qui compte, c'est le DOUTE qu'il installe. Un miroir qui parle sans que personne ne s'en étonne relèverait du merveilleux."
      }
    ]
  }
,
  'francais/L08': {
    titre: 'Les temps du récit',
    items: [
      {
        type: 'qcm',
        q: 'Quel temps sert à poser le décor dans un récit ?',
        choix: ['Le passé simple', 'L\'imparfait', 'Le plus-que-parfait'],
        reponse: 1,
        explication: "L'imparfait pose le décor, la durée et les habitudes. Le passé simple raconte les événements qui font avancer l'histoire. Un bon récit alterne les deux en permanence."
      },
      {
        type: 'saisie',
        q: 'Conjugue « finir » à l\'imparfait, troisième personne du singulier.',
        reponses: ['il finissait', 'finissait'],
        explication: "il finissait. On part de « nous finissons », on retire -ons, on ajoute -ait. Cette méthode fonctionne pour tous les verbes sauf « être »."
      },
      {
        type: 'saisie',
        q: 'Conjugue « venir » au passé simple, troisième personne du singulier.',
        reponses: ['il vint', 'vint'],
        explication: "il vint. Les verbes en -in font leur passé simple en -ins, -ins, -int. Au pluriel : ils vinrent, sans d."
      },
      {
        type: 'qcm',
        q: 'Quel est le passé simple de « pouvoir » à la troisième personne du singulier ?',
        choix: ['il pouva', 'il put', 'il pouvit'],
        reponse: 1,
        explication: "il put. C'est un passé simple en -u, comme « il courut », « il voulut », « il eut ». Ces formes courtes s'apprennent par cœur."
      },
      {
        type: 'qcm',
        q: 'Quelle différence entre « je chantai » et « je chantais » ?',
        choix: ['Aucune', 'Le premier est un passé simple, le second un imparfait', 'Le premier est une faute'],
        reponse: 1,
        explication: "Un seul s les distingue à l'écrit, et la différence est presque inaudible à l'oral : c'est ce qui explique la fréquence de l'erreur. Le contexte permet toujours de trancher."
      },
      {
        type: 'qcm',
        q: 'Dans « Chaque été, ils partaient en Bretagne », quelle valeur a l\'imparfait ?',
        choix: ['Description', 'Habitude', 'Action en cours'],
        reponse: 1,
        explication: "L'habitude. L'indice est « chaque été » : il ne s'agit pas d'un été particulier. Les autres indices d'habitude : tous les, souvent, toujours, d'habitude."
      },
      {
        type: 'qcm',
        q: 'Dans « Il entra, salua, s\'assit », quelle valeur a le passé simple ?',
        choix: ['Action en cours', 'Succession d\'actions', 'Habitude'],
        reponse: 1,
        explication: "Une succession : trois actions brèves qui s'enchaînent rapidement. Le passé simple présente chaque action comme achevée et délimitée, ce qui permet de les mettre bout à bout."
      },
      {
        type: 'saisie',
        q: 'Complète : « Il ______ (lire) quand la porte s\'ouvrit. »',
        reponses: ['lisait'],
        explication: "lisait. L'action longue qui sert de cadre est à l'imparfait, l'action brève qui l'interrompt au passé simple. C'est le couple qui structure la quasi-totalité des récits."
      },
      {
        type: 'qcm',
        q: 'Quelle différence de sens entre « Il pleuvait toute la journée » et « Il plut trois jours » ?',
        choix: ['Aucune', 'Le premier présente un cadre, le second un épisode délimité', 'Le second est incorrect'],
        reponse: 1,
        explication: "L'imparfait présente la pluie sans début ni fin marqués, comme un décor. Le passé simple la présente comme un épisode qui a commencé et s'est terminé. Le fait est le même, la présentation change."
      },
      {
        type: 'vraifaux',
        q: 'On peut raconter un récit entièrement à l\'imparfait.',
        reponse: false,
        explication: "Faux, ou du moins c'est un défaut majeur. Tout à l'imparfait, le lecteur attend un événement qui ne vient jamais : le texte piétine. Tout au passé simple, il n'y a plus d'atmosphère."
      },
      {
        type: 'qcm',
        q: 'À quoi sert le plus-que-parfait ?',
        choix: ['À décrire un lieu', 'À exprimer une action antérieure à une autre action passée', 'À raconter l\'avenir'],
        reponse: 1,
        explication: "Il marque l'antériorité et permet de revenir en arrière : « Il ouvrit la lettre. Elle lui avait été envoyée trois mois plus tôt. »"
      },
      {
        type: 'qcm',
        q: 'Comment se construit le plus-que-parfait ?',
        choix: ['Auxiliaire au présent + participe passé', 'Auxiliaire à l\'imparfait + participe passé', 'Auxiliaire au passé simple + infinitif'],
        reponse: 1,
        explication: "Auxiliaire être ou avoir à l'imparfait, suivi du participe passé : il avait mangé, elle était partie, ils s'étaient levés."
      },
      {
        type: 'qcm',
        q: 'Quelle forme est correcte ?',
        choix: ['elle avait mangée', 'elle avait mangé', 'elle était mangé'],
        reponse: 1,
        explication: "elle avait mangé. Avec l'auxiliaire AVOIR, le participe passé ne s'accorde pas avec le sujet. Avec ÊTRE, il s'accorde : elle était partie."
      },
      {
        type: 'qcm',
        q: 'Dans le système du présent, quel temps remplace le plus-que-parfait ?',
        choix: ['Le passé composé', 'L\'imparfait', 'Le futur'],
        reponse: 0,
        explication: "Le passé composé. Correspondances complètes : passé simple → présent de narration, imparfait → présent, plus-que-parfait → passé composé, conditionnel → futur."
      },
      {
        type: 'vraifaux',
        q: 'On peut passer du passé simple au présent au milieu d\'un récit sans raison.',
        reponse: false,
        explication: "Faux. C'est une rupture de temps, l'une des fautes les plus visibles en rédaction. Le lecteur perd ses repères et le correcteur y voit une erreur de conjugaison, pas un effet."
      },
      {
        type: 'qcm',
        q: 'Qu\'est-ce que le présent de narration ?',
        choix: ['Le présent employé pour raconter des faits passés', 'Le présent de l\'indicatif ordinaire', 'Un temps du futur'],
        reponse: 0,
        explication: "C'est l'emploi du présent pour raconter des faits passés, ce qui rend le récit plus vivant. On le trouve dans les manuels d'histoire et les commentaires sportifs."
      },
      {
        type: 'qcm',
        q: 'Quand un basculement au présent de narration est-il réussi ?',
        choix: ['Quand il survient toutes les trois lignes', 'Quand il est rare et placé à un moment de forte tension', 'Quand il est involontaire'],
        reponse: 1,
        explication: "Un procédé de style ne fonctionne que s'il est rare et visiblement assumé. Employé au hasard, il ne se distingue plus d'une faute de conjugaison."
      },
      {
        type: 'qcm',
        q: 'Dans « Quand il arriva, la maison était vide : tout le monde était parti », quel est le temps de « était parti » ?',
        choix: ['Imparfait', 'Plus-que-parfait', 'Passé simple'],
        reponse: 1,
        explication: "Plus-que-parfait. Les trois temps se répartissent sur trois plans : « était parti » avant, « était » pendant, « arriva » l'action du récit elle-même."
      },
      {
        type: 'vraifaux',
        q: 'Le passé simple s\'emploie couramment à l\'oral.',
        reponse: false,
        explication: "Faux. On dit « il est parti », pas « il partit ». C'est un temps littéraire, propre au récit écrit : sa présence signale immédiatement qu'on lit une narration construite."
      },
      {
        type: 'qcm',
        q: 'Comment vérifier la cohérence des temps de son récit ?',
        choix: ['En comptant les lignes', 'En surlignant tous les verbes conjugués et en vérifiant qu\'ils appartiennent au même système', 'En relisant à voix haute uniquement'],
        reponse: 1,
        explication: "Surligner les verbes est la méthode la plus fiable. On vérifie ensuite que chaque imparfait correspond à un décor ou une durée, et chaque passé simple à un événement."
      }
    ]
  }
,
  'histoire-geo/H4': {
    titre: "L'Europe de la révolution industrielle",
    items: [
      {
        type: 'qcm',
        q: 'Dans quel pays commence la révolution industrielle ?',
        choix: ['En France', 'En Angleterre', 'En Allemagne'],
        reponse: 1,
        explication: "En Angleterre, vers 1760. La France et la Belgique suivent vers 1820-1830, l'Allemagne vers 1850. Plusieurs facteurs y convergent : charbon accessible, agriculture productive, capitaux du commerce maritime, stabilité politique."
      },
      {
        type: 'vraifaux',
        q: 'La révolution industrielle est un changement rapide et brutal.',
        reponse: false,
        explication: "Faux. La transformation s'étale sur plus d'un siècle et progresse à des rythmes très différents selon les pays. Le mot « révolution » est justifié par l'ampleur du changement, pas par sa rapidité."
      },
      {
        type: 'saisie',
        q: 'Qui perfectionne la machine à vapeur en 1769 ?',
        reponses: ['watt', 'Watt', 'james watt', 'James Watt'],
        explication: "James Watt. Sa machine transforme la chaleur d'un foyer en mouvement : l'eau chauffée produit de la vapeur qui pousse un piston. C'est le point de départ de toute la mécanisation."
      },
      {
        type: 'qcm',
        q: 'Que change principalement le charbon par rapport à l\'énergie hydraulique ?',
        choix: ['Il est moins cher', 'Il permet d\'installer une usine n\'importe où et de produire jour et nuit', 'Il est plus propre'],
        reponse: 1,
        explication: "Un moulin à eau doit être au bord d'une rivière et s'arrête au gel ou en sécheresse. Une machine à vapeur fonctionne partout et en continu : l'industrie cesse de dépendre de la géographie des cours d'eau."
      },
      {
        type: 'qcm',
        q: 'En quelle année circule la première ligne de chemin de fer ?',
        choix: ['1769', '1825', '1848'],
        reponse: 1,
        explication: "1825, entre Stockton et Darlington. Le train crée une demande énorme de rails, donc d'acier, donc de charbon : l'industrie se nourrit elle-même. C'est l'effet d'entraînement."
      },
      {
        type: 'qcm',
        q: 'Quel effet inattendu le chemin de fer a-t-il eu ?',
        choix: ['Il a imposé une heure unique dans chaque pays', 'Il a fait baisser le prix du charbon', 'Il a supprimé les routes'],
        reponse: 0,
        explication: "Avant lui, chaque ville vivait à son heure solaire locale, ce qui n'avait aucune importance tant que les déplacements étaient lents. Les horaires de train ont exigé que toutes les gares soient à la même heure."
      },
      {
        type: 'qcm',
        q: 'Qu\'est-ce que la division du travail ?',
        choix: ['Le partage des bénéfices', 'La décomposition de la fabrication en gestes simples et répétitifs', 'Le travail en équipes alternées'],
        reponse: 1,
        explication: "Chaque geste est confié à un ouvrier différent. La production augmente massivement et les prix baissent, mais l'ouvrier perd son savoir-faire, son autonomie et la vue du produit fini."
      },
      {
        type: 'qcm',
        q: 'Que possède la bourgeoisie industrielle ?',
        choix: ['Des terres héritées', 'Les moyens de production : usines, machines, capitaux', 'Seulement sa force de travail'],
        reponse: 1,
        explication: "Elle tire ses revenus du PROFIT, et non de la rente foncière comme la noblesse ni du salaire comme les ouvriers. Elle fonde son statut sur la réussite et non sur la naissance."
      },
      {
        type: 'saisie',
        q: 'Comment appelle-t-on l\'ensemble des ouvriers qui ne possèdent que leur force de travail ?',
        reponses: ['prolétariat', 'le prolétariat', 'proletariat'],
        explication: "Le prolétariat. Il doit vendre sa force de travail contre un salaire pour vivre, sans aucune sécurité : ni maladie, ni retraite, ni chômage au XIXᵉ siècle."
      },
      {
        type: 'qcm',
        q: 'Combien d\'heures par jour travaille un ouvrier au milieu du XIX<sup>e</sup> siècle ?',
        choix: ['8 heures', '12 à 15 heures', '10 heures'],
        reponse: 1,
        explication: "12 à 15 heures, six jours sur sept. Le repos hebdomadaire ne devient obligatoire en France qu'en 1906, et la journée de huit heures bien plus tard encore."
      },
      {
        type: 'qcm',
        q: 'Que dit la loi française de 1841 ?',
        choix: ['Elle autorise les syndicats', 'Elle interdit le travail des enfants avant 8 ans', 'Elle instaure le repos hebdomadaire'],
        reponse: 1,
        explication: "C'est la première loi sociale française. Elle limite aussi le travail à 8 heures entre 8 et 12 ans, mais reste longtemps peu appliquée faute d'inspecteurs pour la faire respecter."
      },
      {
        type: 'qcm',
        q: 'Pourquoi les employeurs recherchaient-ils des enfants ?',
        choix: ['Ils travaillaient mieux', 'Ils coûtaient moins cher, obéissaient et se glissaient sous les machines', 'Ils étaient plus nombreux'],
        reponse: 1,
        explication: "Leur petite taille leur permettait de nettoyer les machines SANS LES ARRÊTER, ce qui évitait une perte de production. C'est aussi ce qui explique la fréquence des accidents graves."
      },
      {
        type: 'qcm',
        q: 'Qu\'est-ce que le livret ouvrier ?',
        choix: ['Un manuel de formation', 'Un carnet obligatoire que l\'employeur conserve et sans lequel l\'ouvrier est considéré comme vagabond', 'Un contrat de travail moderne'],
        reponse: 1,
        explication: "Obligatoire en France jusqu'en 1890, c'est un instrument de contrôle des déplacements. L'ouvrier peut être renvoyé sans motif, mais il ne peut pas partir librement : la liberté est à sens unique."
      },
      {
        type: 'qcm',
        q: 'Manchester passe de 75 000 habitants en 1801 à plus de 300 000 en 1851. Par combien la population est-elle multipliée ?',
        choix: ['Par deux', 'Par quatre', 'Par dix'],
        reponse: 1,
        explication: "Par quatre, en cinquante ans. L'industrie attire la main-d'œuvre, l'exode rural la fournit, et la ville ainsi grandie attire de nouvelles industries : le mécanisme s'auto-entretient."
      },
      {
        type: 'qcm',
        q: 'Pourquoi les épidémies de choléra frappent-elles d\'abord les quartiers ouvriers ?',
        choix: ['Les ouvriers sont plus fragiles par nature', 'Ces quartiers n\'ont ni égouts ni eau potable et sont surpeuplés', 'Le climat y est différent'],
        reponse: 1,
        explication: "Le choléra se transmet par l'eau souillée. L'épidémie révèle une inégalité d'ÉQUIPEMENT, pas une différence de nature. Elle finira par atteindre les quartiers riches, ce qui déclenchera les travaux d'assainissement."
      },
      {
        type: 'qcm',
        q: 'Une espérance de vie ouvrière de 17 ans signifie :',
        choix: ['que les ouvriers mouraient vers 17 ans', 'que la mortalité infantile très élevée fait chuter la moyenne', 'que le chiffre est faux'],
        reponse: 1,
        explication: "Une espérance de vie moyenne n'est pas un âge au décès. Si une part importante des enfants meurt avant cinq ans, la moyenne s'effondre même si les survivants atteignent quarante ou cinquante ans."
      },
      {
        type: 'qcm',
        q: 'Quelle est la première forme de révolte ouvrière au début du siècle ?',
        choix: ['La grève générale', 'Le bris de machines', 'La création de partis'],
        reponse: 1,
        explication: "Le bris de machines, ou luddisme : la machine est d'abord perçue comme la cause du chômage. L'action se déplacera ensuite vers la grève puis l'organisation permanente."
      },
      {
        type: 'qcm',
        q: 'Que réclament les canuts de Lyon en 1831 et 1834 ?',
        choix: ['La suppression des machines', 'Un tarif minimum garanti pour leur travail', 'Le droit de vote'],
        reponse: 1,
        explication: "Un prix plancher pour leur travail. Leur devise, « vivre en travaillant ou mourir en combattant », marque un tournant : ce n'est plus une émeute de la faim mais une revendication professionnelle organisée."
      },
      {
        type: 'saisie',
        q: 'En quelle année les syndicats sont-ils autorisés en France ?',
        reponses: ['1884', 'en 1884'],
        explication: "1884, par la loi Waldeck-Rousseau. Le droit de grève avait été reconnu vingt ans plus tôt, en 1864. Le droit de coalition, supprimé en 1791, aura donc mis soixante-treize ans à être rétabli."
      },
      {
        type: 'qcm',
        q: 'Comment les lois sociales du XIX<sup>e</sup> siècle sont-elles obtenues ?',
        choix: ['Elles sont accordées spontanément par les patrons', 'Elles résultent de mobilisations, d\'enquêtes et de pressions', 'Elles viennent de l\'étranger'],
        reponse: 1,
        explication: "Aucune n'est spontanée. Elles combinent mobilisations ouvrières, enquêtes établissant la réalité des conditions, pressions morales, et un intérêt bien compris de l'État soucieux d'une population en état de travailler."
      }
    ]
  }
,
  'histoire-geo/G3': {
    titre: 'Un monde de migrants',
    items: [
      { type: 'qcm', question: 'Quelle part de l’humanité vit hors de son pays de naissance ?', choix: ['environ 3,5 %', 'environ 15 %', 'environ 30 %', 'environ 50 %'], reponse: 0, explication: 'Environ 280 millions de personnes sur 8 milliards, soit 3,5 %. Plus de 96 % des humains vivent donc dans leur pays de naissance : la migration internationale est un phénomène minoritaire.' },
      { type: 'saisie', question: 'Comment appelle-t-on le départ, vu depuis le pays quitté ?', reponses: ['emigration', 'l’emigration', "l'emigration"], explication: 'L’émigration est le départ vu du pays quitté ; l’immigration est la même arrivée vue du pays d’accueil. C’est le point de vue qui change, pas la personne.' },
      { type: 'vraifaux', question: 'Tout immigré vivant en France est un étranger.', reponse: false, explication: 'Faux. Un immigré est né à l’étranger et vit ici : il peut avoir acquis la nationalité française, et il n’est alors plus étranger. Être immigré dépend du lieu de naissance, être étranger dépend de la nationalité.' },
      { type: 'qcm', question: 'Quel texte définit le statut de réfugié ?', choix: ['la convention de Genève de 1951', 'la déclaration de 1789', 'le traité de Rome de 1957', 'la charte de l’ONU de 1945'], reponse: 0, explication: 'La convention de Genève de 1951 définit le réfugié comme une personne qui a fui son pays par crainte fondée de persécution. C’est un statut juridique, contrairement au mot migrant.' },
      { type: 'vraifaux', question: 'Un demandeur d’asile peut être renvoyé dans son pays pendant l’examen de sa demande.', reponse: false, explication: 'Faux. Le principe de non-refoulement interdit de renvoyer une personne vers un pays où sa vie serait menacée, et il s’applique dès le dépôt de la demande, donc avant même qu’elle soit examinée.' },
      { type: 'qcm', question: 'Combien de personnes environ ont migré à l’intérieur de leur propre pays ?', choix: ['environ 1 milliard', 'environ 50 millions', 'environ 280 millions', 'environ 110 millions'], reponse: 0, explication: 'Environ 1 milliard, soit trois à quatre fois plus que les 280 millions de migrants internationaux. Oublier les migrations internes fausse toute comparaison.' },
      { type: 'qcm', question: 'Un habitant de Guyane s’installe à Marseille. De quelle migration s’agit-il ?', choix: ['interne', 'internationale', 'forcée', 'aucune des trois'], reponse: 0, explication: 'Interne : la Guyane est un département français, aucune frontière d’État n’est franchie, même si la distance dépasse 7 000 kilomètres. Le critère est la frontière, pas la distance.' },
      { type: 'saisie', question: 'Quel pourcentage des réfugiés vit dans des pays à revenu faible ou intermédiaire ? (chiffre seul)', reponses: ['75', '75 %', '75%'], explication: 'Trois réfugiés sur quatre vivent dans des pays à revenu faible ou intermédiaire, le plus souvent voisins du pays qu’ils ont fui. Les pays riches en accueillent une minorité.' },
      { type: 'vraifaux', question: 'La majorité des réfugiés vit dans des camps.', reponse: false, explication: 'Faux. Plus de 60 % des réfugiés vivent en ville, dans des logements ordinaires, souvent précaires. L’image du camp, très présente dans les reportages, ne représente pas la majorité des situations.' },
      { type: 'qcm', question: 'Sur la route qui mène de l’Asie du Sud vers les pays du Golfe, quelle est la cause dominante ?', choix: ['le travail sous contrat', 'la guerre', 'le climat', 'les études'], reponse: 0, explication: 'Des travailleurs indiens, pakistanais, bangladais ou népalais partent sous contrat vers les Émirats, le Qatar ou l’Arabie saoudite, surtout dans le bâtiment et les services.' },
      { type: 'vraifaux', question: 'La route intra-africaine est plus fréquentée que la traversée de la Méditerranée.', reponse: true, explication: 'Vrai. La plupart des migrations africaines se font d’un pays africain vers un autre. La Méditerranée est très visible dans les médias, mais elle concerne une minorité des déplacements.' },
      { type: 'qcm', question: 'Un ami installé depuis cinq ans dans la ville d’arrivée est :', choix: ['un facteur d’attraction', 'un facteur de départ', 'une cause environnementale', 'un statut juridique'], reponse: 0, explication: 'C’est l’effet de réseau, un facteur d’attraction. Il fournit l’information, l’hébergement des premiers mois et les premiers contacts d’embauche : il explique pourquoi les migrations se concentrent sur quelques destinations précises.' },
      { type: 'vraifaux', question: 'Ce sont les plus pauvres qui migrent le plus loin.', reponse: false, explication: 'Faux. Une migration internationale coûte cher : transport, documents, logement des premiers mois. Les plus pauvres migrent surtout à l’intérieur de leur pays, vers la ville la plus proche.' },
      { type: 'qcm', question: 'Quand un pays très pauvre commence à s’enrichir, son émigration :', choix: ['augmente d’abord, puis diminue plus tard', 'diminue immédiatement', 'reste identique', 'disparaît'], reponse: 0, explication: 'Elle augmente d’abord : davantage de familles franchissent le seuil financier qui rend le départ possible. Elle ne recule que lorsque le pays offre des emplois et des services sur place.' },
      { type: 'saisie', question: 'Comment appelle-t-on l’argent que les migrants envoient à leur famille restée au pays ? (deux mots)', reponses: ['transferts de fonds', 'les transferts de fonds', 'transfert de fonds'], explication: 'Les transferts de fonds représentent environ 650 milliards de dollars par an, soit plus du triple de l’aide publique au développement mondiale. Ils financent directement école, santé et logement.' },
      { type: 'qcm', question: 'Qu’appelle-t-on la fuite des cerveaux ?', choix: ['le départ des personnes les plus qualifiées d’un pays', 'le retour des diplômés dans leur pays', 'la formation des migrants à l’arrivée', 'la perte de mémoire des exilés'], reponse: 0, explication: 'C’est le départ des médecins, ingénieurs et chercheurs. Le pays de départ a payé leur formation et ne bénéficie pas de leur travail ; le pays d’arrivée en profite sans avoir payé cette formation.' },
      { type: 'vraifaux', question: 'Le déplacé environnemental dispose d’un statut international reconnu.', reponse: false, explication: 'Faux. Il existe dans les faits mais pas en droit : aucun texte international ne lui reconnaît de statut, car la convention de 1951 ne protège que les personnes fuyant des persécutions.' },
      { type: 'qcm', question: 'En 1990, on comptait 153 millions de migrants pour 5,3 milliards d’habitants, soit 2,9 %. Aujourd’hui, 280 millions pour 8 milliards, soit 3,5 %. Que peut-on conclure ?', choix: ['le nombre a presque doublé mais la part a peu augmenté', 'la part a doublé elle aussi', 'le phénomène a reculé', 'on ne peut rien conclure'], reponse: 0, explication: 'Le nombre brut augmente en grande partie parce que la population mondiale augmente. Rapportée à la population, la migration internationale reste à un niveau proche : 0,6 point de plus en plus de trente ans.' },
      { type: 'qcm', question: 'Quel élément manque le plus au titre « Explosion du nombre de migrants » ?', choix: ['la part dans la population et la période comparée', 'le nom du journaliste', 'une photographie', 'le nom des pays cités'], reponse: 0, explication: 'Un nombre brut augmente mécaniquement quand la population augmente, et « explosion » sur un an ou sur trente ans ne veut pas dire la même chose. Une phrase exacte donne un chiffre, une période et une référence de comparaison.' },
      { type: 'vraifaux', question: 'Les migrations n’apportent que des coûts au pays d’arrivée et que des gains au pays de départ.', reponse: false, explication: 'Faux. Chaque pays gagne sur certains points et perd sur d’autres : le pays de départ reçoit des transferts mais perd ses diplômés, le pays d’arrivée comble des manques de main-d’œuvre mais doit organiser l’accueil.' }
    ]
  }
,
  'anglais-lv1/L04': {
    titre: 'Present perfect',
    items: [
      { type: 'qcm', question: 'Comment se construit le present perfect ?', choix: ['have ou has + participe passé', 'have ou has + infinitif', 'be + participe passé', 'did + verbe'], reponse: 0, explication: 'have ou has, puis le participe passé : I have finished, she has finished. has s’emploie avec he, she, it ; have avec tous les autres sujets.' },
      { type: 'saisie', question: 'Donne le participe passé de « write ».', reponses: ['written'], explication: 'write → wrote au prétérit → written au participe passé. C’est la troisième colonne de la table des irréguliers qu’il faut employer après have.' },
      { type: 'qcm', question: 'Quelle phrase est correcte ?', choix: ['I saw this film yesterday.', 'I have seen this film yesterday.', 'I have saw this film yesterday.', 'I have see this film yesterday.'], reponse: 0, explication: 'yesterday précise un moment passé : le prétérit est obligatoire. Le present perfect n’accepte jamais de complément de temps passé précis.' },
      { type: 'vraifaux', question: 'On peut dire : When have you arrived?', reponse: false, explication: 'Faux. when demande un moment précis, il est incompatible avec le present perfect. La forme correcte est : When did you arrive ?' },
      { type: 'qcm', question: 'Complète : I have lived here ……… 2019.', choix: ['since', 'for', 'during', 'ago'], reponse: 0, explication: '2019 est un point de départ, donc since. for introduirait une durée : for seven years. Le français dit « depuis » dans les deux cas, d’où la confusion.' },
      { type: 'qcm', question: 'Complète : She has worked here ……… six months.', choix: ['for', 'since', 'from', 'by'], reponse: 0, explication: 'six months est une durée, donc for. Le test : si le groupe répond à how long ?, c’est for ; s’il répond à when did it start ?, c’est since.' },
      { type: 'saisie', question: 'Traduis : « J’habite ici depuis cinq ans. » (phrase entière en anglais)', reponses: ['i have lived here for five years', 'i have lived here for five years.', "i've lived here for five years", "i've lived here for five years."], explication: 'Le français emploie le présent, l’anglais exige le present perfect. I live here since five years est doublement faux : mauvais temps et mauvais mot de liaison.' },
      { type: 'vraifaux', question: 'On peut dire : I haven’t never eaten sushi.', reponse: false, explication: 'Faux. never porte déjà la négation : I have never eaten sushi. L’anglais n’accepte qu’une seule négation par phrase.' },
      { type: 'qcm', question: 'Où se place « yet » dans la phrase ?', choix: ['en fin de phrase', 'entre l’auxiliaire et le participe', 'avant le sujet', 'juste après le sujet'], reponse: 0, explication: 'yet va toujours en fin de phrase : Have you finished yet ? I haven’t finished yet. Il ne s’emploie qu’à l’interrogative et à la négative.' },
      { type: 'qcm', question: 'Que signifie : I have just arrived.', choix: ['je viens d’arriver', 'j’arrive juste à l’heure', 'j’arriverai bientôt', 'je suis arrivé seul'], reponse: 0, explication: 'just traduit le français « venir de », qui n’a pas d’équivalent direct en anglais. Il se place entre l’auxiliaire et le participe passé.' },
      { type: 'qcm', question: 'Dans « He’s broken his arm », que signifie ’s ?', choix: ['has', 'is', 'was', 'does'], reponse: 0, explication: 'broken est un participe passé, donc ’s = has. Le test est toujours le même : un participe passé après ’s indique has ; un adjectif ou un groupe nominal indique is.' },
      { type: 'vraifaux', question: '« He has gone to London » signifie qu’il est revenu.', reponse: false, explication: 'Faux. He has gone to London : il est parti et il y est encore. He has been to London : il y est allé et il est revenu. C’est la seule différence, mais elle change tout.' },
      { type: 'qcm', question: 'Quelle est la bonne réponse courte à « Have you finished ? »', choix: ['Yes, I have.', 'Yes, I have finished.', 'Yes.', 'Yes, I do.'], reponse: 0, explication: 'La réponse courte reprend l’auxiliaire seul. Répéter le verbe entier est lourd, et Yes tout seul sonne brusque en anglais.' },
      { type: 'saisie', question: 'Donne le participe passé de « buy ».', reponses: ['bought'], explication: 'buy → bought → bought : le prétérit et le participe passé sont identiques, comme pour think, bring, find et meet.' },
      { type: 'qcm', question: 'Quelle phrase dit que les clés sont encore perdues ?', choix: ['I have lost my keys.', 'I lost my keys yesterday.', 'I was losing my keys.', 'I lose my keys.'], reponse: 0, explication: 'Le present perfect relie le fait passé à maintenant : les clés sont encore perdues, j’ai un problème en ce moment. Le prétérit raconte un épisode clos.' },
      { type: 'qcm', question: 'Où se place « never » ?', choix: ['entre l’auxiliaire et le participe passé', 'en fin de phrase', 'avant have', 'avant le sujet'], reponse: 0, explication: 'I have never been to Japan. Comme already, just et ever, never se glisse entre l’auxiliaire et le participe passé. Seul yet va en fin de phrase.' },
      { type: 'vraifaux', question: 'Le present perfect est un temps du présent.', reponse: true, explication: 'Vrai, son nom le dit. Il ne sert pas à dire quand une chose s’est produite, mais ce qu’il en reste maintenant. C’est pourquoi il refuse tout complément de temps passé précis.' },
      { type: 'qcm', question: 'Corrige : She has arrived yesterday.', choix: ['She arrived yesterday.', 'She has arrive yesterday.', 'She had arrived yesterday.', 'La phrase est correcte.'], reponse: 0, explication: 'yesterday précise le moment, donc prétérit. Retiens la question unique : est-ce que je dis quand ? Si oui, prétérit ; si non, present perfect.' },
      { type: 'saisie', question: 'Traduis : « Elle a déjà mangé. » (phrase entière en anglais)', reponses: ['she has already eaten', 'she has already eaten.', "she's already eaten", "she's already eaten."], explication: 'already s’emploie à l’affirmative et se place entre l’auxiliaire et le participe passé. À l’interrogative ou à la négative, on emploierait yet en fin de phrase.' },
      { type: 'qcm', question: 'Quelle question permet de choisir entre present perfect et prétérit ?', choix: ['est-ce que je dis quand ?', 'est-ce que le verbe est irrégulier ?', 'est-ce que le sujet est au pluriel ?', 'est-ce que la phrase est longue ?'], reponse: 0, explication: 'Si un moment passé est précisé dans la phrase, c’est le prétérit. Sinon, c’est le present perfect. Cette seule question résout plus de neuf cas sur dix.' }
    ]
  }
};
