// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import { REGISTRATION_FIRST_STEP } from '@/src/features/registration/registration.config';
import { RegistrationData } from '@/src/features/registration/registration.types';
import { slice } from './registration.slice';

const { actions, reducer } = slice;

// `NonNullable<RegistrationData>` (rather than `RegistrationData`, which also
// allows `null`) so this fixture is assignable both to the slice's `data`
// state field and to `moveForwardInRegistration`'s `data?: RegistrationFormData`
// payload.
const buildRegistrationData = (
  overrides: Partial<RegistrationData> = {}
): NonNullable<RegistrationData> =>
  ({
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    department: { value: 'PARIS', label: 'Paris' },
    ...overrides,
  }) as NonNullable<RegistrationData>;

describe('registration slice', () => {
  describe('createUser request lifecycle', () => {
    it('createUserRequested sets isLoading and clears the previous error', () => {
      const initialState = {
        ...slice.getInitialState(),
        createUserError: 'DUPLICATE_EMAIL' as const,
      };

      const state = reducer(initialState, actions.createUserRequested());

      expect(state.isLoading).toBe(true);
      expect(state.createUserError).toBeNull();
      expect(state.createUser.status).toBe('REQUESTED');
    });

    it('createUserSucceeded only transitions the request status', () => {
      const initialState = { ...slice.getInitialState(), isLoading: true };

      const state = reducer(initialState, actions.createUserSucceeded());

      expect(state.createUser.status).toBe('SUCCEEDED');
      expect(state.isLoading).toBe(true);
    });

    it('createUserFailed sets isLoading to false and stores the error', () => {
      const state = reducer(
        undefined,
        actions.createUserFailed({ error: 'DUPLICATE_EMAIL' })
      );

      expect(state.isLoading).toBe(false);
      expect(state.createUserError).toBe('DUPLICATE_EMAIL');
      expect(state.createUser.status).toBe('FAILED');
    });

    it('createUserFailed clears the error when no payload is given', () => {
      const state = reducer(undefined, actions.createUserFailed(null));

      expect(state.createUserError).toBeNull();
    });
  });

  describe('moveForwardInRegistration', () => {
    it('sets the selected flow when provided', () => {
      const state = reducer(
        undefined,
        actions.moveForwardInRegistration({ flow: RegistrationFlow.CANDIDATE })
      );

      expect(state.selectedFlow).toBe(RegistrationFlow.CANDIDATE);
    });

    it('does not merge data on the same action that first sets the flow (selectedFlow is read before the flow is applied)', () => {
      const data = buildRegistrationData();

      const state = reducer(
        undefined,
        actions.moveForwardInRegistration({
          flow: RegistrationFlow.CANDIDATE,
          data,
        })
      );

      expect(state.selectedFlow).toBe(RegistrationFlow.CANDIDATE);
      expect(state.data).toBeNull();
    });

    it('sets data as-is when there was none yet and a flow is already selected', () => {
      const initialState = {
        ...slice.getInitialState(),
        selectedFlow: RegistrationFlow.CANDIDATE,
      };
      const data = buildRegistrationData();

      const state = reducer(
        initialState,
        actions.moveForwardInRegistration({ data })
      );

      expect(state.data).toEqual(data);
    });

    it('merges new data into existing data when a flow is already selected', () => {
      const initialState = {
        ...slice.getInitialState(),
        selectedFlow: RegistrationFlow.CANDIDATE,
        data: buildRegistrationData({ firstName: 'Old' }),
      };

      const state = reducer(
        initialState,
        actions.moveForwardInRegistration({
          data: buildRegistrationData({
            firstName: 'New',
            lastName: 'Updated',
          }),
        })
      );

      expect(state.data).toEqual(
        buildRegistrationData({ firstName: 'New', lastName: 'Updated' })
      );
    });

    it('ignores data when no flow has ever been selected', () => {
      const state = reducer(
        undefined,
        actions.moveForwardInRegistration({ data: buildRegistrationData() })
      );

      expect(state.data).toBeNull();
    });

    it('updates the current step when provided', () => {
      const state = reducer(
        undefined,
        actions.moveForwardInRegistration({ step: 2 })
      );

      expect(state.currentStep).toBe(2);
    });

    it('leaves the current step untouched when not provided', () => {
      const initialState = { ...slice.getInitialState(), currentStep: 3 };

      const state = reducer(
        initialState,
        actions.moveForwardInRegistration({ flow: RegistrationFlow.COACH })
      );

      expect(state.currentStep).toBe(3);
    });
  });

  it('setRegistrationIsLoading sets the isLoading flag', () => {
    const state = reducer(undefined, actions.setRegistrationIsLoading(true));

    expect(state.isLoading).toBe(true);
  });

  describe('moveBackwardInRegistration', () => {
    it('decrements the current step when above the first step', () => {
      const initialState = { ...slice.getInitialState(), currentStep: 2 };

      const state = reducer(initialState, actions.moveBackwardInRegistration());

      expect(state.currentStep).toBe(1);
    });

    it('does nothing when already at the first step', () => {
      const initialState = {
        ...slice.getInitialState(),
        currentStep: REGISTRATION_FIRST_STEP,
      };

      const state = reducer(initialState, actions.moveBackwardInRegistration());

      expect(state.currentStep).toBe(REGISTRATION_FIRST_STEP);
    });

    it('does nothing when below the first step (no flow selected yet)', () => {
      const state = reducer(undefined, actions.moveBackwardInRegistration());

      expect(state.currentStep).toBe(-1);
    });
  });

  describe('setPreRegistrationPreferences', () => {
    it('fills in defaults for fields not yet set when there were no preferences', () => {
      const state = reducer(
        undefined,
        actions.setPreRegistrationPreferences({ nudgeIds: ['nudge-1'] })
      );

      expect(state.preRegistrationPreferences).toEqual({
        nudgeIds: ['nudge-1'],
        sectorOccupations: [],
        businessSectorIds: [],
        currentJob: undefined,
      });
    });

    it('preserves previously set fields that are not included in the new payload', () => {
      const initialState = {
        ...slice.getInitialState(),
        preRegistrationPreferences: {
          nudgeIds: ['nudge-1'],
          sectorOccupations: [{ id: 'sector-1' }] as any,
          businessSectorIds: ['business-1'],
          currentJob: 'Developer',
        },
      };

      const state = reducer(
        initialState,
        actions.setPreRegistrationPreferences({ currentJob: 'Manager' })
      );

      expect(state.preRegistrationPreferences).toEqual({
        nudgeIds: ['nudge-1'],
        sectorOccupations: [{ id: 'sector-1' }],
        businessSectorIds: ['business-1'],
        currentJob: 'Manager',
      });
    });

    it('overrides a field with a new empty array instead of falling back to the previous value', () => {
      const initialState = {
        ...slice.getInitialState(),
        preRegistrationPreferences: {
          nudgeIds: ['nudge-1'],
          sectorOccupations: [],
          businessSectorIds: [],
          currentJob: undefined,
        },
      };

      const state = reducer(
        initialState,
        actions.setPreRegistrationPreferences({ nudgeIds: [] })
      );

      expect(state.preRegistrationPreferences?.nudgeIds).toEqual([]);
    });
  });

  it('setCompatibleProfilesCount sets the compatible profiles count', () => {
    const state = reducer(undefined, actions.setCompatibleProfilesCount(42));

    expect(state.compatibleProfilesCount).toBe(42);
  });

  describe('resetRegistrationData', () => {
    it('resets the flow, step, data, ended flag, preferences and compatible profiles count', () => {
      const initialState = {
        ...slice.getInitialState(),
        selectedFlow: RegistrationFlow.CANDIDATE,
        currentStep: 2,
        data: buildRegistrationData(),
        isEnded: true,
        preRegistrationPreferences: {
          nudgeIds: ['nudge-1'],
          sectorOccupations: [],
          businessSectorIds: [],
          currentJob: 'Dev',
        },
        compatibleProfilesCount: 5,
      };

      const state = reducer(initialState, actions.resetRegistrationData());

      expect(state.selectedFlow).toBeNull();
      expect(state.currentStep).toBe(-1);
      expect(state.data).toBeNull();
      expect(state.isEnded).toBe(false);
      expect(state.preRegistrationPreferences).toBeNull();
      expect(state.compatibleProfilesCount).toBeNull();
    });

    it('leaves invitationId and the createUser request state untouched', () => {
      const initialState = {
        ...slice.getInitialState(),
        invitationId: 'invitation-1',
        isLoading: true,
      };

      const state = reducer(initialState, actions.resetRegistrationData());

      expect(state.invitationId).toBe('invitation-1');
      expect(state.isLoading).toBe(true);
    });
  });

  it('setRegistrationIsEnded sets the isEnded flag', () => {
    const state = reducer(undefined, actions.setRegistrationIsEnded(true));

    expect(state.isEnded).toBe(true);
  });

  describe('setStateFromQueryParams', () => {
    it('sets the selected flow and resets to the first step when a flow is provided', () => {
      const initialState = { ...slice.getInitialState(), currentStep: 3 };

      const state = reducer(
        initialState,
        actions.setStateFromQueryParams({ flow: RegistrationFlow.COACH })
      );

      expect(state.selectedFlow).toBe(RegistrationFlow.COACH);
      expect(state.currentStep).toBe(REGISTRATION_FIRST_STEP);
    });

    it('leaves the selected flow and current step untouched when no flow is provided', () => {
      const initialState = {
        ...slice.getInitialState(),
        selectedFlow: RegistrationFlow.CANDIDATE,
        currentStep: 3,
      };

      const state = reducer(initialState, actions.setStateFromQueryParams({}));

      expect(state.selectedFlow).toBe(RegistrationFlow.CANDIDATE);
      expect(state.currentStep).toBe(3);
    });

    it('sets a companyName field in data when provided and there was no data yet', () => {
      const state = reducer(
        undefined,
        actions.setStateFromQueryParams({ companyName: 'Acme' })
      );

      expect(state.data).toEqual({
        companyName: { value: 'Acme', label: 'Acme' },
      });
    });

    it('merges the companyName field into existing data', () => {
      const initialState = {
        ...slice.getInitialState(),
        data: buildRegistrationData({ firstName: 'Jane' }),
      };

      const state = reducer(
        initialState,
        actions.setStateFromQueryParams({ companyName: 'Acme' })
      );

      expect(state.data).toEqual({
        ...buildRegistrationData({ firstName: 'Jane' }),
        companyName: { value: 'Acme', label: 'Acme' },
      });
    });

    it('does not touch data when no companyName is provided', () => {
      const state = reducer(
        undefined,
        actions.setStateFromQueryParams({ flow: RegistrationFlow.CANDIDATE })
      );

      expect(state.data).toBeNull();
    });

    it('sets the invitationId when provided', () => {
      const state = reducer(
        undefined,
        actions.setStateFromQueryParams({ invitationId: 'invitation-1' })
      );

      expect(state.invitationId).toBe('invitation-1');
    });

    it('leaves the invitationId untouched when not provided', () => {
      const initialState = {
        ...slice.getInitialState(),
        invitationId: 'invitation-1',
      };

      const state = reducer(initialState, actions.setStateFromQueryParams({}));

      expect(state.invitationId).toBe('invitation-1');
    });
  });
});
