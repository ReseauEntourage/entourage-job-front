import { useRouter } from 'next/router';
import React, { useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { OpportunitiesContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer';
import { AdminOpportunitiesList } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesList/AdminOpportunitiesList';
import { AdminOpportunityDetailsContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/AdminOpportunityDetails/AdminOpportunityDetailsContainer';
import { OpportunityError } from 'src/components/backoffice/opportunities/OpportunityError';
import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId';
import { useAdminAsCandidateOpportunities } from 'src/hooks/useOpportunityList';
import { useIsDesktop, usePrevious } from 'src/hooks/utils';

interface OffersMemberTabProps {
  candidateId: string;
}

const contentHeight = 0;

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
          list={
            offers &&
            offers.length > 0 && (
              <AdminOpportunitiesList opportunities={offers} />
            )
          }
          isLoading={loading}
          details={
            <AdminOpportunityDetailsContainer
              filtersAndTabsHeight={contentHeight}
              fetchOpportunities={fetchOpportunities}
            />
          }
          noContent={
            <div className="uk-width-expand uk-flex uk-flex-center uk-flex-middle">
              Aucun résultat.
            </div>
          }
        />
      )}
    </>
  );
}
