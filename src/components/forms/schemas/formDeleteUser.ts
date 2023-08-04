import validator from 'validator';
import { FormSchema } from '../FormSchema';

export const formDeleteUser: FormSchema = {
  id: 'form-delete-user',
  fields: [
    {
      id: 'confirmation',
      name: 'confirmation',
      component: 'text-input',
      title:
        'Tapez le mot "SUPPRIMER" pour confirmer la suppression de l\'utilisateur*',
      placeholder: 'Tapez le mot "SUPPRIMER"',
      isRequired: true,
      rules: [
        {
          method: (fieldValue) => validator.equals(fieldValue, 'SUPPRIMER'),
          message: 'Confirmation non valide',
        },
      ],
    },
  ],
};
