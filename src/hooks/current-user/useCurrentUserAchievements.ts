import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  currentUserActions,
  selectCurrentUserAchievements,
} from 'src/use-cases/current-user';

export function useCurrentUserAchievements() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(currentUserActions.fetchCurrentAchievementsRequested());
  }, [dispatch]);

  return useSelector(selectCurrentUserAchievements);
}
