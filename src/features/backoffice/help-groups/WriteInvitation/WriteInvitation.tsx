import React from 'react';
import { HelpGroupViewerState } from '@/src/api/types';
import { Button, Text } from '@/src/components/ui';
import {
  ELEARNING_INVITATION_LABEL,
  ELEARNING_LINK_LABEL,
  ELEARNING_PAGE_HREF,
  JOIN_INVITATION_LABEL,
} from '../help-groups-participation.labels';
import { JoinHelpGroupButton } from './JoinHelpGroupButton';
import { StyledWriteInvitation } from './WriteInvitation.styles';

interface WriteInvitationProps {
  slug: string;
  state: Exclude<HelpGroupViewerState, 'canWrite'>;
  onJoined?: () => void;
  // On the group page, the join button lives in « À propos de ce groupe »
  withJoinButton?: boolean;
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
  withJoinButton = true,
}: WriteInvitationProps) {
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

  return (
    <StyledWriteInvitation data-testid="write-invitation-join">
      <Text>{JOIN_INVITATION_LABEL}</Text>
      {withJoinButton && (
        <JoinHelpGroupButton slug={slug} onJoined={onJoined} />
      )}
    </StyledWriteInvitation>
  );
}
