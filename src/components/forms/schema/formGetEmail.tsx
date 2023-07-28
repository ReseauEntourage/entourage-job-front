import React from 'react';
import { EXTERNAL_LINKS } from '../../../constants';
import { SimpleLink } from '../../utils';
import { FormSchema } from './FormSchema.types';

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
    },
  ],
  rules: [
    {
      field: 'email',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'email',
      method: 'isEmail',
      validWhen: true,
      message: 'Adresse e-mail invalide',
    },
    {
      field: 'cgu',
      method: 'equals',
      args: ['true'],
      validWhen: true,
      message: 'Obligatoire',
    },
  ],
};
