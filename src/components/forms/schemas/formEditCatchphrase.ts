import { FormSchema } from '../FormSchema/FormSchema.types';

export const formEditCatchphrase: FormSchema = {
  id: 'form-catchphrase',
  fields: [
    {
      id: 'catchphrase',
      name: 'catchphrase',
      component: 'text-input',
      title: 'Ce que vous pouvez apporter*',
    },
  ],
  rules: [
    {
      field: 'catchphrase',
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
};
