import React from 'react';
import { Badge, BadgeVariant } from '@/src/components/ui/Badge';
import { Text } from '@/src/components/ui/Text';
import { UserRoles } from 'src/constants/users';

const ROLE_LABELS: Partial<Record<UserRoles, string>> = {
  [UserRoles.CANDIDATE]: 'Candidat',
  [UserRoles.COACH]: 'Coach',
};

interface RoleBadgeProps {
  role: UserRoles;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const label = ROLE_LABELS[role];
  if (!label) {
    return null;
  }

  return (
    <Badge variant={BadgeVariant.Primary} borderRadius="large">
      <Text color="white" size="small">
        {label}
      </Text>
    </Badge>
  );
}
