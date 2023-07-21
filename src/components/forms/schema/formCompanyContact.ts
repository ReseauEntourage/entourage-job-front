import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import {
  COMPANY_APPROACHES_FILTERS,
  COMPANY_CONTACT_ZONES_FILTERS,
  HEARD_ABOUT_FILTERS,
} from 'src/constants';

export const formCompanyContact = {
  id: 'form-company-contact',
  fields: [
    {
      id: 'firstName',
      name: 'firstName',

      component: 'text-input',

      title: 'Votre prénom*',
    },
    {
      id: 'lastName',
      name: 'lastName',

      component: 'text-input',

      title: 'Votre nom*',
    },
    {
      id: 'approach',
      name: 'approach',
      component: 'select-new',
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
      component: 'text-input',

      title: 'Votre adresse mail*',
    },
    {
      id: 'phone',
      name: 'phone',
      component: 'tel-input',

      title: 'Votre numéro de téléphone portable*',
    },
    {
      id: 'company',
      name: 'company',

      component: 'text-input',

      title: 'Nom de votre entreprise*',
    },
    {
      id: 'position',
      name: 'position',

      component: 'text-input',

      title: 'Votre poste*',
    },
    {
      id: 'zone',
      name: 'zone',
      component: 'select-request',

      options: COMPANY_CONTACT_ZONES_FILTERS,
      title: 'Dans quelle région êtes-vous présent ?*',
    },
    {
      id: 'heardAbout',
      name: 'heardAbout',
      component: 'select-new',

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
      field: 'position',
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
      field: 'zone',
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
