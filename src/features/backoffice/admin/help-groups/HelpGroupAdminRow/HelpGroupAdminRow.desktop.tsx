import React from 'react';
import { Text } from '@/src/components/ui';
import { TdDesktop, TrDesktop } from '@/src/components/ui/Table';
import {
  formatHelpGroupLastActivity,
  formatHelpGroupState,
} from '../helpGroupsAdmin.utils';
import { HelpGroupAdminActions } from './HelpGroupAdminActions';
import { StyledHelpGroupAdminState } from './HelpGroupAdminRow.styles';
import { HelpGroupAdminRowProps } from './HelpGroupAdminRow.types';

export function HelpGroupAdminRowDesktop(props: HelpGroupAdminRowProps) {
  const { group } = props;
  return (
    <TrDesktop>
      <TdDesktop>
        <Text weight="semibold">{group.name}</Text>
      </TdDesktop>
      <TdDesktop>
        <StyledHelpGroupAdminState $isPublished={!!group.publishedAt}>
          {formatHelpGroupState(group)}
        </StyledHelpGroupAdminState>
      </TdDesktop>
      <TdDesktop>
        <Text>{group.pinnedAt ? 'Épinglé' : '-'}</Text>
      </TdDesktop>
      <TdDesktop>
        <Text>{group.membersCount}</Text>
      </TdDesktop>
      <TdDesktop>
        <Text>{group.discussionsCount}</Text>
      </TdDesktop>
      <TdDesktop>
        <Text>{formatHelpGroupLastActivity(group.lastActivityAt)}</Text>
      </TdDesktop>
      <TdDesktop>
        <HelpGroupAdminActions {...props} />
      </TdDesktop>
    </TrDesktop>
  );
}
