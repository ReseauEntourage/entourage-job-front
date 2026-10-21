jest.mock('@/src/hooks', () => ({ useProfileGeneration: jest.fn() }));
jest.mock('@/src/hooks/current-user/useCurrentUserCompany', () => ({
  useCurrentUserCompany: jest.fn(),
}));
jest.mock('@/src/hooks/current-user/useCurrentUserReadDocuments', () => ({
  useCurrentUserReadDocuments: jest.fn(),
}));

import { act, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { User } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { useProfileGeneration } from '@/src/hooks';
import { useCurrentUserCompany } from '@/src/hooks/current-user/useCurrentUserCompany';
import { useCurrentUserReadDocuments } from '@/src/hooks/current-user/useCurrentUserReadDocuments';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { currentUserActions } from '@/src/use-cases/current-user';
import { onboardingActions } from '@/src/use-cases/onboardingOld';
import { OnboardingFlow } from './Onboarding.types';
import { useOnboarding } from './useOnboarding';

const mockProfileGeneration = useProfileGeneration as jest.Mock;
const mockCompany = useCurrentUserCompany as jest.Mock;
const mockReadDocuments = useCurrentUserReadDocuments as jest.Mock;

const adminCompany = { id: 'c1', companyUser: { isAdmin: true } };

function setup(
  user: Partial<User> = { id: 'u1', role: UserRoles.COACH },
  prepare?: (store: ReturnType<typeof createTestStore>) => void
) {
  const store = createTestStore();
  store.dispatch(currentUserActions.fetchUserSucceeded(user as User));
  prepare?.(store);
  const hook = renderHook(() => useOnboarding(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    ),
  });
  return { store, ...hook };
}

describe('useOnboarding', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProfileGeneration.mockReturnValue({ isLoading: false });
    mockCompany.mockReturnValue(adminCompany);
    mockReadDocuments.mockReturnValue([]);
  });

  it('launches the company flow for a coach admin who has not read the charter', () => {
    const { store } = setup();
    expect(store.getState().onboardingOld.onboardingFlow).toBe(
      OnboardingFlow.COMPANY
    );
  });

  it('does not launch anything when the company has no onboarding flow', () => {
    mockCompany.mockReturnValue({ id: 'c1', companyUser: { isAdmin: false } });
    const { store } = setup();
    expect(store.getState().onboardingOld.onboardingFlow).toBeNull();
    expect(store.getState().onboardingOld.shouldLaunchOnboarding).toBe(true);
  });

  it('ends the onboarding when the ethics charter was already accepted', () => {
    mockReadDocuments.mockReturnValue([{ documentName: 'CharteEthique' }]);
    const { store, result } = setup();
    expect(store.getState().onboardingOld.shouldLaunchOnboarding).toBe(false);
    expect(result.current.shouldLaunchOnboarding).toBe(false);
  });

  it('ends the onboarding for roles that have none', () => {
    const { store } = setup({ id: 'u2', role: UserRoles.CANDIDATE });
    expect(store.getState().onboardingOld.shouldLaunchOnboarding).toBe(false);
    expect(store.getState().onboardingOld.onboardingFlow).toBeNull();
  });

  it('disables navigation while the profile is generated or the step loads', () => {
    mockProfileGeneration.mockReturnValue({ isLoading: true });
    const { result } = setup();
    expect(result.current.disableNavigationButtons).toBe(true);

    mockProfileGeneration.mockReturnValue({ isLoading: false });
    const second = setup();
    act(() => {
      second.store.dispatch(onboardingActions.setOnboardingIsLoading(true));
    });
    expect(second.result.current.isOnboardingLoading).toBe(true);
    expect(second.result.current.disableNavigationButtons).toBe(true);

    act(() => {
      second.store.dispatch(onboardingActions.setOnboardingIsLoading(false));
    });
    expect(second.result.current.disableNavigationButtons).toBe(false);
  });

  it('detects the first non-skippable step', () => {
    const { result, store } = setup(undefined, (s) => {
      s.dispatch(onboardingActions.launchOnboarding(OnboardingFlow.COMPANY));
      s.dispatch(onboardingActions.setOnboardingStep(1));
    });
    expect(result.current.isFirstOnboardingStep).toBe(true);
    act(() => {
      store.dispatch(onboardingActions.setOnboardingStep(2));
    });
    expect(result.current.isFirstOnboardingStep).toBe(false);
  });

  it('skips the first step in the "first step" detection when it is skippable', () => {
    // charter already read -> step 1 skipped, first real step is 2
    mockReadDocuments.mockReturnValue([{ documentName: 'CharteEthique' }]);
    const { result } = setup();
    expect(result.current.isFirstOnboardingStep).toBe(false);
  });

  it('reports no first step when the company has no flow', () => {
    mockCompany.mockReturnValue(null);
    const { result } = setup();
    expect(result.current.isFirstOnboardingStep).toBe(false);
  });

  it('goes back to the previous non-skippable step', () => {
    const { result, store } = setup(undefined, (s) => {
      s.dispatch(onboardingActions.launchOnboarding(OnboardingFlow.COMPANY));
      s.dispatch(onboardingActions.setOnboardingStep(3));
    });
    act(() => result.current.onBeforeStep());
    // company has no goal, so step 2 is not skipped
    expect(store.getState().onboardingOld.currentStep).toBe(2);
  });

  it('skips steps that are skippable when going back', () => {
    mockCompany.mockReturnValue({ ...adminCompany, goal: 'RECRUIT' });
    const { result, store } = setup(undefined, (s) => {
      s.dispatch(onboardingActions.launchOnboarding(OnboardingFlow.COMPANY));
      s.dispatch(onboardingActions.setOnboardingStep(3));
    });
    act(() => result.current.onBeforeStep());
    // step 2 skipped by the company goal -> lands on step 1
    expect(store.getState().onboardingOld.currentStep).toBe(1);
  });

  it('does not move when there is no previous step', () => {
    const { result, store } = setup(undefined, (s) => {
      s.dispatch(onboardingActions.launchOnboarding(OnboardingFlow.COMPANY));
      s.dispatch(onboardingActions.setOnboardingStep(1));
    });
    act(() => result.current.onBeforeStep());
    expect(store.getState().onboardingOld.currentStep).toBe(1);
  });

  it('does nothing on "before" without a flow', () => {
    mockCompany.mockReturnValue(null);
    const { result, store } = setup(undefined, (s) => {
      s.dispatch(onboardingActions.setOnboardingStep(2));
    });
    act(() => result.current.onBeforeStep());
    expect(store.getState().onboardingOld.currentStep).toBe(2);
  });

  it('stores the submitted step data under the current step', async () => {
    const { result, store } = setup(undefined, (s) => {
      s.dispatch(onboardingActions.launchOnboarding(OnboardingFlow.COMPANY));
      s.dispatch(onboardingActions.setOnboardingStep(2));
    });
    await act(async () => {
      await result.current.onSubmitStepForm({ goal: ['RECRUIT'] } as any);
    });
    expect(store.getState().onboardingOld.data[2]).toEqual({
      COMPANY: { goal: ['RECRUIT'] },
    });
    expect(result.current.stepData).toEqual({ goal: ['RECRUIT'] });
  });

  it('exposes the step content and its default values', () => {
    const { result } = setup(undefined, (s) => {
      s.dispatch(onboardingActions.launchOnboarding(OnboardingFlow.COMPANY));
      s.dispatch(onboardingActions.setOnboardingStep(1));
    });
    expect(result.current.currentStep).toBe(1);
    expect(result.current.stepContent?.title).toBe('Charte éthique');
    expect(result.current.defaultValues).toEqual({
      hasAcceptedEthicsCharter: false,
    });
  });
});
