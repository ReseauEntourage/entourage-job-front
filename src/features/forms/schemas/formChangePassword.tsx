import { passwordStrength } from 'check-password-strength';
import React from 'react';
import { PasswordCriterias } from '@/src/features/backoffice/parameters/ChangePasswordCard/PasswordCriterias';
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
      placeholder: 'Entrez votre ancien mot de passe',
      isRequired: true,
      showLabel: true,
    },
    {
      id: 'newPassword',
      name: 'newPassword',
      type: 'password',
      component: 'text-input',
      title: 'Nouveau mot de passe*',
      placeholder: 'Entrez votre nouveau mot de passe',
      isRequired: true,
      showLabel: true,
      labelTooltip: <PasswordCriterias bare />,
      rules: [
        {
          method: (fieldValue, fieldValues) =>
            !fieldValues.oldPassword || fieldValues.oldPassword !== fieldValue,
          message:
            "Le nouveau mot de passe ne peux pas être le même que l'ancien",
        },
        {
          method: (fieldValue) => passwordStrength(fieldValue).id >= 2,
          message: 'Doit répondre aux critères de sécurité',
        },
      ],
    },
    {
      id: 'confirmPassword',
      name: 'confirmPassword',
      type: 'password',
      component: 'text-input',
      title: 'Confirmation du mot de passe*',
      placeholder: 'Confirmez votre nouveau mot de passe',
      isRequired: true,
      showLabel: true,
      rules: [
        {
          method: (fieldValue) => passwordStrength(fieldValue).id >= 2,
          message: 'Doit répondre aux critères de sécurité',
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
