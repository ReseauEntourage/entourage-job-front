import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { NetworkDirectoryEntity } from '@/src/constants/network-directory';
import { useNetworkDirectory } from '../hooks/useNetworkDirectory';
import { NetworkDirectoryList } from './NetworkDirectoryList';

jest.mock('../hooks/useNetworkDirectory', () => ({
  useNetworkDirectory: jest.fn(),
}));
jest.mock('../NetworkDirectoryItem', () => ({
  NetworkDirectoryUserItem: ({ firstName, isAvailable }: any) => (
    <div data-testid="user">
      {firstName}:{String(isAvailable)}
    </div>
  ),
  NetworkDirectoryCompanyItem: ({ name, businessSectors, users }: any) => (
    <div data-testid="company">
      {name}:{businessSectors.length}:{users.length}
    </div>
  ),
}));
jest.mock('@/src/components/ui/CardList', () => ({
  CardList: ({ list, isLoading }: any) => (
    <div data-testid="list" data-loading={String(isLoading)}>
      {list}
    </div>
  ),
}));

const setup = (entity: NetworkDirectoryEntity | string, extra = {}) => {
  (useNetworkDirectory as jest.Mock).mockReturnValue({
    profiles: [
      { id: 'p1', firstName: 'Awa' },
      { id: 'p2', firstName: 'Bilal', unavailableAt: '2026-01-01' },
    ],
    companies: [
      { id: 'c1', name: 'Acme' },
      { id: 'c2', name: 'Beta', businessSectors: [{}], users: [{}, {}] },
    ],
    isProfileLoading: false,
    directoryFiltersParams: { entity },
    ...extra,
  });
  return render(<NetworkDirectoryList />);
};

describe('NetworkDirectoryList', () => {
  it('lists the profiles for the user entity, flagging the unavailable ones', () => {
    setup(NetworkDirectoryEntity.USER);
    expect(screen.getByText('Awa:true')).toBeInTheDocument();
    expect(screen.getByText('Bilal:false')).toBeInTheDocument();
    expect(screen.queryAllByTestId('company')).toHaveLength(0);
  });

  it('lists the companies for the company entity, defaulting missing sectors and users', () => {
    setup(NetworkDirectoryEntity.COMPANY);
    expect(screen.getByText('Acme:0:0')).toBeInTheDocument();
    expect(screen.getByText('Beta:1:2')).toBeInTheDocument();
    expect(screen.queryAllByTestId('user')).toHaveLength(0);
  });

  it('lists nothing for an unknown entity', () => {
    setup('other');
    expect(screen.queryAllByTestId('user')).toHaveLength(0);
    expect(screen.queryAllByTestId('company')).toHaveLength(0);
  });

  it('passes the profiles loading state to the list', () => {
    setup(NetworkDirectoryEntity.USER, { isProfileLoading: true });
    expect(screen.getByTestId('list')).toHaveAttribute('data-loading', 'true');
  });
});
