import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import { FormSchema } from '../FormSchema';
import {
  EXTERNAL_MESSAGE_SUBJECT_FILTERS,
  EXTERNAL_MESSAGE_CONTACT_TYPE_FILTERS,
} from 'src/constants';
import validator from "validator";

export const formSendExternalMessage: FormSchema = {
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
          method: (fieldValue) => validator.isEmail(fieldValue),

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
      title: 'Écrire votre message *',
      isRequired: true,
    },
    {
      id: 'optInContact',
      name: 'optInContact',
      component: 'checkbox',
      title:
        "En cochant cette case, vous acceptez qu'un membre de l'équipe vous recontacte *",
      isRequired: true,
    },
    {
      id: 'optInNewsletter',
      name: 'optInNewsletter',
      component: 'checkbox',
      title: 'Je souhaite être tenu au courant des actualités du projet',
    },
  ],
};
