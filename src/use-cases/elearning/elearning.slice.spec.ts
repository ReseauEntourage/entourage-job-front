// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { UserRoles } from '@/src/constants/users';
import {
  ElearningCompletion,
  ElearningUnit,
} from '@/src/features/backoffice/elearning/elearning.types';
import { slice } from './elearning.slice';

const { actions, reducer } = slice;

const buildCompletion = (
  overrides: Partial<ElearningCompletion> = {}
): ElearningCompletion => ({
  id: 'completion-1',
  userId: 'user-1',
  unitId: 'unit-1',
  validatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

const buildUnit = (overrides: Partial<ElearningUnit> = {}): ElearningUnit => ({
  id: 'unit-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  title: 'Unit 1',
  description: 'Description',
  durationMinutes: 10,
  videoUrl: 'https://example.com/video.mp4',
  questions: [],
  roles: [],
  userCompletions: [],
  ...overrides,
});

describe('elearning slice', () => {
  describe('fetchElearningUnitsRequested', () => {
    it('sets the fetchElearningUnits status to REQUESTED', () => {
      const state = reducer(
        undefined,
        actions.fetchElearningUnitsRequested(UserRoles.CANDIDATE)
      );

      expect(state.fetchElearningUnits.status).toBe('REQUESTED');
    });
  });

  describe('fetchElearningUnitsSucceeded', () => {
    it('sets elearningUnits and the status to SUCCEEDED', () => {
      const units = [buildUnit()];

      const state = reducer(
        undefined,
        actions.fetchElearningUnitsSucceeded(units)
      );

      expect(state.elearningUnits).toEqual(units);
      expect(state.fetchElearningUnits.status).toBe('SUCCEEDED');
    });
  });

  describe('fetchElearningUnitsFailed', () => {
    it('sets the fetchElearningUnits status to FAILED', () => {
      const state = reducer(undefined, actions.fetchElearningUnitsFailed());

      expect(state.fetchElearningUnits.status).toBe('FAILED');
    });
  });

  describe('postElearningCompletionRequested', () => {
    it('sets the postElearningCompletion status to REQUESTED', () => {
      const state = reducer(
        undefined,
        actions.postElearningCompletionRequested({ unitId: 'unit-1' })
      );

      expect(state.postElearningCompletion.status).toBe('REQUESTED');
    });
  });

  describe('postElearningCompletionSucceeded', () => {
    it('sets the postElearningCompletion status to SUCCEEDED', () => {
      const state = reducer(
        undefined,
        actions.postElearningCompletionSucceeded(buildCompletion())
      );

      expect(state.postElearningCompletion.status).toBe('SUCCEEDED');
    });

    it('adds the completion to the matching unit when it has none yet', () => {
      const initialState = {
        ...slice.getInitialState(),
        elearningUnits: [buildUnit({ id: 'unit-1', userCompletions: [] })],
      };
      const completion = buildCompletion({
        id: 'completion-1',
        unitId: 'unit-1',
      });

      const state = reducer(
        initialState,
        actions.postElearningCompletionSucceeded(completion)
      );

      expect(state.elearningUnits[0].userCompletions).toEqual([completion]);
    });

    it('replaces (rather than appends) the existing completion for the same unit', () => {
      const staleCompletion = buildCompletion({
        id: 'completion-stale',
        unitId: 'unit-1',
        validatedAt: '2026-01-01T00:00:00.000Z',
      });
      const initialState = {
        ...slice.getInitialState(),
        elearningUnits: [
          buildUnit({ id: 'unit-1', userCompletions: [staleCompletion] }),
        ],
      };
      const updatedCompletion = buildCompletion({
        id: 'completion-fresh',
        unitId: 'unit-1',
        validatedAt: '2026-02-01T00:00:00.000Z',
      });

      const state = reducer(
        initialState,
        actions.postElearningCompletionSucceeded(updatedCompletion)
      );

      expect(state.elearningUnits[0].userCompletions).toEqual([
        updatedCompletion,
      ]);
    });

    it('leaves completions for other units untouched', () => {
      const otherUnitCompletion = buildCompletion({
        id: 'completion-other',
        unitId: 'unit-2',
      });
      const initialState = {
        ...slice.getInitialState(),
        elearningUnits: [
          buildUnit({ id: 'unit-1', userCompletions: [] }),
          buildUnit({ id: 'unit-2', userCompletions: [otherUnitCompletion] }),
        ],
      };
      const completion = buildCompletion({
        id: 'completion-1',
        unitId: 'unit-1',
      });

      const state = reducer(
        initialState,
        actions.postElearningCompletionSucceeded(completion)
      );

      expect(state.elearningUnits[1].userCompletions).toEqual([
        otherUnitCompletion,
      ]);
    });

    it('is a no-op on elearningUnits when the completion targets an unknown unit', () => {
      const initialState = {
        ...slice.getInitialState(),
        elearningUnits: [buildUnit({ id: 'unit-1', userCompletions: [] })],
      };
      const completion = buildCompletion({ unitId: 'unknown-unit' });

      const state = reducer(
        initialState,
        actions.postElearningCompletionSucceeded(completion)
      );

      expect(state.elearningUnits).toEqual(initialState.elearningUnits);
    });
  });

  describe('postElearningCompletionFailed', () => {
    it('sets the postElearningCompletion status to FAILED', () => {
      const state = reducer(undefined, actions.postElearningCompletionFailed());

      expect(state.postElearningCompletion.status).toBe('FAILED');
    });
  });

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
      const mutated = reducer(
        undefined,
        actions.fetchElearningUnitsSucceeded([buildUnit()])
      );

      expect(reducer(mutated, actions.resetElearning())).toEqual(
        slice.getInitialState()
      );
    });
  });
});
