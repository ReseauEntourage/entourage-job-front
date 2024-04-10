import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import { isEmail } from 'validator';
import { FormSchema } from '../FormSchema';
import { Contract, CONTRACTS } from 'src/constants';
import {
  AdminZone,
  Department,
  DEPARTMENTS_FILTERS,
} from 'src/constants/departements';
import { FilterConstant } from 'src/constants/utils';

export const formEditUsefulInformation: FormSchema<{
  userZone: AdminZone;
  email: string;
  phone: string;
  address: string;
  contracts: FilterConstant<Contract>[];
  locations: FilterConstant<Department>[];
  availability: string;
  languages: FilterConstant<string>[];
  transport: string;
}> = {
  id: 'form-useful-information',
  fields: [
    {
      id: 'userZone',
      name: 'userZone',
      title: 'userZone',
      component: 'text-input',
      disabled: true,
      hidden: true,
    },
    {
      id: 'email',
      name: 'email',
      type: 'email',
      component: 'text-input',
      title: 'Adresse mail',
      disabled: true,
      rules: [
        {
          method: (fieldValue) => isEmail(fieldValue),
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
          method: (fieldValue) =>
            !!fieldValue && isValidPhoneNumber(fieldValue, 'FR'),
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
      options: (getValue) =>
        DEPARTMENTS_FILTERS.filter((filter) => {
          return !filter.zone || filter.zone === getValue('userZone');
        }),
      isMulti: true,
    },
    {
      id: 'availability',
      name: 'availability',
      component: 'text-input',
      title: 'Disponibilités de travail possibles',
      maxLength: 30,
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
      maxLength: 30,
    },
  ],
};
