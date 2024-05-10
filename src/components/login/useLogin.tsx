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

  const loginErrorMessage: string | ReactNode | undefined = useMemo<
    string | ReactNode | undefined
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
    const path = Array.isArray(requestedPath)
      ? requestedPath[0]
      : requestedPath;

    if (user) {
      replace(path || getDefaultUrl(user.role));
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
