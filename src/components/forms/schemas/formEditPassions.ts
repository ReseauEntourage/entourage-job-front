import { FormSchema } from '../FormSchema';

export const formEditPassions: FormSchema = {
  id: 'form-passions',
  fields: [
    {
      id: 'passion1',
      name: 'passion1',
      component: 'text-input',
      title: 'Passion 1',
                maxLength: 40,
    },
    {
      id: 'passion2',
      name: 'passion2',
      component: 'text-input',
      title: 'Passion 2',
                maxLength: 40,
    },
    {
      id: 'passion3',
      name: 'passion3',
      component: 'text-input',
      title: 'Passion 3',
                maxLength: 40,
    },
    {
      id: 'passion4',
      name: 'passion4',
      component: 'text-input',
      title: 'Passion 4',
                maxLength: 40,
    },
    {
      id: 'passion5',
      name: 'passion5',
      component: 'text-input',
      title: 'Passion 5',
                maxLength: 40,
    },
    {
      id: 'passion6',
      name: 'passion6',
      component: 'text-input',
      title: 'Passion 6',
                maxLength: 40,
    },
  ],
};
