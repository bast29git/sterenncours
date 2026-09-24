/**
 * A30 : les formes de données de l'application, pour l'éditeur et les tests.
 * Ce fichier ne produit rien : il décrit.
 */

/** Une matière du programme (00-pilotage/programme.json, puis data/programme.js). */
export interface Matiere {
  id: string;            // "maths", "physique-chimie"…
  nom: string;
  icone: string;
  horaire?: string;
  themes?: string[];
  competences?: string[];
  attendus?: string[];
  lecons: Lecon[];
}

export interface Lecon {
  ref: string;           // "L01", "G1", "H2"
  dossier?: string;      // "L01-nombres-relatifs"
  titre: string;
  periode: number;       // 1 à 5
  notions: string[];
  docs?: Array<'cours' | 'revision' | 'exercices' | 'evaluation'>;
  socle?: Array<{ competence: string; criteres: number[]; domaine: 'D1' | 'D2' | 'D3' | 'D4' | 'D5' }>;
  matiere?: string;      // posé au chargement
}

/** Une séance du planning (table seances). */
export interface Seance {
  id: string;            // 24 caractères hexadécimaux
  date: string;          // AAAA-MM-JJ
  creneau: 'A' | 'B' | 'C';
  type: 'cours' | 'travail';
  debut: string;         // HH:MM
  fin: string;
  matieres: string[];
  lecons: string[];      // "<matiere>/<ref>" ou "module/<id>"
  choix?: string[];      // leçons proposées au choix de Sterenn
  choisi_le?: string | null;
  objectif?: string | null;
  travail?: string | null;
  statut: 'prevue' | 'faite' | 'reportee' | 'annulee';
  bilan?: string | null;
  absence?: 0 | 1;
  commentaire_eleve?: string | null;
}

/** Un message de la messagerie (table messages). */
export interface Message {
  id: string;
  auteur: 'eleve' | 'prof';
  texte: string;
  contexte?: string | null;
  fil?: string | null;   // identifiant de matière, ou null pour le fil général
  cree_le: string;       // ISO
  lu_le?: string | null;
  envoyer_le?: string | null;   // envoi différé
  reponse_a?: string | null;    // message cité
  reactions?: Record<string, Array<'eleve' | 'prof'>>;
}

/** L'état partagé, tel que /api/etat le renvoie. */
export interface Etat {
  role: 'eleve' | 'prof';
  suivi: Record<string, { niveau: Niveau; note?: string | null; maj_le: string; maj_par: string }>;
  resultats: Record<string, { justes: number; total: number; meilleur: number; series: number; maj_le: string; genre?: 'serie' | 'jeu' }>;
  fiches: Record<string, { termine_le: string }>;
  ouvertures: Record<string, { etat: 0 | 1 }>;
  messagesNonLus: number;
  reglages: Reglages;
  felicitations: Felicitation[];
  acces: Record<string, { etat: 0 | 1; jusqu_au?: string | null }>;
  verrous: Record<string, boolean>;
  profil: Record<string, unknown>;
}

export type Niveau = 'insuffisant' | 'fragile' | 'satisfaisant' | 'tresbien';

export interface Reglages {
  pauses: boolean; tuteur: boolean; calculatrice: boolean; calculatrice_maths: boolean; calculatrice_evaluation: boolean;
  reactions: boolean; formatage: boolean; fils: boolean; felicitations: boolean; sonde: number;
}

export interface Felicitation {
  id: string; fichier_id?: string | null; matiere?: string | null; ref?: string | null; texte: string; cree_le: string; vu_le?: string | null;
}

/** Les clés du profil (table profil) : « moi.* » appartient à Sterenn, le reste au professeur. */
export type CleProfil =
  | 'moi.carte' | 'moi.decouverte_fait' | 'moi.positionnement' | 'moi.visite_faite' | 'moi.arevoir'
  | `moi.diapo.${string}` | `moi.trace.${string}` | `moi.note.${string}` | `moi.surligne.${string}`
  | `moi.seance.${string}` | `moi.brouillon.${string}` | `moi.cahier.${string}` | `moi.autoeval.${string}`
  | `moi.perso.${string}` | `moi.remplacement.${string}`
  | 'bastien.carte' | 'prof.vacances' | 'prof.creneaux'
  | `eval.${string}` | `visio.${string}` | `travail.${string}` | `pauses.${string}` | `prepa.${string}`
  | `question.${string}` | `questions.${string}`;

/** Une réponse d'erreur du serveur (A33). */
export interface Erreur { erreur: string; code: 'invalide' | 'session' | 'interdit' | 'introuvable' | 'conflit' | 'trop_gros' | 'trop_vite' | 'interne' | 'indisponible' | 'erreur'; detail?: string }
