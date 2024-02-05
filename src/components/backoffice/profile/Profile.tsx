import React from 'react';
import {
  StyledBackofficeBackground,
  StyledBackofficeGrid,
} from '../Backoffice.styles';
import { HeaderProfile } from 'src/components/headers/HeaderProfile';
import { Section } from 'src/components/utils';
import { useIsDesktop } from 'src/hooks/utils';
import {
  StyledProfileLeftColumn,
  StyledProfileRightColumn,
} from './Profile.styles';
import { ProfileContactCard } from './ProfileContactCard';
import { ProfileHelpInformationCard } from './ProfileHelpInformationCard';
import { ProfileProfessionalInformationCard } from './ProfileProfessionalInformationCard';
import { useSelectSelectedProfile } from './useSelectedProfile';

export const Profile = () => {
  const isDesktop = useIsDesktop();
  const selectedProfile = useSelectSelectedProfile();

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
      />
      <Section className="custom-page">
        <StyledBackofficeGrid className={`${isDesktop ? '' : 'mobile'}`}>
          <StyledProfileLeftColumn className={`${isDesktop ? '' : 'mobile'}`}>
            <ProfileProfessionalInformationCard />
            <ProfileHelpInformationCard />
          </StyledProfileLeftColumn>
          <StyledProfileRightColumn className={`${isDesktop ? '' : 'mobile'}`}>
            <ProfileContactCard />
          </StyledProfileRightColumn>
        </StyledBackofficeGrid>
      </Section>
    </StyledBackofficeBackground>
  );
};
