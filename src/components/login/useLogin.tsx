import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { StyledErrorMessage } from '../forms/FormFooter/FormFooter.styles';
import { SendVerifyEmailButton } from '../verify-email/SendVerifyEmailButton';
import { selectLoginError } from 'src/use-cases/authentication';
import { selectCurrentUser } from 'src/use-cases/current-user';
import { getDefaultUrl } from 'src/utils/Redirects';

export function useLogin() {
  const user = useSelector(selectCurrentUser);
  const {
    replace,
    query: { requestedPath },
  } = useRouter();

  const [email, setEmail] = useState<string | undefined>(undefined);

  const loginError = useSelector(selectLoginError);

  const rateLimitErrorMessage =
    'Trop de tentatives infructueuses.\nVeuillez ressayer dans 1 minute.';

  const loginErrorMessage: ReactNode | undefined = useMemo<
    ReactNode | undefined
  >(() => {
    if (!loginError) {
      return;
    }

    if (loginError === 'RATE_LIMIT') {
      return rateLimitErrorMessage;
    }
    if (loginError === 'UNVERIFIED_EMAIL') {
      return (
        <>
          <StyledErrorMessage>
            Votre adresse email n&apos;a pas été vérifiée. Veuillez consulter
            votre boîte mail et cliquer sur le lien de vérification.
          </StyledErrorMessage>
          <SendVerifyEmailButton email={email} />
        </>
      );
    }

    if (loginError === 'INVALID_CREDENTIALS') {
      return 'Erreur de connexion. Identifiant ou mot de passe invalide.';
    }

    return 'Une erreur est survenue';
  }, [email, loginError]);

  useEffect(() => {
    let finalPath: string | undefined;

    if (Array.isArray(requestedPath)) {
      [finalPath] = requestedPath;
    } else {
      finalPath = requestedPath;
    }

    // Si le path contient un paramètre de route dynamique [alertId]
    if (finalPath && finalPath.includes('[alertId]')) {
      // Extraire l'ID de l'alerte depuis l'URL courante ou d'autres sources
      // Exemple: si on a accès à l'ID réel de l'alerte via un autre moyen
      const alertId = new URLSearchParams(window.location.search).get(
        'alertId'
      );
      if (alertId) {
        // Remplacer [alertId] par la valeur réelle
        finalPath = finalPath.replace('[alertId]', alertId);
      }
    }
    if (user && user.isEmailVerified) {
      // Ajout d'un délai court pour s'assurer que la redirection fonctionne correctement
      setTimeout(() => {
        replace(finalPath || getDefaultUrl(user.role));
      }, 100);
    }
  }, [replace, requestedPath, user]);

  return {
    rateLimitErrorMessage,
    loginErrorMessage,
    setEmail: (value: string) => {
      setEmail(value);
    },
  };
}
