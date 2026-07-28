// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { slice } from './profile-completion.slice';

const { actions, reducer } = slice;

describe('profile-completion slice', () => {
  describe('fetchProfileCompletionSucceeded', () => {
    it('sets completionRate to the payload value', () => {
      const state = reducer(
        undefined,
        actions.fetchProfileCompletionSucceeded(75)
      );

      expect(state.completionRate).toBe(75);
    });

    it('overwrites a previously stored completionRate', () => {
      const initialState = {
        ...slice.getInitialState(),
        completionRate: 30,
      };

      const state = reducer(
        initialState,
        actions.fetchProfileCompletionSucceeded(80)
      );

      expect(state.completionRate).toBe(80);
    });
  });

  describe('fetchProfileCompletionFailed', () => {
    it('leaves completionRate unchanged (no-op on failure)', () => {
      const initialState = {
        ...slice.getInitialState(),
        completionRate: 42,
      };

      const state = reducer(
        initialState,
        actions.fetchProfileCompletionFailed(null)
      );

      expect(state.completionRate).toBe(42);
    });
  });
});
