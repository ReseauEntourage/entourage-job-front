import React from 'react';
import { useSelector } from 'react-redux';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { DirectoryContainer } from 'src/components/backoffice/directory/DirectoryContainer/DirectoryContainer';
import { useDirectoryFilters } from 'src/components/backoffice/directory/useDirectoryFilters';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { Section } from 'src/components/utils';
import { selectProfilesRoleFilter } from 'src/use-cases/profiles';

const Annuaire = () => {
  useDirectoryFilters();
  const role = useSelector(selectProfilesRoleFilter);

  return (
    <LayoutBackOffice title="Annuaire">
      <Section className="custom-page">
        <HeaderBackoffice
          title="Bienvenu sur votre réseau"
          description={
            "Découvrez les membres de la communauté et développez votre carnet d'adresse."
          }
        />
        {role ? <DirectoryContainer /> : <LoadingScreen />}
      </Section>
    </LayoutBackOffice>
  );
};

export default Annuaire;
