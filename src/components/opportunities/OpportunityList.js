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
import { getUserOpportunityFromOffer } from 'src/utils';
import Api from 'src/Axios';
import ModalOffer from 'src/components/modals/OfferModals/ModalOffer';
import { Grid, SimpleLink, Button } from 'src/components/utils';
import OfferCard from 'src/components/cards/OfferCard';
import ModalOfferAdmin from 'src/components/modals/OfferModals/ModalOfferAdmin';
import OpportunityError from 'src/components/opportunities/OpportunityError';
import { useOpportunityList } from 'src/hooks/useOpportunityList';
import useDeepCompareEffect from 'use-deep-compare-effect';
import {
  OFFER_ADMIN_FILTERS_DATA,
  OPPORTUNITY_FILTERS_DATA,
} from 'src/constants';
import FiltersTabs from 'src/components/utils/FiltersTabs';
import SearchBar from 'src/components/filters/SearchBar';
import { openModal } from 'src/components/modals/Modal';
import { usePrevious } from 'src/hooks/utils';
import { IconNoSSR } from 'src/components/utils/Icon';
import LoadingScreen from 'src/components/backoffice/cv/LoadingScreen';
import { useBulkActions } from 'src/hooks/useBulkActions';
import { SEARCH_MAX_WIDTH } from 'src/constants/utils';

const OfferList = ({
  selectionModeActivated,
  selectElement,
  isElementSelected,
  candidatId,
  role,
  offers,
  isAdmin,
  currentPath,
  query,
}) => {
  return (
    <Grid childWidths={['1-4@l', '1-3@m', '1-2@s']} left top>
      {offers.map((offer, i) => {
        const userOpportunity =
          role === 'candidateAsAdmin'
            ? getUserOpportunityFromOffer(offer, candidatId)
            : offer.userOpportunity;

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
                  userOpportunity={userOpportunity}
                  isExternal={offer.isExternal}
                  isNew={
                    role === 'candidateAsAdmin' &&
                    userOpportunity &&
                    !userOpportunity.seen
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
                  userOpportunity={offer.userOpportunity}
                  isNew={!offer.userOpportunity || !offer.userOpportunity.seen}
                  isExternal={offer.isExternal}
                  archived={
                    offer.userOpportunity && offer.userOpportunity.archived
                  }
                  bookmarked={
                    offer.userOpportunity && offer.userOpportunity.bookmarked
                  }
                  recommended={
                    offer.userOpportunity && offer.userOpportunity.recommended
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
  offers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  candidatId: PropTypes.string,
  role: PropTypes.oneOf(['admin', 'candidateAsAdmin', 'candidat']).isRequired,
  isAdmin: PropTypes.bool.isRequired,
  currentPath: PropTypes.string.isRequired,
  query: PropTypes.shape().isRequired,
  selectionModeActivated: PropTypes.bool.isRequired,
  selectElement: PropTypes.func.isRequired,
  isElementSelected: PropTypes.func.isRequired,
};

OfferList.defaultProps = {
  candidatId: undefined,
};

const OpportunityList = forwardRef(
  (
    {
      candidatId,
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
      query: { offerId: opportunityId, memberId, tab, ...restQuery },
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
        ? `admin/membres/${candidatId}/offres`
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
          return fetchData(role, search, tabFilterTag, filters, candidatId);
        },
      };
    });

    const onClickOpportunityCardAsUser = useCallback(
      async (offer) => {
        const opportunity = { ...offer };
        // si jamais ouvert
        if (!opportunity.userOpportunity || !opportunity.userOpportunity.seen) {
          const { data } = await Api.post(`/opportunity/join`, {
            opportunityId: offer.id,
            userId: candidatId,
            seen: true,
          });
          opportunity.userOpportunity = data;
        }
        openModal(
          <ModalOffer
            currentOffer={opportunity}
            onOfferUpdated={async () => {
              await fetchData(role, search, tabFilterTag, filters, candidatId);
            }}
            navigateBackToList={navigateBackToList}
          />
        );
      },
      [
        candidatId,
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
              await fetchData(role, search, tabFilterTag, filters, candidatId);
            }}
            navigateBackToList={navigateBackToList}
            duplicateOffer={async (closeModal) => {
              const { id, userOpportunity, ...restOpportunity } = offer;
              const { data } = await Api.post(`/opportunity/`, {
                ...restOpportunity,
                title: `${restOpportunity.title} (copie)`,
                isAdmin: true,
                isValidated: false,
                date: Date.now(),
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
              await fetchData(role, search, tabFilterTag, filters, candidatId);
            }}
          />
        );
      },
      [
        candidatId,
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
        const { data: offer } = await Api.get(`/opportunity/${oppId}`);
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
      fetchData(role, search, tabFilterTag, filters, candidatId);
    }, [role, search, tabFilters, filters, candidatId]);

    useEffect(() => {
      if (restQuery.tag !== prevTag) {
        const initialFiltersConst =
          restQuery.tag === OFFER_ADMIN_FILTERS_DATA[2].tag
            ? OPPORTUNITY_FILTERS_DATA.slice(1)
            : OPPORTUNITY_FILTERS_DATA;

        setFiltersConst(initialFiltersConst);
      }
    }, [prevTag, restQuery.tag]);

    const {
      selectElement,
      executeAction,
      isElementSelected,
      selectionModeActivated,
      SelectionModeButton,
      hasSelection,
    } = useBulkActions('/opportunity', async () => {
      await fetchData(role, search, tabFilterTag, filters, candidatId);
    });

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
                  candidatId={candidatId}
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
                candidatId={candidatId}
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
                  candidatId={candidatId}
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
              numberOfResults={numberOfResults}
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
              numberOfResults={numberOfResults}
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
  candidatId: PropTypes.string,
  filters: PropTypes.shape(),
  search: PropTypes.string,
  userRole: PropTypes.oneOf(['admin', 'candidateAsAdmin', 'candidat']),
  setFilters: PropTypes.func,
  setSearch: PropTypes.func,
  resetFilters: PropTypes.func,
  tabFilters: PropTypes.arrayOf(PropTypes.shape()),
  setTabFilters: PropTypes.func,
};

OpportunityList.defaultProps = {
  candidatId: undefined,
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
