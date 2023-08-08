import { passwordStrength } from 'check-password-strength';
import { FormSchema } from '../FormSchema';

interface Schema {
  newPassword: string;
  confirmPassword: string;
}
export const formResetPassword: FormSchema = {
  id: 'form-reset-pwd',
  fields: [
    {
      id: 'newPassword',
      name: 'newPassword',
      type: 'password',
      component: 'text-input',
      title: 'Nouveau mot de passe*',
      isRequired: true,
      rules: [
        {
          method: (fieldValue) => {
            return passwordStrength(fieldValue).id >= 2;
          },
          message: 'Doit répondre aux critères ci-dessus',
        },
      ],
    },
    {
      id: 'confirmPassword',
      name: 'confirmPassword',
      type: 'password',
      component: 'text-input',
      title: 'Confirmation du mot de passe*',
      isRequired: true,
      rules: [
        {
          method: (fieldValue) => passwordStrength(fieldValue).id >= 2,
          message: 'Doit répondre aux critères ci-dessus',
        },
        {
          method: (fieldValue, fieldValues) => {
            return fieldValues.newPassword === fieldValue;
          },
          message: 'Les deux mots de passe ne correspondent pas',
        },
      ],
    },
  ],
};
