-- Journal d'audit des écritures sensibles, questions posées à Opale, compteurs d'usage, erreurs du navigateur.
CREATE TABLE IF NOT EXISTS journal (
  id     TEXT PRIMARY KEY,
  quand  TEXT NOT NULL,
  qui    TEXT NOT NULL,                  -- eleve | prof
  quoi   TEXT NOT NULL,                  -- acces | reglage | ouverture | seance | felicitation | code | profil
  cle    TEXT,
  avant  TEXT,
  apres  TEXT
);
CREATE INDEX IF NOT EXISTS idx_journal_quand ON journal (quand);

CREATE TABLE IF NOT EXISTS tuteur_journal (
  id        TEXT PRIMARY KEY,
  quand     TEXT NOT NULL,
  role      TEXT NOT NULL,
  mode      TEXT,
  matiere   TEXT,
  ref       TEXT,
  question  TEXT NOT NULL,
  controle  TEXT                         -- aucun | filtre | controleur
);
CREATE INDEX IF NOT EXISTS idx_tuteur_journal_quand ON tuteur_journal (quand);

CREATE TABLE IF NOT EXISTS usage (
  jour  TEXT NOT NULL,
  cle   TEXT NOT NULL,                   -- fiche | serie | jeu | message | opale | connexion
  n     INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (jour, cle)
);

CREATE TABLE IF NOT EXISTS erreurs (
  empreinte  TEXT PRIMARY KEY,
  message    TEXT NOT NULL,
  source     TEXT,
  ecran      TEXT,
  role       TEXT,
  n          INTEGER NOT NULL DEFAULT 1,
  premiere   TEXT NOT NULL,
  derniere   TEXT NOT NULL
);

-- A7 : les résultats distinguent série et jeu par une colonne, plus seulement par le préfixe de la clé.
ALTER TABLE resultats ADD COLUMN genre TEXT;
UPDATE resultats SET genre = CASE WHEN cle LIKE 'jeu/%' THEN 'jeu' ELSE 'serie' END WHERE genre IS NULL;

-- A6 : index utiles aux requêtes du planning et du suivi.
CREATE INDEX IF NOT EXISTS idx_seances_type_date ON seances (type, date);
CREATE INDEX IF NOT EXISTS idx_resultats_maj ON resultats (maj_le);
CREATE INDEX IF NOT EXISTS idx_fiches_termine ON fiches_lues (termine_le);
