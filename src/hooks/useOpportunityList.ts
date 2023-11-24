import { useCallback } from 'react';
import { Api } from 'src/api';
import { filtersToQueryParams } from 'src/utils';

const LIMIT = 25;

export function useAdminOpportunities(
  setOffers,
  setLoading,
  setHasError,
  setHasFetchedAll
) {
  return useCallback(
    async (search, filters, offset, shouldFetchAll, currentTag) => {
      try {
        setLoading(true);
        setHasError(false);
        const { data } = await Api.getOpportunityAdmin({
          params: {
            search,
            type: currentTag,
            offset: shouldFetchAll ? 0 : offset,
            limit: shouldFetchAll ? LIMIT + offset * LIMIT : LIMIT,
            ...filtersToQueryParams(filters),
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

export function useAdminAsCandidateOpportunities(
  setOffers,
  setLoading,
  setHasError
) {
  return useCallback(
    async (candidateId) => {
      try {
        setLoading(true);
        setHasError(false);
        const { data: offers } = await Api.getUserPrivateOpportunities(
          candidateId,
          {}
        );
        setOffers(offers);
        setHasError(false);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        setHasError(true);
      }
    },
    [setLoading, setOffers, setHasError]
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
