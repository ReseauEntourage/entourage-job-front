import React from 'react';
import { AvailabilityTag } from 'src/components/ui/AvailabilityTag';
import { SuggestedProfile } from 'src/use-cases/wizard/wizard.types';
import {
  StyledAvatar,
  StyledCoachCard,
  StyledInfo,
  StyledMeta,
  StyledName,
} from './CoachCard.styles';

interface CoachCardProps {
  profile: SuggestedProfile;
}

export const CoachCard = ({ profile }: CoachCardProps) => {
  const initials = [profile.firstName[0], profile.lastName[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase();

  const meta = [profile.mainSector, profile.city].filter(Boolean).join(' · ');

  return (
    <StyledCoachCard>
      <StyledAvatar>{initials}</StyledAvatar>
      <StyledInfo>
        <StyledName>
          {profile.firstName} {profile.lastName}
        </StyledName>
        {meta && <StyledMeta>{meta}</StyledMeta>}
      </StyledInfo>
      <AvailabilityTag isAvailable={profile.isAvailable} />
    </StyledCoachCard>
  );
};
