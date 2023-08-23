import { passwordStrength } from 'check-password-strength';
import { FormSchema } from '../FormSchema';

export const formResetPassword: FormSchema<{
  newPassword: string;
  confirmPassword: string;
}> = {
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
