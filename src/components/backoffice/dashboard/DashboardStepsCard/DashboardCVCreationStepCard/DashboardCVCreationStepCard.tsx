import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IlluCV } from 'assets/icons/icons';
import { useContextualRole } from 'src/components/backoffice/useContextualRole';
import { Button, Card } from 'src/components/utils';
import { CV_STATUS } from 'src/constants';
import { USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useIsDesktop } from 'src/hooks/utils';
import { selectCandidateAsUser } from 'src/use-cases/authentication';
import { selectCurrentCVStatus } from 'src/use-cases/cv';
import {
  StyledDashboardCVCreationStep,
  StyledDashboardCVCreationStepCandidateName,
  StyledDashboardCVCreationStepContent,
  StyledDashboardCVCreationStepContentText,
  StyledDashboardCVCreationStepSubtitle,
} from './DashboardCVCreationStepCard.styles';

export const DashboardCVCreationStepCard = () => {
  const user = useAuthenticatedUser();
  const candidate = useSelector(selectCandidateAsUser);
  const { contextualRole } = useContextualRole(user.role);
  const isDesktop = useIsDesktop();
  const CVStatus = useSelector(selectCurrentCVStatus);

  const textContent = useMemo(
    () => ({
      title: {
        [USER_ROLES.CANDIDATE]: {
          [CV_STATUS.New.value]: 'Première étape - Créer votre CV',
          [CV_STATUS.Progress.value]: 'Finalisez et soumettez votre CV',
          [CV_STATUS.Pending.value]:
            "Votre CV est en cours de validation par l'équipe Entourage Pro",
        },
        [USER_ROLES.COACH]: {
          [CV_STATUS.New
            .value]: `Première étape - Créez le CV de ${candidate?.firstName}`,
          [CV_STATUS.Progress
            .value]: `Finalisez et soumettez le CV de ${candidate?.firstName}`,
          [CV_STATUS.Pending
            .value]: `Le CV de ${candidate?.firstName} est en cours de validation`,
        },
      },
      subTitle: {
        [USER_ROLES.CANDIDATE]: {
          [CV_STATUS.New.value]:
            'Avant de postuler aux offres d’emploi, prenez le temps de réaliser votre CV',
          [CV_STATUS.Progress.value]:
            'Avant de postuler aux offres d’emploi, prenez le temps de finaliser votre CV',
          [CV_STATUS.Pending.value]:
            "L'équipe Entourage Pro est entrain de relire votre CV",
        },
        [USER_ROLES.COACH]: {
          [CV_STATUS.New
            .value]: `Avant de postuler aux offres d’emploi, prenez le temps de réaliser avec ${candidate?.firstName} son CV`,
          [CV_STATUS.Progress
            .value]: `Avant de postuler aux offres d’emploi, prenez le temps de finaliser avec ${candidate?.firstName} son CV`,
          [CV_STATUS.Pending
            .value]: `L'équipe Entourage Pro est entrain de relire le CV de ${candidate?.firstName}`,
        },
      },
      CTA: {
        [USER_ROLES.CANDIDATE]: {
          [CV_STATUS.New.value]: 'Créer mon CV',
          [CV_STATUS.Progress.value]: 'Finaliser mon CV',
          [CV_STATUS.Pending.value]: 'Voir le CV',
        },
        [USER_ROLES.COACH]: {
          [CV_STATUS.New.value]: `Créez le cv de ${candidate?.firstName}`,
          [CV_STATUS.Progress
            .value]: `Finalisez le cv de ${candidate?.firstName}`,
          [CV_STATUS.Pending.value]: 'Voir le CV',
        },
      },
    }),
    [candidate]
  );
  if (!CVStatus || !candidate) return null;
  return (
    <Card title={textContent.title[contextualRole][CVStatus]}>
      <StyledDashboardCVCreationStep>
        <StyledDashboardCVCreationStepSubtitle>
          {textContent.subTitle[contextualRole][CVStatus]}
        </StyledDashboardCVCreationStepSubtitle>
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
              {USER_ROLES.CANDIDATE === contextualRole
                ? 'L’objectif du CV Entourage Pro est de rendre visible et valoriser votre projet professionnel auprès des entreprises mais aussi vos qualités et votre parcours de vie.'
                : 'L’objectif du CV Entourage Pro est de rendre visible et valoriser le projet professionnel du candidat auprès des entreprises mais aussi ses qualités et son parcours de vie.'}
            </p>
          </StyledDashboardCVCreationStepContentText>
        </StyledDashboardCVCreationStepContent>
        <Button
          style="custom-secondary-inverted"
          href={`/backoffice/candidat/${candidate.id}/cv`}
        >
          {textContent.CTA[contextualRole][CVStatus]}
        </Button>
      </StyledDashboardCVCreationStep>
    </Card>
  );
};
