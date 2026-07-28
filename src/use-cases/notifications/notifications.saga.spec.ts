jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { notificationsActions } from '.';

describe('notifications saga', () => {
  it('is a no-op passthrough: it never dispatches or mutates state on its own', async () => {
    const store = createTestStore();

    await flushPromises();

    expect(store.getState().notifications.notifications).toEqual([]);
  });

  it('does not interfere with the notifications reducer handling actions directly', async () => {
    const store = createTestStore();

    store.dispatch(
      notificationsActions.addNotification({
        type: 'success',
        message: 'Saved',
      })
    );
    await flushPromises();

    expect(store.getState().notifications.notifications).toHaveLength(1);
  });
});
