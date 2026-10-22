import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Filter, FilterObject } from '@/src/constants/utils';
import { gaEvent } from '@/src/lib/gtag';
import { FiltersCheckboxes } from '../FiltersCheckboxes';
import { FiltersOptions } from '../FiltersOptions';

jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));

const tag = { action: 'tracked' };
const filterData: Filter[] = [
  {
    key: 'hasCv',
    title: 'Avec CV',
    type: 'checkbox',
    constants: [{ value: true, label: 'Oui' }],
    tag,
  },
  {
    key: 'region',
    title: 'Région',
    constants: [{ value: 'idf', label: 'IDF' }],
  },
  {
    key: 'locked',
    title: 'Verrouillé',
    type: 'checkbox',
    disabled: true,
    constants: [{ value: false, label: 'Non' }],
  },
];

describe('FiltersCheckboxes', () => {
  const setFilters = jest.fn();
  beforeEach(() => jest.clearAllMocks());

  it('only renders checkbox filters present in the filters object', () => {
    render(
      <FiltersCheckboxes
        filterData={filterData}
        filters={{ hasCv: [], region: [] }}
        setFilters={setFilters}
      />
    );
    expect(screen.getByLabelText('Avec CV')).toBeInTheDocument();
    expect(screen.queryByLabelText('Région')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Verrouillé')).not.toBeInTheDocument();
  });

  it('is checked when a selected constant has a falsy value', () => {
    const filters: FilterObject = {
      hasCv: [{ value: false, label: 'x' }],
    };
    render(
      <FiltersCheckboxes
        filterData={filterData}
        filters={filters}
        setFilters={setFilters}
      />
    );
    expect(screen.getByLabelText('Avec CV')).toBeChecked();
  });

  it('selects the first constant and tracks the event when checked', () => {
    render(
      <FiltersCheckboxes
        filterData={filterData}
        filters={{ hasCv: [] }}
        setFilters={setFilters}
        fullWidth
        hideOnMobile
      />
    );
    fireEvent.click(screen.getByLabelText('Avec CV'));
    expect(setFilters).toHaveBeenCalledWith({
      hasCv: [{ value: true, label: 'Oui' }],
    });
    expect(gaEvent).toHaveBeenCalledWith(tag);
  });

  it('clears the filter when unchecked, without tracking when there is no tag', () => {
    render(
      <FiltersCheckboxes
        filterData={filterData}
        filters={{ locked: [{ value: false, label: 'Non' }] }}
        setFilters={setFilters}
      />
    );
    expect(screen.getByLabelText('Verrouillé')).toBeDisabled();
  });

  it('removes the selection without tracking when unchecking', () => {
    render(
      <FiltersCheckboxes
        filterData={[{ ...filterData[0], tag: undefined }]}
        filters={{ hasCv: [{ value: false, label: 'Oui' }] }}
        setFilters={setFilters}
      />
    );
    fireEvent.click(screen.getByLabelText('Avec CV'));
    expect(setFilters).toHaveBeenCalledWith({ hasCv: [] });
    expect(gaEvent).not.toHaveBeenCalled();
  });
});

describe('FiltersOptions', () => {
  it('resets the filters', () => {
    const resetFilters = jest.fn();
    render(<FiltersOptions resetFilters={resetFilters} />);
    fireEvent.click(screen.getByTestId('reset-filters'));
    expect(resetFilters).toHaveBeenCalledTimes(1);
  });
});
