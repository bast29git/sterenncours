-- Schéma partagé entre l'espace de Sterenn et l'espace professeur.
-- Toutes les instructions sont idempotentes : la migration se rejoue sans risque.

CREATE TABLE IF NOT EXISTS suivi (
  cle        TEXT PRIMARY KEY,          -- "<matiere>/<ref>"
  matiere    TEXT NOT NULL,
  ref        TEXT NOT NULL,
  niveau     TEXT,                      -- insuffisant | fragile | satisfaisant | tresbien
  note       TEXT,
  maj_le     TEXT NOT NULL,
  maj_par    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS resultats (
  cle        TEXT PRIMARY KEY,
  matiere    TEXT NOT NULL,
  ref        TEXT NOT NULL,
  justes     INTEGER NOT NULL,
  total      INTEGER NOT NULL,
  meilleur   INTEGER NOT NULL,
  series     INTEGER NOT NULL DEFAULT 1,
  maj_le     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS fiches_lues (
  cle        TEXT PRIMARY KEY,          -- "<matiere>/<ref>/<type>"
  termine_le TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id       TEXT PRIMARY KEY,
  auteur   TEXT NOT NULL,               -- eleve | prof
  texte    TEXT NOT NULL,
  contexte TEXT,                        -- leçon concernée, facultatif
  cree_le  TEXT NOT NULL,
  lu_le    TEXT
);
CREATE INDEX IF NOT EXISTS idx_messages_date ON messages (cree_le);

CREATE TABLE IF NOT EXISTS fichiers (
  id       TEXT PRIMARY KEY,
  nom      TEXT NOT NULL,
  type     TEXT NOT NULL,
  taille   INTEGER NOT NULL,
  cle_r2   TEXT NOT NULL,
  auteur   TEXT NOT NULL,
  matiere  TEXT,
  ref      TEXT,
  note     TEXT,
  cree_le  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_fichiers_date ON fichiers (cree_le);

-- Séances de travail : le planning réel, et ce qui a été fait.
CREATE TABLE IF NOT EXISTS seances (
  id        TEXT PRIMARY KEY,
  date      TEXT NOT NULL,             -- AAAA-MM-JJ
  creneau   TEXT NOT NULL,             -- A | B | C
  matieres  TEXT NOT NULL DEFAULT '[]',-- JSON : identifiants de matières
  lecons    TEXT NOT NULL DEFAULT '[]',-- JSON : "<matiere>/<ref>"
  objectif  TEXT,
  travail   TEXT,                      -- à faire d'ici la prochaine fois
  statut    TEXT NOT NULL DEFAULT 'prevue', -- prevue | faite | reportee
  bilan     TEXT,
  cree_le   TEXT NOT NULL,
  maj_le    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_seances_date ON seances (date);

-- Ajouts additifs sur les séances. Ces instructions échouent si la colonne
-- existe déjà : le provisionnement tolère cette erreur précise et continue.
ALTER TABLE seances ADD COLUMN debut TEXT NOT NULL DEFAULT '13:00';
ALTER TABLE seances ADD COLUMN fin TEXT NOT NULL DEFAULT '14:30';
ALTER TABLE seances ADD COLUMN type TEXT NOT NULL DEFAULT 'cours';
ALTER TABLE seances ADD COLUMN choix TEXT NOT NULL DEFAULT '[]';
ALTER TABLE seances ADD COLUMN choisi_le TEXT;

-- Ouverture des leçons : le professeur décide explicitement de pousser une
-- leçon à Sterenn, ou de la retenir. En l'absence de ligne, la règle
-- automatique s'applique (première de la matière, précédente validée, ou
-- déjà mise au programme d'une séance passée).
CREATE TABLE IF NOT EXISTS ouvertures (
  cle     TEXT PRIMARY KEY,            -- "<matiere>/<ref>"
  matiere TEXT NOT NULL,
  ref     TEXT NOT NULL,
  etat    INTEGER NOT NULL,            -- 1 : ouverte de force, 0 : retenue
  maj_le  TEXT NOT NULL
);
