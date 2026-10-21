import { act, renderHook, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { Api } from '@/src/api';
import { UserRoles } from '@/src/constants/users';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { ElearningUnit } from './elearning.types';
import { useElearning } from './useElearning';

jest.mock('@/src/api');
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: () => ({ role: 'Candidat' }),
}));

const buildUnit = (id: string, completed: boolean): ElearningUnit =>
  ({
    id,
    title: `Unit ${id}`,
    questions: [],
    roles: [],
    userCompletions: completed
      ? [{ id: `c-${id}`, userId: 'u', unitId: id, validatedAt: '2026-01-01' }]
      : [],
  }) as unknown as ElearningUnit;

const setup = (units: ElearningUnit[]) => {
  (Api.getAllElearningUnits as jest.Mock).mockResolvedValue({ data: units });
  const store = createTestStore();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return renderHook(() => useElearning(), { wrapper });
};

describe('useElearning', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('requests the units of the user role', async () => {
    const { result } = setup([]);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(Api.getAllElearningUnits).toHaveBeenCalledWith({
      limit: 10,
      offset: 0,
      role: UserRoles.CANDIDATE,
    });
  });

  it('has no progress without units', async () => {
    const { result } = setup([]);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.completionRate).toBe(0);
    expect(result.current.hasCompleteAllUnits).toBe(false);
    expect(result.current.nbUnitsTotal).toBe(0);
  });

  it('computes the rounded completion rate', async () => {
    const { result } = setup([
      buildUnit('1', true),
      buildUnit('2', false),
      buildUnit('3', false),
    ]);
    await waitFor(() => expect(result.current.nbUnitsTotal).toBe(3));
    expect(result.current.nbUnitsCompleted).toBe(1);
    expect(result.current.completionRate).toBe(33);
    expect(result.current.hasCompleteAllUnits).toBe(false);
  });

  it('knows when every unit is completed', async () => {
    const { result } = setup([buildUnit('1', true), buildUnit('2', true)]);
    await waitFor(() => expect(result.current.nbUnitsTotal).toBe(2));
    expect(result.current.completionRate).toBe(100);
    expect(result.current.hasCompleteAllUnits).toBe(true);
  });

  it('records a completion and updates the cached unit', async () => {
    (Api.postElearningCompletion as jest.Mock).mockResolvedValue({
      data: { id: 'c-2', userId: 'u', unitId: '2', validatedAt: '2026-02-01' },
    });
    const { result } = setup([buildUnit('1', true), buildUnit('2', false)]);
    await waitFor(() => expect(result.current.nbUnitsTotal).toBe(2));
    act(() => result.current.completeUnit('2'));
    await waitFor(() => expect(result.current.hasCompleteAllUnits).toBe(true));
    expect(Api.postElearningCompletion).toHaveBeenCalledWith('2');
    expect(result.current.completionRate).toBe(100);
  });
});
