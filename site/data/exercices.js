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
  }
};
