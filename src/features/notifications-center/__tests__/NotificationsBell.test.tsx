import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { NotificationItem } from '@/src/api/types';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { NotificationsBell } from '../NotificationsBell';
import {
  formatUnseenBadge,
  getBellLabel,
  getNotificationHref,
} from '../notifications-center.utils';

const mockMarkSeen = jest.fn();
const mockUseNotifications = jest.fn();

jest.mock('@/src/use-cases/notifications-center', () => ({
  ...jest.requireActual('@/src/use-cases/notifications-center'),
  useGetNotificationsInfiniteQuery: () => mockUseNotifications(),
  useMarkNotificationsSeenMutation: () => [mockMarkSeen],
}));

const buildNotification = (
  props: Partial<NotificationItem> = {}
): NotificationItem => ({
  id: 'notification-1',
  type: 'HELP_GROUP_REPLY',
  label: 'Amina et Thomas vous ont répondu',
  excerpt: 'Parle de ton bénévolat.',
  context: { groupName: 'Refaire un CV', discussionTitle: 'Trou dans le CV' },
  lastEventAt: '2026-10-05T09:00:00.000Z',
  seen: false,
  destination: {
    slug: 'refaire-un-cv',
    discussionId: 'discussion-1',
    replyId: 'reply-1',
  },
  ...props,
});

const listResult = (items: NotificationItem[], hasNextPage = false) => ({
  data: { pages: [{ items, nextCursor: hasNextPage ? 'next' : null }] },
  isLoading: false,
  isError: false,
  hasNextPage,
  isFetchingNextPage: false,
  fetchNextPage: jest.fn(),
});

const renderBell = (unseenCount: number) =>
  renderWithProviders(
    <NotificationsBell
      variant="desktop"
      color="black"
      unseenCount={unseenCount}
    />
  );

const openBell = () =>
  fireEvent.click(screen.getByTestId('notifications-bell-button'));

describe('NotificationsBell', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNotifications.mockReturnValue(listResult([buildNotification()]));
  });

  it('shows the number of unseen notifications', () => {
    renderBell(2);
    expect(screen.getByTestId('notifications-badge')).toHaveTextContent('2');
  });

  it('caps the badge at « 9+ »', () => {
    renderBell(12);
    expect(screen.getByTestId('notifications-badge')).toHaveTextContent('9+');
    expect(formatUnseenBadge(9)).toBe('9');
    expect(formatUnseenBadge(10)).toBe('9+');
  });

  it('names the bell for screen readers with the unseen count, on desktop and mobile', () => {
    const { unmount } = renderBell(2);
    expect(
      screen.getByRole('button', { name: 'Notifications, 2 non vues' })
    ).toBeInTheDocument();
    unmount();
    renderWithProviders(
      <NotificationsBell variant="mobile" color="white" unseenCount={1} />
    );
    expect(
      screen.getByRole('button', { name: 'Notifications, 1 non vue' })
    ).toBeInTheDocument();
    expect(getBellLabel(12)).toBe('Notifications, 9+ non vues');
    expect(getBellLabel(0)).toBe('Notifications');
  });

  it('shows no badge once everything is seen', () => {
    renderBell(0);
    expect(screen.queryByTestId('notifications-badge')).not.toBeInTheDocument();
  });

  it('lists the notifications in first names, never with a number, the unseen ones signaled', () => {
    mockUseNotifications.mockReturnValue(
      listResult([
        buildNotification(),
        buildNotification({
          id: 'notification-2',
          type: 'HELP_GROUP_REACTION',
          label: 'Sofia soutient votre message',
          excerpt: null,
          seen: true,
        }),
      ])
    );
    renderBell(1);
    openBell();
    const items = screen.getAllByTestId('notification-item');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Amina et Thomas vous ont répondu');
    expect(items[0]).toHaveTextContent('Refaire un CV');
    expect(items[0]).toHaveAttribute('data-seen', 'false');
    expect(items[0]).toHaveTextContent('Nouveau');
    expect(items[1]).toHaveAttribute('data-seen', 'true');
    expect(items[1]).not.toHaveTextContent('Nouveau');
    items.forEach((item) => {
      expect(item.textContent.replace(/\d{4}|\d{1,2} \w+/g, '')).not.toMatch(
        /\d/
      );
    });
  });

  it('leads to the discussion, positioned on the announced reply', () => {
    renderBell(1);
    openBell();
    expect(
      screen.getByTestId('notification-item').querySelector('a')
    ).toHaveAttribute(
      'href',
      '/backoffice/groupes/refaire-un-cv/discussions/discussion-1?replyId=reply-1'
    );
    expect(
      getNotificationHref(
        buildNotification({
          destination: {
            slug: 'refaire-un-cv',
            discussionId: 'discussion-1',
            replyId: null,
          },
        })
      )
    ).toBe('/backoffice/groupes/refaire-un-cv/discussions/discussion-1');
  });

  it('shows a neutral message when there is no notification', () => {
    mockUseNotifications.mockReturnValue(listResult([]));
    renderBell(0);
    openBell();
    const empty = screen.getByTestId('notifications-empty');
    expect(empty).not.toHaveTextContent('0');
    expect(empty).not.toHaveTextContent(/aucune/i);
  });

  it('loads the next page on demand', () => {
    const result = listResult([buildNotification()], true);
    mockUseNotifications.mockReturnValue(result);
    renderBell(1);
    openBell();
    fireEvent.click(screen.getByText('Voir plus'));
    expect(result.fetchNextPage).toHaveBeenCalled();
  });

  it('marks nothing as seen when the list is opened and closed', () => {
    renderBell(1);
    openBell();
    expect(screen.getByTestId('notifications-panel')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('notifications-panel')).not.toBeInTheDocument();
    expect(mockMarkSeen).not.toHaveBeenCalled();
  });

  it('links to the full screen page on mobile', () => {
    renderWithProviders(
      <NotificationsBell variant="mobile" color="white" unseenCount={1} />
    );
    expect(
      screen.getByTestId('notifications-bell-button').closest('a') ??
        screen.getByTestId('notifications-bell-button')
    ).toHaveAttribute('href', '/backoffice/notifications');
  });
});
