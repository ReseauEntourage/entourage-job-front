import { useRouter } from 'next/router';
import React from 'react';
import { Button } from '@/src/components/ui';
import { Dropdown } from '@/src/components/ui/Dropdown/Dropdown';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { openModal } from '@/src/features/modals/Modal';
import { DeleteHelpGroupModal, EditHelpGroupModal } from '../HelpGroupModals';
import {
  getHelpGroupMainAction,
  getHelpGroupPreviewHref,
  HELP_GROUP_ADMIN_ACTION_LABELS,
  HELP_GROUP_ADMIN_LABELS,
} from '../helpGroupsAdmin.utils';
import {
  StyledHelpGroupAdminActions,
  StyledHelpGroupMenuItem,
  StyledHelpGroupMenuToggle,
} from './HelpGroupAdminRow.styles';
import { HelpGroupAdminRowProps } from './HelpGroupAdminRow.types';

interface HelpGroupAdminActionsProps extends HelpGroupAdminRowProps {
  // Mobile card: a full width main action and a bordered menu toggle
  isCard?: boolean;
}

/**
 * A single main action (publish, unpublish, or restore in the deleted tab),
 * then a « ⋯ » menu with the secondary actions, the deletion set apart.
 */
export function HelpGroupAdminActions({
  group,
  onAction,
  isCard = false,
}: HelpGroupAdminActionsProps) {
  const router = useRouter();
  const mainAction = getHelpGroupMainAction(group);

  return (
    <StyledHelpGroupAdminActions $isCard={isCard}>
      <Button
        size={isCard ? 'medium' : 'small'}
        variant={mainAction === 'unpublish' ? 'default' : 'secondary'}
        dataTestId={`help-group-${mainAction}-${group.id}`}
        onClick={() => onAction(group, mainAction)}
      >
        {HELP_GROUP_ADMIN_ACTION_LABELS[mainAction]}
      </Button>
      {mainAction !== 'restore' && (
        <Dropdown>
          <Dropdown.Toggle>
            <StyledHelpGroupMenuToggle
              type="button"
              aria-haspopup="menu"
              aria-label={HELP_GROUP_ADMIN_LABELS.formatMoreActions(group.name)}
              data-testid={`help-group-menu-${group.id}`}
              $bordered={isCard}
            >
              <LucidIcon name="Ellipsis" size={18} />
            </StyledHelpGroupMenuToggle>
          </Dropdown.Toggle>
          <Dropdown.Menu openDirection="left">
            <Dropdown.Item
              onClick={() => router.push(getHelpGroupPreviewHref(group))}
            >
              <StyledHelpGroupMenuItem
                data-testid={`help-group-preview-${group.id}`}
              >
                <LucidIcon name="Eye" size={16} />
                {HELP_GROUP_ADMIN_LABELS.preview}
              </StyledHelpGroupMenuItem>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => openModal(<EditHelpGroupModal group={group} />)}
            >
              <StyledHelpGroupMenuItem
                data-testid={`help-group-edit-${group.id}`}
              >
                <LucidIcon name="Pencil" size={16} />
                {HELP_GROUP_ADMIN_LABELS.edit}
              </StyledHelpGroupMenuItem>
            </Dropdown.Item>
            <Dropdown.ItemSeparator />
            <Dropdown.Item
              onClick={() => openModal(<DeleteHelpGroupModal group={group} />)}
            >
              <StyledHelpGroupMenuItem
                $isDanger
                data-testid={`help-group-delete-${group.id}`}
              >
                <LucidIcon name="Trash2" size={16} />
                {HELP_GROUP_ADMIN_LABELS.delete}
              </StyledHelpGroupMenuItem>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </StyledHelpGroupAdminActions>
  );
}
