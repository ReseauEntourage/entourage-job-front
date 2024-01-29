import { useRouter } from 'next/router';

export function useQueryParamsOpportunities() {
  const {
    query: {
      offerId: opportunityId,
      type,
      memberId,
      tab,
      updateStatus,
      candidateId,
      ...restQuery
    },
  } = useRouter();

  return restQuery;
}
