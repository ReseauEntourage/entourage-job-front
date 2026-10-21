import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { BusinessSector } from '@/src/api/types';
import { GA_TAGS } from '@/src/constants/tags';
import { UserRoles } from '@/src/constants/users';
import { gaEvent } from '@/src/lib/gtag';
import { CompanyCard, CompanyCardUser } from '../CompanyCard/CompanyCard';

jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));
jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));
jest.mock(
  '@/src/components/ui/Images/ImgProfile/ImgUserProfile/ImgUserProfile',
  () => ({
    ImgUserProfile: ({ user }: { user: { firstName: string } }) => (
      <span data-testid="collaborator">{user.firstName}</span>
    ),
  })
);

const users = (n: number) =>
  Array.from({ length: n }).map((_, i) => ({
    id: `u${i}`,
    firstName: `User${i}`,
    lastName: 'X',
    role: UserRoles.COACH,
    userProfile: { hasPicture: false },
  })) as unknown as CompanyCardUser[];

const sectors = (n: number) =>
  Array.from({ length: n }).map((_, i) => ({
    id: `s${i}`,
    name: `Secteur${i}`,
  })) as unknown as BusinessSector[];

describe('CompanyCard', () => {
  beforeEach(() => jest.clearAllMocks());

  it('links to the company and tracks the click', () => {
    render(<CompanyCard id="c1" name="Acme" businessSectors={[]} users={[]} />);
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toContain('c1');
    fireEvent.click(link);
    expect(gaEvent).toHaveBeenCalledWith(GA_TAGS.PAGE_ANNUAIRE_CARTE_CLIC);
  });

  it('shows the logo when there is one', () => {
    render(
      <CompanyCard
        id="c1"
        name="Acme"
        logoUrl="/logo.png"
        businessSectors={[]}
        users={[]}
      />
    );
    expect(screen.getByAltText('logo de Acme')).toBeInTheDocument();
  });

  it('shows a placeholder icon without logo', () => {
    render(<CompanyCard id="c1" name="Acme" businessSectors={[]} users={[]} />);
    expect(screen.getByLabelText('CompanyIcon Icon')).toBeInTheDocument();
    expect(screen.queryByText(/Secteur/)).not.toBeInTheDocument();
  });

  it('counts collaborators with the right plural', () => {
    const { rerender } = render(
      <CompanyCard id="c1" name="Acme" businessSectors={[]} users={[]} />
    );
    expect(screen.getByText('Aucun collaborateur')).toBeInTheDocument();
    rerender(
      <CompanyCard id="c1" name="Acme" businessSectors={[]} users={users(1)} />
    );
    expect(screen.getByText('1 collaborateur')).toBeInTheDocument();
    rerender(
      <CompanyCard id="c1" name="Acme" businessSectors={[]} users={users(5)} />
    );
    expect(screen.getByText('5 collaborateurs')).toBeInTheDocument();
    expect(screen.getAllByTestId('collaborator')).toHaveLength(3);
  });

  it('shows at most two sectors and counts the rest', () => {
    const { rerender } = render(
      <CompanyCard
        id="c1"
        name="Acme"
        businessSectors={sectors(1)}
        users={[]}
      />
    );
    expect(screen.getByText('Secteur')).toBeInTheDocument();
    rerender(
      <CompanyCard
        id="c1"
        name="Acme"
        businessSectors={sectors(4)}
        users={[]}
      />
    );
    expect(screen.getByText('Secteurs')).toBeInTheDocument();
    expect(screen.getByText('Secteur0')).toBeInTheDocument();
    expect(screen.queryByText('Secteur2')).not.toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });
});
