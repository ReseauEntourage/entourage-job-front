import React from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import validator from 'validator';
import PlusFilledIcon from 'assets/custom/icons/plus-filled.svg';
import {
  ExtractFormSchemaValidation,
  FormField,
  FormSchema,
  isFormFieldGroup,
  isFormFieldMultiple,
  isFormFieldSelectRequest,
  isFormFieldText,
  isFormFieldTextInput,
} from '../FormSchema';
import { FormWithValidation } from '../FormWithValidation';
import { Api } from 'src/api';
import { FilterConstant } from 'src/constants';
import { ADMIN_ZONES_FILTERS, AdminZone } from 'src/constants/departements';
import { COLORS } from 'src/constants/styles';
import {
  ADMIN_ROLES,
  USER_ROLES,
  USER_ROLES_FILTERS,
  RELATED_ROLES,
  EXTERNAL_USER_ROLES,
  UserRole,
  Gender,
} from 'src/constants/users';
import { isRoleIncluded } from 'src/utils/Finding';
import { formAddOrganization } from './formAddOrganization';

export const CREATE_NEW_ORGANIZATION_VALUE = 'createNewOrganization';

const CREATE_NEW_ORGANIZATION_OPTION = {
  value: CREATE_NEW_ORGANIZATION_VALUE,
  label: (
    <>
      <PlusFilledIcon color={COLORS.primaryOrange} />
      Ajouter une nouvelle structure
    </>
  ),
};

const hideMethod = (getValue) => {
  const role = getValue('role');
  const organizationId = getValue('organizationId')?.value;
  return !(
    isRoleIncluded(EXTERNAL_USER_ROLES, role) &&
    organizationId === CREATE_NEW_ORGANIZATION_VALUE
  );
};
type UpdatedOrganizationSchema = {
  nameOrganization: string;
  addressOrganization: string;
  zoneOrganization: string;
  referentFirstNameOrganization: string;
  referentLastNameOrganization: string;
  referentPhoneOrganization: string;
  referentMailOrganization: string;
};
const addHideMethodAndSuffixToAllFields = (
  field: FormField<ExtractFormSchemaValidation<typeof formAddOrganization>>
): FormField<UpdatedOrganizationSchema> => {
  const fieldToReturn = {
    ...field,
    id: `${field.id}Organization`,
    name: `${field.name}Organization`,
    hide: hideMethod,
  };

  if (isFormFieldMultiple(field) || isFormFieldGroup(field)) {
    return {
      ...fieldToReturn,
      fields: field.fields.map((childField) =>
        addHideMethodAndSuffixToAllFields(childField)
      ),
    };
  }

  return fieldToReturn as FormField<UpdatedOrganizationSchema>;
};

const mutatedAddOrganizationFormFields = formAddOrganization.fields.map(
  addHideMethodAndSuffixToAllFields
);

const organizationFieldsNames = mutatedAddOrganizationFormFields.map(
  ({ name }) => name
);

export const formAddUser: FormSchema<
  {
    firstName: string;
    lastName: string;
    role: UserRole;
    gender: Gender;
    zone: AdminZone;
    phone: string;
    organizationId: FilterConstant<string>;
  } & UpdatedOrganizationSchema
> = {
  id: 'form-add-user',
  fields: [
    {
      id: 'memberInformation',
      name: 'memberInformation',
      title: 'Information du membre',
      component: 'heading',
    },
    {
      id: 'userNames',
      name: 'userNames',
      component: 'fieldgroup',
      fields: [
        {
          id: 'firstName',
          name: 'firstName',
          component: 'text-input',
          title: 'Prénom *',
          isRequired: true,
          maxLength: 80,
        },
        {
          id: 'lastName',
          name: 'lastName',
          component: 'text-input',
          title: 'Nom *',
          isRequired: true,
          maxLength: 80,
        },
      ],
    },
    {
      id: 'userInfo',
      name: 'userInfo',
      component: 'fieldgroup',
      fields: [
        {
          id: 'gender',
          name: 'gender',
          title: 'Genre *',
          component: 'select-simple',
          options: [
            { value: 0, label: 'Homme' },
            { value: 1, label: 'Femme' },
          ],
          isRequired: true,
        },
        {
          id: 'zone',
          name: 'zone',
          title: 'Zone *',
          component: 'select-simple',
          options: ADMIN_ZONES_FILTERS,
          isRequired: true,
        },
      ],
    },
    {
      id: 'userPhoneRole',
      name: 'userPhoneRole',
      component: 'fieldgroup',
      fields: [
        {
          id: 'phone',
          name: 'phone',
          component: 'tel-input',
          title: 'Numéro *',
          isRequired: true,
          rules: [
            {
              method: (fieldValue) => isValidPhoneNumber(fieldValue, 'FR'),
              message: 'Numéro de téléphone invalide',
            },
          ],
        },
        {
          id: 'role',
          title: 'Role*',
          name: 'role',
          component: 'select-simple',
          options: USER_ROLES_FILTERS,
          fieldsToReset: ['adminRole', 'userToLinkId', 'organizationId'],
          isRequired: true,
        },
      ],
    },
    {
      id: 'email',
      name: 'email',
      component: 'text-input',
      title: 'Adresse mail *',
      isRequired: true,
      rules: [
        {
          method: (fieldValue) => validator.isEmail(fieldValue),
          message: 'Adresse e-mail invalide',
        },
      ],
    },
    {
      id: 'userOrganization',
      name: 'userOrganization',
      component: 'fieldgroup',
      hide: (getValue) => {
        const role = getValue('role');
        return !role || role === USER_ROLES.ADMIN;
      },
      fields: [
        {
          id: 'organizationId',
          name: 'organizationId',
          component: 'select-async',
          hide: (getValue) => {
            return !isRoleIncluded(EXTERNAL_USER_ROLES, getValue('role'));
          },
          loadOptions: async (callback, inputValue) => {
            const { data: organizations } = await Api.getAllOrganizations({
              params: {
                search: inputValue,
                limit: 50,
                offset: 0,
              },
            });

            callback([
              CREATE_NEW_ORGANIZATION_OPTION,
              ...organizations.map((u) => {
                return {
                  value: u.id,
                  label: `${u.name}`,
                };
              }),
            ]);
          },
          title: 'Structure partenaire *',
          fieldsToReset: ['userToLinkId', ...organizationFieldsNames],
          isRequired: true,
        },
        {
          id: 'userToLinkId',
          name: 'userToLinkId',
          component: 'select-async',
          isMulti: (getValue) => {
            const role = getValue('role');
            return role === USER_ROLES.COACH_EXTERNAL;
          },
          hide: (getValue) => {
            const role = getValue('role');
            const organizationId = getValue('organizationId')?.value;
            return (
              role === USER_ROLES.ADMIN ||
              (isRoleIncluded(EXTERNAL_USER_ROLES, role) && !organizationId) ||
              organizationId === CREATE_NEW_ORGANIZATION_VALUE
            );
          },
          loadOptions: async (callback, inputValue, getValue) => {
            const role = RELATED_ROLES[getValue('role')];

            const organizationId = getValue('organizationId')?.value;

            const { data: users } = await Api.getUsersSearch({
              params: {
                query: inputValue,
                role,
                organizationId,
              },
            });

            callback(
              users.map((u) => {
                return {
                  value: u.id,
                  label: `${u.firstName} ${u.lastName}`,
                };
              })
            );
          },
          title: 'Nom du coach ou candidat lié',
          rules: [
            {
              method: (fieldValue) => {
                return !!fieldValue;
              },
              message: 'error',
            },
          ],
        },
      ],
    },
    {
      id: 'adminRoleGroup',
      name: 'adminRoleGroup',
      component: 'fieldgroup',
      hide: (getValue) => {
        const role = getValue('role');
        return role !== USER_ROLES.ADMIN;
      },
      fields: [
        {
          id: 'adminRole',
          name: 'adminRole',
          component: 'select-simple',
          title: 'Responsabilité *',
          options: [
            { value: ADMIN_ROLES.CANDIDATES, label: ADMIN_ROLES.CANDIDATES },
            { value: ADMIN_ROLES.COMPANIES, label: ADMIN_ROLES.COMPANIES },
          ],
          isRequired: true,
        },
      ],
    },
    ...mutatedAddOrganizationFormFields,
  ],
};
