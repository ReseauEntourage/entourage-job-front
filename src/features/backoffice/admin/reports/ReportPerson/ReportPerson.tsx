import React from 'react';
import { ReportUser } from '@/src/api/types';
import { Text } from '@/src/components/ui';
import { ReportLink } from '../ReportLink';
import { REPORTS_TAB_LABELS } from '../reports.labels';
import { getAdminMemberHref, getWriteToHref } from '../reports.utils';
import { StyledReportPerson } from './ReportPerson.styles';

interface ReportPersonProps {
  user: ReportUser;
  dataTestId?: string;
  // Only the links, when the name is already shown next to them
  linksOnly?: boolean;
  // Label of the link to the admin page, « Voir la fiche » by default
  profileLabel?: string;
}

/**
 * A person of a report, with a link to their admin page and a shortcut to
 * write to them. A deleted account has neither.
 */
export function ReportPerson({
  user,
  dataTestId,
  linksOnly = false,
  profileLabel = REPORTS_TAB_LABELS.adminProfile,
}: ReportPersonProps) {
  if (!user) {
    return (
      <StyledReportPerson data-testid={dataTestId}>
        <Text variant="italic">{REPORTS_TAB_LABELS.deletedUser}</Text>
      </StyledReportPerson>
    );
  }
  return (
    <StyledReportPerson data-testid={dataTestId}>
      {!linksOnly && (
        <Text weight="semibold">
          {user.firstName} {user.lastName}
        </Text>
      )}
      <ReportLink
        href={getAdminMemberHref(user.id)}
        data-testid={`report-person-profile-${user.id}`}
      >
        {profileLabel}
      </ReportLink>
      <ReportLink
        href={getWriteToHref(user.id)}
        data-testid={`report-person-write-${user.id}`}
      >
        {REPORTS_TAB_LABELS.formatWriteTo(user.firstName)}
      </ReportLink>
    </StyledReportPerson>
  );
}
