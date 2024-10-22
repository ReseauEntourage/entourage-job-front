import React from 'react';
import { useSelector } from 'react-redux';
import {
  StyledBackofficeBackground,
  StyledBackofficeGrid,
} from '../Backoffice.styles';
import { HeaderProfile } from 'src/components/headers/HeaderProfile';
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

export const Profile = () => {
  const currentUserId = useSelector(selectCurrentUserId);
  const isDesktop = useIsDesktop();
  const selectedProfile = useSelectSelectedProfile();
  const ownProfile = currentUserId === selectedProfile.id;

  return (
    <StyledBackofficeBackground>
      <HeaderProfile
        id={selectedProfile.id}
        firstName={selectedProfile.firstName}
        lastName={selectedProfile.lastName}
        description={selectedProfile.description}
        role={selectedProfile.role}
        department={selectedProfile.department}
        isAvailable={selectedProfile.isAvailable}
        isEditable={false}
        cvUrl={selectedProfile.cvUrl}
        hasExternalCv={selectedProfile.hasExternalCv}
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
