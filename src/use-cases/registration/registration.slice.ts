import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FirstStepData,
  REGISTRATION_FIRST_STEP,
  RegistrationErrorMessages,
  RegistrationStep,
  RegistrationStepData,
  StepData,
} from 'src/components/registration/Registration.types';
import { NormalUserRole } from 'src/constants/users';
import { RequestState, SliceRootState } from 'src/store/utils';
import { assertIsDefined } from 'src/utils/asserts';
import { createUserAdapter } from './registration.adapters';

export interface State {
  createUser: RequestState<typeof createUserAdapter>;
  currentStep: RegistrationStep | null;
  selectedRole: NormalUserRole | null;
  data: RegistrationStepData;
  isLoading: boolean;
}

const initialState: State = {
  createUser: createUserAdapter.getInitialState(),
  currentStep: null,
  selectedRole: null,
  data: {},
  isLoading: true,
};

export const slice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    ...createUserAdapter.getReducers<State>((state) => state.createUser, {
      createUserSucceeded(_state) {},
      createUserFailed(state) {
        state.isLoading = false;
      },
    }),
    setRegistrationCurrentStepData(state, action: PayloadAction<StepData>) {
      const { currentStep } = state;

      assertIsDefined(currentStep, RegistrationErrorMessages.CURRENT_STEP);

      if (currentStep === REGISTRATION_FIRST_STEP) {
        state.selectedRole =
          (action.payload as FirstStepData).role?.[0] || null;
      } else {
        const { selectedRole } = state;

        assertIsDefined(selectedRole, RegistrationErrorMessages.SELECTED_ROLE);

        const currentStepData = state.data[currentStep] || {};

        state.data[currentStep] = {
          ...currentStepData,
          [selectedRole]: action.payload,
        };
      }
    },
    setRegistrationStep(state, action: PayloadAction<RegistrationStep | null>) {
      state.currentStep = action.payload;
      state.isLoading = true;
    },
    setRegistrationIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    resetRegistrationData(state) {
      state.selectedRole = null;
      state.data = {};
      state.isLoading = true;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
