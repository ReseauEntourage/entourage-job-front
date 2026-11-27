import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { gaEvent } from '@/src/lib/gtag';
import {
  useDismissDonationBlockMutation,
  useGetDonationBlockQuery,
} from '@/src/use-cases/donation-block';
import { DashboardDonationBlock } from './DashboardDonationBlock';
import { DONATION_URL } from './DashboardDonationBlock.constants';

jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('@/src/use-cases/donation-block', () => ({
  useGetDonationBlockQuery: jest.fn(),
  useDismissDonationBlockMutation: jest.fn(),
}));
jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));

const dismissDonationBlock = jest.fn();

const setup = (data: { visible: boolean } | undefined) => {
  (useAuthenticatedUser as jest.Mock).mockReturnValue({
    id: 'user-id',
    email: 'user@example.com',
    role: UserRoles.COACH,
  });
  (useGetDonationBlockQuery as jest.Mock).mockReturnValue({ data });
  (useDismissDonationBlockMutation as jest.Mock).mockReturnValue([
    dismissDonationBlock,
  ]);
  return render(<DashboardDonationBlock />);
};

describe('DashboardDonationBlock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  [
    ['while the visibility is unknown', undefined],
    ['when the user must not see it', { visible: false }],
  ].forEach(([label, data]) => {
    it(`renders nothing ${label as string}`, () => {
      const { container } = setup(data as { visible: boolean } | undefined);
      expect(container).toBeEmptyDOMElement();
    });
  });

  it('shows the title, the text and the donation button', () => {
    setup({ visible: true });
    expect(screen.getByText('Entourage vit grâce à vous')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Entourage est une association financée par la générosité du public. Vous pouvez nous soutenir en faisant un don.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Faire un don/ })
    ).toBeInTheDocument();
  });

  it('opens the donation page in a new tab, announced to screen readers, without personal data', () => {
    setup({ visible: true });
    const link = screen.getByRole('link', {
      name: /Faire un don.*s'ouvre dans un nouvel onglet/,
    });
    expect(link).toHaveAttribute('href', DONATION_URL);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    const href = link.getAttribute('href') as string;
    expect(href).not.toContain('user-id');
    expect(href).not.toContain('user@example.com');
    const params = new URL(href).searchParams;
    expect(params.get('utm_source')).toBe('interne');
    expect(params.get('utm_campaign')).toBe('ep-don');
  });

  it('counts a click on the donation button for the role of the user, without any identifier', () => {
    setup({ visible: true });
    fireEvent.click(screen.getByRole('button', { name: /Faire un don/ }));
    expect(gaEvent).toHaveBeenCalledTimes(1);
    expect(gaEvent).toHaveBeenCalledWith({
      action: 'Backoffice_Dashboard_Donation_Block_Clic',
      label: UserRoles.COACH,
    });
    expect(dismissDonationBlock).not.toHaveBeenCalled();
  });

  it('closes the block for good from the cross, and counts it for the role', () => {
    setup({ visible: true });
    fireEvent.click(
      screen.getByRole('button', { name: 'Ne plus afficher ce message' })
    );
    expect(dismissDonationBlock).toHaveBeenCalledTimes(1);
    expect(gaEvent).toHaveBeenCalledWith({
      action: 'Backoffice_Dashboard_Donation_Block_Fermer',
      label: UserRoles.COACH,
    });
  });

  it('offers a cross reachable by keyboard and named for screen readers', () => {
    setup({ visible: true });
    const cross = screen.getByRole('button', {
      name: 'Ne plus afficher ce message',
    });
    expect(cross).not.toHaveAttribute('tabindex', '-1');
    expect(cross).not.toBeDisabled();
  });
});
