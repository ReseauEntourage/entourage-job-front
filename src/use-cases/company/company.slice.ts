import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CompaniesFilters, CompanyWithUsers } from '@/src/api/types';
import { COMPANIES_LIMIT } from '@/src/constants';
import { RequestState, SliceRootState } from 'src/store/utils';
import {
  fetchCompaniesAdapter,
  fetchSelectedCompanyAdapter,
  fetchSelectedCompanyWithCollaboratorsAdapter,
  inviteCollaboratorsAdapter,
  updateCompanyAdapter,
  updateCompanyLogoAdapter,
} from './company.adapters';

export interface State {
  fetchCompanies: RequestState<typeof fetchCompaniesAdapter>;
  fetchSelectedCompany: RequestState<typeof fetchSelectedCompanyAdapter>;
  fetchSelectedCompanyWithCollaborators: RequestState<
    typeof fetchSelectedCompanyWithCollaboratorsAdapter
  >;
  updateCompanyLogo: RequestState<typeof updateCompanyLogoAdapter>;
  updateCompany: RequestState<typeof updateCompanyAdapter>;
  inviteCollaborators: RequestState<typeof inviteCollaboratorsAdapter>;
  selectedCompanyId: string | null;
  selectedCompany: CompanyWithUsers | null;
  selectedCompanyWithCollaborators: CompanyWithUsers | null;
  companies: CompanyWithUsers[];
  companiesOffset: number;
  companiesHasFetchedAll: boolean;
}

const initialState: State = {
  fetchCompanies: fetchCompaniesAdapter.getInitialState(),
  fetchSelectedCompany: fetchSelectedCompanyAdapter.getInitialState(),
  fetchSelectedCompanyWithCollaborators:
    fetchSelectedCompanyWithCollaboratorsAdapter.getInitialState(),
  updateCompanyLogo: updateCompanyLogoAdapter.getInitialState(),
  updateCompany: updateCompanyAdapter.getInitialState(),
  inviteCollaborators: inviteCollaboratorsAdapter.getInitialState(),
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
    ...fetchSelectedCompanyWithCollaboratorsAdapter.getReducers<State>(
      (state) => state.fetchSelectedCompanyWithCollaborators,
      {
        fetchSelectedCompanyWithCollaboratorsSucceeded(
          state,
          action: PayloadAction<CompanyWithUsers>
        ) {
          state.selectedCompanyWithCollaborators = action.payload;
        },
      }
    ),
    ...inviteCollaboratorsAdapter.getReducers<State>(
      (state) => state.inviteCollaborators,
      {}
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
