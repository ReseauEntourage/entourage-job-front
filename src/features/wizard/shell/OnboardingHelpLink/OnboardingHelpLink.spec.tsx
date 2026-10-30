const mockProfile = jest.fn();
const mockStaffContact = jest.fn();
jest.mock('@/src/hooks/current-user/useCurrentUserProfile', () => ({
  useCurrentUserProfile: () => mockProfile(),
}));
jest.mock('@/src/hooks/useCurrentUserStaffContact', () => ({
  useCurrentUserStaffContact: () => mockStaffContact(),
}));
jest.mock('@/src/components/ui', () => ({
  SimpleLink: ({ href, children }: any) => <a href={href}>{children}</a>,
}));
jest.mock('@/src/components/ui/Icons/LucidIcon', () => ({
  LucidIcon: () => <span />,
}));

import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { OnboardingHelpLink } from './OnboardingHelpLink';

describe('OnboardingHelpLink', () => {
  beforeEach(() => {
    mockProfile.mockReturnValue({ department: 'Nord (59)' });
    mockStaffContact.mockReturnValue({
      name: 'Camille Martin',
      email: 'camille.martin@example.org',
      img: '/static/img/camille.jpg',
    });
  });

  it('links to an email addressed to the referent, without a subject', () => {
    render(<OnboardingHelpLink />);

    expect(
      screen.getByText("Besoin d'aide ?").closest('a')?.getAttribute('href')
    ).toBe('mailto:camille.martin@example.org');
  });

  it('renders nothing when no contact is available', () => {
    mockStaffContact.mockReturnValue(null);

    render(<OnboardingHelpLink />);

    expect(screen.queryByTestId('onboarding-help-link')).toBeNull();
  });
});
