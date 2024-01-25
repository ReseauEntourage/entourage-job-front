import React from 'react';
import { StyledProfileGrid, StyledProfileLayout } from '../Backoffice.styles';
import { LayoutBackOffice } from '../LayoutBackOffice';
import { Section } from 'src/components/utils';
import { useIsDesktop } from 'src/hooks/utils';
import { HeaderProfile } from './HeaderProfile';
import {
  StyledProfileLeftColumn,
  StyledProfileRightColumn,
} from './Profile.styles';
import { ProfileContactCard } from './ProfileContactCard';
import { ProfileHelpInformationCard } from './ProfileHelpInformationCard';
import { ProfileProfessionalInformationCard } from './ProfileProfessionalInformationCard';
import { useSelectSectedProfile } from './useSelectedProfile';

export const Profile = () => {
  const selectedProfile = useSelectSectedProfile();
  const isDesktop = useIsDesktop();

    return (
      <LayoutBackOffice
        title={`Profil de ${selectedProfile.firstName} ${selectedProfile.lastName}`}
      >
        <StyledProfileLayout>
          <HeaderProfile />
          <Section className="custom-page">
            <StyledProfileGrid className={`${isDesktop ? '' : 'mobile'}`}>
              <StyledProfileLeftColumn
                className={`${isDesktop ? '' : 'mobile'}`}
              >
                <ProfileProfessionalInformationCard />
                <ProfileHelpInformationCard />
              </StyledProfileLeftColumn>
              <StyledProfileRightColumn
                className={`${isDesktop ? '' : 'mobile'}`}
              >
                <ProfileContactCard />
              </StyledProfileRightColumn>
            </StyledProfileGrid>
          </Section>
        </StyledProfileLayout>
      </LayoutBackOffice>
    );
};
