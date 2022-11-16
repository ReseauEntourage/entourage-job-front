import {
  COMPANY_APPROACHES_FILTERS,
  COMPANY_CONTACT_ZONES_FILTERS,
  HEARD_ABOUT_FILTERS,
} from 'src/constants';
import { isValidPhoneNumber } from 'react-phone-number-input/mobile';

export default {
  id: 'form-company-contact',
  fields: [
    {
      id: 'lastName',
      name: 'lastName',
      type: 'text',
      component: 'input',
      placeholder: 'Tapez votre texte',
      title: 'Votre nom*',
    },
    {
      id: 'firstName',
      name: 'firstName',
      type: 'text',
      component: 'input',
      placeholder: 'Tapez votre texte',
      title: 'Votre prénom*',
    },
    {
      id: 'approach',
      name: 'approach',
      component: 'select',
      options: [
        { value: -1, label: 'Choisissez votre démarche' },
        ...COMPANY_APPROACHES_FILTERS,
      ],
      title: 'Quelle est votre démarche ?*',
    },
    {
      id: 'email',
      name: 'email',
      type: 'email',
      component: 'input',
      placeholder: 'Tapez votre adresse mail',
      title: 'Votre adresse mail*',
    },
    {
      id: 'company',
      name: 'company',
      type: 'text',
      component: 'input',
      placeholder: 'Tapez le nom de votre entreprise',
      title: 'Nom de votre entreprise*',
    },
    {
      id: 'zones',
      name: 'zones',
      component: 'select-request',
      placeholder: 'Choisissez vos régions',
      options: COMPANY_CONTACT_ZONES_FILTERS,
      isMulti: true,
      title: 'Dans quelle(s) région(s) êtes-vous présent ?*',
    },
    {
      id: 'phone',
      name: 'phone',
      component: 'tel',
      placeholder: 'Tapez votre numéro de téléphone portable',
      title: 'Votre numéro de téléphone portable',
    },
    {
      id: 'heardAbout',
      name: 'heardAbout',
      component: 'select',
      placeholder: 'Tapez votre texte',
      options: [
        { value: -1, label: 'Choisissez comment vous avez connu LinkedOut' },
        ...HEARD_ABOUT_FILTERS,
      ],
      title: 'Comment avez-vous connu LinkedOut ?',
    },
  ],
  rules: [
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
      field: 'lastName',
      method: 'isLength',
      args: [
        {
          max: 80,
        },
      ],
      validWhen: true,
      message: '80 caractères maximum',
    },
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
      field: 'firstName',
      method: 'isLength',
      args: [
        {
          max: 80,
        },
      ],
      validWhen: true,
      message: '80 caractères maximum',
    },
    {
      field: 'structure',
      method: 'isLength',
      args: [
        {
          max: 60,
        },
      ],
      validWhen: true,
      message: '60 caractères maximum',
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
      field: 'email',
      method: 'isEmail',
      validWhen: true,
      message: 'Adresse e-mail invalide',
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
      field: 'company',
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
      field: 'approach',
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
      field: 'zones',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
  ],
};
