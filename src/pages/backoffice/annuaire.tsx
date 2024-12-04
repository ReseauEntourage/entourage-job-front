import React from 'react';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { Directory } from 'src/components/backoffice/directory/Directory/Directory';
import { useDirectoryRoleRedirection } from 'src/components/backoffice/directory/useDirectoryRoleRedirection';
import { useRole } from 'src/hooks/queryParams/useRole';

const Annuaire = () => {
  const role = useRole();

  useDirectoryRoleRedirection();

  return (
    <LayoutBackOffice title="Annuaire">
      {role ? <Directory /> : <LoadingScreen />}
    </LayoutBackOffice>
  );
};

export default Annuaire;
