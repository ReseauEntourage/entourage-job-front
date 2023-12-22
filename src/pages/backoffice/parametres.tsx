import React, { useEffect, useState } from 'react';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { ParametresLayout } from 'src/components/backoffice/parametres/ParametresLayout';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';

const Parametres = () => {
  const user = useAuthenticatedUser();
  const [loadingPersonal, setLoadingPersonal] = useState(true);

  useEffect(() => {
    if (user) {
      setLoadingPersonal(false);
    } else {
      setLoadingPersonal(true);
    }
  }, [user]);

  return (
    <LayoutBackOffice title="Mes Paramètres">
      {user ? (
        <ParametresLayout loadingPersonal={loadingPersonal} />
      ) : (
        <LoadingScreen />
      )}
    </LayoutBackOffice>
  );
};

export default Parametres;
