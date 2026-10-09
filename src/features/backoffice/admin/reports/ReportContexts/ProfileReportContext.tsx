import React from 'react';
import { ReportUser } from '@/src/api/types';
import { H5 } from '@/src/components/ui/Headings';
import { ReportPerson } from '../ReportPerson';
import { REPORTS_TAB_LABELS } from '../reports.labels';
import {
  StyledReportContext,
  StyledReportContextBlock,
} from './ReportContexts.styles';

export function ProfileReportContext({ user }: { user: ReportUser }) {
  return (
    <StyledReportContext data-testid="report-context-profile">
      <StyledReportContextBlock>
        <H5 title={REPORTS_TAB_LABELS.reportedPerson} />
        <ReportPerson user={user} dataTestId="report-reported-person" />
      </StyledReportContextBlock>
    </StyledReportContext>
  );
}
