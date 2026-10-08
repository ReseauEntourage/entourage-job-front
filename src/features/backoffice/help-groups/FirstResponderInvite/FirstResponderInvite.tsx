import React from 'react';
import { Text } from '@/src/components/ui';
import { formatFirstResponderInvite } from '../help-groups-participation.labels';
import { StyledFirstResponderInvite } from './FirstResponderInvite.styles';

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
