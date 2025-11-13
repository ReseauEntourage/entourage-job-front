import { useRouter } from 'next/router';

export type EventDirectoryFilters = {
  search?: string;
  modes?: string[];
  departmentIds?: string[];
  eventTypes?: string[];
};

// Get the current query params for the directory filters
export function useEventDirectoryQueryParams() {
  const {
    query: { search, modes, eventTypes, departmentIds },
  } = useRouter();

  const normalizeArray = (value: unknown): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value as string[];
    return [value as string];
  };

  const filters: EventDirectoryFilters = {
    modes: normalizeArray(modes),
    departmentIds: normalizeArray(departmentIds),
    eventTypes: normalizeArray(eventTypes),
  };

  if (search) {
    return {
      ...filters,
      search: search as string,
    };
  }

  return filters;
}
