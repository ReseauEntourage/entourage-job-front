import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CompanyWithUsers } from '@/src/api/types';
import { RequestState, SliceRootState } from 'src/store/utils';
import { fetchSelectedCompanyAdapter } from './company.adapters';

export interface State {
  fetchSelectedCompany: RequestState<typeof fetchSelectedCompanyAdapter>;
  selectedCompanyId: string | null;
  selectedCompany: CompanyWithUsers | null;
}

const initialState: State = {
  fetchSelectedCompany: fetchSelectedCompanyAdapter.getInitialState(),
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
        fetchSelectedCompanyFailed(_state) {
          // En cas d'échec, on ne modifie pas la société sélectionnée
        },
      }
    ),
    setSelectedCompanyId(state, action: PayloadAction<string | null>) {
      state.selectedCompanyId = action.payload;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
