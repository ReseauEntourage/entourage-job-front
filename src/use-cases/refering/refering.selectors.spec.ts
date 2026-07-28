// `ReferingStepContents` (the real, shipped step configuration) never
// configures `dependsOn`/`skippedBy` on any step today (verified by
// grepping the feature folder) — so the branches of
// `selectReferingDataFromOtherStep`/`selectReferingShouldSkipStep` that
// read them are unreachable through the real config. To exercise that
// hand-written logic anyway, `step-2` is augmented here with a synthetic
// `dependsOn`/`skippedBy` via `jest.mock`, purely at the test-file level —
// production code and its real config are untouched. Every other step
// (and every other property of step-2) is left as the real, unmocked
// content, so all other assertions below still reflect real behavior.
jest.mock('@/src/features/backoffice/referer/Refering/Refering.types', () => {
  const actual = jest.requireActual(
    '@/src/features/backoffice/referer/Refering/Refering.types'
  ) as any;

  return {
    ...actual,
    ReferingStepContents: {
      ...actual.ReferingStepContents,
      'step-2': {
        ...actual.ReferingStepContents['step-2'],
        dependsOn: ['gender', 'nudgeIds'],
        // `selectReferingShouldSkipStep` only compares truthy values (see
        // `if (valuesFromOtherStep[key])`), so `Genders.MALE` (`0`) can
        // never match here — tests below use `FEMALE`/`OTHER` instead.
        skippedBy: { gender: [1], nudgeIds: ['nudge-1'] },
      },
    },
  };
});

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { Genders } from '@/src/constants/genders';
import { LastStepContent } from '@/src/features/backoffice/referer/Refering/Refering.types';
import {
  referCandidateSelectors,
  selectIsEmptyReferingData,
  selectIsFirstReferingStep,
  selectIsLastReferingStep,
  selectIsReferingLoading,
  selectReferCandidateError,
  selectReferingConfirmationStepContent,
  selectReferingCurrentStep,
  selectReferingCurrentStepContent,
  selectReferingCurrentStepData,
  selectReferingData,
  selectReferingDataFromOtherStep,
  selectReferingNextStep,
  selectReferingShouldSkipStep,
} from './refering.selectors';
import { RootState, slice } from './refering.slice';

// `data` is keyed by `ReferingStep` string (e.g. 'step-1') at runtime — the
// type's numeric index signature only accepts that through a cast, matching
// how the production reducer itself reads `state.data[currentStep]`.
const buildState = (
  overrides: Partial<Omit<ReturnType<typeof slice.getInitialState>, 'data'>> & {
    data?: Record<string, unknown>;
  } = {}
): RootState =>
  ({
    refering: { ...slice.getInitialState(), ...overrides },
  }) as RootState;

describe('refering.selectors', () => {
  describe('referCandidateSelectors', () => {
    it('reads the request status from refering.referCandate', () => {
      const state = buildState({ referCandate: { status: 'SUCCEEDED' } });

      expect(referCandidateSelectors.selectReferCandidateStatus(state)).toBe(
        'SUCCEEDED'
      );
      expect(
        referCandidateSelectors.selectIsReferCandidateSucceeded(state)
      ).toBe(true);
    });
  });

  describe('selectReferCandidateError', () => {
    it('returns the stored error', () => {
      expect(
        selectReferCandidateError(
          buildState({ referCandidateError: 'DUPLICATE_EMAIL' })
        )
      ).toBe('DUPLICATE_EMAIL');
    });

    it('returns null when there is no error', () => {
      expect(selectReferCandidateError(buildState())).toBeNull();
    });
  });

  describe('selectIsEmptyReferingData', () => {
    it('is true when no data has been collected', () => {
      expect(selectIsEmptyReferingData(buildState())).toBe(true);
    });

    it('is false once some step data has been collected', () => {
      expect(
        selectIsEmptyReferingData(
          buildState({ data: { 'step-1': { firstName: 'Jean' } } })
        )
      ).toBe(false);
    });
  });

  describe('selectReferingData', () => {
    it('returns the raw per-step data', () => {
      const data = { 'step-1': { firstName: 'Jean' } };

      expect(selectReferingData(buildState({ data }))).toBe(data);
    });
  });

  describe('selectReferingCurrentStep', () => {
    it('returns the current step', () => {
      expect(
        selectReferingCurrentStep(buildState({ currentStep: 'step-2' }))
      ).toBe('step-2');
    });

    it('returns null when there is no current step', () => {
      expect(selectReferingCurrentStep(buildState())).toBeNull();
    });
  });

  describe('selectReferingNextStep', () => {
    it('increments the current step', () => {
      expect(
        selectReferingNextStep(buildState({ currentStep: 'step-1' }))
      ).toBe('step-2');
    });

    it('throws when there is no current step', () => {
      expect(() => selectReferingNextStep(buildState())).toThrow();
    });
  });

  describe('selectIsFirstReferingStep', () => {
    it('is true on the first step', () => {
      expect(
        selectIsFirstReferingStep(buildState({ currentStep: 'step-1' }))
      ).toBe(true);
    });

    it('is false on any other step', () => {
      expect(
        selectIsFirstReferingStep(buildState({ currentStep: 'step-2' }))
      ).toBe(false);
    });

    it('is false when there is no current step', () => {
      expect(selectIsFirstReferingStep(buildState())).toBe(false);
    });
  });

  describe('selectIsLastReferingStep', () => {
    it('is false on the first step', () => {
      expect(
        selectIsLastReferingStep(buildState({ currentStep: 'step-1' }))
      ).toBe(false);
    });

    it('is false when a next step is configured', () => {
      expect(
        selectIsLastReferingStep(buildState({ currentStep: 'step-2' }))
      ).toBe(false);
    });

    it('is true when no next step is configured', () => {
      expect(
        selectIsLastReferingStep(buildState({ currentStep: 'step-4' }))
      ).toBe(true);
    });

    it('throws when there is no current step', () => {
      expect(() => selectIsLastReferingStep(buildState())).toThrow();
    });
  });

  describe('selectIsReferingLoading', () => {
    it('returns the loading flag', () => {
      expect(selectIsReferingLoading(buildState({ isLoading: true }))).toBe(
        true
      );
      expect(selectIsReferingLoading(buildState({ isLoading: false }))).toBe(
        false
      );
    });
  });

  describe('selectReferingCurrentStepData', () => {
    it('returns the data stored for the current step', () => {
      const state = buildState({
        currentStep: 'step-1',
        data: { 'step-1': { firstName: 'Jean' } },
      });

      expect(selectReferingCurrentStepData(state)).toEqual({
        firstName: 'Jean',
      });
    });

    it('returns null when there is no data for the current step yet', () => {
      expect(
        selectReferingCurrentStepData(buildState({ currentStep: 'step-1' }))
      ).toBeNull();
    });

    it('throws when there is no current step', () => {
      expect(() => selectReferingCurrentStepData(buildState())).toThrow();
    });
  });

  describe('selectReferingCurrentStepContent', () => {
    it('returns the content configured for the current step', () => {
      const content = selectReferingCurrentStepContent(
        buildState({ currentStep: 'step-1' })
      );

      expect(content.form.id).toBe('form-refering-account');
    });

    it('throws when the current step has no configured content', () => {
      expect(() =>
        selectReferingCurrentStepContent(
          buildState({ currentStep: 'step-99' as any })
        )
      ).toThrow();
    });

    it('throws when there is no current step', () => {
      expect(() => selectReferingCurrentStepContent(buildState())).toThrow();
    });
  });

  describe('selectReferingConfirmationStepContent', () => {
    it('returns the last step content, regardless of state', () => {
      expect(selectReferingConfirmationStepContent()).toBe(LastStepContent);
    });
  });

  describe('selectReferingDataFromOtherStep', () => {
    it('returns null on the first step', () => {
      expect(
        selectReferingDataFromOtherStep(buildState({ currentStep: 'step-1' }))
      ).toBeNull();
    });

    it('returns null when the step does not depend on other steps', () => {
      expect(
        selectReferingDataFromOtherStep(buildState({ currentStep: 'step-3' }))
      ).toBeNull();
    });

    it('flattens the values of the depended-on keys from other steps', () => {
      const state = buildState({
        currentStep: 'step-2',
        data: {
          'step-1': { gender: Genders.MALE },
          'step-2': { nudgeIds: ['nudge-1'] },
        },
      });

      expect(selectReferingDataFromOtherStep(state)).toEqual({
        gender: Genders.MALE,
        nudgeIds: ['nudge-1'],
      });
    });
  });

  describe('selectReferingShouldSkipStep', () => {
    it('is false on the first step', () => {
      expect(
        selectReferingShouldSkipStep(buildState({ currentStep: 'step-1' }))
      ).toBe(false);
    });

    it('is false when the step has no skippedBy configuration', () => {
      expect(
        selectReferingShouldSkipStep(buildState({ currentStep: 'step-3' }))
      ).toBe(false);
    });

    it('skips the step when a scalar depended-on value matches skippedBy', () => {
      const state = buildState({
        currentStep: 'step-2',
        data: { 'step-1': { gender: Genders.FEMALE } },
      });

      expect(selectReferingShouldSkipStep(state)).toBe(true);
    });

    it('skips the step when an array depended-on value equals skippedBy', () => {
      const state = buildState({
        currentStep: 'step-2',
        data: { 'step-2': { nudgeIds: ['nudge-1'] } },
      });

      expect(selectReferingShouldSkipStep(state)).toBe(true);
    });

    it('does not skip the step when no depended-on value matches skippedBy', () => {
      const state = buildState({
        currentStep: 'step-2',
        data: {
          'step-1': { gender: Genders.OTHER },
          'step-2': { nudgeIds: ['nudge-2'] },
        },
      });

      expect(selectReferingShouldSkipStep(state)).toBe(false);
    });
  });
});
