import { FormSchema } from '../FormSchema';

export const formEditTestimonial: FormSchema<{
  name: string;
  status: string;
  text: string;
}> = {
  id: 'form-testimonial',
  fields: [
    {
      id: 'name',
      name: 'name',
      component: 'text-input',
      title: 'Nom *',
      isRequired: true,
      maxLength: 40,
    },
    {
      id: 'status',
      name: 'status',
      component: 'text-input',
      title: 'Statut *',
      isRequired: true,
      maxLength: 80,
    },
    {
      id: 'text',
      name: 'text',
      component: 'textarea',
      title: 'Votre recommandation*',
      isRequired: true,
      maxLength: 4000,
    },
  ],
};
