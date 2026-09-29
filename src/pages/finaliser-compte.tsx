import React from 'react';
import { Card } from '@/src/components/ui';
import { SvgIcon } from '@/src/components/ui/SvgIcon/SvgIcon';
import {
  StyledReferingContainer,
  StyledReferingPage,
} from '@/src/features/backoffice/referer/Refering/Refering.styles';
import { FinalizeAccount } from '@/src/features/finalize-account/FinalizeAccount';

const FinalizeAccountPage = () => {
  return (
    <StyledReferingPage>
      <StyledReferingContainer>
        <SvgIcon name="EntourageProLogoPrimary" width={226} height={78} />
        <Card title="Définir votre mot de passe">
          <FinalizeAccount />
        </Card>
      </StyledReferingContainer>
    </StyledReferingPage>
  );
};

export default FinalizeAccountPage;
