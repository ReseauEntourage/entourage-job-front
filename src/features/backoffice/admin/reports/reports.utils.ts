import { ReportTargetDetail, ReportTargetType } from '@/src/api/types';
import { REPORTS_TAB_LABELS } from './reports.labels';

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

/**
 * Title of the page of a target. For a group message, « Réponse de Malik R. »
 * or « Discussion de Malik R. », as in the design; the label of the list
 * otherwise (or when the author is gone).
 */
export const getReportTargetTitle = (target: ReportTargetDetail) => {
  const { context } = target;
  if (
    (context.targetType === 'POST' || context.targetType === 'POST_REPLY') &&
    context.message?.author
  ) {
    const { firstName, lastName } = context.message.author;
    const name = `${firstName} ${lastName.charAt(0).toUpperCase()}.`;
    return context.targetType === 'POST_REPLY'
      ? REPORTS_TAB_LABELS.formatReplyTitle(name)
      : REPORTS_TAB_LABELS.formatDiscussionTitle(name);
  }
  return target.label;
};
