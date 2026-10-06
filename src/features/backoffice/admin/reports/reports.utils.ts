import { ReportTargetType } from '@/src/api/types';

export const REPORTS_PATH = '/backoffice/admin/signalements';

export const getReportTargetHref = (
  targetType: ReportTargetType,
  targetId: string
) => `${REPORTS_PATH}/${targetType}/${encodeURIComponent(targetId)}`;

export const getAdminMemberHref = (userId: string) =>
  `/backoffice/admin/membres/${encodeURIComponent(userId)}`;

// An admin is exempted from the eligibility check of the recipients
export const getWriteToHref = (userId: string) =>
  `/backoffice/messaging?userId=${encodeURIComponent(userId)}`;

export const getGroupMessageHref = ({
  slug,
  discussionId,
  replyId,
}: {
  slug: string;
  discussionId: string;
  replyId: string | null;
}) =>
  `/backoffice/groupes/${encodeURIComponent(slug)}/discussions/${encodeURIComponent(
    discussionId
  )}${replyId ? `?replyId=${encodeURIComponent(replyId)}` : ''}`;

// Query value of the filters meaning "no filter", so that removing the
// default zone or status is kept in the URL
export const ALL_FILTER_VALUE = 'ALL';
