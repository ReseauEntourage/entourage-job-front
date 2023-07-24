import { passwordStrength } from 'check-password-strength';

export const formChangePassword = {
  id: 'form-change-pwd',
  fields: [
    {
      id: 'oldPassword',
      name: 'oldPassword',
      type: 'password',
      component: 'text-input',
      title: 'Ancien mot de passe*',
    },
    {
      id: 'newPassword',
      name: 'newPassword',
      type: 'password',
      component: 'text-input',
      title: 'Nouveau mot de passe*',
    },
    {
      id: 'confirmPassword',
      name: 'confirmPassword',
      type: 'password',
      component: 'text-input',
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
