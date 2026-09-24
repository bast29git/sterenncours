-- Messagerie : fil par matière et réactions sur les messages.

-- Le fil : identifiant de matière, ou NULL pour le fil général. L'ajout de
-- colonne échoue s'il est déjà fait : le provisionnement tolère cette erreur.
ALTER TABLE messages ADD COLUMN fil TEXT;

CREATE TABLE IF NOT EXISTS reactions (
  message_id TEXT NOT NULL,
  auteur     TEXT NOT NULL,             -- eleve | prof
  emoji      TEXT NOT NULL,
  cree_le    TEXT NOT NULL,
  PRIMARY KEY (message_id, auteur, emoji)
);
