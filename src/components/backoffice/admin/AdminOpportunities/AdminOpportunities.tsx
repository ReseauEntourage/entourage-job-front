import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { Opportunity } from 'src/api/types';
import { OpportunitiesContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer';
import { AdminOpportunitiesList } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesList/AdminOpportunitiesList';
import { AdminOpportunityDetailsContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/AdminOpportunityDetails/AdminOpportunityDetailsContainer';
import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId';
import { useQueryParamsOpportunities } from 'src/components/backoffice/opportunities/useQueryParamsOpportunities';
import { SearchBar } from 'src/components/filters/SearchBar';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { OpportunityError } from 'src/components/opportunities/OpportunityError';
import { Button, Icon, Section } from 'src/components/utils';
import { OPPORTUNITY_FILTERS_DATA } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import { useBulkActions } from 'src/hooks/useBulkActions';
import { useAdminOpportunities } from 'src/hooks/useOpportunityList';
import { usePrevious } from 'src/hooks/utils';
import { AdminOffersTab } from './AdminOffersTab';
import { StyledAdminOpportunityNavigation } from './AdminOpportunities.styles';
import { AdminOpportunitiesFilters } from './AdminOpportunitiesFilters.types';

const adminSearchFilters = OPPORTUNITY_FILTERS_DATA;

interface CandidateOpportunitiesProps {
  search?: string;
  filters: AdminOpportunitiesFilters;
  setFilters?: (updatedFilters: AdminOpportunitiesFilters) => void;
  resetFilters?: () => void;
  setSearch?: (updatedSearch: string) => void;
  isMobile?: boolean;
}

export const AdminOpportunities = ({
  search,
  filters,
  setFilters,
  setSearch,
  resetFilters,
  isMobile = false,
}: CandidateOpportunitiesProps) => {
  const { replace } = useRouter();

  const [currentTag, setCurrentTag] = useState();
  useEffect(() => {
    setCurrentTag(filters.tag[0]);
    // const {tag, ...restFilters} = filters;
    // Api.getOpportunitiesTabCountForAdmin({
    //     params: {
    //         search,
    //         type: filters.tag[0].value,
    //         ...filtersToQueryParams(restFilters),
    //     }
    // })
  }, [filters]);

  const opportunityId = useOpportunityId();
  const queryParamsOpportunities = useQueryParamsOpportunities();

  const [offers, setOffers] = useState<Opportunity[]>(undefined);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState<number>(0);
  const [hasFetchedAll, setHasFetchedAll] = useState(false);
  const prevOffers = usePrevious(offers) as Opportunity[];

  const fetchData = useAdminOpportunities(
    setOffers,
    setLoading,
    setHasError,
    setHasFetchedAll
  );

  const fetchOpportunities = async (shouldFetchAll?: boolean) => {
    // const await Api.getOpportunitiesAdminCount()
    await fetchData(search, filters, offset, shouldFetchAll, currentTag);
  };

  useDeepCompareEffect(() => {
    if (offset === 0 || !hasFetchedAll) {
      fetchOpportunities();
    }
  }, [fetchData, filters, currentTag, hasFetchedAll, offset, search]);

  useDeepCompareEffect(() => {
    if (
      !isMobile &&
      offers &&
      offers.length > 0 &&
      offers[0] !== prevOffers?.[0] // don't check all opportunity list because pagination, only if first changes
    ) {
      replace(
        {
          pathname: `/backoffice/admin/offres/${
            offers[0].id ? `${offers[0].id}` : ''
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
    queryParamsOpportunities,
    prevOffers,
    replace,
    isMobile,
  ]);

  const resetOffset = async () => {
    setOffset(0);
    setHasFetchedAll(false);
  };

  useDeepCompareEffect(() => {
    resetOffset();
  }, [fetchData, filters, search]);

  const { selectElement, executeAction, hasSelection } = useBulkActions(
    'opportunity',
    async () => {
      await fetchData(search, filters, offset, false, currentTag);
    },
    GA_TAGS.BACKOFFICE_ADMIN_ARCHIVER_MASSE_CLIC
  );

  const bulkArchiveOpportunities = async () => {
    executeAction({ isArchived: true }, 'put');
  };

  const [showBulkActions, setShowBulkActions] = useState<boolean>(false);
  useEffect(() => {
    if (hasSelection) {
      setShowBulkActions(true);
    } else {
      setShowBulkActions(false);
    }
  }, [hasSelection]);

  return (
    <>
      {!(isMobile && opportunityId) && (
        <>
          <Section className="custom-header">
            <HeaderBackoffice
              noSeparator
              title="Modération des offres"
              description="Ici vous pouvez accéder à toutes les opportunités et valider les offres envoyées par les recruteurs !"
            >
              <Button
                style="primary"
                dataTestId="candidat-add-offer-main"
                onClick={() => {
                  // openModal(
                  // );
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
          <StyledAdminOpportunityNavigation>
            <div className="section-container">
              <AdminOffersTab
                activeStatus={currentTag}
                // tabCounts={tabCounts}
                isMobile={isMobile}
              />
              <SearchBar
                filtersConstants={
                  adminSearchFilters as typeof OPPORTUNITY_FILTERS_DATA
                }
                filters={filters}
                resetFilters={resetFilters}
                search={search}
                setSearch={setSearch}
                setFilters={setFilters}
                placeholder="Rechercher..."
                additionalButtons={
                  showBulkActions ? (
                    <Button
                      style="custom-secondary-inverted"
                      size="small"
                      onClick={() => bulkArchiveOpportunities()}
                    >
                      Archiver les offres
                    </Button>
                  ) : (
                    <></>
                  )
                }
              />
            </div>
          </StyledAdminOpportunityNavigation>
        </>
      )}
      <Section className="custom-primary">
        {hasError ? (
          <OpportunityError />
        ) : (
          <OpportunitiesContainer
            backButtonHref={{
              pathname: '/backoffice/admin/offres',
              query: queryParamsOpportunities,
            }}
            list={
              offers && offers.length > 0 ? (
                <AdminOpportunitiesList
                  setOffset={setOffset}
                  opportunities={offers}
                  selectOpportunity={selectElement}
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
      </Section>
    </>
  );
};
