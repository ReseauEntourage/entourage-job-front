import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfileSectorOccupation } from '@/src/api/types';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import { REGISTRATION_FIRST_STEP } from '@/src/features/registration/registration.config';
import {
  RegistrationData,
  RegistrationFormData,
  RegistrationStep,
} from '@/src/features/registration/registration.types';
import { RequestState, SliceRootState } from 'src/store/utils';
import { createUserAdapter, CreateUserError } from './registration.adapters';

export interface PreRegistrationPreferences {
  nudgeIds: string[];
  sectorOccupations: UserProfileSectorOccupation[];
  businessSectorIds: string[];
  currentJob?: string;
}

interface State {
  createUser: RequestState<typeof createUserAdapter>;
  createUserError: CreateUserError | null;
  currentStep: RegistrationStep;
  selectedFlow: RegistrationFlow | null;
  data: RegistrationData;
  isLoading: boolean;
  isEnded?: boolean;
  invitationId?: string;
  preRegistrationPreferences: PreRegistrationPreferences | null;
  compatibleProfilesCount: number | null;
}

const initialState: State = {
  createUser: createUserAdapter.getInitialState(),
  createUserError: null,
  selectedFlow: null,
  currentStep: -1,
  data: null,
  isLoading: false,
  isEnded: false,
  invitationId: undefined,
  preRegistrationPreferences: null,
  compatibleProfilesCount: null,
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

        if (!state.data) {
          state.data = newData as RegistrationData;
        } else {
          state.data = {
            ...state.data,
            ...newData,
          };
        }
      }

      // Update the current step to the next step
      if (action.payload.step !== undefined) {
        state.currentStep = action.payload.step;
      }
    },
    setRegistrationIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    moveBackwardInRegistration(state) {
      if (state.currentStep > REGISTRATION_FIRST_STEP) {
        state.currentStep = state.currentStep - 1;
      }
    },
    setPreRegistrationPreferences(
      state,
      action: PayloadAction<Partial<PreRegistrationPreferences>>
    ) {
      state.preRegistrationPreferences = {
        nudgeIds:
          action.payload.nudgeIds ??
          state.preRegistrationPreferences?.nudgeIds ??
          [],
        sectorOccupations:
          action.payload.sectorOccupations ??
          state.preRegistrationPreferences?.sectorOccupations ??
          [],
        businessSectorIds:
          action.payload.businessSectorIds ??
          state.preRegistrationPreferences?.businessSectorIds ??
          [],
        currentJob:
          action.payload.currentJob ??
          state.preRegistrationPreferences?.currentJob,
      };
    },
    setCompatibleProfilesCount(state, action: PayloadAction<number>) {
      state.compatibleProfilesCount = action.payload;
    },
    resetRegistrationData(state) {
      state.selectedFlow = null;
      state.currentStep = -1; // Reset to no step selected
      state.data = null;
      state.isEnded = false;
      state.preRegistrationPreferences = null;
      state.compatibleProfilesCount = null;
    }
    setRegistrationIsEnded(state, action: PayloadAction<boolean>) {
      state.isEnded = action.payload;
    },
    setStateFromQueryParams(
      state,
      action: PayloadAction<{
        companyName?: string;
        flow?: RegistrationFlow;
        invitationId?: string;
      }>
    ) {
      // Set the selected flow based on the action payload
      state.selectedFlow = action.payload.flow || state.selectedFlow;
      // Reset the current step to the first step if a flow is selected
      state.currentStep = action.payload.flow
        ? REGISTRATION_FIRST_STEP
        : state.currentStep; // Reset to the first step

      // Set a company name if provided in the action payload
      const newData = {
        companyName: {
          // The label will not be displayed, but will be used for form submission
          value: action.payload.companyName,
          label: action.payload.companyName,
        },
      };
      if (action.payload.companyName) {
        if (!state.data) {
          state.data = newData as RegistrationData;
        } else {
          state.data = {
            ...state.data,
            ...(newData as RegistrationData),
          };
        }
      }
      if (action.payload.invitationId) {
        state.invitationId = action.payload.invitationId;
      }
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
