// page uniquement utilisée pour les coachs externes: liste des candidats qui lui sont rattachés

import React from 'react';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { ReferrerMemberList } from 'src/components/backoffice/candidate/Referrer/ReferrerMemberList';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { Section } from 'src/components/utils';

const List = () => {
  return (
    <LayoutBackOffice title="Liste des candidats">
      <Section className="custom-page">
        <HeaderBackoffice
          title="Consulter la liste de mes candidats"
          description="Retrouvez ici tous les candidats"
        />
        <ReferrerMemberList />
      </Section>
    </LayoutBackOffice>
  );
};

export default List;
