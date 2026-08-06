import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecruitementAlert, RecruitementAlertDto } from '@/src/api/types';
import { SliceRootState } from '@/src/store/utils';

interface State {
  recruitementAlerts: RecruitementAlert[];
}

const initialState: State = {
  recruitementAlerts: [],
};

export const slice = createSlice({
  name: 'recruitementAlerts',
  initialState,
  reducers: {
    fetchRecruitementAlertsSucceeded(
      state,
      action: PayloadAction<RecruitementAlert[]>
    ) {
      state.recruitementAlerts = action.payload;
    },
    removeRecruitementAlert(state, action: PayloadAction<string>) {
      state.recruitementAlerts = state.recruitementAlerts.filter(
        (alert) => alert.id !== action.payload
      );
    },
    updateRecruitementAlertSucceeded(
      state,
      action: PayloadAction<RecruitementAlert>
    ) {
      state.recruitementAlerts = state.recruitementAlerts.map((alert) =>
        alert.id === action.payload.id ? action.payload : alert
      );
    },
    // No-op trigger actions: real handling lives in
    // `recruitement-alerts.api.ts`, dispatched via
    // `recruitement-alerts.listeners.ts` in reaction to these.
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
} = slice.actions;
