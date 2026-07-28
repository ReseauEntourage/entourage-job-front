// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { selectNotifications } from './notifications.selectors';
import { RootState, slice } from './notifications.slice';

const buildState = (
  overrides: Partial<ReturnType<typeof slice.getInitialState>> = {}
): RootState =>
  ({
    notifications: { ...slice.getInitialState(), ...overrides },
  }) as RootState;

describe('notifications.selectors', () => {
  describe('selectNotifications', () => {
    it('returns an empty list by default', () => {
      expect(selectNotifications(buildState())).toEqual([]);
    });

    it('returns the notifications list', () => {
      const notifications = [
        { id: 'notif-1', type: 'success' as const, message: 'Saved' },
      ];

      expect(selectNotifications(buildState({ notifications }))).toEqual(
        notifications
      );
    });
  });
});
