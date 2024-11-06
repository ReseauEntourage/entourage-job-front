import { passwordStrength } from 'check-password-strength';
import { FormSchema } from '../FormSchema';

export const formFinalizeReferedUser: FormSchema<{
  setPassword: string;
  confirmPassword: string;
}> = {
  id: 'form-finalize-refered-user',
  fields: [
    {
      id: 'setPassword',
      name: 'setPassword',
      type: 'password',
      component: 'text-input',
      title: 'Mot de passe',
      placeholder: 'Entrez votre mot de passe',
      isRequired: true,
      showLabel: true,
      rules: [
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
      title: 'Confirmation du mot de passe',
      placeholder: 'Entrez votre mot de passe',
      isRequired: true,
      showLabel: true,
      rules: [
        {
          method: (fieldValue) => passwordStrength(fieldValue).id >= 2,
          message: 'Doit répondre aux critères ci-dessus',
        },
        {
          method: (fieldValue, fieldValues) =>
            fieldValues.setPassword === fieldValue,
          message: 'Les deux mots de passe ne correspondent pas',
        },
      ],
    },
  ],
};
