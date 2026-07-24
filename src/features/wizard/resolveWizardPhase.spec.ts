// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { User } from '@/src/api/types';
import { ReduxRequestEvents } from '@/src/constants';
import { resolveWizardPhase } from './resolveWizardPhase';

const SOME_USER = { id: 'user-1' } as unknown as User;

describe('resolveWizardPhase', () => {
  it('returns "onboarding" when a current user is present, regardless of createUserStatus', () => {
    expect(resolveWizardPhase(SOME_USER, ReduxRequestEvents.IDLE)).toBe(
      'onboarding'
    );
    expect(resolveWizardPhase(SOME_USER, ReduxRequestEvents.SUCCEEDED)).toBe(
      'onboarding'
    );
  });

  it('returns "email-confirmation" when no current user but account creation succeeded', () => {
    expect(resolveWizardPhase(null, ReduxRequestEvents.SUCCEEDED)).toBe(
      'email-confirmation'
    );
  });

  it('returns "registration" when no current user and account creation has not succeeded', () => {
    expect(resolveWizardPhase(null, ReduxRequestEvents.IDLE)).toBe(
      'registration'
    );
    expect(resolveWizardPhase(null, ReduxRequestEvents.REQUESTED)).toBe(
      'registration'
    );
    expect(resolveWizardPhase(null, ReduxRequestEvents.FAILED)).toBe(
      'registration'
    );
  });
});
