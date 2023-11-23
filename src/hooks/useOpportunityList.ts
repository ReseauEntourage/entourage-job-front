import { useCallback } from 'react';
import { Api } from 'src/api';
import { filtersToQueryParams, getOpportunityUserFromOffer } from 'src/utils';

const LIMIT = 25;

export function useOpportunityList(
  setOffers,
  setOtherOffers,
  setBookmarkedOffers,
  setLoading,
  setHasError
) {
  return useCallback(
    async (role, search, tabFilter, filters, candidateId) => {
      try {
        setLoading(true);

        switch (role) {
          case 'candidateAsAdmin': {
            const { data: offers } = await Api.getUserPrivateOpportunities(
              candidateId,
              {
                params: {
                  search,
                  ...filtersToQueryParams(filters),
                },
              }
            );

            const bookmarkedOffers = offers.filter((offer) => {
              const oppUser = getOpportunityUserFromOffer(offer, candidateId);
              return offer && oppUser && oppUser.bookmarked;
            });
            const restOffers = offers.filter((offer) => {
              const oppUser = getOpportunityUserFromOffer(offer, candidateId);

              return !offer || !oppUser || !oppUser.bookmarked;
            });
            setOffers(restOffers);
            setOtherOffers(undefined);
            setBookmarkedOffers(bookmarkedOffers);
            break;
          }
          case 'admin': {
            const { data: offers } = await Api.getOpportunityAdmin({
              params: {
                search,
                type: tabFilter,
                ...filtersToQueryParams(filters),
              },
            });

            const sortedOffers = offers.sort((a, b) => {
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            });

            setOffers(sortedOffers);
            setOtherOffers(undefined);
            setBookmarkedOffers(undefined);

            break;
          }
          default: {
            const {
              data: { offers, otherOffers },
            } = await Api.getAllCandidateOpportunities(candidateId, {
              params: {
                search,
                type: tabFilter,
                ...filtersToQueryParams(filters),
              },
            });

            const bookmarkedOffers = offers.filter((offer) => {
              return (
                offer &&
                offer.opportunityUsers &&
                offer.opportunityUsers.bookmarked
              );
            });
            const restOffers = offers.filter((offer) => {
              return (
                !offer ||
                !offer.opportunityUsers ||
                !offer.opportunityUsers.bookmarked
              );
            });
            setOffers(restOffers);
            setOtherOffers(otherOffers);
            setBookmarkedOffers(bookmarkedOffers);

            break;
          }
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        setHasError(true);
      }
    },
    [setBookmarkedOffers, setHasError, setLoading, setOffers, setOtherOffers]
  );
}

export function useAdminOpportunities(
  setOffers,
  setLoading,
  setHasError,
  setHasFetchedAll
) {
  return useCallback(
    async (
      search,
      filters,
      offset,
      shouldFetchAll,
      currentTag,
      role,
      candidateId
    ) => {
      try {
        setLoading(true);
        setHasError(false);
        if (role === 'candidateAsAdmin') {
          const { data: offers } = await Api.getUserPrivateOpportunities(
            candidateId,
            {}
          );
          setOffers(offers);
        } else {
          const { tag, ...filtersToSend } = filters;
          const { data } = await Api.getOpportunityAdmin({
            params: {
              search,
              type: tag.value || currentTag.value,
              offset: shouldFetchAll ? 0 : offset,
              limit: shouldFetchAll ? LIMIT + offset * LIMIT : LIMIT,
              ...filtersToQueryParams(filtersToSend),
            },
          });
          setOffers((prevOffers) => {
            return prevOffers && offset > 0 && !shouldFetchAll
              ? [...prevOffers, ...data]
              : data;
          });
          if (data.length < LIMIT) {
            setHasFetchedAll(true);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        setHasError(true);
      }
    },
    [setLoading, setOffers, setHasFetchedAll, setHasError]
  );
}

export function useCandidateOpportunities(
  setOffers,
  setLoading,
  setHasError,
  setHasFetchedAll
) {
  return useCallback(
    async (candidateId, search, type, filters, offset, shouldFetchAll) => {
      try {
        setLoading(true);
        setHasError(false);
        const {
          data: { offers },
        } = await Api.getAllCandidateOpportunities(candidateId, {
          params: {
            search,
            type,
            offset: shouldFetchAll ? 0 : offset,
            limit: shouldFetchAll ? LIMIT + offset * LIMIT : LIMIT,
            ...filtersToQueryParams(filters),
          },
        });
        setOffers((prevOffers) => {
          return prevOffers && offset > 0 && !shouldFetchAll
            ? [...prevOffers, ...offers]
            : offers;
        });
        if (offers.length < LIMIT) {
          setHasFetchedAll(true);
        }
        setHasError(false);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        setHasError(true);
      }
    },
    [setLoading, setOffers, setHasFetchedAll, setHasError]
  );
}
