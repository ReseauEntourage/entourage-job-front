import React from 'react';
import { StyledProfileLayout } from '../Backoffice.styles';
import { LayoutBackOffice } from '../LayoutBackOffice';
// import { HeaderProfile } from './HeaderProfile';
import {
  StyledParametresLeftColumn,
  StyledParametresRightColumn,
} from '../parametres/ParametresLayout/ParametresLayout.styles';
import { Section } from 'src/components/utils';
import { useSelectedProfile } from './useSelectedProfile';

export const Profile = () => {
  const { selectedProfile } = useSelectedProfile();
  if (selectedProfile) {
    return (
      <LayoutBackOffice
        title={`Profil de ${selectedProfile.firstName} ${selectedProfile.lastName}`}
      >
        <StyledProfileLayout>
          {/* <HeaderProfile/> */}
          <Section className="custom-page">
            <StyledParametresLeftColumn />
            <StyledParametresRightColumn />
          </Section>
        </StyledProfileLayout>
      </LayoutBackOffice>
    );
  }
  return null;
};
