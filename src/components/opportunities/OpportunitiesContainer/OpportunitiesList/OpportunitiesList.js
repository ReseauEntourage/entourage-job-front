import React from 'react';
import { OverlayLoader } from 'src/components/utils/OverlayLoader';
import PropTypes from 'prop-types';
import { ListContainer } from './OpportunitiesList.styles';

const OpportunitiesList = React.memo(({ isLoading, list }) => {
  return (
    <ListContainer>
      {list}
      {isLoading && <OverlayLoader />}
    </ListContainer>
  );
});

OpportunitiesList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  list: PropTypes.arrayOf(PropTypes.element).isRequired,
};

export default OpportunitiesList;
