import { HelpGroupAdminAction, HelpGroupAdminItem } from '@/src/api/types';

export const HELP_GROUP_ADMIN_ACTION_LABELS: {
  [K in HelpGroupAdminAction]: string;
} = {
  publish: 'Publier',
  unpublish: 'Dépublier',
  pin: 'Épingler',
  unpin: 'Désépingler',
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

/**
 * Transitions available for a group depending on its state. A deleted group
 * can only be restored; pinning requires a published group.
 */
export const getHelpGroupAvailableActions = (
  group: HelpGroupAdminItem
): HelpGroupAdminAction[] => {
  if (group.deletedAt) {
    return ['restore'];
  }
  if (!group.publishedAt) {
    return ['publish'];
  }
  return ['unpublish', group.pinnedAt ? 'unpin' : 'pin'];
};

export const getHelpGroupPreviewHref = (group: HelpGroupAdminItem) =>
  `/backoffice/groupes/${group.slug}`;
