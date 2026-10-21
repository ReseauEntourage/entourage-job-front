import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Filter, FilterObject } from '@/src/constants/utils';
import { gaEvent } from '@/src/lib/gtag';
import { MobileFilterButton } from '../MobileFilterButton';
import { MobileFilterDrawer } from '../MobileFilterDrawer';
import { MobileFilterList } from '../MobileFilterList';
import { MobileFilterOptions } from '../MobileFilterOptions';

jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => false,
}));

const tag = { action: 'tracked' };
const a = { value: 'a', label: 'Option A' };
const b = { value: 'b', label: 'Option B' };
const filterData: Filter[] = [
  { key: 'letters', title: 'Lettres', constants: [a, b], tag },
  { key: 'other', title: 'Autre', constants: [a] },
];

describe('MobileFilterButton', () => {
  it('shows the label and calls onClick', () => {
    const onClick = jest.fn();
    render(<MobileFilterButton onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: /Filtrer/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows the number of active filters only when positive', () => {
    const { rerender } = render(
      <MobileFilterButton onClick={jest.fn()} count={0} />
    );
    expect(screen.queryByText('0')).not.toBeInTheDocument();
    rerender(<MobileFilterButton onClick={jest.fn()} count={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});

describe('MobileFilterList', () => {
  it('lists the filters with their selected count and selects one', () => {
    const onSelectFilter = jest.fn();
    render(
      <MobileFilterList
        filterData={filterData}
        filters={{ letters: [a, b], other: [] }}
        onSelectFilter={onSelectFilter}
      />
    );
    expect(screen.getByText('Lettres')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('mobile-filter-item-other'));
    expect(onSelectFilter).toHaveBeenCalledWith('other');
    expect(screen.getAllByText(/^\d+$/)).toHaveLength(1);
  });

  it('copes with a filter missing from the filters object', () => {
    render(
      <MobileFilterList
        filterData={filterData}
        filters={{} as FilterObject}
        onSelectFilter={jest.fn()}
      />
    );
    expect(screen.getByText('Autre')).toBeInTheDocument();
  });
});

describe('MobileFilterOptions', () => {
  const setFilters = jest.fn();
  beforeEach(() => jest.clearAllMocks());

  it('shows every option checked according to the filters', () => {
    render(
      <MobileFilterOptions
        currentFilter={filterData[0]}
        filters={{ letters: [a], other: [] }}
        setFilters={setFilters}
      />
    );
    const [checkboxA, checkboxB] = screen.getAllByRole('checkbox');
    expect(checkboxA).toBeChecked();
    expect(checkboxB).not.toBeChecked();
  });

  it('adds an option and tracks the event', () => {
    render(
      <MobileFilterOptions
        currentFilter={filterData[0]}
        filters={{ letters: [a], other: [] }}
        setFilters={setFilters}
      />
    );
    fireEvent.click(screen.getAllByRole('checkbox')[1]);
    expect(setFilters).toHaveBeenCalledWith({ letters: [a, b], other: [] });
    expect(gaEvent).toHaveBeenCalledWith(tag);
  });

  it('removes an option', () => {
    render(
      <MobileFilterOptions
        currentFilter={filterData[0]}
        filters={{ letters: [a, b], other: [] }}
        setFilters={setFilters}
      />
    );
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(setFilters).toHaveBeenCalledWith({ letters: [b], other: [] });
    expect(gaEvent).not.toHaveBeenCalled();
  });

  it('does not track when the filter has no tag', () => {
    render(
      <MobileFilterOptions
        currentFilter={filterData[1]}
        filters={{ letters: [], other: [] }}
        setFilters={setFilters}
      />
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(setFilters).toHaveBeenCalledWith({ letters: [], other: [a] });
    expect(gaEvent).not.toHaveBeenCalled();
  });
});

describe('MobileFilterDrawer', () => {
  const baseProps = {
    isOpen: true,
    onClose: jest.fn(),
    filters: { letters: [], other: [] } as FilterObject,
    setFilters: jest.fn(),
    filterData,
  };
  beforeEach(() => jest.clearAllMocks());

  it('starts on the list of filters', () => {
    render(<MobileFilterDrawer {...baseProps} />);
    expect(screen.getByText('Filtres')).toBeInTheDocument();
    expect(
      screen.getByTestId('mobile-filter-item-letters')
    ).toBeInTheDocument();
  });

  it('closes from the back button on the list', () => {
    render(<MobileFilterDrawer {...baseProps} />);
    fireEvent.click(screen.getByTestId('mobile-filter-back-button'));
    expect(baseProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('opens a filter then goes back to the list instead of closing', () => {
    render(<MobileFilterDrawer {...baseProps} />);
    fireEvent.click(screen.getByTestId('mobile-filter-item-letters'));
    expect(screen.getByText('Option A')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('mobile-filter-back-button'));
    expect(baseProps.onClose).not.toHaveBeenCalled();
    expect(screen.getByText('Filtres')).toBeInTheDocument();
  });

  it('applies the filters then closes', () => {
    const onApplyFilters = jest.fn();
    render(
      <MobileFilterDrawer {...baseProps} onApplyFilters={onApplyFilters} />
    );
    fireEvent.click(screen.getByTestId('mobile-filter-apply-button'));
    expect(onApplyFilters).toHaveBeenCalledTimes(1);
    expect(baseProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('closes without an apply callback', () => {
    render(<MobileFilterDrawer {...baseProps} />);
    fireEvent.click(screen.getByTestId('mobile-filter-apply-button'));
    expect(baseProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('goes back to the list when re-opened', () => {
    const { rerender } = render(<MobileFilterDrawer {...baseProps} />);
    fireEvent.click(screen.getByTestId('mobile-filter-item-letters'));
    rerender(<MobileFilterDrawer {...baseProps} isOpen={false} />);
    rerender(<MobileFilterDrawer {...baseProps} isOpen />);
    expect(screen.getByText('Filtres')).toBeInTheDocument();
  });
});
