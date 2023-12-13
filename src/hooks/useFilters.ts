import _ from 'lodash';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { gaEvent } from 'src/lib/gtag';
import {
  filtersToQueryParams,
  getFiltersObjectsFromQueryParamsFront,
} from 'src/utils/Filters';

export function useFilters(filtersData, path, otherPathParams?, resetTag?) {
  const { push, query: originalQuery } = useRouter();

  const // @ts-expect-error after enable TS strict mode. Please, try to fix it
    {
      search,
      ...params
    }: {
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      search?: string;
      [key: string]: string | string[];
    } = otherPathParams
      ? _.omit(originalQuery, otherPathParams)
      : originalQuery;

  const otherParams = _.omit(
    params,
    filtersData.map((filter) => {
      return filter.key;
    })
  );

  const filters = getFiltersObjectsFromQueryParamsFront(params, filtersData);

  const resetFilters = useCallback(() => {
    let query = {
      ...otherParams,
    };
    if (resetTag) {
      gaEvent(resetTag);
    }

    const mandatoryFilterConstants = filtersData.filter(({ mandatory }) => {
      return mandatory;
    });

    if (mandatoryFilterConstants.length > 0) {
      const mandatoryFilters = mandatoryFilterConstants.reduce((acc, curr) => {
        return {
          ...acc,
          [curr.key]: curr.constants,
        };
      }, {});

      query = {
        ...query,
        ...filtersToQueryParams(mandatoryFilters),
      };
    }

    push(
      {
        pathname: path,
        query,
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      }
    );
  }, [filtersData, otherParams, path, push, resetTag]);

  const setFilters = useCallback(
    (updatedFilters) => {
      const searchFilter = search ? { search } : {};

      const query = {
        ...otherParams,
        ..._.omitBy(filtersToQueryParams(updatedFilters), _.isNil),
        ...searchFilter,
      };

      push(
        {
          pathname: path,
          query,
        },
        undefined,
        {
          shallow: true,
          scroll: false,
        }
      );
    },
    [otherParams, path, push, search]
  );

  const setSearch = useCallback(
    (updatedSearch) => {
      const searchFilter = updatedSearch ? { search: updatedSearch } : {};
      const query = {
        ...params,
        ...searchFilter,
      };
      push(
        {
          pathname: path,
          query,
        },
        undefined,
        {
          shallow: true,
          scroll: false,
        }
      );
    },
    [params, path, push]
  );

  return {
    filters,
    setFilters,
    search,
    setSearch,
    resetFilters,
  };
}
