import React, { useMemo, type JSX } from 'react';
import { HelpGroupAdminAction, HelpGroupAdminItem } from '@/src/api/types';
import { Table, Th } from '@/src/components/ui/Table';
import { useIsDesktop } from '@/src/hooks/utils';
import {
  HelpGroupAdminRowDesktop,
  HelpGroupAdminRowMobile,
} from '../HelpGroupAdminRow';
import { HELP_GROUP_ADMIN_LABELS } from '../helpGroupsAdmin.utils';
import {
  StyledHelpGroupAdminCards,
  StyledHelpGroupAdminTableCard,
} from './HelpGroupAdminTable.styles';

interface HelpGroupAdminTableProps {
  groups: HelpGroupAdminItem[];
  onAction: (group: HelpGroupAdminItem, action: HelpGroupAdminAction) => void;
}

/**
 * Groups as a table on desktop, as a list of cards below the desktop
 * breakpoint.
 */
export function HelpGroupAdminTable({
  groups,
  onAction,
}: HelpGroupAdminTableProps) {
  const isDesktop = useIsDesktop();
  const columnsHeaders = useMemo<JSX.Element[]>(
    () => [
      <Th key="name">Groupe</Th>,
      <Th key="state">État</Th>,
      <Th key="pinned">{HELP_GROUP_ADMIN_LABELS.pinColumn}</Th>,
      <Th key="members">Membres</Th>,
      <Th key="discussions">Discussions</Th>,
      <Th key="lastActivity">Dernière activité</Th>,
      <Th key="actions">Actions</Th>,
    ],
    []
  );

  if (!isDesktop) {
    return (
      <StyledHelpGroupAdminCards data-testid="help-group-admin-list">
        {groups.map((group) => (
          <HelpGroupAdminRowMobile
            key={group.id}
            group={group}
            onAction={onAction}
          />
        ))}
      </StyledHelpGroupAdminCards>
    );
  }

  return (
    <StyledHelpGroupAdminTableCard>
      <Table
        columns={columnsHeaders}
        dataTestId="help-group-admin-list"
        body={groups.map((group) => (
          <HelpGroupAdminRowDesktop
            key={group.id}
            group={group}
            onAction={onAction}
          />
        ))}
      />
    </StyledHelpGroupAdminTableCard>
  );
}
