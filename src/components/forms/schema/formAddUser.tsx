import React from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import PlusFilledIcon from 'assets/custom/icons/plus-filled.svg';
import Api from 'src/api/index';
import { ADMIN_ZONES_FILTERS } from 'src/constants/departements';
import { COLORS } from 'src/constants/styles';
import {
  ADMIN_ROLES,
  USER_ROLES,
  USER_ROLES_FILTERS,
  RELATED_ROLES,
  EXTERNAL_USER_ROLES,
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

const addHideMethodAndSuffixToAllFields = (field) => {
  const fieldToReturn = {
    ...field,
    id: field.id ? `${field.id}Organization` : field.id,
    name: field.name ? `${field.name}Organization` : field.name,
    hide: hideMethod,
  };

  if (field.fields) {
    return {
      ...fieldToReturn,
      fields: field.fields.map(addHideMethodAndSuffixToAllFields),
    };
  }

  return fieldToReturn;
};

const mutatedAddOrganizationForm = {
  fields: formAddOrganization.fields.map(addHideMethodAndSuffixToAllFields),
  rules: formAddOrganization.rules.map((rule) => {
    return {
      ...rule,
      field: `${rule.field}Organization`,
    };
  }),
};

const organizationFieldsNames = mutatedAddOrganizationForm.fields.map(
  ({ name }) => name
);

export const formAddUser = {
  id: 'form-add-user',
  fields: [
    {
      id: 'memberInformation',
      title: 'Information du membre',
      component: 'heading',
    },
    {
      component: 'fieldgroup-new',
      fields: [
        {
          id: 'firstName',
          name: 'firstName',
          component: 'text-input',
          title: 'Prénom *',
        },
        {
          id: 'lastName',
          name: 'lastName',
          component: 'text-input',
          title: 'Nom *',
        },
      ],
    },
    {
      component: 'fieldgroup-new',
      fields: [
        {
          id: 'gender',
          name: 'gender',
          title: 'Genre *',
          component: 'select-new',
          options: [
            { value: 0, label: 'Homme' },
            { value: 1, label: 'Femme' },
          ],
        },
        {
          id: 'zone',
          name: 'zone',
          title: 'Zone *',
          component: 'select-new',
          options: ADMIN_ZONES_FILTERS,
        },
      ],
    },
    {
      component: 'fieldgroup-new',
      fields: [
        {
          id: 'phone',
          name: 'phone',
          component: 'tel-input',
          title: 'Numéro *',
        },
        {
          id: 'role',
          title: 'Role*',
          name: 'role',
          component: 'select-new',
          options: USER_ROLES_FILTERS,
          fieldsToReset: ['adminRole', 'userToLinkId', 'organizationId'],
        },
      ],
    },
    {
      id: 'email',
      name: 'email',
      component: 'text-input',
      title: 'Adresse mail *',
    },
    {
      component: 'fieldgroup-new',
      hide: (getValue) => {
        const role = getValue('role');
        return !role || role === USER_ROLES.ADMIN;
      },
      fields: [
        {
          id: 'organizationId',
          name: 'organizationId',
          component: 'select-request-async-new',
          cacheOptions: false,
          hide: (getValue) => {
            return !isRoleIncluded(EXTERNAL_USER_ROLES, getValue('role'));
          },
          defaultOptions: [CREATE_NEW_ORGANIZATION_OPTION],
          loadOptions: async (inputValue, callback) => {
            if (inputValue.length > 0) {
              const { data: organizations } = await Api.getAllOrganizations({
                params: {
                  search: inputValue,
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
            }
            callback([CREATE_NEW_ORGANIZATION_OPTION]);
          },
          title: 'Structure partenaire *',
          fieldsToReset: ['userToLinkId', ...organizationFieldsNames],
        },
        {
          id: 'userToLinkId',
          name: 'userToLinkId',
          component: 'select-request-async-new',
          cacheOptions: false,
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
          loadOptions: async (inputValue, callback, getValue) => {
            if (inputValue.length > 0) {
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
            }
            callback([]);
          },
          title: 'Nom du coach ou candidat lié',
        },
      ],
    },
    {
      component: 'fieldgroup-new',
      hide: (getValue) => {
        const role = getValue('role');
        return role !== USER_ROLES.ADMIN;
      },
      fields: [
        {
          id: 'adminRole',
          name: 'adminRole',
          component: 'select-new',
          title: 'Responsabilité *',
          options: [
            { value: ADMIN_ROLES.CANDIDATES, label: ADMIN_ROLES.CANDIDATES },
            { value: ADMIN_ROLES.COMPANIES, label: ADMIN_ROLES.COMPANIES },
          ],
        },
      ],
    },
    ...mutatedAddOrganizationForm.fields,
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
      field: 'role',
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
      field: 'email',
      method: 'isEmail',
      validWhen: true,
      message: 'Adresse e-mail invalide',
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
    {
      field: 'adminRole',
      method: (fieldValue, fieldValues) => {
        return !fieldValue && fieldValues.role === USER_ROLES.ADMIN;
      },
      args: [],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'organizationId',
      method: (fieldValue, fieldValues) => {
        return (
          !fieldValue && isRoleIncluded(EXTERNAL_USER_ROLES, fieldValues.role)
        );
      },
      args: [],
      validWhen: false,
      message: 'Obligatoire',
    },
    ...mutatedAddOrganizationForm.rules,
  ],
};
