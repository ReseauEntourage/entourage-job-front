import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { Member } from './Member';
import { MemberColumn } from './Member/Member.types';
import { MemberInfo } from './Member/MemberInfo';
import { MemberTable } from './MemberTable';

let mockDesktop = true;
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => (mockDesktop ? 1280 : 400),
  useWindowSize: () => [mockDesktop ? 1280 : 400, 800],
}));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));

const allColumns: MemberColumn[] = [
  'type',
  'phone',
  'gender',
  'organization',
  'zone',
  'countRefered',
  'lastConnection',
];

const member = (overrides: Record<string, unknown> = {}) =>
  ({
    id: 'm1',
    firstName: 'Awa',
    lastName: 'Diallo',
    email: 'awa@test.fr',
    role: UserRoles.COACH,
    gender: 1,
    phone: '0612345678',
    zone: 'PARIS',
    organization: { name: 'Asso' },
    referredCandidates: [{ id: 'c1' }, { id: 'c2' }],
    lastConnection: '2026-03-05T10:00:00.000Z',
    userProfile: { hasPicture: false },
    ...overrides,
  }) as any;

describe('MemberTable', () => {
  it('shows a header per column, named after the role', () => {
    renderWithProviders(
      <MemberTable columns={allColumns} members={[]} role={UserRoles.REFERER} />
    );

    [
      'Prescripteur',
      'Type',
      'Téléphone',
      'Genre',
      'Structure',
      'Zone',
      'Nb. candidats',
      'Dernière connexion',
    ].forEach((header) => expect(screen.getByText(header)).toBeInTheDocument());
  });

  [
    [UserRoles.CANDIDATE, 'Candidat'],
    [UserRoles.COACH, 'Coach'],
  ].forEach(([role, header]) => {
    it(`uses "${header}" as first header for ${role}`, () => {
      renderWithProviders(
        <MemberTable columns={[]} members={[]} role={role as UserRoles} />
      );

      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it('only shows the headers of the requested columns', () => {
    renderWithProviders(
      <MemberTable columns={['zone']} members={[]} role={UserRoles.COACH} />
    );

    expect(screen.getByText('Zone')).toBeInTheDocument();
    expect(screen.queryByText('Téléphone')).not.toBeInTheDocument();
  });

  it('renders the given rows in a member-list body', () => {
    renderWithProviders(
      <MemberTable
        columns={[]}
        members={[
          <tr key="a">
            <td>row-a</td>
          </tr>,
        ]}
        role={UserRoles.COACH}
      />
    );

    expect(screen.getByTestId('member-list')).toHaveTextContent('row-a');
  });
});

[true, false].forEach((desktop) => {
  describe(`Member row (${desktop ? 'desktop' : 'mobile'})`, () => {
    beforeEach(() => {
      mockDesktop = desktop;
      (useAuthenticatedUser as jest.Mock).mockReturnValue({
        role: UserRoles.ADMIN,
      });
    });

    const renderRow = (
      props: Record<string, unknown> = {},
      memberOverrides: Record<string, unknown> = {}
    ) => {
      const row = (
        <Member
          columns={allColumns}
          role={UserRoles.COACH}
          member={member(memberOverrides)}
          {...props}
        />
      );
      return renderWithProviders(
        desktop ? (
          <table>
            <tbody>{row}</tbody>
          </table>
        ) : (
          row
        )
      );
    };

    it('shows the identity, contact details, zone, referred count and last connection', () => {
      renderRow();

      expect(screen.getByText('Awa Diallo')).toBeInTheDocument();
      expect(screen.getByText('awa@test.fr')).toBeInTheDocument();
      expect(screen.getByText('0612345678')).toBeInTheDocument();
      expect(screen.getAllByText('Asso').length).toBeGreaterThan(0);
      expect(screen.getByText('Paris')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('05/03/2026')).toBeInTheDocument();
    });

    it('falls back on placeholders for missing data', () => {
      renderRow(
        {},
        {
          phone: null,
          zone: null,
          organization: null,
          referredCandidates: undefined,
          lastConnection: null,
        }
      );

      expect(screen.getAllByText('-')).toHaveLength(2);
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(
        screen.getByText(desktop ? 'Aucune connexion' : 'Aucune')
      ).toBeInTheDocument();
      // No zone: defaults to the "hors zone" label
      expect(screen.queryByText('Paris')).not.toBeInTheDocument();
    });

    it('only renders the requested columns', () => {
      renderRow({ columns: [] });

      expect(screen.queryByText('0612345678')).not.toBeInTheDocument();
      expect(screen.queryByText('Paris')).not.toBeInTheDocument();
    });

    it('links the name to the admin member page for an admin', () => {
      renderRow();

      expect(screen.getByText('Awa Diallo').closest('a[href]')).toHaveAttribute(
        'href',
        '/backoffice/admin/membres/m1'
      );
    });

    it('links the name to the candidate CV page for a non-admin viewer', () => {
      (useAuthenticatedUser as jest.Mock).mockReturnValue({
        role: UserRoles.REFERER,
      });
      renderRow();

      expect(screen.getByText('Awa Diallo').closest('a[href]')).toHaveAttribute(
        'href',
        '/backoffice/candidat/m1/cv'
      );
    });

    it('renders the name without link when links are disabled', () => {
      renderRow({ disableLink: true });

      expect(screen.getByText('Awa Diallo').closest('a')).toBeNull();
    });

    it('shows the organization next to the name of members of a role with organization when the column is hidden', () => {
      renderRow(
        { columns: [] },
        { role: UserRoles.REFERER, organization: { name: 'Asso' } }
      );

      expect(screen.getByText(/Asso/)).toBeInTheDocument();
    });
  });
});

describe('MemberInfo', () => {
  beforeEach(() => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      role: UserRoles.ADMIN,
    });
  });

  it('omits the email and organization when not provided', () => {
    renderWithProviders(
      <MemberInfo id="1" firstName="A" lastName="B" email="" disableLink />
    );

    expect(screen.getByText('A B')).toBeInTheDocument();
    expect(screen.queryByText(/-/)).not.toBeInTheDocument();
  });

  it('renders children next to the name', () => {
    renderWithProviders(
      <MemberInfo id="1" firstName="A" lastName="B" email="e@x.fr" disableLink>
        <span>avatar</span>
      </MemberInfo>
    );

    expect(screen.getByText('avatar')).toBeInTheDocument();
  });
});
