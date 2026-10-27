const mockProfile = jest.fn();
const mockStaffContact = jest.fn();
jest.mock('@/src/hooks/current-user/useCurrentUserProfile', () => ({
  useCurrentUserProfile: () => mockProfile(),
}));
jest.mock('@/src/hooks/useCurrentUserStaffContact', () => ({
  useCurrentUserStaffContact: () => mockStaffContact(),
}));
jest.mock('@/src/components/ui', () => ({
  LegacyImg: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} />,
  SimpleLink: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { ADMIN_ZONES, DEPARTMENTS } from '@/src/constants/departements';
import { OnboardingReferentContact } from './OnboardingReferentContact';

const contact = {
  name: 'Camille Martin',
  email: 'camille.martin@example.org',
  img: '/static/img/camille.jpg',
};

describe('OnboardingReferentContact', () => {
  beforeEach(() => {
    mockProfile.mockReturnValue({ department: 'Nord (59)' });
    mockStaffContact.mockReturnValue(contact);
  });

  it('shows the help message, the referent, the role with its zone and a mailto link', () => {
    render(<OnboardingReferentContact />);

    expect(screen.getByText("Une question ? Besoin d'aide ?")).toBeTruthy();
    expect(screen.getByText('Camille Martin')).toBeTruthy();
    expect(
      screen.getByText(/Référent\(e\) Entourage Pro Hauts-de-France/)
    ).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Camille Martin' })).toBeTruthy();
    expect(
      screen.getByText(contact.email).closest('a')?.getAttribute('href')
    ).toBe(`mailto:${contact.email}`);
  });

  it('displays "National" for a person outside the covered zones', () => {
    const outOfZone = DEPARTMENTS.find((dept) => dept.zone === ADMIN_ZONES.HZ);
    mockProfile.mockReturnValue({ department: outOfZone?.name });

    render(<OnboardingReferentContact />);

    expect(
      screen.getByText(/Référent\(e\) Entourage Pro National/)
    ).toBeTruthy();
  });

  it('renders nothing while the contact is not loaded', () => {
    mockStaffContact.mockReturnValue(null);

    render(<OnboardingReferentContact />);

    expect(screen.queryByTestId('onboarding-referent-contact')).toBeNull();
  });

  it('renders nothing while the profile (zone) is not loaded', () => {
    mockProfile.mockReturnValue(null);

    render(<OnboardingReferentContact />);

    expect(screen.queryByTestId('onboarding-referent-contact')).toBeNull();
  });
});
