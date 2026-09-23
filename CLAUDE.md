# sterenncours — Conventions de travail

Supports de cours **4ème** préparés par Bastien pour **Sterenn**.
Profil : **TSA sans déficience intellectuelle**. Le niveau d'exigence intellectuelle reste celui du programme officiel ; c'est la **forme** qui s'adapte, jamais le fond.

Objectif de validation : **acquis officiels du cycle 4 (4ème)**, format attendu par le **CNED** (validation des acquis par matière, évaluations notées et grilles de compétences du socle commun).

---

## 1. Architecture du dépôt

```
00-pilotage/        Vue d'ensemble : synthèse du programme, adaptations TSA,
                    référentiel CNED, progression annuelle, journal de séances
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

## 2. Le quatuor OBLIGATOIRE par leçon

Aucune leçon n'est « faite » tant que les **4 documents** n'existent pas :

| # | Document | Rôle | Longueur cible |
|---|----------|------|----------------|
| 1 | **Fiche de Cours Complète** | Théorie, définitions, formules, exemples guidés | 5–9 pages A4 |
| 2 | **Fiche de Révision** | Synthèse visuelle, mots-clés, pièges à éviter | 2–3 pages + auto-test |
| 3 | **Exercices Corrigés** | Énoncés progressifs + corrigés détaillés pas à pas | 15–25 exercices, dont un sujet de type devoir |
| 4 | **Grille d'Évaluation** | Critères : Insuffisant / Fragile / Satisfaisant / Très bien | 6–10 critères |

La **Grille d'Évaluation** utilise toujours ces **4 niveaux exacts**, dans cet ordre, avec les codes couleur et pictogrammes du design system (jamais la couleur seule).

## 3. Adaptations TSA — non négociables

Détail complet dans `00-pilotage/adaptations-tsa.md`. Les invariants :

1. **Prévisibilité** : tous les documents d'un même type ont exactement la même structure, dans le même ordre. Aucune surprise de mise en page.
2. **Annonce explicite** : chaque fiche commence par `Plan de la fiche`, une durée estimée, et le matériel nécessaire.
3. **Séquençage court** : une idée par bloc, 5 à 7 lignes maximum par bloc, puis un repère visuel. Points de pause `🔁` balisés.
4. **Langage littéral** : pas d'ironie, pas de métaphore non expliquée, pas de sous-entendu, pas de consigne implicite. « Explique » → dire quoi, combien de phrases, avec quels mots.
5. **Consignes atomiques** : une consigne = une action. Les consignes multiples sont numérotées et découpées.
6. **Critères explicites** : l'élève doit pouvoir savoir seul s'il a réussi.
   Toute évaluation dit ce qui est attendu, pas seulement ce qui est demandé.
7. **Charge sensorielle maîtrisée** : fond crème (jamais blanc pur), pas de texte justifié, pas de fond coloré derrière un long texte, pas d'animation automatique, interlignage 1.7.
8. **Redondance du sens** : couleur + pictogramme + libellé texte. Un daltonien ou une impression noir et blanc doivent rester lisibles.
9. **Intérêts spécifiques** : les exemples peuvent et doivent s'appuyer sur les centres d'intérêt de Sterenn (cf. `00-pilotage/adaptations-tsa.md`).
10. **Pas d'infantilisation** : vocabulaire de 4ème, exigence de 4ème.

## 4. Rédaction du contenu

- **Français**, vouvoiement jamais : on s'adresse à Sterenn en **tutoiement**, ton calme, direct, factuel et encourageant sans excès.
- Tous les calculs, dates, formules et corrigés sont **vérifiés** avant commit.
- Les corrigés sont **détaillés pas à pas**, jamais un simple résultat.
- Chaque exercice porte un **niveau** : `Application` → `Entraînement` → `Approfondissement`.
- Les pictogrammes viennent du **lexique fixe** (cf. `theme/README.md`), jamais d'emoji décoratif hors lexique.

## 5. Chaîne de build

```bash
npm install          # une seule fois
npm run build        # Markdown → HTML dans public/
npm run pdf          # HTML → PDF A4 prêt à imprimer
npm run all          # les deux
```

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

- `app/src/data/curriculum.ts` — programmes officiels par niveau × matière (14 programmes de 4ème, découpés en séquences).
- `app/public/learning/lecons/4e-*.js` — contenu pédagogique rédigé pour la 4ème.
- `app/src/data/exams.ts` — format d'examens blancs avec barèmes et corrigés.

Ce contenu sert de **socle à réutiliser et à enrichir**, jamais à recopier tel quel :
il doit être ré-adapté au format 4 documents et aux adaptations TSA ci-dessus.
