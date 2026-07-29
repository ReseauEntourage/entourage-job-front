import { listenerMiddleware } from '@/src/store/listenerMiddleware';
import { currentUserActions } from '@/src/use-cases/current-user';
import { profileCompletionApi } from './profile-completion.api';

/**
 * Translates `refreshProfileCompletionSaga` and its four
 * `takeLatest(currentUserActions.X, ...)` registrations in
 * `profile-completion.saga.ts`: refetches the completion rate 300ms after a
 * profile-affecting current-user mutation succeeds (see design.md
 * Decision 8).
 */
[
  currentUserActions.updateProfileSucceeded,
  currentUserActions.updateUserProfilePictureSucceeded,
  currentUserActions.uploadExternalCvSucceeded,
  currentUserActions.deleteExternalCvSucceeded,
].forEach((actionCreator) => {
  listenerMiddleware.startListening({
    actionCreator,
    effect: async (_action, listenerApi) => {
      // On attend un peu pour s'assurer que le back a bien traité la mise à jour
      await listenerApi.delay(300);
      listenerApi.dispatch(
        profileCompletionApi.endpoints.getProfileCompletion.initiate(
          undefined,
          { forceRefetch: true }
        )
      );
    },
  });
});
