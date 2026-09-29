-- B86 à B96 : index sur les colonnes filtrées ou triées, et colonnes nouvelles. Tout est rejouable.
CREATE INDEX IF NOT EXISTS idx_messages_fil_date ON messages (fil, cree_le);
CREATE INDEX IF NOT EXISTS idx_messages_lu ON messages (auteur, lu_le);
CREATE INDEX IF NOT EXISTS idx_reactions_message ON reactions (message_id);
CREATE INDEX IF NOT EXISTS idx_fichiers_date ON fichiers (cree_le);
CREATE INDEX IF NOT EXISTS idx_fichiers_matiere ON fichiers (matiere);
CREATE INDEX IF NOT EXISTS idx_journal_quand ON journal (quand);
CREATE INDEX IF NOT EXISTS idx_journal_quoi ON journal (quoi, quand);
CREATE INDEX IF NOT EXISTS idx_suivi_journal_cle ON suivi_journal (cle, quand);
CREATE INDEX IF NOT EXISTS idx_tuteur_journal_quand ON tuteur_journal (quand);
CREATE INDEX IF NOT EXISTS idx_usage_jour ON usage (jour);
CREATE INDEX IF NOT EXISTS idx_felicitations_date ON felicitations (cree_le);
CREATE INDEX IF NOT EXISTS idx_seances_date ON seances (date, creneau);
CREATE INDEX IF NOT EXISTS idx_seances_type_date ON seances (type, date);
CREATE INDEX IF NOT EXISTS idx_erreurs_derniere ON erreurs (derniere);
-- B84 : un message peut être corrigé par son auteur dans les cinq minutes.
ALTER TABLE messages ADD COLUMN modifie_le TEXT;
-- B109 : empreinte du contenu d'un fichier, pour repérer un doublon.
ALTER TABLE fichiers ADD COLUMN sha256 TEXT;
-- B192, B193 : la pile d'appels et la version du site au moment d'une erreur du navigateur.
ALTER TABLE erreurs ADD COLUMN pile TEXT;
ALTER TABLE erreurs ADD COLUMN version TEXT;
-- B133 : une absence garde la date à laquelle elle a été déclarée.
ALTER TABLE seances ADD COLUMN absence_le TEXT;
