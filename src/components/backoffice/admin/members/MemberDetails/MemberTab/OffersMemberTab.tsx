import { useRouter } from 'next/router';
import React, { useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { Opportunity } from 'src/api/types';
import { OpportunitiesContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer';
import { AdminOpportunitiesList } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesList/AdminOpportunitiesList';
import { AdminOpportunityDetailsContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/AdminOpportunityDetails/AdminOpportunityDetailsContainer';
import { OpportunityError } from 'src/components/backoffice/opportunities/OpportunityError';
import { useAdminOpportunities } from 'src/hooks/useOpportunityList';
import { useIsDesktop, usePrevious } from 'src/hooks/utils';

interface OffersMemberTabProps {
  candidateId: string;
}

export function OffersMemberTab({ candidateId }: OffersMemberTabProps) {
  const {
    replace,
    query: { offerId: opportunityId },
  } = useRouter();

  const [offers, setOffers] = useState([]);
  const prevOffers = usePrevious(offers) as Opportunity[];
  const [loading, setLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState(false);
  const [hasFetchedAll, setHasFetchedAll] = useState(false);
  const [offset, setOffset] = useState<number>(0); // will allways be 0
  const fetchData = useAdminOpportunities(
    setOffers,
    setLoading,
    setHasError,
    setHasFetchedAll
  );

  const fetchOpportunities = async (shouldFetchAll?: boolean) => {
    await fetchData(
      null,
      null,
      offset,
      shouldFetchAll,
      null,
      'candidateAsAdmin',
      candidateId
    );
  };

  useDeepCompareEffect(() => {
    if (offset === 0 || !hasFetchedAll) {
      fetchOpportunities();
    }
  }, [fetchData, offset]);

  const isMobile = !useIsDesktop();
  useDeepCompareEffect(() => {
    if (
      !isMobile &&
      candidateId &&
      offers &&
      offers.length > 0 &&
      offers[0] !== prevOffers?.[0]
    ) {
      replace(
        {
          pathname: `/backoffice/admin/membres/${candidateId}/offres/${
            offers[0].id ? `${offers[0].id}` : ''
          }`,
          query: {},
        },
        undefined,
        {
          shallow: true,
        }
      );
    }
  }, [offers, opportunityId, replace, isMobile, candidateId]);

  return (
    <>
      {hasError ? (
        <OpportunityError />
      ) : (
        <OpportunitiesContainer
          list={
            offers && offers.length > 0 ? (
              <AdminOpportunitiesList
                setOffset={setOffset}
                opportunities={offers}
              />
            ) : null
          }
          isLoading={loading}
          details={
            <AdminOpportunityDetailsContainer
              fetchOpportunities={async () => {
                await fetchOpportunities(true);
              }}
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
