import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import HeaderBackoffice from 'src/components/headers/HeaderBackoffice';
import { Button, Section } from 'src/components/utils';
import { openModal } from 'src/components/modals/Modal';
import { UserContext } from 'src/components/store/UserProvider';
import { IconNoSSR } from 'src/components/utils/Icon';
import SearchBar from 'src/components/filters/SearchBar';
import CandidateOffersTab from 'src/components/backoffice/candidate/CandidateOpportunities/CandidateOffersTab';
import { OpportunitiesContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer';
import { useCandidateOpportunities } from 'src/hooks/useOpportunityList';
import {
  candidateSearchFilters,
  textVariables,
} from 'src/components/backoffice/candidate/CandidateOpportunities/CandidateOpportunities.utils';
import NoOpportunities from 'src/components/backoffice/opportunities/OpportunitiesContainer/NoOpportunities';
import CandidateOpportunityDetailsContainer from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/CandidateOpportunityDetails';
import CandidateOpportunitiesList from 'src/components/backoffice//opportunities/OpportunitiesContainer/OpportunitiesList/CandidateOpportunitiesList';
import { useQueryParamsOpportunities } from 'src/components/backoffice/opportunities/useQueryParamsOpportunities';
import OpportunityError from 'src/components/opportunities/OpportunityError';
import { ModalExternalOffer } from 'src/components/modals/Modal/ModalGeneric/OfferModals/ModalOffer';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { useOpportunityType } from 'src/components/backoffice/opportunities/useOpportunityType';
import { usePrevious } from 'src/hooks/utils';
import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId';
import { useTabsCount } from './useTabsCount';

const CandidateOpportunities = ({
  search,
  filters,
  setFilters,
  setSearch,
  resetFilters,
  candidateId,
  isMobile,
}) => {
  const { user } = useContext(UserContext);

  const opportunityId = useOpportunityId();
  const opportunityType = useOpportunityType();

  const isPublic = opportunityType === 'public';

  const [numberOfResults, setNumberOfResults] = useState(0);
  const [offset, setOffset] = useState(0);
  const [hasFetchedAll, setHasFetchedAll] = useState(false);

  const [offers, setOffers] = useState(undefined);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  const queryParamsOpportunities = useQueryParamsOpportunities();

  const fetchData = useCandidateOpportunities(
    setOffers,
    setNumberOfResults,
    setLoading,
    setHasError,
    setHasFetchedAll
  );

  const { tabCounts, fetchTabsCount } = useTabsCount();

  const prevOffset = usePrevious(offset);
  const fetchOpportunities = async () => {
    await fetchData(candidateId, search, opportunityType, filters, offset);
    await fetchTabsCount();
  };

  useDeepCompareEffect(() => {
    if (offset !== 0 && offset === prevOffset) {
      setOffset(0);
      setHasFetchedAll(false);
    } else if (offset === 0 || !hasFetchedAll) {
      fetchOpportunities();
    }
  }, [candidateId, fetchData, filters, opportunityType, offset, search]);

  return (
    <>
      {!(isMobile && opportunityId) && (
        <>
          <Section className="custom-header">
            <HeaderBackoffice
              title={textVariables.title[user.role][isPublic ? 'all' : 'mine']}
              description={
                textVariables.description[user.role][isPublic ? 'all' : 'mine']
              }
              noSeparator
            >
              <Button
                style="primary"
                dataTestId="candidat-add-offer"
                onClick={() => {
                  openModal(
                    <ModalExternalOffer
                      fetchOpportunities={fetchOpportunities}
                    />
                  );
                }}
              >
                <IconNoSSR
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
                filtersConstants={candidateSearchFilters}
                filters={filters}
                numberOfResults={numberOfResults}
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
                activeTab={filters.status}
                tabCounts={tabCounts}
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
                  fetchOpportunities={fetchOpportunities}
                />
              ) : null
            }
            isLoading={loading}
            details={
              <CandidateOpportunityDetailsContainer
                fetchOpportunities={fetchOpportunities}
              />
            }
            noContent={
              isPublic ? (
                <div className="uk-width-expand uk-flex uk-flex-center uk-flex-middle">
                  Aucun résultat.
                </div>
              ) : (
                <NoOpportunities
                  status="à traiter"
                  fetchOpportunities={fetchOpportunities}
                />
              )
            }
          />
        )}
      </Section>
    </>
  );
};

CandidateOpportunities.propTypes = {
  search: PropTypes.string,
  filters: PropTypes.shape(),
  setFilters: PropTypes.func,
  setSearch: PropTypes.func,
  resetFilters: PropTypes.func,
  candidateId: PropTypes.string.isRequired,
  isMobile: PropTypes.bool,
};

CandidateOpportunities.defaultProps = {
  isMobile: false,
  search: undefined,
  filters: {},
  setFilters: () => {},
  setSearch: () => {},
  resetFilters: () => {},
};

export default CandidateOpportunities;
