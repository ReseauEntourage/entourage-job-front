import { FormSchema } from 'src/components/forms/FormSchema';
import { BusinessSectorValue, BUSINESS_SECTORS } from 'src/constants';
import { FilterConstant } from 'src/constants/utils';

export const formReferingProfessionalInformation: FormSchema<{
  businessSector0: FilterConstant<BusinessSectorValue>;
  occupation0: string;
  businessSector1: FilterConstant<BusinessSectorValue>;
  occupation1: string;
}> = {
  id: 'form-refering-candidate-professional-information',
  fields: [
    {
      id: 'carreerPath0',
      name: 'carreerPath0',
      component: 'fieldgroup',
      fields: [
        {
          id: 'businessSector0',
          name: 'businessSector0',
          title: 'Secteur(s) recherché(s)',
          component: 'select',
          showLabel: true,
          options: BUSINESS_SECTORS,
          isMulti: false,
          isRequired: true,
          placeholder: 'Secteur 1 *',
        },
        {
          id: 'occupation0',
          name: 'occupation0',
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
          id: 'businessSector1',
          name: 'businessSector1',
          title: 'Secteur 2',
          component: 'select',
          isMulti: false,
          options: BUSINESS_SECTORS,
          rules: [
            {
              method: (fieldValue, fieldValues) => {
                return !!fieldValue || !fieldValues.occupation1;
              },
              message: 'Obligatoire',
            },
          ],
        },
        {
          id: 'occupation1',
          name: 'occupation1',
          component: 'text-input',
          title: 'Métier 2',
        },
      ],
    },
  ],
};
