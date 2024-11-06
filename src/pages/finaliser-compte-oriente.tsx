import React from 'react';
import { EntourageProLogoPrimary } from 'assets/icons/icons';

import { FinalizeReferedUserContainer } from 'src/components/finalize-refered-user/FinalizeReferedUserContainer';
import { StyledRegistrationLogoContainer } from 'src/components/finalize-refered-user/FinalizeReferedUserContainer/FinalizeReferedUserContainer.styles';
import { StyledRegistrationContainer } from 'src/components/registration/Registration.styles';
import { Card, Section } from 'src/components/utils';

const FinalizeReferedUserPage = () => {
  return (
    <Section container="small" style="default" size="small">
      <StyledRegistrationLogoContainer>
        <EntourageProLogoPrimary width={180} height={60} />
      </StyledRegistrationLogoContainer>
      <StyledRegistrationContainer>
        <Card>
          <FinalizeReferedUserContainer />
        </Card>
      </StyledRegistrationContainer>
    </Section>
  );
};

export default FinalizeReferedUserPage;
