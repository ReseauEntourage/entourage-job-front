import _ from 'lodash';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { usePrevious } from 'src/hooks/utils';
import { profilesActions } from 'src/use-cases/profiles';
import { useDirectoryFiltersQueryParams } from './useDirectoryFiltersQueryParams';

export function useDirectoryFilters() {
  const dispatch = useDispatch();

  const directoryFiltersParams = useDirectoryFiltersQueryParams();

  const prevDirectoryFiltersParams = usePrevious(directoryFiltersParams);

  useEffect(() => {
    if (!_.isEqual(prevDirectoryFiltersParams, directoryFiltersParams)) {
      dispatch(
        profilesActions.fetchProfilesWithFilters(directoryFiltersParams)
      );
    }
  }, [dispatch, directoryFiltersParams, prevDirectoryFiltersParams]);
}
