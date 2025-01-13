import React from 'react';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { Directory } from 'src/components/backoffice/directory/Directory/Directory';
import { useDirectoryRoleRedirection } from 'src/components/backoffice/directory/useDirectoryRoleRedirection';

const Annuaire = () => {
  useDirectoryRoleRedirection();

  return (
    <LayoutBackOffice title="Annuaire">
      <Directory />
    </LayoutBackOffice>
  );
};

export default Annuaire;
