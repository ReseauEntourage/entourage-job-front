import { CVStatus } from 'src/api/types';
import { CV_STATUS } from 'src/constants';
import { fetchCVAdapter } from './cv.adapter';
import { RootState } from './cv.slice';

export const fetchCVSelectors = fetchCVAdapter.getSelectors<RootState>(
  (state) => state.cv.fetchCV
);

export function selectCurrentCV(state: RootState) {
  return state.cv.currentCv;
}

export function selectIsCurrentCVValidated(state: RootState) {
  return state.cv.currentCv?.status === CV_STATUS.Published.value;
}

export function selectCurrentCVStatus(state: RootState): CVStatus | undefined {
  return state.cv.currentCv?.status;
}
