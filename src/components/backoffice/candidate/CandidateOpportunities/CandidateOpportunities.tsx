import _ from 'lodash';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import PlusIcon from 'assets/icons/plus.svg';
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
import { SearchBar } from 'src/components/filters/SearchBar';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { openModal } from 'src/components/modals/Modal';
import { ModalExternalOffer } from 'src/components/modals/Modal/ModalGeneric/OfferModals/ModalOffer';
import { Button, Section } from 'src/components/utils';

import { OPPORTUNITY_FILTERS_DATA } from 'src/constants';
import { HEIGHTS } from 'src/constants/styles';
import { CANDIDATE_USER_ROLES, USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useOpportunityId } from 'src/hooks/queryParams/useOpportunityId';
import { useOpportunityType } from 'src/hooks/queryParams/useOpportunityType';
import { useQueryParamsOpportunities } from 'src/hooks/queryParams/useQueryParamsOpportunities';
import { useCandidateOpportunities } from 'src/hooks/useOpportunityList';
import { usePrevious } from 'src/hooks/utils';
import { getUserCandidateFromCoach, isRoleIncluded } from 'src/utils/Finding';
import { tabs } from './CandidateOffersTab/CandidateOffersTab.utils';
import { CandidateOpportunitiesFilters } from './CandidateOpportunitiesFilters.types';
import { useTabsCount } from './useTabsCount';
import { useUpdateOpportunityStatus } from './useUpdateOpportunityStatus';

interface CandidateOpportunitiesProps {
  search?: string;
  filters: CandidateOpportunitiesFilters;
  setFilters?: (updatedFilters: CandidateOpportunitiesFilters) => void;
  resetFilters?: () => void;
  setSearch?: (updatedSearch: string) => void;
  candidateId: string;
  isMobile?: boolean;
}

export const CandidateOpportunities = ({
  search,
  filters,
  setFilters,
  setSearch,
  resetFilters,
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

  const contentHeight = isPublic
    ? HEIGHTS.SEARCH_BAR_HEIGHT
    : HEIGHTS.TABS_HEIGHT;

  const [offset, setOffset] = useState<number>(0);
  const [hasFetchedAll, setHasFetchedAll] = useState(false);

  const [offers, setOffers] = useState(undefined);
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
      offers &&
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
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
              TextVariables.title[
                isRoleIncluded(CANDIDATE_USER_ROLES, user.role)
                  ? USER_ROLES.CANDIDATE
                  : USER_ROLES.COACH
              ][isPublic ? 'all' : 'mine']
            } ${
              USER_ROLES.COACH_EXTERNAL === user.role
                ? `- ${
                    getUserCandidateFromCoach(user, candidateId)?.candidat
                      ?.firstName
                  } ${
                    getUserCandidateFromCoach(user, candidateId)?.candidat
                      ?.lastName
                  }`
                : ''
            }`}
            description={
              TextVariables.description[
                isRoleIncluded(CANDIDATE_USER_ROLES, user.role)
                  ? USER_ROLES.CANDIDATE
                  : USER_ROLES.COACH
              ][isPublic ? 'all' : 'mine']
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
            <Section className="custom-primary custom-fixed">
              <SearchBar
                filtersConstants={
                  candidateSearchFilters as typeof OPPORTUNITY_FILTERS_DATA
                }
                filters={filters}
                // @ts-expect-error after enable TS strict mode. Please, try to fix it
                resetFilters={resetFilters}
                search={search}
                // @ts-expect-error after enable TS strict mode. Please, try to fix it
                setSearch={setSearch}
                // @ts-expect-error after enable TS strict mode. Please, try to fix it
                setFilters={setFilters}
                placeholder="Rechercher..."
              />
            </Section>
          ) : (
            <Section className="custom-primary custom-fixed">
              <CandidateOffersTab
                activeStatus={filters.status}
                // @ts-expect-error after enable TS strict mode. Please, try to fix it
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
              // @ts-expect-error after enable TS strict mode. Please, try to fix it
              query: queryParamsOpportunities,
            }}
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            list={
              offers &&
              // @ts-expect-error after enable TS strict mode. Please, try to fix it
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
                filtersAndTabsHeight={contentHeight}
                candidateId={candidateId}
                fetchOpportunities={async () => {
                  await fetchOpportunities(true);
                }}
              />
            }
            noContent={
              isPublic ? (
                <div className="uk-width-expand uk-flex uk-flex-center uk-flex-middle">
                  Aucun résultat.
                </div>
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
