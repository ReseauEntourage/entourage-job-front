import { useRouter } from 'next/router';
import { AdminZone } from 'src/constants/departements';

export function useZone() {
  const {
    query: { zone },
  } = useRouter();

  return zone as AdminZone | AdminZone[];
}
