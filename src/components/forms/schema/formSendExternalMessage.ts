import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import {
  EXTERNAL_MESSAGE_SUBJECT_FILTERS,
  EXTERNAL_MESSAGE_CONTACT_TYPE_FILTERS,
} from 'src/constants';

export const formSendExternalMessage = {
  id: 'form-send-external-message',
  fields: [
    {
      component: 'fieldgroup-new',
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
      component: 'fieldgroup-new',
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
          component: 'select-new',
          options: EXTERNAL_MESSAGE_CONTACT_TYPE_FILTERS,
          title: 'Vous êtes ?',
        },
      ],
    },
    {
      id: 'subject',
      name: 'subject',
      component: 'select-new',
      title: 'Objet *',
      options: EXTERNAL_MESSAGE_SUBJECT_FILTERS,
    },
    {
      id: 'message',
      name: 'message',
      component: 'textarea-new',
      title: 'Écrire votre message *',
    },
    {
      id: 'optIn',
      name: 'optIn',
      component: 'checkbox-new',
      title:
        "En cochant cette case, vous acceptez qu'un membre de l'équipe vous recontacte *",
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
      field: 'optIn',
      method: (fieldValue) => {
        return !!fieldValue;
      },
      args: [],
      validWhen: true,
      message: 'Obligatoire',
    },
  ],
};
