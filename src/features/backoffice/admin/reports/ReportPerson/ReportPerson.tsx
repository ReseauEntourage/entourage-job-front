import React from 'react';
import { ReportUser } from '@/src/api/types';
import { Button, Text } from '@/src/components/ui';
import { REPORTS_TAB_LABELS } from '../reports.labels';
import { getAdminMemberHref, getWriteToHref } from '../reports.utils';
import { StyledReportPerson } from './ReportPerson.styles';

interface ReportPersonProps {
  user: ReportUser;
  dataTestId?: string;
}

/**
 * A person of a report, with a link to their admin page and a shortcut to
 * write to them. A deleted account has neither.
 */
export function ReportPerson({ user, dataTestId }: ReportPersonProps) {
  if (!user) {
    return (
      <StyledReportPerson data-testid={dataTestId}>
        <Text variant="italic">{REPORTS_TAB_LABELS.deletedUser}</Text>
      </StyledReportPerson>
    );
  }
  return (
    <StyledReportPerson data-testid={dataTestId}>
      <Text weight="semibold">
        {user.firstName} {user.lastName}
      </Text>
      <Button
        variant="text"
        size="small"
        href={getAdminMemberHref(user.id)}
        dataTestId={`report-person-profile-${user.id}`}
      >
        {REPORTS_TAB_LABELS.adminProfile}
      </Button>
      <Button
        variant="text"
        size="small"
        href={getWriteToHref(user.id)}
        dataTestId={`report-person-write-${user.id}`}
      >
        {REPORTS_TAB_LABELS.formatWriteTo(user.firstName)}
      </Button>
    </StyledReportPerson>
  );
}
