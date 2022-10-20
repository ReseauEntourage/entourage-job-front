import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

const CloseButton = ({ className, onClick, dataTestId }) => {
  return (
    <button
      className={className || 'uk-offcanvas-close'}
      type="button"
      data-uk-close
      aria-label="close"
      onClick={onClick}
      data-testid={dataTestId}
    />
  );
};

CloseButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  dataTestId: PropTypes.string,
};
CloseButton.defaultProps = {
  className: undefined,
  onClick: () => {},
  dataTestId: '',
};
export const CloseButtonNoSSR = dynamic(
  () => {
    return import('src/components/utils/CloseButton');
  },
  {
    ssr: false,
  }
);

export default CloseButton;
