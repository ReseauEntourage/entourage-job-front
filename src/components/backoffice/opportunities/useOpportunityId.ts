import { useRouter } from 'next/router';

export function useOpportunityId(): string {
  const {
    query: { offerId },
  } = useRouter();

  if (Array.isArray(offerId)) {
    return offerId[0];
  }
  return offerId;
}
