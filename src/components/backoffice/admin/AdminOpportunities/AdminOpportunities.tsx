import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import UIkit from 'uikit';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { Api } from 'src/api';
import { Opportunity } from 'src/api/types';
import { OpportunitiesContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer';
import { AdminOpportunitiesList } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesList/AdminOpportunitiesList';
import { AdminOpportunityDetailsContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/AdminOpportunityDetails/AdminOpportunityDetailsContainer';
import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId';
import { useQueryParamsOpportunities } from 'src/components/backoffice/opportunities/useQueryParamsOpportunities';
import { SearchBar } from 'src/components/filters/SearchBar';
import { formAddExternalOpportunityAsAdmin } from 'src/components/forms/schemas/formAddExternalOpportunity';
import { formAddOpportunityAsAdmin } from 'src/components/forms/schemas/formAddOpportunity';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { PostOpportunityModal } from 'src/components/modals/Modal/ModalGeneric/PostOpportunityModal';
import { OpportunityError } from 'src/components/opportunities/OpportunityError';
import { Button, ButtonMultiple, Icon, Section } from 'src/components/utils';
import { OPPORTUNITY_FILTERS_DATA } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import { useBulkActions } from 'src/hooks/useBulkActions';
import { useAdminOpportunities } from 'src/hooks/useOpportunityList';
import { useIsDesktop, usePrevious } from 'src/hooks/utils';
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
    await fetchData(
      search,
      filters,
      offset,
      shouldFetchAll,
      currentTag,
      null,
      null
    );
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
      await fetchData(search, filters, offset, false, currentTag, null, null);
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

  const opportunityListRef = useRef<{ fetchData: () => Promise<void> }>();

  const opportunityModalProps = {
    defaultValues: {
      isPublic: true,
    },
    isAdmin: true,
    callback: opportunityListRef?.current?.fetchData,
    modalTitle: 'Ajouter une nouvelle offre',
    formSchema: formAddOpportunityAsAdmin,
  };

  const isDesktop = useIsDesktop();

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
              <ButtonMultiple
                id="admin-create"
                align={isDesktop ? 'right' : 'left'}
                dataTestId="button-admin-create"
                style="custom-primary"
                buttons={[
                  {
                    onClick: () => {
                      openModal(
                        <PostOpportunityModal {...opportunityModalProps} />
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
                <Icon
                  name="plus"
                  ratio={0.8}
                  className="uk-margin-small-right"
                />
                Créer
              </ButtonMultiple>
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
