import _ from 'lodash';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import PlusIcon from 'assets/icons/plus.svg';
import { StyledNoResult } from 'src/components/backoffice/Backoffice.styles';
import { CandidateOffersTab } from 'src/components/backoffice/candidate/CandidateOpportunities/CandidateOffersTab';
import {
  candidateSearchFilters,
  TextVariables,
} from 'src/components/backoffice/candidate/CandidateOpportunities/CandidateOpportunities.utils';
import { OpportunitiesContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer';
import { NoOpportunities } from 'src/components/backoffice/opportunities/OpportunitiesContainer/NoOpportunities';
import { CandidateOpportunitiesList } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesList/CandidateOpportunitiesList';
import { CandidateOpportunityDetailsContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/CandidateOpportunityDetails';
import { OpportunityError } from 'src/components/backoffice/opportunities/OpportunityError';
import { SearchBar } from 'src/components/filters/SearchBar/SearchBar';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { openModal } from 'src/components/modals/Modal';
import { ModalExternalOffer } from 'src/components/modals/Modal/ModalGeneric/OfferModals/ModalOffer';
import { Button, Section } from 'src/components/utils';
import { OPPORTUNITY_FILTERS_DATA } from 'src/constants';
import { FilterObject } from 'src/constants/utils';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useOpportunityId } from 'src/hooks/queryParams/useOpportunityId';
import { useOpportunityType } from 'src/hooks/queryParams/useOpportunityType';
import { useQueryParamsOpportunities } from 'src/hooks/queryParams/useQueryParamsOpportunities';
import { useCandidateOpportunities } from 'src/hooks/useOpportunityList';
import { usePrevious } from 'src/hooks/utils';
import { tabs } from './CandidateOffersTab/CandidateOffersTab.utils';
import { useTabsCount } from './useTabsCount';
import { useUpdateOpportunityStatus } from './useUpdateOpportunityStatus';

interface CandidateOpportunitiesProps {
  search?: string;
  filters: FilterObject<typeof OPPORTUNITY_FILTERS_DATA>;
  setFilters?: (
    updatedFilters: FilterObject<typeof OPPORTUNITY_FILTERS_DATA>
  ) => void;
  resetFilters?: () => void;
  setSearch?: (updatedSearch?: string) => void;
  candidateId: string;
  isMobile?: boolean;
}

export const CandidateOpportunities = ({
  search,
  filters,
  setFilters = () => {},
  setSearch = () => {},
  resetFilters = () => {},
  candidateId,
  isMobile = false,
}: CandidateOpportunitiesProps) => {
  const { replace } = useRouter();

  const user = useAuthenticatedUser();

  const opportunityId = useOpportunityId();
  const prevOpportunityId = usePrevious(opportunityId);
  const opportunityType = useOpportunityType();
  const prevOpportunityType = usePrevious(opportunityType);

  const isPublic = opportunityType === 'public';

  const filtersAndTabsHeight = 0;

  const [offset, setOffset] = useState<number>(0);
  const [hasFetchedAll, setHasFetchedAll] = useState(false);

  const [offers, setOffers] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  const queryParamsOpportunities = useQueryParamsOpportunities();
  const prevStatus = usePrevious(queryParamsOpportunities.status);

  useUpdateOpportunityStatus();

  const fetchData = useCandidateOpportunities(
    setOffers,
    setLoading,
    setHasError,
    setHasFetchedAll
  );

  const prevOffers = usePrevious(offers);

  useDeepCompareEffect(() => {
    if (
      !isMobile &&
      offers.length > 0 &&
      ((offers !== prevOffers && !opportunityId) ||
        (opportunityId !== prevOpportunityId &&
          !opportunityId &&
          _.isEqual(queryParamsOpportunities.status, prevStatus) &&
          opportunityType === prevOpportunityType))
    ) {
      replace(
        {
          pathname: `/backoffice/candidat/${candidateId}/offres/${opportunityType}${
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            offers[0].id ? `/${offers[0].id}` : ''
          }`,
          query: queryParamsOpportunities,
        },
        undefined,
        {
          shallow: true,
        }
      );
    }
  }, [
    isMobile,
    offers,
    prevOffers,
    opportunityId,
    prevOpportunityId,
    opportunityType,
    prevOpportunityType,
    queryParamsOpportunities,
    prevStatus,
    replace,
  ]);

  const { tabCounts, fetchTabsCount } = useTabsCount(candidateId);

  const fetchOpportunities = async (shouldFetchAll?: boolean) => {
    await fetchData(
      candidateId,
      search,
      opportunityType,
      filters,
      offset,
      shouldFetchAll
    );
    if (opportunityType === 'private') {
      await fetchTabsCount();
    }
  };

  const resetOffset = async () => {
    setOffset(0);
    setHasFetchedAll(false);
  };

  useDeepCompareEffect(() => {
    if (offset === 0 || !hasFetchedAll) {
      fetchOpportunities();
    }
  }, [
    candidateId,
    fetchData,
    filters,
    opportunityType,
    hasFetchedAll,
    offset,
    search,
  ]);

  useDeepCompareEffect(() => {
    resetOffset();
  }, [candidateId, fetchData, filters, opportunityType, search]);

  return (
    <>
      {!(isMobile && opportunityId) && (
        <>
          <HeaderBackoffice
            title={`${
              TextVariables.title[user.role][isPublic ? 'all' : 'mine']
            }`}
            description={
              TextVariables.description[user.role][isPublic ? 'all' : 'mine']
            }
            noSeparator
          >
            <Button
              style="primary"
              dataTestId="candidat-add-offer-main"
              onClick={() => {
                openModal(
                  <ModalExternalOffer
                    fetchOpportunities={resetOffset}
                    candidateId={candidateId}
                  />
                );
              }}
            >
              <PlusIcon />
              Ajouter une offre
            </Button>
          </HeaderBackoffice>
          {isPublic ? (
            <Section className="custom-primary">
              <SearchBar
                filtersConstants={candidateSearchFilters}
                filters={filters}
                resetFilters={resetFilters}
                search={search}
                setSearch={setSearch}
                setFilters={setFilters}
                placeholder="Rechercher..."
              />
            </Section>
          ) : (
            <Section className="custom-primary">
              <CandidateOffersTab
                activeStatus={filters.status}
                tabCounts={tabCounts}
                candidateId={candidateId}
                isMobile={isMobile}
              />
            </Section>
          )}
        </>
      )}
      <>
        {hasError ? (
          <OpportunityError />
        ) : (
          <OpportunitiesContainer
            backButtonHref={{
              pathname: `/backoffice/candidat/${candidateId}/offres/${opportunityType}`,
              query: queryParamsOpportunities,
            }}
            list={
              offers.length > 0 ? (
                <CandidateOpportunitiesList
                  hasFetchedAll={hasFetchedAll}
                  setOffset={setOffset}
                  opportunities={offers}
                  fetchOpportunities={resetOffset}
                  candidateId={candidateId}
                />
              ) : null
            }
            isLoading={loading}
            details={
              <CandidateOpportunityDetailsContainer
                filtersAndTabsHeight={filtersAndTabsHeight}
                candidateId={candidateId}
                fetchOpportunities={async () => {
                  await fetchOpportunities(true);
                }}
              />
            }
            noContent={
              isPublic ? (
                <StyledNoResult>Aucun résultat</StyledNoResult>
              ) : (
                <NoOpportunities
                  // @ts-expect-error after enable TS strict mode. Please, try to fix it
                  status={
                    tabs.find(({ status: tabStatus }) => {
                      if (Array.isArray(queryParamsOpportunities.status)) {
                        return queryParamsOpportunities.status.some(
                          (status) => {
                            return tabStatus.includes(parseInt(status, 10));
                          }
                        );
                      }
                      return tabStatus.includes(
                        parseInt(
                          // @ts-expect-error after enable TS strict mode. Please, try to fix it
                          queryParamsOpportunities.status,
                          10
                        )
                      );
                    })?.text
                  }
                  fetchOpportunities={resetOffset}
                />
              )
            }
          />
        )}
      </>
    </>
  );
};
