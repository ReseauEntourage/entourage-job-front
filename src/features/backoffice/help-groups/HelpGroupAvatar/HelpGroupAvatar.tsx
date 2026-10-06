import React from 'react';
import { LegacyImg } from '@/src/components/ui/Images/LegacyImg';
import { useImageFallback } from '@/src/hooks/useImageFallback';
import {
  StyledHelpGroupAvatar,
  StyledHelpGroupAvatarInitials,
} from './HelpGroupAvatar.styles';

interface HelpGroupAvatarProps {
  userId: string | null;
  // null for a deleted account: a neutral avatar, without initials
  initials: string | null;
  hasPicture?: boolean;
  size?: number;
}

/**
 * Profile picture when the user has one, otherwise their initials.
 */
export function HelpGroupAvatar({
  userId,
  initials,
  hasPicture = false,
  size = 32,
}: HelpGroupAvatarProps) {
  const { urlImg } = useImageFallback({
    userId: userId ?? '',
    hasPicture: hasPicture && !!userId,
  });
  const pictureUrl = hasPicture && userId ? urlImg : null;

  return (
    <StyledHelpGroupAvatar
      $size={size}
      $isPlaceholder={!initials}
      data-testid="help-group-avatar"
    >
      {pictureUrl ? (
        <LegacyImg src={pictureUrl} alt={initials ?? ''} cover />
      ) : (
        <StyledHelpGroupAvatarInitials aria-hidden="true">
          {initials ?? ''}
        </StyledHelpGroupAvatarInitials>
      )}
    </StyledHelpGroupAvatar>
  );
}
