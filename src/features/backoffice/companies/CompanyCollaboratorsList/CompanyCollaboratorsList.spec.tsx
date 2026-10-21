import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { openModal } from '../../../modals/Modal';
import { CompanyCollaboratorsList } from './CompanyCollaboratorsList';

let mockItems: any[] = [];
jest.mock('./CompanyCollaboratorsTable/CompanyCollaboratorsTable', () => ({
  CompanyCollaboratorsTable: ({ items }: { items: any[] }) => {
    mockItems = items;
    return <div data-testid="table">{items.length}</div>;
  },
}));
jest.mock('@/src/features/headers/HeaderBackoffice', () => ({
  HeaderBackoffice: ({ title }: { title: string }) => <h1>{title}</h1>,
}));
jest.mock('../../../modals/Modal', () => ({
  openModal: jest.fn(),
  useModalContext: () => ({}),
}));
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock(
  '../../../modals/CompanyInviteCollaboratorsModal/CompanyInviteCollaboratorsModal',
  () => ({ CompanyInviteCollaboratorsModal: () => null })
);

const company = {
  id: 'c1',
  pendingInvitations: [
    { id: 'i1', email: 'new@acme.fr', createdAt: '2026-03-04T10:00:00.000Z' },
  ],
  users: [
    {
      id: 'admin',
      firstName: 'Ad',
      lastName: 'Min',
      email: 'admin@acme.fr',
      companyUser: { isAdmin: true },
      conversations: [],
    },
    {
      id: 'u1',
      firstName: 'Jeanne',
      lastName: 'Durand',
      email: 'jeanne@acme.fr',
      companyUser: { isAdmin: false },
      conversations: [{}, {}],
      invitations: [{ createdAt: '2026-01-15T10:00:00.000Z' }],
      createdAt: '2026-02-01T10:00:00.000Z',
    },
    {
      id: 'u2',
      firstName: 'Paul',
      lastName: 'Martin',
      email: 'paul@acme.fr',
      companyUser: { isAdmin: false },
      conversations: [{}],
    },
  ],
} as any;

describe('CompanyCollaboratorsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header and opens the invitation modal', () => {
    render(<CompanyCollaboratorsList companyWithCollaborators={company} />);
    expect(
      screen.getByText('Gestion de vos collaborateurs')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('Inviter vos collaborateurs'));
    expect(openModal).toHaveBeenCalledTimes(1);
  });

  it('lists pending invitations first, then the non-admin collaborators', () => {
    render(<CompanyCollaboratorsList companyWithCollaborators={company} />);
    expect(mockItems.map((item) => item.id)).toEqual(['i1', 'u1', 'u2']);
  });

  it('describes a pending invitation without account data', () => {
    render(<CompanyCollaboratorsList companyWithCollaborators={company} />);
    expect(mockItems[0]).toEqual({
      id: 'i1',
      name: '-',
      email: 'new@acme.fr',
      connectionCounter: '-',
      invitedAt: new Date('2026-03-04T10:00:00.000Z').toLocaleDateString('fr'),
      accountCreated: '-',
    });
  });

  it('describes a collaborator, pluralising the candidates count', () => {
    render(<CompanyCollaboratorsList companyWithCollaborators={company} />);
    expect(mockItems[1]).toMatchObject({
      name: 'Jeanne Durand',
      connectionCounter: '2 candidats',
      invitedAt: new Date('2026-01-15T10:00:00.000Z').toLocaleDateString('fr'),
      accountCreated: new Date('2026-02-01T10:00:00.000Z').toLocaleDateString(
        'fr'
      ),
    });
    expect(mockItems[2]).toMatchObject({
      connectionCounter: '1 candidat',
      invitedAt: '-',
      accountCreated: '-',
    });
  });

  it('works without pending invitations', () => {
    render(
      <CompanyCollaboratorsList
        companyWithCollaborators={{ ...company, pendingInvitations: undefined }}
      />
    );
    expect(mockItems.map((item) => item.id)).toEqual(['u1', 'u2']);
  });
});
