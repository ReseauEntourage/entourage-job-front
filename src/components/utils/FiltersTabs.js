import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'src/components/utils/Grid';

const FiltersTabs = ({ tabFilters, setTabFilters }) => {
  return (
    <div>
      <Grid eachWidths={['expand', 'auto']}>
        <ul className="uk-subnav ent-subnav">
          {tabFilters.map(({ title, tag, active }, i) => {
            return (
              <li key={`filter-${i}`} className={active ? 'uk-active' : ''}>
                <a
                  onClick={() => {
                    return setTabFilters(tag);
                  }}
                >
                  {title}
                </a>
              </li>
            );
          })}
        </ul>
      </Grid>
    </div>
  );
};
FiltersTabs.propTypes = {
  setTabFilters: PropTypes.func.isRequired,
  tabFilters: PropTypes.arrayOf(PropTypes.shape()),
};

FiltersTabs.defaultProps = {
  tabFilters: [],
};

export default FiltersTabs;
