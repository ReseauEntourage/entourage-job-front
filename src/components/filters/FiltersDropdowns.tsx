import React, { useCallback } from 'react';

import { v4 as uuid } from 'uuid';
import CaretDownIcon from 'assets/icons/caret-down.svg';
import { Button, Tag } from 'src/components/utils';
import { Filter, FilterConstant, FilterObject } from 'src/constants/utils';
import { gaEvent } from 'src/lib/gtag';

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
            if (tag) gaEvent(tag);
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
          <label
            key={id}
            htmlFor={id}
            className={`uk-flex uk-flex-middle uk-text-small ${
              i < filterConstants.length - 1 ? 'uk-margin-small-bottom' : ''
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <input
              id={id}
              data-testid={
                filterConst.value ? `input-checkbox-${filterConst.value}` : ''
              }
              style={{ marginTop: 1 }}
              type="checkbox"
              className="uk-checkbox uk-margin-small-right"
              checked={isFilterSelected}
              onChange={onFilterClick}
              onKeyDown={handleKeyDown}
            />
            <div className="uk-flex-1">{filterConst.label}</div>
          </label>
        );
      });
    },
    [filters, setFilters]
  );

  return (
    <div className={hideOnMobile ? 'uk-visible@m' : ''}>
      {filterData.map(
        (
          { title, constants, priority, key, tag, type, disabled, mandatory },
          index
        ) => {
          if (filters[key]) {
            if (!type || type !== 'checkbox') {
              return (
                <div
                  key={key}
                  data-testid={`input-container-${key}`}
                  style={{ minWidth: smallSelectors ? 100 : 150 }}
                  className={`uk-inline ${
                    fullWidth ? 'uk-width-expand uk-margin-small-bottom' : ''
                  }`}
                >
                  <div
                    className={`uk-inline ent-select-search ${
                      smallSelectors ? 'ent-select-search-no-padding' : ''
                    } ${showSeparator ? 'ent-select-separator' : ''}`}
                    style={{ opacity: disabled ? 0.6 : 1 }}
                  >
                    <Button
                      toggle={`target: #dropdown-filters-toggle-${key}`}
                      disabled={disabled}
                      style="text"
                      className={`uk-width-expand ${
                        filters[key].length === 0 ? 'uk-text-muted' : ''
                      }`}
                    >
                      <span className="uk-width-expand uk-text-left uk-flex uk-flex-middle uk-margin-small-right">
                        {title}
                      </span>
                      {filters[key].length > 0 && (
                        <div>
                          &nbsp;
                          <Tag
                            size="small"
                            style="secondary"
                            content={filters[key].length}
                          />
                          &nbsp;
                        </div>
                      )}
                      <CaretDownIcon />
                    </Button>
                    <div
                      id={`dropdown-filters-toggle-${key}`}
                      data-uk-dropdown="mode: click;"
                      className="uk-height-max-medium uk-overflow-auto uk-width-medium"
                    >
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
                    </div>
                  </div>
                </div>
              );
            }
          }
          return undefined;
        }
      )}
    </div>
  );
};
