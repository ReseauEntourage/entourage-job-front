import React from 'react';
import { Filter, FilterObject } from 'src/constants/utils';
import { gaEvent } from 'src/lib/gtag';

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
    <div
      className={`uk-flex uk-flex-middle ${
        hideOnMobile ? 'uk-visible@m' : ''
      } uk-margin-small-bottom`}
    >
      {filterData.map(({ title, constants, key, tag, type, disabled }) => {
        if (filters[key]) {
          if (type && type === 'checkbox') {
            return (
              <div key={key} className={fullWidth ? 'uk-flex-1' : ''}>
                <label
                  htmlFor={key}
                  className="uk-flex uk-flex-middle uk-text-small"
                  style={{ height: 20, opacity: disabled ? 0.6 : 1 }}
                >
                  <div className="uk-flex-1">{title}</div>
                  <input
                    disabled={disabled}
                    id={key}
                    style={{ marginTop: 2 }}
                    type="checkbox"
                    className="uk-checkbox uk-margin-small-left"
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
                </label>
              </div>
            );
          }
        }
        return undefined;
      })}
    </div>
  );
};

FiltersCheckboxes.defaultProps = {
  hideOnMobile: false,
  fullWidth: false,
};
