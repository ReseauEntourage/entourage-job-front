import { HelpGroupAuthor, HelpGroupReactionsSummary } from '@/src/api/types';

export const HELP_GROUP_NO_DISCUSSION_LABEL = "Ce groupe vient d'ouvrir";
export const HELP_GROUP_NO_MEMBER_LABEL =
  'Soyez parmi les premiers à rejoindre';
export const HELP_GROUP_MEMBER_MENTION = 'Vous êtes membre';
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
