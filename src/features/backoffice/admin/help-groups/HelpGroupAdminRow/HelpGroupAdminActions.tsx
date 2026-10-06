import React from 'react';
import { Button } from '@/src/components/ui';
import { openModal } from '@/src/features/modals/Modal';
import { DeleteHelpGroupModal, EditHelpGroupModal } from '../HelpGroupModals';
import {
  getHelpGroupAvailableActions,
  getHelpGroupPreviewHref,
  HELP_GROUP_ADMIN_ACTION_LABELS,
} from '../helpGroupsAdmin.utils';
import { StyledHelpGroupAdminActions } from './HelpGroupAdminRow.styles';
import { HelpGroupAdminRowProps } from './HelpGroupAdminRow.types';

export function HelpGroupAdminActions({
  group,
  onAction,
}: HelpGroupAdminRowProps) {
  const isDeleted = !!group.deletedAt;

  return (
    <StyledHelpGroupAdminActions>
      {getHelpGroupAvailableActions(group).map((action) => (
        <Button
          key={action}
          size="small"
          variant="secondary"
          dataTestId={`help-group-${action}-${group.id}`}
          onClick={() => onAction(group, action)}
        >
          {HELP_GROUP_ADMIN_ACTION_LABELS[action]}
        </Button>
      ))}
      {!isDeleted && (
        <>
          <Button
            size="small"
            variant="text"
            href={getHelpGroupPreviewHref(group)}
            dataTestId={`help-group-preview-${group.id}`}
          >
            Prévisualiser
          </Button>
          <Button
            size="small"
            variant="text"
            dataTestId={`help-group-edit-${group.id}`}
            onClick={() => openModal(<EditHelpGroupModal group={group} />)}
          >
            Modifier
          </Button>
          <Button
            size="small"
            variant="text"
            dataTestId={`help-group-delete-${group.id}`}
            onClick={() => openModal(<DeleteHelpGroupModal group={group} />)}
          >
            Supprimer
          </Button>
        </>
      )}
    </StyledHelpGroupAdminActions>
  );
}
