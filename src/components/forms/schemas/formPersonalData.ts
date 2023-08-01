import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import { FormSchema } from '../FormSchema/FormSchema.types';
import { ADMIN_ZONES_FILTERS } from 'src/constants/departements';
import { ADMIN_ROLES } from 'src/constants/users';

export const formPersonalData: FormSchema = {
  id: 'form-personal-data',
  fields: [
    {
      id: 'firstName',
      name: 'firstName',
      component: 'text-input',
      title: 'Prénom*',
    },
    {
      id: 'lastName',
      name: 'lastName',
      component: 'text-input',
      title: 'Nom*',
    },
    {
      id: 'zone',
      title: 'Zone*',
      name: 'zone',
      component: 'select-simple',
      options: ADMIN_ZONES_FILTERS,
    },
    {
      id: 'adminRole',
      title: 'Responsabilité',
      name: 'adminRole',
      component: 'select-simple',
      options: [
        { value: ADMIN_ROLES.CANDIDATES, label: ADMIN_ROLES.CANDIDATES },
        { value: ADMIN_ROLES.COMPANIES, label: ADMIN_ROLES.COMPANIES },
      ],
    },
    {
      id: 'gender',
      title: 'Genre*',
      name: 'gender',
      component: 'select-simple',
      options: [
        { value: 0, label: 'Homme' },
        { value: 1, label: 'Femme' },
      ],
    },
    {
      id: 'mailLabel',
      name: 'mailLabel',
      title: "Modifier l'adresse mail",
      component: 'heading',
    },
    {
      id: 'oldEmail',
      name: 'oldEmail',
      component: 'text-input',
      type: 'email',
      title: 'Ancien email',
    },
    {
      id: 'newEmail0',
      name: 'newEmail0',
      component: 'text-input',
      type: 'email',
      title: 'Nouvel email',
    },
    {
      id: 'newEmail1',
      name: 'newEmail1',
      component: 'text-input',
      type: 'email',
      title: 'Confirmation nouvel email',
    },
    {
      id: 'phoneLabel',
      name: 'phoneLabel',
      title: 'Modifier le numéro de téléphone',
      component: 'heading',
    },
    {
      id: 'phone',
      name: 'phone',
      component: 'tel-input',
      title: 'Numéro de telephone portable*',
    },
    {
      id: 'addressLabel',
      name: 'addressLabel',
      title: "Modifier l'adresse postale",
      component: 'heading',
    },
    {
      id: 'address',
      name: 'address',
      component: 'text-input',
      title: 'Tapez votre adresse postale',
    },
  ],
  rules: [
    {
      field: 'firstName',
      isRequired: true,
    },
    {
      field: 'lastName',
      isRequired: true,
    },
    {
      field: 'gender',
      isRequired: true,
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
      isRequired: true,
    },
  ],
};
