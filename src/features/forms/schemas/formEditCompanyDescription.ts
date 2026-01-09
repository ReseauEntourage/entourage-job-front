import { FormSchema } from '../FormSchema';

export const formEditCompanyDescription: FormSchema<{
  description: string;
}> = {
  id: 'form-company-description',
  fields: [
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      title: 'Description',
      rows: 14,
      maxLength: 1000,
    },
  ],
};
