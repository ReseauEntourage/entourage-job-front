import React from 'react';

import { IlluCV } from '@/assets/icons/icons';
import { openModal } from 'src/components/modals/Modal';
import { Button, Card } from 'src/components/utils';
import {
  StyledDashboardCardContent,
  StyledRecruitementAlertContainer,
} from './CompanyRecruitementAlertCard.styles';
import { CompanyRecruitementAlertModal } from './CompanyRecruitementAlertModal';

export const CompanyRecruitementAlertCard = () => {
  const handleOpenModal = () => {
    openModal(<CompanyRecruitementAlertModal />);
  };

  return (
    <Card title="Vous avez des besoins de recrutement ?" centerTitle>
      <StyledRecruitementAlertContainer>
        <StyledDashboardCardContent>
          <IlluCV width={90} height={90} />
          Recevez par mail des profils de candidats qui correspondent à vos
          besoins de recrutement
        </StyledDashboardCardContent>
        <Button variant="primary" rounded onClick={handleOpenModal}>
          Créer une alerte mail
        </Button>
      </StyledRecruitementAlertContainer>
    </Card>
  );
};
