/**
 * A35 : les chaînes que le serveur renvoie, en un seul endroit, pour la relecture et la cohérence de ton.
 * Toujours en français, au tutoiement quand elles s'adressent à Sterenn, jamais de jargon technique.
 */
export const MESSAGES = {
  requete_invalide: 'Requête invalide.',
  identifiant_invalide: 'Identifiant invalide.',
  session_expiree: 'Session expirée. Reconnecte-toi.',
  reserve_prof: 'Réservé à l\'espace professeur.',
  introuvable: 'Introuvable.',
  trop_vite: 'Trop de demandes en peu de temps : attends un instant.',
  trop_gros: 'Le contenu envoyé est trop volumineux.',
  stockage_indisponible: 'Stockage indisponible.',
  ia_indisponible: 'Opale n\'est pas reliée à un modèle sur ce déploiement.',
  texte_obligatoire: 'Le texte est obligatoire.',
  cle_lecon_invalide: 'La leçon indiquée n\'existe pas.',
  methode_non_permise: 'Cette méthode n\'est pas permise sur cette adresse.',
  route_inconnue: 'Cette adresse d\'API n\'existe pas.',
  type_non_supporte: 'Le corps doit être du JSON (content-type application/json).',
  origine_refusee: 'Requête refusée : elle ne vient pas du site.',
  adresse_trop_longue: 'Adresse trop longue.',
  chemin_invalide: 'Chemin invalide.',
  non_authentifie: 'Non authentifié.',
  reserve_prof_contenu: 'Réservé à l\'espace professeur.',
  evaluation_fermee: 'Cette évaluation n\'est pas ouverte.',
  trop_volumineux: 'Requête trop volumineuse.',
  erreur_interne: 'Une erreur est survenue côté serveur. Réessaie dans un instant ; si ça continue, écris à Bastien.',
  date_invalide: 'Date invalide (AAAA-MM-JJ attendu).',
  heure_invalide: 'Heure invalide (HH:MM attendu).',
  fin_avant_debut: 'La fin doit venir après le début.',
  doublon: 'Cette action vient déjà d\'être faite.',
  quota_jour: 'Le quota du jour est atteint : à demain.',
};
