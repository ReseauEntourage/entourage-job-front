// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { OnboardingFlow } from '@/src/features/backoffice/onboardingLegacy/Onboarding.types';
import { slice } from './onboarding.slice';

const { actions, reducer } = slice;

describe('onboardingOld slice', () => {
  describe('launchOnboarding', () => {
    it('sets the onboarding flow', () => {
      const state = reducer(
        undefined,
        actions.launchOnboarding(OnboardingFlow.COMPANY)
      );

      expect(state.onboardingFlow).toBe(OnboardingFlow.COMPANY);
    });
  });

  describe('setOnboardingCurrentStepData', () => {
    it('throws when the current step is not defined', () => {
      const initialState = {
        ...slice.getInitialState(),
        currentStep: undefined as any,
        onboardingFlow: OnboardingFlow.COMPANY,
      };

      expect(() =>
        reducer(
          initialState,
          actions.setOnboardingCurrentStepData({ foo: 'bar' } as any)
        )
      ).toThrow();
    });

    it('throws when the onboarding flow is not defined', () => {
      const initialState = {
        ...slice.getInitialState(),
        currentStep: 1 as const,
        onboardingFlow: null,
      };

      expect(() =>
        reducer(
          initialState,
          actions.setOnboardingCurrentStepData({ foo: 'bar' } as any)
        )
      ).toThrow();
    });

    it('stores the payload under the current step and the onboarding flow', () => {
      const initialState = {
        ...slice.getInitialState(),
        currentStep: 1 as const,
        onboardingFlow: OnboardingFlow.COMPANY,
      };

      const state = reducer(
        initialState,
        actions.setOnboardingCurrentStepData({ foo: 'bar' } as any)
      );

      expect(state.data[1]?.[OnboardingFlow.COMPANY]).toEqual({ foo: 'bar' });
    });

    it('leaves data for other steps untouched', () => {
      const initialState = {
        ...slice.getInitialState(),
        currentStep: 1 as const,
        onboardingFlow: OnboardingFlow.COMPANY,
        data: {
          2: { [OnboardingFlow.COMPANY]: { untouched: true } as any },
        },
      };

      const state = reducer(
        initialState,
        actions.setOnboardingCurrentStepData({ foo: 'bar' } as any)
      );

      expect(state.data[2]?.[OnboardingFlow.COMPANY]).toEqual({
        untouched: true,
      });
      expect(state.data[1]?.[OnboardingFlow.COMPANY]).toEqual({ foo: 'bar' });
    });

    it('fully replaces (does not field-merge) previous data for the same step and flow', () => {
      const initialState = {
        ...slice.getInitialState(),
        currentStep: 1 as const,
        onboardingFlow: OnboardingFlow.COMPANY,
        data: {
          1: {
            [OnboardingFlow.COMPANY]: { foo: 'old', other: 'kept?' } as any,
          },
        },
      };

      const state = reducer(
        initialState,
        actions.setOnboardingCurrentStepData({ foo: 'new' } as any)
      );

      expect(state.data[1]?.[OnboardingFlow.COMPANY]).toEqual({ foo: 'new' });
    });
  });

  describe('setOnboardingStep', () => {
    it('sets the current step and sets isLoading to true', () => {
      const initialState = {
        ...slice.getInitialState(),
        isLoading: false,
      };

      const state = reducer(initialState, actions.setOnboardingStep(2));

      expect(state.currentStep).toBe(2);
      expect(state.isLoading).toBe(true);
    });
  });

  describe('setOnboardingIsLoading', () => {
    it('sets isLoading', () => {
      const state = reducer(undefined, actions.setOnboardingIsLoading(false));

      expect(state.isLoading).toBe(false);
    });
  });

  describe('increaseOnboardingStep', () => {
    it('increments the current step', () => {
      const initialState = {
        ...slice.getInitialState(),
        currentStep: 1 as const,
      };

      const state = reducer(initialState, actions.increaseOnboardingStep());

      expect(state.currentStep).toBe(2);
    });
  });

  describe('decreaseOnboardingStep', () => {
    it('decrements the current step', () => {
      const initialState = {
        ...slice.getInitialState(),
        currentStep: 2 as const,
      };

      const state = reducer(initialState, actions.decreaseOnboardingStep());

      expect(state.currentStep).toBe(1);
    });
  });

  describe('endOnboarding', () => {
    it('resets the onboarding progress but keeps it from re-launching', () => {
      const initialState = {
        ...slice.getInitialState(),
        currentStep: 3 as const,
        data: { 1: { [OnboardingFlow.COMPANY]: { foo: 'bar' } as any } },
        onboardingFlow: OnboardingFlow.COMPANY,
        isLoading: false,
      };

      const state = reducer(initialState, actions.endOnboarding());

      expect(state.currentStep).toBe(0);
      expect(state.data).toEqual({});
      expect(state.shouldLaunchOnboarding).toBe(false);
      expect(state.isLoading).toBe(true);
      expect(state.onboardingFlow).toBeNull();
    });
  });
});
