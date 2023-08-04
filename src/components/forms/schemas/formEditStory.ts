import { FormSchema } from '../FormSchema';

export const formEditStory: FormSchema = {
  id: 'form-story',
  fields: [
    {
      id: 'story',
      name: 'story',
      component: 'textarea',
      title: 'Mon histoire',
      rows: 14,
      maxLength: 1500,
    },
  ],
};
