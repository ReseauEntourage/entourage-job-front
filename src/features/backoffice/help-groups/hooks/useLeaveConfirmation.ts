import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { LEAVE_PAGE_CONFIRM } from '../help-groups-participation.labels';

/**
 * Asks for a confirmation before leaving the page (tab closing, reload or
 * in-app navigation) while `hasUnsavedText` is true. The text itself stays
 * as a draft.
 */
export const useLeaveConfirmation = (hasUnsavedText: boolean) => {
  const router = useRouter();

  useEffect(() => {
    if (!hasUnsavedText) {
      return undefined;
    }
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Required by some browsers to show the native confirmation
      event.returnValue = '';
    };
    const onRouteChangeStart = (url: string) => {
      if (url === router.asPath || window.confirm(LEAVE_PAGE_CONFIRM)) {
        return;
      }
      router.events.emit('routeChangeError');
      // Cancels the Next navigation (documented workaround)

      throw 'Navigation cancelled: unpublished text';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    router.events?.on('routeChangeStart', onRouteChangeStart);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      router.events?.off('routeChangeStart', onRouteChangeStart);
    };
  }, [hasUnsavedText, router]);
};
