import React from 'react';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { ParametresLayout } from 'src/components/backoffice/parametres/ParametresLayout';

const Parametres = () => {
  return (
    <LayoutBackOffice title="Mes Paramètres">
      <ParametresLayout />
    </LayoutBackOffice>
  );
};

export default Parametres;
