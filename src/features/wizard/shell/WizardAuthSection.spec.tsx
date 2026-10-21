jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

import { fireEvent, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { WizardAuthSection } from './WizardAuthSection';

describe('WizardAuthSection', () => {
  it('offers to log in when nobody is connected', () => {
    renderWithProviders(<WizardAuthSection />);

    const link = screen.getByText('Se connecter').closest('a');
    expect(link?.getAttribute('href')).toBe('/login');
  });

  it('greets the connected user and logs out from the menu', () => {
    const store = createTestStore({
      currentUser: {
        user: { id: 'u1', firstName: 'Ada', lastName: 'L', role: 'Candidat' },
      },
    } as any);
    const dispatch = jest.spyOn(store, 'dispatch');
    renderWithProviders(<WizardAuthSection />, { store });

    expect(screen.getByText('Bonjour Ada')).toBeTruthy();
    fireEvent.click(screen.getByText('Bonjour Ada'));
    fireEvent.click(screen.getByText(/Se déconnecter/));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: expect.stringContaining('logout') })
    );
  });
});
