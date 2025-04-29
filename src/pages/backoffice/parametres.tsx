import React from 'react';
import { useSelector } from 'react-redux';
import { LoadingScreen } from '@/src/components/backoffice/LoadingScreen';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { Parameters } from 'src/components/backoffice/parameters/Parameters';
import { fetchUserCompleteSelectors } from 'src/use-cases/current-user';

const Parametres = () => {
  const isFetchProfileRequested = useSelector(
    fetchUserCompleteSelectors.selectIsFetchUserRequested
  );

  return (
    <LayoutBackOffice title="Paramètres">
      {!isFetchProfileRequested ? <Parameters /> : <LoadingScreen />}
    </LayoutBackOffice>
  );
};

export default Parametres;
