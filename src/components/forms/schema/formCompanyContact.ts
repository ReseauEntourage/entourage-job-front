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
      type: 'text',
      component: 'input',
      placeholder: 'Tapez votre texte',
      title: 'Votre prénom*',
    },
    {
      id: 'lastName',
      name: 'lastName',
      type: 'text',
      component: 'input',
      placeholder: 'Tapez votre texte',
      title: 'Votre nom*',
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
      id: 'phone',
      name: 'phone',
      component: 'tel',
      placeholder: 'Tapez votre numéro de téléphone portable',
      title: 'Votre numéro de téléphone portable*',
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
      id: 'position',
      name: 'position',
      type: 'text',
      component: 'input',
      placeholder: 'Tapez le nom de votre poste',
      title: 'Votre poste*',
    },
    {
      id: 'zone',
      name: 'zone',
      component: 'select-request',
      placeholder: 'Choisissez votre région',
      options: COMPANY_CONTACT_ZONES_FILTERS,
      title: 'Dans quelle région êtes-vous présent ?*',
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
