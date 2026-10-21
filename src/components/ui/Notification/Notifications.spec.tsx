import '@testing-library/jest-dom';
import { act, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import {
  notificationsActions,
  selectNotifications,
} from '@/src/use-cases/notifications';
import { NotificationWrapper } from './NotificationWrapper';
import { NotificationsContainer } from './NotificationsContainer';

describe('NotificationsContainer', () => {
  it('renders nothing without notification', () => {
    const { container } = renderWithProviders(<NotificationsContainer />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders every pending notification', () => {
    const store = createTestStore();
    store.dispatch(
      notificationsActions.addNotification({
        type: 'success',
        message: 'Bien enregistré',
      })
    );
    store.dispatch(
      notificationsActions.addNotification({
        type: 'danger',
        message: 'Erreur survenue',
      })
    );
    renderWithProviders(<NotificationsContainer />, { store });

    expect(screen.getByText('Bien enregistré')).toBeInTheDocument();
    expect(screen.getByText('Erreur survenue')).toBeInTheDocument();
  });
});

describe('NotificationWrapper', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows its message, then removes the notification from the store after about ten seconds', async () => {
    const store = createTestStore();
    store.dispatch(
      notificationsActions.addNotification({
        type: 'success',
        message: 'Hello',
      })
    );
    const { id } = selectNotifications(store.getState())[0];
    renderWithProviders(
      <NotificationWrapper id={id} type="success" message="Hello" />,
      {
        store,
      }
    );

    expect(screen.getByText('Hello')).toBeInTheDocument();
    await act(async () => {
      await jest.advanceTimersByTimeAsync(5000);
    });
    expect(selectNotifications(store.getState())).toHaveLength(1);

    await act(async () => {
      await jest.advanceTimersByTimeAsync(6000);
    });
    expect(selectNotifications(store.getState())).toHaveLength(0);
  });
});
