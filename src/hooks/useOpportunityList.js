import { useCallback } from 'react';
import Api from 'src/Axios';
import { filtersToQueryParams, getUserOpportunityFromOffer } from 'src/utils';

export function useOpportunityList(
  setOffers,
  setOtherOffers,
  setBookmarkedOffers,
  setNumberOfResults,
  setLoading,
  setHasError
) {
  return useCallback(
    async (role, search, tabFilter, filters, candidatId) => {
      try {
        setLoading(true);

        switch (role) {
          case 'candidateAsAdmin': {
            const {
              data: { offers },
            } = await Api.get(`/opportunity/user/private/${candidatId}`, {
              params: {
                search,
                ...filtersToQueryParams(filters),
              },
            });

            const bookmarkedOffers = offers.filter((offer) => {
              const userOpp = getUserOpportunityFromOffer(offer, candidatId);
              return offer && userOpp && userOpp.bookmarked;
            });
            const restOffers = offers.filter((offer) => {
              const userOpp = getUserOpportunityFromOffer(offer, candidatId);

              return !offer || !userOpp || !userOpp.bookmarked;
            });
            setOffers(restOffers);
            setOtherOffers(undefined);
            setBookmarkedOffers(bookmarkedOffers);
            setNumberOfResults(offers.length);
            break;
          }
          case 'admin': {
            const {
              data: { offers },
            } = await Api.get(`/opportunity/admin`, {
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
            } = await Api.get(`/opportunity/user/all/${candidatId}`, {
              params: {
                search,
                type: tabFilter,
                ...filtersToQueryParams(filters),
              },
            });

            const bookmarkedOffers = offers.filter((offer) => {
              return (
                offer &&
                offer.userOpportunity &&
                offer.userOpportunity.bookmarked
              );
            });
            const restOffers = offers.filter((offer) => {
              return (
                !offer ||
                !offer.userOpportunity ||
                !offer.userOpportunity.bookmarked
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
