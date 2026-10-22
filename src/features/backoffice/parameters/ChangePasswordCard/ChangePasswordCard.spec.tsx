import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Api } from '@/src/api';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { selectNotifications } from '@/src/use-cases/notifications';
import { ChangePasswordCard } from './ChangePasswordCard';

jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
const mockSetError = jest.fn();
jest.mock('@/src/features/forms/FormWithValidation', () => ({
  FormWithValidation: ({ onSubmit }: any) => (
    <button
      onClick={() =>
        onSubmit({ newPassword: 'new', oldPassword: 'old' }, mockSetError)
      }
    >
      Modifier
    </button>
  ),
}));

describe('ChangePasswordCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('changes the password, notifies success and clears the form error', async () => {
    (Api.putUserChangePwd as jest.Mock).mockResolvedValue({});
    const { store } = renderWithProviders(<ChangePasswordCard />);

    fireEvent.click(screen.getByText('Modifier'));

    await waitFor(() =>
      expect(selectNotifications(store.getState())).toEqual([
        expect.objectContaining({
          type: 'success',
          message: 'Nouveau mot de passe enregistré',
        }),
      ])
    );
    expect(Api.putUserChangePwd).toHaveBeenCalledWith({
      newPassword: 'new',
      oldPassword: 'old',
    });
    expect(mockSetError).toHaveBeenCalledWith('');
  });

  it('shows an error on the form when the old password is rejected', async () => {
    (Api.putUserChangePwd as jest.Mock).mockRejectedValue(new Error('401'));
    const { store } = renderWithProviders(<ChangePasswordCard />);

    fireEvent.click(screen.getByText('Modifier'));

    await waitFor(() =>
      expect(mockSetError).toHaveBeenCalledWith(
        "L'ancien mot de passe n'est pas valide"
      )
    );
    expect(selectNotifications(store.getState())).toEqual([]);
  });
});
