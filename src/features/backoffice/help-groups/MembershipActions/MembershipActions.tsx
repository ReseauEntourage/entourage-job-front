import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Badge,
  BadgeVariant,
  Button,
  Dropdown,
  LucidIcon,
} from '@/src/components/ui';
import { openModal } from '@/src/features/modals/Modal';
import { ModalConfirm } from '@/src/features/modals/Modal/ModalGeneric/ModalConfirm/ModalConfirm';
import { useLeaveHelpGroupMutation } from '@/src/use-cases/help-groups';
import { notificationsActions } from '@/src/use-cases/notifications';
import {
  HELP_GROUP_ACTIONS_LABEL,
  JUST_JOINED_LABEL,
  LEAVE_BUTTON_LABEL,
  LEAVE_CONFIRM_TEXT,
  LEAVE_CONFIRM_TITLE,
  WRITE_ERROR_LABELS,
} from '../help-groups-participation.labels';
import {
  StyledLeaveMenuItem,
  StyledMembershipActions,
  StyledMembershipMenuToggle,
} from './MembershipActions.styles';

/**
 * « Vous venez de rejoindre », shown right after joining until the page is
 * reloaded.
 */
export function JustJoinedMention() {
  return (
    <Badge
      variant={BadgeVariant.HoverBlue}
      size="small"
      dataTestId="just-joined-mention"
    >
      {JUST_JOINED_LABEL}
    </Badge>
  );
}

interface MembershipActionsProps {
  slug: string;
  // Shown right after joining, until the page is reloaded
  justJoined: boolean;
  // `menu`: in a « ⋯ » menu, below the desktop breakpoint. The mention of
  // the membership is then left to the caller.
  display?: 'button' | 'menu';
}

/**
 * Signs of the membership in the group header: leaving after a confirmation
 * which says the group can be joined again at any time.
 */
export function MembershipActions({
  slug,
  justJoined,
  display = 'button',
}: MembershipActionsProps) {
  const dispatch = useDispatch();
  const [leaveHelpGroup] = useLeaveHelpGroupMutation();

  const leave = async () => {
    const result = await leaveHelpGroup(slug);
    if ('error' in result && result.error) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: WRITE_ERROR_LABELS.leave,
        })
      );
    }
  };

  const confirmLeave = () =>
    openModal(
      <ModalConfirm
        title={LEAVE_CONFIRM_TITLE}
        text={LEAVE_CONFIRM_TEXT}
        buttonText={LEAVE_BUTTON_LABEL}
        onConfirm={leave}
      />
    );

  if (display === 'menu') {
    return (
      <Dropdown>
        <Dropdown.Toggle>
          {/* A real button: reachable and activable from the keyboard */}
          <StyledMembershipMenuToggle
            type="button"
            aria-haspopup="menu"
            aria-label={HELP_GROUP_ACTIONS_LABEL}
            data-testid="help-group-actions-toggle"
          >
            <LucidIcon name="Ellipsis" size={20} />
          </StyledMembershipMenuToggle>
        </Dropdown.Toggle>
        <Dropdown.Menu openDirection="left">
          <Dropdown.Item onClick={confirmLeave}>
            <StyledLeaveMenuItem data-testid="leave-help-group">
              <LucidIcon name="LogOut" size={16} />
              {LEAVE_BUTTON_LABEL}
            </StyledLeaveMenuItem>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  return (
    <StyledMembershipActions>
      {justJoined && <JustJoinedMention />}
      <Button
        variant="default"
        dataTestId="leave-help-group"
        onClick={confirmLeave}
      >
        {LEAVE_BUTTON_LABEL}
      </Button>
    </StyledMembershipActions>
  );
}
