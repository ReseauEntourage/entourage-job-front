import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import { Genders, GENDERS_FILTERS } from '@/src/constants/genders';
import { FormSchema } from '../FormSchema';
import {
  ADMIN_ZONES_FILTERS,
  AdminZone,
  Department,
  DEPARTMENTS_FILTERS,
} from 'src/constants/departements';
import { AdminRoles } from 'src/constants/users';
import { FilterConstant } from 'src/constants/utils';

export const formPersonalDataAsCandidate: FormSchema<{
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  oldEmail: string;
  newEmail0: string;
  newEmail1: string;
  department: FilterConstant<Department>;
  introduction: string;
}> = {
  id: 'form-personal-data',
  fields: [
    {
      id: 'firstName',
      name: 'firstName',
      component: 'text-input',
      title: 'Prénom*',
      isRequired: true,
    },
    {
      id: 'lastName',
      name: 'lastName',
      component: 'text-input',
      title: 'Nom*',
      isRequired: true,
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
      id: 'newEmailWarning',
      name: 'newEmailWarning',
      component: 'text',
      title:
        'Si vous modifiez votre adresse email, vous serez déconnecté. Vous devrez valider votre nouvelle adresse email pour vous reconnecter',
      hide: (getValue) => {
        return !getValue('oldEmail');
      },
    },
    {
      id: 'phone',
      name: 'phone',
      component: 'tel-input',
      title: 'Numéro de telephone portable*',
      isRequired: true,
      rules: [
        {
          method: (fieldValue) => {
            return !!fieldValue && isValidPhoneNumber(fieldValue, 'FR');
          },
          message: 'Numéro de téléphone invalide',
        },
      ],
    },
    {
      id: 'department',
      name: 'department',
      title: 'Renseigner votre département*',
      component: 'select',
      options: DEPARTMENTS_FILTERS,
      isRequired: true,
      isMulti: false,
    },
    {
      id: 'address',
      name: 'address',
      component: 'text-input',
      title: 'Tapez votre adresse postale',
    },
    {
      id: 'introduction',
      name: 'introduction',
      component: 'text-input',
      title: 'Tapez votre courte présentation',
    },
  ],
};

export const formPersonalDataAsCoach: FormSchema<{
  firstName: string;
  lastName: string;
  phone: string;
  oldEmail: string;
  newEmail0: string;
  newEmail1: string;
  department: FilterConstant<Department>;
  introduction: string;
}> = {
  id: 'form-personal-data',
  fields: [
    {
      id: 'firstName',
      name: 'firstName',
      component: 'text-input',
      title: 'Prénom',
      isRequired: true,
    },
    {
      id: 'lastName',
      name: 'lastName',
      component: 'text-input',
      title: 'Nom',
      isRequired: true,
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
      id: 'newEmailWarning',
      name: 'newEmailWarning',
      component: 'text',
      title:
        'Si vous modifiez votre adresse email, vous serez déconnecté. Vous devrez valider votre nouvelle adresse email pour vous reconnecter',
      hide: (getValue) => {
        return !getValue('oldEmail');
      },
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
      isRequired: true,
      rules: [
        {
          method: (fieldValue) => {
            return !!fieldValue && isValidPhoneNumber(fieldValue, 'FR');
          },
          message: 'Numéro de téléphone invalide',
        },
      ],
    },
    {
      id: 'departmentLabel',
      name: 'departmentLabel',
      title: 'Modifier le département',
      component: 'heading',
    },
    {
      id: 'department',
      name: 'department',
      title: 'Renseigner votre département*',
      component: 'select',
      options: DEPARTMENTS_FILTERS,
      isRequired: true,
      isMulti: false,
    },
    {
      id: 'introduction',
      name: 'introduction',
      component: 'text-input',
      title: 'Tapez votre courte présentation',
    },
  ],
};

export const formPersonalDataAsAdmin: FormSchema<{
  firstName: string;
  lastName: string;
  gender: Genders;
  phone: string;
  zone: AdminZone;
  adminRole: AdminRoles;
  oldEmail: string;
  newEmail0: string;
  newEmail1: string;
}> = {
  id: 'form-personal-data',
  fields: [
    {
      id: 'firstName',
      name: 'firstName',
      component: 'text-input',
      title: 'Prénom*',
      isRequired: true,
    },
    {
      id: 'lastName',
      name: 'lastName',
      component: 'text-input',
      title: 'Nom*',
      isRequired: true,
    },
    {
      id: 'zone',
      title: 'Zone*',
      name: 'zone',
      component: 'select-simple',
      options: ADMIN_ZONES_FILTERS,
      isRequired: true,
    },
    {
      id: 'adminRole',
      title: 'Responsabilité',
      name: 'adminRole',
      component: 'select-simple',
      options: [
        { value: AdminRoles.CANDIDATES, label: AdminRoles.CANDIDATES },
        { value: AdminRoles.COMPANIES, label: AdminRoles.COMPANIES },
      ],
    },
    {
      id: 'gender',
      title: 'Genre*',
      name: 'gender',
      component: 'select-simple',
      options: GENDERS_FILTERS,
      isRequired: true,
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
      id: 'newEmailWarning',
      name: 'newEmailWarning',
      component: 'text',
      title:
        'Si vous modifiez votre adresse email, vous serez déconnecté. Vous devrez valider votre nouvelle adresse email pour vous reconnecter',
      hide: (getValue) => {
        return !getValue('oldEmail');
      },
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
      isRequired: true,
      rules: [
        {
          method: (fieldValue) => {
            return !!fieldValue && isValidPhoneNumber(fieldValue, 'FR');
          },
          message: 'Numéro de téléphone invalide',
        },
      ],
    },
  ],
};
