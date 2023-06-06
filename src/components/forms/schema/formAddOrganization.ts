import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import { ADMIN_ZONES_FILTERS } from 'src/constants/departements';

export const formAddOrganization = {
  id: 'form-add-organization',
  fields: [
    {
      id: 'organizationInformation',
      title: 'Information structure partenaire',
      component: 'heading',
    },
    {
      id: 'name',
      name: 'name',
      component: 'text-input',
      title: 'Nom de la structure *',
    },
    {
      id: 'address',
      name: 'address',
      component: 'text-input',
      title: 'Adresse postale de la structure *',
    },
    {
      id: 'zone',
      name: 'zone',
      component: 'select-new',
      title: 'Zone de la structure *',
      options: ADMIN_ZONES_FILTERS,
    },
    {
      id: 'referentInformation',
      title: 'Coordonnées du référent',
      component: 'heading',
    },
    {
      component: 'fieldgroup-new',
      fields: [
        {
          id: 'referentFirstName',
          name: 'referentFirstName',
          component: 'text-input',
          title: 'Prénom du référent *',
        },
        {
          id: 'referentLastName',
          name: 'referentLastName',
          component: 'text-input',
          title: 'Nom du référent *',
        },
      ],
    },

    {
      id: 'referentPhone',
      name: 'referentPhone',
      component: 'tel-input',
      title: 'Numéro de téléphone portable du référent *',
    },
    {
      id: 'referentMail',
      name: 'referentMail',
      type: 'mail',
      component: 'text-input',
      title: 'Adresse mail du référent *',
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
