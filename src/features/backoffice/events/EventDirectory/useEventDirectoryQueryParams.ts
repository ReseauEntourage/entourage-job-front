import { useRouter } from 'next/router';

export type EventDirectoryFilters = {
  search?: string;
  modes?: string[];
  departmentIds?: string[];
  eventTypes?: string[];
  publicSensibilise?: string[];
};

// Get the current query params for the directory filters
export function useEventDirectoryQueryParams() {
  const {
    query: { search, modes, eventTypes, departmentIds, publicSensibilise },
  } = useRouter();

  const normalizeArray = (value: unknown): string[] => {
    if (!value) {
      return [];
    }
    if (Array.isArray(value)) {
      return value as string[];
    }
    return [value as string];
  };

  const filters: EventDirectoryFilters = {
    modes: normalizeArray(modes),
    departmentIds: normalizeArray(departmentIds),
    eventTypes: normalizeArray(eventTypes),
    publicSensibilise: normalizeArray(publicSensibilise),
  };

  if (search) {
    return {
      ...filters,
      search: search as string,
    };
  }

  return filters;
}
