import React from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { Formations } from '@/src/features/backoffice/ressources/Formations';

const FormationsPage = () => {
  return (
    <LayoutBackOffice title="Formations">
      <Formations />
    </LayoutBackOffice>
  );
};

export default FormationsPage;
