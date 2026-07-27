// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { UserRoles } from '@/src/constants/users';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import {
  buildOnboardingStepOrder,
  determineStartingStep,
} from './onboarding.utils';

const stepWithCompletion = (
  id: WizardStep['id'],
  isStepCompleted?: () => Promise<boolean>
): WizardStep => ({ id, isStepCompleted }) as unknown as WizardStep;

describe('buildOnboardingStepOrder', () => {
  it('returns no steps when shouldSkip is true, regardless of role/profileMode', () => {
    expect(
      buildOnboardingStepOrder({
        role: UserRoles.CANDIDATE,
        profileMode: 'manual',
        shouldSkip: true,
      })
    ).toEqual([]);
  });

  it('inserts social-situation only for candidates', () => {
    expect(
      buildOnboardingStepOrder({
        role: UserRoles.CANDIDATE,
        profileMode: 'pending',
        shouldSkip: false,
      })
    ).toEqual([
      'social-situation',
      'photo',
      'cv-choice',
      'elearning',
      'webinar',
      'match-recap',
    ]);

    expect(
      buildOnboardingStepOrder({
        role: UserRoles.COACH,
        profileMode: 'pending',
        shouldSkip: false,
      })
    ).toEqual(['photo', 'cv-choice', 'elearning', 'webinar', 'match-recap']);
  });

  it('inserts the CV path steps when profileMode is "cv"', () => {
    expect(
      buildOnboardingStepOrder({
        role: UserRoles.COACH,
        profileMode: 'cv',
        shouldSkip: false,
      })
    ).toEqual([
      'photo',
      'cv-choice',
      'cv-loading',
      'cv-recap',
      'elearning',
      'webinar',
      'match-recap',
    ]);
  });

  it('inserts the manual path steps when profileMode is "manual"', () => {
    expect(
      buildOnboardingStepOrder({
        role: UserRoles.COACH,
        profileMode: 'manual',
        shouldSkip: false,
      })
    ).toEqual([
      'photo',
      'cv-choice',
      'presentation',
      'experiences',
      'formations',
      'skills',
      'elearning',
      'webinar',
      'match-recap',
    ]);
  });
});

describe('determineStartingStep', () => {
  it('returns null when the steps array is empty', async () => {
    expect(await determineStartingStep([])).toBeNull();
  });

  it('returns the id of the first step when it has no isStepCompleted guard', async () => {
    const steps = [
      stepWithCompletion('photo'),
      stepWithCompletion('cv-choice'),
    ];

    expect(await determineStartingStep(steps)).toEqual('photo');
  });

  it('returns the id of the first incomplete step, skipping completed ones', async () => {
    const steps = [
      stepWithCompletion('photo', async () => true),
      stepWithCompletion('cv-choice', async () => false),
      stepWithCompletion('elearning', async () => false),
    ];

    expect(await determineStartingStep(steps)).toEqual('cv-choice');
  });

  it('returns null when every step reports itself as completed', async () => {
    const steps = [
      stepWithCompletion('photo', async () => true),
      stepWithCompletion('cv-choice', async () => true),
      stepWithCompletion('match-recap', async () => true),
    ];

    expect(await determineStartingStep(steps)).toBeNull();
  });

  it('returns the id of a step with no completion guard even if earlier steps are complete', () => {
    const steps = [
      stepWithCompletion('photo', async () => true),
      stepWithCompletion('presentation'),
      stepWithCompletion('experiences', async () => false),
    ];

    return expect(determineStartingStep(steps)).resolves.toEqual(
      'presentation'
    );
  });
});
