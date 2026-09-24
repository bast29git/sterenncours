-- Réglages de l'espace professeur : ce qui s'affiche ou non chez Sterenn.
-- Une ligne par réglage, la valeur est du JSON. Sans ligne, la valeur par
-- défaut du code s'applique.

CREATE TABLE IF NOT EXISTS reglages (
  cle     TEXT PRIMARY KEY,
  valeur  TEXT NOT NULL,
  maj_le  TEXT NOT NULL
);
