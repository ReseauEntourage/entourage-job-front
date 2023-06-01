import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import { v4 as uuid } from 'uuid';
import { Button } from 'src/components/utils';
import { IconNoSSR } from 'src/components/utils/Icon';
import { gaEvent } from 'src/lib/gtag';
import { AnyToFix } from 'src/utils/Types';

const uuidValue = uuid();

interface FiltersDropdownProps {
  filters: AnyToFix; // to be typed
  setFilters: (arg1: AnyToFix) => void; // to be typed
  filterData: AnyToFix; // to be typed
  hideOnMobile?: boolean;
  fullWidth?: boolean;
  smallSelectors?: boolean;
  showSeparator?: boolean;
}

const FiltersDropdowns = ({
  filterData,
  filters,
  setFilters,
  hideOnMobile,
  fullWidth,
  showSeparator,
  smallSelectors,
}: FiltersDropdownProps) => {
  const renderFilters = useCallback(
    (filterConstants, key, tag, mandatory, index) => {
      const reducedFilters: { value: string; label: string }[] =
        Object.values(filterConstants); // to be typed properly

      return reducedFilters.map((filterConst, i) => {
        const indexInSelectedFilters = filters[key].findIndex(
          (filter: { value: string }) => {
            return filter && filter.value === filterConst.value;
          }
        );

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

        const id = `${key}-${index}-${i}-${uuidValue}`;

        return (
          <label
            key={id}
            htmlFor={id}
            className={`uk-flex uk-flex-middle uk-text-small ${
              i < reducedFilters.length - 1 ? 'uk-margin-small-bottom' : ''
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
                    className={`ent-select-search ${
                      smallSelectors ? 'ent-select-search-no-padding' : ''
                    } ${showSeparator ? 'ent-select-separator' : ''}`}
                    style={{ opacity: disabled ? 0.6 : 1 }}
                  >
                    <Button
                      disabled={disabled}
                      style="text"
                      className={`uk-width-expand ${
                        filters[key].length === 0 ? 'uk-text-muted' : ''
                      }`}
                    >
                      {/* {icon && (
                  <IconNoSSR
                    name={icon}
                    ratio={0.7}
                    className="uk-margin-small-right"
                  />
                )} */}
                      <span className="uk-width-expand uk-text-left uk-flex uk-flex-middle uk-margin-small-right">
                        {title}
                      </span>
                      {filters[key].length > 0 && (
                        <div>
                          &nbsp;
                          <div className="uk-badge">{filters[key].length}</div>
                        </div>
                      )}
                      <IconNoSSR name="triangle-down" />
                    </Button>
                    <div
                      data-uk-dropdown="mode: click;"
                      className="uk-height-max-medium uk-overflow-auto uk-width-medium"
                    >
                      {priority && priority.length > 0 ? (
                        <>
                          {renderFilters(priority, key, tag, mandatory, index)}
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
                            index
                          )}
                        </>
                      ) : (
                        renderFilters(constants, key, tag, mandatory, index)
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

FiltersDropdowns.defaultProps = {
  hideOnMobile: false,
  fullWidth: false,
  showSeparator: false,
  smallSelectors: false,
};

export default FiltersDropdowns;
