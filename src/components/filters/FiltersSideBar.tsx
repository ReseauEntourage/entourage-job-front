import React from 'react';
import FiltersCheckboxes from 'src/components/filters/FiltersCheckboxes';
import FiltersDropdowns from 'src/components/filters/FiltersDropdowns';
import { OffcanvasNoSSR } from 'src/components/utils/Offcanvas';

interface FilterSideBarType {
  filterData: any; // to be typed
  filters: any; // to be typed
  setFilters: (arg1) => void; // to be typed
}

const FiltersSideBar = ({
  filterData,
  filters,
  setFilters,
}: FilterSideBarType) => {
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

export default FiltersSideBar;
