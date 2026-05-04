import React from 'react';
import { Table, TdDesktop, Th, TrDesktop } from '@/src/components/ui/Table';
import { RefererCandidatesTableProps } from './RefererCandidatesTable.types';

export const RefererCandidatesTableDesktop = ({
  items,
}: RefererCandidatesTableProps) => {
  return (
    <Table
      columns={[
        <Th key="candidateName">Candidat</Th>,
        <Th key="candidateEmail">Email</Th>,
        <Th key="coachesContactedCount">Coachs contactés</Th>,
        <Th key="referredAt">Invitation envoyée</Th>,
        <Th key="accountCreatedAt">Intégration finalisée le</Th>,
      ]}
      dataTestId="refered-candidate-list"
      body={items.map((item) => (
        <TrDesktop key={item.id}>
          <TdDesktop>
            <b>{item.name}</b>
          </TdDesktop>
          <TdDesktop>{item.email}</TdDesktop>
          <TdDesktop>{item.coachesContactedCount}</TdDesktop>
          <TdDesktop>{item.referredAt}</TdDesktop>
          <TdDesktop>{item.accountCreatedAt}</TdDesktop>
        </TrDesktop>
      ))}
    />
  );
};
