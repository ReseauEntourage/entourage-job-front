import React, { useEffect, useState } from 'react';
import { Api } from 'src/api';
import { UserWithUserCandidate } from 'src/api/types';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { ParametresLayout } from 'src/components/backoffice/parametres/ParametresLayout';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';

const Parametres = () => {
  const user = useAuthenticatedUser();
  const [userData, setUserData] = useState<UserWithUserCandidate>();
  const [loadingPersonal, setLoadingPersonal] = useState(false);

  useEffect(() => {
    if (user) {
      setLoadingPersonal(true);
      Api.getUserById(user.id)
        .then(({ data }) => {
          setUserData(data);
        })
        .finally(() => {
          setLoadingPersonal(false);
        });
    }
  }, [user]);

  return (
    <LayoutBackOffice title="Mes Paramètres">
      {userData && user ? (
        <ParametresLayout
          user={user}
          userData={userData}
          loadingPersonal={loadingPersonal}
          setUserData={setUserData}
        />
      ) : (
        <LoadingScreen />
      )}
    </LayoutBackOffice>
  );
};

export default Parametres;
