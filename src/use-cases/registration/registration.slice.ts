import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AllStepData,
  FirstStepData,
  REGISTRATION_FIRST_STEP,
  RegistrationErrorMessages,
  RegistrationStep,
  RegistrationStepData,
} from 'src/components/registration/Registration/Registration.types';
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
      // TODO on creation success, set user data
    }),
    setRegistrationCurrentStepData(state, action: PayloadAction<AllStepData>) {
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
