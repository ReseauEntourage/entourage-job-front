import React from 'react';
import {
  Container,
  RightContainer,
} from 'src/components/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import OpportunitiesList from 'src/components/opportunities/OpportunitiesContainer/OpportunitiesList';
import PropTypes from 'prop-types';

const OpportunitiesContainerDesktop = ({
  list,
  details,
  isLoading,
  noContent,
}) => {
  return (
    <Container>
      {list ? (
        <>
          <OpportunitiesList isLoading={isLoading} list={list} />
          <RightContainer>{details}</RightContainer>
        </>
      ) : (
        noContent
      )}
    </Container>
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
