import { passwordStrength } from 'check-password-strength';
import React from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import { isEmail } from 'validator';
import { Api } from 'src/api';
import { PasswordCriterias } from 'src/components/backoffice/parametres/ParametresLayout/ChangePasswordCard/PasswordCriterias';
import {
  FormSchema,
  FormSchemaValidation,
  GetValueType,
} from 'src/components/forms/FormSchema';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { Department, DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { COLORS } from 'src/constants/styles';
import { FilterConstant } from 'src/constants/utils';

export const CREATE_NEW_ORGANIZATION_VALUE = 'createNewOrganization';

const CREATE_NEW_ORGANIZATION_OPTION = {
  value: CREATE_NEW_ORGANIZATION_VALUE,
  label: (
    <>
      <LucidIcon name="Plus" color={COLORS.primaryBlue} />
      Ajouter mon association
    </>
  ),
};

interface formRegistrationRefererAccountSchema extends FormSchemaValidation {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  department: FilterConstant<Department>;
  organizationId: FilterConstant<string>;
  password: string;
  confirmPassword: string;
}

const hideOrganizationFields = (
  getValue: GetValueType<formRegistrationRefererAccountSchema>
) => {
  const organizationId = getValue('organizationId')?.value;
  return organizationId !== CREATE_NEW_ORGANIZATION_VALUE;
};

export const formRegistrationRefererAccount: FormSchema<formRegistrationRefererAccountSchema> =
  {
    id: 'form-registration-account',
    fields: [
      {
        id: 'firstName',
        name: 'firstName',
        component: 'text-input',
        title: 'Prénom *',
        placeholder: 'Entrez votre prénom',
        isRequired: true,
        showLabel: true,
      },
      {
        id: 'lastName',
        name: 'lastName',
        component: 'text-input',
        title: 'Nom *',
        placeholder: 'Entrez votre nom',
        isRequired: true,
        showLabel: true,
      },
      {
        id: 'phone',
        name: 'phone',
        component: 'tel-input',
        title: 'Numéro de téléphone*',
        placeholder: 'Entrez votre numéro de téléphone',
        isRequired: true,
        showLabel: true,
        rules: [
          {
            method: (fieldValue) =>
              !!fieldValue && isValidPhoneNumber(fieldValue, 'FR'),
            message: 'Numéro de téléphone invalide',
          },
        ],
      },
      {
        id: 'email',
        name: 'email',
        component: 'text-input',
        title: 'Adresse mail*',
        placeholder: 'Entrez votre adresse mail',
        isRequired: true,
        showLabel: true,
        rules: [
          {
            method: (fieldValue) => isEmail(fieldValue),
            message: 'Adresse e-mail invalide',
          },
        ],
      },
      {
        id: 'department',
        name: 'department',
        component: 'select',
        options: DEPARTMENTS_FILTERS,
        isRequired: true,
        showLabel: true,
        title: 'Département*',
        isMulti: false,
      },
      {
        id: 'organizationId',
        name: 'organizationId',
        component: 'select-async',
        isRequired: true,
        loadOptions: async (callback, inputValue) => {
          try {
            const { data: organizations } = await Api.getAllOrganizations({
              params: {
                search: inputValue,
                limit: 50,
                offset: 0,
              },
            });
            callback([
              ...organizations.map((u) => {
                return {
                  value: u.id,
                  label: u.name,
                };
              }),
              CREATE_NEW_ORGANIZATION_OPTION,
            ]);
          } catch (error) {
            console.error(error);
            callback([]);
          }
        },
        title: 'Sélectionnez votre association *',
        isMulti: false,
        showLabel: true,
      },
      {
        id: 'nameOrganization',
        name: 'nameOrganization',
        component: 'text-input',
        title: 'Nom de votre association *',
        showLabel: true,
        isRequired: true,
        hide: hideOrganizationFields,
      },
      {
        id: 'password',
        name: 'password',
        type: 'password',
        component: 'text-input',
        title: 'Mot de passe*',
        placeholder: 'Entrez votre mot de passe',
        isRequired: true,
        showLabel: true,
        rules: [
          {
            method: (fieldValue) => passwordStrength(fieldValue).id >= 2,
            message: 'Doit répondre aux critères ci-dessous',
          },
        ],
      },
      {
        id: 'passwordCriteria',
        name: 'passwordCriteria',
        component: 'text',
        title: <PasswordCriterias removeMargin />,
      },
      {
        id: 'confirmPassword',
        name: 'confirmPassword',
        type: 'password',
        component: 'text-input',
        title: 'Confirmation du mot de passe*',
        placeholder: 'Entrez votre mot de passe',
        isRequired: true,
        showLabel: true,
        rules: [
          {
            method: (fieldValue) => passwordStrength(fieldValue).id >= 2,
            message: 'Doit répondre aux critères ci-dessus',
          },
          {
            method: (fieldValue, fieldValues) =>
              fieldValues.password === fieldValue,
            message: 'Les deux mots de passe ne correspondent pas',
          },
        ],
      },
    ],
  };
