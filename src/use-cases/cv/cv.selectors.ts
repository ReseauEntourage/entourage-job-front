import { RootState } from './cv.slice';

import {
    fetchCVAdapter,
} from './cv.adapter';

export const fetchCVSelectors =
    fetchCVAdapter.getSelectors<RootState>(
        (state) => state.cv.fetchCV
);

export function selectCV(state: RootState) {
    return state.cv.cv;
}