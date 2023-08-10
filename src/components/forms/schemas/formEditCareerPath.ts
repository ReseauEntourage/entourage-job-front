import { FormSchema } from '../FormSchema';
import {
  BUSINESS_LINES,
  BusinessLineValue,
  FilterConstant,
} from 'src/constants';

export const formEditCareerPath: FormSchema<{
  businessLine0: FilterConstant<BusinessLineValue>;
  ambition0: string;
  businessLine1: FilterConstant<BusinessLineValue>;
  ambition1: string;
}> = {
  id: 'form-career-path',
  fields: [
    {
      id: 'carreerPath0',
      name: 'carreerPath0',
      component: 'fieldgroup',
      fields: [
        {
          id: 'businessLine0',
          name: 'businessLine0',
          title: 'Famille de métier 1*',
          component: 'select',
          options: BUSINESS_LINES,
          isRequired: true,
        },
        {
          id: 'linkWord0',
          name: 'linkWord0',
          component: 'text',
          title: 'comme',
        },
        {
          id: 'ambition0',
          name: 'ambition0',
          component: 'text-input',
          title: 'Métier 1',
        },
      ],
    },
    {
      id: 'carreerPath1',
      name: 'carreerPath1',
      component: 'fieldgroup',
      fields: [
        {
          id: 'businessLine1',
          name: 'businessLine1',
          title: 'Famille de métier 2',
          component: 'select',
          options: BUSINESS_LINES,
          rules: [
            {
              method: (fieldValue, fieldValues) => {
                return !(!fieldValue && !!fieldValues.ambition1);
              },
              message: 'Obligatoire',
            },
          ],
        },
        {
          id: 'linkWord1',
          name: 'linkWord1',
          component: 'text',
          title: 'comme',
        },
        {
          id: 'ambition1',
          name: 'ambition1',
          component: 'text-input',
          title: 'Métier 2',
        },
      ],
    },
  ],
};
