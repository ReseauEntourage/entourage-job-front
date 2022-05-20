import React from 'react';
import { Grid } from 'src/components/utils';
import { NumberCard } from 'src/components/cards';
import PropTypes from 'prop-types';

const NumberGrid = ({ numbers }) => {
  return (
    <Grid
      center
      gap="collapse"
      childWidths={[`1-3@m`]}
      items={numbers.map(({ value, description, subDescription, animate }) => {
        return (
          <div className="uk-flex uk-flex-center">
            <NumberCard
              value={value}
              description={description}
              subDescription={subDescription}
              animate={animate}
            />
          </div>
        );
      })}
    />
  );
};

NumberGrid.propTypes = {
  numbers: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.element,
      ]).isRequired,
      description: PropTypes.string.isRequired,
      subDescription: PropTypes.string,
      animate: PropTypes.bool,
    })
  ).isRequired,
};

export default NumberGrid;
