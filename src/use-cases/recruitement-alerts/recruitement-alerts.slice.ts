import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PublicProfile,
  RecruitementAlert,
  RecruitementAlertDto,
} from 'src/api/types';
import { RequestState, SliceRootState } from 'src/store/utils';
import {
  fetchRecruitementAlertsAdapter,
  createRecruitementAlertAdapter,
  deleteRecruitementAlertAdapter,
  updateRecruitementAlertAdapter,
  fetchRecruitementAlertMatchingAdapter,
} from './recruitement-alerts.adapters';

export interface State {
  fetchRecruitementAlerts: RequestState<typeof fetchRecruitementAlertsAdapter>;
  createRecruitementAlert: RequestState<typeof createRecruitementAlertAdapter>;
  deleteRecruitementAlert: RequestState<typeof deleteRecruitementAlertAdapter>;
  updateRecruitementAlert: RequestState<typeof updateRecruitementAlertAdapter>;
  fetchRecruitementAlertMatching: RequestState<
    typeof fetchRecruitementAlertMatchingAdapter
  >;
  recruitementAlerts: RecruitementAlert[];
  recruitementAlertMatchings: Record<string, PublicProfile[]>;
}

const initialState: State = {
  fetchRecruitementAlerts: fetchRecruitementAlertsAdapter.getInitialState(),
  createRecruitementAlert: createRecruitementAlertAdapter.getInitialState(),
  deleteRecruitementAlert: deleteRecruitementAlertAdapter.getInitialState(),
  updateRecruitementAlert: updateRecruitementAlertAdapter.getInitialState(),
  fetchRecruitementAlertMatching:
    fetchRecruitementAlertMatchingAdapter.getInitialState(),
  recruitementAlerts: [],
  recruitementAlertMatchings: {},
};

export const slice = createSlice({
  name: 'recruitementAlerts',
  initialState,
  reducers: {
    ...fetchRecruitementAlertsAdapter.getReducers<State>(
      (state) => state.fetchRecruitementAlerts,
      {
        fetchRecruitementAlertsSucceeded(state, action) {
          state.recruitementAlerts = action.payload;
        },
      }
    ),
    ...createRecruitementAlertAdapter.getReducers<State>(
      (state) => state.createRecruitementAlert,
      {
        createRecruitementAlertSucceeded() {},
      }
    ),
    ...deleteRecruitementAlertAdapter.getReducers<State>(
      (state) => state.deleteRecruitementAlert,
      {
        deleteRecruitementAlertSucceeded(state, action) {
          state.recruitementAlerts = state.recruitementAlerts.filter(
            (alert) => alert.id !== action.payload
          );
          // Suppression des matchings associés à cette alerte
          if (state.recruitementAlertMatchings[action.payload]) {
            delete state.recruitementAlertMatchings[action.payload];
          }
        },
      }
    ),
    ...updateRecruitementAlertAdapter.getReducers<State>(
      (state) => state.updateRecruitementAlert,
      {
        updateRecruitementAlertSucceeded(state, action) {
          state.recruitementAlerts = state.recruitementAlerts.map((alert) =>
            alert.id === action.payload.id ? action.payload : alert
          );
        },
      }
    ),
    resetRecruitementAlerts(state) {
      state.recruitementAlerts = [];
    },
    ...fetchRecruitementAlertMatchingAdapter.getReducers<State>(
      (state) => state.fetchRecruitementAlertMatching,
      {
        fetchRecruitementAlertMatchingSucceeded(
          state,
          action: PayloadAction<PublicProfile[]> & { meta?: { arg: string } }
        ) {
          // action.meta est ajouté dans la saga
          const alertId = action.meta?.arg;
          if (alertId) {
            // S'assurer que action.payload est un tableau
            const matchingData = Array.isArray(action.payload)
              ? action.payload
              : [];
            state.recruitementAlertMatchings[alertId] = matchingData;
          }
        },
      }
    ),
    fetchRecruitementAlertsAction(_state, _action: PayloadAction<void>) {},
    createRecruitementAlertAction(
      _state,
      _action: PayloadAction<RecruitementAlertDto>
    ) {},
    deleteRecruitementAlertAction(_state, _action: PayloadAction<string>) {},
    updateRecruitementAlertAction(
      _state,
      _action: PayloadAction<{ id: string; data: RecruitementAlertDto }>
    ) {},
    fetchRecruitementAlertMatchingAction(
      _state,
      _action: PayloadAction<string>
    ) {},
  },
});

export type RootState = SliceRootState<typeof slice>;

export const {
  fetchRecruitementAlertsAction,
  createRecruitementAlertAction,
  deleteRecruitementAlertAction,
  updateRecruitementAlertAction,
  fetchRecruitementAlertMatchingAction,
  resetRecruitementAlerts,
} = slice.actions;
