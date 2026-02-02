import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxRequestEvents } from '@/src/constants';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import {
  elearningActions,
  selectElearningUnits,
  selectFetchElearningUnitsState,
  selectIsLoading,
} from '@/src/use-cases/elearning';

export const useElearning = () => {
  const user = useAuthenticatedUser();
  const isLoading = useSelector(selectIsLoading);
  const elearningUnits = useSelector(selectElearningUnits);
  const fetchElearningUnitsState = useSelector(selectFetchElearningUnitsState);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchElearningUnitsState.status === ReduxRequestEvents.IDLE) {
      dispatch(elearningActions.fetchElearningUnitsRequested(user.role));
    }
  }, [elearningUnits, user.role, dispatch, fetchElearningUnitsState.status]);

  const completionRate = useMemo(() => {
    const totalUnits = elearningUnits?.length ?? 0;
    if (totalUnits === 0) {
      return 0;
    }

    const completedUnits = elearningUnits.filter(
      (unit) => unit.userCompletions.length > 0
    ).length;
    return Math.round((completedUnits / totalUnits) * 100);
  }, [elearningUnits]);

  const completeUnit = useCallback(
    (unitId: string) => {
      dispatch(elearningActions.postElearningCompletionRequested({ unitId }));
    },
    [dispatch]
  );

  const hasCompleteAllUnits = useMemo(() => {
    const totalUnits = elearningUnits?.length ?? 0;
    if (totalUnits === 0) {
      return false;
    }
    return elearningUnits.every((unit) => unit.userCompletions.length > 0);
  }, [elearningUnits]);

  return {
    completionRate,
    hasCompleteAllUnits,
    isLoading,
    elearningUnits,
    completeUnit,
  };
};
