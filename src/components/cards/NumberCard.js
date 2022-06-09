import React from 'react';
import PropTypes from 'prop-types';
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';

const AnimatedNumber = ({ value }) => {
  return (
    <VisibilitySensor partialVisibility>
      {({ isVisible }) => {
        return (
          <div style={{ minHeight: 1 }}>
            {isVisible ? <CountUp duration={5} end={value} preserveValue /> : 0}
          </div>
        );
      }}
    </VisibilitySensor>
  );
};

AnimatedNumber.propTypes = {
  value: PropTypes.number.isRequired,
};

const NumberCard = ({ value, description, subDescription, animate }) => {
  return (
    <div className="uk-card uk-card-body uk-card-small uk-flex uk-flex-middle uk-flex-center uk-width-medium">
      <div className="uk-flex uk-flex-column uk-flex-middle">
        <div className="ent-number uk-text-primary uk-text-bold uk-text-center">
          {value.toString().length > 6 ? (
            <span className="uk-text-primary uk-text-large">
              {animate ? <AnimatedNumber value={value} /> : value}
            </span>
          ) : (
            <span
              className="uk-h1 uk-text-primary uk-text-nowrap"
              style={{
                fontSize: '4rem',
              }}
            >
              {animate ? <AnimatedNumber value={value} /> : value}
            </span>
          )}
        </div>
        <div className="ent-number-description uk-text-center">
          <h4 className="uk-text-bold uk-margin-remove">{description}</h4>
          {subDescription && (
            <p className="uk-text-meta uk-text-small uk-text-italic uk-margin-remove">
              {subDescription}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
NumberCard.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  description: PropTypes.string.isRequired,
  subDescription: PropTypes.string,
  animate: PropTypes.bool,
};

NumberCard.defaultProps = {
  subDescription: undefined,
  animate: false,
};
export default NumberCard;
