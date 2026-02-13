import React, { useMemo, type JSX } from 'react';
import { Table, Th } from '@/src/components/ui/Table';

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
      <Th key="organizationNbReferer">Prescripteurs</Th>,
      <Th key="organizationNbCandidates">Candidats</Th>,
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
