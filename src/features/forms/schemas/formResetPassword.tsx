import { passwordStrength } from 'check-password-strength';
import React from 'react';
import { PasswordCriterias } from '@/src/features/backoffice/parameters/ChangePasswordCard/PasswordCriterias';
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
      placeholder: 'Entrez votre nouveau mot de passe',
      isRequired: true,
      showLabel: true,
      labelTooltip: <PasswordCriterias bare />,
      rules: [
        {
          method: (fieldValue) => {
            return passwordStrength(fieldValue).id >= 2;
          },
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
          method: (fieldValue, fieldValues) => {
            return fieldValues.newPassword === fieldValue;
          },
          message: 'Les deux mots de passe ne correspondent pas',
        },
      ],
    },
  ],
};
