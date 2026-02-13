import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  OnboardingStatus,
  onboardingExcludedRoles,
} from '../constants/onboarding';
import { UserRoles } from '../constants/users';
import { fetchUserSelectors } from 'src/use-cases/current-user';

export function useOnboardingRedirect({ currentUser }: { currentUser: any }) {
  const { replace, asPath } = useRouter();
  const [lastRedirectionPath, setLastRedirectionPath] = useState<string | null>(
    null
  );

  const onboardingPath = '/backoffice/onboarding';

  const isFetchUserSucceeded = useSelector(
    fetchUserSelectors.selectIsFetchUserSucceeded
  );
  const isFetchUserFailed = useSelector(
    fetchUserSelectors.selectIsFetchUserFailed
  );
  const isCurrentUserFetchFinished = isFetchUserSucceeded || isFetchUserFailed;

  const onboardingStatus = currentUser?.onboardingStatus;
  const isUserAuthenticated = !!currentUser;
  const isOnboardingExcludedRole = onboardingExcludedRoles.includes(
    currentUser?.role as UserRoles
  );
  const isInBackoffice = asPath.startsWith('/backoffice');
  // On considère toute page /backoffice/onboarding ou ses sous-pages
  const isOnOnboardingPage =
    asPath === onboardingPath || asPath.startsWith(`${onboardingPath}/`);

  const isOnboardingCompleted = onboardingStatus === OnboardingStatus.COMPLETED;
  const hasJustRedirectedToOnboarding = lastRedirectionPath === onboardingPath;
  const isCompanyAdmin =
    isCurrentUserFetchFinished &&
    currentUser?.role === UserRoles.COACH &&
    !!currentUser?.company?.companyUser?.isAdmin;

  const shouldWaitForCurrentUser =
    isInBackoffice && !isCurrentUserFetchFinished;

  useEffect(() => {
    if (shouldWaitForCurrentUser) {
      return;
    }
    const isOnboardingRequired =
      isUserAuthenticated &&
      isInBackoffice &&
      !isOnboardingExcludedRole &&
      !isOnboardingCompleted &&
      !isOnOnboardingPage &&
      !hasJustRedirectedToOnboarding &&
      !isCompanyAdmin;

    if (isOnboardingRequired) {
      setLastRedirectionPath(onboardingPath);
      replace(onboardingPath);
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
    isOnboardingCompleted,
    hasJustRedirectedToOnboarding,
    isCompanyAdmin,
    onboardingPath,
    shouldWaitForCurrentUser,
  ]);

  // Si la route ne nécessite pas d'authentification (pas de currentUser), on considère la route comme prête
  const isOnboardingRouteReady =
    !shouldWaitForCurrentUser &&
    (!isInBackoffice ||
      !isUserAuthenticated ||
      isOnboardingExcludedRole ||
      isOnboardingCompleted ||
      isOnOnboardingPage ||
      hasJustRedirectedToOnboarding ||
      isCompanyAdmin);

  return { isOnboardingRouteReady };
}
