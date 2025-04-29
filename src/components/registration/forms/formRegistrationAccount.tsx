import { passwordStrength } from 'check-password-strength';
import React from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import { isEmail } from 'validator';
import { Genders, GENDERS_FILTERS } from '@/src/constants/genders';
import { PasswordCriterias } from 'src/components/backoffice/parametres/ParametresLayout/ChangePasswordCard/PasswordCriterias';
import { FormSchema } from 'src/components/forms/FormSchema';
import { SimpleLink } from 'src/components/utils';

export const formRegistrationAccount: FormSchema<{
  firstName: string;
  lastName: string;
  gender: Genders;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  optInNewsletter: boolean;
  acceptCGU: boolean;
}> = {
  id: 'form-registration-account',
  fields: [
    {
      id: 'firstName',
      name: 'firstName',
      component: 'text-input',
      title: 'Prénom *',
      placeholder: 'Entrez votre prénom',
      isRequired: true,
      showLabel: true,
    },
    {
      id: 'lastName',
      name: 'lastName',
      component: 'text-input',
      title: 'Nom *',
      placeholder: 'Entrez votre nom',
      isRequired: true,
      showLabel: true,
    },
    {
      id: 'gender',
      name: 'gender',
      title: 'Genre *',
      component: 'select-simple',
      options: GENDERS_FILTERS,
      isRequired: true,
    },
    {
      id: 'phone',
      name: 'phone',
      component: 'tel-input',
      title: 'Numéro de téléphone*',
      placeholder: 'Entrez votre numéro de téléphone',
      isRequired: true,
      showLabel: true,
      rules: [
        {
          method: (fieldValue) =>
            !!fieldValue && isValidPhoneNumber(fieldValue, 'FR'),
          message: 'Numéro de téléphone invalide',
        },
      ],
    },
    {
      id: 'email',
      name: 'email',
      component: 'text-input',
      title: 'Adresse mail*',
      placeholder: 'Entrez votre adresse mail',
      isRequired: true,
      showLabel: true,
      rules: [
        {
          method: (fieldValue) =>
            isEmail(fieldValue, {
              blacklisted_chars: '"\'`$&*()=[]{};:<>?,\\^',
              allow_utf8_local_part: false,
            }),
          message: 'Adresse e-mail invalide',
        },
      ],
    },
    {
      id: 'password',
      name: 'password',
      type: 'password',
      component: 'text-input',
      title: 'Mot de passe*',
      placeholder: 'Entrez votre mot de passe',
      isRequired: true,
      showLabel: true,
      rules: [
        {
          method: (fieldValue) => passwordStrength(fieldValue).id >= 2,
          message: 'Doit répondre aux critères ci-dessous',
        },
      ],
    },
    {
      id: 'passwordCriteria',
      name: 'passwordCriteria',
      component: 'text',
      title: <PasswordCriterias removeMargin />,
    },
    {
      id: 'confirmPassword',
      name: 'confirmPassword',
      type: 'password',
      component: 'text-input',
      title: 'Confirmation du mot de passe*',
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
            fieldValues.password === fieldValue,
          message: 'Les deux mots de passe ne correspondent pas',
        },
      ],
    },
    {
      id: 'optInNewsletter',
      name: 'optInNewsletter',
      component: 'checkbox',
      title:
        'J’accepte de recevoir des informations et des actualités sur le programme Entourage Pro',
      showLabel: true,
      isRequired: false,
    },
    {
      id: 'acceptCGU',
      name: 'acceptCGU',
      component: 'checkbox',
      title: (
        <>
          J&apos;accepte les&nbsp;
          <SimpleLink href="/cgu" target="_blank">
            Conditions Générales d&apos;Utilisation
          </SimpleLink>
          &nbsp; ainsi que la&nbsp;
          <SimpleLink href="/data-privacy" target="_blank" isExternal>
            Politique de Confidentialité
          </SimpleLink>
          &nbsp; de la plateforme Entourage Pro
        </>
      ),
      showLabel: true,
      isRequired: true,
    },
  ],
};
