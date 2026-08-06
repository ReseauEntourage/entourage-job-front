// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { slice } from './elearning.slice';

const { actions, reducer } = slice;

describe('elearning slice', () => {
  describe('setIsLoading', () => {
    it('sets isLoading to true', () => {
      const state = reducer(undefined, actions.setIsLoading(true));

      expect(state.isLoading).toBe(true);
    });

    it('sets isLoading to false', () => {
      const initialState = { ...slice.getInitialState(), isLoading: true };

      const state = reducer(initialState, actions.setIsLoading(false));

      expect(state.isLoading).toBe(false);
    });
  });

  describe('resetElearning', () => {
    it('returns the initial state', () => {
      const mutated = reducer(undefined, actions.setIsLoading(true));

      expect(reducer(mutated, actions.resetElearning())).toEqual(
        slice.getInitialState()
      );
    });
  });
});
