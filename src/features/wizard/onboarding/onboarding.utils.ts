import { UserRoles } from '@/src/constants/users';
import { ProfileMode } from '@/src/features/wizard/onboarding/steps/step-profile-completion/profile-steps/types';
import {
  WizardStep,
  WizardStepId,
} from '@/src/features/wizard/shell/wizard.types';

interface BuildOnboardingStepOrderParams {
  role: UserRoles | undefined;
  profileMode: ProfileMode;
  shouldSkip: boolean;
}

// buildOnboardingStepOrder - Pure step id ordering, mirrored by the
// onboardingSteps useMemo in useOnboardingPhase.tsx. Kept side-effect free so
// it can be called outside the render cycle (see requestAdvanceWithProfileMode).
export const buildOnboardingStepOrder = ({
  role,
  profileMode,
  shouldSkip,
}: BuildOnboardingStepOrderParams): WizardStepId[] => {
  if (shouldSkip) {
    return [];
  }

  const ids: WizardStepId[] = [];

  if (role === UserRoles.CANDIDATE) {
    ids.push('social-situation');
  }

  ids.push('photo');
  ids.push('cv-choice');

  if (profileMode === 'cv') {
    ids.push('cv-loading');
    ids.push('cv-recap');
  } else if (profileMode === 'manual') {
    ids.push('presentation');
    ids.push('experiences');
    ids.push('formations');
    ids.push('skills');
  }

  ids.push('elearning');
  ids.push('webinar');
  ids.push('match-recap');

  return ids;
};

// determineStartingStep - Determines the starting onboarding step based on user data.
export const determineStartingStep = async (
  onboardingSteps: WizardStep[]
): Promise<WizardStepId | null> => {
  for (const step of onboardingSteps) {
    if (step.isStepCompleted) {
      const completed = await step.isStepCompleted();
      if (!completed) {
        return step.id;
      }
    } else {
      return step.id;
    }
  }
  // null = toutes les étapes sont déjà complètes
  return null;
};
