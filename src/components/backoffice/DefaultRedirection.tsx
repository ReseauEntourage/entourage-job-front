import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { getDefaultUrl } from 'src/utils/Redirects';

export function DefaultRedirection() {
  const { replace } = useRouter();
  const user = useAuthenticatedUser();

  useEffect(() => {
    replace(getDefaultUrl(user.role));
  }, [replace, user.role]);

  return <LoadingScreen />;
}
