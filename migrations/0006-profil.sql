-- Profil partagé : les cartes de présentation, les préférences de travail, le
-- positionnement de départ, l'état des modules de découverte. Une ligne par clé,
-- valeur en JSON. Les clés « moi.* » appartiennent à Sterenn, les autres au
-- professeur.

CREATE TABLE IF NOT EXISTS profil (
  cle      TEXT PRIMARY KEY,
  valeur   TEXT NOT NULL,
  maj_le   TEXT NOT NULL,
  maj_par  TEXT NOT NULL
);
