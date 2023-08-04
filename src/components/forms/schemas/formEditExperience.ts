import { FormSchema } from '../FormSchema';

export const formEditExperience: FormSchema = {
  id: 'form-experience',
  fields: [
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      title: 'Description',
      maxLength: 2000,
    },
    {
      id: 'skills',
      name: 'skills',
      title: 'Compétences',
      component: 'select-creatable',
      isMulti: true,
    },
  ],
};
