import { fetchProfileCompletionAdapter } from './profile-completion.adapters';
import { RootState } from './profile-completion.slice';

export const fetchProfileCompletionSelectors =
  fetchProfileCompletionAdapter.getSelectors<RootState>(
    (state) => state.profileCompletion.fetchProfileCompletion
  );

export function selectProfileCompletionRate(state: RootState) {
  return state.profileCompletion.completionRate;
}
