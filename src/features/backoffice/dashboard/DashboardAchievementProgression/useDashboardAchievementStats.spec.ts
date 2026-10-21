import { renderHook, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { Api } from '@/src/api';
import { useDashboardAchievementStats } from './useDashboardAchievementStats';

jest.mock('@/src/api');

describe('useDashboardAchievementStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('starts loading with null stats', () => {
    (Api.getCurrentStats as jest.Mock).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useDashboardAchievementStats());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.stats).toEqual({
      responseRate: null,
      totalConversationWithMirrorRoleCount: null,
    });
  });

  it('exposes only the achievement stats once loaded', async () => {
    (Api.getCurrentStats as jest.Mock).mockResolvedValue({
      data: {
        responseRate: 80,
        totalConversationWithMirrorRoleCount: 12,
        somethingElse: 'ignored',
      },
    });
    const { result } = renderHook(() => useDashboardAchievementStats());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.stats).toEqual({
      responseRate: 80,
      totalConversationWithMirrorRoleCount: 12,
    });
    expect(Api.getCurrentStats).toHaveBeenCalledTimes(1);
  });
});
