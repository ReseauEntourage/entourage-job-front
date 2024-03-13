import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import { isEmail } from 'validator';
import { FormSchema } from '../FormSchema';
import {
  EXTERNAL_MESSAGE_SUBJECT_FILTERS,
  EXTERNAL_MESSAGE_CONTACT_TYPE_FILTERS,
  ExternalMessageSubject,
  ExternalMessageContactType,
  ExternalMessageSubjects,
} from 'src/constants';

export const formSendExternalMessage: FormSchema<{
  senderFirstName: string;
  senderLastName: string;
  senderEmail: string;
  senderPhone: string;
  type: ExternalMessageContactType;
  subject: ExternalMessageSubject;
  message: string;
}> = {
  id: 'form-send-external-message',
  fields: [
    {
      id: 'senderInfo',
      name: 'senderInfo',
      component: 'fieldgroup',
      fields: [
        {
          id: 'senderFirstName',
          name: 'senderFirstName',
          component: 'text-input',
          title: 'Prénom *',
          isRequired: true,
        },
        {
          id: 'senderLastName',
          name: 'senderLastName',
          component: 'text-input',
          title: 'Nom *',
          isRequired: true,
        },
      ],
    },
    {
      id: 'senderEmail',
      name: 'senderEmail',
      type: 'email',
      component: 'text-input',
      title: 'Adresse mail *',
      isRequired: true,
      rules: [
        {
          method: (fieldValue) => isEmail(fieldValue),
          message: 'Adresse e-mail invalide',
        },
      ],
    },
    {
      id: 'senderPhoneType',
      name: 'senderPhoneType',
      component: 'fieldgroup',
      fields: [
        {
          id: 'senderPhone',
          name: 'senderPhone',
          component: 'tel-input',
          title: 'Numéro de téléphone',
          rules: [
            {
              method: (fieldValue) =>
                !fieldValue ||
                fieldValue.length === 0 ||
                isValidPhoneNumber(fieldValue, 'FR'),
              message: 'Numéro de téléphone invalide',
            },
          ],
        },
        {
          id: 'type',
          name: 'type',
          component: 'select-simple',
          options: EXTERNAL_MESSAGE_CONTACT_TYPE_FILTERS,
          title: 'Vous êtes ?',
        },
      ],
    },
    {
      id: 'subject',
      name: 'subject',
      component: 'select-simple',
      title: 'Objet *',
      options: EXTERNAL_MESSAGE_SUBJECT_FILTERS,
      isRequired: true,
    },
    {
      id: 'message',
      name: 'message',
      component: 'textarea',
      title: (getValue) => {
        if (getValue('subject') === ExternalMessageSubjects.HIRING) {
          return 'Dites-lui en plus sur le(s) poste(s). N’oubliez pas de mentionner le(s) types de contrat et la localisation.';
        }
        return 'Écrire votre message *';
      },
      isRequired: true,
    },
    {
      id: 'disclaimer',
      name: 'disclaimer',
      component: 'text',
      title:
        "En continuant, j’accepte que mon message soit modéré par l'équipe Entourage Pro afin de protéger les candidats d'éventuels messages indésirables",
    },
  ],
};
