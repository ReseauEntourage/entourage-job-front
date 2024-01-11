import React from 'react';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { DirectoryList } from 'src/components/backoffice/directory/DirectoryList';
import { Section } from 'src/components/utils';

const Suivi = () => {
  // const user = useAuthenticatedUser();

  // const prevUser = usePrevious(user);

  const title = 'Annuaire';
  // const description = "Ici c'est l'annuaire";

  return (
    <LayoutBackOffice title={title}>
      <Section className="custom-page">
        <DirectoryList />
      </Section>
    </LayoutBackOffice>
  );
};

export default Suivi;
