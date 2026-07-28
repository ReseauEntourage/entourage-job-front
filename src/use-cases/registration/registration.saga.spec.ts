jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import { RegistrationData } from '@/src/features/registration/registration.types';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { slice } from './registration.slice';

const { actions } = slice;
const mockedApi = getMockedApi();

function buildAxiosError(status: number) {
  return {
    isAxiosError: true,
    response: { status },
  };
}

const buildRegistrationData = (
  overrides: Partial<RegistrationData> = {}
): RegistrationData =>
  ({
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    password: 'Sup3rSecret!',
    confirmPassword: 'Sup3rSecret!',
    phone: '0600000000',
    department: { value: 'PARIS', label: 'Paris' },
    ...overrides,
  }) as RegistrationData;

describe('registration saga', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('createUserRequested', () => {
    it('posts the transformed registration data and succeeds', async () => {
      const store = createTestStore({
        registration: {
          ...slice.getInitialState(),
          selectedFlow: RegistrationFlow.CANDIDATE,
          data: buildRegistrationData(),
        },
      });
      mockedApi.postUserRegistration.mockResolvedValue({
        data: { id: 'user-1', zone: 'PARIS', role: 'Candidat' },
      } as any);

      store.dispatch(actions.createUserRequested());
      await flushPromises();

      expect(store.getState().registration.createUser.status).toBe('SUCCEEDED');
      expect(mockedApi.postUserRegistration).toHaveBeenCalledTimes(1);
      const [payload] = mockedApi.postUserRegistration.mock.calls[0];
      expect(payload).toMatchObject({
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'Candidat',
        department: 'PARIS',
      });
      expect(payload).not.toHaveProperty('confirmPassword');
    });

    it('leaves isLoading true after a success (only createUserFailed resets it)', async () => {
      const store = createTestStore({
        registration: {
          ...slice.getInitialState(),
          selectedFlow: RegistrationFlow.CANDIDATE,
          data: buildRegistrationData(),
        },
      });
      mockedApi.postUserRegistration.mockResolvedValue({
        data: { id: 'user-1', zone: 'PARIS', role: 'Candidat' },
      } as any);

      store.dispatch(actions.createUserRequested());
      await flushPromises();

      expect(store.getState().registration.isLoading).toBe(true);
    });

    it('extracts organizationId, companyName and companyRole values when provided', async () => {
      const store = createTestStore({
        registration: {
          ...slice.getInitialState(),
          selectedFlow: RegistrationFlow.COMPANY,
          data: buildRegistrationData({
            organizationId: { value: 'org-1', label: 'Org 1' },
            companyName: { value: 'Acme', label: 'Acme' },
            companyRole: { value: 'MANAGER', label: 'Manager' },
          } as any),
        },
      });
      mockedApi.postUserRegistration.mockResolvedValue({
        data: { id: 'user-1', zone: 'PARIS', role: 'Coach' },
      } as any);

      store.dispatch(actions.createUserRequested());
      await flushPromises();

      const [payload] = mockedApi.postUserRegistration.mock.calls[0];
      expect(payload).toMatchObject({
        organizationId: 'org-1',
        companyName: 'Acme',
        companyRole: 'MANAGER',
      });
    });

    it('reads UTM parameters from localStorage and includes them in the payload', async () => {
      localStorage.setItem('utm_source', 'google');
      localStorage.setItem('utm_medium', 'cpc');
      const store = createTestStore({
        registration: {
          ...slice.getInitialState(),
          selectedFlow: RegistrationFlow.CANDIDATE,
          data: buildRegistrationData(),
        },
      });
      mockedApi.postUserRegistration.mockResolvedValue({
        data: { id: 'user-1', zone: 'PARIS', role: 'Candidat' },
      } as any);

      store.dispatch(actions.createUserRequested());
      await flushPromises();

      const [payload] = mockedApi.postUserRegistration.mock.calls[0];
      expect(payload).toMatchObject({
        utmSource: 'google',
        utmMedium: 'cpc',
      });
    });

    it('includes nudges, sector occupations and current job from the pre-registration preferences when present', async () => {
      const store = createTestStore({
        registration: {
          ...slice.getInitialState(),
          selectedFlow: RegistrationFlow.CANDIDATE,
          data: buildRegistrationData(),
          preRegistrationPreferences: {
            nudgeIds: ['nudge-1', 'nudge-2'],
            sectorOccupations: [{ id: 'sector-1' }] as any,
            businessSectorIds: [],
            currentJob: 'Developer',
          },
        },
      });
      mockedApi.postUserRegistration.mockResolvedValue({
        data: { id: 'user-1', zone: 'PARIS', role: 'Candidat' },
      } as any);

      store.dispatch(actions.createUserRequested());
      await flushPromises();

      const [payload] = mockedApi.postUserRegistration.mock.calls[0];
      expect(payload).toMatchObject({
        nudges: [{ id: 'nudge-1' }, { id: 'nudge-2' }],
        sectorOccupations: [{ id: 'sector-1' }],
        currentJob: 'Developer',
      });
    });

    it('omits nudges, sector occupations and current job when the pre-registration preferences are empty', async () => {
      const store = createTestStore({
        registration: {
          ...slice.getInitialState(),
          selectedFlow: RegistrationFlow.CANDIDATE,
          data: buildRegistrationData(),
          preRegistrationPreferences: {
            nudgeIds: [],
            sectorOccupations: [],
            businessSectorIds: [],
            currentJob: undefined,
          },
        },
      });
      mockedApi.postUserRegistration.mockResolvedValue({
        data: { id: 'user-1', zone: 'PARIS', role: 'Candidat' },
      } as any);

      store.dispatch(actions.createUserRequested());
      await flushPromises();

      const [payload] = mockedApi.postUserRegistration.mock.calls[0];
      expect(payload).not.toHaveProperty('nudges');
      expect(payload).not.toHaveProperty('sectorOccupations');
      expect(payload).not.toHaveProperty('currentJob');
    });

    it('includes the invitationId when one is set', async () => {
      const store = createTestStore({
        registration: {
          ...slice.getInitialState(),
          selectedFlow: RegistrationFlow.CANDIDATE,
          data: buildRegistrationData(),
          invitationId: 'invitation-1',
        },
      });
      mockedApi.postUserRegistration.mockResolvedValue({
        data: { id: 'user-1', zone: 'PARIS', role: 'Candidat' },
      } as any);

      store.dispatch(actions.createUserRequested());
      await flushPromises();

      const [payload] = mockedApi.postUserRegistration.mock.calls[0];
      expect(payload).toMatchObject({ invitationId: 'invitation-1' });
    });

    it('dispatches createUserFailed(null) without calling the API when there is no registration data', async () => {
      const store = createTestStore({
        registration: {
          ...slice.getInitialState(),
          selectedFlow: RegistrationFlow.CANDIDATE,
          data: null,
        },
      });

      store.dispatch(actions.createUserRequested());
      await flushPromises();

      expect(mockedApi.postUserRegistration).not.toHaveBeenCalled();
      expect(store.getState().registration.createUser.status).toBe('FAILED');
      expect(store.getState().registration.createUserError).toBeNull();
      expect(store.getState().registration.isLoading).toBe(false);
    });

    it('dispatches createUserFailed with DUPLICATE_EMAIL when the API responds with a 409 conflict', async () => {
      const store = createTestStore({
        registration: {
          ...slice.getInitialState(),
          selectedFlow: RegistrationFlow.CANDIDATE,
          data: buildRegistrationData(),
        },
      });
      mockedApi.postUserRegistration.mockRejectedValue(buildAxiosError(409));

      store.dispatch(actions.createUserRequested());
      await flushPromises();

      expect(store.getState().registration.createUser.status).toBe('FAILED');
      expect(store.getState().registration.createUserError).toBe(
        'DUPLICATE_EMAIL'
      );
      expect(store.getState().registration.isLoading).toBe(false);
    });

    it('dispatches createUserFailed(null) when the API call rejects with a non-conflict error', async () => {
      const store = createTestStore({
        registration: {
          ...slice.getInitialState(),
          selectedFlow: RegistrationFlow.CANDIDATE,
          data: buildRegistrationData(),
        },
      });
      mockedApi.postUserRegistration.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.createUserRequested());
      await flushPromises();

      expect(store.getState().registration.createUser.status).toBe('FAILED');
      expect(store.getState().registration.createUserError).toBeNull();
      expect(store.getState().registration.isLoading).toBe(false);
    });
  });

  describe('moveForwardInRegistration', () => {
    it('sets isLoading, then clears it again after the transition delay when registration is not ended', async () => {
      const store = createTestStore({
        registration: { ...slice.getInitialState(), isEnded: false },
      });

      store.dispatch(actions.moveForwardInRegistration({ step: 1 }));
      await flushPromises();
      expect(store.getState().registration.isLoading).toBe(true);

      await new Promise((resolve) => setTimeout(resolve, 350));
      expect(store.getState().registration.isLoading).toBe(false);
    });

    it('sets isLoading and leaves it set when registration has ended', async () => {
      const store = createTestStore({
        registration: { ...slice.getInitialState(), isEnded: true },
      });

      store.dispatch(actions.moveForwardInRegistration({ step: 1 }));
      await flushPromises();

      expect(store.getState().registration.isLoading).toBe(true);

      await new Promise((resolve) => setTimeout(resolve, 350));
      expect(store.getState().registration.isLoading).toBe(true);
    });
  });

  describe('resetRegistrationData', () => {
    it('resets the registration state and toggles isLoading through the reset delay', async () => {
      const store = createTestStore({
        registration: {
          ...slice.getInitialState(),
          selectedFlow: RegistrationFlow.CANDIDATE,
          currentStep: 2,
          data: buildRegistrationData(),
        },
      });

      store.dispatch(actions.resetRegistrationData());
      await flushPromises();

      expect(store.getState().registration.selectedFlow).toBeNull();
      expect(store.getState().registration.currentStep).toBe(-1);
      expect(store.getState().registration.data).toBeNull();
      expect(store.getState().registration.isLoading).toBe(true);

      await new Promise((resolve) => setTimeout(resolve, 350));
      expect(store.getState().registration.isLoading).toBe(false);
    });
  });
});
