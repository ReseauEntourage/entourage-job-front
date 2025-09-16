import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CompaniesFilters, CompanyWithUsers } from '@/src/api/types';
import { COMPANIES_LIMIT } from '@/src/constants';
import { RequestState, SliceRootState } from 'src/store/utils';
import {
  fetchCompaniesAdapter,
  fetchSelectedCompanyAdapter,
  updateCompanyAdapter,
  updateCompanyLogoAdapter,
} from './company.adapters';

export interface State {
  fetchCompanies: RequestState<typeof fetchCompaniesAdapter>;
  fetchSelectedCompany: RequestState<typeof fetchSelectedCompanyAdapter>;
  updateCompanyLogo: RequestState<typeof updateCompanyLogoAdapter>;
  updateCompany: RequestState<typeof updateCompanyAdapter>;
  selectedCompanyId: string | null;
  selectedCompany: CompanyWithUsers | null;
  companies: CompanyWithUsers[];
  companiesOffset: number;
  companiesHasFetchedAll: boolean;
}

const initialState: State = {
  fetchCompanies: fetchCompaniesAdapter.getInitialState(),
  fetchSelectedCompany: fetchSelectedCompanyAdapter.getInitialState(),
  updateCompanyLogo: updateCompanyLogoAdapter.getInitialState(),
  updateCompany: updateCompanyAdapter.getInitialState(),
  companiesOffset: 0,
  companiesHasFetchedAll: false,
  selectedCompanyId: null,
  selectedCompany: null,
  companies: [],
};

export const slice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    ...fetchCompaniesAdapter.getReducers<State>(
      (state) => state.fetchCompanies,
      {
        fetchCompaniesSucceeded(
          state,
          action: PayloadAction<CompanyWithUsers[]>
        ) {
          state.companies =
            state.companiesOffset === 0
              ? action.payload
              : [...state.companies, ...action.payload];
          state.companiesHasFetchedAll =
            action.payload.length < COMPANIES_LIMIT;
        },
      }
    ),
    ...fetchSelectedCompanyAdapter.getReducers<State>(
      (state) => state.fetchSelectedCompany,
      {
        fetchSelectedCompanySucceeded(
          state,
          action: PayloadAction<CompanyWithUsers>
        ) {
          state.selectedCompany = action.payload;
        },
      }
    ),
    ...updateCompanyLogoAdapter.getReducers<State>(
      (state) => state.updateCompanyLogo,
      {}
    ),
    ...updateCompanyAdapter.getReducers<State>(
      (state) => state.updateCompany,
      {}
    ),
    setSelectedCompanyId(state, action: PayloadAction<string | null>) {
      state.selectedCompanyId = action.payload;
    },
    resetCompaniesOffset(state) {
      state.companiesOffset = 0;
      state.companiesHasFetchedAll = false;
      state.companies = [];
    },
    fetchCompaniesWithFilters(
      _state,
      _action: PayloadAction<CompaniesFilters>
    ) {},
    fetchCompaniesNextPage(state, _action: PayloadAction<CompaniesFilters>) {
      state.companiesOffset = state.companiesHasFetchedAll
        ? state.companiesOffset
        : state.companiesOffset + COMPANIES_LIMIT;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
