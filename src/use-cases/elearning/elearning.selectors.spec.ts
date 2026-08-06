// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { selectIsLoading } from './elearning.selectors';
import { RootState, slice } from './elearning.slice';

const buildState = (
  overrides: Partial<ReturnType<typeof slice.getInitialState>> = {}
): RootState =>
  ({
    elearning: { ...slice.getInitialState(), ...overrides },
  }) as RootState;

describe('elearning.selectors', () => {
  describe('selectIsLoading', () => {
    it('returns true when isLoading is true', () => {
      expect(selectIsLoading(buildState({ isLoading: true }))).toBe(true);
    });

    it('returns false when isLoading is false', () => {
      expect(selectIsLoading(buildState({ isLoading: false }))).toBe(false);
    });
  });
});
