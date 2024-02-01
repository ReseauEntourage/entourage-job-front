import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CV } from 'src/api/types';
import {
    fetchCVAdapter,
} from './cv.adapter';
import { RequestState, SliceRootState } from 'src/store/utils';

export interface State {
    fetchCV: RequestState<typeof fetchCVAdapter>;
    cv: CV | null;
}

const initialState: State = {
    fetchCV: fetchCVAdapter.getInitialState(),
    cv: null,
};

export const slice = createSlice({
    name: 'cv',
    initialState,
    reducers: {
        ...fetchCVAdapter.getReducers<State>((state) => state.fetchCV, {
            fetchCVSucceeded(state, action) {
                state.cv = action.payload;
            },
        }),
    },
});

export type RootState = SliceRootState<typeof slice>;
