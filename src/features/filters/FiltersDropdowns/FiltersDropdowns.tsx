import React, { useCallback } from 'react';

import { v4 as uuid } from 'uuid';
import {
  Button,
  LucidIcon,
  Tag,
  TagSize,
  TagVariant,
} from '@/src/components/ui';
import { Filter, FilterConstant, FilterObject } from '@/src/constants/utils';
import { gaEvent } from '@/src/lib/gtag';
import { FilterDropdownBox } from '../FilterDropdownBox';
import {
  StyledDropdownContainer,
  StyledFilterDropdownPanel,
  StyledFilterOption,
  StyledFilterOptionCheckbox,
  StyledFilterOptionLabel,
  StyledFilterToggleTitle,
  StyledFiltersRoot,
} from './FiltersDropdowns.styles';

const uuidValue1 = uuid();
const uuidValue2 = uuid();

interface FiltersDropdownProps {
  filters: FilterObject;
  setFilters: (updatedFilters: FilterObject) => void;
  filterData: Filter[];
  hideOnMobile?: boolean;
  fullWidth?: boolean;
  smallSelectors?: boolean;
  showSeparator?: boolean;
}

export const FiltersDropdowns = ({
  filterData,
  filters,
  setFilters,
  hideOnMobile,
  fullWidth,
  showSeparator,
  smallSelectors,
}: FiltersDropdownProps) => {
  const renderFilters = useCallback(
    (
      filterConstants: FilterConstant[],
      key: string,
      tag?: { action: string },
      mandatory?: boolean,
      uuidValue?: string
    ) => {
      return filterConstants.map((filterConst, i) => {
        const indexInSelectedFilters = filters[key].findIndex((filter) => {
          return filter && filter.value === filterConst.value;
        });

        const isFilterSelected = indexInSelectedFilters > -1;

        const onFilterClick = () => {
          const updatedFilters = JSON.parse(JSON.stringify(filters));
          if (isFilterSelected) {
            if (!mandatory || filters[key].length > 1) {
              // remove filter
              updatedFilters[key].splice(indexInSelectedFilters, 1);
            }
          } else {
            // add filter
            updatedFilters[key].push(filterConst);
            if (tag) {
              gaEvent(tag);
            }
          }

          setFilters(updatedFilters);
        };

        const handleKeyDown = (ev) => {
          if (ev.key === 'Enter') {
            onFilterClick();
          }
        };

        const id = `${key}-${i}-${uuidValue}`;

        return (
          <StyledFilterOption
            key={id}
            htmlFor={id}
            $spaced={i < filterConstants.length - 1}
            onClick={(event) => event.stopPropagation()}
          >
            <StyledFilterOptionCheckbox
              id={id}
              data-testid={
                filterConst.value ? `input-checkbox-${filterConst.value}` : ''
              }
              checked={isFilterSelected}
              onChange={onFilterClick}
              onKeyDown={handleKeyDown}
            />
            <StyledFilterOptionLabel>
              {filterConst.label}
            </StyledFilterOptionLabel>
          </StyledFilterOption>
        );
      });
    },
    [filters, setFilters]
  );

  return (
    <StyledFiltersRoot $hideOnMobile={hideOnMobile}>
      {filterData.map(
        (
          { title, constants, priority, key, tag, type, disabled, mandatory },
          index
        ) => {
          if (filters[key]) {
            if (!type || type !== 'checkbox') {
              return (
                <FilterDropdownBox
                  key={key}
                  dataTestId={`input-container-${key}`}
                  fullWidth={fullWidth}
                >
                  {({ isOpen, toggle }) => (
                    <StyledDropdownContainer
                      disabled={disabled}
                      $smallSelectors={smallSelectors}
                      $showSeparator={showSeparator}
                    >
                      <Button
                        disabled={disabled}
                        variant="text"
                        size="small"
                        color="mediumGray"
                        onClick={toggle}
                      >
                        <StyledFilterToggleTitle>
                          {title}
                        </StyledFilterToggleTitle>
                        {filters[key].length > 0 && (
                          <div>
                            &nbsp;
                            <Tag
                              size={TagSize.Small}
                              variant={TagVariant.Secondary}
                            >
                              {filters[key].length}
                            </Tag>
                            &nbsp;
                          </div>
                        )}
                        <LucidIcon name="ChevronDown" />
                      </Button>
                      <StyledFilterDropdownPanel $open={isOpen}>
                        {priority && priority.length > 0 ? (
                          <>
                            {renderFilters(
                              priority,
                              key,
                              tag,
                              mandatory,
                              `${index}-${uuidValue1}`
                            )}
                            <hr />
                            {renderFilters(
                              constants.filter((filterConst) => {
                                return !priority
                                  .map((prioConst) => {
                                    return prioConst.value;
                                  })
                                  .includes(filterConst.value);
                              }),
                              key,
                              tag,
                              mandatory,
                              `${index}-${uuidValue2}`
                            )}
                          </>
                        ) : (
                          renderFilters(
                            constants,
                            key,
                            tag,
                            mandatory,
                            `${index}-${uuidValue1}`
                          )
                        )}
                      </StyledFilterDropdownPanel>
                    </StyledDropdownContainer>
                  )}
                </FilterDropdownBox>
              );
            }
          }
          return undefined;
        }
      )}
    </StyledFiltersRoot>
  );
};
