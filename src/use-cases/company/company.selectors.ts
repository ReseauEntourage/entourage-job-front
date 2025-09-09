import {
  fetchCompaniesAdapter,
  fetchSelectedCompanyAdapter,
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

export const updateCompanySelectors =
  updateCompanyAdapter.getSelectors<RootState>(
    (state) => state.company.updateCompany
  );

export function selectSelectedCompanyId(state: RootState) {
  return state.company.selectedCompanyId;
}

export function selectSelectedCompany(state: RootState) {
  return state.company.selectedCompany;
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
