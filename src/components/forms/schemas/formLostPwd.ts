import { FormSchema } from '../FormSchema/FormSchema.types';

export const formLostPwd: FormSchema = {
  id: 'form-lost-pwd',
  fields: [
    {
      id: 'email',
      name: 'email',
      type: 'email',
      component: 'text-input',
      placeholder: 'Tapez votre adresse mail',
      title: 'Adresse mail*',
      showLabel: true,
    },
  ],
  rules: [
    {
      field: 'email',
      isRequired: true,
    },
    {
      field: 'email',
      method: 'isEmail',
      validWhen: true,
      message: 'Adresse e-mail invalide',
    },
  ],
};
