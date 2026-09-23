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
      }
    ]
  }
};
