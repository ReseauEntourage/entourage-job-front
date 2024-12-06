import React from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import {
  IlluBulleQuestion,
  IlluCoeurMainsOuvertesBleu,
  IlluCV,
} from 'assets/icons/icons';
import { Card } from 'src/components/utils/Cards/Card/Card';
import { USER_ROLES } from 'src/constants/users';
import { useCandidateId } from 'src/hooks/queryParams/useCandidateId';
import { selectCurrentUser } from 'src/use-cases/current-user';
import { StyledStepsContainer } from './DashboardNextSteps.styles';
import { Step } from './Step/Step';

export const DashboardNextSteps = () => {
  const iconSizeProps = { width: 90, height: 90 };
  const candidateId = useCandidateId();
  const currentUser = useSelector(selectCurrentUser);

  const stepsByRole = {
    [USER_ROLES.CANDIDATE]: [
      {
        title: "S'inscrire au webinaire d'information",
        icon: <IlluBulleQuestion {...iconSizeProps} />,
        content:
          'Envie d’en savoir plus sur la plateforme Entourage pro. Inscrivez-vous au prochain webinaire d’information',
        cta: {
          label: "S'inscrire",
          href: '/webinaire-d-information',
        },
      },
      {
        title: 'Faire mon CV Entourage pro',
        icon: <IlluCV {...iconSizeProps} />,
        content:
          'L’objectif du CV Entourage Pro est de rendre visible et valoriser votre projet professionnel',
        cta: {
          label: 'Créer mon CV',
          href: `/backoffice/candidat/${candidateId}/cv`,
        },
      },
      {
        title: 'Découvrir le réseau d’entraide ',
        icon: <IlluCoeurMainsOuvertesBleu {...iconSizeProps} />,
        content:
          'Retrouvez tous les coachs de la communauté et contactez les pour leur demander de l’aide et des conseils',
        cta: {
          label: 'Découvrir',
          href: '/webinaire-d-information',
        },
      },
    ],
    [USER_ROLES.COACH]: [
      {
        title: "S'inscrire au webinaire d'information",
        icon: <IlluBulleQuestion {...iconSizeProps} />,
        content:
          'Envie d’en savoir plus sur la plateforme Entourage pro. Inscrivez-vous au prochain webinaire d’information',
        cta: {
          label: "S'inscrire",
          href: '/webinaire-d-information',
        },
      },
      {
        title: 'Découvrir le réseau d’entraide ',
        icon: <IlluCoeurMainsOuvertesBleu {...iconSizeProps} />,
        content:
          'Retrouvez tous les coachs de la communauté et contactez les pour leur demander de l’aide et des conseils',
        cta: {
          label: 'Découvrir',
          href: '/webinaire-d-information',
        },
      },
    ],
  };

  if (!currentUser || !currentUser.role) {
    return null;
  }

  const steps = stepsByRole[currentUser.role] || [];

  return (
    <Card title="Les prochaines étapes" centerTitle>
      <StyledStepsContainer>
        {steps.map((step) => {
          const uuidValue = uuid();
          return <Step step={step} key={uuidValue} />;
        })}
      </StyledStepsContainer>
    </Card>
  );
};
