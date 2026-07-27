import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '@/src/api/types';
import { ReduxRequestEvents } from '@/src/constants';
import { authenticationActions } from '@/src/use-cases/authentication';
import {
  messagingActions,
  selectPostMessageStatus,
  selectSelectedConversationId,
} from '@/src/use-cases/messaging';

interface UseWizardRedirectsParams {
  currentUser: User | null;
  isFetchUserFinished: boolean;
  registrationStepsLength: number;
  isLogoutSucceeded: boolean;
  isOnboardingAlreadyCompleted: boolean;
  updateOnboardingStatus: string;
  skipDashboardRedirectRef: React.MutableRefObject<boolean>;
  pendingSuggestedMessageRedirectRef: React.MutableRefObject<boolean>;
}

// useWizardRedirects - Centralizes the wizard's redirects (/wizard, /login,
// dashboard) so they stay readable independently of the three phases.
export const useWizardRedirects = ({
  currentUser,
  isFetchUserFinished,
  registrationStepsLength,
  isLogoutSucceeded,
  isOnboardingAlreadyCompleted,
  updateOnboardingStatus,
  skipDashboardRedirectRef,
  pendingSuggestedMessageRedirectRef,
}: UseWizardRedirectsParams): void => {
  const dispatch = useDispatch();
  const router = useRouter();
  const postMessageStatus = useSelector(selectPostMessageStatus);
  const selectedConversationId = useSelector(selectSelectedConversationId);

  // Back to selection if there's no valid flow (null or unrecognized value).
  // We wait for the current user fetch to finish: on a direct reload of
  // /wizard/run, the page mounts before /current responds, and a user
  // mid-onboarding would otherwise be sent to /wizard then the dashboard.
  useEffect(() => {
    if (!currentUser && isFetchUserFinished && registrationStepsLength === 0) {
      router.replace('/wizard');
    }
  }, [currentUser, isFetchUserFinished, registrationStepsLength, router]);

  // Redirect to /login after logging out from the wizard
  useEffect(() => {
    if (isLogoutSucceeded) {
      dispatch(authenticationActions.logoutReset());
      router.push('/login');
    }
  }, [isLogoutSucceeded, router, dispatch]);

  // Redirect to dashboard after onboarding completion (explicit update via
  // the wizard, or onboarding already COMPLETED server-side for Association
  // / Entreprise-admin). skipDashboardRedirectRef lets the recap step handle
  // the next navigation itself (messaging/directory CTA) without this
  // generic redirect overriding it: both triggers must share the same
  // effect, otherwise they re-run within the same commit and one of them
  // would consume the flag before the other could read it.
  useEffect(() => {
    const onboardingJustCompleted =
      updateOnboardingStatus === ReduxRequestEvents.SUCCEEDED;
    if (onboardingJustCompleted || isOnboardingAlreadyCompleted) {
      if (skipDashboardRedirectRef.current) {
        skipDashboardRedirectRef.current = false;
        return;
      }
      router.push('/backoffice/dashboard');
    }
  }, [
    updateOnboardingStatus,
    isOnboardingAlreadyCompleted,
    router,
    skipDashboardRedirectRef,
  ]);

  // Redirect after sending the recap step's suggested message.
  // completeOnboarding (above) marks onboarding completed as soon as "Send"
  // is clicked, which immediately empties the steps list and unmounts
  // RecapSuggestedMessage before the send call could resolve — a local
  // effect on that component would therefore never run. This hook survives
  // that unmount (it's part of the wizard's shell), which is why the
  // post-send redirect must be observed here.
  useEffect(() => {
    if (!pendingSuggestedMessageRedirectRef.current) {
      return;
    }
    if (postMessageStatus === ReduxRequestEvents.SUCCEEDED) {
      pendingSuggestedMessageRedirectRef.current = false;
      dispatch(messagingActions.postMessageReset());
      // `postMessageSucceeded` already puts the newly created conversation's
      // id into `selectedConversationId` (cf. messaging.slice.ts): pass it
      // explicitly as a query param rather than relying on the Redux store
      // persisting across navigation.
      router.push(
        selectedConversationId
          ? `/backoffice/messaging?conversationId=${selectedConversationId}`
          : '/backoffice/messaging'
      );
    } else if (postMessageStatus === ReduxRequestEvents.FAILED) {
      // The inline compose (textarea) has already disappeared at this point:
      // impossible to let the user correct and retry there. So we send them
      // back to the dashboard rather than leaving them stuck on an empty step.
      pendingSuggestedMessageRedirectRef.current = false;
      dispatch(messagingActions.postMessageReset());
      router.push('/backoffice/dashboard');
    }
  }, [
    postMessageStatus,
    selectedConversationId,
    pendingSuggestedMessageRedirectRef,
    router,
    dispatch,
  ]);
};
