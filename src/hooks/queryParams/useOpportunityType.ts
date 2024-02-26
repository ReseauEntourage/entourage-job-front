import { useRouter } from 'next/router';
import { OpportunityType } from 'src/api/types';

export function useOpportunityType() {
  const {
    query: { type },
  } = useRouter();

  return type as OpportunityType;
}
