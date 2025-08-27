import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '@/src/components/utils/Spinner';
import { BackLink } from '../../utils/BackLink';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { StyledBackgroundedHeaderBackoffice } from 'src/components/headers/HeaderBackoffice/HeaderBackoffice.styles';
import { Section } from 'src/components/utils';
import {
  selectFetchRecruitementAlertMatchingLoading,
  fetchRecruitementAlertMatchingAction,
} from 'src/use-cases/recruitement-alerts';
import {
  StyledAlertCandidatesContainer,
  StyledHeaderContainer,
  StyledLoadingContainer,
} from './AlertCandidates.styles';
import { AlertCandidatesList } from './AlertCandidatesList';

interface AlertCandidatesProps {
  alertId: string;
}

export const AlertCandidates = ({ alertId }: AlertCandidatesProps) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectFetchRecruitementAlertMatchingLoading);

  useEffect(() => {
    if (alertId) {
      dispatch(fetchRecruitementAlertMatchingAction(alertId));
    }
  }, [dispatch, alertId]);

  if (isLoading) {
    return (
      <StyledLoadingContainer>
        <Spinner />
      </StyledLoadingContainer>
    );
  }

  if (!alert) {
    return (
      <Section>
        <div>Alerte non trouvée</div>
      </Section>
    );
  }

  return (
    <>
      <StyledBackgroundedHeaderBackoffice>
        <Section className="custom-page">
          <StyledHeaderContainer>
            <BackLink
              url="/backoffice/dashboard"
              label="Retour à mon tableau de bord"
            />
            <HeaderBackoffice
              title={`Candidats correspondant à l'alerte: ${alert.name}`}
              description="Voici les candidats qui correspondent aux critères de votre alerte."
              noSeparator
            />
          </StyledHeaderContainer>
        </Section>
      </StyledBackgroundedHeaderBackoffice>
      <Section className="custom-page">
        <StyledAlertCandidatesContainer>
          <AlertCandidatesList alertId={alertId} />
        </StyledAlertCandidatesContainer>
      </Section>
    </>
  );
};
