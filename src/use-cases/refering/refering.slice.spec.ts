// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { Genders } from '@/src/constants/genders';
import { ReferingErrorMessages } from '@/src/features/backoffice/referer/Refering/Refering.types';
import { slice } from './refering.slice';

const { actions, reducer } = slice;

// `setReferingCurrentStepData`'s payload type is the full `ReferingFormData`
// union (one member per step form), never a partial — the real app always
// dispatches a step's whole submitted form. This builds a full, valid
// `step-1` (account) form submission.
const buildAccountFormData = (
  overrides: Partial<{
    firstName: string;
    lastName: string;
    gender: Genders;
    phone: string;
    email: string;
    confirmReferingRules: boolean;
  }> = {}
) => ({
  firstName: 'Jean',
  lastName: 'Dupont',
  gender: Genders.MALE,
  phone: '+33612345678',
  email: 'jean@example.com',
  confirmReferingRules: true,
  ...overrides,
});

describe('refering slice', () => {
  describe('setReferingCurrentStepData', () => {
    it('throws when there is no current step', () => {
      const initialState = slice.getInitialState();

      expect(() =>
        reducer(
          initialState,
          actions.setReferingCurrentStepData(buildAccountFormData())
        )
      ).toThrow(ReferingErrorMessages.CURRENT_STEP);
    });

    it('stores the payload under the current step when there is no existing data', () => {
      const initialState = {
        ...slice.getInitialState(),
        currentStep: 'step-1' as const,
      };
      const payload = buildAccountFormData();

      const state = reducer(
        initialState,
        actions.setReferingCurrentStepData(payload)
      );

      expect(state.data['step-1']).toEqual(payload);
    });

    it('replaces a previous submission for the current step when resubmitted', () => {
      const initialState = {
        ...slice.getInitialState(),
        currentStep: 'step-1' as const,
        // `data` is keyed by `ReferingStep` string (e.g. 'step-1') at
        // runtime — the type's numeric index signature only accepts that
        // through a cast, matching how the production reducer itself reads
        // `state.data[currentStep]`.
        data: {
          'step-1': buildAccountFormData({ lastName: 'Ancien' }),
        } as any,
      };
      const payload = buildAccountFormData({ lastName: 'Martin' });

      const state = reducer(
        initialState,
        actions.setReferingCurrentStepData(payload)
      );

      expect(state.data['step-1']).toEqual(payload);
    });

    it('does not affect data stored under other steps', () => {
      const initialState = {
        ...slice.getInitialState(),
        currentStep: 'step-2' as const,
        data: { 'step-1': buildAccountFormData() } as any,
      };

      const state = reducer(
        initialState,
        actions.setReferingCurrentStepData({ nudgeIds: ['nudge-1'] })
      );

      expect(state.data['step-1']).toEqual(buildAccountFormData());
      expect(state.data['step-2']).toEqual({ nudgeIds: ['nudge-1'] });
    });
  });

  describe('setReferingStep', () => {
    it('sets the current step and starts loading', () => {
      const initialState = { ...slice.getInitialState(), isLoading: false };

      const state = reducer(initialState, actions.setReferingStep('step-2'));

      expect(state.currentStep).toBe('step-2');
      expect(state.isLoading).toBe(true);
    });

    it('can reset the current step to null while still flagging loading', () => {
      const initialState = {
        ...slice.getInitialState(),
        currentStep: 'step-2' as const,
        isLoading: false,
      };

      const state = reducer(initialState, actions.setReferingStep(null));

      expect(state.currentStep).toBeNull();
      expect(state.isLoading).toBe(true);
    });
  });

  describe('setReferingIsLoading', () => {
    it('sets isLoading to true', () => {
      const state = reducer(undefined, actions.setReferingIsLoading(true));

      expect(state.isLoading).toBe(true);
    });

    it('sets isLoading to false', () => {
      const initialState = { ...slice.getInitialState(), isLoading: true };

      const state = reducer(initialState, actions.setReferingIsLoading(false));

      expect(state.isLoading).toBe(false);
    });
  });

  describe('resetReferingData', () => {
    it('clears the collected data and flags loading', () => {
      const initialState = {
        ...slice.getInitialState(),
        data: { 'step-1': buildAccountFormData() } as any,
        isLoading: false,
      };

      const state = reducer(initialState, actions.resetReferingData());

      expect(state.data).toEqual({});
      expect(state.isLoading).toBe(true);
    });
  });
});
