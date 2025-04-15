import React from 'react';
import { OPPORTUNITY_FILTERS_DATA } from 'src/constants';
import { UserRoles } from 'src/constants/users';

export const TextVariables = {
  title: {
    [UserRoles.CANDIDATE]: {
      all: 'Consulter toutes les offres',
      mine: 'Consulter mes offres',
    },
    [UserRoles.COACH]: {
      all: 'Consulter toutes les offres',
      mine: 'Consulter les offres du candidat',
    },
  },
  description: {
    [UserRoles.CANDIDATE]: {
      all: (
        <>
          Retrouvez toutes les offres Entourage Pro.
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
    [UserRoles.COACH]: {
      all: (
        <>
          Retrouvez toutes les offres Entourage Pro.
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
