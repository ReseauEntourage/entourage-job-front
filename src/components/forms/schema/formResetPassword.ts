import { passwordStrength } from 'check-password-strength';

export const formResetPassword = {
  id: 'form-reset-pwd',
  fields: [
    {
      id: 'newPassword',
      name: 'newPassword',
      type: 'password',
      component: 'input',
      placeholder: 'Tapez votre nouveau mot de passe',
      title: 'Nouveau mot de passe*',
    },
    {
      id: 'confirmPassword',
      name: 'confirmPassword',
      type: 'password',
      component: 'input',
      placeholder: 'Confirmez votre nouveau mot de passe',
      title: 'Confirmation du mot de passe*',
    },
  ],
  rules: [
    {
      field: 'newPassword',
      method: (fieldValue) => {
        return passwordStrength(fieldValue).id >= 2;
      },
      args: [],
      validWhen: true,
      message: 'Doit répondre aux critères ci-dessus',
    },
    {
      field: 'confirmPassword',
      method: (fieldValue) => {
        return passwordStrength(fieldValue).id >= 2;
      },
      args: [],
      validWhen: true,
      message: 'Doit répondre aux critères ci-dessus',
    },
    {
      field: 'confirmPassword',
      method: (fieldValue, state) => {
        return state.newPassword === fieldValue;
      },
      args: [],
      validWhen: true,
      message: 'Les deux mots de passe ne correspondent pas',
    },
  ],
};
