-- Contrôle d'accès par élément (fiche, série, évaluation, jeu) et absences.

-- Une ligne par élément décidé par le professeur. Sans ligne, la règle
-- automatique s'applique : fiches, séries et jeux ouverts avec la leçon,
-- évaluation fermée.
--   cle : "<matiere>/<ref>/<cours|revision|exercices|serie|evaluation>" ou "jeu/<id>"
--   etat : 1 ouvert, 0 fermé
--   jusqu_au : date-heure ISO de fin d'ouverture, facultative
CREATE TABLE IF NOT EXISTS acces (
  cle       TEXT PRIMARY KEY,
  etat      INTEGER NOT NULL,
  jusqu_au  TEXT,
  maj_le    TEXT NOT NULL
);

-- Séances : absence déclarée par Sterenn, avec son commentaire. Ces ajouts
-- échouent si la colonne existe déjà : le provisionnement tolère cette erreur.
ALTER TABLE seances ADD COLUMN absence INTEGER NOT NULL DEFAULT 0;
ALTER TABLE seances ADD COLUMN commentaire_eleve TEXT;
