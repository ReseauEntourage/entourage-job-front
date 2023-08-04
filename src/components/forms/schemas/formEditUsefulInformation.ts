import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import { FormSchema } from '../FormSchema';
import { CONTRACTS } from 'src/constants';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import validator from "validator";

export const formEditUsefulInformation: FormSchema = {
  id: 'form-usefullinformation',
  fields: [
    {
      id: 'email',
      name: 'email',
      type: 'email',
      component: 'text-input',
      title: 'Adresse mail',
      rules: [
        {
          method: (fieldValue) => validator.isEmail(fieldValue),

          message: 'Adresse e-mail invalide',
        },
      ],
    },
    {
      id: 'phone',
      name: 'phone',
      component: 'tel-input',
      title: 'Numéro de téléphone portable*',
      isRequired: true,
      rules: [
        {
          method: (fieldValue) => {
            return fieldValue && isValidPhoneNumber(fieldValue, 'FR');
          },

          message: 'Numéro de téléphone invalide',
        },
      ],
    },
    {
      id: 'address',
      name: 'address',
      component: 'text-input',
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
      component: 'select',
      options: CONTRACTS,
      isMulti: true,
    },
    {
      id: 'locations',
      name: 'locations',
      title: 'Départements de travail souhaités',
      component: 'select',
      options: DEPARTMENTS_FILTERS,
      isMulti: true,
    },
    {
      id: 'availability',
      name: 'availability',
      component: 'text-input',
      title: 'Disponibilités de travail possibles',
      maxLength: 40,
    },
    {
      id: 'languages',
      name: 'languages',
      title: 'Langues parlées',
      component: 'select-creatable',
      isMulti: true,
    },
    {
      id: 'transport',
      name: 'transport',
      component: 'text-input',
      title: 'Permis de conduire',
      maxLength: 100,

    },
  ],
};
