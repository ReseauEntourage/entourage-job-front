import React from 'react';
import { PublicProfile } from '@/src/api/types';
import { ImgUserProfile } from '@/src/components/ui/Images/ImgProfile/ImgUserProfile/ImgUserProfile';
import { Text } from '@/src/components/ui/Text';
import { UserRoles } from '@/src/constants/users';
import {
  StyledAvatarItem,
  StyledAvatarRow,
  StyledAvatarSkeleton,
  StyledContainer,
  StyledSubtitle,
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
      <Text size={40}>🎉</Text>
      <Text size={36} weight="semibold" color="primaryBlue">
        {isLoading ? '...' : count}
      </Text>
      <Text size="xxlarge" weight="semibold">
        {profileLabel} {actionLabel}
      </Text>
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
        {`Créez votre compte pour pouvoir ${isPlural ? 'les' : 'le'} contacter`}
      </StyledSubtitle>
    </StyledContainer>
  );
};
