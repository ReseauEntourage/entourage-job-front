import React from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import validator from 'validator';
import { FormSchema } from '../FormSchema';
import { SimpleLink } from 'src/components/utils';
import { EXTERNAL_LINKS, HEARD_ABOUT_FILTERS } from 'src/constants';

export const formInterestLinkedOut: FormSchema<{
  lastName: 'text-input';
  firstName: 'text-input';
}> = {
  id: 'form-interest',
  fields: [
    {
      id: 'lastName',
      name: 'lastName',
      component: 'text-input',
      title: 'Nom*',
      isRequired: true,
      maxLength: 80,
    },
    {
      id: 'firstName',
      name: 'firstName',
      component: 'text-input',
      title: 'Prénom*',
      isRequired: true,
      maxLength: 80,
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
          method: (fieldValue) => validator.isEmail(fieldValue),

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
          method: (fieldValue) => {
            return (
              !fieldValue ||
              fieldValue.length === 0 ||
              isValidPhoneNumber(fieldValue, 'FR')
            );
          },
          message: 'Numéro de téléphone invalide',
        },
      ],
    },
    {
      id: 'structure',
      name: 'structure',
      component: 'text-input',
      title: 'Structure',
      maxLength: 60,
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
      title: 'Comment avez-vous connu LinkedOut ?',
    },
    {
      id: 'cgu',
      name: 'cgu',
      component: 'checkbox',
      title: (
        <span>
          J&apos;accepte les{' '}
          <SimpleLink
            isExternal
            target="_blank"
            href={EXTERNAL_LINKS.LEGAL_MENTIONS}
          >
            CGU
          </SimpleLink>
        </span>
      ),
      isRequired: true,
    },
  ],
};
