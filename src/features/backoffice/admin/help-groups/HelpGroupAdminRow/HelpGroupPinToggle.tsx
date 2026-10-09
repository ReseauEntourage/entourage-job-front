import React from 'react';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import {
  getHelpGroupPinAction,
  HELP_GROUP_ADMIN_ACTION_LABELS,
  HELP_GROUP_ADMIN_LABELS,
} from '../helpGroupsAdmin.utils';
import { StyledHelpGroupPinToggle } from './HelpGroupAdminRow.styles';
import { HelpGroupAdminRowProps } from './HelpGroupAdminRow.types';

/**
 * « À la une » toggle: pressed when the group is pinned, disabled on a group
 * which is not published.
 */
export function HelpGroupPinToggle({
  group,
  onAction,
}: HelpGroupAdminRowProps) {
  const pinAction = getHelpGroupPinAction(group);
  const isPinned = !!group.pinnedAt && !!pinAction;
  const label = pinAction
    ? HELP_GROUP_ADMIN_ACTION_LABELS[pinAction]
    : HELP_GROUP_ADMIN_LABELS.pinDisabled;

  return (
    <StyledHelpGroupPinToggle
      type="button"
      aria-pressed={isPinned}
      aria-label={label}
      title={label}
      disabled={!pinAction}
      $isPinned={isPinned}
      data-testid={`help-group-pin-toggle-${group.id}`}
      onClick={() => {
        if (pinAction) {
          onAction(group, pinAction);
        }
      }}
    >
      <LucidIcon name="Pin" size={18} />
    </StyledHelpGroupPinToggle>
  );
}
