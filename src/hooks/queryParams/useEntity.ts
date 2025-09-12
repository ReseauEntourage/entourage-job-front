import { useRouter } from 'next/router';
import { DirectoryEntity } from '@/src/constants/entity';

export function useEntity() {
  const {
    query: { entity },
  } = useRouter();

  return entity as DirectoryEntity;
}
