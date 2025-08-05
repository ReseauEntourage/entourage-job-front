import React from 'react';
import { CheckBox } from 'src/components/utils/Inputs/CheckBox/CheckBox';
import { Filter, FilterConstant, FilterObject } from 'src/constants/utils';
import { gaEvent } from 'src/lib/gtag';
import {
  StyledCheckboxContainer,
  StyledMobileFilterOption,
  StyledMobileFilterOptions,
} from './MobileFilters.styles';

interface MobileFilterOptionsProps {
  currentFilter: Filter;
  filters: FilterObject;
  setFilters: (updatedFilters: FilterObject) => void;
}

export const MobileFilterOptions = ({
  currentFilter,
  filters,
  setFilters,
}: MobileFilterOptionsProps) => {
  const { key, constants, tag } = currentFilter;

  const handleFilterChange = (
    filterConst: FilterConstant,
    isChecked: boolean
  ) => {
    const updatedFilters = { ...filters };
    const indexInSelectedFilters = filters[key].findIndex(
      (filter) => filter && filter.value === filterConst.value
    );

    if (isChecked) {
      // Add filter if not already included
      if (indexInSelectedFilters === -1) {
        updatedFilters[key] = [...updatedFilters[key], filterConst];
        if (tag) gaEvent(tag);
      }
    } else if (indexInSelectedFilters > -1) {
      // Remove filter if included
      updatedFilters[key] = updatedFilters[key].filter(
        (_, index) => index !== indexInSelectedFilters
      );
    }

    setFilters(updatedFilters);
  };

  return (
    <StyledMobileFilterOptions>
      {constants.map((filterConst) => {
        const isChecked = filters[key].some(
          (filter) => filter && filter.value === filterConst.value
        );

        return (
          <StyledMobileFilterOption key={`${key}-${filterConst.value}`}>
            <span>{filterConst.label}</span>
            <StyledCheckboxContainer>
              <CheckBox
                id={`mobile-filter-${key}-${filterConst.value}`}
                name={`mobile-filter-${key}`}
                value={isChecked}
                onChange={(checked) => {
                  handleFilterChange(filterConst, checked);
                }}
                useOutsideOfForm
                data-testid={`mobile-filter-checkbox-${filterConst.value}`}
              />
            </StyledCheckboxContainer>
          </StyledMobileFilterOption>
        );
      })}
    </StyledMobileFilterOptions>
  );
};
