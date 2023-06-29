import React from 'react';
import { FiltersCheckboxes } from 'src/components/filters/FiltersCheckboxes';
import { FiltersDropdowns } from 'src/components/filters/FiltersDropdowns';
import { Offcanvas } from 'src/components/utils/Offcanvas';
import { AnyToFix } from 'src/utils/Types';

interface FilterSideBarProps {
  filterData: AnyToFix; // to be typed
  filters: AnyToFix; // to be typed
  setFilters: (arg1: AnyToFix) => void; // to be typed
}

export const FiltersSideBar = ({
  filterData,
  filters,
  setFilters,
}: FilterSideBarProps) => {
  return (
    <Offcanvas
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
    </Offcanvas>
  );
};
