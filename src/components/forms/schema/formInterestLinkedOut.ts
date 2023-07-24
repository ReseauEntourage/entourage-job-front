import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import { HEARD_ABOUT_FILTERS } from 'src/constants';

export const formInterestLinkedOut = {
  id: 'form-interest',
  fields: [
    {
      id: 'lastName',
      name: 'lastName',
      component: 'text-input',
      title: 'Nom*',
    },
    {
      id: 'firstName',
      name: 'firstName',
      component: 'text-input',
      title: 'Prénom*',
    },
    {
      id: 'email',
      name: 'email',
      type: 'email',
      component: 'text-input',
      title: 'Adresse mail*',
    },
    {
      id: 'phone',
      name: 'phone',
      component: 'tel-input',
      title: 'Téléphone portable',
    },
    {
      id: 'structure',
      name: 'structure',
      component: 'text-input',
      title: 'Structure',
    },
    {
      id: 'message',
      name: 'message',
      component: 'textarea',
      title: 'Votre message*',
      rows: 7,
    },
    {
      id: 'heardAbout',
      name: 'heardAbout',
      component: 'select-simple',
      options: [
        { value: -1, label: 'Choisissez comment vous avez connu LinkedOut' },
        ...HEARD_ABOUT_FILTERS,
      ],
      title: 'Comment avez-vous connu LinkedOut ?',
    },
    {
      id: 'cgu',
      name: 'cgu',
      component: 'cgu',
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
      field: 'message',
      method: 'isLength',
      args: [
        {
          max: 4000,
        },
      ],
      validWhen: true,
      message: '4000 caractères maximum',
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
      field: 'cgu',
      method: 'equals',
      args: ['true'],
      validWhen: true,
      message: 'Obligatoire',
    },
  ],
};
