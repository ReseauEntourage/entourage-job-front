// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import {
  RegistrationFlows,
  RegistrationStepSelectFlow,
} from '@/src/features/registration/registration.config';
import { RegistrationData } from '@/src/features/registration/registration.types';
import {
  selectCompatibleProfilesCount,
  selectCreateUserError,
  selectDefinedRegistrationSelectedFlow,
  selectInvitationId,
  selectIsFirstRegistrationStep,
  selectIsRegistrationLoading,
  selectNextIsLastRegistrationStep,
  selectPreRegistrationPreferences,
  selectRegistrationCurrentStep,
  selectRegistrationCurrentStepContent,
  selectRegistrationData,
  selectRegistrationIsEnded,
  selectRegistrationNextStep,
  selectRegistrationSelectedFlow,
  selectRegistrationShouldSkipStep,
} from './registration.selectors';
import { RootState, slice } from './registration.slice';

const buildState = (
  overrides: Partial<ReturnType<typeof slice.getInitialState>> = {}
): RootState =>
  ({
    registration: { ...slice.getInitialState(), ...overrides },
  }) as RootState;

const buildRegistrationData = (
  overrides: Partial<RegistrationData> = {}
): RegistrationData =>
  ({
    firstName: 'Jane',
    ...overrides,
  }) as RegistrationData;

describe('registration.selectors', () => {
  describe('selectCreateUserError', () => {
    it('returns the create user error', () => {
      expect(
        selectCreateUserError(
          buildState({ createUserError: 'DUPLICATE_EMAIL' })
        )
      ).toBe('DUPLICATE_EMAIL');
    });

    it('returns null when there is no error', () => {
      expect(selectCreateUserError(buildState())).toBeNull();
    });
  });

  describe('selectInvitationId', () => {
    it('returns the invitation id', () => {
      expect(
        selectInvitationId(buildState({ invitationId: 'invitation-1' }))
      ).toBe('invitation-1');
    });

    it('returns undefined when there is no invitation id', () => {
      expect(selectInvitationId(buildState())).toBeUndefined();
    });
  });

  describe('selectRegistrationData', () => {
    it('returns the registration data', () => {
      const data = buildRegistrationData();
      expect(selectRegistrationData(buildState({ data }))).toEqual(data);
    });

    it('returns null when there is no data yet', () => {
      expect(selectRegistrationData(buildState())).toBeNull();
    });
  });

  describe('selectRegistrationCurrentStep', () => {
    it('returns the current step', () => {
      expect(
        selectRegistrationCurrentStep(buildState({ currentStep: 2 }))
      ).toBe(2);
    });
  });

  describe('selectRegistrationNextStep', () => {
    it('returns the current step incremented by one', () => {
      expect(selectRegistrationNextStep(buildState({ currentStep: 1 }))).toBe(
        2
      );
    });

    it('throws when the current step is not defined', () => {
      expect(() =>
        selectRegistrationNextStep(
          buildState({ currentStep: undefined as any })
        )
      ).toThrow();
    });
  });

  describe('selectRegistrationSelectedFlow', () => {
    it('returns the selected flow', () => {
      expect(
        selectRegistrationSelectedFlow(
          buildState({ selectedFlow: RegistrationFlow.CANDIDATE })
        )
      ).toBe(RegistrationFlow.CANDIDATE);
    });

    it('returns null when no flow is selected', () => {
      expect(selectRegistrationSelectedFlow(buildState())).toBeNull();
    });
  });

  describe('selectDefinedRegistrationSelectedFlow', () => {
    it('returns the selected flow when set', () => {
      expect(
        selectDefinedRegistrationSelectedFlow(
          buildState({ selectedFlow: RegistrationFlow.COACH })
        )
      ).toBe(RegistrationFlow.COACH);
    });

    it('returns null without throwing when no flow is selected', () => {
      expect(selectDefinedRegistrationSelectedFlow(buildState())).toBeNull();
    });
  });

  describe('selectIsFirstRegistrationStep', () => {
    it('returns true when on the first step', () => {
      expect(
        selectIsFirstRegistrationStep(buildState({ currentStep: 0 }))
      ).toBe(true);
    });

    it('returns false when not on the first step', () => {
      expect(
        selectIsFirstRegistrationStep(buildState({ currentStep: 1 }))
      ).toBe(false);
    });
  });

  describe('selectNextIsLastRegistrationStep', () => {
    it('returns false when no flow is selected', () => {
      expect(
        selectNextIsLastRegistrationStep(buildState({ currentStep: 0 }))
      ).toBe(false);
    });

    it('returns false when the next step is not the last one', () => {
      // REFERER flow has a single step, so from step -1 the next step (0) is already the last one.
      // CANDIDATE flow has 3 steps, so from step 0 the next step (1) is not the last one.
      expect(
        selectNextIsLastRegistrationStep(
          buildState({
            selectedFlow: RegistrationFlow.CANDIDATE,
            currentStep: 0,
          })
        )
      ).toBe(false);
    });

    it('returns true when the next step reaches or exceeds the last step of the flow', () => {
      // REFERER flow has a single step (length 1): from currentStep 0, the
      // next step (1) already reaches the flow's length, so it counts as last.
      const flowLength = RegistrationFlows[RegistrationFlow.REFERER]!.length;

      expect(
        selectNextIsLastRegistrationStep(
          buildState({
            selectedFlow: RegistrationFlow.REFERER,
            currentStep: flowLength - 1,
          })
        )
      ).toBe(true);
    });
  });

  describe('selectRegistrationIsEnded', () => {
    it('returns the isEnded flag', () => {
      expect(selectRegistrationIsEnded(buildState({ isEnded: true }))).toBe(
        true
      );
    });
  });

  describe('selectPreRegistrationPreferences', () => {
    it('returns the pre-registration preferences', () => {
      const preRegistrationPreferences = {
        nudgeIds: ['nudge-1'],
        sectorOccupations: [],
        businessSectorIds: [],
        currentJob: undefined,
      };

      expect(
        selectPreRegistrationPreferences(
          buildState({ preRegistrationPreferences })
        )
      ).toEqual(preRegistrationPreferences);
    });

    it('returns null when there are no preferences yet', () => {
      expect(selectPreRegistrationPreferences(buildState())).toBeNull();
    });
  });

  describe('selectIsRegistrationLoading', () => {
    it('returns the isLoading flag', () => {
      expect(selectIsRegistrationLoading(buildState({ isLoading: true }))).toBe(
        true
      );
    });
  });

  describe('selectCompatibleProfilesCount', () => {
    it('returns the compatible profiles count', () => {
      expect(
        selectCompatibleProfilesCount(
          buildState({ compatibleProfilesCount: 7 })
        )
      ).toBe(7);
    });

    it('returns null when not set', () => {
      expect(selectCompatibleProfilesCount(buildState())).toBeNull();
    });
  });

  describe('selectRegistrationCurrentStepContent', () => {
    it('returns the flow selection step when no flow is selected', () => {
      expect(
        selectRegistrationCurrentStepContent(buildState({ currentStep: 0 }))
      ).toBe(RegistrationStepSelectFlow);
    });

    it('returns the current step content for the selected flow', () => {
      expect(
        selectRegistrationCurrentStepContent(
          buildState({
            selectedFlow: RegistrationFlow.CANDIDATE,
            currentStep: 1,
          })
        )
      ).toBe(RegistrationFlows[RegistrationFlow.CANDIDATE]![1]);
    });

    it('falls back to the flow selection step when the current step is out of range', () => {
      expect(
        selectRegistrationCurrentStepContent(
          buildState({
            selectedFlow: RegistrationFlow.REFERER,
            currentStep: 99,
          })
        )
      ).toBe(RegistrationStepSelectFlow);
    });
  });

  describe('selectRegistrationShouldSkipStep', () => {
    it('returns false when there is no registration data yet', () => {
      expect(
        selectRegistrationShouldSkipStep(
          buildState({
            selectedFlow: RegistrationFlow.CANDIDATE,
            currentStep: 0,
            data: null,
          })
        )
      ).toBe(false);
    });

    it('returns false when the current step content has no skippedBy configuration', () => {
      // None of the steps configured in RegistrationFlows currently define
      // `skippedBy`, so this is the only reachable branch of the selector
      // with real registration config data.
      expect(
        selectRegistrationShouldSkipStep(
          buildState({
            selectedFlow: RegistrationFlow.CANDIDATE,
            currentStep: 0,
            data: buildRegistrationData(),
          })
        )
      ).toBe(false);
    });
  });
});
