import { FormSchema } from '../FormSchema';
import validator from "validator";

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
      isRequired: true,
      rules: [
        {
          method: (fieldValue) => validator.isEmail(fieldValue),

          message: 'Adresse e-mail invalide',
        },
      ],
    },
  ],
};
