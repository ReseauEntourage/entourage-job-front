import React from 'react';
import PropTypes from 'prop-types';
import ButtonIcon from 'src/components/utils/ButtonIcon';

const FiltersOptions = ({ numberOfResults, resetFilters }) => {
  return (
    <div className="uk-flex uk-flex-middle uk-flex-right uk-flex-1">
      <div className="uk-text-meta uk-margin-small-right uk-text-italic">
        {numberOfResults}
        &nbsp;résultat
        {numberOfResults !== 1 ? 's' : ''}
      </div>
      <div className="uk-flex uk-flex-middle uk-flex-right">
        <div className="uk-flex uk-flex-right uk-flex-wrap uk-flex-1">
          <div className="uk-flex">
            {' '}
            &nbsp;
            <ButtonIcon ratio={0.8} name="close" onClick={resetFilters} />
          </div>
        </div>
      </div>
    </div>
  );
};

FiltersOptions.propTypes = {
  numberOfResults: PropTypes.number.isRequired,
  resetFilters: PropTypes.func.isRequired,
};

export default FiltersOptions;
