import { useRouter } from 'next/router';

export function useOpportunityId() {
  const {
    query: { offerId },
  } = useRouter();

  return offerId;
}
