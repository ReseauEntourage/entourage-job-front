import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import UIkit from 'uikit';
import useDeepCompareEffect from 'use-deep-compare-effect';
import PlusIcon from 'assets/icons/plus.svg';
import { useTag } from '../useTag';
import { Api } from 'src/api';
import { Opportunity } from 'src/api/types';
import { OpportunitiesContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer';
import { AdminOpportunitiesList } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesList/AdminOpportunitiesList';
import { AdminOpportunityDetailsContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/AdminOpportunityDetails/AdminOpportunityDetailsContainer';
import { OpportunityError } from 'src/components/backoffice/opportunities/OpportunityError';
import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId';
import { useQueryParamsOpportunities } from 'src/components/backoffice/opportunities/useQueryParamsOpportunities';
import { SearchBar } from 'src/components/filters/SearchBar';
import { formAddExternalOpportunityAsAdmin } from 'src/components/forms/schemas/formAddExternalOpportunity';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { PostAdminOpportunityModal } from 'src/components/modals/Modal/ModalGeneric/PostOpportunityModal';
import { Button, ButtonMultiple, Section } from 'src/components/utils';
import { OPPORTUNITY_FILTERS_DATA } from 'src/constants';
import { HEIGHTS } from 'src/constants/styles';
import { GA_TAGS } from 'src/constants/tags';
import { useBulkActions } from 'src/hooks/useBulkActions';
import { useAdminOpportunities } from 'src/hooks/useOpportunityList';
import { useIsDesktop, usePrevious } from 'src/hooks/utils';
import { AdminOffersTab } from './AdminOffersTab';
import { AdminOpportunitiesFilters } from './AdminOpportunitiesFilters.types';

interface AdminOpportunitiesProps {
  search?: string;
  filters: AdminOpportunitiesFilters;
  setFilters?: (updatedFilters: AdminOpportunitiesFilters) => void;
  resetFilters?: () => void;
  setSearch?: (updatedSearch: string) => void;
  isMobile?: boolean;
}

const filtersAndTabsHeight =
  HEIGHTS.TABS_HEIGHT_WITHOUT_NUMBERS +
  HEIGHTS.SEARCH_BAR_HEIGHT +
  HEIGHTS.SECTION_PADDING;

export const AdminOpportunities = ({
  search,
  filters,
  setFilters,
  setSearch,
  resetFilters,
  isMobile = false,
}: AdminOpportunitiesProps) => {
  const { replace, push } = useRouter();

  const currentPath = '/backoffice/admin/offres';

  /* useEffect(() => {
    setCurrentTag(ADMIN_OFFERS_TAGS[0]);
    // Api.getOpportunitiesTabCountForAdmin({
    //     params: {
    //         search,
    //         tag,
    //         ...filtersToQueryParams(filters),
    //     }
    // })
  }, [filters]); */

  const opportunityId = useOpportunityId();
  const prevOpportunityId = usePrevious(opportunityId);

  const tag = useTag();
  const previousTag = usePrevious(tag);

  const queryParamsOpportunities = useQueryParamsOpportunities();

  const [offers, setOffers] = useState<Opportunity[]>(undefined);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState<number>(0);
  const [hasFetchedAll, setHasFetchedAll] = useState(false);
  const prevOffers = usePrevious(offers);

  const fetchData = useAdminOpportunities(
    setOffers,
    setLoading,
    setHasError,
    setHasFetchedAll
  );

  const fetchOpportunities = async (shouldFetchAll?: boolean) => {
    // const await Api.getOpportunitiesAdminCount()
    await fetchData(search, filters, offset, shouldFetchAll, tag);
  };

  const {
    selectElement,
    executeAction,
    hasSelection,
    resetSelection,
    isElementSelected,
  } = useBulkActions(
    'opportunity',
    async () => {
      await fetchData(search, filters, offset, false, tag);
      push(
        {
          pathname: `${currentPath}`,
          query: queryParamsOpportunities,
        },
        undefined,
        {
          shallow: true,
          scroll: false,
        }
      );
    },
    GA_TAGS.BACKOFFICE_ADMIN_ARCHIVER_MASSE_CLIC
  );

  useDeepCompareEffect(() => {
    if (offset === 0 || !hasFetchedAll) {
      fetchOpportunities();
      resetSelection();
    }
  }, [fetchData, filters, tag, hasFetchedAll, offset, search]);

  useDeepCompareEffect(() => {
    if (
      !isMobile &&
      offers &&
      offers.length > 0 &&
      ((offers !== prevOffers && !opportunityId) ||
        (opportunityId !== prevOpportunityId &&
          !opportunityId &&
          tag === previousTag))
    ) {
      replace(
        {
          pathname: `/backoffice/admin/offres${
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
    tag,
    previousTag,
    queryParamsOpportunities,
    replace,
  ]);

  const resetOffset = async () => {
    setOffset(0);
    setHasFetchedAll(false);
  };

  useDeepCompareEffect(() => {
    resetOffset();
  }, [fetchData, tag, filters, search]);

  const bulkArchiveOpportunities = async () => {
    executeAction({ isArchived: true }, 'put');
  };

  const opportunityListRef = useRef<{ fetchData: () => Promise<void> }>();

  const isDesktop = useIsDesktop();

  return (
    <>
      {!(isMobile && opportunityId) && (
        <>
          <HeaderBackoffice
            noSeparator
            title="Modération des offres"
            description="Ici vous pouvez accéder à toutes les opportunités et valider les offres envoyées par les recruteurs !"
          >
            <ButtonMultiple
              id="admin-create"
              align={isDesktop ? 'right' : 'left'}
              dataTestId="button-admin-create"
              style="custom-primary"
              buttons={[
                {
                  onClick: () => {
                    openModal(
                      <PostAdminOpportunityModal
                        callback={opportunityListRef?.current?.fetchData}
                      />
                    );
                  },
                  label: 'Nouvelle offre',
                  dataTestId: 'admin-add-offer-main',
                },
                {
                  onClick: () => {
                    openModal(
                      <ModalEdit
                        title="Ajouter une offre externe"
                        submitText="Envoyer"
                        formSchema={formAddExternalOpportunityAsAdmin}
                        onSubmit={async (fields, closeModal) => {
                          try {
                            await Api.postExternalOpportunity({
                              ...fields,
                              department: fields.department.value,
                              candidateId: fields.candidateId.value,
                              date: moment().toISOString(),
                              businessLines: fields.businessLines
                                ? fields.businessLines.map(
                                    (businessLine, index) => {
                                      return {
                                        name: businessLine.value,
                                        order: index,
                                      };
                                    }
                                  )
                                : [],
                            });
                            closeModal();
                            await opportunityListRef?.current?.fetchData();
                            UIkit.notification(
                              "L'offre externe a bien été ajouté",
                              'success'
                            );
                          } catch (err) {
                            console.error(err);
                            UIkit.notification(
                              `Une erreur est survenue.`,
                              'danger'
                            );
                          }
                        }}
                      />
                    );
                  },
                  label: 'Offre externe',
                },
              ]}
            >
              <PlusIcon />
              Créer
            </ButtonMultiple>
          </HeaderBackoffice>
          <Section className="custom-primary custom-fixed">
            <AdminOffersTab
              activeStatus={tag}
              // tabCounts={tabCounts}
              isMobile={isMobile}
            />
            <SearchBar
              filtersConstants={OPPORTUNITY_FILTERS_DATA}
              filters={filters}
              resetFilters={resetFilters}
              search={search}
              setSearch={setSearch}
              setFilters={setFilters}
              placeholder="Rechercher..."
              additionalButtons={
                <Button
                  style="custom-secondary-inverted"
                  size="small"
                  disabled={!hasSelection}
                  onClick={bulkArchiveOpportunities}
                >
                  Archiver les offres
                </Button>
              }
            />
          </Section>
        </>
      )}
      <>
        {hasError ? (
          <OpportunityError />
        ) : (
          <OpportunitiesContainer
            backButtonHref={{
              pathname: '/backoffice/admin/offres',
              query: queryParamsOpportunities,
            }}
            list={
              offers &&
              offers.length > 0 && (
                <AdminOpportunitiesList
                  setOffset={setOffset}
                  opportunities={offers}
                  selectOpportunity={selectElement}
                  isOpportunitySelected={isElementSelected}
                />
              )
            }
            isLoading={loading}
            details={
              <AdminOpportunityDetailsContainer
                filtersAndTabsHeight={filtersAndTabsHeight}
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
    </>
  );
};
