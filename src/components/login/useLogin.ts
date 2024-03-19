import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectLoginError } from 'src/use-cases/authentication';
import { selectCurrentUser } from 'src/use-cases/current-user';
import { getDefaultUrl } from 'src/utils/Redirects';

export function useLogin() {
  const user = useSelector(selectCurrentUser);
  const {
    replace,
    query: { requestedPath },
  } = useRouter();

  const loginError = useSelector(selectLoginError);

  const rateLimitErrorMessage =
    'Trop de tentatives infructueuses.\nVeuillez ressayer dans 1 minute.';

  const loginErrorMessage = useMemo(() => {
    if (!loginError) {
      return;
    }

    if (loginError === 'RATE_LIMIT') {
      return rateLimitErrorMessage;
    }

    if (loginError === 'INVALID_CREDENTIALS') {
      return 'Erreur de connexion. Identifiant ou mot de passe invalide.';
    }

    return 'Une erreur est survenue';
  }, [loginError]);

  useEffect(() => {
    const path = Array.isArray(requestedPath)
      ? requestedPath[0]
      : requestedPath;

    if (user) {
      replace(path || getDefaultUrl(user.role));
    }
  }, [replace, requestedPath, user]);

  return { rateLimitErrorMessage, loginErrorMessage };
}
