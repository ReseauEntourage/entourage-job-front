import { FormSchema } from '../FormSchema';

export const formEditStory: FormSchema<{ story: string }> = {
  id: 'form-story',
  fields: [
    {
      id: 'story',
      name: 'story',
      component: 'textarea',
      title: 'Mon histoire',
      rows: 14,
      maxLines: { lines: 10, width: 655 },
    },
  ],
};
