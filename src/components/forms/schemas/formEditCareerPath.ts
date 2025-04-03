import { FormSchema } from '../FormSchema';
import { BUSINESS_SECTORS, BusinessSectorValue } from 'src/constants';
import { FilterConstant } from 'src/constants/utils';

export const formEditCareerPath: FormSchema<{
  businessSector0: FilterConstant<BusinessSectorValue>;
  occupation0: string;
  businessSector1: FilterConstant<BusinessSectorValue>;
  occupation1: string;
}> = {
  id: 'form-career-path',
  fields: [
    {
      id: 'carreerPathText0',
      name: 'carreerPathText0',
      component: 'fieldgroup',
      fields: [
        {
          id: 'linkWordIn0',
          name: 'linkWordIn0',
          component: 'text',
          title: 'dans',
        },
        {
          id: 'linkWordLike0',
          name: 'linkWordLike0',
          component: 'text',
          title: 'comme',
        },
      ],
    },
    {
      id: 'carreerPath0',
      name: 'carreerPath0',
      component: 'fieldgroup',
      fields: [
        {
          id: 'businessSector0',
          name: 'businessSector0',
          title: 'Famille de métier 1*',
          component: 'select',
          options: BUSINESS_SECTORS,
          isMulti: false,
          isRequired: true,
        },
        {
          id: 'occupation0',
          name: 'occupation0',
          component: 'text-input',
          title: 'Métier 1',
        },
      ],
    },
    {
      id: 'carreerPathText1',
      name: 'carreerPathText1',
      component: 'fieldgroup',
      fields: [
        {
          id: 'linkWordIn1',
          name: 'linkWordIn1',
          component: 'text',
          title: 'dans',
        },
        {
          id: 'linkWordLike1',
          name: 'linkWordLike1',
          component: 'text',
          title: 'comme',
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
          title: 'Famille de métier 2',
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
