import React from 'react';
import { IlluCV, IlluOrdiCV, IlluPoigneeDeMain } from '@/assets/icons/icons';
import { RowIconTitleText } from '../../../utils/RowIconTitleText';

export const EntreprisesTuto = () => {
  return (
    <RowIconTitleText
      title="Comment ça marche ?"
      content={[
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
      ]}
      sectionBgColor="hoverBlue"
    />
  );
};
