const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: () => unknown) => selector(),
}));

const mockState = {
  fetchProfileStatus: 'IDLE',
  updateOnboardingStatus: 'IDLE',
  uploadSucceeded: false,
  uploadFailed: false,
  profileComplete: null as any,
};
jest.mock('@/src/use-cases/current-user', () => ({
  currentUserActions: {
    fetchCurrentProfileRequested: () => ({ type: 'fetchProfile' }),
    updateOnboardingStatusRequested: (payload: unknown) => ({
      type: 'updateOnboardingStatus',
      payload,
    }),
  },
  selectFetchCurrentProfileStatus: () => mockState.fetchProfileStatus,
  selectUpdateOnboardingStatusSelectors: {
    selectUpdateOnboardingStatusStatus: () => mockState.updateOnboardingStatus,
  },
  uploadExternalCvSelectors: {
    selectIsUploadExternalCvSucceeded: () => mockState.uploadSucceeded,
    selectIsUploadExternalCvFailed: () => mockState.uploadFailed,
  },
}));
jest.mock('@/src/use-cases/onboarding', () => ({
  onboardingActions: {
    setFormErrorMessage: (payload: unknown) => ({
      type: 'setFormErrorMessage',
      payload,
    }),
  },
}));
jest.mock('@/src/hooks/current-user/useCurrentUserProfileComplete', () => ({
  useCurrentUserProfileComplete: () => mockState.profileComplete,
}));
const mockGenerate = jest.fn();
const mockCancel = jest.fn();
jest.mock('@/src/hooks/useProfileGeneration', () => ({
  useProfileGeneration: () => ({
    generateProfileFromCV: mockGenerate,
    cancelProfileGeneration: mockCancel,
  }),
}));

// Every step hook is replaced by a stable fake step; the props the engine
// hands to each hook are recorded so the tests can drive them.
const mockSteps: Record<string, any> = {};
const mockHookProps: Record<string, any> = {};
const stepFor = (id: string) => {
  if (!mockSteps[id]) {
    mockSteps[id] = { id };
  }
  return mockSteps[id];
};
const stepHook = (key: string, id: string) => (props: any) => {
  mockHookProps[key] = props;
  return { [key]: stepFor(id) };
};
jest.mock(
  '@/src/features/wizard/onboarding/steps/step-elearning/useOnboardingStepElearning',
  () => ({
    useOnboardingStepElearning: (p: any) =>
      stepHook('onboardingStepElearning', 'elearning')(p),
  })
);
jest.mock(
  '@/src/features/wizard/onboarding/steps/step-webinar/useOnboardingStepWebinar',
  () => ({
    useOnboardingStepWebinar: (p: any) =>
      stepHook('onboardingStepWebinar', 'webinar')(p),
  })
);
jest.mock(
  '@/src/features/wizard/onboarding/steps/step-match-recap/useOnboardingStepMatchRecap',
  () => ({
    useOnboardingStepMatchRecap: (p: any) =>
      stepHook('onboardingStepMatchRecap', 'match-recap')(p),
  })
);
jest.mock(
  '@/src/features/wizard/onboarding/steps/step-social-situation/useOnboardingStepSocialSituation',
  () => ({
    useOnboardingStepSocialSituation: (p: any) =>
      stepHook('onboardingStepSocialSituation', 'social-situation')(p),
  })
);
const profileStepsPath =
  '@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps';
jest.mock(
  `${'@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps'}/useStepPhoto`,
  () => ({
    useStepPhoto: (p: any) => stepHook('onboardingStepPhoto', 'photo')(p),
  })
);
jest.mock(
  `${'@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps'}/useStepCvChoice`,
  () => ({
    useStepCvChoice: (p: any) =>
      stepHook('onboardingStepCvChoice', 'cv-choice')(p),
  })
);
jest.mock(
  `${'@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps'}/useStepCvLoading`,
  () => ({
    useStepCvLoading: (p: any) =>
      stepHook('onboardingStepCvLoading', 'cv-loading')(p),
  })
);
jest.mock(
  `${'@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps'}/useStepCvRecap`,
  () => ({
    useStepCvRecap: (p: any) =>
      stepHook('onboardingStepCvRecap', 'cv-recap')(p),
  })
);
jest.mock(
  `${'@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps'}/useStepPresentation`,
  () => ({
    useStepPresentation: (p: any) =>
      stepHook('onboardingStepPresentation', 'presentation')(p),
  })
);
jest.mock(
  `${'@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps'}/useStepExperiences`,
  () => ({
    useStepExperiences: (p: any) =>
      stepHook('onboardingStepExperiences', 'experiences')(p),
  })
);
jest.mock(
  `${'@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps'}/useStepFormations`,
  () => ({
    useStepFormations: (p: any) =>
      stepHook('onboardingStepFormations', 'formations')(p),
  })
);
jest.mock(
  `${'@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps'}/useStepSkills`,
  () => ({
    useStepSkills: (p: any) => stepHook('onboardingStepSkills', 'skills')(p),
  })
);

import { act, renderHook, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { User } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import { OnboardingStatus } from './onboarding.constants';
import { useOnboardingPhase } from './useOnboardingPhase';

void profileStepsPath;

const candidate = {
  id: 'u1',
  role: UserRoles.CANDIDATE,
  onboardingStatus: OnboardingStatus.IN_PROGRESS,
} as User;
const coach = { ...candidate, role: UserRoles.COACH } as User;

function render(
  currentUser: User | null = candidate,
  registrationFlow: RegistrationFlow | null = null
) {
  return renderHook(
    (props: { user: User | null }) =>
      useOnboardingPhase({ currentUser: props.user, registrationFlow }),
    { initialProps: { user: currentUser } }
  );
}

const ids = (steps: { id: string }[]) => steps.map((s) => s.id);
const completedUpdates = () =>
  mockDispatch.mock.calls
    .map(([a]) => a)
    .filter(
      (a) =>
        a.type === 'updateOnboardingStatus' &&
        a.payload.onboardingStatus === OnboardingStatus.COMPLETED
    );

describe('useOnboardingPhase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(mockSteps).forEach((k) => delete mockSteps[k]);
    mockState.fetchProfileStatus = 'SUCCEEDED';
    mockState.updateOnboardingStatus = 'IDLE';
    mockState.uploadSucceeded = false;
    mockState.uploadFailed = false;
    mockState.profileComplete = null;
  });

  // Lets the starting step resolution (async) settle inside act().
  afterEach(async () => {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });

  describe('step list', () => {
    it('lists the candidate steps, with the social situation first', async () => {
      const { result } = render();

      expect(ids(result.current.steps)).toEqual([
        'social-situation',
        'photo',
        'cv-choice',
        'elearning',
        'webinar',
        'match-recap',
      ]);
      await waitFor(() => expect(result.current.currentStepIdx).toBe(0));
    });

    it('has no social situation for a coach', async () => {
      const { result } = render(coach);

      expect(result.current.steps[0].id).toBe('photo');
      await waitFor(() => expect(result.current.currentStepIdx).toBe(0));
    });

    it('has no step when the onboarding is already completed', () => {
      const { result } = render({
        ...candidate,
        onboardingStatus: OnboardingStatus.COMPLETED,
      });

      expect(result.current.steps).toEqual([]);
      expect(result.current.isAlreadyCompleted).toBe(true);
    });

    it('has no step before account creation for the referer and company flows', () => {
      expect(
        render(null, RegistrationFlow.REFERER).result.current.steps
      ).toEqual([]);
      expect(
        render(null, RegistrationFlow.COMPANY).result.current.steps
      ).toEqual([]);
    });

    it('lists the default steps before account creation for the candidate flow', () => {
      const { result } = render(null, RegistrationFlow.CANDIDATE);

      expect(result.current.steps.length).toBeGreaterThan(0);
      expect(result.current.isInitializing).toBe(true);
    });

    it('gives the engine to the steps that advance on their own', () => {
      render();

      expect(
        mockHookProps.onboardingStepElearning.requestAdvance
      ).toBeInstanceOf(Function);
      expect(mockHookProps.onboardingStepElearning.userRole).toBe(
        UserRoles.CANDIDATE
      );
      expect(mockHookProps.onboardingStepSocialSituation.user).toBe(candidate);
    });
  });

  describe('profile mode', () => {
    it('adds the manual entry steps when the profile already has experiences', () => {
      mockState.profileComplete = { experiences: [{}], formations: [] };
      const { result } = render();

      expect(ids(result.current.steps)).toEqual([
        'social-situation',
        'photo',
        'cv-choice',
        'experiences',
        'formations',
        'skills',
        'presentation',
        'elearning',
        'webinar',
        'match-recap',
      ]);
    });

    it('adds the manual entry steps when the profile only has formations', () => {
      mockState.profileComplete = { experiences: [], formations: [{}] };

      expect(ids(render().result.current.steps)).toContain('experiences');
    });

    it('adds the CV steps when an external CV exists', () => {
      mockState.profileComplete = { hasExternalCv: true };
      const { result } = render();

      expect(ids(result.current.steps)).toEqual(
        expect.arrayContaining(['cv-loading', 'cv-recap'])
      );
      expect(ids(result.current.steps)).not.toContain('experiences');
    });

    it('stays pending for an empty profile', () => {
      mockState.profileComplete = { experiences: [], formations: [] };
      const ids_ = ids(render().result.current.steps);

      expect(ids_).not.toContain('experiences');
      expect(ids_).not.toContain('cv-loading');
    });

    it('lets the CV choice step switch mode and advance in one gesture', async () => {
      const { result } = render(coach);
      await waitFor(() => expect(result.current.currentStepIdx).toBe(0));
      act(() => {
        void result.current.onNext();
      });
      await waitFor(() =>
        expect(result.current.currentStep?.id).toBe('cv-choice')
      );

      act(() => {
        mockHookProps.onboardingStepCvChoice.requestAdvanceWithProfileMode(
          'cv-choice',
          'manual'
        );
      });

      expect(result.current.currentStep?.id).toBe('experiences');
      expect(ids(result.current.steps)).toContain('experiences');
    });

    it('ignores a mode-changing advance requested by another step', async () => {
      const { result } = render(coach);
      await waitFor(() => expect(result.current.currentStepIdx).toBe(0));

      act(() => {
        mockHookProps.onboardingStepCvChoice.requestAdvanceWithProfileMode(
          'cv-choice',
          'manual'
        );
      });

      expect(result.current.currentStep?.id).toBe('photo');
    });

    it('falls back to manual entry and cancels the generation from the CV loading step', () => {
      const { result } = render(coach);

      act(() => {
        mockHookProps.onboardingStepCvLoading.onManualFallback();
      });

      expect(mockCancel).toHaveBeenCalledTimes(1);
      expect(ids(result.current.steps)).toContain('experiences');
    });
  });

  describe('starting step', () => {
    it('fetches the profile when it was not requested yet', () => {
      mockState.fetchProfileStatus = 'IDLE';
      render();

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'fetchProfile' });
    });

    it('does not fetch the profile without user', () => {
      mockState.fetchProfileStatus = 'IDLE';
      render(null, RegistrationFlow.CANDIDATE);

      expect(mockDispatch).not.toHaveBeenCalledWith({ type: 'fetchProfile' });
    });

    it('waits for the profile before choosing the starting step', async () => {
      mockState.fetchProfileStatus = 'PENDING';
      const { result } = render();
      await act(async () => {
        await Promise.resolve();
      });

      expect(result.current.currentStepIdx).toBeNull();
      expect(result.current.isInitializing).toBe(true);
    });

    it('resumes on the first step that is not completed', async () => {
      stepFor('photo').isStepCompleted = async () => true;
      stepFor('cv-choice').isStepCompleted = async () => false;
      const { result } = render(coach);

      await waitFor(() =>
        expect(result.current.currentStep?.id).toBe('cv-choice')
      );
    });

    it('finalizes the onboarding when every step is already complete', async () => {
      ['photo', 'cv-choice', 'elearning', 'webinar', 'match-recap'].forEach(
        (id) => {
          stepFor(id).isStepCompleted = async () => true;
        }
      );
      const { result } = render(coach);

      await waitFor(() => expect(completedUpdates()).toHaveLength(1));
      expect(result.current.currentStepIdx).toBeNull();
    });
  });

  describe('navigation', () => {
    async function ready(user: User = coach) {
      const utils = render(user);
      await waitFor(() => expect(utils.result.current.currentStepIdx).toBe(0));
      return utils;
    }

    it('goes to the next step, with the default label', async () => {
      const { result } = await ready();

      expect(result.current.buttonLabel).toBe('Étape suivante');
      expect(result.current.canGoBack).toBe(false);
      await act(async () => {
        await result.current.onNext();
      });

      expect(result.current.currentStep?.id).toBe('cv-choice');
      expect(result.current.canGoBack).toBe(true);
    });

    it('goes back to the previous step', async () => {
      const { result } = await ready();
      await act(async () => {
        await result.current.onNext();
      });

      act(() => result.current.onBack());

      expect(result.current.currentStep?.id).toBe('photo');
    });

    it('ignores back on the first step', async () => {
      const { result } = await ready();

      act(() => result.current.onBack());

      expect(result.current.currentStep?.id).toBe('photo');
    });

    it('resets the profile mode when going back to the CV choice', async () => {
      mockState.profileComplete = { experiences: [{}] };
      const { result } = await ready();
      await waitFor(() =>
        expect(ids(result.current.steps)).toContain('experiences')
      );
      // photo -> cv-choice -> experiences
      await act(async () => {
        await result.current.onNext();
      });
      await act(async () => {
        await result.current.onNext();
      });
      expect(result.current.currentStep?.id).toBe('experiences');

      act(() => result.current.onBack());

      expect(result.current.currentStep?.id).toBe('cv-choice');
      expect(ids(result.current.steps)).not.toContain('experiences');
    });

    it('stays on the step when the next is refused by incrementationIsAllowed', async () => {
      const { result } = await ready();
      const incrementationIsAllowed = jest.fn().mockResolvedValue(false);
      mockSteps.photo.incrementationIsAllowed = incrementationIsAllowed;
      await act(async () => {
        await result.current.onNext();
      });

      expect(incrementationIsAllowed).toHaveBeenCalledTimes(1);
      expect(result.current.currentStep?.id).toBe('photo');
    });

    it('submits the step, clears the error and shows loading meanwhile', async () => {
      const { result } = await ready();
      let release: (v?: unknown) => void = () => {};
      mockSteps.photo.onSubmit = jest.fn(
        () => new Promise((resolve) => (release = resolve))
      );

      let pending: Promise<void>;
      act(() => {
        pending = result.current.onNext();
      });
      expect(result.current.isLoading).toBe(true);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'setFormErrorMessage',
        payload: null,
      });
      await act(async () => {
        release();
        await pending;
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.currentStep?.id).toBe('cv-choice');
    });

    it('stays on the step when its submission fails', async () => {
      const { result } = await ready();
      mockSteps.photo.onSubmit = jest.fn().mockResolvedValue(false);
      await act(async () => {
        await result.current.onNext();
      });

      expect(result.current.currentStep?.id).toBe('photo');
      expect(result.current.isLoading).toBe(false);
    });

    it('completes the onboarding from the last step and skips the generic dashboard redirect', async () => {
      const { result } = await ready();
      // photo, cv-choice, elearning, webinar, match-recap
      for (let i = 0; i < 4; i++) {
        await act(async () => {
          await result.current.onNext();
        });
      }
      expect(result.current.currentStep?.id).toBe('match-recap');
      expect(result.current.buttonLabel).toBe('Terminer');

      await act(async () => {
        await result.current.onNext();
      });

      expect(completedUpdates()).toHaveLength(1);
      expect(result.current.skipDashboardRedirectRef.current).toBe(true);
    });

    it('prefers the label of the step', async () => {
      const { result } = await ready();
      mockSteps.photo.buttonLabel = 'Ajouter';
      act(() => result.current.onBack());
      await act(async () => {
        await result.current.onNext();
      });
      act(() => result.current.onBack());

      expect(result.current.buttonLabel).toBe('Ajouter');
    });

    it('skipOnboarding completes the onboarding without arming the redirect flag', async () => {
      const { result } = await ready();

      act(() => result.current.skipOnboarding());

      expect(completedUpdates()).toHaveLength(1);
      expect(result.current.skipDashboardRedirectRef.current).toBe(false);
    });

    it('arms the suggested message redirect from the recap step', async () => {
      const { result } = await ready();

      mockHookProps.onboardingStepMatchRecap.onSuggestedMessageSent();
      await mockHookProps.onboardingStepMatchRecap.onOnboardingCompleted(true);

      expect(result.current.pendingSuggestedMessageRedirectRef.current).toBe(
        true
      );
      expect(result.current.skipDashboardRedirectRef.current).toBe(true);
    });
  });

  describe('requestAdvance (steps advancing on their own)', () => {
    it('advances only from the current step', async () => {
      const { result } = render(coach);
      await waitFor(() => expect(result.current.currentStepIdx).toBe(0));

      act(() => {
        mockHookProps.onboardingStepElearning.requestAdvance('elearning');
      });
      expect(result.current.currentStep?.id).toBe('photo');

      act(() => {
        mockHookProps.onboardingStepElearning.requestAdvance('photo');
      });
      expect(result.current.currentStep?.id).toBe('cv-choice');
    });

    it('does not move past the last step', async () => {
      const { result } = render(coach);
      await waitFor(() => expect(result.current.currentStepIdx).toBe(0));
      for (const id of [
        'photo',
        'cv-choice',
        'elearning',
        'webinar',
        'match-recap',
      ]) {
        act(() => {
          mockHookProps.onboardingStepElearning.requestAdvance(id);
        });
      }

      expect(result.current.currentStep?.id).toBe('match-recap');
    });

    it('auto-skips a step that reports it is skippable', async () => {
      stepFor('photo').isAutoSkippable = jest.fn().mockResolvedValue(true);
      const { result } = render(coach);

      await waitFor(() =>
        expect(result.current.currentStep?.id).toBe('cv-choice')
      );
    });

    it('stays on a step that is not skippable', async () => {
      const isAutoSkippable = jest.fn().mockResolvedValue(false);
      stepFor('photo').isAutoSkippable = isAutoSkippable;
      const { result } = render(coach);

      await waitFor(() => expect(isAutoSkippable).toHaveBeenCalled());
      expect(result.current.currentStep?.id).toBe('photo');
    });
  });

  describe('CV loading', () => {
    async function onCvLoading() {
      mockState.profileComplete = { hasExternalCv: true };
      const utils = render(coach);
      await waitFor(() => expect(utils.result.current.currentStepIdx).toBe(0));
      // photo -> cv-choice -> cv-loading
      for (let i = 0; i < 2; i++) {
        await act(async () => {
          await utils.result.current.onNext();
        });
      }
      expect(utils.result.current.currentStep?.id).toBe('cv-loading');
      return utils;
    }

    it('generates the profile once the CV upload succeeded without extracted data', async () => {
      const { rerender } = await onCvLoading();
      mockState.uploadSucceeded = true;
      rerender({ user: coach });
      rerender({ user: coach });

      expect(mockGenerate).toHaveBeenCalledTimes(1);
    });

    it('moves on when the extracted data is already there', async () => {
      const { result, rerender } = await onCvLoading();
      mockState.profileComplete = {
        hasExternalCv: true,
        hasExtractedCvData: true,
      };
      mockState.uploadSucceeded = true;
      rerender({ user: coach });

      expect(result.current.currentStep?.id).toBe('cv-recap');
      expect(mockGenerate).not.toHaveBeenCalled();
    });

    it('returns to the CV choice when the upload fails', async () => {
      const { result, rerender } = await onCvLoading();
      mockState.uploadFailed = true;
      rerender({ user: coach });

      expect(result.current.currentStep?.id).toBe('cv-choice');
      expect(ids(result.current.steps)).not.toContain('cv-loading');
    });
  });

  it('exposes the status of the onboarding update', () => {
    mockState.updateOnboardingStatus = 'SUCCEEDED';

    expect(render().result.current.updateOnboardingStatus).toBe('SUCCEEDED');
  });
});
