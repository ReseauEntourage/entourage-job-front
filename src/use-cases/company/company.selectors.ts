import {
  fetchSelectedCompanyAdapter,
  updateCompanyAdapter,
  updateCompanyLogoAdapter,
} from './company.adapters';
import { RootState } from './company.slice';

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

export const selectIsFetchCompanySelectors =
  fetchSelectedCompanyAdapter.getSelectors<RootState>(
    (state) => state.company.fetchSelectedCompany
  );
