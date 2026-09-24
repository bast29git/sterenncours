-- Messagerie : envoi différé et réponse citée.
-- Colonnes ajoutées : l'ajout échoue si déjà fait, le provisionnement tolère cette erreur.
ALTER TABLE messages ADD COLUMN envoyer_le TEXT;   -- ISO : le message reste invisible à l'autre espace jusque-là
ALTER TABLE messages ADD COLUMN reponse_a TEXT;    -- identifiant du message cité
