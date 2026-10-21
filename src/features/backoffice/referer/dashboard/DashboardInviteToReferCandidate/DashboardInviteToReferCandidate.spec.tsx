import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { DashboardInviteToReferCandidate } from './DashboardInviteToReferCandidate';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

describe('DashboardInviteToReferCandidate', () => {
  it('starts the refering flow at its first step', () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
    render(<DashboardInviteToReferCandidate />);
    expect(screen.getByText('Pré-inscrivez des candidats')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('dashboard-invite-to-refer-btn'));
    expect(push).toHaveBeenCalledWith('/backoffice/referer/orienter/step-1');
  });
});
