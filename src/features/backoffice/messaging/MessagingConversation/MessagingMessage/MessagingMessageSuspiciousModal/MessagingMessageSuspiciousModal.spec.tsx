jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { ModalContext } from '@/src/features/modals/Modal/ModalContext';
import { MessagingMessageSuspiciousModal } from './MessagingMessageSuspiciousModal';

describe('MessagingMessageSuspiciousModal', () => {
  const open = jest.fn();
  const originalOpen = window.open;
  const onClose = jest.fn();

  beforeEach(() => {
    window.open = open;
    jest.clearAllMocks();
  });
  afterEach(() => {
    window.open = originalOpen;
    cleanup();
  });

  const renderModal = (withClose = true) =>
    render(
      <ModalContext.Provider value={withClose ? { onClose } : {}}>
        <MessagingMessageSuspiciousModal href="https://evil.test" />
      </ModalContext.Provider>
    );

  it('warns the user that they are leaving the platform', () => {
    renderModal();
    expect(
      screen.getByText('Vous quittez le réseau Entourage Pro')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Vous êtes sur le point de visiter un site externe non vérifié/
      )
    ).toBeInTheDocument();
  });

  it('closes the modal without opening the link when staying', () => {
    renderModal();
    fireEvent.click(screen.getByText('Rester sur Entourage Pro'));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(open).not.toHaveBeenCalled();
  });

  it('closes the modal and opens the link in a new tab when proceeding', () => {
    renderModal();
    fireEvent.click(screen.getByText('Accéder au lien'));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(open).toHaveBeenCalledWith('https://evil.test', '_blank');
  });

  it('still opens the link when there is no close handler', () => {
    renderModal(false);
    fireEvent.click(screen.getByText('Accéder au lien'));
    expect(open).toHaveBeenCalledWith('https://evil.test', '_blank');
  });
});
