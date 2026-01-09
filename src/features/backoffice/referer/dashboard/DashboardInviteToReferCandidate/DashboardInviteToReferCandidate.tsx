import { useRouter } from 'next/router';
import React from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { Button, Text } from '@/src/components/ui';
import { Card } from '@/src/components/ui/Cards/Card';
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
      title="Pré-inscrivez des candidats"
      subtitle="Facilitez la création de compte des candidats en les aidant à créer leur profil."
      centerTitle
    >
      <StyledContainer>
        <StyledDescriptionContainer>
          <SvgIcon name="IlluCandidatFolder" width={136} height={136} />
          <Text>
            Pré-inscrivez les personnes actuellement en recherche d’emploi que
            vous accompagnez avec votre structure pour qu’ils puissent accéder à
            la plateforme Entourage Pro.
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
