import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IlluCV } from 'assets/icons/icons';
import { StyledDashboardCardContentContainer } from '../../Dashboard.styles';
import { useContextualRole } from 'src/components/backoffice/useContextualRole';
import { Button, Card } from 'src/components/utils';
import { CV_STATUS } from 'src/constants';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useIsDesktop } from 'src/hooks/utils';
import { selectCandidateAsUser } from 'src/use-cases/current-user';
import { selectCurrentCVStatus } from 'src/use-cases/cv';
import {
  StyledDashboardCVCreationStepCandidateName,
  StyledDashboardCVCreationStepContent,
  StyledDashboardCVCreationStepContentText,
} from './DashboardCVCreationStepCard.styles';

export const DashboardCVCreationStepCard = () => {
  const user = useAuthenticatedUser();
  const candidate = useSelector(selectCandidateAsUser);
  const { contextualRole } = useContextualRole(user.role);
  const isDesktop = useIsDesktop();
  const cvStatus = useSelector(selectCurrentCVStatus);

  const textContent = useMemo(
    () => ({
      title: {
        [UserRoles.CANDIDATE]: {
          [CV_STATUS.New.value]: 'Première étape - Créer votre CV',
          [CV_STATUS.Progress.value]: 'Finalisez et soumettez votre CV',
          [CV_STATUS.Pending.value]:
            "Votre CV est en cours de validation par l'équipe Entourage Pro",
        },
        [UserRoles.COACH]: {
          [CV_STATUS.New
            .value]: `Première étape - Créez le CV de ${candidate?.firstName}`,
          [CV_STATUS.Progress
            .value]: `Finalisez et soumettez le CV de ${candidate?.firstName}`,
          [CV_STATUS.Pending
            .value]: `Le CV de ${candidate?.firstName} est en cours de validation`,
        },
      },
      subTitle: {
        [UserRoles.CANDIDATE]: {
          [CV_STATUS.New.value]:
            'Avant de postuler aux offres d’emploi, prenez le temps de réaliser votre CV',
          [CV_STATUS.Progress.value]:
            'Avant de postuler aux offres d’emploi, prenez le temps de finaliser votre CV',
          [CV_STATUS.Pending.value]:
            "L'équipe Entourage Pro est entrain de relire votre CV",
        },
        [UserRoles.COACH]: {
          [CV_STATUS.New
            .value]: `Avant de postuler aux offres d’emploi, prenez le temps de réaliser avec ${candidate?.firstName} son CV`,
          [CV_STATUS.Progress
            .value]: `Avant de postuler aux offres d’emploi, prenez le temps de finaliser avec ${candidate?.firstName} son CV`,
          [CV_STATUS.Pending
            .value]: `L'équipe Entourage Pro est entrain de relire le CV de ${candidate?.firstName}`,
        },
      },
      CTA: {
        [UserRoles.CANDIDATE]: {
          [CV_STATUS.New.value]: 'Créer mon CV',
          [CV_STATUS.Progress.value]: 'Finaliser mon CV',
          [CV_STATUS.Pending.value]: 'Voir le CV',
        },
        [UserRoles.COACH]: {
          [CV_STATUS.New.value]: `Créez le cv de ${candidate?.firstName}`,
          [CV_STATUS.Progress
            .value]: `Finalisez le cv de ${candidate?.firstName}`,
          [CV_STATUS.Pending.value]: 'Voir le CV',
        },
      },
    }),
    [candidate]
  );

  if (!candidate) return null;

  return (
    <Card
      title={textContent.title[contextualRole][cvStatus]}
      subtitle={textContent.subTitle[contextualRole][cvStatus]}
      centerTitle
    >
      <StyledDashboardCardContentContainer>
        <StyledDashboardCVCreationStepContent>
          {isDesktop && (
            <div>
              <IlluCV height="140" width="140" />
            </div>
          )}
          <StyledDashboardCVCreationStepContentText>
            <StyledDashboardCVCreationStepCandidateName>
              {candidate?.firstName?.toUpperCase()}{' '}
              {candidate.lastName.toUpperCase()}{' '}
              <span>&#8226; {candidate.userProfile.department}</span>
            </StyledDashboardCVCreationStepCandidateName>
            <p>
              {UserRoles.CANDIDATE === contextualRole
                ? 'L’objectif du CV Entourage Pro est de rendre visible et valoriser votre projet professionnel auprès des entreprises mais aussi vos qualités et votre parcours de vie.'
                : 'L’objectif du CV Entourage Pro est de rendre visible et valoriser le projet professionnel du candidat auprès des entreprises mais aussi ses qualités et son parcours de vie.'}
            </p>
          </StyledDashboardCVCreationStepContentText>
        </StyledDashboardCVCreationStepContent>
        <Button
          variant="primary"
          rounded
          href={`/backoffice/candidat/${candidate.id}/cv`}
        >
          {textContent.CTA[contextualRole][cvStatus]}
        </Button>
      </StyledDashboardCardContentContainer>
    </Card>
  );
};
