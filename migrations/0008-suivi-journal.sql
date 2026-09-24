-- Historique des positionnements : chaque changement de niveau daté, avec l'auteur et la raison.
CREATE TABLE IF NOT EXISTS suivi_journal (
  id      TEXT PRIMARY KEY,
  cle     TEXT NOT NULL,                 -- "<matiere>/<ref>"
  avant   TEXT,                          -- niveau précédent, NULL si non évaluée
  apres   TEXT,                          -- nouveau niveau, NULL si retiré
  raison  TEXT,                          -- decision | serie | devoir | reprise | ...
  par     TEXT NOT NULL,                 -- prof
  quand   TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_suivi_journal_cle ON suivi_journal (cle, quand);
