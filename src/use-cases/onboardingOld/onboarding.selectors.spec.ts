// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { OnboardingFlow } from '@/src/features/backoffice/onboardingLegacy/Onboarding.types';

// Only `getOnboardingStepContent` is overridden here so the selectors under
// test can be exercised against controlled step content (the real
// `CompanyOnboardingStepContents` has no step with `dependsOn`, so the
// `selectOnboardingDataFromOtherStep` reduce branch is otherwise unreachable
// in this domain). `flattenOnboardingDataByFlow` is kept real since it's the
// actual logic `selectOnboardingDataFromOtherStep` relies on.
jest.mock('./onboarding.utils', () => {
  const actual = jest.requireActual('./onboarding.utils');
  return {
    ...actual,
    getOnboardingStepContent: jest.fn(),
  };
});

import {
  selectIsOnboardingLoading,
  selectOnboardingCurrentStep,
  selectOnboardingCurrentStepContent,
  selectOnboardingCurrentStepData,
  selectOnboardingData,
  selectOnboardingDataFromOtherStep,
  selectOnboardingFlow,
  selectShouldLaunchOnboarding,
} from './onboarding.selectors';
import { RootState, slice } from './onboarding.slice';
import { getOnboardingStepContent } from './onboarding.utils';

const mockedGetOnboardingStepContent = getOnboardingStepContent as jest.Mock;

const buildState = (
  overrides: Partial<ReturnType<typeof slice.getInitialState>> = {}
): RootState =>
  ({
    onboardingOld: { ...slice.getInitialState(), ...overrides },
  }) as RootState;

describe('onboardingOld.selectors', () => {
  afterEach(() => {
    mockedGetOnboardingStepContent.mockReset();
  });

  describe('selectShouldLaunchOnboarding', () => {
    it('returns the shouldLaunchOnboarding flag', () => {
      expect(
        selectShouldLaunchOnboarding(
          buildState({ shouldLaunchOnboarding: false })
        )
      ).toBe(false);
    });
  });

  describe('selectOnboardingFlow', () => {
    it('returns null by default', () => {
      expect(selectOnboardingFlow(buildState())).toBeNull();
    });

    it('returns the selected flow', () => {
      expect(
        selectOnboardingFlow(
          buildState({ onboardingFlow: OnboardingFlow.COMPANY })
        )
      ).toBe(OnboardingFlow.COMPANY);
    });
  });

  describe('selectOnboardingData', () => {
    it('returns the onboarding data', () => {
      const data = { 1: { [OnboardingFlow.COMPANY]: { foo: 'bar' } as any } };

      expect(selectOnboardingData(buildState({ data }))).toEqual(data);
    });
  });

  describe('selectOnboardingCurrentStep', () => {
    it('returns the current step', () => {
      expect(selectOnboardingCurrentStep(buildState({ currentStep: 2 }))).toBe(
        2
      );
    });
  });

  describe('selectIsOnboardingLoading', () => {
    it('returns the isLoading flag', () => {
      expect(selectIsOnboardingLoading(buildState({ isLoading: false }))).toBe(
        false
      );
    });
  });

  describe('selectOnboardingCurrentStepData', () => {
    it('throws when the current step is not defined', () => {
      expect(() =>
        selectOnboardingCurrentStepData(
          buildState({ currentStep: undefined as any })
        )
      ).toThrow();
    });

    it('returns null when there is no onboarding flow', () => {
      expect(
        selectOnboardingCurrentStepData(
          buildState({ currentStep: 1, onboardingFlow: null })
        )
      ).toBeNull();
    });

    it('returns null when there is no data for the current step and flow', () => {
      expect(
        selectOnboardingCurrentStepData(
          buildState({
            currentStep: 1,
            onboardingFlow: OnboardingFlow.COMPANY,
            data: {},
          })
        )
      ).toBeNull();
    });

    it('returns the stored form data for the current step and flow', () => {
      const formData = { foo: 'bar' } as any;

      expect(
        selectOnboardingCurrentStepData(
          buildState({
            currentStep: 1,
            onboardingFlow: OnboardingFlow.COMPANY,
            data: { 1: { [OnboardingFlow.COMPANY]: formData } },
          })
        )
      ).toEqual(formData);
    });
  });

  describe('selectOnboardingCurrentStepContent', () => {
    it('throws when the current step is not defined', () => {
      expect(() =>
        selectOnboardingCurrentStepContent(
          buildState({ currentStep: undefined as any })
        )
      ).toThrow();
    });

    it('returns null when there is no onboarding flow', () => {
      expect(
        selectOnboardingCurrentStepContent(
          buildState({ currentStep: 1, onboardingFlow: null })
        )
      ).toBeNull();
    });

    it('returns the step content for the current step of the selected flow', () => {
      const stepContent = { title: 'Step 1' } as any;
      mockedGetOnboardingStepContent.mockReturnValue({ 1: stepContent });

      expect(
        selectOnboardingCurrentStepContent(
          buildState({ currentStep: 1, onboardingFlow: OnboardingFlow.COMPANY })
        )
      ).toBe(stepContent);
      expect(mockedGetOnboardingStepContent).toHaveBeenCalledWith(
        OnboardingFlow.COMPANY
      );
    });

    it('returns undefined when there is no content for the current step', () => {
      mockedGetOnboardingStepContent.mockReturnValue({});

      expect(
        selectOnboardingCurrentStepContent(
          buildState({ currentStep: 4, onboardingFlow: OnboardingFlow.COMPANY })
        )
      ).toBeUndefined();
    });
  });

  describe('selectOnboardingDataFromOtherStep', () => {
    it('returns null when there is no content for the current step', () => {
      mockedGetOnboardingStepContent.mockReturnValue({});

      expect(
        selectOnboardingDataFromOtherStep(
          buildState({ currentStep: 1, onboardingFlow: OnboardingFlow.COMPANY })
        )
      ).toBeNull();
    });

    it('returns null when the current step content does not depend on another step', () => {
      mockedGetOnboardingStepContent.mockReturnValue({
        1: { title: 'Step 1' },
      });

      expect(
        selectOnboardingDataFromOtherStep(
          buildState({ currentStep: 1, onboardingFlow: OnboardingFlow.COMPANY })
        )
      ).toBeNull();
    });

    it('returns the flattened values for only the keys listed in dependsOn', () => {
      mockedGetOnboardingStepContent.mockReturnValue({
        2: { title: 'Step 2', dependsOn: ['fieldA'] },
      });

      expect(
        selectOnboardingDataFromOtherStep(
          buildState({
            currentStep: 2,
            onboardingFlow: OnboardingFlow.COMPANY,
            data: {
              1: {
                [OnboardingFlow.COMPANY]: {
                  fieldA: 'valueA',
                  fieldB: 'valueB',
                } as any,
              },
            },
          })
        )
      ).toEqual({ fieldA: 'valueA' });
    });

    it('returns undefined for a dependsOn key with no matching data across any step', () => {
      mockedGetOnboardingStepContent.mockReturnValue({
        2: { title: 'Step 2', dependsOn: ['missingField'] },
      });

      expect(
        selectOnboardingDataFromOtherStep(
          buildState({
            currentStep: 2,
            onboardingFlow: OnboardingFlow.COMPANY,
            data: {},
          })
        )
      ).toEqual({ missingField: undefined });
    });
  });
});
