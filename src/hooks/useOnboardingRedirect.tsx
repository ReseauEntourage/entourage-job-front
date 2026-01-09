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
  const isInBackoffice = asPath.startsWith('/backoffice');
  // On considère toute page /backoffice/onboarding ou ses sous-pages
  const isOnOnboardingPage =
    asPath === '/backoffice/onboarding' ||
    asPath.startsWith('/backoffice/onboarding/');

  useEffect(() => {
    const isOnboardingRequired =
      isUserAuthenticated &&
      onboardingStatus !== OnboardingStatus.COMPLETED &&
      !isOnOnboardingPage &&
      lastRedirectionPath !== '/backoffice/onboarding' &&
      isInBackoffice;

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
    isInBackoffice,
    isOnOnboardingPage,
  ]);

  // Si la route ne nécessite pas d'authentification (pas de currentUser), on considère la route comme prête
  const isOnboardingRouteReady =
    !isUserAuthenticated ||
    !isInBackoffice ||
    onboardingStatus === OnboardingStatus.COMPLETED ||
    isOnOnboardingPage;

  return { isOnboardingRouteReady };
}
