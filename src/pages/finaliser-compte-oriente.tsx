import React from 'react';
import { Card } from '@/src/components/ui';
import { SvgIcon } from '@/src/components/ui/SvgIcon/SvgIcon';
import {
  StyledReferingContainer,
  StyledReferingPage,
} from '@/src/features/backoffice/referer/Refering/Refering.styles';
import { FinalizeReferedUser } from '@/src/features/finalize-refered-user/FinalizeReferedUser';

const FinalizeReferedUserPage = () => {
  return (
    <StyledReferingPage>
      <StyledReferingContainer>
        <SvgIcon name="EntourageProLogoPrimary" width={226} height={78} />
        <Card title="Définir votre mot de passe">
          <FinalizeReferedUser />
        </Card>
      </StyledReferingContainer>
    </StyledReferingPage>
  );
};

export default FinalizeReferedUserPage;
