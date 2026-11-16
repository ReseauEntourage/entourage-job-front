import React from 'react';
import { Filter, FilterObject } from '@/src/constants/utils';
import { gaEvent } from '@/src/lib/gtag';
import {
  StyledFiltersCheckbox,
  StyledFiltersCheckboxCell,
  StyledFiltersCheckboxLabel,
  StyledFiltersCheckboxesRoot,
  StyledFiltersCheckboxTitle,
} from './FiltersCheckboxes.styles';

interface FiltersCheckboxesProps {
  filters: FilterObject;
  setFilters: (updatedFilters: FilterObject) => void;
  filterData: Filter[];
  hideOnMobile?: boolean;
  fullWidth?: boolean;
}

export const FiltersCheckboxes = ({
  filterData,
  filters,
  setFilters,
  hideOnMobile,
  fullWidth,
}: FiltersCheckboxesProps) => {
  return (
    <StyledFiltersCheckboxesRoot $hideOnMobile={hideOnMobile}>
      {filterData.map(({ title, constants, key, tag, type, disabled }) => {
        if (filters[key]) {
          if (type && type === 'checkbox') {
            return (
              <StyledFiltersCheckboxCell key={key} $fullWidth={fullWidth}>
                <StyledFiltersCheckboxLabel
                  htmlFor={key}
                  style={{ opacity: disabled ? 0.6 : 1 }}
                >
                  <StyledFiltersCheckboxTitle>
                    {title}
                  </StyledFiltersCheckboxTitle>
                  <StyledFiltersCheckbox
                    disabled={disabled}
                    id={key}
                    checked={filters[key].length > 0 && !filters[key][0].value}
                    onChange={(e) => {
                      const updatedFilters = JSON.parse(
                        JSON.stringify(filters)
                      );
                      updatedFilters[key] = e.target.checked
                        ? [constants[0]]
                        : [];
                      if (tag) {
                        gaEvent(tag);
                      }
                      setFilters(updatedFilters);
                    }}
                  />
                </StyledFiltersCheckboxLabel>
              </StyledFiltersCheckboxCell>
            );
          }
        }
        return undefined;
      })}
    </StyledFiltersCheckboxesRoot>
  );
};

FiltersCheckboxes.defaultProps = {
  hideOnMobile: false,
  fullWidth: false,
};
