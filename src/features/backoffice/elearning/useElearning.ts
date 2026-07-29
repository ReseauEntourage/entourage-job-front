import { useCallback, useMemo } from 'react';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import {
  useGetElearningUnitsQuery,
  usePostElearningCompletionMutation,
} from '@/src/use-cases/elearning';

export const useElearning = () => {
  const user = useAuthenticatedUser();
  const { data: elearningUnits = [], isLoading } = useGetElearningUnitsQuery(
    user.role
  );
  const [postElearningCompletion] = usePostElearningCompletionMutation();

  const nbUnitsCompleted = useMemo(() => {
    return elearningUnits.filter((unit) => unit.userCompletions.length > 0)
      .length;
  }, [elearningUnits]);

  const nbUnitsTotal = useMemo(() => {
    return elearningUnits.length;
  }, [elearningUnits]);

  const completionRate = useMemo(() => {
    if (nbUnitsTotal === 0) {
      return 0;
    }
    return Math.round((nbUnitsCompleted / nbUnitsTotal) * 100);
  }, [nbUnitsCompleted, nbUnitsTotal]);

  const completeUnit = useCallback(
    (unitId: string) => {
      postElearningCompletion({ unitId, role: user.role });
    },
    [postElearningCompletion, user.role]
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
    nbUnitsCompleted,
    nbUnitsTotal,
  };
};
