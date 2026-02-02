import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  OnboardingStatus,
  onboardingExcludedRoles,
} from '../constants/onboarding';
import { UserRoles } from '../constants/users';

export function useOnboardingRedirect({ currentUser }: { currentUser: any }) {
  const { replace, asPath } = useRouter();
  const [lastRedirectionPath, setLastRedirectionPath] = useState<string | null>(
    null
  );
  const onboardingStatus = currentUser?.onboardingStatus;
  const isUserAuthenticated = !!currentUser;
  const isOnboardingExcludedRole = onboardingExcludedRoles.includes(
    currentUser?.role as UserRoles
  );
  const isInBackoffice = asPath.startsWith('/backoffice');
  // On considère toute page /backoffice/onboarding ou ses sous-pages
  const isOnOnboardingPage =
    asPath === '/backoffice/onboarding' ||
    asPath.startsWith('/backoffice/onboarding/');

  useEffect(() => {
    const isOnboardingRequired =
      isUserAuthenticated &&
      !isOnboardingExcludedRole &&
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
    isOnboardingExcludedRole,
  ]);

  // Si la route ne nécessite pas d'authentification (pas de currentUser), on considère la route comme prête
  const isOnboardingRouteReady =
    !isUserAuthenticated ||
    !isInBackoffice ||
    isOnboardingExcludedRole ||
    onboardingStatus === OnboardingStatus.COMPLETED ||
    isOnOnboardingPage;

  return { isOnboardingRouteReady };
}
