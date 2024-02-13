import { fetchCVAdapter } from './cv.adapter';
import { RootState } from './cv.slice';

export const fetchCVSelectors = fetchCVAdapter.getSelectors<RootState>(
  (state) => state.cv.fetchCV
);

export function selectCV(state: RootState) {
  return state.cv.currentCv;
}
