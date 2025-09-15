import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CompanyWithUsers } from '@/src/api/types';
import { RequestState, SliceRootState } from 'src/store/utils';
import {
  fetchSelectedCompanyAdapter,
  updateCompanyAdapter,
  updateCompanyLogoAdapter,
} from './company.adapters';

export interface State {
  fetchSelectedCompany: RequestState<typeof fetchSelectedCompanyAdapter>;
  updateCompanyLogo: RequestState<typeof updateCompanyLogoAdapter>;
  updateCompany: RequestState<typeof updateCompanyAdapter>;
  selectedCompanyId: string | null;
  selectedCompany: CompanyWithUsers | null;
}

const initialState: State = {
  fetchSelectedCompany: fetchSelectedCompanyAdapter.getInitialState(),
  updateCompanyLogo: updateCompanyLogoAdapter.getInitialState(),
  updateCompany: updateCompanyAdapter.getInitialState(),
  selectedCompanyId: null,
  selectedCompany: null,
};

export const slice = createSlice({
  name: 'company',
  initialState,
  reducers: {
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
  },
});

export type RootState = SliceRootState<typeof slice>;
