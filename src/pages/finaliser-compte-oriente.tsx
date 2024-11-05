import React from 'react';
import { EntourageProLogoPrimary } from 'assets/icons/icons';

import { Layout } from 'src/components/Layout';
import { FinalizeReferedUserContainer } from 'src/components/finalize-refered-user/FinalizeReferedUserContainer';
import { Section } from 'src/components/utils';

const FinalizeReferedUserPage = () => {
  return (
    <Layout title="Finaliser mon compte - Entourage Pro">
      <Section container="small" style="default" size="small">
        <EntourageProLogoPrimary width={180} height={60} />
        <FinalizeReferedUserContainer />
      </Section>
    </Layout>
  );
};

export default FinalizeReferedUserPage;
