---
type: pilotage
matiere: pilotage
titre: Améliorations techniques
resume: Quatre cents améliorations livrées, deux cents côté serveur et deux cents côté site, numérotées et rattachées au code. Chaque numéro se retrouve en commentaire dans les fichiers concernés.
duree: 20 min
---

# Améliorations techniques

Deux listes, numérotées, cochées quand la modification est en place et vérifiée par le build, les tests
et une relecture. Les numéros (B pour le serveur, F pour le site) apparaissent en commentaire dans le code.

## Serveur : 200 améliorations (B001 à B200)

### Socle commun et middleware (`functions/_commun.js`, `_valider.js`, `_messages.js`, `_middleware.js`)

- [x] B001 Une erreur serveur ne renvoie plus le détail interne, sauf avec la variable `DEBUG`.
- [x] B002 Une erreur serveur est comptée dans la table des erreurs, dédoublonnée par empreinte.
- [x] B003 Chaque réponse d'API porte un identifiant de requête (`x-request-id`), aussi dans le corps d'un 500.
- [x] B004 Les 500 utilisent un message en français, calme, qui dit quoi faire.
- [x] B005 Une erreur porte le champ fautif (`champ`) en plus du message et du code.
- [x] B006 Validateurs `heure`, `jourSemaine`, `dateHeureIso`.
- [x] B007 Les textes reçus sont débarrassés des caractères de contrôle et des invisibles.
- [x] B008 Un corps non JSON donne `null` proprement, un corps vide donne un objet vide.
- [x] B009 Un corps JSON est borné à 64 Ko même sans en-tête de longueur.
- [x] B010 Validateur `cleFiche` (matière, référence, type de fiche connu).
- [x] B011 Validateur de date-heure ISO, renvoyée normalisée.
- [x] B012 Validateur `clesLecons` (liste dédoublonnée, bornée, sans clé invalide).
- [x] B013 Dix-sept messages serveur de plus dans le catalogue unique (`_messages.js`).
- [x] B014 Une méthode non implémentée sur une route répond 405 en JSON avec l'en-tête `Allow`.
- [x] B015 Une adresse d'API inconnue répond 404 en JSON, jamais la page d'accueil.
- [x] B016 En-tête `Strict-Transport-Security` sur toutes les réponses.
- [x] B017 En-tête `Cross-Origin-Opener-Policy: same-origin`.
- [x] B018 En-tête `Cross-Origin-Resource-Policy: same-origin`.
- [x] B019 Politique de sécurité de contenu : `object-src 'none'`.
- [x] B020 En-tête `X-Robots-Tag: noindex, nofollow, noarchive` partout.
- [x] B021 `Vary: Cookie` sur toute réponse réservée ou non mise en cache.
- [x] B022 Bibliothèque 3D et polices embarquées mises en cache un an (`immutable`), fonds et thème un jour.
- [x] B023 Une adresse de plus de 2048 caractères est refusée (414).
- [x] B024 Une chaîne de requête de plus de 1024 caractères est refusée (414).
- [x] B025 Un chemin qui remonte (`..`), double la barre ou contient un caractère de contrôle est refusé (400).
- [x] B026 Session glissante : une session utilisée est prolongée, au plus une fois par jour, sans changer de jeton.
- [x] B027 La date de dernier renouvellement est conservée dans la session.
- [x] B028 En-tête `Server-Timing` avec la durée de la fonction sur chaque réponse d'API.
- [x] B029 Les lectures d'API sont plafonnées à six cents par minute et par session.
- [x] B030 Un 429 porte toujours `Retry-After`.
- [x] B031 Le compteur de débit est indexé par le jeton déjà lu, sans relire le cookie.
- [x] B032 L'écriture du compteur de débit ne retarde plus la réponse (`waitUntil`).
- [x] B033 La mesure de performance retient la route la plus lente du jour.
- [x] B034 `Content-Language: fr` sur les réponses d'API.
- [x] B035 Les fichiers publics passent sans session pour toutes les méthodes de lecture.
- [x] B036 Une écriture avec un corps non JSON (hors dépôt de fichier) répond 415.
- [x] B037 Une pré-vérification CORS (`OPTIONS`) reçoit 204 sans aucune autorisation d'origine.
- [x] B038 Une écriture portant un en-tête `Origin` étranger est refusée (403).
- [x] B039 Une écriture avec `Sec-Fetch-Site: cross-site` est refusée (403).
- [x] B040 Le 401 du middleware porte un code et un message du catalogue.
- [x] B041 Les 403 du middleware (contenu, évaluation) portent code et message du catalogue.
- [x] B042 En-tête `X-Permitted-Cross-Domain-Policies: none`.
- [x] B043 Toutes les réponses JSON du middleware passent par la même fonction d'en-têtes.
- [x] B044 Un appel d'API de plus de trois secondes est consigné avec sa route dans la table des erreurs.
- [x] B045 Le service worker et la page de version sont servis sans session.

### Sessions, connexion et codes (`connexion.js`, `moi.js`, `deconnexion*`, `codes.js`, `sessions.js`, `version.js`, `sante.js`)

- [x] B046 Les dérivations des deux espaces sont toujours calculées : la durée de la connexion ne révèle rien.
- [x] B047 Un échec de connexion attend un délai qui grandit avec les tentatives.
- [x] B048 Un code refusé porte le code d'erreur `code_inconnu` et le champ `code`.
- [x] B049 La connexion lit son corps par le validateur partagé (415 en amont pour un corps non JSON).
- [x] B050 La session retient un extrait du navigateur et le pays.
- [x] B051 `GET /api/sessions` : le professeur voit les sessions ouvertes (rôle, dates, navigateur, pays).
- [x] B052 `DELETE /api/sessions?id=` : le professeur ferme une session précise.
- [x] B053 La déconnexion est journalisée.
- [x] B054 La déconnexion partout journalise le nombre de sessions fermées.
- [x] B055 Un nouveau code ne peut pas être le code déjà en place.
- [x] B056 Les codes trop faciles (suites, répétitions, mots courants) sont refusés.
- [x] B057 Changer un code peut fermer les sessions ouvertes de cet espace (`fermer_sessions`).
- [x] B058 La santé donne la route la plus lente du jour.
- [x] B059 La santé est calculée au plus une fois par minute (cache KV).
- [x] B060 `/api/moi` annonce la date d'expiration estimée de la session.
- [x] B061 `/api/moi` donne l'heure du serveur et la date de déploiement.
- [x] B062 `POST /api/deconnexion/tout` : révocation globale de toutes les sessions ouvertes.
- [x] B063 La connexion répond avec la date de fin de session.
- [x] B064 Les échecs de connexion sont comptés dans l'usage du jour.
- [x] B065 Sept compteurs d'usage de plus (échecs, farces, scans, fichiers, outils, compagnon, défis).

### Messagerie (`messages.js`, `messages/[id].js`, `messages/nouveaux.js`, `messages/export.js`, `reaction.js`, `etat.js`)

- [x] B066 Pagination vers le passé (`?avant=<iso>`).
- [x] B067 Taille de page bornée (`?limite=`, 1 à 200).
- [x] B068 Filtre par fil côté serveur (`?fil=`).
- [x] B069 Recherche plein texte côté serveur (`?q=`), jokers échappés.
- [x] B070 La réponse dit s'il reste des messages au-delà de la page (`suite`).
- [x] B071 Le texte est nettoyé : retours à la ligne normalisés, lignes vides en trop retirées.
- [x] B072 Le même texte envoyé deux fois en dix secondes est refusé (409, double clic).
- [x] B073 Le contexte est validé (longueur, pas de balise ni de contrôle).
- [x] B074 Une farce doit exister dans la liste fermée des farces.
- [x] B075 Une farce toutes les vingt secondes au plus, par espace.
- [x] B076 Un fil doit être une matière du programme.
- [x] B077 On ne peut pas citer un message différé pas encore visible.
- [x] B078 `PATCH` accepte une liste d'identifiants pour ne marquer que certains messages lus.
- [x] B079 `PATCH` renvoie le nombre de messages marqués.
- [x] B080 Effacer une discussion se fait en un seul lot (réactions puis messages).
- [x] B081 Effacer une discussion est journalisé avec le nombre de messages.
- [x] B082 Retirer un message est journalisé avec le début du texte.
- [x] B083 `GET /api/messages/:id` : un message et ses réactions (lien direct).
- [x] B084 `PATCH /api/messages/:id` : corriger son propre message dans les cinq minutes (`modifie_le`).
- [x] B085 Trois réactions différentes au plus par personne et par message.
- [x] B086 Index `messages (fil, cree_le)`.
- [x] B087 Index `messages (auteur, lu_le)`.
- [x] B088 Index `reactions (message_id)`.
- [x] B089 Index `fichiers (cree_le)` et `fichiers (matiere)`.
- [x] B090 Index `journal (quand)` et `journal (quoi, quand)`.
- [x] B091 Index `suivi_journal (cle, quand)`.
- [x] B092 Index `tuteur_journal (quand)`.
- [x] B093 Index `usage (jour)`.
- [x] B094 Index `felicitations (cree_le)`.
- [x] B095 Index `seances (date, creneau)` et `seances (type, date)`.
- [x] B096 Index `erreurs (derniere)`.
- [x] B097 L'état partagé donne les non lus par fil.
- [x] B098 L'état partagé donne la date du dernier message visible.
- [x] B099 `GET /api/messages/nouveaux` : sonde légère (non lus, dernier message, par fil, nouveaux depuis).
- [x] B100 Un message fait d'espaces ou de caractères invisibles est refusé comme vide.

### Fichiers (`fichiers/index.js`, `fichiers/[id].js`)

- [x] B101 Pagination de la liste (`?avant=`, `suite`).
- [x] B102 Filtre par matière.
- [x] B103 Filtre par famille (image, audio, document).
- [x] B104 Nom de fichier nettoyé : sans chemin, sans caractère de contrôle, borné.
- [x] B105 L'extension doit correspondre au type annoncé.
- [x] B106 Une borne de taille par famille (image 12 Mo, audio 3 Mo, document 15 Mo).
- [x] B107 Quatre-vingts dépôts par jour et par espace.
- [x] B108 La référence de leçon est validée ; une matière suspecte est refusée.
- [x] B109 L'empreinte SHA-256 du contenu est calculée et stockée.
- [x] B110 R2 vérifie l'empreinte à l'écriture (intégrité du transfert).
- [x] B111 Chaque dépôt est journalisé et compté dans l'usage.
- [x] B112 Images, PDF et audio sont servis en ligne (`inline`), le reste en téléchargement.
- [x] B113 `If-None-Match` sur un fichier renvoie 304 sans corps.
- [x] B114 Les demandes de plage (`Range`) sont servies (206), utiles à l'audio.
- [x] B115 Un fichier servi porte une politique de sécurité `sandbox` : aucun script ne s'y exécute.
- [x] B116 La suppression d'un fichier est journalisée.
- [x] B117 `HEAD /api/fichiers/:id` renvoie les en-têtes seuls.
- [x] B118 La liste signale les doublons (même empreinte qu'un fichier plus ancien).
- [x] B119 La liste donne le quota de dépôts du jour.
- [x] B120 La note jointe est nettoyée et bornée.

### Séances (`seances.js`, `seances/[id].js`, `[id]/eleve.js`, `[id]/choix.js`, `lot.js`, `horaire.js`)

- [x] B121 Les matières d'une séance doivent exister au programme.
- [x] B122 Les leçons d'une séance doivent exister au programme (ou être un module).
- [x] B123 Les choix proposés doivent exister au programme.
- [x] B124 Deux séances ne peuvent pas occuper le même créneau du même jour (409).
- [x] B125 Le début précède la fin, dès la création.
- [x] B126 Une date à plus de quatre cents jours est refusée.
- [x] B127 Objectif, travail et bilan sont nettoyés et bornés.
- [x] B128 `du` avant `au`, et une période bornée à quatre cents jours.
- [x] B129 Filtre par type (`?type=`).
- [x] B130 Filtre par statut (`?statut=`).
- [x] B131 La liste couvre deux années pleines (limite relevée de 400 à 1200 lignes).
- [x] B132 Une absence déclarée est journalisée.
- [x] B133 Une absence ne se déclare pas sur un cours passé depuis plus d'un jour ; la date de déclaration est gardée.
- [x] B134 Un temps personnel déplacé ne peut pas chevaucher un cours (409).
- [x] B135 Une séance déjà faite ne se rechoisit pas (409).
- [x] B136 Un choix de leçon est journalisé.
- [x] B137 Un lot signale l'index de la séance fautive et le champ.
- [x] B138 `depuis` du changement d'horaire est une vraie date, et le changement est journalisé.
- [x] B139 Supprimer une séance inexistante répond 404.
- [x] B140 `GET /api/seances/:id` : une séance seule.

### Suivi, résultats, fiches, ouvertures, accès, profil, réglages, félicitations

- [x] B141 Le suivi valide matière et référence par les validateurs partagés, et la leçon doit exister.
- [x] B142 La note de suivi est nettoyée et bornée à cinq cents caractères.
- [x] B143 Un positionnement passe aussi dans le journal d'audit général.
- [x] B144 L'historique d'un suivi accepte `?n=`.
- [x] B145 Un résultat de série vise une leçon du programme, avec un total borné.
- [x] B146 Le détail d'une série (questions ratées, durée) est conservé, borné.
- [x] B147 `DELETE /api/resultats?cle=` : le professeur remet une série à zéro.
- [x] B148 Une fiche terminée a une clé validée (type connu, leçon existante) et n'est comptée qu'une fois.
- [x] B149 Une ouverture vise une leçon du programme.
- [x] B150 Une décision d'accès vise une leçon ou un jeu qui existe.
- [x] B151 Une date de fermeture d'accès déjà passée est refusée.
- [x] B152 Plusieurs décisions d'accès en une requête (`decisions`).
- [x] B153 Le profil est plafonné à cinq cents clés.
- [x] B154 Les clés de profil du professeur sont journalisées.
- [x] B155 `GET /api/profil?prefixe=` filtre les clés.
- [x] B156 `DELETE /api/profil?cle=` efface une clé.
- [x] B157 Une erreur de réglage nomme le réglage fautif.
- [x] B158 Plusieurs réglages en une requête (`reglages`).
- [x] B159 Les réglages portent une empreinte (304) et leurs définitions.
- [x] B160 Une félicitation est nettoyée et bornée à trois cents caractères.
- [x] B161 La matière d'une félicitation doit exister ; le fichier joint doit exister.
- [x] B162 La félicitation et son message miroir sont écrits dans le même lot.
- [x] B163 La liste des félicitations accepte `?n=`.
- [x] B164 Retirer une félicitation retire aussi son message miroir.
- [x] B165 L'usage renvoie les totaux par compteur sur la période.

### Tutrice, jeux, sauvegardes, journal, erreurs, exports

- [x] B166 Un appel au modèle est borné à vingt-cinq secondes.
- [x] B167 L'historique envoyé à Opale est validé et borné à quatre mille caractères.
- [x] B168 Chaque champ du contexte d'Opale est borné (titre, résumé, plan, objectifs, attendues).
- [x] B169 Règle explicite : rien de ce que l'élève écrit ne change les consignes d'Opale.
- [x] B170 Une question identique posée deux fois en dix minutes reçoit la même réponse sans consommer de quota.
- [x] B171 La réponse est nettoyée : sans titre Markdown, sans tiret long, neuf cents caractères au plus.
- [x] B172 La réponse indique le nombre de questions restantes aujourd'hui.
- [x] B173 `GET /api/tuteur` : disponibilité d'Opale et quota du jour.
- [x] B174 Le journal d'Opale est paginé et filtrable (mode, date), avec le compte par contrôle.
- [x] B175 Les outils du professeur (résumé, questions, lecture de copie) ont aussi un délai borné.
- [x] B176 Un score de jeu vise un jeu de la liste générée au build.
- [x] B177 Une partie envoyée deux fois (`partie`) n'est comptée qu'une fois.
- [x] B178 La durée d'une partie est bornée à dix heures.
- [x] B179 L'instantané inclut les journaux (suivi, audit, Opale, usage, erreurs) en lecture.
- [x] B180 L'instantané porte une empreinte SHA-256, vérifiée à la restauration.
- [x] B181 L'instantané décrit le schéma (colonnes de chaque table) et la version du site.
- [x] B182 La restauration n'écrit que les colonnes qui existent et signale les autres.
- [x] B183 La restauration se simule (`simulation`) sans rien écrire.
- [x] B184 Une restauration est journalisée.
- [x] B185 Une sauvegarde est journalisée avec sa taille.
- [x] B186 La liste des sauvegardes donne l'âge de chacune et distingue les filets.
- [x] B187 `GET /api/sante` : chaque liaison est réellement sollicitée, avec sa durée.
- [x] B188 `GET /api/version` : version et date de déploiement, stables dans git.
- [x] B189 Le journal se filtre par nature (`?quoi=`).
- [x] B190 Le journal se filtre par date (`?depuis=`), et donne le compte par nature.
- [x] B191 Le journal purge les entrées de plus de cent quatre-vingts jours.
- [x] B192 Une erreur du navigateur garde sa pile d'appels, bornée.
- [x] B193 Une erreur du navigateur garde la version du site.
- [x] B194 La liste des erreurs accepte `?n=` et `?role=`, avec les totaux.
- [x] B195 `DELETE /api/erreur?empreinte=` efface une seule entrée.
- [x] B196 Les compteurs d'usage de plus de quatre cents jours sont purgés.
- [x] B197 `GET /api/suivi?export=csv` : le suivi complet en CSV.
- [x] B198 `GET /api/messages/export` : la discussion en CSV ou JSON.
- [x] B199 L'empreinte de l'état partagé utilise SHA-256.
- [x] B200 L'état partagé donne l'heure du serveur (décalage d'horloge détectable).

### Suite (B201 et au-delà)

- [x] B201 La limite entre deux farces respecte la durée de vie minimale du stockage clé-valeur (une minute) : l'heure du dernier envoi est comparée à `FARCE_DELAI` ; avant, toute farce répondait 500. Test unitaire sur toutes les durées de vie.

## Site : 200 améliorations (F001 à F200)

### Noyau (`site/app.js`)

- [x] F001 Un appel d'API est borné à vingt secondes, avec un message clair s'il est abandonné.
- [x] F002 Une lecture refusée pour excès de demandes (429) est reprise une fois après le délai annoncé.
- [x] F003 Un 409 (« c'est déjà fait ») a son message doux.
- [x] F004 Un 405 ou un 415 (contrat rompu) a son message et remonte au journal des erreurs.
- [x] F005 L'identifiant de requête du serveur est attaché à l'erreur (`err.requete`).
- [x] F006 Une erreur serveur (5xx) est remontée au journal des erreurs depuis le navigateur, avec son identifiant.
- [x] F007 Le champ fautif nommé par le serveur est attaché à l'erreur (`err.champ`).
- [x] F008 Les messages du bandeau font la queue (trois au plus) au lieu de s'écraser.
- [x] F009 Le bandeau a un bouton de fermeture.
- [x] F010 Le compte à rebours du bandeau s'arrête sous la souris ou le focus.
- [x] F011 La durée d'affichage suit la longueur du message.
- [x] F012 Une erreur JavaScript est remontée avec sa pile d'appels, bornée.
- [x] F013 Une promesse rejetée est remontée avec sa pile aussi, et la version du site.
- [x] F014 Un jour avant la fin de session, une phrase le dit, une fois.
- [x] F015 Toutes les dix minutes, la version en ligne est comparée ; une nouvelle version propose « Recharger ».
- [x] F016 Une horloge d'appareil décalée de plus de cinq minutes est signalée.
- [x] F017 La sonde ne tourne pas quand l'onglet est caché.
- [x] F018 La sonde repart dès que l'onglet redevient visible.
- [x] F019 La sonde ne tourne pas hors ligne.
- [x] F020 Un script qui ne charge pas est retenté une fois.
- [x] F021 Un échec de chargement du fil propose « Réessayer » dans le bandeau.
- [x] F022 Un message du bandeau peut porter une action (Annuler, Réessayer, Lire, Recharger), qui passe devant la file.
- [x] F023 Les messages en attente sont oubliés au changement d'écran (une action en cours reste).
- [x] F024 À la sortie, la file d'écritures hors ligne est vidée : rien ne repart sous l'autre code.
- [x] F025 Une écriture en attente de plus d'un jour n'est plus rejouée.
- [x] F026 Une écriture identique n'attend qu'une fois, avec le rôle qui l'a émise.
- [x] F027 Alt et un chiffre ouvrent Accueil, Matières, Semaine, Jeux, Messages.
- [x] F028 Échap ferme le panneau d'affichage et les menus de la messagerie, et rend le focus.
- [x] F029 Le titre de l'écran est annoncé au lecteur d'écran à chaque changement.
- [x] F030 L'onglet du navigateur nomme l'écran (« Messages · Opaline »).
- [x] F031 Un écran déjà visité reprend son défilement.
- [x] F032 Le mouvement réduit demandé à l'appareil est porté par `<html>`.
- [x] F033 Sans thème enregistré, le thème suit celui de l'appareil.
- [x] F034 Le contraste renforcé demandé à l'appareil est porté par `<html>`.
- [x] F035 Ces préférences sont suivies en direct si elles changent.
- [x] F036 Onglet caché et rappels acceptés : une notification du navigateur pour un nouveau message.
- [x] F037 Une valeur de profil identique à celle connue n'est pas renvoyée au serveur.
- [x] F038 Deux lectures identiques en même temps partagent la même réponse.
- [x] F039 Dates relatives (« il y a 5 min », « hier à 10:42 ») avec la date complète en infobulle.
- [x] F040 Les poids gèrent zéro, kilo, méga et giga.
- [x] F041 Le noyau expose la version chargée et la version du serveur.
- [x] F042 Le code d'accès se montre ou se cache d'un bouton.
- [x] F043 Le champ du code est un mot de passe avec la touche « aller » du clavier tactile.
- [x] F044 L'erreur du portail s'efface dès qu'on retape.
- [x] F045 Au troisième échec, un rappel de la forme du code.

### Coquille, manifeste, service worker, styles globaux

- [x] F046 `color-scheme: light dark` déclaré.
- [x] F047 Une couleur de barre du navigateur par mode (clair, sombre).
- [x] F048 Les polices distantes ne bloquent plus le premier rendu.
- [x] F049 Un message en français sans JavaScript.
- [x] F050 Le champ du code est un champ de mot de passe avec bouton « Voir ».
- [x] F051 Manifeste : identifiant, portée et trois raccourcis (Messages, Semaine, Matières).
- [x] F052 Le service worker met en cache toute la coquille, feuilles calmes et paquets compris.
- [x] F053 Une page hors ligne de secours quand rien n'est en cache.
- [x] F054 Les données de contenu sont revalidées en arrière-plan.
- [x] F055 La page peut demander à une nouvelle version du service worker d'entrer en service.
- [x] F056 Le mouvement réduit porté par `<html>` vaut pour toutes les animations.
- [x] F057 Un même repère de focus partout (épaisseur, décalage, arrondi).
- [x] F058 Sélection de texte lisible dans les trois thèmes.
- [x] F059 Une ancre n'est jamais cachée sous l'en-tête collé.
- [x] F060 La zone de discussion ne fait pas rebondir la page (défilement contenu).
- [x] F061 Pas de zoom involontaire du texte sur téléphone.
- [x] F062 Pas de halo bleu au toucher.
- [x] F063 À l'impression, seul le contenu de la page reste.
- [x] F064 La barre du bas et les boutons flottants respectent la zone sûre des téléphones à encoche.
- [x] F065 Pas de délai de tapotement sur les commandes.
- [x] F066 Toute commande tactile fait au moins 44 pixels sur téléphone.
- [x] F067 Mode couleurs forcées : les cartes gardent un bord, les boutons restent des boutons.
- [x] F068 Contraste renforcé : bordures franches, textes doux plus foncés.
- [x] F069 Les longues listes ne coûtent que ce qui est à l'écran.
- [x] F070 Compteurs et heures gardent leur largeur (chiffres tabulaires).
- [x] F071 Un mot trop long ne déborde jamais d'une bulle ni d'un titre.
- [x] F072 Les contrôles natifs suivent le thème sombre.
- [x] F073 En-têtes de sécurité aussi sur les fichiers statiques (`_headers`).
- [x] F074 Une image ne dépasse jamais son cadre.
- [x] F075 Le bandeau est une région d'état, ou une alerte pour une erreur.

### Espace de Sterenn (`site/vue-eleve.js`, `messagerie.js`, `lecteur.js`, `compagnon.js`)

- [x] F076 Heure relative sur chaque message, date complète en infobulle.
- [x] F077 Des messages du même auteur à moins de cinq minutes se suivent sans répéter l'en-tête.
- [x] F078 Un séparateur « Nouveaux messages » avant le premier message non lu.
- [x] F079 Loin du bas du fil, un bouton ramène au dernier message.
- [x] F080 Les adresses web et les liens internes deviennent cliquables.
- [x] F081 Une image collée dans la zone d'écriture devient une pièce jointe.
- [x] F082 La zone d'écriture grandit avec le texte.
- [x] F083 « Brouillon gardé » quand il y a du texte non envoyé.
- [x] F084 Option « Entrée envoie » retenue sur l'appareil, avec l'aide qui suit.
- [x] F085 Modifier son propre message dans les cinq minutes.
- [x] F086 Retirer un message se fait avec cinq secondes pour annuler.
- [x] F087 Une image s'ouvre dans une visionneuse, pas dans un nouvel onglet.
- [x] F088 Le type d'un document en clair sur la pièce jointe (PDF, DOC…).
- [x] F089 « Voir les messages plus anciens » sans perdre sa place.
- [x] F090 Le fil et la recherche sont filtrés par le serveur.
- [x] F091 Chaque fil montre ses messages non lus.
- [x] F092 Le bouton de farce se met en pause vingt secondes après l'envoi.
- [x] F093 Un clic hors d'un menu de réactions le referme.
- [x] F094 La zone d'écriture est décrite par son aide.
- [x] F095 Près de la limite, le reste de caractères est annoncé au lecteur d'écran.
- [x] F096 Une citation mène au message cité, brièvement surligné.
- [x] F097 Une image jointe réserve sa place avant de charger (pas de saut de page).
- [x] F098 L'accueil propose de reprendre le dernier écran de travail.
- [x] F099 Le message de retrait ne bloque plus les suivants (file du bandeau).
- [x] F100 Le jour courant de la semaine est annoncé (`aria-current`).
- [x] F101 Les jours passés s'estompent par la couleur, sans casser le contraste.
- [x] F102 Une étape validée montre sa date de validation.
- [x] F103 Une barre de progression sous les diapositives.
- [x] F104 Les onglets de fils sont de vrais onglets pour un lecteur d'écran.
- [x] F105 Les fils de discussion se lisent avec leur nombre de non lus.
- [x] F106 Les touches 1 à 4 choisissent une réponse dans une série.
- [x] F107 La durée d'une série est mesurée.
- [x] F108 La durée part avec le résultat.
- [x] F109 Les questions ratées partent avec le résultat.
- [x] F110 Le bilan d'une série redonne l'explication de chaque question ratée.
- [x] F111 Un jeu déjà joué montre son meilleur score.
- [x] F112 Les dernières réussites mènent à la fiche ou à la série concernée.
- [x] F113 Chaque opale se lit au clavier et au lecteur d'écran (titre, validée ou à venir).
- [x] F114 Le carnet et les évaluations ont leur bouton de retour vers Mes réussites.
- [x] F115 Le nom du compagnon est vérifié (1 à 20 caractères, lettres, chiffres, espaces, tirets).
- [x] F116 Le lien vers un message plus ancien que la page prévient au lieu de ne rien faire.
- [x] F117 Une recherche trop courte le dit ; sans résultat, une piste.
- [x] F118 Un long message se replie avec « Voir la suite ».
- [x] F119 Un message corrigé porte la mention « modifié ».
- [x] F120 La vue porte sa route (`data-route`) pour les styles par écran.
- [x] F121 Tout lien qui s'ouvre ailleurs est sans référent.
- [x] F122 Un bloc replié marqué `data-memo` retient s'il était ouvert.
- [x] F123 L'onglet courant de la barre porte `aria-current`.
- [x] F124 Échap ferme le panneau d'affichage et rend le focus au bouton.
- [x] F125 Le panneau d'affichage se ferme d'un clic ailleurs.
- [x] F126 Le compte d'étoiles est annoncé quand il change.
- [x] F127 Le bandeau est une alerte pour une erreur, une région d'état sinon.
- [x] F128 Les actions d'un message gardent un contraste suffisant (plus d'opacité sur du texte).
- [x] F129 Les petits textes en vert passent par une teinte foncée qui tient 4,5 sur les cartes.
- [x] F130 Chaque heure de message est un élément `time` daté.
- [x] F131 Les en-têtes de tableau d'une fiche passent le contraste.
- [x] F132 La pastille de son et l'aide d'envoi ne passent plus par une opacité.
- [x] F133 Un lien dans une bulle garde la couleur du texte de la bulle, souligné.
- [x] F134 Les notes se téléchargent en texte brut, rangées par matière.
- [x] F135 Ce que l'appareil retient d'Opaline s'efface d'un bouton, sans toucher au suivi.
- [x] F136 L'aide liste les nouveaux raccourcis.
- [x] F137 Le badge des non lus de la barre est dit en toutes lettres.
- [x] F138 La barre n'est redessinée que si elle change : le focus n'y est jamais perdu.
- [x] F139 Une notification de l'accueil est une région d'état.
- [x] F140 Les jauges des lignes de matières et de jeux se lisent en toutes lettres.

### Espace professeur (`site/vue-prof.js`, `vue-prof-pages.js`)

- [x] F141 Réglages : les sessions ouvertes, fermeture d'une session, des autres, ou de toutes.
- [x] F142 Journal et santé : chaque liaison est sollicitée à l'instant, avec sa durée.
- [x] F143 Journal d'audit filtrable par nature et par date, avec le compte par nature.
- [x] F144 Erreurs : pile d'appels dépliable, version, effacement d'une seule entrée, totaux.
- [x] F145 Messages : export CSV et JSON de la discussion.
- [x] F146 Messages : « Messages plus anciens ».
- [x] F147 Messages : recherche par le serveur.
- [x] F148 Suivi : CSV du serveur avec les titres de leçons.
- [x] F149 Formulaire de séance : le champ refusé est mis en évidence.
- [x] F150 Un champ nommé par le serveur est encadré, marqué invalide, et reçoit le focus.
- [x] F151 Réglages de sonde et interrupteurs : erreurs affichées avec le champ.
- [x] F152 Le journal des erreurs distingue Sterenn, moi et le serveur.
- [x] F153 Accès : « tout ouvrir » et « tout en auto » pour une leçon, en une requête.
- [x] F154 Dépôts : filtre par famille, fichiers plus anciens, quota du jour, doublons signalés.
- [x] F155 Questions d'Opale filtrables par mode, avec le compte par contrôle.
- [x] F156 Sauvegardes : âge, filets distingués, simulation avant restauration.
- [x] F157 Changer un code peut fermer les sessions ouvertes de cet espace.
- [x] F158 La version déployée et sa date, avec un rappel si la page a chargé une autre version.
- [x] F159 La route la plus lente du jour sur la page santé.
- [x] F160 La liste des sessions est bornée aux quarante plus récentes.
- [x] F161 L'en-tête d'un tableau qui défile reste visible.
- [x] F162 Les longues listes ne coûtent que ce qui est à l'écran.
- [x] F163 Une longue liste de journal défile dans son bloc.
- [x] F164 Modifier son propre message dans les cinq minutes.
- [x] F165 Chaque fil montre ses non lus.
- [x] F166 Plus aucune boîte native : effacer une discussion et restaurer se confirment en tapant le mot.
- [x] F167 Supprimer une séance laisse cinq secondes pour annuler.
- [x] F168 Le dernier maillon du fil d'Ariane porte `aria-current`.
- [x] F169 L'onglet du navigateur nomme la page du pilotage.
- [x] F170 La page Sterenn montre ses dernières ouvertures de l'espace.
- [x] F171 Les erreurs du serveur ont leur filtre.
- [x] F172 La version et la date de déploiement sur la page santé.
- [x] F173 La nouvelle version est proposée au professeur aussi.
- [x] F174 La date de fermeture d'un accès ne peut pas être dans le passé.
- [x] F175 Un créneau déjà pris est refusé avec un message qui le dit.

### Build, tests et exploitation

- [x] F176 Le build vérifie l'équilibre des accolades de chaque feuille de style.
- [x] F177 Le build refuse un identifiant en double dans la coquille.
- [x] F178 Le build vérifie que chaque pictogramme utilisé existe.
- [x] F179 Le build vérifie la banque d'exercices (types, énoncés, explications, réponses).
- [x] F180 Le build vérifie le programme (identifiants, références, titres, périodes).
- [x] F181 Le serveur compte dans la version : un changement de fonction rafraîchit le site.
- [x] F182 Un paquet de plus de 420 Ko est signalé.
- [x] F183 `version.json` porte la date de déploiement.
- [x] F184 Les instructions de débogage ne partent jamais en production.
- [x] F185 Tests unitaires des validateurs serveur.
- [x] F186 Test unitaire de la politique de sécurité de contenu.
- [x] F187 Tests unitaires du nettoyage des noms de fichiers et des familles.
- [x] F188 Test unitaire de la structure (accolades, coquille, banque, programme).
- [x] F189 Scénario de bout en bout : sessions, santé, journal filtré.
- [x] F190 Scénario de bout en bout : correction, retrait annulable, heures relatives.
- [x] F191 Trois écrans de plus dans l'audit visuel (messages, compagnon, journal).
- [x] F192 `npm run verifier:tout` : lint, build et tests unitaires d'un coup.
- [x] F193 Test unitaire du service worker (coquille et page hors ligne).
- [x] F194 Le déploiement joue l'audit d'accessibilité (informatif).
- [x] F195 La sauvegarde nocturne contrôle la santé du site et échoue si une liaison ne répond pas.
- [x] F196 Le validateur d'entier ne confond plus « absent » et zéro (test dédié).
- [x] F197 `_headers` porte HSTS, l'isolation d'origine et l'interdiction d'indexation.
- [x] F198 Le build vérifie que tout fichier de la coquille du service worker existe.
- [x] F199 `npm run audit:a11y` : axe-core sur seize écrans des deux espaces, échec sur un manquement sérieux.
- [x] F200 Ce document, et CLAUDE.md, à jour.

### Suite (F201 et au-delà)

- [x] F201 Le bouton de farce se gèle vingt secondes avec un compte à rebours, et le reste après un rechargement du fil.
- [x] F202 La farce part des outils d'écriture (bouton 🥧, panneau replié) ; plus d'en-tête à deux au-dessus du fil : les photos vivent dans les bulles.
- [x] F203 La photo de profil se change dans le menu « plus » (Sterenn) et dans Réglages (professeur) ; une photo de profil n'est jamais listée comme un dépôt.
- [x] F204 Cinq farces en 3D : environnement lumineux (PMREM), éclats qui collent à l'écran et glissent, confettis instanciés, cœurs extrudés vernis, feu d'artifice sur voile de nuit avec traînées et éclairs, fondu de sortie du canevas, culling désactivé sur les particules.
- [x] F205 Espace professeur : six sections au lieu de dix-huit entrées ; la section active déplie ses pages dans la barre latérale ; le fil d'Ariane suit la section.
- [x] F206 Les pages d'une section se suivent en onglets en tête de page, posés par `afficher()` pour toutes les vues.
- [x] F207 Assistant « Démarrer l'année » : sept étapes (codes, carte et trois réponses, planning, réglages, accès, première séance, sauvegarde nocturne), détection automatique quand c'est possible, carte de progression sur Aujourd'hui.
- [x] F208 Assistant « Préparer la séance » : leçons et documents (fiche, exercices écran, cahier, sujet corrigé), accès ouverts en un clic ou rendus à la règle, travail personnel avec propositions, mot envoyé à Sterenn, bilan et séance marquée prête.
- [x] F209 Lisibilité du pilotage : texte à 15 px, neutres plus contrastés, aides et libellés plus grands, blocs plus aérés, pastilles sans retour à la ligne.
- [x] F210 Module « Faire connaissance » en huit écrans interactifs : séance cochée au fil de l'heure, univers avec exemple vrai et palette, comment j'apprends (cinq choix commentés), jeu des trois questions avec point commun, réponse de Bastien, pacte signé imprimable, premier jeu tiré des univers.
- [x] F211 La page « Sa carte » du professeur affiche univers, couleur, manière d'apprendre, trois réponses et pacte, et lui permet d'écrire ses trois réponses et sa réponse à la question de Sterenn.
- [x] F212 Socle des mondes 3D (`monde-base.js`) : chaîne de rendu (occlusion ambiante au cran haut sur GPU réel, bloom discret, SMAA, sortie ACES), HDRI par défaut, sol PBR depuis `pbr2k`, dôme de ciel, matériaux physiques en une ligne, crans de qualité branchés.
- [x] F213 Audit des contenus étendu (forme des quatre documents, banque question par question, univers, couverture des attendus) ; 45 corrigés réécrits pas à pas, 13 barèmes, 2 blocs de mots-clés, un cours allongé, 45 rattachements de jeux : 0 manque, 0 alerte.
- [x] F214 Premier écran robuste : des zéros à la place d'une exception si le programme n'est pas encore arrivé, et un second essai de chargement du programme avant d'annoncer l'échec.
- [x] F215 `npm run audit:mondes` (`tests/mondes.mjs`) : chaque monde 3D démarre, enchaîne tous ses défis jusqu'à l'écran de fin sans erreur, captures bureau et mobile, défilement horizontal relevé.
- [x] F216 Six jeux de textures PBR CC0 supplémentaires (bois de table, parquet, mur enduit, briques, pavés, neige) avec fichier d'attribution.
- [x] F217 Mondes 22 à 30 refaits sur le socle : atelier de papier (colombages, machine à vapeur animée, fabrication d'une feuille en six gestes), apothicairerie (pesée aux poids, bocal des densités, cuisson du sucre), échelle (cour pavée, maison de briques, curseur d'angle, vue de côté), chambre d'écho (galerie à l'échelle, onde longitudinale, ralenti, trois milieux), ville du XIXᵉ (immeubles instanciés, gare, usine, tramway, cycle jour et nuit), routes du commerce triangulaire et flux migratoires (Terre haute résolution, navires, barres, curseur des années), volumes (verre, versements animés), musée des Lumières (visite guidée, presse, soirée).
- [x] F218 Neuf défis par monde avec explications, valeurs recalculées ; une légende sur chaque objet touchable ; sources des chiffres en tête des globes.
- [x] F219 Sonde du rendu logiciel et environnement provisoire avant la première image dans les mondes 22 à 24 : les matériaux ne compilent qu'une fois.
- [x] F220 Dans les jeux, la bulle d'Opale se replie seule sur petit écran neuf secondes après un message, sauf toucher récent ; largeur bornée. Le texte d'embarquement du globe reçoit un fond lisible.
- [x] F221 Les trente mondes passent l'audit automatique (démarrage, gestes communs, défis ou banque jusqu'à l'écran de fin, bureau et mobile, sans erreur).
- [x] F222 Onglet « Mondes 3D » de la page Jeux (`#/jeux/mondes`) : les trente mondes par matière avec le meilleur score et la leçon rattachée.
- [x] F223 Socle 3D : marche à la première personne (`marcher`) au clavier, flèches ou ZQSD, Maj pour courir, joystick tactile, regard au doigt, collisions et sol en fonction de la position, Échap rend la vue libre.
- [x] F224 Socle 3D : mission (`mission`) à objectifs vérifiés ou validés, chrono et chrono cible, jauge, bandeau à droite, une seule fin par partie (bouton en mode cours, automatique en détente).
- [x] F225 Socle 3D : ambiance sonore (`ambiance`) par fichier ou par synthèse (vent, pluie, foule, machine, eau, feu, ville, salle, espace, forêt) et sons brefs (`son`), démarrés au premier geste, qui suivent le bouton muet de la coquille.
- [x] F226 Socle 3D : personnage articulé (`personnage`) bâti sur des capsules, marche animée, regard, bulle de parole sur fond sombre lue par Opale, habillage (chapeau, jupe, tablier).
- [x] F227 Socle 3D : chargement de modèles glTF (`chargerModele`) avec mélangeur d'animations ; chargeurs GLTF et DRACO vendus avec three.
- [x] F228 Les outils du socle (`outils(ctx)`) s'emploient aussi dans les mondes 01 à 20 qui gardent leur propre scène ; styles de mission et de joystick injectés dans les deux cas.
- [x] F229 Six vrais portraits du domaine public (Wikimedia Commons) dans les cadres du musée des Lumières, avec attribution.
- [x] F230 Sons d'ambiance enregistrés libres (CC0, OpenGameArt) : oiseaux et vent du parc, mer, feu qui crépite, avec `audio/ATTRIBUTIONS.md`.
- [x] F231 Mondes 21 à 30 : un personnage ou un guide par monde (guide de musée, faiseuse de livres, apothicaire, peintre, technicien, professeure d'atelier, observatrice, passants du XIXᵉ), une mission chronométrée, la marche avec collisions et une ambiance.
- [x] F232 Mondes 01 à 10 : sonde-guide, professeures, nanorobot, électricien, technicienne, robot gardien, architecte, avion de ligne, témoins d'époque ; missions chronométrées (Saturne, bouchée, trois réactions, cellule, maison à câbler, salle en route, trois attaques, maquette, tour du monde, ordre des événements).
- [x] F233 Mondes 11 à 20 : personnages et missions sur le même modèle (moteur, chaîne alimentaire, réseau de neurones, lancers, éruption, trajets, puissance de la centrale, fouille, décollage, descente en paliers).
- [x] F234 Les bulles de texte 3D ne passent plus par le mappage de tons et prennent un fond sombre : lisibles sous bloom.
- [x] F235 Le bandeau « Trophée débloqué » des jeux passe en ambre foncé : contraste 4,5:1 sur fond clair (l'audit des 88 jeux le relevait quand un trophée tombe au chargement).
- [x] F236 Panneau de confort des jeux : identifiants, libellés et commentaires neutres (lecture facilitée, concentration, sérénité, grands caractères, lettres espacées), anciennes valeurs enregistrées ramenées au neutre ou à la police aérée.
