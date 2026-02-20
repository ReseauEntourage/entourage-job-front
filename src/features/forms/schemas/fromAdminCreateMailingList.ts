import { FormSchema } from '../FormSchema';

export const formAdminCreateMailingList: FormSchema<{
  recipientEmails: string[];
  content: string;
}> = {
  id: 'form-admin-create-mailing-list',
  fields: [
    {
      id: 'recipientEmails',
      name: 'recipientEmails',
      component: 'textarea',
      showLabel: true,
      title:
        'Adresses e-mail des destinataires (séparées par des virgules ou un retour à la ligne) *',
      isRequired: true,
    },

    {
      id: 'content',
      name: 'content',
      showLabel: true,
      component: 'textarea',
      title: 'Contenu du message *',
      placeholder: 'Saisissez le contenu du message',
      rows: 14,
      minLength: 10,
      maxLength: 1200,
      isRequired: true,
    },
    {
      id: 'contentInstructions',
      name: 'contentInstructions',
      component: 'text',
      title:
        'Vous pouvez utiliser les variables suivantes : {{firstName}}, {{lastName}}, {{email}}, {{staffContactName}}.',
    },
  ],
};
