import { HelpGroupAuthor, HelpGroupReactionsSummary } from '@/src/api/types';

export const HELP_GROUPS_RETRY_LABEL = 'Réessayer';
export const HELP_GROUPS_LOAD_ERROR_LABELS = {
  groups: 'Les groupes n’ont pas pu être chargés.',
  group: 'Ce groupe n’a pas pu être chargé.',
  discussions: 'Les discussions n’ont pas pu être chargées.',
  discussion: 'Cette discussion n’a pas pu être chargée.',
  replies: 'Les réponses n’ont pas pu être chargées.',
} as const;
export const HELP_GROUP_NO_DISCUSSION_LABEL = "Ce groupe vient d'ouvrir";
export const HELP_GROUP_NO_DISCUSSION_TEXT =
  "Vous pouvez y poser la première question. Les membres reçoivent un email quand quelqu'un répond.";
export const HELP_GROUP_NO_MEMBER_LABEL =
  'Soyez parmi les premiers à rejoindre';
export const HELP_GROUP_MEMBER_MENTION = 'Vous êtes membre';
export const HELP_GROUP_PINNED_MENTION = 'À la une';
export const HELP_GROUP_DISCUSSIONS_TITLE = 'Discussions';
// Introduction of the groups list, design of 07/10/2026
export const HELP_GROUPS_INTRO = {
  overline: "Groupes d'entraide",
  title: 'Trouvez le groupe qui parle de votre situation',
  text: "Posez une question, partagez une situation, proposez votre aide. Candidats, coachs et prescripteurs s'y entraident d'égal à égal.",
  charterLink: 'Lire le cadre des groupes',
} as const;
export const DELETED_AUTHOR_LABEL = 'Utilisateur supprimé';

/**
 * Members count label. Never "0 membre": a group without members shows an
 * invitation instead. A member reads "N membres, dont vous".
 */
export const formatMembersLabel = (
  membersCount: number,
  isMember: boolean
): string => {
  if (membersCount <= 0) {
    return HELP_GROUP_NO_MEMBER_LABEL;
  }
  const count = `${membersCount} ${membersCount === 1 ? 'membre' : 'membres'}`;
  return isMember ? `${count}, dont vous` : count;
};

/**
 * Replies count label, only when there is at least one reply (`null`
 * otherwise, so that nothing is displayed).
 */
export const formatRepliesLabel = (repliesCount: number): string | null => {
  if (repliesCount <= 0) {
    return null;
  }
  return `${repliesCount} ${repliesCount === 1 ? 'réponse' : 'réponses'}`;
};

/**
 * Reacting people as first names, never as a number: "X soutient",
 * "X et Y soutiennent", "X, Y et Z soutiennent", "X, Y, Z et d'autres
 * soutiennent".
 */
export const formatReactionsLabel = (
  summary: Pick<HelpGroupReactionsSummary, 'firstNames' | 'hasOthers'> | null
): string | null => {
  if (!summary || summary.firstNames.length === 0) {
    return null;
  }
  const { firstNames, hasOthers } = summary;
  if (hasOthers) {
    return `${firstNames.join(', ')} et d'autres soutiennent`;
  }
  if (firstNames.length === 1) {
    return `${firstNames[0]} soutient`;
  }
  const last = firstNames[firstNames.length - 1];
  return `${firstNames.slice(0, -1).join(', ')} et ${last} soutiennent`;
};

/**
 * "Julien P.", or "Utilisateur supprimé" for a deleted account.
 */
export const formatAuthorName = (
  author: Pick<HelpGroupAuthor, 'isDeleted' | 'firstName' | 'lastNameInitial'>
): string => {
  if (author.isDeleted || !author.firstName) {
    return DELETED_AUTHOR_LABEL;
  }
  return [author.firstName, author.lastNameInitial].filter(Boolean).join(' ');
};

/**
 * Role label sent by the back ("Candidat", "Coach", "Prescripteur",
 * "Équipe Entourage"), never shown for a deleted account.
 */
export const formatAuthorRoleLabel = (
  author: Pick<HelpGroupAuthor, 'isDeleted' | 'roleLabel'>
): string | null => {
  if (author.isDeleted) {
    return null;
  }
  return author.roleLabel;
};

export const getAuthorInitials = (
  author: Pick<HelpGroupAuthor, 'isDeleted' | 'firstName' | 'lastNameInitial'>
): string | null => {
  if (author.isDeleted || !author.firstName) {
    return null;
  }
  return `${author.firstName.charAt(0)}${
    author.lastNameInitial?.charAt(0) ?? ''
  }`.toUpperCase();
};

/**
 * Plain date of a message or of an activity, e.g. "1 octobre 2026".
 */
export const formatHelpGroupDate = (date: string | Date): string =>
  new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));

export const getProfileHref = (userId: string): string =>
  `/backoffice/profile/${userId}`;

/**
 * Date and time of a version, e.g. "1 octobre 2026 à 14:05".
 */
export const formatHelpGroupDateTime = (date: string | Date): string =>
  new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
