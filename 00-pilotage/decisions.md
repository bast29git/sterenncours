---
type: pilotage
matiere: pilotage
lecon: decisions
titre: Journal des décisions
duree: 5 min
objectifs:
  - Retrouver pourquoi un choix structurant a été fait
competences:
  - Piloter
---

# Journal des décisions

Une entrée datée par choix structurant, pour ne plus le rediscuter. Une décision se remplace par une nouvelle entrée, elle ne s'efface pas.

::: info Plan de la fiche
- Les décisions, de la plus récente à la plus ancienne
- Durée de lecture : 5 minutes
- Matériel : aucun
:::

## Décisions

**2026-09-24 · Un point-virgule dans un commentaire SQL a cassé le déploiement.** Le provisionnement retire désormais les commentaires avant de découper les migrations. Les commentaires de migration restent libres.

**2026-09-24 · Les surcharges de contenu vivent dans le profil, pas dans le Markdown.** Une question modifiée ou ajoutée par le professeur, une note de préparation, une pause coupée sur une fiche : tout passe par la table `profil`, clé par leçon. Le Markdown reste la source de vérité du cours, le profil porte l'adaptation.

**2026-09-24 · Le résultat d'une évaluation est rendu dans l'application.** La grille se remplit en ligne, le positionnement global peut être reporté dans le suivi avec la raison « devoir ». La copie papier reste la copie ; l'application porte la correction.

**2026-09-24 · Les étoiles ne redescendent jamais.** Une fiche, une série, un jeu, une leçon validée, une félicitation : chaque étoile est acquise. Les paliers ouvrent des palettes et des fonds d'écran, jamais des contenus.

**2026-09-24 · Le lot de séances accepte 1 Mo, le reste 32 Ko.** L'année entière fait 61 Ko en une requête. Le générateur envoie par paquets de cinquante.

**2026-09-24 · Le rappel de pause du panneau de confort est coupé par défaut.** Aucun profil ne l'active. Le professeur règle les pauses des fiches, globalement puis fiche par fiche.

**2026-09-23 · Pages plutôt que Workers.** L'application reste une application Pages avec fonctions : un seul dépôt, un seul déploiement, les liaisons D1, KV, R2 et IA en place. Le passage à Workers se fera si une limite de Pages bloque.

**2026-09-23 · Les corrigés ne quittent jamais le serveur côté élève.** Le build retire les corrigés des fiches servies à Sterenn ; le sujet d'évaluation n'est servi que si l'accès est ouvert.

**2026-09-22 · Un seul PDF à la main par leçon.** Les exercices 1 à 4 se font sur écran avec le professeur, tous les autres dans le cahier imprimé, jamais les mêmes.

**2026-09-20 · Aucune donnée sensible dans le site.** Les codes d'accès séparent les usages ; ils ne protègent rien. Aucun nom de diagnostic, nulle part.
