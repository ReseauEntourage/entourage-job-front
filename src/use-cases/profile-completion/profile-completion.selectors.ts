import { RootState } from './profile-completion.slice';

export function selectProfileCompletionRate(state: RootState) {
  return state.profileCompletion.completionRate;
}
