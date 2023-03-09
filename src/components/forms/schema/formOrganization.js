import { ADMIN_ZONES_FILTERS } from 'src/constants/departements';
import { isValidPhoneNumber } from 'react-phone-number-input/mobile';

export default {
  id: 'form-organization',
  fields: [
    {
      id: 'name',
      name: 'name',
      type: 'text',
      component: 'input',
      placeholder: 'Tapez le nom de la structure',
      title: 'Nom de la structure*',
    },
    {
      id: 'address',
      name: 'address',
      component: 'input',
      type: 'text',
      placeholder: "Tapez l'adresse postale de la structure",
      title: 'Adresse postale*',
    },
    {
      id: 'referentFirstName',
      name: 'referentFirstName',
      type: 'text',
      component: 'input',
      placeholder: 'Tapez le prénom du référent',
      title: 'Prénom du référent*',
    },
    {
      id: 'referentLastName',
      name: 'referentLastName',
      type: 'text',
      component: 'input',
      placeholder: 'Tapez le nom du référent',
      title: 'Nom du référent*',
    },
    {
      id: 'referentMail',
      name: 'referentMail',
      type: 'email',
      component: 'input',
      placeholder: "Tapez l'adresse mail du référent",
      title: 'Adresse mail du référent*',
    },
    {
      id: 'referentPhone',
      name: 'referentPhone',
      component: 'tel',
      placeholder: 'Tapez le numéro de téléphone portable du référent',
      title: 'Numéro de téléphone portable du référent*',
    },
    {
      id: 'zone',
      title: 'Zone*',
      name: 'zone',
      component: 'select',
      options: [
        { value: -1, label: 'Choisissez une zone' },
        ...ADMIN_ZONES_FILTERS,
      ],
    },
  ],
  rules: [
    {
      field: 'name',
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
      field: 'address',
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
      field: 'referentFirstName',
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
      field: 'referentLastName',
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
      field: 'referentMail',
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
      field: 'referentMail',
      method: 'isEmail',
      validWhen: true,
      message: 'Adresse e-mail invalide',
    },
    {
      field: 'referentPhone',
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
      field: 'referentPhone',
      method: (fieldValue) => {
        return fieldValue && isValidPhoneNumber(fieldValue, 'FR');
      },
      args: [],
      validWhen: true,
      message: 'Numéro de téléphone invalide',
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
