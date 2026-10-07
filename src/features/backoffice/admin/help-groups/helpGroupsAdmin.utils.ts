import { HelpGroupAdminAction, HelpGroupAdminItem } from '@/src/api/types';

export const HELP_GROUP_ADMIN_ACTION_LABELS: {
  [K in HelpGroupAdminAction]: string;
} = {
  publish: 'Publier',
  unpublish: 'Dépublier',
  pin: 'Mettre à la une',
  unpin: 'Retirer de la une',
  restore: 'Restaurer',
};

export const formatHelpGroupState = (group: HelpGroupAdminItem): string => {
  if (group.deletedAt) {
    return 'Supprimé';
  }
  return group.publishedAt ? 'Publié' : 'Non publié';
};

// A group without discussion reads "jamais" rather than an empty cell
export const formatHelpGroupLastActivity = (
  lastActivityAt: string | null
): string =>
  lastActivityAt
    ? new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(lastActivityAt))
    : 'jamais';

export const HELP_GROUP_ADMIN_LABELS = {
  tabsLabel: 'Groupes',
  activeTab: 'Groupes',
  deletedTab: 'Supprimés',
  pinColumn: 'À la une',
  pinDisabled: 'Publiez le groupe pour le mettre à la une',
  formatMoreActions: (name: string) => `Plus d'actions pour ${name}`,
  preview: 'Prévisualiser',
  edit: 'Modifier',
  delete: 'Supprimer le groupe',
  formatCounters: (group: HelpGroupAdminItem) =>
    `${group.membersCount} membres · ${group.discussionsCount} discussions · activité : ${formatHelpGroupLastActivity(group.lastActivityAt)}`,
};

/**
 * The single main transition of a group: a deleted group can only be
 * restored, otherwise it is published or unpublished. Pinning is a separate
 * toggle, see `getHelpGroupPinAction`.
 */
export const getHelpGroupMainAction = (
  group: HelpGroupAdminItem
): Extract<HelpGroupAdminAction, 'publish' | 'unpublish' | 'restore'> => {
  if (group.deletedAt) {
    return 'restore';
  }
  return group.publishedAt ? 'unpublish' : 'publish';
};

/**
 * Pin toggle of a group: only a published group can be put forward, `null`
 * when the toggle is disabled.
 */
export const getHelpGroupPinAction = (
  group: HelpGroupAdminItem
): Extract<HelpGroupAdminAction, 'pin' | 'unpin'> | null => {
  if (group.deletedAt || !group.publishedAt) {
    return null;
  }
  return group.pinnedAt ? 'unpin' : 'pin';
};

export const getHelpGroupPreviewHref = (group: HelpGroupAdminItem) =>
  `/backoffice/groupes/${group.slug}`;
