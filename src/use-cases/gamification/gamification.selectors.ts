import { RootState } from './gamification.slice';

export function selectAchievementProgressionToShow(state: RootState) {
  return state.gamification.achievementProgressionToShow;
}

export function selectAchievementProgressions(state: RootState) {
  return state.gamification.achievementProgressions;
}
