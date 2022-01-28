import React from 'react';

import PropTypes from 'prop-types';
import FiltersDropdowns from 'src/components/filters/FiltersDropdowns';
import FiltersCheckboxes from 'src/components/filters/FiltersCheckboxes';
import { OffcanvasNoSSR } from 'src/components/utils/Offcanvas';

const FiltersSideBar = ({ filterData, filters, setFilters }) => {
  return (
    <OffcanvasNoSSR
      id="toggle-filter-menu"
      className="ent-filter-menu uk-padding-medium-top uk-preserve-color"
      flip={false}
    >
      <div className="uk-margin-medium-top">
        <FiltersDropdowns
          filterData={filterData}
          filters={filters}
          setFilters={setFilters}
          fullWidth
          showSeparator
        />
      </div>
      <div className="uk-margin-small-top">
        <FiltersCheckboxes
          filterData={filterData}
          filters={filters}
          setFilters={setFilters}
          fullWidth
        />
      </div>
    </OffcanvasNoSSR>
  );
};

FiltersSideBar.propTypes = {
  filters: PropTypes.shape().isRequired,
  setFilters: PropTypes.func.isRequired,
  filterData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default FiltersSideBar;
