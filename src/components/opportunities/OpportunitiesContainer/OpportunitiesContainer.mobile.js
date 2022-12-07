import React from 'react';
import {
  BackLink,
  Container,
  DetailsContainer,
} from 'src/components/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import { useOpportunityId } from 'src/components/opportunities/OpportunitiesContainer/useOpportunityId';
import PropTypes from 'prop-types';
import OpportunitiesList from 'src/components/opportunities/OpportunitiesContainer/OpportunitiesList';
import Link from 'next/link';
import { IconNoSSR } from 'src/components/utils/Icon';

const OpportunitiesContainerMobile = ({
  list,
  details,
  isLoading,
  backButtonHref,
  noContent,
}) => {
  const opportunityId = useOpportunityId();

  return (
    <Container>
      {list ? (
        <>
          {opportunityId ? (
            <DetailsContainer>
              <Link href={backButtonHref} scroll={false} shallow passHref>
                <BackLink>
                  <IconNoSSR name="chevron-left" />
                  Retour à la liste
                </BackLink>
              </Link>
              {details}
            </DetailsContainer>
          ) : (
            <OpportunitiesList isLoading={isLoading} list={list} />
          )}
        </>
      ) : (
        noContent
      )}
    </Container>
  );
};

OpportunitiesContainerMobile.defaultProps = {
  list: null,
};

OpportunitiesContainerMobile.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  list: PropTypes.element,
  details: PropTypes.element.isRequired,
  noContent: PropTypes.element.isRequired,
  backButtonHref: PropTypes.shape({
    pathname: PropTypes.string,
    query: PropTypes.shape({}),
  }).isRequired,
};

export default OpportunitiesContainerMobile;
