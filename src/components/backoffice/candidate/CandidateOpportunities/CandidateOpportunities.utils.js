import React from 'react';
import { USER_ROLES, OPPORTUNITY_FILTERS_DATA } from 'src/constants';
import formEditExternalOpportunity from 'src/components/forms/schema/formEditExternalOpportunity';
import { mutateFormSchema } from 'src/utils';

export const textVariables = {
  title: {
    [USER_ROLES.CANDIDAT]: {
      all: 'Consulter toutes les offres',
      mine: 'Consulter mes offres',
    },
    [USER_ROLES.COACH]: {
      all: '',
      mine: '',
    },
  },
  description: {
    [USER_ROLES.CANDIDAT]: {
      all: (
        <>
          Retrouvez toutes les offres LinkedOut. <br /> Vous pouvez aussi
          ajouter des offres que vous avez trouvé par vous même pour assurer un
          suivi complet de vos candidatures !
        </>
      ),
      mine: (
        <>
          Retrouvez toutes vos offres sauvagedées et les offres recommandées.
          <br /> Vous pouvez aussi ajouter des offres que vous avez trouvé par
          vous même pour assurer un suivi complet de vos candidatures !
        </>
      ),
    },
    [USER_ROLES.COACH]: {
      all: '',
      mine: '',
    },
  },
};

export const candidateSearchFilters = OPPORTUNITY_FILTERS_DATA.filter((el) => {
  return el.key !== 'status';
});

export const mutatedSchema = mutateFormSchema(formEditExternalOpportunity, [
  {
    fieldId: 'startEndContract',
    props: [
      {
        propName: 'hidden',
        value: true,
      },
      {
        propName: 'disabled',
        value: true,
      },
    ],
  },
]);
