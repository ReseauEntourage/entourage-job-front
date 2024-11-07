import React, { useMemo } from 'react';
import { Table, Th } from 'src/components/utils/Table';

interface OrganizationTableProps {
  organizations: JSX.Element[];
}
export function OrganizationTable({ organizations }: OrganizationTableProps) {
  const columnsHeaders = useMemo<JSX.Element[]>(() => {
    return [
      <Th key="organizationName">Structure partenaire</Th>,
      <Th key="organizationReferentName">Contact</Th>,
      <Th key="organizationReferentMail">Mail</Th>,
      <Th key="organizationReferentPhone">Téléphone</Th>,
      <Th key="organizationZone">Zone</Th>,
      <Th key="organizationNbCandidates">Nombre de candidats</Th>,
      <Th key="organizationNbCoach">Nombre de coachs</Th>,
      <Th key="organizationNbReferrer">Nombre d&apos;orienteurs</Th>,
      <Th key="organizationEdition">Édition</Th>,
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
