import _ from 'lodash';
import {
  ReportGroupMessageState,
  ReportTargetFilter,
  ReportTargetStatus,
  ReportTargetType,
} from '@/src/api/types';
import { REPORT_REASONS } from '@/src/constants/reports';

// Provisional labels (Open Questions of the design): no impact on the
// structure, to be confirmed by the PM

export const REPORTS_TAB_LABELS = {
  menu: 'Les signalements',
  title: 'Signalements',
  description:
    'Les signalements de conversations, de profils et de messages de groupe, regroupés par contenu signalé',
  typeFilter: 'Type',
  statusFilter: 'Statut',
  zoneFilter: 'Zone',
  allTypes: 'Tous',
  allStatuses: 'Tous les statuts',
  allZones: 'Toutes les zones',
  loadMore: 'Voir plus de signalements',
  empty: 'Aucun signalement pour ces filtres',
  loadError: 'Les signalements n’ont pas pu être chargés.',
  notFound: 'Ce signalement est introuvable.',
  back: 'Retour aux signalements',
  reportsTitle: 'Signalements reçus',
  deletedUser: 'Utilisateur supprimé',
  adminProfile: 'Voir la fiche',
  formatWriteTo: (firstName: string) => `Écrire à ${firstName}`,
  noComment: 'Aucun commentaire',
  participants: 'Participants',
  conversation: 'Conversation (lecture seule)',
  loadOlderMessages: 'Messages précédents',
  noMessage: 'Aucun message dans cette conversation',
  messagesError: 'La conversation n’a pas pu être chargée.',
  reportedPerson: 'Personne signalée',
  group: 'Groupe',
  author: 'Auteur',
  deletedGroup: 'Groupe supprimé',
  missingMessage: 'Le message est introuvable.',
  seeMessage: 'Voir le message dans le fil',
  reportedMessage: 'Le message signalé',
  lastReport: 'Dernier signalement',
  decisionTitle: 'Votre décision',
  formatDecisionText: (pendingCount: number) =>
    `Rétablir ou supprimer le message clôt ${
      pendingCount > 1
        ? `ses ${pendingCount} signalements à traiter`
        : 'son signalement à traiter'
    }. Personne n'est prévenu de la décision.`,
  restoreMessage: 'Rétablir le message',
  restoreDone: 'Le message a été rétabli.',
  deleteMessage: 'Supprimer le message',
  deleteReason: 'Motif de suppression (obligatoire)',
  deleteComment: 'Précision (facultative, visible des admins)',
  deleteConfirm: 'Confirmer la suppression',
  deleteCancel: 'Annuler',
  versionsTitle: 'Versions du message',
  resolveTitle: 'Marquer comme traité',
  resolveNote: 'Note interne (facultative)',
  resolveSubmit: 'Marquer comme traité',
  resolveDone: 'Le signalement a été marqué comme traité',
  resolveError: 'Le signalement n’a pas pu être marqué comme traité.',
  formatResolved: (adminName: string, date: string) =>
    `Traité par ${adminName} le ${date}`,
  resolvedAutomatically: 'Traité depuis le groupe',
  formatPendingCount: (count: number) => `${count} · À traiter`,
  formatReportsCount: (count: number) =>
    `${count} signalement${count > 1 ? 's' : ''}`,
};

export const REPORT_TARGET_STATUS_LABELS: {
  [K in ReportTargetStatus]: string;
} = {
  PENDING: 'À traiter',
  RESOLVED: 'Traité',
};

export const REPORT_TARGET_TYPE_LABELS: { [K in ReportTargetType]: string } = {
  CONVERSATION: 'Conversation',
  USER_PROFILE: 'Profil',
  POST: 'Discussion de groupe',
  POST_REPLY: 'Réponse de groupe',
};

export const REPORT_TARGET_FILTER_LABELS: {
  [K in ReportTargetFilter]: string;
} = {
  CONVERSATION: 'Conversations',
  USER_PROFILE: 'Profils',
  GROUP_MESSAGE: 'Messages de groupe',
};

export const GROUP_MESSAGE_STATE_LABELS: {
  [K in ReportGroupMessageState]: string;
} = {
  VISIBLE: 'Visible',
  HIDDEN: 'Masqué',
  DELETED: 'Supprimé',
};

// Banner of the reported group message, by state
export const GROUP_MESSAGE_STATE_BANNERS: {
  [K in ReportGroupMessageState]: string;
} = {
  VISIBLE: 'Message visible par tous',
  HIDDEN:
    'Masqué automatiquement après signalements, en attente de votre décision',
  DELETED: 'Message supprimé, visible des admins seulement',
};

// Initials of the type, in the round icon of a list card
export const REPORT_TARGET_TYPE_SHORT_LABELS: {
  [K in ReportTargetType]: string;
} = {
  CONVERSATION: 'CO',
  USER_PROFILE: 'PR',
  POST: 'GR',
  POST_REPLY: 'GR',
};

export const formatReportReason = (reason: string) =>
  REPORT_REASONS.find(({ value }) => value === reason)?.label ?? reason;

export const formatReportZone = (zone: string) => _.capitalize(zone);

export const formatReportDate = (date: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
