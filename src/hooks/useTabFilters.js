import _ from 'lodash';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { getFiltersTagsFromQueryParamsFront } from 'src/utils';

export function useTabFilters(filtersData, path, otherPathParams) {
  const { push, query: originalQuery } = useRouter();

  const { tag: queryTag, ...otherParams } = otherPathParams
    ? _.omit(originalQuery, otherPathParams)
    : originalQuery;

  const tabFilters = getFiltersTagsFromQueryParamsFront(queryTag, filtersData);

  const setTabFilters = useCallback(
    (tag) => {
      const query = {
        tag,
        ...otherParams,
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
    [otherParams, path, push]
  );

  return {
    tabFilters,
    setTabFilters,
  };
}
