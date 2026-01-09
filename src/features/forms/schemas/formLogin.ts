import { isEmail } from 'validator';
import { FormSchema } from '../FormSchema';

export const formLogin: FormSchema<{
  email: string;
  password: string;
}> = {
  id: 'form-login',
  fields: [
    {
      id: 'email',
      name: 'email',
      type: 'email',
      component: 'text-input',
      placeholder: 'Entrez votre adresse mail',
      title: 'Email*',
      showLabel: true,
      isRequired: true,
      rules: [
        {
          method: (fieldValue) => isEmail(fieldValue),
          message: 'Adresse e-mail invalide',
        },
      ],
    },
    {
      id: 'password',
      name: 'password',
      type: 'password',
      component: 'text-input',
      placeholder: 'Entrez votre mot de passe',
      title: 'Mot de passe*',
      showLabel: true,
      isRequired: true,
    },
  ],
};
