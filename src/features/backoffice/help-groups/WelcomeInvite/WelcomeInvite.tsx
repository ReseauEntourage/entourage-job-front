import React from 'react';
import { Text } from '@/src/components/ui';
import {
  formatFirstResponderInvite,
  formatWelcomeInvite,
} from '../help-groups-participation.labels';
import {
  StyledFirstResponderInvite,
  StyledWelcomeInvite,
} from './WelcomeInvite.styles';

interface WelcomeInviteProps {
  firstName: string;
  onClick: () => void;
}

/**
 * Invitation of a new member (less than 7 days, nothing published in the
 * group since joining, computed by the back) to introduce themselves.
 */
export function WelcomeInvite({ firstName, onClick }: WelcomeInviteProps) {
  return (
    <StyledWelcomeInvite
      type="button"
      onClick={onClick}
      data-testid="welcome-invite"
    >
      <Text weight="semibold">{formatWelcomeInvite(firstName)}</Text>
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
