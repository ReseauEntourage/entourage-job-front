import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { CONTRACTS } from 'src/constants';
import { isValidPhoneNumber } from 'react-phone-number-input/mobile';

export default {
  id: 'form-usefullinformation',
  fields: [
    {
      id: 'email',
      name: 'email',
      type: 'email',
      component: 'input',
      placeholder: "Tapez l'adresse mail",
      title: 'Adresse mail',
    },
    {
      id: 'phone',
      name: 'phone',
      component: 'tel',
      placeholder: 'Tapez le numéro de téléphone portable',
      title: 'Numéro de téléphone portable*',
    },
    {
      id: 'address',
      name: 'address',
      component: 'input',
      type: 'text',
      placeholder: "Tapez l'adresse postale",
      title: 'Adresse postale',
    },
    {
      id: 'private',
      name: 'private',
      component: 'text',
      title:
        "L'adresse mail, le numéro de téléphone et l'adresse postale ne seront visibles que sur la version PDF du CV",
    },
    {
      id: 'contracts',
      name: 'contracts',
      title: 'Type de contrat recherché',
      component: 'select-request',
      options: CONTRACTS,
      isMulti: true,
    },
    {
      id: 'locations',
      name: 'locations',
      title: 'Départements de travail souhaités',
      component: 'select-request',
      openMenuOnClick: false,
      options: DEPARTMENTS_FILTERS,
      isMulti: true,
    },
    {
      id: 'availability',
      name: 'availability',
      component: 'input',
      type: 'text',
      title: 'Disponibilités de travail possibles',
    },
    {
      id: 'languages',
      name: 'languages',
      title: 'Langues parlées',
      component: 'select-request-creatable',
      isMulti: true,
    },
    {
      id: 'transport',
      name: 'transport',
      component: 'input',
      type: 'text',
      title: 'Permis de conduire',
    },
  ],
  rules: [
    {
      field: 'contracts',
      method: 'isLength',
      args: [
        {
          max: 120,
        },
      ],
      validWhen: true,
      message: '120 caractères maximum',
    },
    {
      field: 'availability',
      method: 'isLength',
      args: [
        {
          max: 40,
        },
      ],
      validWhen: true,
      message: '40 caractères maximum',
    },
    {
      field: 'languages',
      method: 'isLength',
      args: [
        {
          max: 100,
        },
      ],
      validWhen: true,
      message: '100 caractères maximum',
    },
    {
      field: 'transport',
      method: 'isLength',
      args: [
        {
          max: 100,
        },
      ],
      validWhen: true,
      message: '100 caractères maximum',
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
        return fieldValue && isValidPhoneNumber(fieldValue, 'FR');
      },
      args: [],
      validWhen: true,
      message: 'Numéro de téléphone invalide',
    },
  ],
};
