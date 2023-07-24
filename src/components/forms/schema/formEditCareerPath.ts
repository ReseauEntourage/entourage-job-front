import { BUSINESS_LINES } from 'src/constants';

export const formEditCareerPath = {
  id: 'form-career-path',
  fields: [
    {
      id: 'carreerPath0',
      component: 'fieldgroup',
      fields: [
        {
          id: 'businessLine0',
          name: 'businessLine0',
          title: 'Famille de métier 1*',
          component: 'select',
          options: BUSINESS_LINES,
          isMulti: false,
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
      component: 'fieldgroup',
      fields: [
        {
          id: 'businessLine1',
          name: 'businessLine1',
          title: 'Famille de métier 2',
          component: 'select',
          options: BUSINESS_LINES,
          isMulti: false,
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
  rules: [
    {
      field: 'businessLine0',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'businessLine1',
      method: (fieldValue, state) => {
        return !fieldValue && !!state.ambition1;
      },
      args: [],
      validWhen: false,
      message: 'Obligatoire',
    },
  ],
};
