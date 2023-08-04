import React from 'react';
import { FormSchema } from '../FormSchema';
import { SimpleLink } from 'src/components/utils';
import { EXTERNAL_LINKS } from 'src/constants';
import validator from "validator";

export const formGetEmail: FormSchema = {
  id: 'form-get-email',
  fields: [
    {
      id: 'email',
      name: 'email',
      component: 'text-input',
      type: 'email',
      placeholder: 'Tapez votre adresse mail',
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
