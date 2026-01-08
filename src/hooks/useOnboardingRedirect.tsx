import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { OnboardingStatus } from '../constants/onboarding';

export function useOnboardingRedirect({ currentUser }: { currentUser: any }) {
  const { replace, asPath } = useRouter();
  const [lastRedirectionPath, setLastRedirectionPath] = useState<string | null>(
    null
  );
  const onboardingStatus = currentUser?.onboardingStatus;
  const isUserAuthenticated = !!currentUser;

  useEffect(() => {
    const isOnboardingRequired =
      isUserAuthenticated &&
      onboardingStatus !== OnboardingStatus.COMPLETED &&
      asPath !== '/backoffice/onboarding' &&
      lastRedirectionPath !== '/backoffice/onboarding';

    if (isOnboardingRequired) {
      setLastRedirectionPath('/backoffice/onboarding');
      replace('/backoffice/onboarding');
    }
  }, [
    asPath,
    isUserAuthenticated,
    onboardingStatus,
    lastRedirectionPath,
    replace,
  ]);

  // Si la route ne nécessite pas d'authentification (pas de currentUser), on considère la route comme prête
  const isOnboardingRouteReady =
    !isUserAuthenticated ||
    onboardingStatus === OnboardingStatus.COMPLETED ||
    asPath === '/backoffice/onboarding';

  return { isOnboardingRouteReady };
}
