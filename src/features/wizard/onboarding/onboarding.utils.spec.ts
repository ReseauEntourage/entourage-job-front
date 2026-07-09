// eslint-disable-next-line import/no-named-as-default
import expect from 'expect';
import { UserRoles } from '@/src/constants/users';
import { buildOnboardingStepOrder } from './onboarding.utils';

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
