import { passwordStrength } from 'check-password-strength';
import React from 'react';
import { PasswordCriterias } from '@/src/features/backoffice/parameters/ChangePasswordCard/PasswordCriterias';
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
      labelTooltip: <PasswordCriterias bare />,
      rules: [
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
      title: 'Confirmation du mot de passe',
      placeholder: 'Entrez votre mot de passe',
      isRequired: true,
      showLabel: true,
      rules: [
        {
          method: (fieldValue) => passwordStrength(fieldValue).id >= 2,
          message: 'Doit répondre aux critères de sécurité',
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
