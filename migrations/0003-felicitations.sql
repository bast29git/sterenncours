-- Félicitations du professeur : un mot pour un devoir rendu (fichier déposé
-- ou travail sur papier). Chaque félicitation vaut une étoile chez Sterenn.

CREATE TABLE IF NOT EXISTS felicitations (
  id          TEXT PRIMARY KEY,
  fichier_id  TEXT,                    -- dépôt concerné, facultatif
  matiere     TEXT,
  ref         TEXT,
  texte       TEXT NOT NULL,
  cree_le     TEXT NOT NULL,
  vu_le       TEXT                     -- quand Sterenn l'a vue
);
CREATE INDEX IF NOT EXISTS idx_felicitations_date ON felicitations (cree_le);
