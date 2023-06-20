import React from 'react';
import {
  StyledBackLink,
  StyledContainer,
  StyledDetailsContainer,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId.ts';
import PropTypes from 'prop-types';
import OpportunitiesList from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesList';
import Link from 'next/link';
import { IconNoSSR } from 'src/components/utils';

const OpportunitiesContainerMobile = ({
  list,
  details,
  isLoading,
  backButtonHref,
  noContent,
}) => {
  const opportunityId = useOpportunityId();

  return (
    <StyledContainer>
      {list ? (
        <>
          {opportunityId ? (
            <StyledDetailsContainer>
              <Link href={backButtonHref} scroll={false} shallow passHref>
                <StyledBackLink>
                  <IconNoSSR name="chevron-left" />
                  Retour à la liste
                </StyledBackLink>
              </Link>
              {details}
            </StyledDetailsContainer>
          ) : (
            <OpportunitiesList isLoading={isLoading} list={list} />
          )}
        </>
      ) : (
        noContent
      )}
    </StyledContainer>
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
