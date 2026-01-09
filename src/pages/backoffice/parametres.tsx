import React from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { Parameters } from '@/src/features/backoffice/parameters/Parameters';

const Parametres = () => {
  return (
    <LayoutBackOffice title="Paramètres">
      <Parameters />
    </LayoutBackOffice>
  );
};

export default Parametres;
