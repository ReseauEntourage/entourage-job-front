import React from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import {
  IlluBulleQuestion,
  IlluCoachEtCandidat,
  IlluCoeurMainsOuvertesBleu,
  IlluCV,
} from 'assets/icons/icons';
import { Card } from 'src/components/utils/Cards/Card/Card';
import { UserRoles } from 'src/constants/users';
import { selectCurrentUser } from 'src/use-cases/current-user';
import { StyledStepsContainer } from './DashboardNextSteps.styles';
import { Step } from './Step/Step';

export const DashboardNextSteps = () => {
  const iconSizeProps = { width: 80, height: 55 };
  const currentUser = useSelector(selectCurrentUser);

  const webinarStep = {
    title: "S'inscrire au webinaire",
    icon: <IlluBulleQuestion {...iconSizeProps} />,
    content: 'Besoin d’en savoir plus sur la plateforme Entourage Pro ?',
    cta: {
      label: "S'inscrire",
      href: process.env.NEXT_PUBLIC_WEBINAR_URL,
    },
  };

  const stepsByRole = {
    [UserRoles.CANDIDATE]: [
      {
        ...webinarStep,
      },
      {
        title: 'Ajouter mon CV',
        icon: <IlluCV {...iconSizeProps} />,
        content: 'Rendre visible et valoriser votre projet professionnel',
        cta: {
          label: 'Ajouter mon CV',
          href: `/backoffice/parametres`,
        },
      },
      {
        title: 'Découvrir le réseau d’entraide',
        icon: <IlluCoachEtCandidat {...iconSizeProps} />,
        content: 'Retrouvez tous les coachs de la communauté',
        cta: {
          label: 'Contacter un coach',
          href: '/backoffice/annuaire?role=Coach',
        },
      },
    ],
    [UserRoles.COACH]: [
      {
        ...webinarStep,
      },
      {
        title: 'Découvrir le réseau d’entraide',
        icon: <IlluCoachEtCandidat {...iconSizeProps} />,
        content: 'Retrouvez tous les candidats de la communauté',
        cta: {
          label: 'Contacter un candidat',
          href: '/backoffice/annuaire?role=Candidat',
        },
      },
      {
        title: 'Avoir la bonne posture',
        icon: <IlluCoeurMainsOuvertesBleu {...iconSizeProps} />,
        content: 'Lire le document sur la posture Entourage Pro',
        cta: {
          label: 'Lire',
          href: '/conseils-posture',
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
