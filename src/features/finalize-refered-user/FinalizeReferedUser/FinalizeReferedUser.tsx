import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Spinner } from '@/src/components/ui/Spinner';
import { PasswordCriterias } from '@/src/features/backoffice/parameters/ChangePasswordCard/PasswordCriterias';
import { Api } from 'src/api';
import {
  isEmailAlreadyVerifiedError,
  isInvalidTokenError,
  isTokenExpiredError,
} from 'src/api/axiosErrors';
import { PostAuthFinalizeReferedUserParams } from 'src/api/types';
import { FormWithValidation } from 'src/features/forms/FormWithValidation';
import { formFinalizeReferedUser } from 'src/features/forms/schemas/formFinalizeReferedUser';
import { authenticationActions } from 'src/use-cases/authentication';

export const FinalizeReferedUser = () => {
  const [tokenString, setToken] = useState<string | null>(null);
  const {
    query: { token },
    isReady,
    push,
  } = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isReady) {
      setToken(token as string);
    }
  }, [token, isReady]);

  if (!isReady) {
    return <Spinner />;
  }

  if (!tokenString) {
    return <div>Pas de token</div>;
  }

  return (
    <>
      <PasswordCriterias />
      <FormWithValidation
        submitText="Se connecter"
        formSchema={formFinalizeReferedUser}
        onSubmit={async ({ setPassword }, setError) => {
          const params: PostAuthFinalizeReferedUserParams = {
            token: tokenString,
            password: setPassword,
          };
          try {
            const response = await Api.postAuthFinalizeReferedUser(params);
            setError('');
            dispatch(
              authenticationActions.loginRequested({
                email: response.data,
                password: setPassword,
              })
            );
            await push('/backoffice/dashboard');
          } catch (err) {
            if (isTokenExpiredError(err) || isInvalidTokenError(err)) {
              setError('Le token est invalide, veuillez réessayer');
            }
            if (isEmailAlreadyVerifiedError(err)) {
              setError('Vous avez déja défini un mot de passe');
            }
          }
        }}
      />
    </>
  );
};
