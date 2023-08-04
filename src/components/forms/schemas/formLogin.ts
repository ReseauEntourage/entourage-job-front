import { FormSchema } from '../FormSchema';
import validator from "validator";

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
      isRequired: true,
      rules: [
        {
          method: (fieldValue) => validator.isEmail(fieldValue),
          message: 'Adresse e-mail invalide',
        },
      ],
    },
    {
      id: 'password',
      name: 'password',
      type: 'password',
      component: 'text-input',
      placeholder: 'Tapez votre mot de passe',
      title: 'Mot de passe*',
      showLabel: true,
      isRequired: true,
    },
  ],
};
