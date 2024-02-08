import React, { useCallback, useEffect, useState } from 'react';
import SearchIcon from 'assets/icons/search.svg';
import { FiltersCheckboxes } from 'src/components/filters/FiltersCheckboxes';
import { FiltersDropdowns } from 'src/components/filters/FiltersDropdowns';
import { FiltersMobile } from 'src/components/filters/FiltersMobile';
import { FiltersOptions } from 'src/components/filters/FiltersOptions';
import { FiltersSideBar } from 'src/components/filters/FiltersSideBar';
import { HEIGHTS } from 'src/constants/styles';
import { Filter, FilterConstant, FilterObject } from 'src/constants/utils';
import { gaEvent } from 'src/lib/gtag';

interface SearchBarProps {
  filtersConstants: Filter[];
  filters: FilterObject;
  setFilters: (updatedFilters: FilterObject) => void;
  search?: string;
  setSearch: (search?: string) => void;
  resetFilters: () => void;
  smallSelectors?: boolean;
  placeholder?: string;
  startSearchEvent?: {
    action: string;
  };
  additionalButtons?: React.ReactNode;
}

export const SearchBar = ({
  filtersConstants,
  filters,
  setFilters,
  search,
  setSearch,
  resetFilters,
  placeholder = 'Rechercher...',
  startSearchEvent,
  smallSelectors = false,
  additionalButtons,
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
      Object.values(filters).reduce(
        (acc: number, curr: FilterConstant[] | undefined) => {
          return acc + (curr ? curr.length : 0);
        },
        0
      )
    );
  }, [filters]);

  const hasFilters = numberOfFilters > 0 || search;

  return (
    <div
      className="uk-flex uk-flex-column uk-flex-middle"
      style={{ minHeight: HEIGHTS.SEARCH_BAR_HEIGHT }}
    >
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
          <SearchIcon className="uk-text-secondary" />
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
        <div className="uk-width-expand">{additionalButtons}</div>
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
