// only for redirection purpose, to be deleted in 2024
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { getDefaultUrl } from 'src/utils/Redirects';

const Redirection = () => {
  const { replace } = useRouter();
  const user = useAuthenticatedUser();

  useEffect(() => {
    replace(getDefaultUrl(user.role));
  }, [replace, user.role]);

  return <LoadingScreen />;
};

export default Redirection;
