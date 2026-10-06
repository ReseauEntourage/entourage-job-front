import React, { useMemo, type JSX } from 'react';
import { HelpGroupAdminAction, HelpGroupAdminItem } from '@/src/api/types';
import { Table, Th } from '@/src/components/ui/Table';
import { HelpGroupAdminRow } from '../HelpGroupAdminRow';

interface HelpGroupAdminTableProps {
  groups: HelpGroupAdminItem[];
  onAction: (group: HelpGroupAdminItem, action: HelpGroupAdminAction) => void;
}

export function HelpGroupAdminTable({
  groups,
  onAction,
}: HelpGroupAdminTableProps) {
  const columnsHeaders = useMemo<JSX.Element[]>(
    () => [
      <Th key="name">Groupe</Th>,
      <Th key="state">État</Th>,
      <Th key="pinned">Épinglage</Th>,
      <Th key="members">Membres</Th>,
      <Th key="discussions">Discussions</Th>,
      <Th key="lastActivity">Dernière activité</Th>,
      <Th key="actions">Actions</Th>,
    ],
    []
  );

  return (
    <Table
      columns={columnsHeaders}
      dataTestId="help-group-admin-list"
      body={groups.map((group) => (
        <HelpGroupAdminRow key={group.id} group={group} onAction={onAction} />
      ))}
    />
  );
}
