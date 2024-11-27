import React from 'react';
import { EntourageProLogoPrimary } from 'assets/icons/icons';
import {
  StyledReferingContainer,
  StyledReferingPage,
} from 'src/components/backoffice/referer/Refering/Refering.styles';
import { FinalizeReferedUser } from 'src/components/finalize-refered-user/FinalizeReferedUser';
import { Card } from 'src/components/utils';

const FinalizeReferedUserPage = () => {
  return (
    <StyledReferingPage>
      <StyledReferingContainer>
        <EntourageProLogoPrimary width={226} height={78} />
        <Card title="Définir votre mot de passe">
          <FinalizeReferedUser />
        </Card>
      </StyledReferingContainer>
    </StyledReferingPage>
  );
};

export default FinalizeReferedUserPage;
