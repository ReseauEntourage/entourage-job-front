import React, { useEffect, useState } from 'react'
import { AdminOpportunitiesFilters } from './AdminOpportunitiesFilters.types';
import { Button, Icon, Section } from 'src/components/utils';
import { useOpportunityId } from '../../opportunities/useOpportunityId';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { useAdminOpportunities } from 'src/hooks/useOpportunityList';
import { openModal } from 'src/components/modals/Modal';
import { ModalExternalOffer } from 'src/components/modals/Modal/ModalGeneric/OfferModals/ModalOffer';
import { CandidateOffersTab } from '../../candidate/CandidateOpportunities/CandidateOffersTab';
import { SearchBar } from 'src/components/filters/SearchBar';
import { OPPORTUNITY_FILTERS_DATA } from 'src/constants';
import { AdminOffersTab } from './AdminOffersTab';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { OpportunityError } from 'src/components/opportunities/OpportunityError';
import { OpportunitiesContainer } from '../../opportunities/OpportunitiesContainer';
import { useQueryParamsOpportunities } from '../../opportunities/useQueryParamsOpportunities';
import { AdminOpportunitiesList } from '../../opportunities/OpportunitiesContainer/OpportunitiesList/AdminOpportunitiesList';
import _, { replace } from 'lodash';
import { usePrevious } from 'src/hooks/utils';
import { useRouter } from 'next/router';
import AdminOpportunityDetailsContainer from '../../opportunities/OpportunitiesContainer/OpportunityDetails/AdminOpportunityDetails/AdminOpportunityDetailsContainer';

const adminSearchFilters = OPPORTUNITY_FILTERS_DATA.filter((el) => {
    return el.key !== 'status';
  });
  
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

    const [ currentTag, setCurrentTag ] = useState()
    useEffect(() => {
        setCurrentTag(filters.tag[0])
    }, [filters.tag])

    const opportunityId = useOpportunityId();
    const queryParamsOpportunities = useQueryParamsOpportunities();

    const [offers, setOffers] = useState(undefined);
    const [hasError, setHasError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState<number>(0);
    const [hasFetchedAll, setHasFetchedAll] = useState(false);
    const prevOpportunityId = usePrevious(opportunityId);
    const prevOffers = usePrevious(offers);
    const prevTag = usePrevious(currentTag);

    const fetchData = useAdminOpportunities(
        setOffers,
        setLoading,
        setHasError,
        setHasFetchedAll
      );
      

    const fetchOpportunities = async (shouldFetchAll?: boolean) => {
        await fetchData(
            search,
            filters,
            offset,
            shouldFetchAll,
            currentTag,
        );
    };

    // useEffect(() => {console.log(offers)}, [offers])

    useDeepCompareEffect(() => {
        if (offset === 0 || !hasFetchedAll) {
          fetchOpportunities();
        }
      }, [
        fetchData,
        filters,
        currentTag,
        hasFetchedAll,
        offset,
        search,
      ]);


      useDeepCompareEffect(() => {
          if (
            !opportunityId &&
              !isMobile &&
              offers &&
              offers.length > 0 &&
              offers !== prevOffers 
            )
                {
          replace(
            {
              pathname: `/backoffice/admin/offres/${
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
        queryParamsOpportunities,
        prevOpportunityId,
        // prevStatus,
        replace,
        isMobile,
      ]);

        const resetOffset = async () => {
            setOffset(0);
            setHasFetchedAll(false);
        };
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
          <Section className="custom-primary custom-fixed">
              <AdminOffersTab
                activeStatus={currentTag}
                // tabCounts={tabCounts}
                isMobile={isMobile}
              />
            </Section>
            <Section className="custom-mobile-darkBG custom-fixed">
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
              />
            </Section>
        </>
      )}
        <Section className="custom-primary">
            {hasError ? (
            <OpportunityError />
            ) : (
            <OpportunitiesContainer
                backButtonHref={{
                    pathname: `/backoffice/candidat/admin`,
                    query: queryParamsOpportunities,
                }}
                list={
                offers && offers.length > 0 ? (
                    <AdminOpportunitiesList
                        hasFetchedAll={hasFetchedAll}
                        setOffset={setOffset}
                        opportunities={offers}
                        fetchOpportunities={resetOffset}
                    />
                ) : null
                }
                isLoading={loading}
                details={
                    <AdminOpportunityDetailsContainer
                        fetchOpportunities={async () => {
                            await fetchOpportunities(true);
                        }}
                        currentTag={currentTag}
                    />
                }
                noContent={
                    <div className="uk-width-expand uk-flex uk-flex-center uk-flex-middle">
                    Aucun résultat.
                    </div> }
            />
            )}
        </Section>
    </>
  )
}
