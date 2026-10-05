import React from 'react';
import { useDispatch } from 'react-redux';
import { HelpGroupViewerState } from '@/src/api/types';
import { Button, Text } from '@/src/components/ui';
import { useJoinHelpGroupMutation } from '@/src/use-cases/help-groups';
import { notificationsActions } from '@/src/use-cases/notifications';
import {
  ELEARNING_INVITATION_LABEL,
  ELEARNING_LINK_LABEL,
  ELEARNING_PAGE_HREF,
  JOIN_BUTTON_LABEL,
  JOIN_INVITATION_LABEL,
  WRITE_ERROR_LABELS,
} from '../help-groups-participation.labels';
import { StyledWriteInvitation } from './WriteInvitation.styles';

interface WriteInvitationProps {
  slug: string;
  state: Exclude<HelpGroupViewerState, 'canWrite'>;
  onJoined?: () => void;
}

/**
 * Shown instead of the write actions (composer, reply area, reaction),
 * never as disabled actions: join for an eligible non member, finish the
 * training otherwise (without any join button).
 */
export function WriteInvitation({
  slug,
  state,
  onJoined,
}: WriteInvitationProps) {
  const dispatch = useDispatch();
  const [joinHelpGroup, { isLoading }] = useJoinHelpGroupMutation();

  if (state === 'mustCompleteElearning') {
    return (
      <StyledWriteInvitation data-testid="write-invitation-elearning">
        <Text>{ELEARNING_INVITATION_LABEL}</Text>
        <Button variant="secondary" href={ELEARNING_PAGE_HREF}>
          {ELEARNING_LINK_LABEL}
        </Button>
      </StyledWriteInvitation>
    );
  }

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
    <StyledWriteInvitation data-testid="write-invitation-join">
      <Text>{JOIN_INVITATION_LABEL}</Text>
      <Button
        variant="primary"
        disabled={isLoading}
        onClick={join}
        dataTestId="join-help-group"
      >
        {JOIN_BUTTON_LABEL}
      </Button>
    </StyledWriteInvitation>
  );
}
