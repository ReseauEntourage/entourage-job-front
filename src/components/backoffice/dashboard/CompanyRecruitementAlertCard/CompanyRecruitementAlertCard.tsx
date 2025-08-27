import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IlluCV } from '@/assets/icons/icons';
import { openModal } from 'src/components/modals/Modal';
import { Button, Card } from 'src/components/utils';
import {
  fetchRecruitementAlertsAction,
  selectRecruitementAlerts,
  selectFetchRecruitementAlertsLoading,
} from 'src/use-cases/recruitement-alerts';

import { CompanyRecruitementAlertContent } from './CompanyRecruitementAlertContent';
import {
  StyledEmptyRecruitementAlertContainer,
  StyledRecruitementAlertContainer,
} from './CompanyRecruitementAlertContent/CompanyRecruitementAlertContent.styles';
import { CompanyRecruitementAlertModal } from './CompanyRecruitementAlertModal';

export const CompanyRecruitementAlertCard = () => {
  const dispatch = useDispatch();
  const recruitementAlerts = useSelector(selectRecruitementAlerts);
  const isLoading = useSelector(selectFetchRecruitementAlertsLoading);

  useEffect(() => {
    dispatch(fetchRecruitementAlertsAction());
  }, [dispatch]);

  const handleOpenModal = () => {
    openModal(<CompanyRecruitementAlertModal />);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (recruitementAlerts.length > 0) {
    return (
      <Card title="Vos alertes de recrutement" centerTitle>
        <StyledRecruitementAlertContainer>
          {recruitementAlerts.map((alert) => (
            <CompanyRecruitementAlertContent key={alert.name} alert={alert} />
          ))}

          <Button variant="primary" rounded onClick={handleOpenModal}>
            Créer une alerte mail
          </Button>
        </StyledRecruitementAlertContainer>
      </Card>
    );
  }

  return (
    <Card title="Vous avez des besoins de recrutement ?" centerTitle>
      <StyledRecruitementAlertContainer>
        <StyledEmptyRecruitementAlertContainer>
          <IlluCV width={90} height={90} />
          Recevez par mail des profils de candidats qui correspondent à vos
          besoins de recrutement
        </StyledEmptyRecruitementAlertContainer>
        <Button variant="primary" rounded onClick={handleOpenModal}>
          Créer une alerte mail
        </Button>
      </StyledRecruitementAlertContainer>
    </Card>
  );
};
