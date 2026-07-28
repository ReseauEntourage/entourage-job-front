// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { selectProfileCompletionRate } from './profile-completion.selectors';
import { RootState, slice } from './profile-completion.slice';

const buildState = (
  overrides: Partial<ReturnType<typeof slice.getInitialState>> = {}
): RootState =>
  ({
    profileCompletion: { ...slice.getInitialState(), ...overrides },
  }) as RootState;

describe('profile-completion.selectors', () => {
  describe('selectProfileCompletionRate', () => {
    it('returns the completion rate from state', () => {
      expect(
        selectProfileCompletionRate(buildState({ completionRate: 65 }))
      ).toBe(65);
    });

    it('returns 0 by default', () => {
      expect(selectProfileCompletionRate(buildState())).toBe(0);
    });
  });
});
