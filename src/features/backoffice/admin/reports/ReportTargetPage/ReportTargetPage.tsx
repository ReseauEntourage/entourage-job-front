import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { ReportTargetDetail, ReportTargetType } from '@/src/api/types';
import {
  Badge,
  BadgeVariant,
  ContainerWithTextCentered,
  Section,
  Text,
} from '@/src/components/ui';
import { LoadingScreen } from '@/src/features/backoffice/LoadingScreen';
import { HelpGroupsPageBackground } from '@/src/features/backoffice/help-groups/HelpGroupsPageBackground';
import { notificationsActions } from '@/src/use-cases/notifications';
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
import { ReportLink } from '../ReportLink';
import { ReportMessageVersions } from '../ReportMessageVersions';
import { ReportPanelTitle, ReportPanelTitleCount } from '../ReportPanelTitle';
import { ReportResolveForm } from '../ReportResolveForm';
import { ReportTargetStatusTag } from '../ReportTargetStatusTag';
import {
  REPORT_TARGET_TYPE_LABELS,
  REPORTS_TAB_LABELS,
} from '../reports.labels';
import { getReportTargetTitle, REPORTS_PATH } from '../reports.utils';
import {
  StyledReportBreadcrumb,
  StyledReportPanel,
  StyledReportTargetHeader,
  StyledReportTargetTitle,
  StyledReportTargetLayout,
  StyledReportTargetPage,
} from './ReportTargetPage.styles';

interface ReportTargetPageProps {
  targetType: ReportTargetType;
  targetId: string;
  // From `?action=resolve`, set by « Marquer comme traité » in a Slack alert
  openResolve?: boolean;
  // The closing was opened (or found impossible): drop it from the address
  onResolveOpened?: () => void;
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
      <ReportPanelTitle>{REPORTS_TAB_LABELS.resolveTitle}</ReportPanelTitle>
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
  openResolve = false,
  onResolveOpened,
}: ReportTargetPageProps) {
  const dispatch = useDispatch();
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

  const isResolveOpened = useRef(false);

  // Opened once from a Slack alert: brings the closing form into view with
  // its note focused, never submitting it. Already handled: a notice.
  useEffect(() => {
    if (!openResolve || !target || isResolveOpened.current) {
      return;
    }
    isResolveOpened.current = true;
    onResolveOpened?.();
    if (!target.canResolve || target.status !== 'PENDING') {
      dispatch(
        notificationsActions.addNotification({
          type: 'success',
          message: REPORTS_TAB_LABELS.alreadyHandled,
        })
      );
      return;
    }
    const note = document.getElementById('report-resolve-note');
    note?.scrollIntoView?.({ block: 'center' });
    note?.focus();
  }, [openResolve, target, onResolveOpened, dispatch]);

  const title = target ? getReportTargetTitle(target) : '';

  return (
    <HelpGroupsPageBackground>
      <Section className="custom-page">
        <StyledReportBreadcrumb aria-label={REPORTS_TAB_LABELS.breadcrumb}>
          <ReportLink
            $isBold={false}
            href={REPORTS_PATH}
            data-testid="report-target-back"
          >
            {REPORTS_TAB_LABELS.back}
          </ReportLink>
          {target && (
            <>
              <span aria-hidden="true">›</span>
              <span aria-current="page">{title}</span>
            </>
          )}
        </StyledReportBreadcrumb>
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
              <StyledReportTargetTitle>{title}</StyledReportTargetTitle>
              <Badge variant={BadgeVariant.ExtraLightTeal} size="small">
                {REPORT_TARGET_TYPE_LABELS[target.targetType]}
              </Badge>
              <ReportTargetStatusTag
                status={target.status}
                pendingCount={pendingCount}
              />
            </StyledReportTargetHeader>
            <StyledReportTargetLayout>
              <StyledReportPanel $area="context" $isFlush={isGroupMessage}>
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
                <ReportPanelTitle>
                  {REPORTS_TAB_LABELS.reportsTitle}{' '}
                  <ReportPanelTitleCount>
                    ({target.reports.length})
                  </ReportPanelTitleCount>
                </ReportPanelTitle>
                {target.reports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </StyledReportPanel>
            </StyledReportTargetLayout>
          </StyledReportTargetPage>
        )}
      </Section>
    </HelpGroupsPageBackground>
  );
}
