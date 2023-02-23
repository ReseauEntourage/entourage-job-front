import React from 'react';
import {
  StyledContainer,
  StyledRightContainer,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import OpportunitiesList from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesList';
import PropTypes from 'prop-types';
import { OverlayLoader } from 'src/components/utils/OverlayLoader';

const OpportunitiesContainerDesktop = ({
  list,
  details,
  isLoading,
  noContent,
}) => {
  return (
    <StyledContainer>
      {!list && isLoading && <OverlayLoader />}
      {!list && !isLoading && noContent}
      {list && (
        <>
          <OpportunitiesList isLoading={isLoading} list={list} />
          <StyledRightContainer>{details}</StyledRightContainer>
        </>
      )}
    </StyledContainer>
  );
};

OpportunitiesContainerDesktop.defaultProps = {
  list: null,
};

OpportunitiesContainerDesktop.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  list: PropTypes.element,
  details: PropTypes.element.isRequired,
  noContent: PropTypes.element.isRequired,
};

export default OpportunitiesContainerDesktop;
