import React, { useCallback, useEffect, useState } from 'react';
import { FiltersDropdowns } from '@/src/components/filters/FiltersDropdowns/FiltersDropdowns';
import { FiltersCheckboxes } from 'src/components/filters/FiltersCheckboxes';
import { FiltersOptions } from 'src/components/filters/FiltersOptions';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { Filter, FilterConstant, FilterObject } from 'src/constants/utils';
import { gaEvent } from 'src/lib/gtag';
import {
  StyledSearchBar,
  StyledSearchBarClearButton,
  StyledSearchBarContainer,
  StyledSearchBarInput,
  StyledSearchBarInputContainer,
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
  cleareable?: boolean;
  instantSearch?: boolean;
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
  cleareable = true,
  instantSearch = false,
}: SearchBarProps) => {
  const [searchBuffer, setSearchBuffer] = useState(search || '');
  const [numberOfFilters, setNumberOfFilters] = useState<number>(0);
  const [debouncedSearchBuffer, setDebouncedSearchBuffer] = useState(
    search || ''
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchBuffer(searchBuffer);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchBuffer]);

  useEffect(() => {
    if (instantSearch) {
      setSearch(debouncedSearchBuffer);
    }
  }, [debouncedSearchBuffer, instantSearch, setSearch]);

  useEffect(() => {
    setSearchBuffer(search || '');
  }, [search]);

  const clearSearchBuffer = useCallback(() => {
    setSearchBuffer('');
    setSearch();
  }, [setSearch]);

  const startSearch = useCallback(() => {
    if (searchBuffer) {
      if (startSearchEvent) {
        gaEvent(startSearchEvent);
      }
      setSearch(searchBuffer);
    } else {
      setSearch();
    }
  }, [searchBuffer, setSearch, startSearchEvent]);

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
          <StyledSearchBarInputContainer>
            <StyledSearchBarInput
              id="search-input"
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
            {cleareable && searchBuffer && (
              <StyledSearchBarClearButton onClick={clearSearchBuffer}>
                <LucidIcon name="X" size={14} />
              </StyledSearchBarClearButton>
            )}
          </StyledSearchBarInputContainer>
        </form>
        {filtersConstants.length > 0 && (
          <FiltersDropdowns
            hideOnMobile
            filterData={filtersConstants}
            filters={filters}
            setFilters={setFilters}
            smallSelectors={smallSelectors}
            showSeparator
          />
        )}
        <StyledSearchBarSubmitButton onClick={startSearch}>
          <LucidIcon name="Search" />
        </StyledSearchBarSubmitButton>
      </StyledSearchBar>
      {filtersConstants.filter((f) => f.type === 'checkbox').length > 0 ||
        (additionalButtons && (
          <div className="uk-width-expand uk-padding-remove-vertical uk-flex uk-flex-between@m uk-margin-top">
            <FiltersCheckboxes
              filterData={filtersConstants}
              filters={filters}
              setFilters={setFilters}
              hideOnMobile
            />
            {additionalButtons && (
              <div className="uk-width-expand">{additionalButtons}</div>
            )}
            {(numberOfFilters > 0 ||
              (filtersConstants.length > 0 && search)) && (
              <FiltersOptions
                resetFilters={() => {
                  resetFilters();
                  setSearchBuffer('');
                }}
              />
            )}
          </div>
        ))}
    </StyledSearchBarContainer>
  );
};
