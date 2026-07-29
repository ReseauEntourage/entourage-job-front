jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { User } from '@/src/api/types';
import { DocumentNames } from '@/src/constants';
import { CompanyGoal } from '@/src/constants/company';
import { OnboardingFlow } from '@/src/features/backoffice/onboardingLegacy/Onboarding.types';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { seedAccessToken } from '@/src/store/testUtils/seedAccessToken';
import { selectFetchCurrentProfileCompleteStatus } from '@/src/use-cases/current-user';
import { slice as currentUserSlice } from '@/src/use-cases/current-user/current-user.slice';
import {
  onboardingApi,
  SEND_STEP_DATA_ONBOARDING_FIXED_CACHE_KEY,
} from './onboarding.api';
import { slice } from './onboarding.slice';

const { actions } = slice;
const mockedApi = getMockedApi();

const buildUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 'user-1',
    email: 'user@example.com',
    betaFeatures: {},
    ...overrides,
  }) as User;

/**
 * `launchOnboarding` and `setOnboardingCurrentStepData`'s listeners both read
 * `selectAuthenticatedUser` unconditionally, so an authenticated user must
 * always be preloaded before dispatching their triggering actions.
 */
function buildAuthenticatedStore(
  onboardingOverrides: Partial<ReturnType<typeof slice.getInitialState>> = {}
) {
  seedAccessToken('token-123');
  return createTestStore({
    currentUser: { ...currentUserSlice.getInitialState(), user: buildUser() },
    onboardingOld: { ...slice.getInitialState(), ...onboardingOverrides },
  });
}

function selectSendStepDataResult(store: ReturnType<typeof createTestStore>) {
  return onboardingApi.endpoints.sendStepDataOnboarding.select(
    SEND_STEP_DATA_ONBOARDING_FIXED_CACHE_KEY
  )(store.getState());
}

describe('onboardingOld api', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('launchOnboarding', () => {
    it('sets the flow and moves to the first not-skippable step', async () => {
      const store = buildAuthenticatedStore();

      store.dispatch(actions.launchOnboarding(OnboardingFlow.COMPANY));
      await flushPromises();

      expect(store.getState().onboardingOld.onboardingFlow).toBe(
        OnboardingFlow.COMPANY
      );
      // Step 1 (ethics charter) is not skipped by default since no document
      // has been read yet.
      expect(store.getState().onboardingOld.currentStep).toBe(1);
      expect(store.getState().onboardingOld.isLoading).toBe(false);
    });
  });

  describe('setOnboardingStep', () => {
    it('sets isLoading to false once the step has changed', async () => {
      const store = buildAuthenticatedStore();

      store.dispatch(actions.setOnboardingStep(2));
      await flushPromises();

      expect(store.getState().onboardingOld.currentStep).toBe(2);
      expect(store.getState().onboardingOld.isLoading).toBe(false);
    });
  });

  describe('setOnboardingCurrentStepData -> sendStepDataOnboarding', () => {
    it('calls postReadDocument when the ethics charter step accepts it, then moves to the next step', async () => {
      const store = buildAuthenticatedStore({
        onboardingFlow: OnboardingFlow.COMPANY,
        currentStep: 1,
      });
      mockedApi.postReadDocument.mockReturnValue(undefined as any);
      mockedApi.updateCompany.mockResolvedValue({} as any);

      store.dispatch(
        actions.setOnboardingCurrentStepData({
          hasAcceptedEthicsCharter: true,
        } as any)
      );
      await flushPromises();

      expect(mockedApi.postReadDocument).toHaveBeenCalledWith(
        { documentName: DocumentNames.CharteEthique },
        'user-1'
      );
      // Step 2 (company goal) is not skipped by default since no company
      // goal has been set yet.
      expect(store.getState().onboardingOld.currentStep).toBe(2);
      expect(store.getState().onboardingOld.isLoading).toBe(false);
      expect(selectSendStepDataResult(store).isSuccess).toBe(true);
    });

    it('does not call postReadDocument when the ethics charter was not accepted', async () => {
      const store = buildAuthenticatedStore({
        onboardingFlow: OnboardingFlow.COMPANY,
        currentStep: 2,
      });
      mockedApi.updateCompany.mockResolvedValue({} as any);

      store.dispatch(actions.setOnboardingCurrentStepData({ goal: [] } as any));
      await flushPromises();

      expect(mockedApi.postReadDocument).not.toHaveBeenCalled();
    });

    it('always extracts company fields and calls updateCompany, even on a non-company-info step', async () => {
      const store = buildAuthenticatedStore({
        onboardingFlow: OnboardingFlow.COMPANY,
        currentStep: 2,
      });
      mockedApi.updateCompany.mockResolvedValue({} as any);

      store.dispatch(
        actions.setOnboardingCurrentStepData({
          goal: [CompanyGoal.RECRUIT],
        } as any)
      );
      await flushPromises();

      expect(mockedApi.updateCompany).toHaveBeenCalledWith(
        expect.objectContaining({ goal: CompanyGoal.RECRUIT })
      );
    });

    it('sets goal to BOTH when more than one goal is selected', async () => {
      const store = buildAuthenticatedStore({
        onboardingFlow: OnboardingFlow.COMPANY,
        currentStep: 2,
      });
      mockedApi.updateCompany.mockResolvedValue({} as any);

      store.dispatch(
        actions.setOnboardingCurrentStepData({
          goal: [CompanyGoal.RECRUIT, CompanyGoal.SENSIBILIZE],
        } as any)
      );
      await flushPromises();

      expect(mockedApi.updateCompany).toHaveBeenCalledWith(
        expect.objectContaining({ goal: CompanyGoal.BOTH })
      );
    });

    it('leaves goal undefined when no goal is provided', async () => {
      const store = buildAuthenticatedStore({
        onboardingFlow: OnboardingFlow.COMPANY,
        currentStep: 2,
      });
      mockedApi.updateCompany.mockResolvedValue({} as any);

      store.dispatch(actions.setOnboardingCurrentStepData({} as any));
      await flushPromises();

      expect(mockedApi.updateCompany).toHaveBeenCalledWith(
        expect.objectContaining({ goal: undefined })
      );
    });

    it('maps businessSectorIds and departmentId to their raw values', async () => {
      const store = buildAuthenticatedStore({
        onboardingFlow: OnboardingFlow.COMPANY,
        currentStep: 3,
      });
      mockedApi.updateCompany.mockResolvedValue({} as any);

      store.dispatch(
        actions.setOnboardingCurrentStepData({
          description: 'A description',
          businessSectorIds: [{ value: 'sector-1' }, { value: 'sector-2' }],
          departmentId: { value: '75' },
          url: 'https://acme.example.com',
          linkedInUrl: 'https://linkedin.example.com/acme',
          hiringUrl: 'https://acme.example.com/jobs',
        } as any)
      );
      await flushPromises();

      expect(mockedApi.updateCompany).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'A description',
          businessSectorIds: ['sector-1', 'sector-2'],
          departmentId: '75',
          url: 'https://acme.example.com',
          linkedInUrl: 'https://linkedin.example.com/acme',
          hiringUrl: 'https://acme.example.com/jobs',
        })
      );
    });

    it('uploads the logo when one is provided', async () => {
      const store = buildAuthenticatedStore({
        onboardingFlow: OnboardingFlow.COMPANY,
        currentStep: 3,
      });
      mockedApi.updateCompany.mockResolvedValue({} as any);
      mockedApi.updateCompanyLogo.mockResolvedValue({} as any);
      const logoFile = new File(['logo'], 'logo.png');

      store.dispatch(
        actions.setOnboardingCurrentStepData({ logo: [logoFile] } as any)
      );
      await flushPromises();

      expect(mockedApi.updateCompanyLogo).toHaveBeenCalledTimes(1);
      const formData = mockedApi.updateCompanyLogo.mock.calls[0][0];
      expect(formData.get('file')).toBe(logoFile);
    });

    it('does not upload a logo when none is provided', async () => {
      const store = buildAuthenticatedStore({
        onboardingFlow: OnboardingFlow.COMPANY,
        currentStep: 2,
      });
      mockedApi.updateCompany.mockResolvedValue({} as any);

      store.dispatch(actions.setOnboardingCurrentStepData({} as any));
      await flushPromises();

      expect(mockedApi.updateCompanyLogo).not.toHaveBeenCalled();
    });

    it('ends the onboarding and refreshes the profile on the last step', async () => {
      const store = buildAuthenticatedStore({
        onboardingFlow: OnboardingFlow.COMPANY,
        currentStep: 3,
      });
      mockedApi.updateCompany.mockResolvedValue({} as any);
      mockedApi.getCurrentProfileComplete.mockResolvedValue({
        data: { id: 'profile-1' },
      } as any);

      store.dispatch(
        actions.setOnboardingCurrentStepData({
          description: 'A description',
        } as any)
      );
      await flushPromises();

      expect(store.getState().onboardingOld.currentStep).toBe(0);
      expect(store.getState().onboardingOld.data).toEqual({});
      expect(store.getState().onboardingOld.shouldLaunchOnboarding).toBe(false);
      expect(store.getState().onboardingOld.onboardingFlow).toBeNull();
      expect(selectFetchCurrentProfileCompleteStatus(store.getState())).toBe(
        'SUCCEEDED'
      );
      expect(store.getState().currentUser.profileComplete).toEqual({
        id: 'profile-1',
      });
    });

    it('does not end the onboarding when a not-skippable step remains', async () => {
      const store = buildAuthenticatedStore({
        onboardingFlow: OnboardingFlow.COMPANY,
        currentStep: 1,
      });
      mockedApi.updateCompany.mockResolvedValue({} as any);

      store.dispatch(
        actions.setOnboardingCurrentStepData({
          hasAcceptedEthicsCharter: true,
        } as any)
      );
      await flushPromises();

      expect(store.getState().onboardingOld.currentStep).toBe(2);
      expect(store.getState().onboardingOld.shouldLaunchOnboarding).toBe(true);
      expect(selectFetchCurrentProfileCompleteStatus(store.getState())).toBe(
        'IDLE'
      );
    });

    it('sets isLoading to false and records the error when the API call rejects', async () => {
      const store = buildAuthenticatedStore({
        onboardingFlow: OnboardingFlow.COMPANY,
        currentStep: 2,
      });
      mockedApi.updateCompany.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.setOnboardingCurrentStepData({} as any));
      await flushPromises();

      expect(store.getState().onboardingOld.isLoading).toBe(false);
      expect(selectSendStepDataResult(store)).toMatchObject({
        isError: true,
        error: 'NOT_SAVE_DATA',
      });
      // The step must not have advanced on failure.
      expect(store.getState().onboardingOld.currentStep).toBe(2);
    });
  });

  describe('setOnboardingCurrentStepData (without prerequisite state)', () => {
    it('throws (via the reducer) when the onboarding flow is not defined', async () => {
      const store = buildAuthenticatedStore({ currentStep: 1 });

      expect(() =>
        store.dispatch(actions.setOnboardingCurrentStepData({} as any))
      ).toThrow();
    });
  });
});
