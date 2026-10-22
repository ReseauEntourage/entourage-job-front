import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useGetNotificationsUnseenCountQuery } from '@/src/use-cases/notifications-center';
import { useGetAdminReportsPendingCountQuery } from '@/src/use-cases/reports';
import { useNotifBadges } from './useNotifBadges';

jest.mock('react-redux', () => ({
  useSelector: (selector: (s: unknown) => unknown) => selector({}),
}));
jest.mock('@/src/use-cases/messaging', () => ({
  selectUnseenConversationCount: () => 4,
}));
jest.mock('@/src/use-cases/notifications-center', () => ({
  useGetNotificationsUnseenCountQuery: jest.fn(),
}));
jest.mock('@/src/use-cases/reports', () => ({
  useGetAdminReportsPendingCountQuery: jest.fn(),
}));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));

const mockNotifications = useGetNotificationsUnseenCountQuery as jest.Mock;
const mockReports = useGetAdminReportsPendingCountQuery as jest.Mock;
const mockUser = useAuthenticatedUser as jest.Mock;

describe('useNotifBadges', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNotifications.mockReturnValue({ data: 7 });
    mockReports.mockReturnValue({ data: 2 });
  });

  it('combines unseen conversations, notifications and pending reports', () => {
    mockUser.mockReturnValue({ role: UserRoles.ADMIN, zone: 'PARIS' });
    const { result } = renderHook(() => useNotifBadges());

    expect(result.current).toEqual({
      messaging: 4,
      notifications: 7,
      reports: 2,
    });
    expect(mockReports).toHaveBeenCalledWith('PARIS', { skip: false });
    expect(mockNotifications).toHaveBeenCalledWith(undefined, { skip: false });
  });

  it('queries the reports of every zone for an admin without zone', () => {
    mockUser.mockReturnValue({ role: UserRoles.ADMIN });
    renderHook(() => useNotifBadges());
    expect(mockReports).toHaveBeenCalledWith(null, { skip: false });
  });

  it('skips the reports query for non admins', () => {
    mockUser.mockReturnValue({ role: UserRoles.COACH });
    renderHook(() => useNotifBadges());
    expect(mockReports).toHaveBeenCalledWith(null, { skip: true });
  });

  it('defaults the counts to 0 while queries have no data', () => {
    mockUser.mockReturnValue({ role: UserRoles.COACH });
    mockNotifications.mockReturnValue({});
    mockReports.mockReturnValue({});
    const { result } = renderHook(() => useNotifBadges());
    expect(result.current).toEqual({
      messaging: 4,
      notifications: 0,
      reports: 0,
    });
  });

  it('updates the badges when a count changes', () => {
    mockUser.mockReturnValue({ role: UserRoles.COACH });
    const { result, rerender } = renderHook(() => useNotifBadges());
    mockNotifications.mockReturnValue({ data: 9 });
    rerender();
    expect(result.current.notifications).toBe(9);
  });
});
