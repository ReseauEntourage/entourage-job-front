import React from 'react';
import { StyledProfileGrid, StyledProfileLayout } from '../Backoffice.styles';
import { LayoutBackOffice } from '../LayoutBackOffice';
import { LoadingScreen } from '../LoadingScreen';
import { Section } from 'src/components/utils';
import { useIsDesktop } from 'src/hooks/utils';
import { HeaderProfile } from './HeaderProfile';
import {
  StyledProfileLeftColumn,
  StyledProfileRightColumn,
} from './Profile.styles';
import { ProfileHelpInformationCard } from './ProfileHelpInformationCard';
import { ProfileProfessionalInformationCard } from './ProfileProfessionalInformationCard';
import { useSelectedProfile } from './useSelectedProfile';

export const Profile = () => {
  const { selectedProfile } = useSelectedProfile();
  const isDesktop = useIsDesktop();
  if (selectedProfile) {
    return (
      <LayoutBackOffice
        title={`Profil de ${selectedProfile.firstName} ${selectedProfile.lastName}`}
      >
        <StyledProfileLayout>
          <HeaderProfile />
          <Section className="custom-page">
            <StyledProfileGrid className={`${isDesktop ? '' : 'mobile'}`}>
              <StyledProfileLeftColumn>
                <ProfileProfessionalInformationCard />
                <ProfileHelpInformationCard />
              </StyledProfileLeftColumn>
              <StyledProfileRightColumn>
                {/* <Card title="Contact"><div/></Card> */}
              </StyledProfileRightColumn>
            </StyledProfileGrid>
          </Section>
        </StyledProfileLayout>
      </LayoutBackOffice>
    );
  }
  return <LoadingScreen />;
};
