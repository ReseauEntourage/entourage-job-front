import { ReduxRequestEvents } from '@/src/constants';
import { api } from '@/src/store/api/api.slice';
import {
  companyApi,
  FETCH_COMPANIES_FIXED_CACHE_KEY,
  FETCH_SELECTED_COMPANY_FIXED_CACHE_KEY,
  FETCH_SELECTED_COMPANY_WITH_COLLABORATORS_FIXED_CACHE_KEY,
  UPDATE_COMPANY_LOGO_FIXED_CACHE_KEY,
} from './company.api';
import { RootState as CompanySliceRootState } from './company.slice';

// `RootState` here also needs the shared `api` reducer key (for the
// `companyApi.endpoints.*.select()` calls below) — same reasoning as
// `store.ts`/`createTestStore.ts`.
type RootState = CompanySliceRootState & {
  [K in typeof api.reducerPath]: ReturnType<typeof api.reducer>;
};

type ReduxRequestStatus =
  (typeof ReduxRequestEvents)[keyof typeof ReduxRequestEvents];

/**
 * Maps an RTK Query result's status flags to the `ReduxRequestEvents` enum
 * this domain's consumers already compare against, so migrating the data
 * layer doesn't force every consumer to switch to `isLoading`/`isSuccess`.
 */
function toReduxRequestStatus(result: {
  isUninitialized: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}): ReduxRequestStatus {
  if (result.isSuccess) {
    return ReduxRequestEvents.SUCCEEDED;
  }
  if (result.isError) {
    return ReduxRequestEvents.FAILED;
  }
  if (result.isUninitialized) {
    return ReduxRequestEvents.IDLE;
  }
  return ReduxRequestEvents.REQUESTED;
}

export const fetchCompaniesSelectors = {
  selectIsFetchCompaniesIdle: (state: RootState) =>
    companyApi.endpoints.fetchCompanies.select(FETCH_COMPANIES_FIXED_CACHE_KEY)(
      state
    ).isUninitialized,
  selectIsFetchCompaniesRequested: (state: RootState) =>
    companyApi.endpoints.fetchCompanies.select(FETCH_COMPANIES_FIXED_CACHE_KEY)(
      state
    ).isLoading,
  selectIsFetchCompaniesFailed: (state: RootState) =>
    companyApi.endpoints.fetchCompanies.select(FETCH_COMPANIES_FIXED_CACHE_KEY)(
      state
    ).isError,
};

export const fetchSelectedCompanySelectors = {
  selectIsFetchSelectedCompanyRequested: (state: RootState) =>
    companyApi.endpoints.fetchSelectedCompany.select(
      FETCH_SELECTED_COMPANY_FIXED_CACHE_KEY
    )(state).isLoading,
};

// Duplicate of `fetchSelectedCompanySelectors` above (same underlying
// fixed-cache-key result): both names are used by different consumer files
// (`useSelectedCompany.ts` vs. `pages/backoffice/companies/[companyId]`) and
// are kept as-is rather than merged, mirroring the original
// `createRequestAdapter`-based duplication.
export const selectIsFetchCompanySelectors = fetchSelectedCompanySelectors;

export const selectIsFetchCompanyWithCollaboratorsSelectors = {
  selectIsFetchSelectedCompanyWithCollaboratorsRequested: (state: RootState) =>
    companyApi.endpoints.fetchSelectedCompanyWithCollaborators.select(
      FETCH_SELECTED_COMPANY_WITH_COLLABORATORS_FIXED_CACHE_KEY
    )(state).isLoading,
};

export const updateCompanyLogoSelectors = {
  selectUpdateCompanyLogoStatus: (state: RootState) =>
    toReduxRequestStatus(
      companyApi.endpoints.updateCompanyLogo.select(
        UPDATE_COMPANY_LOGO_FIXED_CACHE_KEY
      )(state)
    ),
};

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
