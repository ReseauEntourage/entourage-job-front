import React from 'react';
import { Grid } from 'src/components/utils';
import { NumberCard } from 'src/components/cards';
import PropTypes from 'prop-types';

const NumberGrid = ({ numbers, numbersPerRow }) => {
  return (
    <div uk-height-match="target: .ent-number, .ent-number-description">
      <Grid
        center
        middle
        gap="small"
        childWidths={[`1-${numbersPerRow}@m`]}
        items={numbers.map(
          ({ value, description, subDescription, animate }) => {
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
          }
        )}
      />
    </div>
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
  numbersPerRow: PropTypes.number,
};

NumberGrid.defaultProps = {
  numbersPerRow: 3,
};

export default NumberGrid;
