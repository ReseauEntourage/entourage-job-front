import { FormSchema } from '../FormSchema/FormSchema.types';

export const formEditStory: FormSchema = {
  id: 'form-story',
  fields: [
    {
      id: 'story',
      name: 'story',
      component: 'textarea',
      title: 'Mon histoire',
      rows: 14,
    },
  ],
  rules: [
    {
      field: 'story',
      method: 'isLength',
      args: [
        {
          max: 1500,
        },
      ],
      validWhen: true,
      message: '1500 caractères maximum',
    },
  ],
};
