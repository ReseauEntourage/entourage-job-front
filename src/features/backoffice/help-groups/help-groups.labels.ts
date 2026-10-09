import { HelpGroupAuthor, HelpGroupReactionsSummary } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';

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

/**
 * User passed to the avatar, or null for a deleted account (grey disc).
 */
export const getAuthorAvatarUser = (
  author: Pick<HelpGroupAuthor, 'isDeleted' | 'id' | 'firstName'>
): { id: string; firstName: string } | null => {
  if (author.isDeleted || !author.id || !author.firstName) {
    return null;
  }
  return { id: author.id, firstName: author.firstName };
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

// Back link replacing the breadcrumb, recette of 08/10/2026
export const HELP_GROUP_BACK_LINK_LABEL = 'Retour';
export const HELP_GROUPS_LIST_LABEL = 'Groupes';
export const HELP_GROUPS_LIST_HREF = '/backoffice/groupes';
export const getHelpGroupHref = (slug: string): string =>
  `${HELP_GROUPS_LIST_HREF}/${slug}`;

// Members of a group, recette of 08/10/2026
export const HELP_GROUP_MEMBERS_TITLE = 'Les membres';
export const HELP_GROUP_MEMBERS_PREVIEW_SIZE = 5;
export const HELP_GROUP_MEMBERS_SEARCH_LABEL = 'Rechercher un membre';
export const HELP_GROUP_MEMBERS_ROLE_FILTER_LABEL = 'Filtrer par rôle';
export const HELP_GROUP_MEMBERS_MORE_LABEL = 'Afficher 20 membres de plus';
export const HELP_GROUP_MEMBERS_NO_RESULT_LABEL =
  'Aucun membre ne correspond à votre recherche.';
export const HELP_GROUP_MEMBERS_PROFILE_LABEL = 'Voir le profil';
export const HELP_GROUP_MEMBERS_LOAD_ERROR =
  'Les membres n’ont pas pu être chargés.';

/**
 * Plain members count, "1 membre" or "61 membres" (never called with 0: the
 * members block is not shown for a group without members).
 */
export const formatMembersCount = (count: number): string =>
  `${count} ${count === 1 ? 'membre' : 'membres'}`;

export const formatSeeAllMembersLabel = (count: number): string =>
  count === 1 ? 'Voir le membre' : `Voir les ${count} membres`;

// "20 sur 61 membres"
export const formatShownMembersLabel = (shown: number, total: number) =>
  `${shown} sur ${formatMembersCount(total)}`;

// "membre depuis octobre 2026"
export const formatMemberSinceLabel = (joinedAt: string | Date): string =>
  `membre depuis ${new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(joinedAt))}`;

export const HELP_GROUP_MEMBERS_ALL_ROLES = 'all';
export type HelpGroupMembersRoleFilter =
  typeof HELP_GROUP_MEMBERS_ALL_ROLES | UserRoles;
export const HELP_GROUP_MEMBERS_ROLE_FILTERS: {
  value: HelpGroupMembersRoleFilter;
  label: string;
}[] = [
  { value: HELP_GROUP_MEMBERS_ALL_ROLES, label: 'Tous' },
  { value: UserRoles.CANDIDATE, label: 'Candidats' },
  { value: UserRoles.COACH, label: 'Coachs' },
  { value: UserRoles.REFERER, label: 'Prescripteurs' },
  { value: UserRoles.ADMIN, label: 'Équipe Entourage' },
];
