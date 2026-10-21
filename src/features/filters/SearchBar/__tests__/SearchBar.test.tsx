import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Filter } from '@/src/constants/utils';
import { gaEvent } from '@/src/lib/gtag';
import { SearchBar } from '../SearchBar';

jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));

const a = { value: 'a', label: 'Option A' };
const filtersConstants: Filter[] = [
  { key: 'letters', title: 'Lettres', constants: [a] },
];

describe('SearchBar', () => {
  const setSearch = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });
  afterEach(() => jest.useRealTimers());

  const input = () => screen.getByTestId('search-input');

  it('shows the placeholder and the initial search', () => {
    const { rerender } = render(<SearchBar setSearch={setSearch} />);
    expect(input()).toHaveAttribute('placeholder', 'Rechercher...');
    rerender(
      <SearchBar setSearch={setSearch} search="chef" placeholder="Trouver" />
    );
    expect(input()).toHaveValue('chef');
    expect(input()).toHaveAttribute('placeholder', 'Trouver');
  });

  it('searches on Enter and tracks the start event', () => {
    render(
      <SearchBar setSearch={setSearch} startSearchEvent={{ action: 'go' }} />
    );
    fireEvent.change(input(), { target: { value: 'cuisine' } });
    fireEvent.keyDown(input(), { key: 'Enter' });
    expect(setSearch).toHaveBeenCalledWith('cuisine');
    expect(gaEvent).toHaveBeenCalledWith({ action: 'go' });
  });

  it('does nothing on other keys', () => {
    render(<SearchBar setSearch={setSearch} />);
    fireEvent.change(input(), { target: { value: 'cuisine' } });
    fireEvent.keyDown(input(), { key: 'a' });
    expect(setSearch).not.toHaveBeenCalled();
  });

  it('searches from the submit button, and clears the search when empty', () => {
    const { container } = render(<SearchBar setSearch={setSearch} />);
    const submit = container.querySelector('a') as HTMLElement;
    fireEvent.click(submit);
    expect(setSearch).toHaveBeenCalledWith();
    expect(gaEvent).not.toHaveBeenCalled();

    fireEvent.change(input(), { target: { value: 'x' } });
    fireEvent.click(submit);
    expect(setSearch).toHaveBeenLastCalledWith('x');
  });

  it('clears the search with the clear button', () => {
    const { container } = render(
      <SearchBar setSearch={setSearch} search="chef" />
    );
    fireEvent.click(container.querySelector('.lucide-x') as Element);
    expect(input()).toHaveValue('');
    expect(setSearch).toHaveBeenCalledWith();
  });

  it('hides the clear button when not cleareable', () => {
    const { container } = render(
      <SearchBar setSearch={setSearch} search="chef" cleareable={false} />
    );
    expect(container.querySelector('.lucide-x')).not.toBeInTheDocument();
  });

  it('searches as you type after a debounce with instantSearch', () => {
    render(<SearchBar setSearch={setSearch} instantSearch />);
    setSearch.mockClear();
    fireEvent.change(input(), { target: { value: 'abc' } });
    expect(setSearch).not.toHaveBeenCalledWith('abc');
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(setSearch).toHaveBeenCalledWith('abc');
  });

  it('syncs with an externally changed search', () => {
    const { rerender } = render(<SearchBar setSearch={setSearch} search="a" />);
    rerender(<SearchBar setSearch={setSearch} search="b" />);
    expect(input()).toHaveValue('b');
  });

  it('renders the filter dropdowns when filter constants are given', () => {
    render(
      <SearchBar
        setSearch={setSearch}
        filtersConstants={filtersConstants}
        filters={{ letters: [] }}
      />
    );
    expect(screen.getByTestId('input-container-letters')).toBeInTheDocument();
  });

  it('shows additional buttons and a reset button once filters are active', () => {
    const resetFilters = jest.fn();
    render(
      <SearchBar
        setSearch={setSearch}
        filtersConstants={filtersConstants}
        filters={{ letters: [a] }}
        resetFilters={resetFilters}
        additionalButtons={<span>Extra</span>}
      />
    );
    expect(screen.getByText('Extra')).toBeInTheDocument();
    fireEvent.change(input(), { target: { value: 'abc' } });
    fireEvent.click(screen.getByTestId('reset-filters'));
    expect(resetFilters).toHaveBeenCalledTimes(1);
    expect(input()).toHaveValue('');
  });

  it('does not show the reset button without active filters or search', () => {
    render(
      <SearchBar
        setSearch={setSearch}
        filtersConstants={filtersConstants}
        filters={{ letters: [] }}
        additionalButtons={<span>Extra</span>}
      />
    );
    expect(screen.queryByTestId('reset-filters')).not.toBeInTheDocument();
  });
});
