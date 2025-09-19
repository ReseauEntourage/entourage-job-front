import { FilterConstant } from './utils';

export enum CompanyUserRole {
  EXECUTIVE = 'executive',
  MANAGER = 'manager',
  RSE = 'rse',
  RH = 'rh',
  EMPLOYEE = 'employee',
}

export const COMPANY_ROLES = [
  {
    name: 'Dirigeant.e',
    value: CompanyUserRole.EXECUTIVE,
  },
  {
    name: "Responsable d'équipe",
    value: CompanyUserRole.MANAGER,
  },
  {
    name: 'Responsable RSE',
    value: CompanyUserRole.RSE,
  },
  {
    name: 'RH - Chargé.e de recrutement',
    value: CompanyUserRole.RH,
  },
  {
    name: 'Autre',
    value: CompanyUserRole.EMPLOYEE,
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
