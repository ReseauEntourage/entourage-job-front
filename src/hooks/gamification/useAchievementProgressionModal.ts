import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AchievementProgressionModal } from 'src/features/modals/AchievementProgressionModal/AchievementProgressionModal';
import { openModal } from 'src/features/modals/Modal/openModal';
import {
  gamificationActions,
  selectAchievementProgressionToShow,
} from 'src/use-cases/gamification';

/**
 * Watches the gamification Redux state and opens the achievement progression
 * modal when a new progression has been detected (i.e. after a message is sent
 * and a criterion value increased or a badge was newly obtained).
 *
 * Must be mounted inside a component that has access to the Redux store and to
 * the `ModalsListener` (e.g. the backoffice layout).
 */
export function useAchievementProgressionModal() {
  const dispatch = useDispatch();
  const achievementProgressionToShow = useSelector(
    selectAchievementProgressionToShow
  );

  useEffect(() => {
    if (!achievementProgressionToShow) {
      return;
    }

    openModal(
      React.createElement(AchievementProgressionModal, {
        entry: achievementProgressionToShow,
      })
    );
    dispatch(gamificationActions.dismissAchievementProgressionModal());
  }, [achievementProgressionToShow, dispatch]);
}
