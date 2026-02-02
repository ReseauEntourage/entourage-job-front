import React from 'react';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { Filter, FilterObject } from 'src/constants/utils';
import {
  StyledMobileFilterItem,
  StyledMobileFilterItemActions,
  StyledMobileFilterItemCount,
  StyledMobileFilterItemTitle,
  StyledMobileFilterList,
} from './MobileFilters.styles';

interface MobileFilterListProps {
  filters: FilterObject;
  filterData: Filter[];
  onSelectFilter: (key: string) => void;
}

export const MobileFilterList = ({
  filters,
  filterData,
  onSelectFilter,
}: MobileFilterListProps) => {
  return (
    <StyledMobileFilterList>
      {filterData.map(({ title, key }) => {
        const count = filters[key] ? filters[key].length : 0;
        return (
          <StyledMobileFilterItem
            key={key}
            onClick={() => onSelectFilter(key)}
            data-testid={`mobile-filter-item-${key}`}
          >
            <StyledMobileFilterItemTitle>{title}</StyledMobileFilterItemTitle>
            <StyledMobileFilterItemActions>
              {count > 0 && (
                <StyledMobileFilterItemCount>
                  {count}
                </StyledMobileFilterItemCount>
              )}
              <LucidIcon name="ChevronRight" size={20} />
            </StyledMobileFilterItemActions>
          </StyledMobileFilterItem>
        );
      })}
    </StyledMobileFilterList>
  );
};
