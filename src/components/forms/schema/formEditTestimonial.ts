import { FormSchema } from './FormSchema.types';

export const formEditTestimonial: FormSchema = {
  id: 'form-testimonial',
  fields: [
    {
      id: 'name',
      name: 'name',
      component: 'text-input',
      title: 'Nom *',
    },
    {
      id: 'status',
      name: 'status',
      component: 'text-input',
      title: 'Statut *',
    },
    {
      id: 'text',
      name: 'text',
      component: 'textarea',
      title: 'Votre recommandation*',
    },
  ],
  rules: [
    {
      field: 'name',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'name',
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
      field: 'status',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'status',
      method: 'isLength',
      args: [
        {
          max: 100,
        },
      ],
      validWhen: true,
      message: '100 caractères maximum',
    },
    {
      field: 'text',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'text',
      method: 'isLength',
      args: [
        {
          max: 4000,
        },
      ],
      validWhen: true,
      message: '4000 caractères maximum',
    },
  ],
};
