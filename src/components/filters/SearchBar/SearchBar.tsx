import React, { useCallback, useEffect, useState } from 'react';
import SearchIcon from 'assets/icons/search.svg';
import { FiltersCheckboxes } from 'src/components/filters/FiltersCheckboxes';
import { FiltersDropdowns } from 'src/components/filters/FiltersDropdowns';
import { FiltersMobile } from 'src/components/filters/FiltersMobile';
import { FiltersOptions } from 'src/components/filters/FiltersOptions';
import { FiltersSideBar } from 'src/components/filters/FiltersSideBar';
import { Filter, FilterConstant, FilterObject } from 'src/constants/utils';
import { gaEvent } from 'src/lib/gtag';
import {
  StyledSearchBar,
  StyledSearchBarContainer,
  StyledSearchBarInput,
  StyledSearchBarSubmitButton,
} from './SearchBar.styles';

export interface SearchBarProps {
  filtersConstants?: Filter[];
  filters?: FilterObject;
  setFilters?: (updatedFilters: FilterObject) => void;
  search?: string;
  setSearch: (search?: string) => void;
  resetFilters?: () => void;
  smallSelectors?: boolean;
  placeholder?: string;
  startSearchEvent?: {
    action: string;
  };
  additionalButtons?: React.ReactNode;
  light?: boolean;
}

export const SearchBar = ({
  filtersConstants = [],
  filters = {},
  setFilters = () => {},
  search,
  setSearch,
  resetFilters = () => {},
  placeholder = 'Rechercher...',
  startSearchEvent,
  smallSelectors = false,
  additionalButtons,
  light = false,
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

  return (
    <StyledSearchBarContainer>
      <StyledSearchBar light={light}>
        <form className="uk-width-expand">
          <StyledSearchBarInput
            type="text"
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
              const { value } = ev.target;
              setSearchBuffer(value);
            }}
          />
        </form>
        {filtersConstants.length > 0 && (
          <FiltersMobile numberOfFilters={numberOfFilters} />
        )}
        {filtersConstants.length > 0 && (
          <FiltersDropdowns
            hideOnMobile
            filterData={filtersConstants}
            filters={filters}
            setFilters={setFilters}
            smallSelectors={smallSelectors}
          />
        )}
        <StyledSearchBarSubmitButton onClick={startSearch}>
          <SearchIcon />
        </StyledSearchBarSubmitButton>
      </StyledSearchBar>

      <FiltersSideBar
        filterData={filtersConstants}
        filters={filters}
        setFilters={setFilters}
      />
      {filtersConstants.length > 0 && (
        <div className="uk-width-expand uk-padding-remove-vertical uk-flex uk-flex-between@m uk-margin-top">
          <FiltersCheckboxes
            filterData={filtersConstants}
            filters={filters}
            setFilters={setFilters}
            hideOnMobile
          />
          <div className="uk-width-expand">{additionalButtons}</div>
          {(numberOfFilters > 0 || (filtersConstants.length > 0 && search)) && (
            <FiltersOptions
              resetFilters={() => {
                resetFilters();
                setSearchBuffer('');
              }}
            />
          )}
        </div>
      )}
    </StyledSearchBarContainer>
  );
};
