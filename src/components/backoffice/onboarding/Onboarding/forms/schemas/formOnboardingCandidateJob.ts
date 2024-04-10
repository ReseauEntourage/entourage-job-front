import { FormSchema } from 'src/components/forms/FormSchema';
import { BUSINESS_LINES, BusinessLineValue } from 'src/constants';
import { FilterConstant } from 'src/constants/utils';

export const formOnboardingCandidateJob: FormSchema<{
  searchBusinessLine0: FilterConstant<BusinessLineValue>;
  searchAmbition0: string;
  searchBusinessLine1: FilterConstant<BusinessLineValue>;
  searchAmbition1: string;
}> = {
  id: 'form-onboarding-candidate-job',
  fields: [
    {
      id: 'carreerPath0',
      name: 'carreerPath0',
      component: 'fieldgroup',
      fields: [
        {
          id: 'searchBusinessLine0',
          name: 'searchBusinessLine0',
          title: 'Secteur(s) recherché(s)',
          component: 'select',
          showLabel: true,
          options: BUSINESS_LINES,
          isMulti: false,
          isRequired: true,
          placeholder: 'Secteur 1 *',
        },
        {
          id: 'searchAmbition0',
          name: 'searchAmbition0',
          component: 'text-input',
          showLabel: true,
          title: 'Métier(s) recherché(s)',
          placeholder: 'Métier 1',
        },
      ],
    },
    {
      id: 'carreerPath1',
      name: 'carreerPath1',
      component: 'fieldgroup',
      fields: [
        {
          id: 'searchBusinessLine1',
          name: 'searchBusinessLine1',
          title: 'Secteur 2',
          component: 'select',
          isMulti: false,
          options: BUSINESS_LINES,
          rules: [
            {
              method: (fieldValue, fieldValues) => {
                return !!fieldValue || !fieldValues.searchAmbition1;
              },
              message: 'Obligatoire',
            },
          ],
        },
        {
          id: 'searchAmbition1',
          name: 'searchAmbition1',
          component: 'text-input',
          title: 'Métier 2',
        },
      ],
    },
  ],
};
