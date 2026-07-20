import { passwordStrength } from 'check-password-strength';
import React from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import { isEmail } from 'validator';
import { SimpleLink } from '@/src/components/ui';
import { Genders, GENDERS_FILTERS } from '@/src/constants/genders';
import { PasswordCriterias } from '@/src/features/backoffice/parameters/ChangePasswordCard/PasswordCriterias';
import { EmailAlreadyUsedInlineLink } from '@/src/features/registration/forms/EmailAlreadyUsedHint';
import { FormSchema } from 'src/features/forms/FormSchema';

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
      id: 'firstNameLastName',
      name: 'firstNameLastName',
      component: 'fieldgroup',
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
      ],
    },
    {
      id: 'genderPhone',
      name: 'genderPhone',
      component: 'fieldgroup',
      fields: [
        {
          id: 'gender',
          name: 'gender',
          title: 'Genre *',
          component: 'select-simple',
          placeholder: 'Sélectionnez votre genre',
          showLabel: true,
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
      renderErrorContent: (error) =>
        error?.type === 'manual' ? <EmailAlreadyUsedInlineLink /> : undefined,
    },
    {
      id: 'password',
      name: 'password',
      type: 'password',
      component: 'text-input',
      title: 'Mot de passe*',
      placeholder: 'Entrez un mot de passe',
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
