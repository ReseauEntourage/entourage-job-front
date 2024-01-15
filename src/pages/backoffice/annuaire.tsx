import React from 'react';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { DirectoryContainer } from 'src/components/backoffice/directory/DirectoryContainer/DirectoryContainer';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { Section } from 'src/components/utils';

const Annuaire = () => {
  return (
    <LayoutBackOffice title="Annuaire">
      <Section className="custom-page">
        <HeaderBackoffice
          title="Bienvenu sur votre réseau"
          description={
            "Découvrez les membres de la communauté et développez votre carnet d'adresse."
          }
        />
        <DirectoryContainer />
      </Section>
    </LayoutBackOffice>
  );
};

export default Annuaire;
