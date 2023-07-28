import { FormSchema } from './FormSchema.types';

export const formEditExperience: FormSchema = {
  id: 'form-experience',
  fields: [
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      title: 'Description',
    },
    {
      id: 'skills',
      name: 'skills',
      title: 'Compétences',
      component: 'select-creatable',
      isMulti: true,
    },
  ],
  rules: [
    {
      field: 'description',
      method: 'isLength',
      args: [
        {
          max: 2000,
        },
      ],
      validWhen: true,
      message: '2000 caractères maximum',
    },
  ],
};
