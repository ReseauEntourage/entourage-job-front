import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/src/components/ui';
import { useJoinHelpGroupMutation } from '@/src/use-cases/help-groups';
import { notificationsActions } from '@/src/use-cases/notifications';
import {
  JOIN_BUTTON_LABEL,
  WRITE_ERROR_LABELS,
} from '../help-groups-participation.labels';

interface JoinHelpGroupButtonProps {
  slug: string;
  onJoined?: () => void;
}

/**
 * "Rejoindre le groupe": the explicit gesture which opens writing in a
 * group, offered to an eligible non member only.
 */
export function JoinHelpGroupButton({
  slug,
  onJoined,
}: JoinHelpGroupButtonProps) {
  const dispatch = useDispatch();
  const [joinHelpGroup, { isLoading }] = useJoinHelpGroupMutation();

  const join = async () => {
    const result = await joinHelpGroup(slug);
    if ('error' in result && result.error) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: WRITE_ERROR_LABELS.join,
        })
      );
      return;
    }
    onJoined?.();
  };

  return (
    <Button
      variant="primary"
      disabled={isLoading}
      onClick={join}
      dataTestId="join-help-group"
    >
      {JOIN_BUTTON_LABEL}
    </Button>
  );
}
