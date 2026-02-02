import React from 'react';
import { Table, TdDesktop, Th, TrDesktop } from '@/src/components/ui/Table';
import { CompanyCollaboratorsTableProps } from './CompanyCollaboratorsTable.types';

export const CompanyCollaboratorsTableDesktop = ({
  items,
}: CompanyCollaboratorsTableProps) => {
  return (
    <Table
      columns={[
        <Th key="collaboratorName">Collaborateurs</Th>,
        <Th key="collaboratorEmail">Mail</Th>,
        <Th key="collaboratorConnectionCounter">Candidats contactés</Th>,
        <Th key="collaboratorInvitedAt">Invitation envoyée</Th>,
        <Th key="collaboratorAccountCreated">Compte créé</Th>,
      ]}
      dataTestId="member-list"
      body={items.map((item) => (
        <TrDesktop key={item.id}>
          <TdDesktop>
            <b>{item.name}</b>
          </TdDesktop>
          <TdDesktop>{item.email}</TdDesktop>
          <TdDesktop>{item.connectionCounter}</TdDesktop>
          <TdDesktop>{item.invitedAt}</TdDesktop>
          <TdDesktop>{item.accountCreated}</TdDesktop>
        </TrDesktop>
      ))}
    />
  );
};
