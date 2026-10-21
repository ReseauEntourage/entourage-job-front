import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Api } from '@/src/api';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { EventParticipateButton } from './EventParticipateButton';

jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/api');

describe('EventParticipateButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('invites to participate when not registered', () => {
    renderWithProviders(
      <EventParticipateButton
        eventSalesForceId="sf-1"
        isParticipating={false}
      />
    );
    expect(screen.getByText("Participer à l'événement")).toBeInTheDocument();
  });

  it('offers to unregister when registered', () => {
    renderWithProviders(
      <EventParticipateButton eventSalesForceId="sf-1" isParticipating />
    );
    expect(screen.getByText('Se désinscrire')).toBeInTheDocument();
  });

  it('registers through the API and shows the pending label', async () => {
    let resolve: (value: unknown) => void = () => {};
    (Api.updateEventParticipation as jest.Mock).mockReturnValue(
      new Promise((r) => {
        resolve = r;
      })
    );
    renderWithProviders(
      <EventParticipateButton
        eventSalesForceId="sf-1"
        isParticipating={false}
      />
    );
    fireEvent.click(screen.getByText("Participer à l'événement"));
    expect(Api.updateEventParticipation).toHaveBeenCalledWith('sf-1', true);
    await waitFor(() =>
      expect(screen.getByText(/Inscription en cours/)).toBeInTheDocument()
    );
    resolve({});
  });

  it('unregisters through the API and shows the pending label', async () => {
    (Api.updateEventParticipation as jest.Mock).mockReturnValue(
      new Promise(() => {})
    );
    renderWithProviders(
      <EventParticipateButton eventSalesForceId="sf-1" isParticipating />
    );
    fireEvent.click(screen.getByText('Se désinscrire'));
    expect(Api.updateEventParticipation).toHaveBeenCalledWith('sf-1', false);
    await waitFor(() =>
      expect(screen.getByText(/Désinscription en cours/)).toBeInTheDocument()
    );
  });
});
