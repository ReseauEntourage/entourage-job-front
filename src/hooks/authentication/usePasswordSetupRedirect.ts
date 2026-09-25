import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { User } from '@/src/api/types';

export const FINALIZE_ACCOUNT_PATH = '/finaliser-compte';

/**
 * The page to come back to once the password is set, without the one-time
 * autologin token that may still be in the URL (it has already been consumed).
 */
function getRequestedPath(asPath: string) {
  const [pathname, search = ''] = asPath.split('?');
  const params = new URLSearchParams(search);
  params.delete('autologinToken');
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

/**
 * Blocks every page for an authenticated account that has no password yet
 * (e.g. a refered candidate logged in through an autologin link), and sends it
 * to `/finaliser-compte`. The backend restricts such a session anyway: the
 * page is not rendered before the redirection, so its calls never answer 403.
 */
export function usePasswordSetupRedirect({
  currentUser,
}: {
  currentUser: User | null;
}) {
  const { replace, asPath, pathname } = useRouter();
  const [lastRedirectedFrom, setLastRedirectedFrom] = useState<string | null>(
    null
  );

  const isPasswordSetupRequired =
    !!currentUser && currentUser.hasPassword === false;
  const isOnFinalizeAccountPage = pathname === FINALIZE_ACCOUNT_PATH;

  useEffect(() => {
    if (
      isPasswordSetupRequired &&
      !isOnFinalizeAccountPage &&
      lastRedirectedFrom !== asPath
    ) {
      setLastRedirectedFrom(asPath);
      replace({
        pathname: FINALIZE_ACCOUNT_PATH,
        query: { requestedPath: getRequestedPath(asPath) },
      });
    }
  }, [
    asPath,
    isOnFinalizeAccountPage,
    isPasswordSetupRequired,
    lastRedirectedFrom,
    replace,
  ]);

  return {
    isPasswordSetupRouteReady:
      !isPasswordSetupRequired || isOnFinalizeAccountPage,
  };
}
