import React from 'react';

import PropTypes from 'prop-types';
import { IconNoSSR } from 'src/components/utils/Icon';
import { gaEvent } from 'src/lib/gtag.ts';
import { Button } from 'src/components/utils';
import { v4 as uuid } from 'uuid';

const uuidValue = uuid();

const FiltersDropdowns = ({
  filterData,
  filters,
  setFilters,
  hideOnMobile,
  fullWidth,
  showSeparator,
  smallSelectors,
}) => {
  const renderFilters = (filterConstants, key, tag, index) => {
    const reducedFilters = Object.values(filterConstants);

    return reducedFilters.map((filterConst, i) => {
      const indexInSelectedFilters = filters[key].findIndex((filter) => {
        return filter && filter.value === filterConst.value;
      });

      const isFilterSelected = indexInSelectedFilters > -1;

      const onFilterClick = () => {
        const updatedFilters = JSON.parse(JSON.stringify(filters));
        if (isFilterSelected) {
          // remove filter
          updatedFilters[key].splice(indexInSelectedFilters, 1);
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
            index < reducedFilters.length - 1 ? 'uk-margin-small-bottom' : ''
          }`}
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
  };

  return (
    <div className={hideOnMobile ? 'uk-visible@m' : ''}>
      {filterData.map(
        ({ title, constants, priority, key, tag, type, disabled }, index) => {
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
                      showSeparator ? 'ent-select-separator' : ''
                    }`}
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
                          {renderFilters(priority, key, tag, index)}
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
                            index
                          )}
                        </>
                      ) : (
                        renderFilters(constants, key, tag, index)
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

FiltersDropdowns.propTypes = {
  filters: PropTypes.shape({}).isRequired,
  setFilters: PropTypes.func.isRequired,
  filterData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  hideOnMobile: PropTypes.bool,
  fullWidth: PropTypes.bool,
  smallSelectors: PropTypes.bool,
  showSeparator: PropTypes.bool,
};

FiltersDropdowns.defaultProps = {
  hideOnMobile: false,
  fullWidth: false,
  showSeparator: false,
  smallSelectors: false,
};

export default FiltersDropdowns;
