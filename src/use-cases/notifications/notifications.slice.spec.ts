// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { slice } from './notifications.slice';

const { actions, reducer } = slice;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe('notifications slice', () => {
  it('starts with an empty notifications list', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual({
      notifications: [],
    });
  });

  describe('addNotification', () => {
    it('adds a notification with a generated id', () => {
      const state = reducer(
        undefined,
        actions.addNotification({ type: 'success', message: 'Saved' })
      );

      expect(state.notifications).toHaveLength(1);
      expect(state.notifications[0]).toMatchObject({
        type: 'success',
        message: 'Saved',
      });
      expect(state.notifications[0].id).toMatch(UUID_REGEX);
    });

    it('accumulates multiple notifications, each with its own id', () => {
      let state = reducer(
        undefined,
        actions.addNotification({ type: 'success', message: 'First' })
      );
      state = reducer(
        state,
        actions.addNotification({ type: 'danger', message: 'Second' })
      );

      expect(state.notifications).toHaveLength(2);
      expect(state.notifications[0]).toMatchObject({ message: 'First' });
      expect(state.notifications[1]).toMatchObject({ message: 'Second' });
      expect(state.notifications[0].id).not.toBe(state.notifications[1].id);
    });
  });

  describe('removeNotification', () => {
    it('removes the notification matching the given id', () => {
      let state = reducer(
        undefined,
        actions.addNotification({ type: 'success', message: 'First' })
      );
      state = reducer(
        state,
        actions.addNotification({ type: 'danger', message: 'Second' })
      );
      const [first, second] = state.notifications;

      state = reducer(state, actions.removeNotification({ id: first.id }));

      expect(state.notifications).toEqual([second]);
    });

    it('is a no-op when no notification matches the given id', () => {
      const state = reducer(
        undefined,
        actions.addNotification({ type: 'success', message: 'First' })
      );

      const nextState = reducer(
        state,
        actions.removeNotification({ id: 'unknown-id' })
      );

      expect(nextState.notifications).toEqual(state.notifications);
    });
  });
});
