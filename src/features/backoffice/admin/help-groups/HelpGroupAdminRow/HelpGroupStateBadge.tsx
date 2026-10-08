import React from 'react';
import { HelpGroupAdminItem } from '@/src/api/types';
import { Badge, BadgeVariant } from '@/src/components/ui/Badge';
import { formatHelpGroupState } from '../helpGroupsAdmin.utils';

const getVariant = (group: HelpGroupAdminItem) => {
  if (group.deletedAt) {
    return BadgeVariant.Orange;
  }
  return group.publishedAt
    ? BadgeVariant.ExtraLightGreen
    : BadgeVariant.ExtraLightAmber;
};

export function HelpGroupStateBadge({ group }: { group: HelpGroupAdminItem }) {
  return (
    <Badge variant={getVariant(group)} size="small">
      {formatHelpGroupState(group)}
    </Badge>
  );
}
