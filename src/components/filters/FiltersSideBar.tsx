import React from 'react';
import { FiltersCheckboxes } from 'src/components/filters/FiltersCheckboxes';
import { FiltersDropdowns } from 'src/components/filters/FiltersDropdowns';
import { Offcanvas } from 'src/components/utils/Offcanvas';
import { Filter, FilterObject } from 'src/constants/utils';

interface FilterSideBarProps {
  filters: FilterObject;
  setFilters: (updatedFilters: FilterObject) => void;
  filterData: Filter[];
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
