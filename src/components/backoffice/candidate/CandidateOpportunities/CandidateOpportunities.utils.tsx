import React from 'react';
import { OPPORTUNITY_FILTERS_DATA } from 'src/constants';
import { USER_ROLES } from 'src/constants/users';

export const textVariables = {
  title: {
    [USER_ROLES.CANDIDATE]: {
      all: 'Consulter toutes les offres',
      mine: 'Consulter mes offres',
    },
    [USER_ROLES.COACH]: {
      all: 'Consulter toutes les offres',
      mine: 'Consulter les offres du candidat',
    },
  },
  description: {
    [USER_ROLES.CANDIDATE]: {
      all: (
        <>
          Retrouvez toutes les offres LinkedOut.
          <br /> Vous pouvez aussi ajouter des offres que vous avez trouvé par
          vous même pour assurer un suivi complet de vos candidatures !
        </>
      ),
      mine: (
        <>
          Retrouvez toutes vos offres sauvegardées et les offres recommandées.
          <br /> Vous pouvez aussi ajouter des offres que vous avez trouvé par
          vous même pour assurer un suivi complet de vos candidatures !
        </>
      ),
    },
    [USER_ROLES.COACH]: {
      all: (
        <>
          Retrouvez toutes les offres LinkedOut.
          <br /> Vous pouvez aussi ajouter des offres que vous avez trouvé avec
          votre candidat pour assurer un suivi complet des candidatures !
        </>
      ),
      mine: (
        <>
          Retrouvez toutes les offres sauvegardées du candidat et les offres qui
          lui ont été recommandées.
          <br /> Vous pouvez aussi ajouter des offres que vous avez trouvé avec
          votre candidat pour assurer un suivi complet des candidatures !
        </>
      ),
    },
  },
} as const;

export const candidateSearchFilters = OPPORTUNITY_FILTERS_DATA.filter((el) => {
  return el.key !== 'status';
});
