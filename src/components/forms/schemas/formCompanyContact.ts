import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import validator from 'validator';
import { FormSchema } from '../FormSchema';
import {
  COMPANY_APPROACHES_FILTERS,
  COMPANY_CONTACT_ZONES_FILTERS,
  CompanyApproach,
  HEARD_ABOUT_FILTERS,
  HeardAboutValue,
} from 'src/constants';
import { AdminZone } from 'src/constants/departements';

export const formCompanyContact: FormSchema<{
  firstName: string;
  lastName: string;
  approach: CompanyApproach;
  email: string;
  phone: string;
  company: string;
  position: string;
  zone: AdminZone;
  heardAbout: HeardAboutValue;
}> = {
  id: 'form-company-contact',
  fields: [
    {
      id: 'firstName',
      name: 'firstName',
      component: 'text-input',
      title: 'Votre prénom*',
      isRequired: true,
      maxLength: 80,
    },
    {
      id: 'lastName',
      name: 'lastName',
      component: 'text-input',
      title: 'Votre nom*',
      isRequired: true,
      maxLength: 80,
    },
    {
      id: 'approach',
      name: 'approach',
      component: 'select-simple',
      options: COMPANY_APPROACHES_FILTERS,
      title: 'Quelle est votre démarche ?*',
      isRequired: true,
    },
    {
      id: 'email',
      name: 'email',
      type: 'email',
      component: 'text-input',
      title: 'Votre adresse mail*',
      isRequired: true,
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
      title: 'Votre numéro de téléphone portable*',
      isRequired: true,
      rules: [
        {
          method: (fieldValue) => isValidPhoneNumber(fieldValue, 'FR'),
          message: 'Numéro de téléphone invalide',
        },
      ],
    },
    {
      id: 'company',
      name: 'company',
      component: 'text-input',
      title: 'Nom de votre entreprise*',
      isRequired: true,
    },
    {
      id: 'position',
      name: 'position',
      component: 'text-input',
      title: 'Votre poste*',
      isRequired: true,
    },
    {
      id: 'zone',
      name: 'zone',
      component: 'select-simple',
      options: COMPANY_CONTACT_ZONES_FILTERS,
      title: 'Dans quelle région êtes-vous présent ?*',
      isRequired: true,
    },
    {
      id: 'heardAbout',
      name: 'heardAbout',
      component: 'select-simple',
      options: HEARD_ABOUT_FILTERS,
      title: 'Comment avez-vous connu LinkedOut ?',
    },
  ],
};
