import React from 'react';
import { OverlayLoader } from 'src/components/utils/OverlayLoader';
import PropTypes from 'prop-types';
import { useOnScroll } from 'src/hooks/utils/useOnScroll';
import { ListContainer } from './OpportunitiesList.styles';

const OpportunitiesList = React.memo(({ isLoading, list }) => {
  const { onScroll } = useOnScroll({
    onScrollBottomEnd: () => {
      console.log('BOTTOM');
      // TODO MANAGE PAGINATION
    },
  });
  return (
    <ListContainer onScroll={onScroll}>
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
