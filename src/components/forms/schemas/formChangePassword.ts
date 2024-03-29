import { passwordStrength } from 'check-password-strength';
import { FormSchema } from '../FormSchema';

export const formChangePassword: FormSchema<{
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}> = {
  id: 'form-change-pwd',
  fields: [
    {
      id: 'oldPassword',
      name: 'oldPassword',
      type: 'password',
      component: 'text-input',
      title: 'Ancien mot de passe*',
      isRequired: true,
    },
    {
      id: 'newPassword',
      name: 'newPassword',
      type: 'password',
      component: 'text-input',
      title: 'Nouveau mot de passe*',
      isRequired: true,
      rules: [
        {
          method: (fieldValue, fieldValues) =>
            !fieldValues.oldPassword || fieldValues.oldPassword !== fieldValue,
          message:
            "Le nouveau mot de passe ne peux pas être le même que l'ancien",
        },
        {
          method: (fieldValue) => passwordStrength(fieldValue).id >= 2,
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
          method: (fieldValue, fieldValues) =>
            fieldValues.newPassword === fieldValue,
          message: 'Les deux mots de passe ne correspondent pas',
        },
      ],
    },
  ],
};
