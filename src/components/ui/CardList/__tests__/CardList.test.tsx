import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { CardList } from '../CardList';
import { CardListItem } from '../CardListItem/CardListItem';

describe('CardList', () => {
  it('renders the given items', () => {
    render(
      <CardList
        dataTestId="list"
        list={[
          <CardListItem key="1">Un</CardListItem>,
          <CardListItem key="2" dataTestId="item-2">
            Deux
          </CardListItem>,
        ]}
      />
    );
    expect(screen.getByTestId('list')).toBeInTheDocument();
    expect(screen.getByText('Un')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toHaveTextContent('Deux');
    expect(screen.queryByText('Aucun résultat')).not.toBeInTheDocument();
  });

  it('shows an empty message when the list is empty', () => {
    render(<CardList list={[]} />);
    expect(screen.getByText('Aucun résultat')).toBeInTheDocument();
  });

  it('does not show the empty message while loading', () => {
    render(<CardList list={[]} isLoading condensed />);
    expect(screen.queryByText('Aucun résultat')).not.toBeInTheDocument();
  });
});
