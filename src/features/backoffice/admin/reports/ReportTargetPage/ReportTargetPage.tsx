import React from 'react';
import { ReportTargetDetail, ReportTargetType } from '@/src/api/types';
import {
  Badge,
  BadgeVariant,
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
import { ReportGroupMessageDecision } from '../ReportGroupMessageDecision';
import { ReportMessageVersions } from '../ReportMessageVersions';
import { ReportResolveForm } from '../ReportResolveForm';
import { ReportTargetStatusTag } from '../ReportTargetStatusTag';
import {
  REPORT_TARGET_TYPE_LABELS,
  REPORTS_TAB_LABELS,
} from '../reports.labels';
import { REPORTS_PATH } from '../reports.utils';
import {
  StyledReportPanel,
  StyledReportTargetHeader,
  StyledReportTargetLayout,
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
 * Decision block of the target: closing of a conversation or a profile, or
 * restoring / deleting a group message hidden after reports. Nothing for a
 * group message which is visible or already deleted.
 */
const ReportDecision = ({
  target,
  pendingCount,
}: {
  target: ReportTargetDetail;
  pendingCount: number;
}) => {
  const { context } = target;
  if (context.targetType === 'POST' || context.targetType === 'POST_REPLY') {
    if (context.message?.state !== 'HIDDEN') {
      return null;
    }
    return (
      <StyledReportPanel $area="decision">
        <ReportGroupMessageDecision
          targetType={context.targetType}
          targetId={target.targetId}
          slug={context.group?.slug ?? null}
          discussionId={context.message.discussionId}
          pendingCount={pendingCount}
        />
      </StyledReportPanel>
    );
  }
  if (!target.canResolve || target.status !== 'PENDING') {
    return null;
  }
  return (
    <StyledReportPanel $area="decision">
      <H5 title={REPORTS_TAB_LABELS.resolveTitle} />
      <ReportResolveForm
        targetType={target.targetType}
        targetId={target.targetId}
      />
    </StyledReportPanel>
  );
};

/**
 * Page of a reported target: its context per type and the decision on the
 * left, its reports on the right, and for a group message its versions.
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
  const pendingCount =
    target?.reports.filter(({ status }) => status === 'PENDING').length ?? 0;
  const isGroupMessage =
    target?.context.targetType === 'POST' ||
    target?.context.targetType === 'POST_REPLY';

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
            <H2 title={target.label} />
            <Badge variant={BadgeVariant.ExtraLightTeal} size="small">
              {REPORT_TARGET_TYPE_LABELS[target.targetType]}
            </Badge>
            <ReportTargetStatusTag
              status={target.status}
              pendingCount={pendingCount}
            />
          </StyledReportTargetHeader>
          <StyledReportTargetLayout>
            <StyledReportPanel $area="context">
              <ReportContext target={target} />
            </StyledReportPanel>
            <ReportDecision target={target} pendingCount={pendingCount} />
            {isGroupMessage && (
              <StyledReportPanel $area="versions">
                <ReportMessageVersions
                  kind={
                    target.targetType === 'POST' ? 'discussions' : 'replies'
                  }
                  id={target.targetId}
                />
              </StyledReportPanel>
            )}
            <StyledReportPanel
              $area="reports"
              as="aside"
              data-testid="report-target-reports"
            >
              <H5
                title={`${REPORTS_TAB_LABELS.reportsTitle} (${target.reports.length})`}
              />
              {target.reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </StyledReportPanel>
          </StyledReportTargetLayout>
        </StyledReportTargetPage>
      )}
    </Section>
  );
}
