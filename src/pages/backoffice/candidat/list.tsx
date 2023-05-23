// page uniquement utilisée pour les coachs externes: liste des candidats qui lui sont rattachés

import React from 'react';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import { ExternalCoachMemberList } from 'src/components/backoffice/candidate/ExternalCoach/ExternalCoachMemberList';
import HeaderBackoffice from 'src/components/headers/HeaderBackoffice';
import { Section } from 'src/components/utils';

const List = () => {
  // faire la redirection vers les bonnes pages en cas d'atterrissage sur celle-ci pour un autre rôle

  return (
    <LayoutBackOffice title="Liste des candidats" isEmpty>
      <Section container="large">
        <HeaderBackoffice
          title="Consulter la liste des mes candidats"
          description="Retrouvez ici tous les candidats"
        />
        <ExternalCoachMemberList />
      </Section>
    </LayoutBackOffice>
  );
};

export default List;
