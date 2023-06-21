import React, { useCallback, useEffect, useState } from 'react';
import { FiltersCheckboxes } from 'src/components/filters/FiltersCheckboxes';
import { FiltersDropdowns } from 'src/components/filters/FiltersDropdowns';
import { FiltersMobile } from 'src/components/filters/FiltersMobile';
import { FiltersOptions } from 'src/components/filters/FiltersOptions';
import { FiltersSideBar } from 'src/components/filters/FiltersSideBar';
import { IconNoSSR } from 'src/components/utils';
import {
  CV_FILTERS_DATA,
  MEMBER_FILTERS_DATA,
  OPPORTUNITY_FILTERS_DATA,
  ORGANIZATION_FILTERS_DATA,
} from 'src/constants';
import { gaEvent } from 'src/lib/gtag';
import { AnyToFix } from 'src/utils/Types';

// to be typed

interface SearchBarProps {
  filtersConstants:
    | typeof CV_FILTERS_DATA
    | typeof MEMBER_FILTERS_DATA
    | typeof OPPORTUNITY_FILTERS_DATA
    | typeof ORGANIZATION_FILTERS_DATA; // to be typed properly
  filters: AnyToFix; // to be typed
  setFilters: (updatedFilters: AnyToFix) => void;
  search?: string;
  setSearch: (arg1?: string) => void;
  resetFilters: () => void;
  smallSelectors?: boolean;
  placeholder?: string;
  startSearchEvent?: {
    action: string;
  };
}

export const SearchBar = ({
  filtersConstants,
  filters,
  setFilters,
  search,
  setSearch,
  resetFilters,
  placeholder,
  startSearchEvent,
  smallSelectors,
}: SearchBarProps) => {
  const [searchBuffer, setSearchBuffer] = useState(search || '');

  useEffect(() => {
    setSearchBuffer(search || '');
  }, [search]);

  const startSearch = useCallback(() => {
    if (searchBuffer) {
      if (startSearchEvent) gaEvent(startSearchEvent);
      setSearch(searchBuffer);
    } else {
      setSearch();
    }
  }, [searchBuffer, setSearch, startSearchEvent]);

  const [numberOfFilters, setNumberOfFilters] = useState<number>(0);

  useEffect(() => {
    setNumberOfFilters(
      Object.values(filters).reduce((acc: number, curr: string) => {
        return acc + curr.length;
      }, 0) as number
    );
  }, [filters]);

  const hasFilters = numberOfFilters > 0 || search;

  return (
    <div className="uk-flex uk-flex-column uk-flex-middle">
      <div className="uk-width-expand ent-search-bar">
        <form className="uk-search uk-search-navbar uk-width-expand">
          <input
            className="uk-search-input"
            type="search"
            data-testid="search-input"
            placeholder={placeholder}
            value={searchBuffer}
            onKeyDown={(ev) => {
              if (ev.key === 'Enter') {
                ev.preventDefault();
                startSearch();
              }
            }}
            onChange={(ev) => {
              setSearchBuffer(ev.target.value);
            }}
          />
        </form>
        <FiltersMobile numberOfFilters={numberOfFilters} />
        <FiltersDropdowns
          hideOnMobile
          filterData={filtersConstants}
          filters={filters}
          setFilters={setFilters}
          smallSelectors={smallSelectors}
        />
        <a
          className="ent-search-icon uk-background-primary uk-light"
          onClick={startSearch}
        >
          <IconNoSSR name="search" className="uk-text-secondary" />
        </a>
      </div>
      <FiltersSideBar
        filterData={filtersConstants}
        filters={filters}
        setFilters={setFilters}
      />
      <div className="uk-width-expand uk-padding-remove-vertical uk-flex uk-flex-between@m uk-margin-top">
        <FiltersCheckboxes
          filterData={filtersConstants}
          filters={filters}
          setFilters={setFilters}
          hideOnMobile
        />
        {hasFilters && (
          <FiltersOptions
            resetFilters={() => {
              resetFilters();
              setSearchBuffer('');
            }}
          />
        )}
      </div>
    </div>
  );
};

SearchBar.defaultProps = {
  placeholder: 'Rechercher...',
  startSearchEvent: undefined,
  search: undefined,
  smallSelectors: false,
};
