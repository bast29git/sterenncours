-- D25 : les jeux envoient le détail d'une partie (justes, total, questions ratées, difficulté).
ALTER TABLE resultats ADD COLUMN detail TEXT;
