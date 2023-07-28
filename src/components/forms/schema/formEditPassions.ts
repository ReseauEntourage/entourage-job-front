import { FormSchema } from './FormSchema.types';

export const formEditPassions: FormSchema = {
  id: 'form-passions',
  fields: [
    {
      id: 'passion1',
      name: 'passion1',
      component: 'text-input',
      title: 'Passion 1',
    },
    {
      id: 'passion2',
      name: 'passion2',
      component: 'text-input',
      title: 'Passion 2',
    },
    {
      id: 'passion3',
      name: 'passion3',
      component: 'text-input',
      title: 'Passion 3',
    },
    {
      id: 'passion4',
      name: 'passion4',
      component: 'text-input',
      title: 'Passion 4',
    },
    {
      id: 'passion5',
      name: 'passion5',
      component: 'text-input',
      title: 'Passion 5',
    },
    {
      id: 'passion6',
      name: 'passion6',
      component: 'text-input',
      title: 'Passion 6',
    },
  ],
  rules: [
    {
      field: 'passion1',
      method: 'isLength',
      args: [
        {
          max: 40,
        },
      ],
      validWhen: true,
      message: '40 caractères maximum',
    },
    {
      field: 'passion2',
      method: 'isLength',
      args: [
        {
          max: 40,
        },
      ],
      validWhen: true,
      message: '40 caractères maximum',
    },
    {
      field: 'passion3',
      method: 'isLength',
      args: [
        {
          max: 40,
        },
      ],
      validWhen: true,
      message: '40 caractères maximum',
    },
    {
      field: 'passion4',
      method: 'isLength',
      args: [
        {
          max: 40,
        },
      ],
      validWhen: true,
      message: '40 caractères maximum',
    },
    {
      field: 'passion5',
      method: 'isLength',
      args: [
        {
          max: 40,
        },
      ],
      validWhen: true,
      message: '40 caractères maximum',
    },
    {
      field: 'passion6',
      method: 'isLength',
      args: [
        {
          max: 40,
        },
      ],
      validWhen: true,
      message: '40 caractères maximum',
    },
  ],
};
