/* =========================================================================
   planificateur.js : pré-génération du planning de l'année.

   Rythme réel : lundi, mercredi et vendredi de 13 h à 14 h 30, plus deux
   temps de travail personnel courts, le mardi et le jeudi.

   Chaque leçon occupe trois blocs de séance (découverte, application,
   entraînement et bilan). Les matières sont réparties par un tour de rôle
   qui privilégie celle qui a le plus de blocs restants et qui n'était pas
   là la fois précédente : les paires changent d'une séance à l'autre.

   Une séance sur quatre laisse le choix entre trois leçons. Le planning
   reste indicatif et modifiable : c'est une base de départ, pas un contrat.
   ========================================================================= */
(function () {
  'use strict';

  const BLOCS_PAR_LECON = 3;
  const UNE_SUR = 4; // une séance sur quatre propose un choix

  /** Le premier jour de cours de l'année. */
  const RENTREE = '2026-10-05';

  /**
   * Les cinq rendez-vous de la semaine. Le mercredi est le seul créneau dont
   * l'horaire bouge d'une semaine à l'autre : il se règle dans le générateur,
   * et se corrige ensuite séance par séance.
   */
  const CRENEAUX = [
    { jour: 0, code: 'A', type: 'cours', debut: '13:00', fin: '14:30' },
    { jour: 1, code: 'A', type: 'travail', debut: '17:00', fin: '17:20' },
    { jour: 2, code: 'B', type: 'cours', debut: '13:00', fin: '14:30', reglable: true },
    { jour: 3, code: 'B', type: 'travail', debut: '17:00', fin: '17:20' },
    { jour: 4, code: 'C', type: 'cours', debut: '13:00', fin: '14:30' },
  ];

  const TRAVAUX = [
    (titres) => `Cartes de révision sur ${titres}, puis la série d'exercices interactifs. 15 minutes, sur l'ordinateur.`,
    (titres) => `Deux ou trois exercices de la fiche ${titres}. 15 minutes, à la main sur papier.`,
  ];

  const jourIso = (d) => {
    const x = new Date(d);
    x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
    return x.toISOString().slice(0, 10);
  };
  const decaler = (iso, n) => {
    const d = new Date(iso + 'T12:00:00');
    d.setDate(d.getDate() + n);
    return jourIso(d);
  };

  /** File de blocs par matière, dans l'ordre du programme. */
  function files() {
    const sortie = {};
    for (const m of window.PROGRAMME.matieres) {
      const lecons = [...m.lecons].sort((a, b) =>
        (a.periode - b.periode) || a.ref.localeCompare(b.ref, 'fr'));
      sortie[m.id] = {
        nom: m.nom,
        icone: m.icone,
        index: 0,
        restants: lecons.length * BLOCS_PAR_LECON,
        lecons,
        consommes: 0,
        dernier: -99,
      };
    }
    return sortie;
  }

  /** Leçon en cours pour une matière, sans consommer de bloc. */
  const leconCourante = (f) => f.lecons[Math.min(f.index, f.lecons.length - 1)] || null;

  function consommer(f) {
    const l = leconCourante(f);
    if (!l) return null;
    const etape = f.consommes + 1;
    f.consommes += 1;
    f.restants -= 1;
    if (f.consommes >= BLOCS_PAR_LECON) { f.consommes = 0; f.index += 1; }
    return { lecon: l, etape };
  }

  /**
   * Choisit les matières d'une séance : celles qui restent le plus à traiter,
   * en écartant celles vues à la séance précédente tant que c'est possible.
   */
  function candidats(fs, numero, exclure) {
    return Object.entries(fs)
      .filter(([id, f]) => f.restants > 0 && !exclure.includes(id))
      .sort((a, b) => {
        const ecart = b[1].restants - a[1].restants;
        if (ecart !== 0) return ecart;
        return a[1].dernier - b[1].dernier;
      })
      .map(([id]) => id);
  }

  /**
   * @param debut    Le lundi de la première semaine.
   * @param semaines Le nombre de semaines à couvrir.
   * @param options  { mercredi: { debut, fin } } pour décaler le créneau réglable.
   */
  function generer(debut, semaines, options) {
    if (!window.PROGRAMME) throw new Error('Le programme n\'est pas chargé.');
    const reglage = (options && options.mercredi) || null;
    const fs = files();
    const seances = [];
    let numero = 0;

    for (let s = 0; s < semaines; s += 1) {
      const lundi = decaler(debut, s * 7);

      for (const modele of CRENEAUX) {
        const creneau = modele.reglable && reglage
          ? { ...modele, debut: reglage.debut || modele.debut, fin: reglage.fin || modele.fin }
          : modele;
        const date = decaler(lundi, creneau.jour);

        if (creneau.type === 'travail') {
          const precedente = seances.filter((x) => x.type === 'cours' && x.date < date).pop();
          const titres = precedente && precedente.lecons.length
            ? precedente.lecons.map((r) => titreDe(r)).filter(Boolean).join(' et ')
            : 'la dernière leçon';
          seances.push({
            date, creneau: creneau.code, type: 'travail',
            debut: creneau.debut, fin: creneau.fin,
            matieres: precedente ? precedente.matieres : [],
            lecons: precedente ? precedente.lecons : [],
            choix: [],
            objectif: 'Travail personnel',
            travail: TRAVAUX[creneau.jour === 1 ? 0 : 1](titres),
          });
          continue;
        }

        // La toute première séance : on fait connaissance, on visite
        // l'application, on fait le point de départ ; puis un premier bloc
        // de français. Ni maths, ni histoire, ni sciences ce jour-là.
        if (numero === 0 && fs.francais) {
          const pris = consommer(fs.francais);
          if (pris) {
            fs.francais.dernier = numero;
            seances.push({
              date, creneau: creneau.code, type: 'cours',
              debut: creneau.debut, fin: creneau.fin,
              matieres: ['francais'],
              lecons: ['module/decouverte', 'module/positionnement', 'francais/' + pris.lecon.ref],
              choix: [],
              objectif: 'Faire connaissance · Où j\'en suis · ' + pris.lecon.titre + ' (' + pris.etape + '/' + BLOCS_PAR_LECON + ')',
              travail: null,
            });
            numero += 1;
            continue;
          }
        }

        const precedente = seances.filter((x) => x.type === 'cours').pop();
        const dejaVues = precedente ? precedente.matieres : [];

        let liste = candidats(fs, numero, dejaVues);
        if (liste.length < 2) liste = candidats(fs, numero, []);
        if (!liste.length) continue;

        const retenues = liste.slice(0, 2);
        const lecons = [];
        const matieres = [];
        const titres = [];
        for (const id of retenues) {
          const pris = consommer(fs[id]);
          if (!pris) continue;
          fs[id].dernier = numero;
          lecons.push(id + '/' + pris.lecon.ref);
          matieres.push(id);
          titres.push(`${pris.lecon.titre} (${pris.etape}/${BLOCS_PAR_LECON})`);
        }

        // Une séance sur quatre : trois leçons possibles pour la deuxième moitié.
        let choix = [];
        if (numero % UNE_SUR === UNE_SUR - 1 && lecons.length === 2) {
          const autres = candidats(fs, numero, retenues).slice(0, 2);
          if (autres.length === 2) {
            choix = [lecons[1], ...autres.map((id) => {
              const l = leconCourante(fs[id]);
              return l ? id + '/' + l.ref : null;
            })].filter(Boolean);
            if (choix.length < 3) choix = [];
          }
        }

        seances.push({
          date, creneau: creneau.code, type: 'cours',
          debut: creneau.debut, fin: creneau.fin,
          matieres, lecons, choix,
          objectif: titres.join(' · '),
          travail: null,
        });
        numero += 1;
      }
    }

    const restants = Object.values(fs).reduce((n, f) => n + Math.max(0, f.restants), 0);
    return { seances, restants };
  }

  function trouver(ref) {
    const [mid, r] = String(ref).split('/');
    const m = window.PROGRAMME.matieres.find((x) => x.id === mid);
    const l = m && m.lecons.find((x) => x.ref === r);
    return m && l ? { m, l } : null;
  }
  function titreDe(ref) { const t = trouver(ref); return t ? t.l.titre : null; }

  window.PLANIFICATEUR = { generer, CRENEAUX, BLOCS_PAR_LECON, RENTREE };
})();
