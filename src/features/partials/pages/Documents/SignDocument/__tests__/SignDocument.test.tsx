import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { ReduxRequestEvents } from '@/src/constants';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { currentUserActions } from '@/src/use-cases/current-user';
import { selectNotifications } from '@/src/use-cases/notifications';
import { SignDocument } from '../SignDocument';

const mockStatus = jest.fn();
jest.mock('@/src/use-cases/current-user', () => {
  const actual = jest.requireActual('@/src/use-cases/current-user');
  return {
    ...actual,
    readDocumentSelectors: {
      ...actual.readDocumentSelectors,
      // A new selector per access, so that useSelector re-runs it on re-render
      get selectReadDocumentStatus() {
        return () => mockStatus();
      },
    },
  };
});
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));

const renderSign = () => {
  const result = renderWithProviders(
    <SignDocument
      documentName={'CharteEthique' as never}
      label="J'accepte la charte"
    />
  );
  const dispatch = jest.spyOn(result.store, 'dispatch');
  const notifications = () =>
    selectNotifications(result.store.getState() as never);
  return { ...result, dispatch, notifications };
};

describe('SignDocument', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStatus.mockReturnValue(ReduxRequestEvents.IDLE);
  });

  it('asks to accept the document before validating', () => {
    const { dispatch, notifications } = renderSign();
    fireEvent.click(screen.getByRole('button', { name: 'Valider' }));
    expect(notifications()).toEqual([
      expect.objectContaining({
        type: 'danger',
        message: 'Veuillez accepter le document avant de valider',
      }),
    ]);
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: currentUserActions.readDocumentRequested.type,
      })
    );
  });

  it('signs the document once accepted', () => {
    const { dispatch, notifications } = renderSign();
    fireEvent.click(screen.getByLabelText("J'accepte la charte"));
    fireEvent.click(screen.getByRole('button', { name: 'Valider' }));
    expect(dispatch).toHaveBeenCalledWith(
      currentUserActions.readDocumentRequested({
        documentName: 'CharteEthique' as never,
      })
    );
    expect(notifications()).toEqual([]);
  });

  it('notifies a success once the document has been read', () => {
    mockStatus.mockReturnValue(ReduxRequestEvents.SUCCEEDED);
    const { notifications } = renderSign();
    expect(notifications()).toEqual([
      expect.objectContaining({
        type: 'success',
        message: 'Validation confirmée',
      }),
    ]);
  });

  it('notifies an error when reading the document failed', () => {
    mockStatus.mockReturnValue(ReduxRequestEvents.FAILED);
    const { notifications } = renderSign();
    expect(notifications()).toEqual([
      expect.objectContaining({
        type: 'danger',
        message: 'Une erreur est survenue',
      }),
    ]);
  });
});
