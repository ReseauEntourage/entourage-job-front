import { FormSchema } from '../FormSchema';
import { BUSINESS_LINES, BusinessLineValue } from 'src/constants';
import { FilterConstant } from 'src/constants/utils';

export const formEditCareerPath: FormSchema<{
  businessLine0: FilterConstant<BusinessLineValue>;
  ambition0: string;
  businessLine1: FilterConstant<BusinessLineValue>;
  ambition1: string;
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
          id: 'businessLine0',
          name: 'businessLine0',
          title: 'Famille de métier 1*',
          component: 'select',
          options: BUSINESS_LINES,
          isMulti: false,
          isRequired: true,
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
          id: 'businessLine1',
          name: 'businessLine1',
          title: 'Famille de métier 2',
          component: 'select',
          isMulti: false,
          options: BUSINESS_LINES,
          rules: [
            {
              method: (fieldValue, fieldValues) => {
                return !!fieldValue || !fieldValues.ambition1;
              },
              message: 'Obligatoire',
            },
          ],
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
