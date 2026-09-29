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

## Site : 200 améliorations (F001 à F200)

En cours : voir les lots suivants.
