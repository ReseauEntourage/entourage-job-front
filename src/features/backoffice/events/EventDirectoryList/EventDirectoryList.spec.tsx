import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { useEventDirectory } from '../useEventDirectory';
import { DirectoryEventItem } from './DirectoryEventItem';
import { EventDirectoryList } from './EventDirectoryList';

jest.mock('../useEventDirectory', () => ({ useEventDirectory: jest.fn() }));
jest.mock('@/src/components/ui/CardList', () => ({
  CardList: ({ list, isLoading }: any) => (
    <div data-testid="card-list" data-loading={String(isLoading)}>
      {list}
    </div>
  ),
  CardListItem: ({ dataTestId, children }: any) => (
    <div data-testid={dataTestId}>{children}</div>
  ),
}));
jest.mock('@/src/components/ui/Cards/EntityCards/EventCard/EventCard', () => ({
  EventCard: ({ name, registrationCount }: any) => (
    <div>{`${name}:${registrationCount}`}</div>
  ),
}));

describe('EventDirectoryList', () => {
  it('renders one card per event and forwards the loading state', () => {
    (useEventDirectory as jest.Mock).mockReturnValue({
      isEventLoading: true,
      events: [
        { salesForceId: 'e1', name: 'Atelier', registrationCount: 3 },
        { salesForceId: 'e2', name: 'Café', registrationCount: 0 },
      ],
    });
    render(<EventDirectoryList />);

    expect(screen.getByTestId('card-list')).toHaveAttribute(
      'data-loading',
      'true'
    );
    expect(screen.getByTestId('e1')).toHaveTextContent('Atelier:3');
    expect(screen.getByTestId('e2')).toHaveTextContent('Café:0');
  });

  it('renders an empty list without events', () => {
    (useEventDirectory as jest.Mock).mockReturnValue({
      isEventLoading: false,
      events: [],
    });
    render(<EventDirectoryList />);

    expect(screen.getByTestId('card-list')).toBeEmptyDOMElement();
  });
});

describe('DirectoryEventItem', () => {
  it('wraps the event card in a list item identified by the event id', () => {
    render(
      <DirectoryEventItem
        {...({
          salesForceId: 'e9',
          name: 'Webinaire',
          registrationCount: 1,
        } as any)}
      />
    );

    expect(screen.getByTestId('e9')).toHaveTextContent('Webinaire:1');
  });
});
