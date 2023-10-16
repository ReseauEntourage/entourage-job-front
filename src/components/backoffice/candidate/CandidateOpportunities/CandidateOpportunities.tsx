import _ from 'lodash';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { CandidateOffersTab } from 'src/components/backoffice/candidate/CandidateOpportunities/CandidateOffersTab';
import {
  candidateSearchFilters,
  TextVariables,
} from 'src/components/backoffice/candidate/CandidateOpportunities/CandidateOpportunities.utils';
import { OpportunitiesContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer';
import { NoOpportunities } from 'src/components/backoffice/opportunities/OpportunitiesContainer/NoOpportunities';
import { CandidateOpportunitiesList } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesList/CandidateOpportunitiesList';
import { CandidateOpportunityDetailsContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/CandidateOpportunityDetails';
import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId';
import { useOpportunityType } from 'src/components/backoffice/opportunities/useOpportunityType';
import { useQueryParamsOpportunities } from 'src/components/backoffice/opportunities/useQueryParamsOpportunities';
import { SearchBar } from 'src/components/filters/SearchBar';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { openModal } from 'src/components/modals/Modal';
import { ModalExternalOffer } from 'src/components/modals/Modal/ModalGeneric/OfferModals/ModalOffer';
import { OpportunityError } from 'src/components/opportunities/OpportunityError';
import { Button, Section } from 'src/components/utils';
import { Icon } from 'src/components/utils/Icon';
import { OPPORTUNITY_FILTERS_DATA } from 'src/constants';
import { CANDIDATE_USER_ROLES, USER_ROLES } from 'src/constants/users';
import { useCandidateOpportunities } from 'src/hooks/useOpportunityList';
import { usePrevious } from 'src/hooks/utils';
import { UserContext } from 'src/store/UserProvider';
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

  const { user } = useContext(UserContext);

  const opportunityId = useOpportunityId();
  const prevOpportunityId = usePrevious(opportunityId);
  const opportunityType = useOpportunityType();
  const prevOpportunityType = usePrevious(opportunityType);

  const isPublic = opportunityType === 'public';

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
    offers,
    opportunityId,
    opportunityType,
    queryParamsOpportunities,
    prevOpportunityId,
    prevStatus,
    prevOpportunityType,
    replace,
    isMobile,
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
          <Section className="custom-header">
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
                <Icon
                  name="plus"
                  ratio="0.8"
                  className="uk-margin-small-right"
                />
                Ajouter une offre
              </Button>
            </HeaderBackoffice>
          </Section>
          {isPublic ? (
            <Section className="custom-mobile-darkBG custom-fixed">
              <SearchBar
                filtersConstants={
                  candidateSearchFilters as typeof OPPORTUNITY_FILTERS_DATA
                }
                filters={filters}
                resetFilters={resetFilters}
                search={search}
                setSearch={setSearch}
                setFilters={setFilters}
                placeholder="Rechercher..."
              />
            </Section>
          ) : (
            <Section className="custom-primary custom-fixed">
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
      <Section className="custom-primary">
        {hasError ? (
          <OpportunityError />
        ) : (
          <OpportunitiesContainer
            backButtonHref={{
              pathname: `/backoffice/candidat/offres/${opportunityType}`,
              query: queryParamsOpportunities,
            }}
            list={
              offers && offers.length > 0 ? (
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
                        parseInt(queryParamsOpportunities.status, 10)
                      );
                    })?.text
                  }
                  fetchOpportunities={resetOffset}
                />
              )
            }
          />
        )}
      </Section>
    </>
  );
};
