import React, { useMemo } from 'react';
import { Table } from 'src/components/utils/Table/Table';
import { Th } from 'src/components/utils/Table/Th';

interface OrganizationTableProps {
  organizations: JSX.Element[];
}
export function OrganizationTable({ organizations }: OrganizationTableProps) {
  const columnsHeaders = useMemo<JSX.Element[]>(() => {
    return [
      <Th>Structure partenaire</Th>,
      <Th>Contact</Th>,
      <Th>Mail</Th>,
      <Th>Téléphone</Th>,
      <Th>Zone</Th>,
      <Th>Nombre de candidats</Th>,
      <Th>Nombre de coachs</Th>,
      <Th>Édition</Th>,
    ];
  }, []);

  return (
    <Table
      columns={columnsHeaders}
      dataTestId="organization-list"
      body={organizations}
    />
  );
}
