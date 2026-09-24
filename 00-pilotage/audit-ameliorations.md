---
type: pilotage
matiere: pilotage
titre: Audit complet et axe d'améliorations
resume: L'état réel d'Opaline au 24 septembre, mesuré sur le code, les tests, les captures et la production, puis 270 améliorations numérotées et priorisées : serveur et technique, espace professeur, espace de Sterenn, jeux 2D, mondes 3D.
duree: Lecture 40 min
niveau: Pilotage
objectifs:
  - Savoir précisément ce qui marche, ce qui manque et ce qui fragilise
  - Disposer d'une liste d'améliorations actionnable, priorisée, avec un ordre de réalisation
  - Décider des prochains lots sans relire tout le code
---

::: plan
1. Méthode et périmètre de l'audit
2. État des lieux chiffré
3. Ce qui fragilise aujourd'hui : les dix points durs
4. Axe A : serveur et technique (60)
5. Axe B : espace professeur (50)
6. Axe C : espace de Sterenn (100)
7. Axe D : jeux 2D (30)
8. Axe E : mondes 3D, qualité et nouveaux mondes (30)
9. Correctifs d'anomalies (hors des 270)
10. Cours à rédiger (hors des 270)
11. Ordre de réalisation proposé
:::

::: info Lecture des codes
Chaque amélioration porte un identifiant, une **priorité** et un **effort**.
✅ : livré et vérifié (build, scénarios, capture). Sans marque : à faire.

**P1** : avant le 5 octobre. **P2** : période 1. **P3** : dans l'année. **P4** : quand tout le reste est fait.
**S** : moins d'une demi-journée. **M** : une à deux journées. **L** : plus de deux journées.
:::

## 1. Méthode et périmètre de l'audit

Trois passes, à chaud puis à froid, sur le dépôt et sur la production.

- **Lecture du code** : 611 lignes de noyau, 1 380 lignes de vue élève, 1 739 lignes de vue professeur, 1 650 lignes de CSS, 22 fonctions serveur, 6 migrations, 72 leçons, 1 480 corrigés, 73 jeux, 102 Mo d'actifs 3D.
- **Scénarios automatisés** : treize parcours Playwright (réglages, tutrice, félicitations, messagerie, exercices, diapositives, choix, accès, semaine, modules, cahier, nouvelles leçons, page Sterenn), joués deux fois, serveur chaud puis relancé.
- **Mesures** : Lighthouse sur le portail, l'accueil élève, une fiche, l'accueil professeur ; audit des 73 jeux en navigateur (erreurs, ressources manquantes, contexte WebGL).
- **Captures** : quarante écrans, ordinateur et mobile, thème clair et sombre.
- **Production** : état de l'API, verrous, sujets d'évaluation, cahiers, modules, tutrice, planning régénéré.

## 2. État des lieux chiffré

::: chiffres
- **72** leçons complètes, quatre documents chacune, 1 451 exercices dont 288 sur écran
- **72** séries interactives, 1 440 questions expliquées
- **73** jeux rattachés, 20 mondes 3D, tous sans erreur au chargement
- **183** séances planifiées du 5 octobre au 17 juin, 26 à choix
- **13** scénarios automatisés verts, 0 erreur JavaScript
- **Lighthouse élève** : accessibilité 96 à 100, performance 74 à 84 en local
- **6** tables de données partagées, toutes créées par migration rejouable
:::

::: retenir Ce qui tient
Le socle est sain : contenu complet, accès décidé et appliqué par le serveur, tutrice qui ne donne pas les réponses, tests qui passent, déploiement automatique à chaque poussée, données sauvegardées avant chaque opération lourde.
:::

## 3. Ce qui fragilise aujourd'hui : les dix points durs

::: piege Les dix points durs, par ordre d'importance
1. **Aucun test dans l'intégration continue** : les treize scénarios vivent dans un dossier de travail hors dépôt. Une régression passe en production sans alerte.
2. **Le suivi des acquis reste manuel** : une leçon n'est validée que si le professeur choisit un niveau ; les séries, les fiches et les jeux n'y contribuent pas. La progression affichée à Sterenn dépend d'un clic.
3. **La rotation des matières se répète** : le générateur alterne maths-histoire et français-physique deux semaines de suite au lieu de faire tourner les huit matières.
4. **Pas de sauvegarde automatique de la base** : une seule sauvegarde manuelle existe (table datée). Une erreur de manipulation effacerait le suivi de l'année.
5. **Le lecteur professeur n'a pas les diapositives** : deux lecteurs divergent, deux fois les corrections à faire.
6. **Les jeux ne parlent pas la langue des fiches** : formes inclusives à point médian, vocabulaire d'un autre produit, aucune référence aux leçons dans les textes des jeux.
7. **L'accueil élève est long** : 5 secondes avant le premier titre en local. Le premier écran attend six fichiers et deux appels.
8. **Aucune limitation de débit sur l'API** : la tutrice a un quota, pas le reste. Un script pourrait remplir la messagerie.
9. **Le mobile n'a pas été conçu, seulement adapté** : la barre de navigation à cinq entrées, le carrousel 3D et les tableaux professeur passent mal sous 400 pixels.
10. **La documentation des décisions est dispersée** : les règles vivent dans CLAUDE.md, le cadre pédagogique et les commentaires. Aucun journal des décisions produit.
:::

## 4. Axe A : serveur et technique (60)

### Fiabilité et données

- ✅ **A1 · P1 · M** Tests dans l'intégration continue. Déplacer les treize scénarios Playwright dans `tests/`, les lancer dans le workflow avant le déploiement, bloquer la mise en ligne s'ils échouent.
- ✅ **A2 · P1 · S** Sauvegarde quotidienne de D1. Un Worker planifié (cron) exporte les tables vers R2 en JSON, conservation trente jours. Pages seul ne sait pas planifier : c'est le premier vrai motif d'un petit Worker à côté.
- ✅ **A3 · P1 · S** Restauration testée. Un script `build/restaurer.mjs` recharge une sauvegarde en local et compare les comptes de lignes.
- ✅ **A4 · P2 · S** Journal d'audit des écritures. Table `journal(quand, qui, quoi, cle, avant, apres)` alimentée par les PUT et PATCH sensibles : suivi, accès, réglages, séances.
- ✅ **A5 · P2 · S** Transactions par lot. Le générateur d'année insère 183 lignes une par une ; passer par `DB.batch` par paquets de cinquante, comme l'horaire.
- ✅ **A6 · P2 · S** (index posés ; les CHECK restent portés par la validation des routes) Contraintes de schéma. `CHECK` sur `suivi.niveau`, `seances.statut`, `seances.type`, `acces.etat` ; index sur `seances(type, date)` et `messages(fil, cree_le)`.
- ✅ **A7 · P2 · M** Migration des clés composites. `resultats.cle` mélange `matiere/ref` et `jeu/id` : ajouter une colonne `genre` et la remplir, pour des requêtes propres.
- ✅ **A8 · P3 · S** (les sessions expirent par TTL ; aucune liste à purger) Purge des sessions expirées dans KV : l'expiration est posée, mais la liste `sessions:` n'est jamais nettoyée si elle existe.
- ✅ **A9 · P2 · S** Verrou d'idempotence sur `/api/seances/lot` : refuser un second lot identique dans la minute, et renvoyer les identifiants créés.
- ✅ **A10 · P3 · M** Export complet de l'année en un fichier (suivi, résultats, messages, profil, séances) depuis l'espace professeur, et import symétrique.

### Sécurité

- ✅ **A11 · P1 · S** Limitation de débit par session sur toutes les routes d'écriture : compteur KV glissant, 60 écritures par minute, réponse 429 lisible.
- ✅ **A12 · P1 · S** Taille maximale du corps des requêtes JSON (32 Ko, 1 Mo pour le lot de séances et la restauration) vérifiée avant `request.json()`.
- ✅ **A13 · P2 · S** En-têtes de sécurité complets : `Content-Security-Policy` réelle (aujourd'hui absente), `Permissions-Policy`, `X-Frame-Options`.
- ✅ **A14 · P2 · S** Rotation du jeton de session à chaque connexion et invalidation des anciens jetons du même rôle sur demande (bouton « Déconnecter partout »).
- ✅ **A15 · P2 · M** Codes d'accès remplaçables sans redéploiement : une clé KV `codes` chiffrée, une page professeur pour les changer, l'ancien code valable dix minutes.
- ✅ **A16 · P3 · S** Validation stricte des types de fichiers déposés par lecture des premiers octets, pas seulement du `content-type` annoncé.
- ✅ **A17 · P3 · S** (macros refusées, 15 Mo ; pas de recompression serveur) Antivirus léger : refuser les documents bureautiques avec macros, limiter les PDF à 15 Mo, images recompressées côté serveur.
- **A18 · P3 · M** Journal des connexions (rôle, heure, empreinte de navigateur tronquée) consultable par le professeur, purge à trente jours.

### Performance

- ✅ **A19 · P1 · S** Réponse `/api/etat` allégée : renvoyer `verrous` et `acces` seulement quand ils changent (empreinte `ETag`), et sonder toutes les 45 secondes au lieu de 25.
- ✅ **A20 · P1 · M** (regroupés et versionnés ; la minification reste à faire) Regrouper `app.js`, `vue-eleve.js`, `messagerie.js`, `tuteur.js` en un seul fichier par rôle au build, minifié, avec empreinte dans le nom pour un cache long.
- ✅ **A21 · P2 · S** `data/programme.js` réduit pour l'élève : retirer `attendus`, `themes`, `competences` (37 Ko dont 12 inutiles à l'écran).
- **A22 · P2 · S** Préconnexion aux polices et sous-ensemble latin uniquement ; envisager d'héberger les quatre polices dans `/theme/` pour supprimer la dépendance externe.
- ✅ **A23 · P2 · M** Service worker de cache : coquille, CSS, scripts, programme et fonds servis hors ligne ; les fiches déjà ouvertes relisibles sans réseau.
- ✅ **A24 · P2 · S** Images d'aurore en AVIF en plus du WebP, et une version 1 280 px pour les écrans moyens.
- **A25 · P3 · M** Fiches par leçon plutôt que par matière : `data/eleve/maths.js` pèse toute la matière ; un fichier par leçon divise le premier chargement d'une fiche par douze.
- **A26 · P3 · S** Compression Brotli vérifiée sur les fichiers `.js` de données (en-têtes `_headers` explicites).

### Architecture et code

- **A27 · P2 · L** Découper `vue-prof.js` (1 739 lignes) en modules par page, chargés à la demande comme `modules.js`.
- **A28 · P2 · M** Un seul lecteur de fiche partagé par les deux rôles (diapositives, page entière, corrigés visibles pour le professeur).
- ✅ **A29 · P2 · S** Un fichier `site/api.js` qui centralise les appels et gère les erreurs réseau avec reprise automatique (une fois, après deux secondes).
- ✅ **A30 · P2 · S** Types documentés : un `site/types.d.ts` décrivant `etat`, séance, message, profil, pour l'éditeur et pour les tests.
- **A31 · P3 · M** Passer les fonctions serveur en modules ES avec un routeur unique et des validateurs partagés (`valider.js`) au lieu de regex répétées.
- ✅ **A32 · P3 · S** Supprimer le code mort hérité de l'autre produit dans `shell.js` et `konstrio.js` (métiers, hub, référents inutilisés).
- ✅ **A33 · P2 · S** Gestion d'erreur unifiée : toute exception serveur renvoie `{ erreur, code }` avec un code stable, affiché tel quel côté client.
- **A34 · P3 · S** Horodatages en heure de Paris pour l'affichage, ISO en base ; une seule fonction de formatage des dates.
- **A35 · P3 · M** Internationalisation minimale des chaînes serveur (messages d'erreur) dans un fichier, pour relecture et cohérence de ton.

### Build et déploiement

- ✅ **A36 · P1 · S** Le build échoue sur les avertissements : un lien cassé ou un conteneur non fermé doit sortir en erreur, pas en avertissement.
- ✅ **A37 · P1 · S** Vérification automatique des tirets longs et des mots interdits par la règle de discrétion dans tout le contenu et le site, au build.
- ✅ **A38 · P2 · S** Vérification du front-matter contre un schéma (types, listes non vides, durée au format attendu).
- ✅ **A39 · P2 · S** Générer les cahiers en PDF au déploiement (`pdf.mjs` sait déjà le faire), un par leçon, en plus de la page imprimable.
- ✅ **A40 · P2 · M** (build, analyse et scénarios sur toute branche ; déploiement réservé aux branches stables, sans base séparée) Prévisualisation de branche : chaque poussée sur une autre branche déploie une adresse de test Pages séparée avec sa propre base D1 locale.
- ✅ **A41 · P3 · S** Rapport de build lisible : nombre de fiches, poids des données, différences avec le build précédent, en commentaire de commit.
- ✅ **A42 · P3 · S** Empreinte des jeux : un fichier `learning/version.json` pour savoir quelle version des jeux est en ligne.

### Tutrice et intelligence artificielle

- ✅ **A43 · P1 · S** Quota par jour et par rôle plutôt que global, et un message clair à Sterenn quand il est atteint.
- ✅ **A44 · P2 · M** Mémoire de séance : Opale reçoit les trois derniers échanges et la liste des fiches ouvertes aujourd'hui, pour des réponses suivies.
- ✅ **A45 · P2 · M** Vérification des faits : sur une question de cours, Opale cite la section de la fiche (titre) d'où vient sa réponse, et le client la surligne.
- ✅ **A46 · P2 · S** Journal des questions posées à Opale, lisible par le professeur (question, mode, contrôle appliqué), pour repérer les points de blocage.
- **A47 · P3 · M** Génération de questions supplémentaires par leçon, relues et validées par le professeur avant d'entrer dans la banque.
- ✅ **A48 · P3 · M** Lecture à voix haute des réponses d'Opale avec la voix du navigateur, coupée par le réglage sons.
- **A49 · P3 · L** Correction assistée des copies déposées : transcription de la photo, proposition de positionnement sur la grille, décision finale au professeur.
- ✅ **A50 · P3 · S** Modèle de repli explicite si le modèle principal échoue (`llama-3.1-8b`), avec mention dans la réponse.

### Observabilité

- ✅ **A51 · P2 · S** Page `/api/sante` (professeur) : état des liaisons, taille des tables, dernière sauvegarde, version déployée, dernier déploiement.
- ✅ **A52 · P2 · S** Compteurs d'usage : fiches ouvertes, séries jouées, jeux lancés, messages, par jour, dans une table `usage`, affichés sur l'accueil professeur.
- ✅ **A53 · P2 · S** Erreurs JavaScript du navigateur remontées au serveur (`POST /api/erreur`, dédoublonnées), listées sur la page santé.
- ✅ **A54 · P3 · S** Temps de réponse des fonctions mesurés et affichés (moyenne sur la journée).
- ✅ **A55 · P3 · S** Alerte par message dans l'espace professeur si un déploiement a échoué ou si la base n'a pas été sauvegardée depuis 48 heures.

### Qualité

- ✅ **A56 · P2 · S** Analyse statique (ESLint, règles simples) dans le build, sur `site/` et `functions/`.
- ✅ **A57 · P2 · S** Tests unitaires des fonctions pures : `calculer` (calculatrice), `formater` (messagerie), `decouperFiche`, `generer` (planificateur), `noteSur100`.
- ✅ **A58 · P2 · S** Test de contrat des API : chaque route appelée avec un corps invalide doit répondre 400 et un message en français.
- **A59 · P3 · S** Vérification de non-régression visuelle : captures de référence par écran, comparaison au pixel près à chaque poussée.
- ✅ **A60 · P3 · S** Journal des décisions (`00-pilotage/decisions.md`) : une entrée datée par choix structurant, pour ne plus le rediscuter.

## 5. Axe B : espace professeur (50)

### Pilotage quotidien

- ✅ **B1 · P1 · M** Accueil recentré sur la séance du jour : ordre du jour minuté, fiches à ouvrir en un clic, exercices 1 à 4 affichés, case « séance faite » et bilan en trois lignes sans quitter l'écran.
- ✅ **B2 · P1 · S** Absence déclarée par Sterenn visible sur l'accueil avec son mot, et bouton « reporter la séance » qui décale les blocs.
- ✅ **B3 · P1 · S** Choix en attente listés sur l'accueil avec le délai restant, et bouton « choisir à sa place » si la date limite est passée.
- ✅ **B4 · P2 · S** Rappel automatique du travail personnel annoncé à la séance précédente, avec case « fait » ou « pas fait, à reprendre ».
- ✅ **B5 · P2 · M** Bilan de séance guidé : trois champs fixes (acquis nommé, à reprendre, prochaine étape) qui alimentent le suivi et le message de fin de séance.
- ✅ **B6 · P2 · S** Message de fin de séance pré-rédigé à Sterenn à partir du bilan, envoyé en un clic, modifiable.

### Suivi des acquis

- ✅ **B7 · P1 · M** Suivi alimenté par les faits : une leçon passe à « fragile » à la première série jouée, « satisfaisant » proposé quand série à 70 %, fiches terminées et devoir rendu ; le professeur confirme d'un clic.
- ✅ **B8 · P1 · S** Positionnement de départ (« Où j'en suis ») affiché dans le suivi, en colonne, à côté du niveau courant.
- ✅ **B9 · P2 · M** Vue par compétence du socle : les critères des grilles agrégés par domaine (D1 à D5), pour le livret.
- ✅ **B10 · P2 · S** Historique par leçon : chaque changement de niveau daté, avec l'auteur et la raison (série, devoir, décision).
- ✅ **B11 · P2 · S** Reprise planifiée : marquer « à reprendre dans trois semaines » crée un temps personnel dans la semaine visée.
- ✅ **B12 · P2 · M** Grille d'évaluation remplissable en ligne : les huit critères de `4-evaluation` cliquables, positionnement de Sterenn et du professeur côte à côte, écart calculé, enregistré dans le suivi.
- ✅ **B13 · P2 · S** Note du devoir saisie sur la copie déposée, liée au fichier et à la leçon.
- ✅ **B14 · P3 · M** Bulletin de période généré : un PDF par période avec niveaux, notes, mots du professeur, à partir des données.
- ✅ **B15 · P3 · S** Courbe d'étoiles par semaine et par matière, pour voir les creux.

### Planning

- ✅ **B16 · P2 · S** Prévisualisation avant génération : les huit premières semaines affichées avec les matières en couleur, puis validation, au lieu d'écrire directement en base.
- ✅ **B17 · P1 · S** Vacances scolaires de la zone saisies une fois, sautées par le générateur, affichées en gris dans le planning.
- ✅ **B18 · P2 · S** Déplacer une séance par glisser-déposer dans la semaine, avec recalcul des blocs.
- ✅ **B19 · P2 · S** Recherche dans le sélecteur de leçons d'une séance : filtre par texte, matières groupées, leçons déjà planifiées signalées.
- ✅ **B20 · P2 · S** Durée des temps personnels réglable dans le générateur (15, 20 ou 30 minutes) et modifiable séance par séance.
- ✅ **B21 · P2 · S** Vue « période » : les cinq périodes en colonnes, les leçons placées, les manques en rouge.
- ✅ **B22 · P3 · S** Export du planning en fichier calendrier (`.ics`) pour le téléphone.
- ✅ **B23 · P3 · M** Séance en visio : lien de réunion enregistré sur la séance, bouton « rejoindre » des deux côtés.

### Contenu et accès

- ✅ **B24 · P1 · S** Ouvrir une évaluation depuis la fiche de leçon, pas seulement depuis la page Accès, avec date de fermeture proposée à J+7.
- ✅ **B25 · P2 · S** Prévisualiser l'écran de Sterenn : un bouton « voir comme elle » qui rend la vue élève d'une leçon avec ses accès réels.
- ✅ **B26 · P2 · S** Modifier une question de série en ligne (texte, réponse, explication), enregistrée comme surcharge en base, relue au build suivant.
- ✅ **B27 · P2 · M** Ajouter une question ou un exercice personnel à une leçon, avec l'un des univers de Sterenn, sans toucher au Markdown.
- ✅ **B28 · P2 · S** Annoter une fiche : notes du professeur par section, visibles de lui seul, pour préparer la séance.
- ✅ **B29 · P3 · S** Filtre « ce que Sterenn a ouvert » dans la liste des matières : fiches lues, séries jouées, dates.
- ✅ **B30 · P3 · S** Recherche plein texte dans les fiches (titre, notions, texte), pas seulement dans les titres.

### Échanges

- ✅ **B31 · P1 · S** Réponse rapide depuis l'accueil : le dernier message de Sterenn et un champ de réponse, sans changer de page.
- ✅ **B32 · P2 · S** Modèles de messages (rappel de travail, encouragement, changement d'horaire) avec variables (date, leçon).
- ✅ **B33 · P2 · S** Envoi différé : rédiger le soir, envoyer à 8 h.
- ✅ **B34 · P2 · S** Copie déposée ouverte en grand avec zoom et rotation, annotation simple (trait, cercle), renvoi annoté.
- ✅ **B35 · P3 · S** Accusé de lecture des félicitations (vu le … à …).

### Réglages et outils

- ✅ **B36 · P2 · S** Réglage « pauses » par fiche plutôt que global, depuis la fiche.
- ✅ **B37 · P2 · S** Modification des codes d'accès depuis les réglages (voir A15).
- ✅ **B38 · P2 · S** Réglage de la sonde et des notifications (délai, sons).
- ✅ **B39 · P3 · S** Thème de l'espace professeur au choix (le contraste a été relevé, la palette reste unique).
- ✅ **B40 · P3 · S** Raccourcis clavier : `g` puis `a` accueil, `g` puis `p` planning, `/` recherche.

### Interface et ergonomie

- ✅ **B41 · P1 · S** Tableaux professeur sur mobile : cartes empilées sous 640 px au lieu de tableaux tronqués (Accès, Suivi).
- ✅ **B42 · P1 · S** Menu latéral réduit à des icônes sur écran moyen, au lieu de disparaître derrière un bouton.
- ✅ **B43 · P2 · S** Fil d'Ariane cliquable partout, retour arrière conservé (aujourd'hui certains « Retour » renvoient à l'accueil).
- ✅ **B44 · P2 · S** États vides utiles : chaque liste vide propose l'action qui la remplit.
- ✅ **B45 · P2 · S** Chargement progressif : squelettes gris au lieu de « Chargement… ».
- ✅ **B46 · P2 · S** Confirmation des suppressions par une phrase à taper (« supprimer ») pour les séances et fichiers, au lieu d'une boîte native.
- ✅ **B47 · P3 · S** Annuler la dernière action pendant dix secondes (bandeau « Annuler ») pour niveaux, accès, félicitations.
- ✅ **B48 · P3 · S** Densité réglable (confortable, compacte) pour les tableaux.
- ✅ **B49 · P3 · S** Impression propre des pages suivi et planning (feuille de style d'impression).
- ✅ **B50 · P3 · S** Page « aide » du professeur : les règles du système en une page (étoiles, verrous, accès, choix, quotas).

## 6. Axe C : espace de Sterenn (100)

### Accueil et navigation

- ✅ **C1 · P1 · S** Accueil en trois blocs fixes, toujours dans le même ordre : « Maintenant » (la séance ou le temps perso du jour), « À faire avant la prochaine fois », « Mes prochains choix ». Le reste descend.
- ✅ **C2 · P1 · S** Le héros dit l'heure qu'il est et le temps restant avant la séance (« dans 2 h 10 »), pas seulement la date.
- ✅ **C3 · P1 · S** Barre de navigation mobile en bas de l'écran, cinq icônes avec libellé, zone de pouce.
- ✅ **C4 · P1 · S** Retour arrière cohérent : chaque écran a un seul bouton de retour, à la même place.
- ✅ **C5 · P2 · S** Fil d'Ariane sur les fiches (Matière › Leçon › Fiche), cliquable.
- ✅ **C6 · P2 · S** Recherche pour Sterenn : une leçon, un mot du cours, un jeu, depuis la barre du haut.
- ✅ **C7 · P2 · S** Raccourcis clavier documentés : flèches dans les fiches, `Échap` partout, `?` pour l'aide.
- ✅ **C8 · P2 · S** Mémoire du dernier écran : rouvrir l'application ramène où elle était, avec une ligne « tu étais ici ».
- **C9 · P3 · S** Mode « une seule chose » : un bouton qui masque tout sauf le bloc en cours (le mode focus du panneau de confort, branché sur nos écrans).
- ✅ **C10 · P3 · S** Page « Aide » écrite pour elle : douze questions, douze réponses de trois lignes.

### Fiches et lecture

- ✅ **C11 · P1 · S** Reprendre où elle en était : la diapositive courante mémorisée côté serveur, pas seulement dans l'onglet.
- ✅ **C12 · P1 · S** « Terminer » une fiche demande une trace : une phrase à écrire (« ce que je retiens ») ou trois cases, enregistrée et visible du professeur.
- ✅ **C13 · P1 · S** Temps de lecture affiché par diapositive et total, à partir de la durée de la fiche.
- ✅ **C14 · P2 · S** Lecture à voix haute par diapositive (voix du navigateur), bouton par bloc, vitesse réglable.
- ✅ **C15 · P2 · S** Surligneur personnel : sélectionner un passage le garde en couleur (turquoise, bleu, violet), enregistré par fiche.
- ✅ **C16 · P2 · S** Notes en marge : une note par diapositive, reprise dans un carnet « Mes notes » par matière.
- ✅ **C17 · P2 · S** Mots difficiles : les mots des blocs « définition » soulignés dans le texte, définition au survol ou au toucher.
- ✅ **C18 · P2 · S** Schémas agrandissables au clic, plein écran, avec zoom.
- ✅ **C19 · P2 · S** Mode « une phrase à la fois » dans la diapositive : le texte s'affiche paragraphe par paragraphe sur demande.
- ✅ **C20 · P2 · S** Largeur de lecture réglable (étroite, normale, large) et interligne à trois crans, dans le confort.
- ✅ **C21 · P2 · S** Les blocs « pause » deviennent actifs : un minuteur de cinq minutes, une phrase pour reprendre.
- **C22 · P3 · S** Résumé de fiche généré en trois phrases par Opale, affiché avant la première diapositive, validé par le professeur.
- **C23 · P3 · S** Comparer deux fiches côte à côte sur grand écran (cours et révision).
- **C24 · P3 · S** Version imprimable d'une fiche depuis l'écran, sans corrigé, mise en page identique au cahier.
- **C25 · P3 · S** Mode nuit chaud (crème sombre) en plus du sombre et du clair.

### Exercices et séries

- ✅ **C26 · P1 · S** Écran de fin de série avec les questions ratées rejouables tout de suite, une par une, avant de revenir.
- ✅ **C27 · P1 · S** Exercices 1 à 4 affichés en « mode séance » : un exercice par écran, chronomètre discret, bouton « on corrige ensemble ».
- ✅ **C28 · P2 · S** Brouillon numérique sous chaque exercice sur écran (zone de texte libre, enregistrée), pour poser les calculs.
- ✅ **C29 · P2 · S** Indice progressif : trois indices par question de série, du plus vague au plus précis, chacun coûte un point de score, jamais l'étoile.
- ✅ **C30 · P2 · S** Répétition espacée : les questions ratées reviennent dans une série « à revoir » à J+2 et J+7, proposée sur l'accueil.
- ✅ **C31 · P2 · S** Cahier à imprimer avec cases à cocher « fait » côté écran, pour suivre ce qui est rendu sur papier.
- **C32 · P2 · S** Photo de la page du cahier rattachée à l'exercice (dépôt par exercice, pas seulement par leçon).
- ✅ **C33 · P2 · S** Série chronométrée facultative avec temps par question suggéré, jamais imposé.
- **C34 · P3 · S** Séries mélangées : dix questions prises dans trois leçons validées, pour entretenir.
- **C35 · P3 · S** Défi du jour : une question par matière, une étoile bonus le vendredi si les cinq jours sont faits.
- **C36 · P3 · M** Exercices à trous et à relier en plus des trois types (nouveau type `associer` et `trous` dans la banque et le lecteur).
- **C37 · P3 · S** Correction commentée à voix haute (audio enregistré par le professeur) sur les exercices du devoir.

### Évaluations

- ✅ **C38 · P1 · S** Écran d'évaluation avec chronomètre visible et alerte à mi-temps, démarré par elle, arrêté par elle.
- ✅ **C39 · P1 · S** Dépôt de copie guidé : trois photos maximum, aperçu, recadrage, envoi en une fois, confirmation.
- ✅ **C40 · P2 · S** Résultat d'évaluation rendu dans l'application : grille remplie par le professeur, mot, note, positionnement, et « ce que je refais ».
- ✅ **C41 · P2 · S** Auto-positionnement avant la correction : elle coche ses huit critères, le professeur voit l'écart.
- **C42 · P3 · S** Annales personnelles : ses évaluations passées relisibles, avec la copie et la correction.

### Étoiles, réussites, motivation

- ✅ **C43 · P1 · S** Étoiles en attente : « il te manque une série pour la prochaine étoile » sur l'accueil, avec le lien.
- ✅ **C44 · P1 · S** Paliers annoncés à l'avance : « à 12 étoiles, tu débloques la palette Faiseuse de livres » (une palette de couleurs par palier).
- ✅ **C45 · P2 · S** Collection d'opales : chaque leçon validée ajoute une opale de la couleur de la matière à une vitrine, une par leçon, 72 au total.
- ✅ **C46 · P2 · S** Série de jours : le compteur de jours consécutifs avec au moins une action, sans pénalité de rupture, juste un « reprise ».
- ✅ **C47 · P2 · S** Bilan de semaine le vendredi : ce qui est acquis, en trois lignes, avec les mots exacts du professeur.
- ✅ **C48 · P2 · S** Fond d'écran débloqué par palier : quatre aurores différentes, la quatrième à cinquante étoiles.
- **C49 · P3 · S** Carte des progrès : les huit planètes s'allument leçon par leçon, visible sur le carrousel.
- **C50 · P3 · S** Défis à deux : un défi proposé par le professeur (« trois séries cette semaine »), accepté ou refusé, une étoile bonus.
- **C51 · P3 · S** Mots du professeur relus dans une page « Mon carnet », classés par matière.

### Messagerie

- ✅ **C52 · P1 · S** Notification visible sans son : point rouge sur l'onglet, titre de page qui change, bandeau doux.
- ✅ **C53 · P2 · S** Brouillon par fil (aujourd'hui un seul brouillon global).
- ✅ **C54 · P2 · S** Message vocal court (30 secondes), transcrit par le navigateur si disponible.
- ✅ **C55 · P2 · S** Envoi programmé pour elle aussi (« envoyer demain matin »).
- ✅ **C56 · P2 · S** Réponse citée : répondre à un message précis, la citation en tête.
- **C57 · P3 · S** Autocollants d'opale : six réactions dessinées dans la charte, en plus des émojis.
- **C58 · P3 · S** Recherche dans les messages.

### Semaine et organisation

- ✅ **C59 · P1 · S** Vue « aujourd'hui » dans la semaine : la journée en grand, les autres réduites, sur mobile.
- ✅ **C60 · P1 · S** Rappel du temps personnel une heure avant (notification navigateur, si acceptée).
- ✅ **C61 · P2 · S** Liste de matériel pour la prochaine séance, prise dans les fiches prévues.
- ✅ **C62 · P2 · S** Temps personnel guidé : un écran qui enchaîne les deux fois quinze minutes avec un minuteur et deux tâches nommées.
- ✅ **C63 · P2 · S** Absence : proposer directement un créneau de remplacement parmi ceux du professeur.
- **C64 · P3 · S** Vue mois pour elle, avec les vacances et les évaluations.

### Choix

- ✅ **C65 · P2 · S** Choix expliqué : chaque option dit en une phrase pourquoi elle est proposée maintenant.
- ✅ **C66 · P2 · S** Aperçu de la fiche au survol de l'option (plan et durée).
- **C67 · P3 · S** Historique de ses choix, et ce qu'ils lui ont rapporté.

### Tutrice Opale

- ✅ **C68 · P1 · S** Opale réagit au contexte sans qu'on lui demande : à l'ouverture d'une fiche, une phrase d'accueil et deux suggestions ; jamais plus.
- ✅ **C69 · P2 · S** Mémoire de fil par leçon : la conversation se retrouve quand on revient sur la même fiche.
- ✅ **C70 · P2 · S** Opale propose « on relit ensemble » : elle affiche la section citée dans son panneau.
- ✅ **C71 · P2 · S** Mode « explique-moi comme à quelqu'un qui découvre » et « explique-moi plus court » : deux boutons sous chaque réponse.
- ✅ **C72 · P2 · S** Calculatrice avec historique et copie du résultat dans le brouillon.
- **C73 · P3 · S** Convertisseur d'unités et tables de conjugaison dans le panneau, hors évaluation.
- **C74 · P3 · S** Avatar d'Opale animé sobrement (clignement, sourire) coupé par le mode calme.

### Accessibilité et confort

- ✅ **C75 · P1 · S** Contrôle de contraste automatique sur les palettes : la variante foncée calculée par palette, vérifiée au build.
- ✅ **C76 · P1 · S** Ordre de focus vérifié sur chaque écran, piège de focus dans les panneaux (Opale, choix, fête).
- **C77 · P2 · S** Annonces vocales cohérentes : une seule région `aria-live` pour tous les bandeaux.
- ✅ **C78 · P2 · S** Taille de police en trois crans dans la barre du haut, sans passer par le panneau.
- ✅ **C79 · P2 · S** Police « lisible » appliquée aussi aux fiches et aux jeux, pas seulement à l'interface.
- **C80 · P2 · S** Réduction des animations respectée dans les jeux 2D (certains ignorent la préférence).
- **C81 · P3 · S** Sous-titres des sons : chaque son d'interface a un équivalent visuel.
- **C82 · P3 · S** Curseur agrandi et règle de lecture dans les diapositives.

### Mobile et performance perçue

- ✅ **C83 · P1 · S** Premier écran en moins de deux secondes : rendu de l'accueil dès `/api/etat`, données secondaires ensuite.
- ✅ **C84 · P1 · S** Squelettes de chargement pour les fiches et les séries.
- ✅ **C85 · P2 · S** Gestes : balayer pour changer de diapositive, tirer pour rafraîchir la semaine.
- **C86 · P2 · S** Installable (manifeste complet, icônes, écran de démarrage), ouverture plein écran sur téléphone.
- ✅ **C87 · P2 · S** Hors ligne : fiches ouvertes relisibles, réponses aux séries mises en file et envoyées au retour du réseau.
- **C88 · P3 · S** Économie de données : fond d'écran désactivable, images différées.

### Identité et plaisir d'usage

- ✅ **C89 · P2 · S** Illustrations d'opale par matière (huit gemmes, une par planète), utilisées dans les tuiles et les fêtes.
- ✅ **C90 · P2 · S** Micro-animations utiles : coche qui se dessine, jauge qui avance, sans rebond ni secousse.
- **C91 · P2 · S** Sons courts et doux, quatre au total, réglables, désactivés par défaut en évaluation.
- ✅ **C92 · P2 · S** Thème de saison : une teinte d'aurore différente par période, annoncée.
- **C93 · P3 · S** Écran de fin de leçon validée : la page qui récapitule les quatre fiches, les étoiles, le mot du professeur.
- **C94 · P3 · S** Fond d'écran choisi parmi les photographies déjà débloquées.

### Données personnelles et confiance

- ✅ **C95 · P1 · S** Page « Ce que l'application sait de moi » : ses données listées, exportables, effaçables sur demande au professeur.
- ✅ **C96 · P2 · S** Ce qui est vu par le professeur marqué d'une icône partout où elle écrit (notes, questions à Opale).
- ✅ **C97 · P2 · S** Suppression d'un message envoyé par erreur dans les cinq minutes.
- **C98 · P3 · S** Historique des connexions visible pour elle (« tu t'es connectée hier à 17 h »).

### Contenu vivant

- ✅ **C99 · P2 · S** Un énoncé sur trois relié à ses univers, vérifié au build par un compteur de mots-clés par leçon (aujourd'hui ce n'est pas mesuré).
- **C100 · P3 · M** Une « fiche curiosité » par matière et par période (les aurores en physique, le papier en histoire, la ville en français), hors programme, sans étoile, pour le plaisir.

## 7. Axe D : jeux 2D (30)

- ✅ **D1 · P1 · S** Écran d'accueil commun aux 53 jeux : titre, leçon servie, durée conseillée, trois consignes, un seul bouton « Jouer ».
- ✅ **D2 · P1 · S** Chaque jeu nomme la leçon qu'il sert dans son écran d'accueil, avec le lien retour vers la fiche.
- ✅ **D3 · P1 · S** Vocabulaire aligné : les mêmes termes que les fiches (côté adjacent, hypoténuse, complément du nom), vérifiés jeu par jeu.
- ✅ **D4 · P1 · S** Étoiles cohérentes : les seuils de score expliqués sur l'écran de fin (« 2 étoiles à partir de 70 % »).
- ✅ **D5 · P2 · S** Clavier complet : chaque jeu jouable sans souris, focus visible, `Échap` pour quitter.
- ✅ **D6 · P2 · S** Tactile : zones de 44 px minimum, pas de survol nécessaire, retour haptique léger si disponible.
- ✅ **D7 · P2 · S** Mode calme respecté : animations réduites, aucun compte à rebours agressif, aucun son sans action.
- ✅ **D8 · P2 · S** Reprise de partie : quitter et revenir retrouve le niveau en cours.
- ✅ **D9 · P2 · S** Écran de fin identique pour tous : score, étoiles, « ce que tu as appris » lié aux notions de la leçon, « rejouer », « revenir à la fiche ».
- ✅ **D10 · P2 · S** Difficulté en trois crans choisie avant de jouer, mémorisée par jeu.
- ✅ **D11 · P2 · S** Explications sur les erreurs : chaque mauvaise réponse dit pourquoi, comme dans les séries.
- ✅ **D12 · P2 · S** Temps de jeu conseillé affiché (« 8 minutes ») et compteur discret.
- ✅ **D13 · P2 · S** Générateurs de questions branchés sur la banque : les jeux de quiz tirent leurs questions de `exercices.js` au lieu de listes internes.
- ✅ **D14 · P2 · M** Cinq jeux nouveaux (livrés : 2d-60 à 2d-64) pour les leçons peu couvertes : cosinus (viser un angle), signaux sonores (retrouver la distance à l'écho), la ville (repérer les procédés), voix passive, conditionnels anglais.
- ✅ **D15 · P2 · S** Chaque jeu 2D testé sur 390 px de large : aucun défilement horizontal, texte lisible.
- ✅ **D16 · P2 · S** Consignes littérales : une action par phrase, pas de « à toi de jouer », le premier geste montré.
- ✅ **D17 · P3 · S** Statistiques par jeu pour le professeur : parties, meilleur score, erreurs fréquentes.
- ✅ **D18 · P3 · S** Défi hebdomadaire sur un jeu tiré au sort parmi les leçons ouvertes.
- **D19 · P3 · S** Jouer avec le professeur : un mode à deux sur le même écran (tour par tour), pour la séance.
- ✅ **D20 · P3 · S** Sons des jeux issus de l'identité sonore commune (quatre sons), volume unique.
- ✅ **D21 · P3 · S** Pause automatique quand l'onglet perd le focus.
- ✅ **D22 · P3 · S** Chargement : un écran d'attente commun avec la progression et un conseil de la leçon.
- ✅ **D23 · P3 · S** Retirer les jeux hors programme de 4ᵉ (ceux rattachés à aucune leçon) ou les ranger dans un onglet « pour le plaisir ».
- ✅ **D24 · P3 · S** Mode révision : un jeu propose seulement les questions déjà ratées en série.
- ✅ **D25 · P3 · S** Résultats envoyés avec le détail (réussites par notion), pas seulement le score.
- ✅ **D26 · P3 · S** Thème visuel unique : palette d'Opaline appliquée aux 53 jeux via `tokens.css`.
- ✅ **D27 · P3 · S** Accessibilité vérifiée automatiquement (axe-core) sur chaque jeu au build.
- ✅ **D28 · P3 · S** Rejouer une partie à l'identique (même tirage) pour comparer deux essais.
- ✅ **D29 · P3 · S** Chaque jeu documente ses notions dans `jeux.js` (aujourd'hui : « apprend » en une phrase, incomplet pour 20 jeux).
- ✅ **D30 · P3 · S** Un « carnet de jeux » côté élève : ce qu'elle a gagné, ce qu'il reste à essayer, par matière.

## 8. Axe E : mondes 3D, qualité et nouveaux mondes (30)

### Qualité de rendu

- ✅ **E1 · P1 · S** Ombres douces partout : activer `shadowMap` avec `PCFSoftShadowMap` sur les sept mondes qui n'en ont pas (01, 04, 09, 10, 13, 15, 20).
- ✅ **E2 · P1 · S** Anticrénelage adaptatif : `setPixelRatio` à 2 sur ordinateur, 1,5 sur téléphone, mesuré par la fréquence d'images (baisser si sous 45 images par seconde).
- **E3 · P2 · S** Correction des couleurs unifiée : `ACESFilmicToneMapping` et exposition réglée monde par monde (aujourd'hui trois réglages différents).
- **E4 · P2 · M** Environnement lumineux réel : une carte HDRI par monde (celles présentes dans `assets/3d/hdri`), au lieu de lumières fixes pour les mondes 05, 08, 13, 16.
- **E5 · P2 · M** Textures en KTX2 compressées avec niveaux de détail : moitié du poids, chargement deux fois plus rapide, surtout pour le système solaire (le plus lourd).
- **E6 · P2 · S** Écran de chargement commun avec barre de progression réelle (nombre de textures) et un fait de la leçon pendant l'attente.
- **E7 · P2 · S** Post-traitement léger : halo sur les lumières (planètes, lampes de labo, néons du centre de données), coupé en mode calme.
- **E8 · P3 · M** Qualité réglable en trois crans dans chaque monde (ombres, résolution, particules), mémorisée.
- **E9 · P3 · S** Brouillard de profondeur et lumière volumétrique simple dans les mondes extérieurs (globe, volcans, écosystème).
- **E10 · P3 · S** Modèles d'organes et de molécules relissés (normales lissées), les facettes sont visibles de près.

### Pédagogie

- ✅ **E11 · P1 · S** Chaque monde commence par « ce que tu vas apprendre », trois phrases, tirées des notions de la leçon.
- **E12 · P1 · S** Les questions des modes « cours » sortent de la banque de la leçon rattachée, pas de listes internes.
- **E13 · P2 · S** Fiche 3D : un bouton « voir la fiche » dans chaque monde ouvre la section correspondante d'Opaline dans un panneau.
- **E14 · P2 · S** Légendes contextuelles : toucher un objet affiche son nom et une phrase de la fiche, sans quitter la vue.
- **E15 · P2 · S** Mode « guidé » où Opale enchaîne les étapes : regarder, nommer, répondre, sans écran libre au départ.
- **E16 · P2 · S** Mesures réelles dans les mondes de physique : la règle et le chronomètre affichent des valeurs exploitables dans un calcul de la fiche.
- **E17 · P3 · S** Journal de bord : ce qu'elle a cliqué et lu dans un monde, résumé à la sortie, envoyé au professeur.

### Nouveaux mondes

- **E18 · P2 · L** Aurore boréale : la Terre, le Soleil, le vent solaire et le champ magnétique ; régler la latitude et voir l'aurore se former ; couleurs selon l'altitude (physique L08, SVT L04).
- **E19 · P2 · L** Atelier de la Faiseuse de livres : fabriquer du papier étape par étape, de la fibre à la feuille, avec les proportions (histoire H4, physique L03).
- **E20 · P2 · L** Apothicairerie : une étagère de plantes, des mélanges, des masses volumiques et des dosages en pourcentage (physique L02, maths L05).
- **E21 · P2 · M** Triangle rectangle en 3D : une échelle contre un mur, l'angle et le cosinus qui changent quand on la déplace (maths L13, L08).
- **E22 · P3 · M** Chambre d'écho : une salle où l'on émet un son et où l'on mesure l'aller-retour, vitesse dans l'air, l'eau, l'acier (physique L09).
- **E23 · P3 · M** La ville au XIXᵉ : un boulevard qu'on parcourt à hauteur d'homme puis vu d'en haut, les deux regards de la leçon (français L11).
- **E24 · P3 · M** Port négrier et routes maritimes : le globe existant enrichi d'une couche « commerce triangulaire » avec dates et volumes (histoire H1).
- **E25 · P3 · M** Volume des pyramides et des cônes : empiler, verser, comparer les volumes en temps réel (maths L10).
- **E26 · P3 · M** Musée des Lumières : une salle avec cinq portraits, un texte court et une question par penseur (histoire H2).
- **E27 · P3 · M** Carte des migrations : flux animés sur le globe, à lire et à commenter (géographie G3).

### Technique des mondes

- ✅ **E28 · P1 · S** Sortie propre : `dispose()` des géométries et textures au retour vers Opaline, pour éviter la fuite de mémoire au deuxième monde ouvert.
- **E29 · P2 · S** Contrôles unifiés : mêmes touches et mêmes gestes dans les vingt mondes, un panneau « commandes » identique.
- **E30 · P2 · S** Mesure de performance envoyée avec le score (images par seconde moyennes, durée de chargement), pour décider des réglages par appareil.

## 9. Correctifs d'anomalies (hors des 270)

Ce qui est cassé ou incohérent se corrige avant d'améliorer. Ces points ne comptent pas comme des améliorations.

- ✅ **K1** Bouton d'accessibilité de la barre du haut : le panneau s'ouvrait puis se refermait aussitôt, le clic remontant jusqu'au document qui ferme le panneau. **Corrigé le 24 septembre.**
- ✅ **K2** Rotation des matières : le générateur alterne maths-histoire et français-physique deux semaines de suite au lieu de faire tourner les huit matières.
- ✅ **K3** Temps personnel affiché « 15 min » dans la semaine de Sterenn pour un créneau de vingt minutes.
- ✅ **K4** Sélecteur de leçons d'une séance sans les modules : éditer la séance du 5 octobre lui ferait perdre « Faire connaissance ».
- ✅ **K5** Fiche de séance professeur : le bloc « Niveaux des leçons » propose un lien vers une leçon `module/…` qui n'existe pas.
- ✅ **K6** Panneau de confort : à la fermeture, le focus va sur le bouton flottant masqué ; il doit revenir sur le bouton de la barre du haut.
- ✅ **K7** Jeux : formes à point médian (« pénalisé·e ») et vocabulaire d'un autre produit dans les textes ; quelques libellés anglais (« Score », « Level ») et des légendes anglaises dans le centre de données et la cyberdéfense.
- ✅ **K8** Évaluation fermée ouverte par son adresse directe : l'écran retombe sur le cours sans message ; dire « pas encore ouverte ».
- ✅ **K9** Thème sombre dans les fiches : les titres de blocs gardent les couleurs foncées du papier (bleu marine, vert foncé) et perdent en contraste.
- ✅ **K10** Planning professeur : les cartes de séance ne montrent pas les modules (seules les matières sont résumées).

## 10. Cours à rédiger (hors des 270)

Les 72 leçons déclarées sont complètes. Les manques ci-dessous dépendent de la progression choisie et se vérifient avec les attendus officiels avant rédaction.

- **Maths** : triangles semblables et théorème de Thalès (souvent traités en 4ᵉ) ; repérage dans l'espace (pavé, cylindre, sphère).
- **Physique-chimie** : lois de l'électricité (intensité et tension dans un circuit en série et en dérivation) si L06 ne les couvre pas entièrement.
- **SVT** : le système nerveux et la commande du mouvement ; nutrition et organisation de l'organisme ; le monde microbien.
- **Français** : lecture d'une œuvre intégrale par période (à choisir parmi ses lectures), avec sa fiche.
- **Anglais et espagnol** : une leçon de compréhension orale par période, appuyée sur des documents authentiques.

## 11. Ordre de réalisation proposé

::: etapes
1. **Avant le 5 octobre** : les correctifs K2 à K10 ; puis A1, A2, A3, A11, A12, A36, A37, A43 ; B1, B2, B3, B7, B8, B17, B24, B31, B41, B42 ; C1 à C4, C11 à C13, C26, C27, C38, C39, C43, C44, C52, C59, C60, C68, C75, C76, C83, C84, C95 ; D1 à D4 ; E1, E2, E11, E12, E28.
2. **Période 1** : le reste des P2 de l'axe C, puis B, puis A ; D5 à D16 ; E3 à E7, E13 à E16, E18 à E21.
3. **Périodes 2 à 5** : les P3, un monde nouveau par période, une fiche curiosité par période.
4. **Fin d'année** : les P4 et le bulletin.
:::

::: retenir Trois règles pour tenir la liste
- Une amélioration livrée est **testée** (scénario ajouté) et **mesurée** (Lighthouse ou compteur) avant d'être cochée.
- Aucun lot ne mélange un axe **technique** et un axe **contenu** : un commit, un axe.
- Chaque semaine, la liste est relue avec ce que Sterenn a réellement utilisé : ce qu'elle n'ouvre pas ne mérite pas d'être amélioré en premier.
:::
