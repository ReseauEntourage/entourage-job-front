import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  REGISTRATION_FIRST_STEP,
  RegistrationStep,
  StepsData,
} from 'src/components/registration/Registration/Registration.types';
import { RequestState, SliceRootState } from 'src/store/utils';
import { createUserAdapter } from './registration.adapters';

export interface State {
  createUser: RequestState<typeof createUserAdapter>;
  currentStep: RegistrationStep;
  data: StepsData;
  isLoading: boolean;
}

const initialState: State = {
  createUser: createUserAdapter.getInitialState(),
  currentStep: REGISTRATION_FIRST_STEP,
  data: {},
  isLoading: true,
};

export const slice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    ...createUserAdapter.getReducers<State>((state) => state.createUser, {
      // TODO on creation success, set user data
    }),
    setRegistrationCurrentStepData(
      state,
      action: PayloadAction<StepsData[RegistrationStep]>
    ) {
      state.data[state.currentStep] = action.payload;
    },
    setRegistrationStep(state, action: PayloadAction<RegistrationStep>) {
      state.currentStep = action.payload;
      state.isLoading = true;
    },
    setRegistrationIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
