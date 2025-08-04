import React from 'react';
import { ProgramEligibilityAlert } from '../../utils/Alert/ProgramEligibilityAlert';
import { FormSchema } from 'src/components/forms/FormSchema';
import {
  CANDIDATE_YES_NO_FILTERS,
  CandidateYesNo,
  CandidateYesNoValue,
} from 'src/constants';

export const formRegistrationCandidateEconomicSocialInformation: FormSchema<{
  materialInsecurity: CandidateYesNoValue;
  networkInsecurity: CandidateYesNoValue;
}> = {
  id: 'form-registration-candidate-economic-social-information',
  fields: [
    {
      id: 'materialInsecurityLabel',
      name: 'materialInsecurityLabel',
      title: 'Estimez-vous être en situation de précarité matérielle ?*',
      component: 'heading',
    },
    {
      id: 'materialInsecuritySubLabel',
      name: 'materialInsecurityLabel',
      component: 'text',
      title:
        'Rencontrez-vous des difficultés pour subvenir à vos besoins de base (se loger, se nourrir, ...) ?',
    },
    {
      id: 'materialInsecurity',
      name: 'materialInsecurity',
      component: 'radio',
      showLabel: false,
      isRequired: true,
      options: CANDIDATE_YES_NO_FILTERS.map((option) => ({
        ...option,
        inputId: `material-insecurity-${option.value}`,
      })),
      rules: [
        {
          method: (materialInsecurityValue, formValues) => {
            const { networkInsecurity, materialInsecurity } = formValues;
            return !(
              materialInsecurity === CandidateYesNo.NO &&
              networkInsecurity === CandidateYesNo.NO
            );
          },
          message:
            "Vous devez être en situation d'isolement ou de précarité pour accéder au programme",
        },
      ],
    },
    {
      id: 'networkInsecurityLabel',
      name: 'networkInsecurityLabel',
      title: "Estimez vous être isolé dans votre recherche d'emploi ?*",
      component: 'heading',
    },
    {
      id: 'networkInsecurity',
      name: 'networkInsecurity',
      component: 'radio',
      showLabel: false,
      isRequired: true,
      options: CANDIDATE_YES_NO_FILTERS.map((option) => ({
        ...option,
        inputId: `network-insecurity-${option.value}`,
      })),
      rules: [
        {
          method: (networkInsecurityValue, formValues) => {
            const { networkInsecurity, materialInsecurity } = formValues;
            return !(
              materialInsecurity === CandidateYesNo.NO &&
              networkInsecurity === CandidateYesNo.NO
            );
          },
          message:
            "Vous devez être en situation d'isolement ou de précarité pour accéder au programme",
        },
      ],
    },
    {
      id: 'programEligibilityAlert',
      name: 'programEligibilityAlert',
      component: 'text',
      title: <ProgramEligibilityAlert />,
      hide: (getValue) => {
        const materialInsecurity = getValue('materialInsecurity');
        const networkInsecurity = getValue('networkInsecurity');
        return !(
          materialInsecurity === CandidateYesNo.NO &&
          networkInsecurity === CandidateYesNo.NO
        );
      },
    },
  ],
};
