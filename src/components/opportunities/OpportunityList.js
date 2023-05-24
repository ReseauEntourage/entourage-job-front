import UIkit from 'uikit';

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { getOpportunityUserFromOffer } from 'src/utils';
import { Api } from 'src/api/index.ts';
import { Button, Grid, SimpleLink } from 'src/components/utils';
import OfferCard from 'src/components/cards/OfferCard';
import ModalOfferAdmin from 'src/components/modals/Modal/ModalGeneric/OfferModals/ModalOfferAdmin';
import OpportunityError from 'src/components/opportunities/OpportunityError';
import { useOpportunityList } from 'src/hooks/useOpportunityList';
import useDeepCompareEffect from 'use-deep-compare-effect';
import {
  OFFER_ADMIN_FILTERS_DATA,
  OPPORTUNITY_FILTERS_DATA,
} from 'src/constants/index.ts';
import FiltersTabs from 'src/components/utils/FiltersTabs';
import SearchBar from 'src/components/filters/SearchBar.tsx';
import { openModal } from 'src/components/modals/Modal';
import { usePrevious } from 'src/hooks/utils';
import { IconNoSSR } from 'src/components/utils/Icon.tsx';
import LoadingScreen from 'src/components/backoffice/cv/LoadingScreen';
import { useBulkActions } from 'src/hooks/useBulkActions';
import { SEARCH_MAX_WIDTH } from 'src/constants/utils.ts';
import { GA_TAGS } from 'src/constants/tags';
import moment from 'moment';
import { ModalOffer } from 'src/components/modals/Modal/ModalGeneric/OfferModals/ModalOffer';

const OfferList = ({
  selectionModeActivated,
  selectElement,
  isElementSelected,
  candidateId,
  role,
  offers,
  isAdmin,
  currentPath,
  query,
}) => {
  return (
    <Grid
      childWidths={['1-4@l', '1-3@m', '1-2@s']}
      left
      top
      dataTestId="offer-list"
    >
      {offers.map((offer, i) => {
        const opportunityUsers =
          role === 'candidateAsAdmin'
            ? getOpportunityUserFromOffer(offer, candidateId)
            : offer.opportunityUsers;

        const isSelected = isElementSelected(offer);

        const linkPropsDependingOnMode = selectionModeActivated
          ? {
              isExternal: true,
              onClick: () => {
                selectElement(offer);
              },
            }
          : {
              href: {
                pathname: `${currentPath}/${offer.id}`,
                query,
              },
            };

        return (
          <li key={i}>
            <SimpleLink
              shallow
              scroll={false}
              className="uk-link-reset"
              {...linkPropsDependingOnMode}
            >
              {isAdmin ? (
                <OfferCard
                  title={offer.title}
                  from={offer.recruiterName}
                  shortDescription={offer.company}
                  date={offer.date}
                  archived={offer.isArchived}
                  isPublic={offer.isPublic}
                  isValidated={offer.isValidated}
                  department={offer.department}
                  opportunityUsers={opportunityUsers}
                  isExternal={offer.isExternal}
                  isNew={
                    role === 'candidateAsAdmin' &&
                    opportunityUsers &&
                    !opportunityUsers.seen
                  }
                  isAdmin
                  isSelected={isSelected}
                />
              ) : (
                <OfferCard
                  title={offer.title}
                  from={offer.recruiterName}
                  shortDescription={offer.company}
                  date={offer.date}
                  isValidated={offer.isValidated}
                  isPublic={offer.isPublic}
                  opportunityUsers={offer.opportunityUsers}
                  isNew={
                    !offer.opportunityUsers || !offer.opportunityUsers.seen
                  }
                  isExternal={offer.isExternal}
                  archived={
                    offer.opportunityUsers && offer.opportunityUsers.archived
                  }
                  bookmarked={
                    offer.opportunityUsers && offer.opportunityUsers.bookmarked
                  }
                  recommended={
                    offer.opportunityUsers && offer.opportunityUsers.recommended
                  }
                  department={offer.department}
                  isSelected={isSelected}
                />
              )}
            </SimpleLink>
          </li>
        );
      })}
    </Grid>
  );
};

OfferList.propTypes = {
  offers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  candidateId: PropTypes.string,
  role: PropTypes.oneOf(['admin', 'candidateAsAdmin', 'candidat']).isRequired,
  isAdmin: PropTypes.bool.isRequired,
  currentPath: PropTypes.string.isRequired,
  query: PropTypes.shape({}).isRequired,
  selectionModeActivated: PropTypes.bool.isRequired,
  selectElement: PropTypes.func.isRequired,
  isElementSelected: PropTypes.func.isRequired,
};

OfferList.defaultProps = {
  candidateId: undefined,
};

const OpportunityList = forwardRef(
  (
    {
      candidateId,
      search,
      filters,
      userRole: role,
      setFilters,
      setSearch,
      resetFilters,
      tabFilters,
      setTabFilters,
    },
    ref
  ) => {
    const {
      push,
      query: {
        offerId: opportunityId,
        memberId,
        tab,
        updateStatus,
        ...restQuery
      },
    } = useRouter();

    const prevTag = usePrevious(restQuery.tag);

    const [filtersConst, setFiltersConst] = useState(OPPORTUNITY_FILTERS_DATA);
    const [numberOfResults, setNumberOfResults] = useState(0);

    const [bookmarkedOffers, setBookmarkedOffers] = useState(undefined);
    const [offers, setOffers] = useState(undefined);
    const [otherOffers, setOtherOffers] = useState(undefined);
    const [hasError, setHasError] = useState(false);
    const [loading, setLoading] = useState(true);

    const isAdmin = role === 'admin' || role === 'candidateAsAdmin';

    const currentPath = `/backoffice/${
      role === 'candidateAsAdmin'
        ? `admin/membres/${candidateId}/offres`
        : `${role}/offres`
    }`;

    const navigateBackToList = useCallback(() => {
      push(
        {
          pathname: currentPath,
          query: restQuery,
        },
        undefined,
        {
          shallow: true,
          scroll: false,
        }
      );
    }, [currentPath, push, restQuery]);

    const fetchData = useOpportunityList(
      setOffers,
      setOtherOffers,
      setBookmarkedOffers,
      setNumberOfResults,
      setLoading,
      setHasError
    );

    const tabFilterTag = tabFilters?.find((filter) => {
      return filter.active;
    })?.tag;

    useImperativeHandle(ref, () => {
      return {
        fetchData: () => {
          return fetchData(role, search, tabFilterTag, filters, candidateId);
        },
      };
    });

    const onClickOpportunityCardAsUser = useCallback(
      async (offer) => {
        const opportunity = { ...offer };
        // si jamais ouvert
        if (
          !opportunity.opportunityUsers ||
          !opportunity.opportunityUsers.seen
        ) {
          const { data } = await Api.postJoinOpportunity({
            opportunityId: offer.id,
            candidateId,
          });
          opportunity.opportunityUsers = data;
        }
        openModal(
          <ModalOffer
            currentOffer={opportunity}
            onOfferUpdated={async () => {
              await fetchData(role, search, tabFilterTag, filters, candidateId);
            }}
            navigateBackToList={navigateBackToList}
          />
        );
      },
      [
        candidateId,
        fetchData,
        filters,
        navigateBackToList,
        role,
        search,
        tabFilterTag,
      ]
    );

    const onClickOpportunityCardAsAdmin = useCallback(
      (offer) => {
        openModal(
          <ModalOfferAdmin
            currentOffer={offer}
            onOfferUpdated={async () => {
              await fetchData(role, search, tabFilterTag, filters, candidateId);
            }}
            navigateBackToList={navigateBackToList}
            duplicateOffer={async (closeModal) => {
              const {
                id,
                opportunityUsers,
                createdBy,
                createdAt,
                updatedAt,
                ...restOpportunity
              } = offer;
              const { data } = await Api.postOpportunity({
                ...restOpportunity,
                title: `${restOpportunity.title} (copie)`,
                isAdmin: true,
                isValidated: false,
                date: moment().toISOString(),
                isCopy: true,
              });

              closeModal();
              UIkit.notification("L'offre a bien été dupliquée", 'success');
              push(
                {
                  pathname: `${currentPath}/${data.id}`,
                  query: restQuery,
                },
                undefined,
                {
                  shallow: true,
                  scroll: false,
                }
              );
              await fetchData(role, search, tabFilterTag, filters, candidateId);
            }}
          />
        );
      },
      [
        candidateId,
        currentPath,
        fetchData,
        filters,
        navigateBackToList,
        push,
        restQuery,
        role,
        search,
        tabFilterTag,
      ]
    );

    const openOffer = useCallback(
      (offer) => {
        if (offer) {
          if (isAdmin) {
            onClickOpportunityCardAsAdmin(offer);
          } else {
            onClickOpportunityCardAsUser(offer);
          }
        }
      },
      [isAdmin, onClickOpportunityCardAsAdmin, onClickOpportunityCardAsUser]
    );

    const getOpportunity = useCallback(async (oppId) => {
      try {
        const { data: offer } = await Api.getOpportunityById(oppId);
        return offer;
      } catch (err) {
        console.error(err);
        return null;
      }
    }, []);

    const prevOpportunityId = usePrevious(opportunityId);

    useEffect(() => {
      if (opportunityId && opportunityId !== prevOpportunityId) {
        getOpportunity(opportunityId).then((offer) => {
          if (offer) {
            openOffer({ ...offer });
          }
        });
      }
    }, [getOpportunity, openOffer, opportunityId, prevOpportunityId]);

    useDeepCompareEffect(() => {
      setHasError(false);
      fetchData(role, search, tabFilterTag, filters, candidateId);
    }, [role, search, tabFilters, filters, candidateId]);

    const {
      selectElement,
      executeAction,
      isElementSelected,
      selectionModeActivated,
      SelectionModeButton,
      hasSelection,
      toggleSelectionMode,
    } = useBulkActions(
      'opportunity',
      async () => {
        await fetchData(role, search, tabFilterTag, filters, candidateId);
      },
      GA_TAGS.BACKOFFICE_ADMIN_ARCHIVER_MASSE_CLIC
    );

    useEffect(() => {
      if (restQuery.tag !== prevTag) {
        const initialFiltersConst =
          restQuery.tag === OFFER_ADMIN_FILTERS_DATA[2].tag
            ? OPPORTUNITY_FILTERS_DATA.slice(1)
            : OPPORTUNITY_FILTERS_DATA;

        setFiltersConst(initialFiltersConst);
        if (selectionModeActivated) {
          toggleSelectionMode();
        }
      }
    }, [prevTag, restQuery.tag, selectionModeActivated, toggleSelectionMode]);

    const content = (
      <div>
        {role !== 'candidat' && (
          <div className="uk-flex uk-flex-center">
            <div
              className="uk-flex uk-flex-1 uk-margin-small-bottom"
              style={{ height: 40, maxWidth: SEARCH_MAX_WIDTH }}
            >
              <div className="uk-flex uk-padding-small uk-padding-remove-vertical uk-flex-1 uk-flex-middle uk-flex-row-reverse uk-flex-between uk-flex-wrap">
                <SelectionModeButton />
                {selectionModeActivated && (
                  <Button
                    disabled={!hasSelection}
                    style="default"
                    onClick={() => {
                      executeAction({ isArchived: true }, 'put');
                    }}
                  >
                    Archiver&nbsp;
                    <IconNoSSR name="archive" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
        {loading && <LoadingScreen />}
        {!loading && hasError && <OpportunityError />}
        {!loading && !hasError && (
          <div>
            {bookmarkedOffers && bookmarkedOffers.length > 0 && (
              <>
                <p className="uk-text-center uk-text-italic uk-padding-small uk-flex uk-flex-middle uk-flex-center">
                  Opportunités favorites&nbsp;
                  <IconNoSSR
                    name="star"
                    className="ent-color-amber uk-margin-small-left"
                    ratio={0.8}
                  />
                </p>
                <OfferList
                  isElementSelected={isElementSelected}
                  selectElement={selectElement}
                  selectionModeActivated={selectionModeActivated}
                  candidateId={candidateId}
                  query={restQuery}
                  role={role}
                  isAdmin={isAdmin}
                  offers={bookmarkedOffers}
                  currentPath={currentPath}
                />
                <hr />
              </>
            )}
            {offers && offers.length > 0 ? (
              <OfferList
                isElementSelected={isElementSelected}
                selectElement={selectElement}
                selectionModeActivated={selectionModeActivated}
                candidateId={candidateId}
                query={restQuery}
                role={role}
                isAdmin={isAdmin}
                offers={offers}
                currentPath={currentPath}
              />
            ) : (
              <div className=" uk-text-center uk-flex uk-flex-center uk-margin-medium-top">
                <div className="uk-width-xlarge">
                  <p className="uk-text-italic">
                    {Object.values(filters).reduce((acc, curr) => {
                      return acc + curr.length;
                    }, 0) > 0 || search
                      ? 'Aucun résultat.'
                      : `${
                          role === 'admin'
                            ? "Aucune offre d'emploi."
                            : "Aucune proposition n'a été faite au candidat."
                        }`}
                  </p>
                </div>
              </div>
            )}
            {otherOffers && otherOffers.length > 0 && (
              <>
                <hr />
                <p className="uk-text-center uk-text-italic uk-padding-small">
                  Voici d&apos;autres offres qui vous ont été adressées hors des
                  départements sélectionnés&nbsp;:
                </p>
                <OfferList
                  isElementSelected={isElementSelected}
                  selectElement={selectElement}
                  selectionModeActivated={selectionModeActivated}
                  candidateId={candidateId}
                  query={restQuery}
                  role={role}
                  isAdmin={isAdmin}
                  offers={otherOffers}
                  currentPath={currentPath}
                />
              </>
            )}
          </div>
        )}
      </div>
    );

    return (
      <div>
        {tabFilters ? (
          <>
            <FiltersTabs
              path={currentPath}
              tabFilters={tabFilters}
              setTabFilters={setTabFilters}
              otherPathParams={['offerId']}
            />
            <SearchBar
              filtersConstants={filtersConst}
              filters={filters}
              // numberOfResults={numberOfResults}
              resetFilters={resetFilters}
              search={search}
              setSearch={setSearch}
              setFilters={setFilters}
              placeholder="Rechercher..."
            />
            {content}
          </>
        ) : (
          <>
            <SearchBar
              filtersConstants={filtersConst}
              filters={filters}
              // numberOfResults={numberOfResults}
              resetFilters={resetFilters}
              search={search}
              setSearch={setSearch}
              setFilters={setFilters}
              placeholder="Rechercher..."
            />
            {content}
          </>
        )}
      </div>
    );
  }
);

OpportunityList.propTypes = {
  candidateId: PropTypes.string,
  filters: PropTypes.shape({}),
  search: PropTypes.string,
  userRole: PropTypes.oneOf(['admin', 'candidateAsAdmin', 'candidat']),
  setFilters: PropTypes.func,
  setSearch: PropTypes.func,
  resetFilters: PropTypes.func,
  tabFilters: PropTypes.arrayOf(PropTypes.shape({})),
  setTabFilters: PropTypes.func,
};

OpportunityList.defaultProps = {
  candidateId: undefined,
  filters: undefined,
  userRole: 'candidat',
  search: undefined,
  tabFilters: undefined,
  setFilters: () => {},
  setSearch: () => {},
  resetFilters: () => {},
  setTabFilters: () => {},
};

export default OpportunityList;
