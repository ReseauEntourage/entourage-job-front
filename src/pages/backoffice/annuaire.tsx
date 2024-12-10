import React from 'react';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { DirectoryContainer } from 'src/components/backoffice/directory/DirectoryContainer/DirectoryContainer';
import { useDirectoryRoleRedirection } from 'src/components/backoffice/directory/useDirectoryRoleRedirection';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { Section } from 'src/components/utils';
import { useRole } from 'src/hooks/queryParams/useRole';

const Annuaire = () => {
  const role = useRole();

  useDirectoryRoleRedirection();

  return (
    <LayoutBackOffice title="Annuaire">
      <Section className="custom-page">
        <HeaderBackoffice
          title="Bienvenue sur votre réseau"
          description="Découvrez les membres de la communauté et développez votre carnet d'adresse."
        />
        {role ? <DirectoryContainer /> : <LoadingScreen />}
      </Section>
    </LayoutBackOffice>
  );
};

export default Annuaire;
