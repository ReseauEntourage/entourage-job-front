jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/features/modals/Modal', () => ({ openModal: jest.fn() }));
jest.mock('./MessagingFirstContactModal', () => ({
  MessagingFirstContactModal: ({ role }: any) => (
    <div data-testid="first-contact-modal">{role}</div>
  ),
}));

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { openModal } from '@/src/features/modals/Modal';
import { MessagingFirstContactBanner } from './MessagingFirstContactBanner';

describe('MessagingFirstContactBanner', () => {
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => cleanup());

  it('announces a new contact with a short hint', () => {
    render(<MessagingFirstContactBanner role={UserRoles.COACH} />);
    expect(
      screen.getByTestId('messaging-first-contact-banner')
    ).toBeInTheDocument();
    expect(screen.getByText('Nouveau contact')).toBeInTheDocument();
    expect(
      screen.getByText('Quelques conseils pour organiser le premier contact.')
    ).toBeInTheDocument();
  });

  it('opens the tips modal for the role of the user', () => {
    render(<MessagingFirstContactBanner role={UserRoles.CANDIDATE} />);
    fireEvent.click(screen.getByText('Voir les conseils'));
    expect(openModal).toHaveBeenCalledTimes(1);
    const modal = (openModal as jest.Mock).mock.calls[0][0];
    expect(modal.props.role).toBe(UserRoles.CANDIDATE);
  });
});
