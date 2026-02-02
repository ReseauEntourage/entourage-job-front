import React from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { Directory } from '@/src/features/backoffice/directory/Directory/Directory';
import { useDirectoryRoleRedirection } from '@/src/features/backoffice/directory/useDirectoryRoleRedirection';

const Annuaire = () => {
  useDirectoryRoleRedirection();

  return (
    <LayoutBackOffice title="Annuaire">
      <Directory />
    </LayoutBackOffice>
  );
};

export default Annuaire;
