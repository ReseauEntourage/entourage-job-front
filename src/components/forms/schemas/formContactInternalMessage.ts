import { FormSchema } from '../FormSchema';

export const formContactInternalMessage: FormSchema<{
  subject: string;
  message: string;
}> = {
  id: 'form-contact-internal-message',
  fields: [
    {
      id: 'subject',
      name: 'subject',
      component: 'text-input',
      title: 'Objet du message :',
      isRequired: true,
      showLabel: true,
      placeholder: ' ',
    },
    {
      id: 'message',
      name: 'message',
      component: 'textarea',
      title: 'Votre message :',
      isRequired: true,
      showLabel: true,
      placeholder: ' ',
    },
  ],
};
