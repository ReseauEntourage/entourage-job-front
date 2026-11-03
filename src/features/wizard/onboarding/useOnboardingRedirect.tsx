import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { UserRoles } from '@/src/constants/users';
import { getRequestedPath } from '@/src/hooks/authentication/usePasswordSetupRedirect';
import { fetchUserSelectors } from '@/src/use-cases/current-user';
import {
  OnboardingStatus,
  onboardingExcludedRoles,
} from './onboarding.constants';

export function useOnboardingRedirect({ currentUser }: { currentUser: any }) {
  const { replace, asPath } = useRouter();
  // Page the user was sent away from, while the redirection to the wizard is
  // in flight. Reset once the wizard is reached, so that the next backoffice
  // page opened (in-app navigation included) is redirected again.
  const [lastRedirectedFrom, setLastRedirectedFrom] = useState<string | null>(
    null
  );

  const onboardingPath = '/wizard/run';

  const isFetchUserSucceeded = useSelector(
    fetchUserSelectors.selectIsFetchUserSucceeded
  );
  const isFetchUserFailed = useSelector(
    fetchUserSelectors.selectIsFetchUserFailed
  );
  const isCurrentUserFetchFinished = isFetchUserSucceeded || isFetchUserFailed;

  const onboardingStatus = currentUser?.onboardingStatus;
  // Finalizing the account comes first: `usePasswordSetupRedirect` owns the
  // navigation until the password is set, so the two never compete.
  const isPasswordSetupRequired = currentUser?.hasPassword === false;
  const isUserAuthenticated = !!currentUser;
  const isOnboardingExcludedRole = onboardingExcludedRoles.includes(
    currentUser?.role as UserRoles
  );
  const isInBackoffice = asPath.startsWith('/backoffice');
  // Compared without query nor hash: the wizard is opened with `?requestedPath=`.
  const currentPathname = asPath.split(/[?#]/)[0];
  const isOnOnboardingPage =
    currentPathname === onboardingPath ||
    currentPathname.startsWith(`${onboardingPath}/`);

  const isOnboardingCompleted = onboardingStatus === OnboardingStatus.COMPLETED;
  const hasJustRedirectedToOnboarding =
    lastRedirectedFrom !== null && lastRedirectedFrom === asPath;
  const isCompanyAdmin =
    isCurrentUserFetchFinished &&
    currentUser?.role === UserRoles.COACH &&
    !!currentUser?.company?.companyUser?.isAdmin;

  const shouldWaitForCurrentUser =
    isInBackoffice && !isCurrentUserFetchFinished;

  useEffect(() => {
    if (isOnOnboardingPage && lastRedirectedFrom !== null) {
      setLastRedirectedFrom(null);
    }
  }, [isOnOnboardingPage, lastRedirectedFrom]);

  useEffect(() => {
    if (shouldWaitForCurrentUser) {
      return;
    }
    const isOnboardingRequired =
      isUserAuthenticated &&
      !isPasswordSetupRequired &&
      isInBackoffice &&
      !isOnboardingExcludedRole &&
      !isOnboardingCompleted &&
      !isOnOnboardingPage &&
      !hasJustRedirectedToOnboarding &&
      !isCompanyAdmin;

    if (isOnboardingRequired) {
      setLastRedirectedFrom(asPath);
      replace({
        pathname: onboardingPath,
        query: { requestedPath: getRequestedPath(asPath) },
      });
    }
  }, [
    asPath,
    isUserAuthenticated,
    onboardingStatus,
    lastRedirectedFrom,
    replace,
    isInBackoffice,
    isOnOnboardingPage,
    isOnboardingExcludedRole,
    isOnboardingCompleted,
    hasJustRedirectedToOnboarding,
    isCompanyAdmin,
    onboardingPath,
    shouldWaitForCurrentUser,
    isPasswordSetupRequired,
  ]);

  // Si la route ne nécessite pas d'authentification (pas de currentUser), on considère la route comme prête
  const isOnboardingRouteReady =
    !shouldWaitForCurrentUser &&
    (!isInBackoffice ||
      !isUserAuthenticated ||
      isPasswordSetupRequired ||
      isOnboardingExcludedRole ||
      isOnboardingCompleted ||
      isOnOnboardingPage ||
      hasJustRedirectedToOnboarding ||
      isCompanyAdmin);

  return { isOnboardingRouteReady };
}
