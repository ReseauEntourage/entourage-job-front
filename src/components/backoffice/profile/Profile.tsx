import React from 'react';
import { useSelector } from 'react-redux';
import {
  StyledBackofficeBackground,
  StyledBackofficeGrid,
} from '../Backoffice.styles';
import { HeaderProfile } from 'src/components/headers/HeaderProfile/HeaderProfile';
import { Section } from 'src/components/utils';
import { useIsDesktop } from 'src/hooks/utils';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import {
  StyledProfileLeftColumn,
  StyledProfileRightColumn,
} from './Profile.styles';
import { ProfileContactCard } from './ProfileContactCard';
import { ProfileHelpInformationCard } from './ProfileHelpInformationCard';
import { ProfileProfessionalInformationCard } from './ProfileProfessionalInformationCard';
import { useSelectSelectedProfile } from './useSelectedProfile';

export interface ProfileProps {
  isEditable?: boolean;
}

export const Profile = ({ isEditable = false }: ProfileProps) => {
  const currentUserId = useSelector(selectCurrentUserId);
  const isDesktop = useIsDesktop();
  const selectedProfile = useSelectSelectedProfile();
  const ownProfile = currentUserId === selectedProfile.id;

  return (
    <StyledBackofficeBackground>
      <HeaderProfile
        id={selectedProfile.id}
        isAvailable={selectedProfile.isAvailable}
        firstName={selectedProfile.firstName}
        lastName={selectedProfile.lastName}
        role={selectedProfile.role}
        department={selectedProfile.department}
        isEditable={isEditable}
      />

      <Section className="custom-page">
        <StyledBackofficeGrid className={`${isDesktop ? '' : 'mobile'}`}>
          <StyledProfileLeftColumn className={`${isDesktop ? '' : 'mobile'}`}>
            <ProfileProfessionalInformationCard />
            <ProfileHelpInformationCard />
          </StyledProfileLeftColumn>
          <StyledProfileRightColumn className={`${isDesktop ? '' : 'mobile'}`}>
            {!ownProfile && <ProfileContactCard />}
          </StyledProfileRightColumn>
        </StyledBackofficeGrid>
      </Section>
    </StyledBackofficeBackground>
  );
};
