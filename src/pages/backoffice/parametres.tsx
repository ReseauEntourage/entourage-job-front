import React from 'react';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { Parameters } from 'src/components/backoffice/parameters/Parameters';

const Parametres = () => {
  return (
    <LayoutBackOffice title="Paramètres">
      <Parameters />
    </LayoutBackOffice>
  );
};

export default Parametres;
