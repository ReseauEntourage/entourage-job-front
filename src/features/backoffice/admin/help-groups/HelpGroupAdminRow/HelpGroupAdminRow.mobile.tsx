import React from 'react';
import { Text } from '@/src/components/ui';
import { TdMobile, TrMobile } from '@/src/components/ui/Table';
import {
  formatHelpGroupLastActivity,
  formatHelpGroupState,
} from '../helpGroupsAdmin.utils';
import { HelpGroupAdminActions } from './HelpGroupAdminActions';
import {
  StyledHelpGroupAdminMobileLine,
  StyledHelpGroupAdminState,
} from './HelpGroupAdminRow.styles';
import { HelpGroupAdminRowProps } from './HelpGroupAdminRow.types';

export function HelpGroupAdminRowMobile(props: HelpGroupAdminRowProps) {
  const { group } = props;
  return (
    <TrMobile>
      <StyledHelpGroupAdminMobileLine className="line">
        <TdMobile>
          <Text weight="semibold">{group.name}</Text>
        </TdMobile>
        <TdMobile title="État">
          <StyledHelpGroupAdminState $isPublished={!!group.publishedAt}>
            {formatHelpGroupState(group)}
          </StyledHelpGroupAdminState>
        </TdMobile>
      </StyledHelpGroupAdminMobileLine>
      <StyledHelpGroupAdminMobileLine className="line">
        <TdMobile title="Épinglage">
          <Text>{group.pinnedAt ? 'Épinglé' : '-'}</Text>
        </TdMobile>
        <TdMobile title="Membres">
          <Text>{group.membersCount}</Text>
        </TdMobile>
      </StyledHelpGroupAdminMobileLine>
      <StyledHelpGroupAdminMobileLine className="line">
        <TdMobile title="Discussions">
          <Text>{group.discussionsCount}</Text>
        </TdMobile>
        <TdMobile title="Dernière activité">
          <Text>{formatHelpGroupLastActivity(group.lastActivityAt)}</Text>
        </TdMobile>
      </StyledHelpGroupAdminMobileLine>
      <StyledHelpGroupAdminMobileLine className="line">
        <TdMobile>
          <HelpGroupAdminActions {...props} />
        </TdMobile>
      </StyledHelpGroupAdminMobileLine>
    </TrMobile>
  );
}
