import React from 'react';
import { PublicProfile } from '@/src/api/types';
import { ImgUserProfile } from '@/src/components/ui/Images/ImgProfile/ImgUserProfile/ImgUserProfile';
import { UserRoles } from '@/src/constants/users';
import {
  StyledAvatarItem,
  StyledAvatarRow,
  StyledAvatarSkeleton,
  StyledContainer,
  StyledCount,
  StyledEmoji,
  StyledSubtitle,
  StyledTitle,
} from './NetworkPreviewStep.styles';

interface NetworkPreviewStepProps {
  userRole: UserRoles;
  profiles?: PublicProfile[];
  count?: number;
  isLoading?: boolean;
}

const SKELETON_COUNT = 6;

export const NetworkPreviewStep = ({
  userRole,
  profiles = [],
  count = 0,
  isLoading = false,
}: NetworkPreviewStepProps) => {
  const isCandidate = userRole === UserRoles.CANDIDATE;
  const isPlural = count !== 1;
  const profileLabel = isCandidate
    ? isPlural
      ? 'coachs'
      : 'coach'
    : isPlural
    ? 'candidats'
    : 'candidat';
  const actionLabel = isCandidate
    ? isPlural
      ? 'peuvent vous donner un coup de pouce'
      : 'peut vous donner un coup de pouce'
    : isPlural
    ? 'ont besoin de vous'
    : 'a besoin de vous';

  return (
    <StyledContainer>
      <StyledEmoji>🎉</StyledEmoji>
      <StyledCount>{isLoading ? '...' : count}</StyledCount>
      <StyledTitle>
        {profileLabel} {actionLabel}
      </StyledTitle>
      <StyledAvatarRow>
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
              <StyledAvatarSkeleton key={idx} $index={idx} />
            ))
          : profiles.map((profile, idx) => (
              <StyledAvatarItem key={profile.id} $index={idx}>
                <ImgUserProfile
                  user={profile}
                  hasPicture={profile.hasPicture}
                  size={52}
                />
              </StyledAvatarItem>
            ))}
      </StyledAvatarRow>
      <StyledSubtitle>
        {`Créez votre compte pour pouvoir ${
          isPlural ? 'les' : 'le'
        } contacter, ça prend 30 secondes.`}
      </StyledSubtitle>
    </StyledContainer>
  );
};
