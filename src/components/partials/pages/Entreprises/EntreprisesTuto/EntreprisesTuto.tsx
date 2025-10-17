import React from 'react';
import { IlluCV, IlluOrdiCV, IlluPoigneeDeMain } from '@/assets/icons/icons';
import { CompanyGoal } from '@/src/constants/company';
import { RowIconTitleText } from '../../../utils/RowIconTitleText';

export type EntreprisesTutoProps = {
  context: CompanyGoal;
};

export const EntreprisesTuto = ({ context }: EntreprisesTutoProps) => {
  const contentsByGoal = {
    recruit: [
      {
        title: 'Inscrivez-vous directement sur le site Entourage Pro',
        paragraph: 'Créez votre compte recruteur et accédez à la plateforme.',
        illu: <IlluOrdiCV width={100} height={100} />,
      },
      {
        title: 'Découvrez les candidat.e.s',
        paragraph:
          'En créant une alerte mail personnalisée ou  en consultant la base des profils',
        illu: <IlluCV width={100} height={100} />,
      },
      {
        title: 'Recrutez à votre rythme en toute autonomie',
        paragraph:
          'Contactez les profils pertinents et menez votre processus habituel de sélection.',
        illu: <IlluPoigneeDeMain width={100} height={100} />,
      },
    ],
    sensibilize: [
      {
        title: 'Inscrivez-vous directement sur le site Entourage Pro',
        paragraph: 'Créez votre compte recruteur et accédez à la plateforme.',
        illu: <IlluOrdiCV width={100} height={100} />,
      },
      {
        title: 'Invitez vos collaborateurs à devenir coachs',
        paragraph:
          'Renseignez le mail de vos collaborateurs pour les inviter à rejoindre la plateforme',
        illu: <IlluCV width={100} height={100} />,
      },
      {
        title: 'Suivez l’impact de vos collaborateurs',
        paragraph:
          'Retrouvez vos collaborateurs et leurs engagements (coups de coups de pouce, candidats accompagnés).',
        illu: <IlluPoigneeDeMain width={100} height={100} />,
      },
    ],
  };

  return (
    <RowIconTitleText
      title="Comment ça marche ?"
      content={contentsByGoal[context]}
      sectionBgColor="hoverBlue"
    />
  );
};
