export const formContactUs = {
  id: 'form-contactus',
  fields: [
    {
      id: 'email',
      name: 'email',
      component: 'text-input',
      type: 'email',
      title: 'Adresse mail*',
    },
    {
      id: 'text',
      name: 'text',
      component: 'textarea',
      title: 'Message*',
      rows: 7,
    },
    {
      id: 'cgu',
      name: 'cgu',
      component: 'cgu',
    },
  ],
  rules: [
    {
      field: 'email',
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
      field: 'email',
      method: 'isEmail',
      validWhen: true,
      message: 'Adresse e-mail invalide',
    },
    {
      field: 'text',
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
      field: 'text',
      method: 'isLength',
      args: [
        {
          max: 4000,
        },
      ],
      validWhen: true,
      message: '4000 caractères maximum',
    },
    {
      field: 'cgu',
      method: 'equals',
      args: ['true'],
      validWhen: true,
      message: 'Obligatoire',
    },
  ],
};
