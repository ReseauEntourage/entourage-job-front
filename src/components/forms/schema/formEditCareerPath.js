import { AMBITIONS_PREFIXES } from 'src/constants';

export default {
  id: 'form-career-path',
  fields: [
    {
      id: 'ambitions0',
      component: 'fieldgroup',
      childWidths: ['1-4', 'expand'],
      fields: [
        {
          id: 'prefix0',
          name: 'prefix0',
          component: 'select',
          options: [
            { value: -1, label: 'Choissisez un préfixe' },
            ...AMBITIONS_PREFIXES,
          ],
        },
        {
          id: 'careerPath0',
          name: 'careerPath0',
          component: 'input',
          type: 'text',
          title: 'Domaine ou métier 1*',
        },
      ],
    },
    {
      id: 'ambitions1',
      component: 'fieldgroup',
      childWidths: ['1-4', 'expand'],
      fields: [
        {
          id: 'prefix0',
          name: 'prefix1',
          component: 'select',
          disabled: true,
          options: [
            { value: -1, label: 'Choissisez un préfixe' },
            ...AMBITIONS_PREFIXES,
          ],
        },
        {
          id: 'careerPath1',
          name: 'careerPath1',
          component: 'input',
          type: 'text',
          title: 'Domaine ou métier 2',
        },
      ],
    },
  ],
  rules: [
    {
      field: 'prefix0',
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
      field: 'careerPath0',
      method: 'isLength',
      args: [
        {
          max: 32,
        },
      ],
      validWhen: true,
      message: '32 caractères maximum',
    },
    {
      field: 'careerPath0',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    /* {
      field: 'prefix1',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    }, */
    {
      field: 'careerPath1',
      method: 'isLength',
      args: [
        {
          max: 32,
        },
      ],
      validWhen: true,
      message: '32 caractères maximum',
    },
  ],
};
