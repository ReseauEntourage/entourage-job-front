import React from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import { isEmail } from 'validator';
import { FormSchema, FormSchemaValidation, GetValueType } from '../FormSchema';
import { Api } from 'src/api';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { ADMIN_ZONES_FILTERS, AdminZone } from 'src/constants/departements';
import {
  ADMIN_ROLES,
  USER_ROLES,
  USER_ROLES_FILTERS,
  RELATED_ROLES,
  EXTERNAL_USER_ROLES,
  UserRole,
  Gender,
  AdminRole,
  GENDERS_FILTERS,
} from 'src/constants/users';
import { FilterConstant } from 'src/constants/utils';
import { isRoleIncluded } from 'src/utils/Finding';

export const CREATE_NEW_ORGANIZATION_VALUE = 'createNewOrganization';

const CREATE_NEW_ORGANIZATION_OPTION = {
  value: CREATE_NEW_ORGANIZATION_VALUE,
  label: (
    <>
      <LucidIcon name="Plus" />
      Ajouter une nouvelle structure
    </>
  ),
};

interface FormAddUserSchema extends FormSchemaValidation {
  firstName: string;
  lastName: string;
  role: UserRole;
  gender: Gender;
  zone: AdminZone;
  phone: string;
  email: string;
  userToLinkId: FilterConstant<string> | FilterConstant<string>[];
  adminRole: AdminRole;
  organizationId: FilterConstant<string>;
  nameOrganization: string;
  addressOrganization: string;
  zoneOrganization: AdminZone;
  referentFirstNameOrganization: string;
  referentLastNameOrganization: string;
  referentPhoneOrganization: string;
  referentMailOrganization: string;
}

const hideMethod = (getValue: GetValueType<FormAddUserSchema>) => {
  const role = getValue('role');
  const organizationId = getValue('organizationId')?.value;
  return !(
    isRoleIncluded(EXTERNAL_USER_ROLES, role) &&
    organizationId === CREATE_NEW_ORGANIZATION_VALUE
  );
};

export const formAddUser: FormSchema<FormAddUserSchema> = {
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
        },
        {
          id: 'lastName',
          name: 'lastName',
          component: 'text-input',
          title: 'Nom *',
          isRequired: true,
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
          options: GENDERS_FILTERS,
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
              method: (fieldValue) =>
                !!fieldValue && isValidPhoneNumber(fieldValue, 'FR'),
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
          method: (fieldValue) => isEmail(fieldValue),
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
          isMulti: false,
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
          fieldsToReset: [
            'userToLinkId',
            'nameOrganization',
            'addressOrganization',
            'zoneOrganization',
            'referentFirstNameOrganization',
            'referentLastNameOrganization',
            'referentPhoneOrganization',
            'referentMailOrganization',
          ],
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
    {
      id: 'organizationInformation',
      name: 'organizationInformation',
      title: 'Information structure partenaire',
      component: 'heading',
      hide: hideMethod,
    },
    {
      id: 'nameOrganization',
      name: 'nameOrganization',
      component: 'text-input',
      title: 'Nom de la structure *',
      isRequired: true,
      hide: hideMethod,
    },
    {
      id: 'addressOrganization',
      name: 'addressOrganization',
      component: 'text-input',
      title: 'Adresse postale de la structure *',
      isRequired: true,
      hide: hideMethod,
    },
    {
      id: 'zoneOrganization',
      name: 'zoneOrganization',
      component: 'select-simple',
      title: 'Zone de la structure *',
      options: ADMIN_ZONES_FILTERS,
      isRequired: true,
      hide: hideMethod,
    },
    {
      id: 'referentInformationOrganization',
      name: 'referentInformationOrganization',
      title: 'Coordonnées du référent',
      component: 'heading',
      hide: hideMethod,
    },
    {
      id: 'referentInfoOrganization',
      name: 'referentInfoOrganization',
      component: 'fieldgroup',
      hide: hideMethod,

      fields: [
        {
          id: 'referentFirstNameOrganization',
          name: 'referentFirstNameOrganization',
          component: 'text-input',
          title: 'Prénom du référent *',
          isRequired: true,
          hide: hideMethod,
        },
        {
          id: 'referentLastNameOrganization',
          name: 'referentLastNameOrganization',
          component: 'text-input',
          title: 'Nom du référent *',
          isRequired: true,
          hide: hideMethod,
        },
      ],
    },
    {
      id: 'referentPhoneOrganization',
      name: 'referentPhoneOrganization',
      component: 'tel-input',
      title: 'Numéro de téléphone portable du référent *',
      isRequired: true,
      hide: hideMethod,

      rules: [
        {
          method: (fieldValue) =>
            !!fieldValue && isValidPhoneNumber(fieldValue, 'FR'),
          message: 'Numéro de téléphone invalide',
        },
      ],
    },
    {
      id: 'referentMailOrganization',
      name: 'referentMailOrganization',
      type: 'email',
      component: 'text-input',
      title: 'Adresse mail du référent *',
      isRequired: true,
      hide: hideMethod,

      rules: [
        {
          method: (fieldValue) => isEmail(fieldValue),
          message: 'Adresse e-mail invalide',
        },
      ],
    },
  ],
};
