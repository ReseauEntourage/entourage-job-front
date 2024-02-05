import React from 'react';
import {
  StyledBackofficeGrid,
  StyledBackofficeBackground,
} from '../Backoffice.styles';
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

export const Profile = () => {
  const isDesktop = useIsDesktop();

  return (
    <StyledBackofficeBackground>
      <HeaderProfile />
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
