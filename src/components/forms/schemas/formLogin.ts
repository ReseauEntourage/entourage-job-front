import { FormSchema } from '../FormSchema/FormSchema.types';

export const formLogin: FormSchema = {
  id: 'form-login',
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
    {
      id: 'password',
      name: 'password',
      type: 'password',
      component: 'text-input',
      placeholder: 'Tapez votre mot de passe',
      title: 'Mot de passe*',
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
    {
      field: 'password',
      isRequired: true,
    },
  ],
};
