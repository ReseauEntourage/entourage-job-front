import { useRouter } from 'next/router';

export function useQueryParamsOpportunities() {
  const {
    query: {
      offerId: opportunityId,
      memberId,
      tab,
      updateStatus,
      ...restQuery
    },
  } = useRouter();

  return restQuery;
}
