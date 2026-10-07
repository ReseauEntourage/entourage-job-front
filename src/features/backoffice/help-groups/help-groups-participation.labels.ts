import { HelpGroupDeletionReason } from '@/src/api/types';

export const ELEARNING_PAGE_HREF = '/backoffice/ressources/formations';

export const TITLE_MAX_LENGTH = 120;
export const MESSAGE_MAX_LENGTH = 5000;
// A title is proposed from this message length on, when leaving the field
export const TITLE_SUGGESTION_MIN_LENGTH = 30;
// "Proposer un autre titre", per draft
export const TITLE_SUGGESTION_MAX_RETRIES = 5;

// Labels validated by the PM on 01/10/2026
export const JOIN_INVITATION_LABEL =
  'Vous lisez ce groupe librement. Pour publier une discussion, y répondre ou réagir, rejoignez le groupe.';
export const JOIN_BUTTON_LABEL = 'Rejoindre le groupe';
export const ELEARNING_INVITATION_LABEL =
  'Terminez votre formation pour participer aux groupes';
export const ELEARNING_LINK_LABEL = 'Accéder à mes formations';
export const LEAVE_BUTTON_LABEL = 'Quitter le groupe';
export const LEAVE_CONFIRM_TITLE = 'Quitter ce groupe ?';
export const LEAVE_CONFIRM_TEXT =
  'Vos discussions, réponses et réactions restent visibles. Vous pourrez rejoindre ce groupe à tout moment.';
export const JUST_JOINED_LABEL = 'Vous venez de rejoindre';
// Layout of the group page (revision of 07/10/2026)
export const ABOUT_GROUP_TITLE = 'À propos de ce groupe';
export const PUBLISH_DISCUSSION_LABEL = 'Publier une discussion';

export const formatWelcomeInvite = (firstName: string) =>
  `Bienvenue, ${firstName}. Présentez-vous en deux lignes : où vous en êtes, et ce qui vous amène ici.`;

// Positive call, naming the author: never "Personne n'a encore répondu"
export const formatFirstResponderInvite = (authorFirstName: string) =>
  `Soyez la première personne à répondre à ${authorFirstName}, même deux lignes suffisent.`;

export const COMPOSER_PLACEHOLDER =
  'Posez une question, partagez une situation, proposez votre aide…';
export const COMPOSER_VISIBILITY_LABEL =
  'Votre message sera visible par toutes les personnes inscrites sur Entourage Pro.';
export const COMPOSER_MESSAGE_LABEL = 'Votre message';
export const COMPOSER_TITLE_LABEL = 'Titre';
export const COMPOSER_TITLE_PLACEHOLDER = 'Écrivez votre titre';
export const COMPOSER_TITLE_SUGGESTED_LABEL = 'Proposé pour vous, modifiable';
export const COMPOSER_TITLE_LOADING_LABEL = 'Proposition d’un titre…';
export const COMPOSER_TITLE_RETRY_LABEL = 'Proposer un autre titre';
export const COMPOSER_TITLE_OWN_LABEL = 'Écrire le mien';
export const COMPOSER_PUBLISH_LABEL = 'Publier';
export const COMPOSER_CANCEL_LABEL = 'Annuler';
export const COMPOSER_TITLE_REQUIRED = 'Le titre est obligatoire.';
export const COMPOSER_MESSAGE_REQUIRED = 'Le message est obligatoire.';
export const formatTooLongError = (maxLength: number) =>
  `${maxLength} caractères maximum.`;

export const formatReplyPlaceholder = (authorFirstName: string | null) =>
  authorFirstName
    ? `Écrivez votre réponse à ${authorFirstName}…`
    : 'Écrivez votre réponse…';
export const REPLY_VISIBILITY_LABEL =
  'Votre réponse sera visible par toutes les personnes inscrites sur Entourage Pro.';
export const REPLY_BUTTON_LABEL = 'Répondre';
export const NEW_REPLY_PILL_LABEL = 'Nouvelle réponse';

export const CHARTER_MODAL_TITLE = 'Avant votre première publication';
export const CHARTER_MODAL_INTRO =
  'Ces règles valent pour tous les groupes. Elles ne vous seront pas redemandées.';
export const CHARTER_MODAL_CHECKBOX =
  'J’ai lu ce cadre et je m’engage à le respecter';
export const CHARTER_MODAL_ACCEPT = 'Accepter et publier';

export const WRITE_ERROR_LABELS = {
  publish: 'Votre discussion n’a pas pu être publiée. Réessayez.',
  reply: 'Votre réponse n’a pas pu être envoyée. Réessayez.',
  discussionGone: 'Cette discussion n’est plus disponible.',
  elearning: ELEARNING_INVITATION_LABEL,
  notMember: 'Rejoignez le groupe pour participer.',
  reaction: 'Votre réaction n’a pas pu être enregistrée.',
  edit: 'Votre modification n’a pas pu être enregistrée.',
  delete: 'La suppression n’a pas pu être effectuée.',
  join: 'Vous n’avez pas pu rejoindre le groupe. Réessayez.',
  leave: 'Vous n’avez pas pu quitter le groupe. Réessayez.',
} as const;

export const DISCUSSION_GONE_LABEL = 'Cette discussion n’est plus disponible.';
export const BACK_TO_GROUP_LABEL = 'Revenir au groupe';

export const REACT_LABEL = 'Réagir';

export const MESSAGE_MENU_LABELS = {
  open: 'Actions sur le message',
  copyLink: 'Copier le lien du message',
  edit: 'Modifier',
  delete: 'Supprimer',
  revisions: 'Voir les versions précédentes',
  report: 'Signaler ce message',
  moderate: 'Supprimer ce message',
} as const;
export const LINK_COPIED_LABEL = 'Lien copié';
export const EDITED_MENTION = 'modifié';
export const EDIT_SAVE_LABEL = 'Enregistrer';

export const DELETE_REPLY_CONFIRM = {
  title: 'Supprimer votre réponse ?',
  text: 'Elle ne sera plus visible par personne.',
  button: 'Supprimer',
};
export const DELETE_DISCUSSION_CONFIRM = {
  title: 'Supprimer votre discussion ?',
  text: 'Elle ne sera plus visible par personne, et toutes ses réponses, y compris celles des autres membres, seront retirées avec elle.',
  button: 'Supprimer',
};

export const MODERATION_REASON_LABELS: Record<HelpGroupDeletionReason, string> =
  {
    PERSONAL_DATA: 'Données personnelles exposées',
    DISRESPECT: 'Propos irrespectueux ou humiliants',
    SPAM: 'Spam ou prospection',
    OFF_TOPIC: 'Hors sujet',
    OTHER: 'Autre',
  };
export const MODERATION_MODAL = {
  title: 'Supprimer ce message',
  text: 'Le message ne sera plus visible par personne. Son auteur n’est pas prévenu. Le motif est visible de l’équipe seulement.',
  reasonLabel: 'Motif',
  commentLabel: 'Précision (facultatif)',
  confirm: 'Supprimer le message',
};
export const MODERATION_DONE_LABEL = 'Le message a été supprimé.';
export const WRITE_TO_AUTHOR_LABEL = 'Écrire à l’auteur';
export const getMessagingHref = (userId: string) =>
  `/backoffice/messaging?userId=${encodeURIComponent(userId)}`;

export const REVISIONS_MODAL = {
  title: 'Versions précédentes',
  current: 'Version actuelle',
  error: 'Les versions n’ont pas pu être chargées.',
};

export const LEAVE_PAGE_CONFIRM =
  'Votre texte n’est pas publié. Quitter la page quand même ?';

// Labels validated by the PM on 01/10/2026
export const UNDER_REVIEW_MENTION =
  'Ce message est en cours de vérification par l’équipe';
export const HIDDEN_BY_REPORTS_BANNER = 'Masqué après signalements';
export const RESTORE_LABEL = 'Rétablir';
export const MODERATION_DELETE_SHORT_LABEL = 'Supprimer';
export const RESTORE_ERROR_LABEL = 'Le message n’a pas pu être rétabli.';
// From the buttons of the Slack moderation alerts (revision of 07/10/2026)
export const RESTORE_CONFIRM = {
  title: 'Rétablir ce message ?',
  text: 'Il redeviendra visible par tous, et ses signalements seront clos.',
  button: 'Rétablir',
};
export const REPORT_ALREADY_HANDLED_LABEL = 'Ce signalement a déjà été traité.';
export const formatReportReasons = (labels: string[]) =>
  `Motifs : ${labels.join(', ')}`;

// "Emails de ce groupe": per group only, the bell is not affected
export const EMAILS_SETTING_LABEL = 'Emails de ce groupe';
export const EMAILS_SETTING_DESCRIPTION =
  'Recevoir un email quand on vous répond ou qu’on soutient votre message, et le récapitulatif de la semaine.';
export const EMAILS_SETTING_ERROR = 'Le réglage n’a pas pu être enregistré.';
