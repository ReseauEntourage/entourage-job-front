import { ADMIN_ZONES_FILTERS } from 'src/constants/departements';
import { ADMIN_ROLES } from 'src/constants';
import { isValidPhoneNumber } from 'react-phone-number-input/mobile';

export default {
  id: 'form-personal-data',
  fields: [
    {
      id: 'firstName',
      name: 'firstName',
      type: 'text',
      component: 'input',
      placeholder: 'Tapez le prénom',
      title: 'Prénom*',
    },
    {
      id: 'lastName',
      name: 'lastName',
      type: 'text',
      component: 'input',
      placeholder: 'Tapez le nom',
      title: 'Nom*',
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
    {
      id: 'adminRole',
      title: 'Responsabilité',
      name: 'adminRole',
      component: 'select',
      options: [
        { value: -1, label: 'Choisissez une responsabilité' },
        { value: ADMIN_ROLES.CANDIDATES, label: ADMIN_ROLES.CANDIDATES },
        { value: ADMIN_ROLES.COMPANIES, label: ADMIN_ROLES.COMPANIES },
      ],
    },
    {
      id: 'gender',
      title: 'Genre*',
      name: 'gender',
      component: 'select',
      options: [
        { value: -1, label: 'Choisissez un genre' },
        { value: 0, label: 'Homme' },
        { value: 1, label: 'Femme' },
      ],
    },
    { id: 'mailLabel', title: "Modifier l'adresse mail", component: 'heading' },
    {
      id: 'oldEmail',
      name: 'oldEmail',
      component: 'input',
      type: 'email',
      title: 'Ancien email',
      placeholder: 'Tapez votre ancien email',
    },
    {
      id: 'newEmail0',
      name: 'newEmail0',
      component: 'input',
      type: 'email',
      placeholder: 'Tapez votre nouvel email',
      title: 'Nouvel email',
    },
    {
      id: 'newEmail1',
      name: 'newEmail1',
      component: 'input',
      type: 'email',
      placeholder: 'Vérifiez votre nouvel email',
      title: 'Confirmation nouvel email',
    },
    {
      id: 'phoneLabel',
      title: 'Modifier le numéro de téléphone',
      component: 'heading',
    },
    {
      id: 'phone',
      name: 'phone',
      component: 'tel',
      placeholder: 'Tapez votre numéro de telephone portable',
      title: 'Numéro de telephone portable*',
    },
    {
      id: 'addressLabel',
      title: "Modifier l'adresse postale",
      component: 'heading',
    },
    {
      id: 'address',
      name: 'address',
      component: 'input',
      type: 'text',
      title: 'Tapez votre adresse postale',
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
      field: 'gender',
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
