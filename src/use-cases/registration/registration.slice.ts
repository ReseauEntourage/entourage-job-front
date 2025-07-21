import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RegistrationFlow } from '@/src/components/registration/flows/flows.types';
import {
  REGISTRATION_COMPANY_FLOW_COMPANY_SELECTION_STEP,
  REGISTRATION_FIRST_STEP,
} from '@/src/components/registration/registration.config';
import {
  RegistrationFormData,
  RegistrationStep,
  RegistrationStepData,
} from '@/src/components/registration/registration.types';
import { RequestState, SliceRootState } from 'src/store/utils';
import { createUserAdapter, CreateUserError } from './registration.adapters';

export interface State {
  createUser: RequestState<typeof createUserAdapter>;
  createUserError: CreateUserError | null;
  currentStep: RegistrationStep;
  selectedFlow: RegistrationFlow | null;
  data: RegistrationStepData;
  isLoading: boolean;
  isEnded?: boolean;
}

const initialState: State = {
  createUser: createUserAdapter.getInitialState(),
  createUserError: null,
  selectedFlow: null,
  currentStep: -1,
  data: {},
  isLoading: false,
  isEnded: false,
};

export const slice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    ...createUserAdapter.getReducers<State>((state) => state.createUser, {
      createUserRequested(state) {
        state.isLoading = true;
        state.createUserError = null;
      },
      createUserSucceeded(_state) {},
      createUserFailed(
        state,
        action: PayloadAction<{ error: CreateUserError } | null>
      ) {
        state.isLoading = false;
        state.createUserError = action.payload?.error || null;
      },
    }),
    moveForwardInRegistration(
      state,
      action: PayloadAction<{
        flow?: RegistrationFlow | null;
        step?: RegistrationStep;
        data?: RegistrationFormData;
      }>
    ) {
      const { selectedFlow } = state;

      // Transit to the flow if it is not already set
      if (action.payload.flow !== undefined) {
        state.selectedFlow = action.payload.flow;
      }

      if (selectedFlow && action.payload.data !== undefined) {
        const newData = action.payload.data;
        const currentStepData = state.data[state.currentStep] || {};

        state.data[state.currentStep] = {
          ...currentStepData,
          ...newData,
        } as RegistrationFormData;
      }

      // Update the current step to the next step
      if (action.payload.step !== undefined) {
        state.currentStep = action.payload.step;
      }
    },
    setRegistrationIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    resetRegistrationData(state) {
      state.selectedFlow = null;
      state.currentStep = -1; // Reset to no step selected
      state.data = {};
      state.isEnded = false;
    },
    setRegistrationIsEnded(state, action: PayloadAction<boolean>) {
      state.isEnded = action.payload;
    },
    setCompanyFlowWithId(
      state,
      action: PayloadAction<{ companyId: string; companyName?: string }>
    ) {
      state.selectedFlow = RegistrationFlow.COMPANY; // Ensure the flow is set to COMPANY
      state.currentStep = REGISTRATION_FIRST_STEP; // Reset to the first step
      // Set the default company ID in the data for the company selection step
      state.data[REGISTRATION_COMPANY_FLOW_COMPANY_SELECTION_STEP] = {
        companyId: {
          label: action.payload.companyName,
          value: action.payload.companyId,
        },
      };
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
