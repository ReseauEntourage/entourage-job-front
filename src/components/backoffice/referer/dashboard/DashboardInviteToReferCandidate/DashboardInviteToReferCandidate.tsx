import { useRouter } from 'next/router';
import React from 'react';
import { IlluCandidatFolder } from 'assets/icons/icons';
import { Button, Text } from 'src/components/utils';
import { Card } from 'src/components/utils/Cards/Card';
import {
  StyledContainer,
  StyledDescriptionContainer,
} from './DashboardInviteToReferCandidate.styles';

export const DashboardInviteToReferCandidate = () => {
  const router = useRouter();
  const referCandidate = () => {
    router.push('/backoffice/referer/orienter/step-1');
  };
  return (
    <Card
      title="Pré-inscrivez vos candidats"
      subtitle="Facilitez la création de compte de vos candidats en l'aidant à créer son profil"
      centerTitle
    >
      <StyledContainer>
        <StyledDescriptionContainer>
          <IlluCandidatFolder width={136} height={136} />
          <Text>
            Pré-inscrivez un candidat en renseignant ses informations pour
            qu&apos;il puisse accéder à la plateforme Entourage pro.
          </Text>
        </StyledDescriptionContainer>
        <Button
          onClick={referCandidate}
          dataTestId="dashboard-invite-to-refer-btn"
        >
          Orienter un candidat
        </Button>
      </StyledContainer>
    </Card>
  );
};
