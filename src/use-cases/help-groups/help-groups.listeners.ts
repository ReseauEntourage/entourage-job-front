import { listenerMiddleware } from '@/src/store/listenerMiddleware';
import { authenticationActions } from '@/src/use-cases/authentication';
import { purgeHelpGroupDrafts } from './help-groups.drafts';

// The drafts are erased at logout, as the rest of the local state
listenerMiddleware.startListening({
  actionCreator: authenticationActions.logoutSucceeded,
  effect: () => {
    purgeHelpGroupDrafts();
  },
});
