import React from 'react';
import { Button, Text } from '@/src/components/ui';
import {
  formatFirstResponderInvite,
  formatWelcomeInviteTitle,
  WELCOME_INVITE_BUTTON_LABEL,
  WELCOME_INVITE_TEXT,
} from '../help-groups-participation.labels';
import {
  StyledFirstResponderInvite,
  StyledWelcomeInvite,
  StyledWelcomeInviteText,
} from './WelcomeInvite.styles';

interface WelcomeInviteProps {
  firstName: string;
  onClick: () => void;
}

/**
 * Invitation of a new member (less than 7 days, nothing published in the
 * group since joining, computed by the back) to introduce themselves:
 * « Me présenter » opens the composer.
 */
export function WelcomeInvite({ firstName, onClick }: WelcomeInviteProps) {
  return (
    <StyledWelcomeInvite
      aria-label={WELCOME_INVITE_BUTTON_LABEL}
      data-testid="welcome-invite"
    >
      <StyledWelcomeInviteText>
        <Text size="large" weight="semibold">
          {formatWelcomeInviteTitle(firstName)}
        </Text>
        <Text color="darkGray">{WELCOME_INVITE_TEXT}</Text>
      </StyledWelcomeInviteText>
      <Button
        variant="secondary"
        onClick={onClick}
        dataTestId="welcome-invite-button"
      >
        {WELCOME_INVITE_BUTTON_LABEL}
      </Button>
    </StyledWelcomeInvite>
  );
}

interface FirstResponderInviteProps {
  authorFirstName: string;
}

/**
 * Positive call to answer a discussion without any reply, naming its
 * author: never a wording about the absence of replies.
 */
export function FirstResponderInvite({
  authorFirstName,
}: FirstResponderInviteProps) {
  return (
    <StyledFirstResponderInvite data-testid="first-responder-invite">
      <Text>{formatFirstResponderInvite(authorFirstName)}</Text>
    </StyledFirstResponderInvite>
  );
}

/**
 * The first responder invite is shown to a member allowed to write, who is
 * not the author, on a discussion without any visible reply.
 */
export const shouldShowFirstResponderInvite = ({
  canWrite,
  isAuthor,
  repliesCount,
  authorFirstName,
}: {
  canWrite: boolean;
  isAuthor: boolean;
  repliesCount: number;
  authorFirstName: string | null;
}) => canWrite && !isAuthor && repliesCount === 0 && !!authorFirstName;
