import React from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import { FormSchema } from '../FormSchema';
import { SimpleLink } from 'src/components/utils';
import { EXTERNAL_LINKS, HEARD_ABOUT_FILTERS } from 'src/constants';

export const formInterestLinkedOut: FormSchema = {
  id: 'form-interest',
  fields: [
    {
      id: 'lastName',
      name: 'lastName',
      component: 'text-input',
      title: 'Nom*',
      isRequired: true,
      rules: [
        {
          method: 'isLength',
          args: [
            {
              max: 80,
            },
          ],
          validWhen: true,
          message: '80 caractères maximum',
        },
      ],
    },
    {
      id: 'firstName',
      name: 'firstName',
      component: 'text-input',
      title: 'Prénom*',
      isRequired: true,
      rules: [
        {
          method: 'isLength',
          args: [
            {
              max: 80,
            },
          ],
          validWhen: true,
          message: '80 caractères maximum',
        },
      ],
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
          method: 'isEmail',
          validWhen: true,
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
          args: [],
          validWhen: true,
          message: 'Numéro de téléphone invalide',
        },
      ],
    },
    {
      id: 'structure',
      name: 'structure',
      component: 'text-input',
      title: 'Structure',
      rules: [
        {
          method: 'isLength',
          args: [
            {
              max: 60,
            },
          ],
          validWhen: true,
          message: '60 caractères maximum',
        },
      ],
    },
    {
      id: 'message',
      name: 'message',
      component: 'textarea',
      title: 'Votre message*',
      rows: 7,
      isRequired: true,
      rules: [
        {
          method: 'isLength',
          args: [
            {
              max: 4000,
            },
          ],
          validWhen: true,
          message: '4000 caractères maximum',
        },
      ],
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
      rules: [
        {
          method: 'equals',
          args: ['true'],
          validWhen: true,
          message: 'Obligatoire',
        },
      ],
    },
  ],
  rules: [
    // The "rules" array no longer contains "field" properties.
  ],
};
