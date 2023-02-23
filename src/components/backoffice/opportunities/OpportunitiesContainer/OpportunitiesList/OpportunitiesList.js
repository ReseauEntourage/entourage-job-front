import React from 'react';
import { OverlayLoader } from 'src/components/utils/OverlayLoader';
import PropTypes from 'prop-types';
import { StyledListContainer } from './OpportunitiesList.styles';

const OpportunitiesList = React.memo(({ isLoading, list }) => {
  return (
    <StyledListContainer>
      {list}
      {isLoading && <OverlayLoader />}
    </StyledListContainer>
  );
});

OpportunitiesList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  list: PropTypes.element.isRequired,
};

export default OpportunitiesList;
