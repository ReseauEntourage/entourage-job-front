import React from 'react';
import PropTypes from 'prop-types';
import { StyledHeaderModal } from 'src/components/modals/Modal/Modals.styles';

const HeaderModal = ({ title, description }) => {
  return (
    <>
      {title ? (
        <StyledHeaderModal>
          <div className="title-container">
            <h3>{title}</h3>
          </div>
          {description ? (
            <div className="description-container">
              <div>{description}</div>
            </div>
          ) : (
            <div className="simple-margin" />
          )}
        </StyledHeaderModal>
      ) : null}
    </>
  );
};
HeaderModal.propTypes = {
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  description: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
};
export default HeaderModal;
