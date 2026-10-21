import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { NetworkDirectory } from './NetworkDirectory';
import { NetworkDirectoryCompanyItem } from './NetworkDirectoryItem/NetworkDirectoryCompanyItem';
import { NetworkDirectoryUserItem } from './NetworkDirectoryItem/NetworkDirectoryUserItem';

jest.mock('@/src/components/layouts/LayoutBackOffice', () => ({
  LayoutBackOffice: ({ title, children }: any) => (
    <div data-testid="layout" data-title={title}>
      {children}
    </div>
  ),
}));
jest.mock('../../headers/HeaderBackoffice', () => ({
  HeaderBackoffice: ({ title }: any) => <h1>{title}</h1>,
}));
jest.mock('./NetworkDirectoryFilters/NetworkDirectoryFilters', () => ({
  NetworkDirectoryFilters: () => <div data-testid="filters" />,
}));
jest.mock('./NetworkDirectoryList', () => ({
  NetworkDirectoryList: () => <div data-testid="list" />,
}));
jest.mock('@/src/components/ui/CardList', () => ({
  CardListItem: ({ dataTestId, children }: any) => (
    <div data-testid={dataTestId}>{children}</div>
  ),
}));
jest.mock(
  '@/src/components/ui/Cards/EntityCards/CompanyCard/CompanyCard',
  () => ({
    CompanyCard: ({ id, name, logoUrl }: any) => (
      <div>{`company:${id}:${name}:${logoUrl}`}</div>
    ),
  })
);
jest.mock('@/src/components/ui/Cards/EntityCards/ProfileCard', () => ({
  ProfileCard: ({ userId, firstName, lastName, isAvailable }: any) => (
    <div>{`user:${userId}:${firstName} ${lastName}:${isAvailable}`}</div>
  ),
}));

describe('NetworkDirectory', () => {
  it('composes the header, the filters and the list in the Annuaire layout', () => {
    render(<NetworkDirectory />);

    expect(screen.getByTestId('layout')).toHaveAttribute(
      'data-title',
      'Annuaire'
    );
    expect(screen.getByText('Bienvenue sur votre réseau')).toBeInTheDocument();
    expect(screen.getByTestId('filters')).toBeInTheDocument();
    expect(screen.getByTestId('list')).toBeInTheDocument();
  });
});

describe('NetworkDirectory items', () => {
  it('wraps a company card in a list item identified by the company id', () => {
    render(
      <NetworkDirectoryCompanyItem
        id="c1"
        name="ACME"
        businessSectors={[]}
        users={[]}
        logoUrl="logo.png"
      />
    );

    expect(screen.getByTestId('c1')).toHaveTextContent(
      'company:c1:ACME:logo.png'
    );
  });

  it('wraps a profile card in a list item identified by the user id', () => {
    render(
      <NetworkDirectoryUserItem
        {...({
          id: 'u1',
          firstName: 'Jane',
          lastName: 'Doe',
          isAvailable: true,
          achievements: [],
        } as any)}
      />
    );

    expect(screen.getByTestId('u1')).toHaveTextContent('user:u1:Jane Doe:true');
  });
});
