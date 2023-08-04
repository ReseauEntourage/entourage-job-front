import { FormSchema } from '../FormSchema';

export const formEditCatchphrase: FormSchema = {
  id: 'form-catchphrase',
  fields: [
    {
      id: 'catchphrase',
      name: 'catchphrase',
      component: 'text-input',
      title: 'Ce que vous pouvez apporter*',
      maxLength: 80,
    },
  ],
};
