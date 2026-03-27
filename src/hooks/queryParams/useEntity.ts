import { useRouter } from 'next/router';
import { NetworkDirectoryEntity } from '@/src/constants/network-directory';

export function useEntity() {
  const {
    query: { entity },
  } = useRouter();

  return entity as NetworkDirectoryEntity;
}
