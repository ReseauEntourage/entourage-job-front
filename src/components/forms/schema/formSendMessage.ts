import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import { CONTACT_TYPE_FILTERS } from 'src/constants';

export const formSendMessage = {
  id: 'form-send-message',
  fields: [
    {
      component: 'fieldgroup-new',
      fields: [
        {
          id: 'firstName',
          name: 'firstName',
          component: 'text-input',
          title: 'Prénom *',
        },
        {
          id: 'lastName',
          name: 'lastName',
          component: 'text-input',
          title: 'Nom *',
        },
      ],
    },
    {
      id: 'email',
      name: 'email',
      type: 'mail',
      component: 'text-input',
      title: 'Adresse mail *',
    },
    {
      component: 'fieldgroup-new',
      fields: [
        {
          id: 'phone',
          name: 'phone',
          component: 'tel-input',
          title: 'Numéro de téléphone',
        },
        {
          id: 'type',
          name: 'type',
          component: 'select-new',
          options: CONTACT_TYPE_FILTERS,
          title: 'Type de profil',
        },
      ],
    },
    {
      id: 'subject',
      name: 'subject',
      component: 'text-input',
      title: 'Objet *',
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
      field: 'firstName',
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
      field: 'lastName',
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
      field: 'email',
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
      field: 'phone',
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
      field: 'email',
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
