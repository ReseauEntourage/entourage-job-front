import React from 'react';
import { isEmail } from 'validator';
import { SimpleLink } from '@/src/components/ui';
import { FormSchema } from '../FormSchema';

export const formGetEmail: FormSchema<{
  email: string;
  cgu: boolean;
}> = {
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
          method: (fieldValue) => isEmail(fieldValue),
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
          J&apos;accepte les&nbsp;
          <SimpleLink target="_blank" href="/cgu">
            CGU
          </SimpleLink>
        </span>
      ),
      isRequired: true,
    },
  ],
};
