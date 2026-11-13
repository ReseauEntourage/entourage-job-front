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
import { ToastNotification, TOAST_DURATION_MS } from './ToastNotification';

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

describe('toasts', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders a toast apart from the side notifications', () => {
    const store = createTestStore();
    store.dispatch(
      notificationsActions.addNotification({
        type: 'danger',
        variant: 'toast',
        message: 'Le fichier doit être une image',
      })
    );
    store.dispatch(
      notificationsActions.addNotification({
        type: 'success',
        message: 'Bien enregistré',
      })
    );
    renderWithProviders(<NotificationsContainer />, { store });

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Le fichier doit être une image'
    );
    expect(screen.getByText('Bien enregistré')).toBeInTheDocument();
  });

  it('removes the toast from the store after five seconds', async () => {
    const store = createTestStore();
    store.dispatch(
      notificationsActions.addNotification({
        type: 'danger',
        variant: 'toast',
        message: 'Oops',
      })
    );
    const { id } = selectNotifications(store.getState())[0];
    renderWithProviders(
      <ToastNotification id={id} type="danger" message="Oops" />,
      { store }
    );

    await act(async () => {
      await jest.advanceTimersByTimeAsync(TOAST_DURATION_MS - 500);
    });
    expect(selectNotifications(store.getState())).toHaveLength(1);

    await act(async () => {
      await jest.advanceTimersByTimeAsync(1000);
    });
    expect(selectNotifications(store.getState())).toHaveLength(0);
  });

  it('removes the toast on a click', async () => {
    const store = createTestStore();
    store.dispatch(
      notificationsActions.addNotification({
        type: 'danger',
        variant: 'toast',
        message: 'Oops',
      })
    );
    const { id } = selectNotifications(store.getState())[0];
    renderWithProviders(
      <ToastNotification id={id} type="danger" message="Oops" />,
      { store }
    );

    await act(async () => {
      screen.getByRole('alert').click();
      await jest.advanceTimersByTimeAsync(300);
    });
    expect(selectNotifications(store.getState())).toHaveLength(0);
  });
});
