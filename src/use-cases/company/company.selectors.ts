import {
  fetchCompaniesAdapter,
  fetchSelectedCompanyAdapter,
  fetchSelectedCompanyWithCollaboratorsAdapter,
  inviteCollaboratorsAdapter,
  updateCompanyAdapter,
  updateCompanyLogoAdapter,
} from './company.adapters';
import { RootState } from './company.slice';

export const fetchCompaniesSelectors =
  fetchCompaniesAdapter.getSelectors<RootState>(
    (state) => state.company.fetchCompanies
  );

export const fetchSelectedCompanySelectors =
  fetchSelectedCompanyAdapter.getSelectors<RootState>(
    (state) => state.company.fetchSelectedCompany
  );

export const updateCompanyLogoSelectors =
  updateCompanyLogoAdapter.getSelectors<RootState>(
    (state) => state.company.updateCompanyLogo
  );

export function selectSelectedCompanyId(state: RootState) {
  return state.company.selectedCompanyId;
}

export function selectSelectedCompany(state: RootState) {
  return state.company.selectedCompany;
}

export function selectSelectedCompanyWithCollaborators(state: RootState) {
  return state.company.selectedCompanyWithCollaborators;
}

export function selectCompanies(state: RootState) {
  return state.company.companies;
}

export function selectCompaniesHasFetchedAll(state: RootState) {
  return state.company.companiesHasFetchedAll;
}

export function selectCompaniesOffset(state: RootState) {
  return state.company.companiesOffset;
}

export const selectIsFetchCompanySelectors =
  fetchSelectedCompanyAdapter.getSelectors<RootState>(
    (state) => state.company.fetchSelectedCompany
  );

export const selectIsFetchCompanyWithCollaboratorsSelectors =
  fetchSelectedCompanyWithCollaboratorsAdapter.getSelectors<RootState>(
    (state) => state.company.fetchSelectedCompanyWithCollaborators
  );
