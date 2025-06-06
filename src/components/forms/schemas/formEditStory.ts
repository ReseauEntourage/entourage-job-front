import { FormSchema } from '../FormSchema';

export const formEditIntroduction: FormSchema<{ introduction: string }> = {
  id: 'form-introduction',
  fields: [
    {
      id: 'introduction',
      name: 'introduction',
      component: 'textarea',
      title: 'Mon histoire',
      rows: 14,
      maxLines: { lines: 10, width: 750 },
    },
  ],
};
