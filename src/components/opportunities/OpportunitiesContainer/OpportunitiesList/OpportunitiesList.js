import React from 'react';
import { OverlayLoader } from 'src/components/utils/OverlayLoader';
import PropTypes from 'prop-types';
import { ListContainer } from './OpportunitiesList.styles';

const OpportunitiesList = React.memo(({ isLoading, opportunities }) => {
  return (
    <ListContainer>
      {opportunities}
      {isLoading && <OverlayLoader />}
    </ListContainer>
  );
});

OpportunitiesList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  opportunities: PropTypes.arrayOf(PropTypes.element).isRequired,
};

export default OpportunitiesList;
