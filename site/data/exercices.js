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
      }
    ]
  }
};
