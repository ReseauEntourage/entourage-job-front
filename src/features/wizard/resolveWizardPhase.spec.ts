// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { User } from '@/src/api/types';
import { resolveWizardPhase } from './resolveWizardPhase';

const SOME_USER = { id: 'user-1' } as unknown as User;

describe('resolveWizardPhase', () => {
  it('returns "onboarding" when a current user is present, regardless of isCreateUserSucceeded', () => {
    expect(resolveWizardPhase(SOME_USER, false)).toBe('onboarding');
    expect(resolveWizardPhase(SOME_USER, true)).toBe('onboarding');
  });

  it('returns "email-confirmation" when no current user but account creation succeeded', () => {
    expect(resolveWizardPhase(null, true)).toBe('email-confirmation');
  });

  it('returns "registration" when no current user and account creation has not succeeded', () => {
    expect(resolveWizardPhase(null, false)).toBe('registration');
  });
});
