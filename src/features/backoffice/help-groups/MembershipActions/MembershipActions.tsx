import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/src/components/ui';
import { openModal } from '@/src/features/modals/Modal';
import { ModalConfirm } from '@/src/features/modals/Modal/ModalGeneric/ModalConfirm/ModalConfirm';
import { useLeaveHelpGroupMutation } from '@/src/use-cases/help-groups';
import { notificationsActions } from '@/src/use-cases/notifications';
import {
  JUST_JOINED_LABEL,
  LEAVE_BUTTON_LABEL,
  LEAVE_CONFIRM_TEXT,
  LEAVE_CONFIRM_TITLE,
  WRITE_ERROR_LABELS,
} from '../help-groups-participation.labels';
import {
  StyledJustJoined,
  StyledMembershipActions,
} from './MembershipActions.styles';

interface MembershipActionsProps {
  slug: string;
  // Shown right after joining, until the page is reloaded
  justJoined: boolean;
}

/**
 * Signs of the membership on the group page: leaving after a confirmation
 * which says the group can be joined again at any time.
 */
export function MembershipActions({
  slug,
  justJoined,
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

  return (
    <StyledMembershipActions>
      {justJoined && <StyledJustJoined>{JUST_JOINED_LABEL}</StyledJustJoined>}
      <Button
        variant="text"
        size="small"
        dataTestId="leave-help-group"
        onClick={() =>
          openModal(
            <ModalConfirm
              title={LEAVE_CONFIRM_TITLE}
              text={LEAVE_CONFIRM_TEXT}
              buttonText={LEAVE_BUTTON_LABEL}
              onConfirm={leave}
            />
          )
        }
      >
        {LEAVE_BUTTON_LABEL}
      </Button>
    </StyledMembershipActions>
  );
}
