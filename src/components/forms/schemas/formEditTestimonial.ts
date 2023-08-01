import { FormSchema } from '../FormSchema/FormSchema.types';

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
      isRequired: true,
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
      isRequired: true,
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
      isRequired: true,
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
