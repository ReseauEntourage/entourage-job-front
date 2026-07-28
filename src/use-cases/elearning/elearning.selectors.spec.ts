// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { ElearningUnit } from '@/src/features/backoffice/elearning/elearning.types';
import {
  selectElearningUnits,
  selectFetchElearningUnitsState,
  selectIsLoading,
} from './elearning.selectors';
import { RootState, slice } from './elearning.slice';

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

  describe('selectElearningUnits', () => {
    it('returns the elearning units list', () => {
      const units = [buildUnit()];

      expect(
        selectElearningUnits(buildState({ elearningUnits: units }))
      ).toEqual(units);
    });

    it('returns an empty array when there are no units', () => {
      expect(selectElearningUnits(buildState())).toEqual([]);
    });
  });

  describe('selectFetchElearningUnitsState', () => {
    it('returns the fetchElearningUnits request state', () => {
      const state = buildState({
        fetchElearningUnits: { status: 'SUCCEEDED' } as any,
      });

      expect(selectFetchElearningUnitsState(state)).toEqual({
        status: 'SUCCEEDED',
      });
    });
  });
});
