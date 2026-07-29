import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ReferingErrorMessages,
  ReferingFormData,
  ReferingStep,
  ReferingStepData,
} from '@/src/features/backoffice/referer/Refering/Refering.types';
import { SliceRootState } from '@/src/store/utils';
import { assertIsDefined } from '@/src/utils/asserts';

interface State {
  currentStep: ReferingStep | null;
  data: ReferingStepData;
  isLoading: boolean;
}

const initialState: State = {
  currentStep: null,
  data: {},
  isLoading: false,
};

export const slice = createSlice({
  name: 'refering',
  initialState,
  reducers: {
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
