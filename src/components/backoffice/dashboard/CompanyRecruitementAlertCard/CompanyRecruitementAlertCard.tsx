import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IlluCV } from '@/assets/icons/icons';
import { openModal } from 'src/components/modals/Modal';
import { Button, Card, Text } from 'src/components/utils';
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
    // On ne charge les alertes que si elles ne sont pas déjà présentes dans le store
    // Elles sont refresh automatiquement après chaque création/suppression
    if (recruitementAlerts.length === 0) {
      dispatch(fetchRecruitementAlertsAction());
    }
  }, [dispatch, recruitementAlerts.length]);

  const handleOpenModal = () => {
    openModal(<CompanyRecruitementAlertModal />);
  };

  if (isLoading) {
    return null;
  }

  if (recruitementAlerts.length > 0) {
    return (
      <Card title="Vos alertes de recrutement" centerTitle>
        <StyledRecruitementAlertContainer>
          {recruitementAlerts.map((alert) => (
            <CompanyRecruitementAlertContent key={alert.id} alert={alert} />
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
          <Text textAlign="center">
            Recevez par mail des profils de candidats qui correspondent à vos
            besoins de recrutement
          </Text>
        </StyledEmptyRecruitementAlertContainer>
        <Button variant="primary" rounded onClick={handleOpenModal}>
          Créer une alerte mail
        </Button>
      </StyledRecruitementAlertContainer>
    </Card>
  );
};
