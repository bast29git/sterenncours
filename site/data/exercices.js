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
};
