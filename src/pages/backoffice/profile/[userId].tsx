import React, { useEffect, useState } from 'react';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { Profile } from 'src/components/backoffice/profile';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';

const PageProfile = () => {
  const user = useAuthenticatedUser();
  const [loadingPersonal, setLoadingPersonal] = useState(true);

  useEffect(() => {
    if (user) {
      setLoadingPersonal(false);
    } else {
      setLoadingPersonal(true);
    }
  }, [user]);

  if (loadingPersonal) {
    return <LoadingScreen />;
  }
  return <Profile />;
};

export default PageProfile;
