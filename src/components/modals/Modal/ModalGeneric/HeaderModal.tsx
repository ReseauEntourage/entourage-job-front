import React from 'react';
import { StyledHeaderModal } from 'src/components/modals/Modal/Modals.styles';

const HeaderModal = ({
  title,
  description,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
}) => {
  return (
    <StyledHeaderModal>
      {title && (
        <div className="title-container">
          <h3>{title}</h3>
        </div>
      )}
      {description ? (
        <div className="description-container">
          <div>{description}</div>
        </div>
      ) : (
        <div className="simple-margin" />
      )}
    </StyledHeaderModal>
  );
};
HeaderModal.defaultProps = {
  description: '',
};

export default HeaderModal;
