import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import Api from 'src/api/index';
import {
  ADMIN_ROLES,
  USER_ROLES,
  USER_ROLES_FILTERS,
  RELATED_ROLES,
  EXTERNAL_USER_ROLES,
} from 'src/constants';
import { ADMIN_ZONES_FILTERS } from 'src/constants/departements';
import { areRolesIncluded } from 'src/utils';

export const formAddUser = {
  id: 'form-add-user',
  fields: [
    {
      id: 'memberInformation',
      title: 'Information du nouveau membre',
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
          // TODO FIX BUG VALUE = 0
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
      fields: [
        {
          id: 'organizationId',
          name: 'organizationId',
          component: 'select-request-async',
          cacheOptions: false,
          disable: (getValue) => {
            return !areRolesIncluded(EXTERNAL_USER_ROLES, [getValue('role')]);
          },
          loadOptions: async (inputValue, callback) => {
            if (inputValue.length > 0) {
              const { data: organizations } = await Api.getAllOrganizations({
                params: {
                  search: inputValue,
                },
              });

              callback(
                organizations.map((u) => {
                  return {
                    value: u.id,
                    label: `${u.name}`,
                  };
                })
              );
            }
            callback([]);
          },
          title: 'Structure partenaire *',
          fieldsToReset: ['userToLinkId'],
        },
        {
          id: 'userToLinkId',
          name: 'userToLinkId',
          component: 'select-request-async',
          cacheOptions: false,
          disable: (getValue) => {
            const role = getValue('role');
            const organizationId = getValue('organizationId')?.value;
            return (
              role === USER_ROLES.ADMIN ||
              (areRolesIncluded(EXTERNAL_USER_ROLES, [role]) && !organizationId)
            );
          },
          loadOptions: async (inputValue, callback, getValue) => {
            if (inputValue.length > 0) {
              const role = RELATED_ROLES[getValue('role')];

              const organizationId = getValue('organizationId').value;

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
      id: 'adminRole',
      name: 'adminRole',
      component: 'select-new',
      title: 'Responsabilité *',
      options: [
        { value: ADMIN_ROLES.CANDIDATES, label: ADMIN_ROLES.CANDIDATES },
        { value: ADMIN_ROLES.COMPANIES, label: ADMIN_ROLES.COMPANIES },
      ],
      hide: (getValue) => {
        return getValue('role') !== USER_ROLES.ADMIN;
      },
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
  ],
};
