import React from 'react';
import { ReportTargetDetail, ReportTargetType } from '@/src/api/types';
import {
  Button,
  ContainerWithTextCentered,
  Section,
  Text,
} from '@/src/components/ui';
import { H2, H5 } from '@/src/components/ui/Headings';
import { LoadingScreen } from '@/src/features/backoffice/LoadingScreen';
import {
  ReportsError,
  useGetAdminReportTargetQuery,
} from '@/src/use-cases/reports';
import { ReportCard } from '../ReportCard';
import {
  ConversationReportContext,
  GroupMessageReportContext,
  ProfileReportContext,
} from '../ReportContexts';
import { ReportResolveForm } from '../ReportResolveForm';
import { ReportTargetStatusTag } from '../ReportTargetStatusTag';
import {
  REPORT_TARGET_TYPE_LABELS,
  REPORTS_TAB_LABELS,
} from '../reports.labels';
import { REPORTS_PATH } from '../reports.utils';
import {
  StyledReportList,
  StyledReportTargetHeader,
  StyledReportTargetPage,
} from './ReportTargetPage.styles';

interface ReportTargetPageProps {
  targetType: ReportTargetType;
  targetId: string;
}

const ReportContext = ({ target }: { target: ReportTargetDetail }) => {
  const { context } = target;
  switch (context.targetType) {
    case 'CONVERSATION':
      return (
        <ConversationReportContext
          conversationId={target.targetId}
          participants={context.participants}
        />
      );
    case 'USER_PROFILE':
      return <ProfileReportContext user={context.user} />;
    default:
      return <GroupMessageReportContext context={context} />;
  }
};

/**
 * Page of a reported target: its reports, its context per type, and the
 * closing of a conversation or a profile. A group message is handled in its
 * group, without closing from here.
 */
export function ReportTargetPage({
  targetType,
  targetId,
}: ReportTargetPageProps) {
  const {
    data: target,
    isLoading,
    error,
  } = useGetAdminReportTargetQuery({
    targetType,
    targetId,
  });

  return (
    <Section className="custom-page">
      <Button
        variant="text"
        size="small"
        href={REPORTS_PATH}
        dataTestId="report-target-back"
      >
        {REPORTS_TAB_LABELS.back}
      </Button>
      {isLoading && <LoadingScreen />}
      {!!error && (
        <ContainerWithTextCentered>
          <Text>
            {error === ReportsError.NOT_FOUND
              ? REPORTS_TAB_LABELS.notFound
              : REPORTS_TAB_LABELS.loadError}
          </Text>
        </ContainerWithTextCentered>
      )}
      {target && (
        <StyledReportTargetPage data-testid="report-target-page">
          <StyledReportTargetHeader>
            <Text color="darkGray">
              {REPORT_TARGET_TYPE_LABELS[target.targetType]}
            </Text>
            <ReportTargetStatusTag status={target.status} />
          </StyledReportTargetHeader>
          <H2 title={target.label} />
          <ReportContext target={target} />
          <StyledReportList>
            <H5
              title={`${REPORTS_TAB_LABELS.reportsTitle} (${target.reports.length})`}
            />
            {target.reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </StyledReportList>
          {target.canResolve && target.status === 'PENDING' && (
            <StyledReportList>
              <H5 title={REPORTS_TAB_LABELS.resolveTitle} />
              <ReportResolveForm
                targetType={target.targetType}
                targetId={target.targetId}
              />
            </StyledReportList>
          )}
        </StyledReportTargetPage>
      )}
    </Section>
  );
}
