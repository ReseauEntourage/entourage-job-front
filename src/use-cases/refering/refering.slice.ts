import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ReferingErrorMessages,
  ReferingFormData,
  ReferingStep,
  ReferingStepData,
} from '@/src/features/backoffice/referer/Refering/Refering.types';
import { RequestState, SliceRootState } from 'src/store/utils';
import { assertIsDefined } from 'src/utils/asserts';
import {
  referCandidateAdapter,
  ReferCandidateError,
} from './refering.adapters';

export interface State {
  referCandate: RequestState<typeof referCandidateAdapter>;
  referCandidateError: ReferCandidateError | null;
  currentStep: ReferingStep | null;
  data: ReferingStepData;
  isLoading: boolean;
}

const initialState: State = {
  referCandate: referCandidateAdapter.getInitialState(),
  referCandidateError: null,
  currentStep: null,
  data: {},
  isLoading: false,
};

export const slice = createSlice({
  name: 'refering',
  initialState,
  reducers: {
    ...referCandidateAdapter.getReducers<State>((state) => state.referCandate, {
      referCandidateSucceeded(_state) {},
      referCandidateFailed(
        state,
        action: PayloadAction<{ error: ReferCandidateError } | null>
      ) {
        state.isLoading = false;
        state.referCandidateError = action.payload?.error || null;
      },
    }),
    setReferingCurrentStepData(state, action: PayloadAction<ReferingFormData>) {
      const { currentStep } = state;

      assertIsDefined(currentStep, ReferingErrorMessages.CURRENT_STEP);

      const currentStepData = state.data[currentStep] || {};

      state.data[currentStep] = {
        ...currentStepData,
        ...action.payload,
      };
    },
    setReferingStep(state, action: PayloadAction<ReferingStep | null>) {
      state.currentStep = action.payload;
      state.isLoading = true;
    },
    setReferingIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    resetReferingData(state) {
      state.data = {};
      state.isLoading = true;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
