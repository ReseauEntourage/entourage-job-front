import React from 'react';
import { ImgUserProfile } from '@/src/components/ui/Images/ImgProfile';
import {
  AVATAR_RING_WIDTH,
  StyledHelpGroupAvatar,
} from './HelpGroupAvatar.styles';

export interface HelpGroupAvatarUser {
  id: string;
  firstName: string;
}

interface HelpGroupAvatarProps {
  // null for a deleted account: a neutral grey disc
  user: HelpGroupAvatarUser | null;
  hasPicture?: boolean;
  size?: number;
}

/**
 * The shared `ImgUserProfile` (picture, or the first initial as in the
 * navigation bar) inside a white ring that keeps overlapping avatars apart.
 */
export function HelpGroupAvatar({
  user,
  hasPicture = false,
  size = 32,
}: HelpGroupAvatarProps) {
  return (
    <StyledHelpGroupAvatar
      $size={size}
      $isPlaceholder={!user}
      data-testid="help-group-avatar"
    >
      {user && (
        <ImgUserProfile
          user={user}
          hasPicture={hasPicture}
          size={size - AVATAR_RING_WIDTH * 2}
        />
      )}
    </StyledHelpGroupAvatar>
  );
}
