# sterenncours : Conventions de travail

Supports de cours **4ème** préparés par Bastien pour **Sterenn**.
Le niveau d'exigence intellectuelle est celui du programme officiel ; c'est la **forme** qui s'adapte, jamais le fond.

**Règle de discrétion.** Aucun document produit ne nomme de diagnostic, de trouble ou de profil médical, ni en clair ni par allusion. Les aménagements sont présentés comme des **choix de conception pédagogique**, rien d'autre. Cela vaut pour les fiches, le site, les titres de fichiers et les messages de commit.

Objectif de validation : les **acquis officiels du cycle 4 (4ᵉ)**, par matière, avec évaluations notées et positionnement sur les compétences du socle commun.

---

## 1. Architecture du dépôt

```
00-pilotage/        Vue d'ensemble : synthèse du programme, cadre pédagogique,
                    progression annuelle, journal de séances
matieres/<matiere>/ Un dossier par matière, puis un dossier par leçon
  L01-<slug>/
    1-cours.md        Fiche de Cours Complète
    2-revision.md     Fiche de Révision
    3-exercices.md    Exercices Corrigés
    4-evaluation.md   Grille d'Évaluation
outils/             Outils complémentaires (méthodo, aides visuelles, suivi)
site/               Mini-sites interactifs (HTML autonome, un dossier par sujet)
theme/              Design system : CSS d'impression + gabarits
build/              Chaîne de build Markdown → HTML → PDF
public/             Sortie générée (non versionnée)
```

Matières couvertes : `maths`, `francais`, `physique-chimie`, `svt`,
`histoire-geo`, `emc`, `anglais-lv1`, `espagnol-lv2`.

## 1 bis. Sources de vérité

- **`00-pilotage/programme.json`** : le programme officiel de 4ᵉ et les **69 leçons**
  (matières, thèmes, attendus de fin d'année, compétences, période de traitement).
  Toute nouvelle leçon se déclare **d'abord** ici. Le build échoue si un dossier de
  leçon existe sur le disque sans être déclaré.
- **`site/data/exercices.js`** : la banque d'exercices interactifs, indexée par
  `"<matiere>/<ref>"`.
- Le site et les dossiers par matière sont **entièrement générés** à partir de ces
  deux fichiers plus le contenu Markdown. On ne les édite jamais dans `public/`.

## 2. Le quatuor OBLIGATOIRE par leçon

Aucune leçon n'est « faite » tant que les **4 documents** n'existent pas :

| # | Document | Rôle | Longueur cible |
|---|----------|------|----------------|
| 1 | **Fiche de Cours Complète** | Théorie, définitions, formules, exemples guidés | 5-9 pages A4 |
| 2 | **Fiche de Révision** | Synthèse visuelle, mots-clés, pièges à éviter | 2-3 pages + auto-test |
| 3 | **Exercices Corrigés** | Énoncés progressifs + corrigés détaillés pas à pas | 15-25 exercices, dont un sujet de type devoir |
| 4 | **Grille d'Évaluation** | Critères : Insuffisant / Fragile / Satisfaisant / Très bien | 6-10 critères |

La **Grille d'Évaluation** utilise toujours ces **4 niveaux exacts**, dans cet ordre, avec les codes couleur et pictogrammes du design system (jamais la couleur seule).

## 3. Principes de conception : non négociables

Détail complet dans `00-pilotage/cadre-pedagogique.md`. Les invariants :

1. **Prévisibilité** : tous les documents d'un même type ont exactement la même structure, dans le même ordre. Aucune surprise de mise en page.
2. **Annonce explicite** : chaque fiche commence par `Plan de la fiche`, une durée estimée, et le matériel nécessaire.
3. **Séquençage court** : une idée par bloc, 5 à 7 lignes maximum par bloc, puis un repère visuel. Points de pause `🔁` balisés.
4. **Langage littéral** : pas d'ironie, pas de métaphore non expliquée, pas de sous-entendu, pas de consigne implicite. « Explique » → dire quoi, combien de phrases, avec quels mots.
5. **Consignes atomiques** : une consigne = une action. Les consignes multiples sont numérotées et découpées.
6. **Critères explicites** : l'élève doit pouvoir savoir seul s'il a réussi.
   Toute évaluation dit ce qui est attendu, pas seulement ce qui est demandé.
7. **Charge sensorielle maîtrisée** : fond crème (jamais blanc pur), pas de texte justifié, pas de fond coloré derrière un long texte, pas d'animation automatique, interlignage 1.7.
8. **Redondance du sens** : couleur + pictogramme + libellé texte. Un daltonien ou une impression noir et blanc doivent rester lisibles.
9. **Intérêts personnels** : les énoncés s'appuient en priorité sur les centres d'intérêt de Sterenn (cf. `00-pilotage/cadre-pedagogique.md`).
10. **Pas d'infantilisation** : vocabulaire de 4ème, exigence de 4ème.

## 3 bis. Le portail de cours (`site/`)

Application d'une seule page, sans dépendance ni serveur. Après le build, elle est
**la racine de `public/`** : c'est elle qu'on déploie. Les fiches se lisent
**dans le site**, jamais en ouvrant un PDF ; le PDF reste proposé en téléchargement,
un par matière.
Codes : **`sanka29`** ouvre l'espace de Sterenn, **`babas29`** l'espace professeur.
C'est une **séparation d'usages, pas une protection** : les codes sont lisibles dans
le source de la page. Ne jamais y placer de donnée sensible.

Le suivi des acquis vit dans le `localStorage` du navigateur, avec export et import
JSON. Aucune donnée ne part sur un serveur.

Le build génère `public/data/contenu/<matiere>.js` : le HTML de chaque fiche, son
plan et ses métadonnées, chargé à la demande par le lecteur. On n'écrit jamais dans
`public/`.

**À faire pour chaque leçon livrée** : ajouter sa série d'exercices interactifs dans
`site/data/exercices.js` (12 à 15 questions, types `qcm`, `vraifaux`, `saisie`).
Chaque question porte une **explication rédigée** : une réponse fausse doit apprendre
quelque chose, pas seulement signaler l'erreur.

## 3 ter. Rythme de travail et supports

- **Trois séances par semaine** : lundi, mercredi et vendredi, **13 h à 14 h 30**,
  à la maison ou en visio. Jamais prolongées, même quand ça se passe bien.
  Deux temps de travail personnel entre les cours, mardi et jeudi.
- **Le planning se pré-génère** : `site/planificateur.js` répartit les 69 leçons
  sur l'année (trois blocs par leçon), fait tourner les matières pour qu'aucune
  semaine ne se répète, place les temps de travail personnel, et réserve **une
  séance sur quatre au choix de Sterenn** parmi trois leçons. Tout reste
  modifiable séance par séance dans l'espace professeur.
- **Sur écran avec Bastien, à la main en autonomie.** Chaque exercice porte son
  support en 4ᵉ argument du conteneur : `::: exercice 3 | entrainement | 10 min | ecran`
  ou `| main`. Les rédactions et les exercices d'approfondissement vont **à la main**.
- Le travail personnel, c'est **deux fois 15 minutes** entre deux séances, annoncées,
  jamais sur une notion non vue ensemble.
- Les énoncés s'appuient en priorité sur les **centres d'intérêt de Sterenn**
  (cf. `00-pilotage/cadre-pedagogique.md`, section 10).
- Ce qui est acquis est **nommé précisément, coché devant elle, puis rappelé** la
  séance suivante. La valorisation porte sur l'acquis, jamais sur l'effort supposé.

## 4. Rédaction du contenu

- **Français**, vouvoiement jamais : on s'adresse à Sterenn en **tutoiement**, ton calme, direct, factuel et encourageant sans excès.
- Tous les calculs, dates, formules et corrigés sont **vérifiés** avant commit.
- Les corrigés sont **détaillés pas à pas**, jamais un simple résultat.
- Chaque exercice porte un **niveau** : `Application` → `Entraînement` → `Approfondissement`.
- Les pictogrammes viennent du **lexique fixe** (cf. `theme/README.md`), jamais d'emoji décoratif hors lexique.

## 5. Chaîne de build

```bash
npm install          # une seule fois
npm run build        # Markdown vers HTML, données du site, dossiers par matière
npm run pdf          # PDF : un dossier complet par matière, le pilotage, les outils
npm run pdf:tout     # en plus, un PDF par fiche individuelle
npm run all          # build + pdf
npm run serve        # relecture sur http://localhost:4321
```

Le build **échoue** (`exit 1`) si un front-matter est incomplet, si une clé a absorbé
la ligne suivante, ou si un lien interne est cassé. Ne jamais committer sur un build rouge.

- Rendu HTML : `build/build.mjs` (markdown-it + conteneurs personnalisés).
- PDF : `build/pdf.mjs` via Chromium headless (`--print-to-pdf`), format A4.
- Design system : `theme/cours.css`. **Ne jamais mettre de style en ligne** dans le Markdown : tout passe par les conteneurs `:::` du design system.

## 6. Front-matter obligatoire

Chaque fichier `.md` de contenu commence par un front-matter YAML minimal :

```yaml
---
type: cours | revision | exercices | evaluation | pilotage | outil
matiere: maths
lecon: L01
titre: Le théorème de Pythagore
duree: 45 min
objectifs:
  - Calculer la longueur de l'hypoténuse
competences:
  - Chercher
  - Raisonner
---
```

## 7. Git

- Branche de travail : `claude/amazing-hopper-yzovxz`.
- Messages de commit **en français**, clairs, au présent.
- Un commit par lot cohérent (une leçon complète = un commit, au minimum).
- `npm run build` doit passer **avant** tout commit.
- Push : `git push -u origin <branche>` avec retry/backoff.

## 8. Source de contenu de référence

Le dépôt voisin **bg3s** contient du contenu scolaire déjà rédigé et vérifié :

- `app/src/data/curriculum.ts` : programmes officiels par niveau × matière (14 programmes de 4ème, découpés en séquences).
- `app/public/learning/lecons/4e-*.js` : contenu pédagogique rédigé pour la 4ème.
- `app/src/data/exams.ts` : format d'examens blancs avec barèmes et corrigés.

Ce contenu sert de **socle à réutiliser et à enrichir**, jamais à recopier tel quel :
il doit être ré-adapté au format 4 documents et aux principes de conception ci-dessus.
