import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CompaniesFilters,
  CompanyWithUsers,
  UpdateCompanyDto,
} from '@/src/api/types';
import { COMPANIES_LIMIT } from '@/src/constants';
import { SliceRootState } from '@/src/store/utils';

interface State {
  selectedCompanyId: string | null;
  selectedCompany: CompanyWithUsers | null;
  selectedCompanyWithCollaborators: CompanyWithUsers | null;
  companies: CompanyWithUsers[];
  companiesOffset: number;
  companiesHasFetchedAll: boolean;
}

const initialState: State = {
  companiesOffset: 0,
  companiesHasFetchedAll: false,
  selectedCompanyId: null,
  selectedCompany: null,
  selectedCompanyWithCollaborators: null,
  companies: [],
};

export const slice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    fetchCompaniesSucceeded(state, action: PayloadAction<CompanyWithUsers[]>) {
      state.companies =
        state.companiesOffset === 0
          ? action.payload
          : [...state.companies, ...action.payload];
      state.companiesHasFetchedAll = action.payload.length < COMPANIES_LIMIT;
    },
    fetchSelectedCompanySucceeded(
      state,
      action: PayloadAction<CompanyWithUsers>
    ) {
      state.selectedCompany = action.payload;
    },
    fetchSelectedCompanyWithCollaboratorsSucceeded(
      state,
      action: PayloadAction<CompanyWithUsers>
    ) {
      state.selectedCompanyWithCollaborators = action.payload;
    },
    setSelectedCompanyId(state, action: PayloadAction<string | null>) {
      state.selectedCompanyId = action.payload;
    },
    resetCompaniesOffset(state) {
      state.companiesOffset = 0;
      state.companiesHasFetchedAll = false;
      state.companies = [];
    },
    incrementCompaniesOffset(state) {
      state.companiesOffset += COMPANIES_LIMIT;
    },
    // No-op trigger actions: real handling lives in `company.api.ts`,
    // dispatched via `company.listeners.ts` in reaction to these.
    fetchCompaniesWithFilters(
      _state,
      _action: PayloadAction<CompaniesFilters>
    ) {},
    // No-op trigger: the guard (hasFetchedAll / last fetch succeeded / not
    // currently loading) and the offset increment both moved to
    // `company.listeners.ts`, since the guard now needs the `fetchCompanies`
    // mutation's own state.
    fetchCompaniesNextPage(_state, _action: PayloadAction<CompaniesFilters>) {},
    fetchCompaniesRequested(
      _state,
      _action: PayloadAction<CompaniesFilters>
    ) {},
    fetchSelectedCompanyRequested(_state, _action: PayloadAction<void>) {},
    fetchSelectedCompanyWithCollaboratorsRequested(
      _state,
      _action: PayloadAction<void>
    ) {},
    updateCompanyLogoRequested(
      _state,
      _action: PayloadAction<{ companyId: string; logoFile: File }>
    ) {},
    updateCompanyRequested(
      _state,
      _action: PayloadAction<{ companyData: Partial<UpdateCompanyDto> }>
    ) {},
    inviteCollaboratorsRequested(
      _state,
      _action: PayloadAction<{ companyId: string; emails: string[] }>
    ) {},
  },
});

export type RootState = SliceRootState<typeof slice>;
