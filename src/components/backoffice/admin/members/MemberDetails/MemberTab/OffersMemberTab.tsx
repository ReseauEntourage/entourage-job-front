import { useRouter } from 'next/router';
import React, { useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { StyledNoResult } from 'src/components/backoffice/Backoffice.styles';
import { OpportunitiesContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer';
import { AdminOpportunitiesList } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesList/AdminOpportunitiesList';
import { AdminOpportunityDetailsContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/AdminOpportunityDetails/AdminOpportunityDetailsContainer';
import { OpportunityError } from 'src/components/backoffice/opportunities/OpportunityError';
import { useOpportunityId } from 'src/hooks/queryParams/useOpportunityId';
import { useAdminAsCandidateOpportunities } from 'src/hooks/useOpportunityList';
import { useIsDesktop, usePrevious } from 'src/hooks/utils';

interface OffersMemberTabProps {
  candidateId: string;
}

const filtersAndTabsHeight = 0;

export function OffersMemberTab({ candidateId }: OffersMemberTabProps) {
  const { replace } = useRouter();

  const opportunityId = useOpportunityId();
  const prevOpportunityId = usePrevious(opportunityId);

  const [offers, setOffers] = useState([]);
  const prevOffers = usePrevious(offers);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState(false);

  const fetchData = useAdminAsCandidateOpportunities(
    setOffers,
    setLoading,
    setHasError
  );

  const fetchOpportunities = async () => {
    await fetchData(candidateId);
  };

  useDeepCompareEffect(() => {
    fetchOpportunities();
  }, [fetchData]);

  const isMobile = !useIsDesktop();

  useDeepCompareEffect(() => {
    if (
      !isMobile &&
      offers &&
      offers.length > 0 &&
      ((offers !== prevOffers && !opportunityId) ||
        (opportunityId !== prevOpportunityId && !opportunityId))
    ) {
      replace(
        {
          pathname: `/backoffice/admin/membres/${candidateId}/offres${
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            offers[0].id ? `/${offers[0].id}` : ''
          }`,
        },
        undefined,
        {
          shallow: true,
        }
      );
    }
  }, [isMobile, offers, prevOffers, opportunityId, prevOpportunityId, replace]);

  return (
    <>
      {hasError ? (
        <OpportunityError />
      ) : (
        <OpportunitiesContainer
          backButtonHref={{
            pathname: `/backoffice/admin/membres/${candidateId}/offres`,
            query: {},
          }}
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          list={
            offers &&
            offers.length > 0 && (
              <AdminOpportunitiesList opportunities={offers} />
            )
          }
          isLoading={loading}
          details={
            <AdminOpportunityDetailsContainer
              filtersAndTabsHeight={filtersAndTabsHeight}
              fetchOpportunities={fetchOpportunities}
            />
          }
          noContent={<StyledNoResult>Aucun résultat</StyledNoResult>}
        />
      )}
    </>
  );
}
