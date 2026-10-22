import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Filter, FilterObject } from '@/src/constants/utils';
import { gaEvent } from '@/src/lib/gtag';
import { FiltersDropdowns } from '../FiltersDropdowns';

jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));

const tag = { action: 'tracked' };
const a = { value: 'a', label: 'Option A' };
const b = { value: 'b', label: 'Option B' };
const c = { value: 'c', label: 'Option C' };

const filterData: Filter[] = [
  { key: 'letters', title: 'Lettres', constants: [a, b, c], tag },
  {
    key: 'priorities',
    title: 'Prioritaires',
    constants: [a, b, c],
    priority: [c],
  },
  { key: 'must', title: 'Obligatoire', constants: [a, b], mandatory: true },
  { key: 'box', title: 'Case', type: 'checkbox', constants: [a] },
  { key: 'missing', title: 'Absent', constants: [a] },
];

const emptyFilters = (): FilterObject => ({
  letters: [],
  priorities: [],
  must: [],
  box: [],
});

const setFilters = jest.fn();

const renderDropdowns = (filters: FilterObject = emptyFilters(), props = {}) =>
  render(
    <FiltersDropdowns
      filterData={filterData}
      filters={filters}
      setFilters={setFilters}
      {...props}
    />
  );

describe('FiltersDropdowns', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders a dropdown per non-checkbox filter that exists in filters', () => {
    renderDropdowns();
    expect(screen.getByTestId('input-container-letters')).toBeInTheDocument();
    expect(
      screen.getByTestId('input-container-priorities')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('input-container-box')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('input-container-missing')
    ).not.toBeInTheDocument();
  });

  it('shows the number of selected options', () => {
    renderDropdowns({ ...emptyFilters(), letters: [a, b] });
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('adds an option and tracks the event', () => {
    renderDropdowns();
    fireEvent.click(screen.getAllByTestId('input-checkbox-a')[0]);
    expect(setFilters).toHaveBeenCalledWith({
      ...emptyFilters(),
      letters: [a],
    });
    expect(gaEvent).toHaveBeenCalledWith(tag);
  });

  it('removes a selected option without tracking', () => {
    renderDropdowns({ ...emptyFilters(), letters: [a, b] });
    fireEvent.click(screen.getAllByTestId('input-checkbox-a')[0]);
    expect(setFilters).toHaveBeenCalledWith({
      ...emptyFilters(),
      letters: [b],
    });
    expect(gaEvent).not.toHaveBeenCalled();
  });

  it('toggles an option with the Enter key', () => {
    renderDropdowns();
    fireEvent.keyDown(screen.getAllByTestId('input-checkbox-b')[0], {
      key: 'Enter',
    });
    expect(setFilters).toHaveBeenCalledWith({
      ...emptyFilters(),
      letters: [b],
    });
  });

  it('ignores other keys', () => {
    renderDropdowns();
    fireEvent.keyDown(screen.getAllByTestId('input-checkbox-b')[0], {
      key: 'a',
    });
    expect(setFilters).not.toHaveBeenCalled();
  });

  it('does not remove the last selection of a mandatory filter', () => {
    renderDropdowns({ ...emptyFilters(), must: [a] });
    // the mandatory filter is the third dropdown, its option "a" is the third matching checkbox
    const checkboxes = screen.getAllByTestId('input-checkbox-a');
    fireEvent.click(checkboxes[checkboxes.length - 1]);
    expect(setFilters).toHaveBeenCalledWith({ ...emptyFilters(), must: [a] });
  });

  it('removes a mandatory selection when another one remains', () => {
    renderDropdowns({ ...emptyFilters(), must: [a, b] });
    const checkboxes = screen.getAllByTestId('input-checkbox-a');
    fireEvent.click(checkboxes[checkboxes.length - 1]);
    expect(setFilters).toHaveBeenCalledWith({ ...emptyFilters(), must: [b] });
  });

  it('lists priority options first, then the others without duplicates', () => {
    renderDropdowns();
    const container = screen.getByTestId('input-container-priorities');
    const labels = Array.from(container.querySelectorAll('label')).map(
      (label) => label.textContent
    );
    expect(labels).toEqual(['Option C', 'Option A', 'Option B']);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('disables the dropdown button when the filter is disabled', () => {
    render(
      <FiltersDropdowns
        filterData={[{ ...filterData[0], disabled: true }]}
        filters={emptyFilters()}
        setFilters={setFilters}
        fullWidth
        hideOnMobile
        smallSelectors
        showSeparator
      />
    );
    expect(screen.getByRole('button', { name: /Lettres/ })).toBeDisabled();
  });
});
