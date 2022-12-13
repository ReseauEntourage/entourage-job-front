import { useCallback } from 'react';
import Api from 'src/api/index.ts';
import { filtersToQueryParams, getOpportunityUserFromOffer } from 'src/utils';

const LIMIT = 25;

export function useOpportunityList(
  setOffers,
  setOtherOffers,
  setBookmarkedOffers,
  setNumberOfResults,
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
            setNumberOfResults(offers.length);
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
              return new Date(b.date) - new Date(a.date);
            });

            setOffers(sortedOffers);
            setOtherOffers(undefined);
            setBookmarkedOffers(undefined);
            setNumberOfResults(sortedOffers.length);

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
            setNumberOfResults(offers.length);

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
    [
      setBookmarkedOffers,
      setHasError,
      setLoading,
      setNumberOfResults,
      setOffers,
      setOtherOffers,
    ]
  );
}

export function useCandidateOpportunities(
  setOffers,
  setOtherOffers,
  setNumberOfResults,
  setLoading,
  setHasError
) {
  return useCallback(
    async (candidateId, search, type, filters, offset) => {
      try {
        setLoading(true);
        const {
          data: { offers, otherOffers },
        } = await Api.getAllCandidateOpportunities(candidateId, {
          params: {
            search,
            type,
            offset,
            ...filtersToQueryParams(filters),
          },
        });
        setOffers(offers);
        setOtherOffers(otherOffers);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        setHasError(true);
      }
    },
    [setOffers, setLoading, setOtherOffers, setHasError]
  );
}
