import { useRouter } from 'next/router';
import { ReferingStep } from '@/src/features/backoffice/referer/Refering/Refering.types';

export function useStep() {
  const {
    query: { step },
  } = useRouter();

  return step as ReferingStep;
}
