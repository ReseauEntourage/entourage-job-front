import { FilterConstant } from './utils';

export const COMPANY_ROLES = [
  {
    name: 'Dirigeant.e',
    value: 'executive',
  },
  {
    name: "Responsable d'équipe",
    value: 'manager',
  },
  {
    name: 'Responsable RSE',
    value: 'rse',
  },
  {
    name: 'RH - Chargé.e de recrutement',
    value: 'rh',
  },
  {
    name: 'Autre',
    value: 'employee',
  },
];

export type CompanyRoleName = (typeof COMPANY_ROLES)[number]['name'];

export const COMPANY_ROLES_FILTERS: FilterConstant<CompanyRoleName>[] = [
  ...COMPANY_ROLES.map(({ name, value }) => {
    return {
      value,
      label: name,
    };
  }),
];
