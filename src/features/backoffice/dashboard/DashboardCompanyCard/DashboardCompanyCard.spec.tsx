import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { DashboardCompanyCard } from './DashboardCompanyCard';

jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

const company = {
  id: 'company-1',
  name: 'Acme',
  logoUrl: null,
  admin: { firstName: 'Jeanne', lastName: 'durand' },
  companyUser: { isAdmin: false },
};

describe('DashboardCompanyCard', () => {
  it('shows the company name, its referent initial and a link to the public page for a regular member', () => {
    renderWithProviders(<DashboardCompanyCard company={company} />);
    expect(screen.getByText('Mon entreprise')).toBeInTheDocument();
    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(screen.getByText('Référent : Jeanne D')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Voir ma page entreprise' })
    ).toHaveAttribute('href', '/backoffice/companies/company-1');
    expect(screen.queryByText('Modifier ma page entreprise')).toBeNull();
  });

  it('tells the admin they are the referent and links to the settings', () => {
    renderWithProviders(
      <DashboardCompanyCard
        company={{ ...company, companyUser: { isAdmin: true } }}
      />
    );
    expect(screen.getByText('Vous êtes le référent')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Modifier ma page entreprise' })
    ).toHaveAttribute('href', '/backoffice/companies/parametres');
    expect(screen.queryByText('Voir ma page entreprise')).toBeNull();
  });

  it('omits the referent line without admin', () => {
    renderWithProviders(
      <DashboardCompanyCard company={{ ...company, admin: null }} />
    );
    expect(screen.queryByText(/Référent/)).toBeNull();
    expect(screen.queryByText(/Vous êtes le référent/)).toBeNull();
  });
});
