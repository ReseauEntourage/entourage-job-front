jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

const mockRegistration: { value: any } = { value: null };
const mockOnboarding: { value: any } = { value: null };
const mockEmail: { value: any } = { value: null };
const mockRedirects = jest.fn();
const mockPhase: { value: string } = { value: 'registration' };

jest.mock('./useRegistrationWizard', () => ({
  useRegistrationWizard: () => mockRegistration.value,
}));
jest.mock('@/src/features/wizard/onboarding/useOnboardingPhase', () => ({
  useOnboardingPhase: () => mockOnboarding.value,
}));
jest.mock('@/src/features/wizard/useEmailConfirmationPhase', () => ({
  useEmailConfirmationPhase: () => mockEmail.value,
}));
jest.mock('@/src/features/wizard/useWizardRedirects', () => ({
  useWizardRedirects: (...args: unknown[]) => mockRedirects(...args),
}));
jest.mock('@/src/features/wizard/resolveWizardPhase', () => ({
  resolveWizardPhase: () => mockPhase.value,
}));

import { act, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Provider } from 'react-redux';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { selectFormErrorMessage } from '@/src/use-cases/onboarding';
import { useWizard } from './useWizard';

const step = (id: string, extra: Record<string, unknown> = {}) =>
  ({ id, ...extra }) as any;

function setup({
  preloadedState = {},
}: { preloadedState?: Record<string, unknown> } = {}) {
  const store = createTestStore(preloadedState as any);
  const utils = renderHook(() => useWizard(), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
  return { store, ...utils };
}

describe('useWizard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPhase.value = 'registration';
    mockRegistration.value = {
      wizardSteps: [step('r1', { buttonLabel: undefined }), step('r2')],
      currentWizardIdx: 0,
      currentWizardStep: step('r1'),
      incrementStep: jest.fn().mockResolvedValue(undefined),
      decrementStep: jest.fn(),
      goToLastStep: jest.fn(),
      goToStepById: jest.fn(),
      canGoBack: true,
      isLoading: false,
      effectiveFlow: 'CANDIDATE',
    };
    mockOnboarding.value = {
      steps: [step('o1'), step('o2')],
      currentStepIdx: 1,
      currentStep: step('o2', {
        sidePanelContent: jest.fn(),
        mobileBottomSheet: true,
      }),
      isLoading: true,
      isInitializing: false,
      buttonLabel: 'Continuer',
      canGoBack: false,
      onNext: jest.fn().mockResolvedValue(undefined),
      onBack: jest.fn(),
      skipOnboarding: jest.fn(),
      isAlreadyCompleted: false,
      updateOnboardingStatus: 'IDLE',
      skipDashboardRedirectRef: { current: false },
      pendingSuggestedMessageRedirectRef: { current: false },
    };
    mockEmail.value = {
      step: step('email-confirmation'),
      isLoading: false,
      canGoBack: true,
      onNext: jest.fn().mockResolvedValue(undefined),
      onBack: jest.fn(),
    };
  });

  describe('registration phase', () => {
    it('lists registration, email confirmation and onboarding steps together', () => {
      const { result } = setup();

      expect(result.current.allSteps.map((s) => s.id)).toEqual([
        'r1',
        'r2',
        'email-confirmation',
        'o1',
        'o2',
      ]);
      expect(result.current.currentStepIdx).toBe(0);
      expect(result.current.isOnboardingPhase).toBe(false);
      expect(result.current.currentStep?.id).toBe('r1');
    });

    it('labels the last registration step "Créer mon compte" and the others "Étape suivante"', () => {
      expect(setup().result.current.buttonLabel).toBe('Étape suivante');

      mockRegistration.value.currentWizardIdx = 1;
      mockRegistration.value.currentWizardStep = step('r2');
      expect(setup().result.current.buttonLabel).toBe('Créer mon compte');
    });

    it('prefers the label of the step', () => {
      mockRegistration.value.currentWizardStep = step('r1', {
        buttonLabel: 'Go',
      });

      expect(setup().result.current.buttonLabel).toBe('Go');
    });

    it('delegates next/back to the registration wizard', async () => {
      const { result } = setup();

      await act(async () => {
        await result.current.onNext();
      });
      act(() => result.current.onBack());

      expect(mockRegistration.value.incrementStep).toHaveBeenCalledTimes(1);
      expect(mockRegistration.value.decrementStep).toHaveBeenCalledTimes(1);
      expect(result.current.canGoBack).toBe(true);
    });

    it('exposes the side panel and loading state of the current step', () => {
      mockRegistration.value.isLoading = true;
      mockRegistration.value.currentWizardStep = step('r1', {
        sidePanelContent: jest.fn(),
        mobileBottomSheet: true,
      });
      const { result } = setup();

      expect(result.current.isLoading).toBe(true);
      expect(result.current.sidePanelContent).toBeDefined();
      expect(result.current.mobileBottomSheet).toBe(true);
    });

    it('does not go back when going back is not possible', () => {
      mockRegistration.value.canGoBack = false;
      const { result } = setup();

      act(() => result.current.onBack());

      expect(mockRegistration.value.decrementStep).not.toHaveBeenCalled();
    });

    it('is initializing while the current user is being resolved without flow', () => {
      mockRegistration.value.wizardSteps = [];
      const { result } = setup();

      expect(result.current.isInitializing).toBe(true);
    });

    it('is not initializing when a registration flow exists', () => {
      expect(setup().result.current.isInitializing).toBe(false);
    });

    it('hands the state to the redirects hook', () => {
      setup();

      expect(mockRedirects).toHaveBeenCalledWith(
        expect.objectContaining({
          currentUser: null,
          registrationStepsLength: 2,
          isOnboardingAlreadyCompleted: false,
          updateOnboardingStatus: 'IDLE',
          isLogoutSucceeded: false,
        })
      );
    });
  });

  describe('email confirmation phase', () => {
    beforeEach(() => {
      mockPhase.value = 'email-confirmation';
    });

    it('points at the email confirmation step with the right label', () => {
      const { result } = setup();

      expect(result.current.currentStepIdx).toBe(2);
      expect(result.current.currentStep?.id).toBe('email-confirmation');
      expect(result.current.buttonLabel).toBe('Valider le code');
    });

    it('delegates next and back to the email confirmation phase', async () => {
      const { result } = setup();

      await act(async () => {
        await result.current.onNext();
      });
      act(() => result.current.onBack());

      expect(mockEmail.value.onNext).toHaveBeenCalledTimes(1);
      expect(mockEmail.value.onBack).toHaveBeenCalledTimes(1);
      expect(mockRegistration.value.incrementStep).not.toHaveBeenCalled();
    });
  });

  describe('onboarding phase', () => {
    beforeEach(() => {
      mockPhase.value = 'onboarding';
    });

    it('offsets the index after registration and email confirmation', () => {
      const { result } = setup();

      expect(result.current.currentStepIdx).toBe(2 + 1 + 1);
      expect(result.current.isOnboardingPhase).toBe(true);
      expect(result.current.buttonLabel).toBe('Continuer');
      expect(result.current.isLoading).toBe(true);
      expect(result.current.canGoBack).toBe(false);
    });

    it('delegates next to onboarding and ignores back when it cannot go back', async () => {
      const { result } = setup();

      await act(async () => {
        await result.current.onNext();
      });
      act(() => result.current.onBack());

      expect(mockOnboarding.value.onNext).toHaveBeenCalledTimes(1);
      expect(mockOnboarding.value.onBack).not.toHaveBeenCalled();
    });

    it('goes back inside the onboarding when possible', () => {
      mockOnboarding.value.canGoBack = true;
      const { result } = setup();

      act(() => result.current.onBack());

      expect(mockOnboarding.value.onBack).toHaveBeenCalledTimes(1);
    });

    it('is initializing while the onboarding resolves the resume step', () => {
      mockOnboarding.value.isInitializing = true;
      const { result } = setup();

      expect(result.current.isInitializing).toBe(true);
    });

    it('exposes skipOnboarding and treats a missing index as the first step', () => {
      mockOnboarding.value.currentStepIdx = null;
      const { result } = setup();

      expect(result.current.currentStepIdx).toBe(2 + 1);
      result.current.skipOnboarding();
      expect(mockOnboarding.value.skipOnboarding).toHaveBeenCalledTimes(1);
    });
  });

  it('clears the step error message when the step changes', () => {
    const { store, rerender } = setup({
      preloadedState: { onboarding: { formErrorMessage: 'old' } },
    });

    // The reset runs on mount (a step change from the initial state).
    expect(selectFormErrorMessage(store.getState() as any)).toBeNull();

    store.dispatch({
      type: 'onboarding/setFormErrorMessage',
      payload: 'later',
    });
    mockRegistration.value.currentWizardIdx = 1;
    mockRegistration.value.currentWizardStep = step('r2');
    rerender();

    expect(selectFormErrorMessage(store.getState() as any)).toBeNull();
  });
});
