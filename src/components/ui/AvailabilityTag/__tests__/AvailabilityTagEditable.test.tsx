import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { User } from '@/src/api/types';
import { openModal } from '@/src/features/modals/Modal';
import { AvailabilityTagEditable } from '../AvailabilityTagEditable';

const mockUpdateUserProfile = jest.fn();
jest.mock('@/src/hooks/useUpdateProfile', () => ({
  useUpdateProfile: () => ({ updateUserProfile: mockUpdateUserProfile }),
}));
jest.mock('@/src/features/modals/Modal', () => ({ openModal: jest.fn() }));
jest.mock('@/src/features/modals/FeedbackModal/FeedbackModal', () => ({
  FeedbackModal: () => null,
}));
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));

const user = { id: 'u1' } as User;
const hover = () =>
  fireEvent.mouseEnter(screen.getByText(/Disponible|Indisponible/));

describe('AvailabilityTagEditable', () => {
  beforeEach(() => jest.clearAllMocks());

  it('offers to become unavailable and opens the feedback modal', () => {
    render(<AvailabilityTagEditable isAvailable user={user} />);
    hover();
    expect(
      screen.getByText('Vous souhaitez vous rendre indisponible ?')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('Devenir indisponible'));
    expect(openModal).toHaveBeenCalledTimes(1);
    expect(mockUpdateUserProfile).not.toHaveBeenCalled();
  });

  it('offers to become available again and updates the profile', () => {
    render(<AvailabilityTagEditable isAvailable={false} user={user} />);
    hover();
    expect(
      screen.getByText('Vous êtes de nouveau disponible ?')
    ).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByText('Devenir disponible'));
    });
    expect(mockUpdateUserProfile).toHaveBeenCalledWith({
      unavailableAt: null,
      unavailabilityReason: null,
    });
    expect(openModal).not.toHaveBeenCalled();
  });
});
