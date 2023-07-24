import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import {
  EXTERNAL_MESSAGE_SUBJECT_FILTERS,
  EXTERNAL_MESSAGE_CONTACT_TYPE_FILTERS,
} from 'src/constants';

export const formSendExternalMessage = {
  id: 'form-send-external-message',
  fields: [
    {
      component: 'fieldgroup',
      fields: [
        {
          id: 'senderFirstName',
          name: 'senderFirstName',
          component: 'text-input',
          title: 'Prénom *',
        },
        {
          id: 'senderLastName',
          name: 'senderLastName',
          component: 'text-input',
          title: 'Nom *',
        },
      ],
    },
    {
      id: 'senderEmail',
      name: 'senderEmail',
      type: 'mail',
      component: 'text-input',
      title: 'Adresse mail *',
    },
    {
      component: 'fieldgroup',
      fields: [
        {
          id: 'senderPhone',
          name: 'senderPhone',
          component: 'tel-input',
          title: 'Numéro de téléphone',
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
    },
    {
      id: 'message',
      name: 'message',
      component: 'textarea',
      title: 'Écrire votre message *',
    },
    {
      id: 'optInContact',
      name: 'optInContact',
      component: 'checkbox',
      title:
        "En cochant cette case, vous acceptez qu'un membre de l'équipe vous recontacte *",
    },
    {
      id: 'optInNewsletter',
      name: 'optInNewsletter',
      component: 'checkbox',
      title: 'Je souhaite être tenu au courant des actualités du projet',
    },
  ],
  rules: [
    {
      field: 'senderFirstName',
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
      field: 'senderLastName',
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
      field: 'senderEmail',
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
      field: 'senderPhone',
      method: (fieldValue) => {
        return (
          !fieldValue ||
          fieldValue.length === 0 ||
          isValidPhoneNumber(fieldValue, 'FR')
        );
      },
      args: [],
      validWhen: true,
      message: 'Numéro de téléphone invalide',
    },
    {
      field: 'subject',
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
      field: 'message',
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
      field: 'senderEmail',
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
      field: 'optInContact',
      method: (fieldValue) => {
        return !!fieldValue;
      },
      args: [],
      validWhen: true,
      message: 'Obligatoire',
    },
  ],
};
