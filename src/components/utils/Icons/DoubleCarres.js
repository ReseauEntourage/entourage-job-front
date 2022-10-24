import * as React from 'react';
import PropTypes from 'prop-types';

function DoubleCarres({ color, height, width }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x={0.5}
        y={1}
        width={14.8125}
        height={13.4375}
        rx={2.5}
        stroke="#fff"
        fill={color}
      />
      <rect
        x={8.375}
        y={8.5625}
        width={14.8125}
        height={13.4375}
        rx={2.5}
        stroke="#fff"
        fill={color}
      />
    </svg>
  );
}

DoubleCarres.propTypes = {
  color: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
};

DoubleCarres.defaultProps = {
  color: 'black',
  height: 23,
  width: 24,
};

export default DoubleCarres;
