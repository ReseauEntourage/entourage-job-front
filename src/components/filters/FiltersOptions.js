import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'src/components/utils/Button';

const FiltersOptions = ({ resetFilters }) => {
  return (
    <div className="uk-flex uk-flex-middle uk-flex-right uk-flex-1">
      <div className="uk-flex uk-flex-middle uk-flex-right">
        <div className="uk-flex uk-flex-right uk-flex-wrap uk-flex-1">
          <div className="uk-flex">
            {' '}
            &nbsp;
            <Button
              style="custom-secondary"
              color="primaryOrange"
              size="small"
              onClick={resetFilters}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

FiltersOptions.propTypes = {
  resetFilters: PropTypes.func.isRequired,
};

export default FiltersOptions;
