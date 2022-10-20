import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FiltersMobile from 'src/components/filters/FiltersMobile';
import FiltersSideBar from 'src/components/filters/FiltersSideBar';
import FiltersCheckboxes from 'src/components/filters/FiltersCheckboxes';
import FiltersOptions from 'src/components/filters/FiltersOptions';
import { IconNoSSR } from 'src/components/utils/Icon';
import { gaEvent } from 'src/lib/gtag';
import FiltersDropdowns from 'src/components/filters/FiltersDropdowns';

const SearchBar = ({
  filtersConstants,
  filters,
  setFilters,
  search,
  setSearch,
  numberOfResults,
  resetFilters,
  placeholder,
  startSearchEvent,
  smallSelectors,
}) => {
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

  const [numberOfFilters, setNumberOfFilters] = useState(0);

  useEffect(() => {
    setNumberOfFilters(
      Object.values(filters).reduce((acc, curr) => {
        return acc + curr.length;
      }, 0)
    );
  }, [filters]);

  const hasFilters = numberOfFilters > 0 || search;

  return (
    <div className="uk-flex uk-flex-column uk-flex-middle uk-margin-small-bottom">
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
        <FiltersMobile filters={filters} numberOfFilters={numberOfFilters} />
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
      <div className="uk-width-expand uk-padding-small uk-padding-remove-vertical uk-flex uk-flex-between@m uk-margin-top">
        <FiltersCheckboxes
          filterData={filtersConstants}
          filters={filters}
          setFilters={setFilters}
          hideOnMobile
        />
        {hasFilters && (
          <FiltersOptions
            numberOfResults={numberOfResults}
            filters={filters}
            search={search}
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

SearchBar.propTypes = {
  filtersConstants: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  filters: PropTypes.shape().isRequired,
  setFilters: PropTypes.func.isRequired,
  search: PropTypes.string,
  setSearch: PropTypes.func.isRequired,
  numberOfResults: PropTypes.number.isRequired,
  resetFilters: PropTypes.func.isRequired,
  smallSelectors: PropTypes.bool,
  placeholder: PropTypes.string,
  startSearchEvent: PropTypes.shape({
    action: PropTypes.string.isRequired,
  }),
};

SearchBar.defaultProps = {
  placeholder: 'Rechercher...',
  startSearchEvent: undefined,
  search: undefined,
  smallSelectors: false,
};

export default SearchBar;
