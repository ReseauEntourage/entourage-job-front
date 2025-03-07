import React from 'react';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { Parameters } from 'src/components/backoffice/parameters/Parameters';
import { useSelectedProfile } from 'src/components/backoffice/profile/useSelectedProfile';

const Parametres = () => {
  const { selectedProfile } = useSelectedProfile();

  return (
    <LayoutBackOffice title={selectedProfile ? `Paramètres` : 'Paramètres'}>
      <Parameters />
    </LayoutBackOffice>
  );
};

export default Parametres;
