import React from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import { isEmail } from 'validator';
import { FormSchema } from '../FormSchema';
import { SimpleLink } from 'src/components/utils';
import { HEARD_ABOUT_FILTERS, HeardAboutValue } from 'src/constants';

export const formInterestLinkedOut: FormSchema<{
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  structure: string;
  message: string;
  heardAbout: HeardAboutValue;
  cgu: boolean;
}> = {
  id: 'form-interest',
  fields: [
    {
      id: 'lastName',
      name: 'lastName',
      component: 'text-input',
      title: 'Nom*',
      isRequired: true,
    },
    {
      id: 'firstName',
      name: 'firstName',
      component: 'text-input',
      title: 'Prénom*',
      isRequired: true,
    },
    {
      id: 'email',
      name: 'email',
      type: 'email',
      component: 'text-input',
      title: 'Adresse mail*',
      isRequired: true,
      rules: [
        {
          method: (fieldValue) => isEmail(fieldValue),
          message: 'Adresse e-mail invalide',
        },
      ],
    },
    {
      id: 'phone',
      name: 'phone',
      component: 'tel-input',
      title: 'Téléphone portable',
      rules: [
        {
          method: (fieldValue) =>
            !fieldValue ||
            fieldValue.length === 0 ||
            isValidPhoneNumber(fieldValue, 'FR'),
          message: 'Numéro de téléphone invalide',
        },
      ],
    },
    {
      id: 'structure',
      name: 'structure',
      component: 'text-input',
      title: 'Structure',
    },
    {
      id: 'message',
      name: 'message',
      component: 'textarea',
      title: 'Votre message*',
      rows: 7,
      isRequired: true,
      maxLength: 4000,
    },
    {
      id: 'heardAbout',
      name: 'heardAbout',
      component: 'select-simple',
      options: HEARD_ABOUT_FILTERS,
      title: 'Comment avez-vous connu Entourage Pro ?',
    },
    {
      id: 'cgu',
      name: 'cgu',
      component: 'checkbox',
      title: (
        <span>
          J&apos;accepte les{' '}
          <SimpleLink target="_blank" href="/cgu">
            CGU
          </SimpleLink>
        </span>
      ),
      isRequired: true,
    },
  ],
};
