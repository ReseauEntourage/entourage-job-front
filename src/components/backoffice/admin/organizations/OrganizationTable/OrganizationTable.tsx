import React from 'react';
import { StyledTable } from './OrganizationTable.styles';

interface OrganizationTableProps {
  organizations: JSX.Element[];
}
export function OrganizationTable({ organizations }: OrganizationTableProps) {
  return (
    <StyledTable>
      <thead>
        <tr>
          <th className="uk-text-nowrap">Structure partenaire</th>
          <th className="uk-text-nowrap">Contact</th>
          <th className="uk-text-nowrap">Mail</th>
          <th className="uk-text-nowrap">Téléphone</th>
          <th className="uk-text-nowrap">Zone</th>
          <th className="uk-text-nowrap">Nombre de candidats</th>
          <th className="uk-text-nowrap">Nombre de coachs</th>
          <th className="uk-text-nowrap">Édition</th>
        </tr>
      </thead>
      <tbody data-testid="member-list">{organizations}</tbody>
    </StyledTable>
  );
}
