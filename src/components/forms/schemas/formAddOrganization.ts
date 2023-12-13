import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import { isEmail } from 'validator';
import { FormSchema } from '../FormSchema';
import { ADMIN_ZONES_FILTERS, AdminZone } from 'src/constants/departements';

export const formAddOrganization: FormSchema<{
  name: string;
  address: string;
  zone: AdminZone;
  referentFirstName: string;
  referentLastName: string;
  referentPhone: string;
  referentMail: string;
}> = {
  id: 'form-add-organization',
  fields: [
    {
      id: 'organizationInformation',
      name: 'organizationInformation',
      title: 'Information structure partenaire',
      component: 'heading',
    },
    {
      id: 'name',
      name: 'name',
      component: 'text-input',
      title: 'Nom de la structure *',
      isRequired: true,
    },
    {
      id: 'address',
      name: 'address',
      component: 'text-input',
      title: 'Adresse postale de la structure *',
      isRequired: true,
    },
    {
      id: 'zone',
      name: 'zone',
      component: 'select-simple',
      title: 'Zone de la structure *',
      options: ADMIN_ZONES_FILTERS,
      isRequired: true,
    },
    {
      id: 'referentInformation',
      name: 'referentInformation',
      title: 'Coordonnées du référent',
      component: 'heading',
    },
    {
      id: 'referentInfo',
      name: 'referentInfo',
      component: 'fieldgroup',
      fields: [
        {
          id: 'referentFirstName',
          name: 'referentFirstName',
          component: 'text-input',
          title: 'Prénom du référent *',
          isRequired: true,
        },
        {
          id: 'referentLastName',
          name: 'referentLastName',
          component: 'text-input',
          title: 'Nom du référent *',
          isRequired: true,
        },
      ],
    },
    {
      id: 'referentPhone',
      name: 'referentPhone',
      component: 'tel-input',
      title: 'Numéro de téléphone portable du référent *',
      isRequired: true,
      rules: [
        {
          method: (fieldValue) =>
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            fieldValue && isValidPhoneNumber(fieldValue, 'FR'),
          message: 'Numéro de téléphone invalide',
        },
      ],
    },
    {
      id: 'referentMail',
      name: 'referentMail',
      type: 'email',
      component: 'text-input',
      title: 'Adresse mail du référent *',
      isRequired: true,
      rules: [
        {
          method: (fieldValue) => isEmail(fieldValue),
          message: 'Adresse e-mail invalide',
        },
      ],
    },
  ],
};
