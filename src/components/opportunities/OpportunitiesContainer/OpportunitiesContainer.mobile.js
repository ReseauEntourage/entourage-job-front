import React from 'react';
import {
  BackLink,
  Container,
  DetailsContainer,
} from 'src/components/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import { useOpportunityId } from 'src/components/opportunities/OpportunitiesContainer/useOpportunityId';
import PropTypes from 'prop-types';
import OpportunityDetails from 'src/components/opportunities/OpportunitiesContainer/OpportunityDetails';
import NoOpportunities from 'src/components/opportunities/OpportunitiesContainer/NoOpportunities/NoOpportunities';
import OpportunitiesList from 'src/components/opportunities/OpportunitiesContainer/OpportunitiesList';
import Link from 'next/link';
import { IconNoSSR } from 'src/components/utils/Icon';

const OpportunitiesContainerMobile = ({
  opportunities,
  isLoading,
  status,
  backButtonHref,
}) => {
  const opportunityId = useOpportunityId();

  return (
    <Container>
      {opportunities ? (
        <>
          {opportunityId ? (
            <DetailsContainer>
              <Link href={backButtonHref} scroll={false} shallow passHref>
                <BackLink>
                  <IconNoSSR name="chevron-left" />
                  Retour à la liste
                </BackLink>
              </Link>
              <OpportunityDetails opportunityId={opportunityId} />
            </DetailsContainer>
          ) : (
            <OpportunitiesList
              isLoading={isLoading}
              opportunities={opportunities}
            />
          )}
        </>
      ) : (
        <NoOpportunities status={status} />
      )}
    </Container>
  );
};

OpportunitiesContainerMobile.defaultProps = {
  opportunities: null,
};

OpportunitiesContainerMobile.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  opportunities: PropTypes.element,
  backButtonHref: PropTypes.shape({
    pathname: PropTypes.string,
    query: PropTypes.shape({}),
  }).isRequired,
  status: PropTypes.oneOf([
    'à traiter',
    'consultée',
    "en phase d'entretien",
    'abandonnée',
    'acceptées',
  ]).isRequired,
};

export default OpportunitiesContainerMobile;
