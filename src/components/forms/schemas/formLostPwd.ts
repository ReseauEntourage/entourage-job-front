import { isEmail } from 'validator';
import { FormSchema } from '../FormSchema';

export const formLostPwd: FormSchema<{ email: string }> = {
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
      isRequired: true,
      rules: [
        {
          method: (fieldValue) => isEmail(fieldValue),
          message: 'Adresse e-mail invalide',
        },
      ],
    },
  ],
};
