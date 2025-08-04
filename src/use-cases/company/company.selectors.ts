import { fetchSelectedCompanyAdapter } from './company.adapters';
import { RootState } from './company.slice';

export const fetchSelectedCompanySelectors =
  fetchSelectedCompanyAdapter.getSelectors<RootState>(
    (state) => state.company.fetchSelectedCompany
  );

export function selectSelectedCompanyId(state: RootState) {
  return state.company.selectedCompanyId;
}

export function selectSelectedCompany(state: RootState) {
  return state.company.selectedCompany;
}
