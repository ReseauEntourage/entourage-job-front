import { FormSchema } from './FormSchema.types';

export const formEditSkills: FormSchema = {
  id: 'form-skills',
  fields: [
    {
      id: 'skill1',
      name: 'skill1',
      component: 'text-input',
      title: 'Atout 1',
    },
    {
      id: 'skill2',
      name: 'skill2',
      component: 'text-input',
      title: 'Atout 2',
    },
    {
      id: 'skill3',
      name: 'skill3',
      component: 'text-input',
      title: 'Atout 3',
    },
    {
      id: 'skill4',
      name: 'skill4',
      component: 'text-input',
      title: 'Atout 4',
    },
    {
      id: 'skill5',
      name: 'skill5',
      component: 'text-input',
      title: 'Atout 5',
    },
    {
      id: 'skill6',
      name: 'skill6',
      component: 'text-input',
      title: 'Atout 6',
    },
  ],
  rules: [
    {
      field: 'skill1',
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
      field: 'skill2',
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
      field: 'skill3',
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
      field: 'skill4',
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
      field: 'skill5',
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
      field: 'skill6',
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
