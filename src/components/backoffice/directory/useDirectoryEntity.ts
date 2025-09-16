import { DirectoryEntity } from '@/src/constants/entity';
import { useEntity } from '@/src/hooks/queryParams/useEntity';

export function useDirectoryEntity() {
  const entityFilter = useEntity();

  return entityFilter || [DirectoryEntity.USER];
}
