import { useRouter } from 'next/router';
import { ReferingStep } from '@/src/components/backoffice/referer/Refering/Refering.types';

export function useStep() {
  const {
    query: { step },
  } = useRouter();

  return step as ReferingStep;
}
