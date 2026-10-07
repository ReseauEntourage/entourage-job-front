import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import {
  HelpGroupDiscussion,
  parseModerationLinkAction,
} from '@/src/features/backoffice/help-groups/HelpGroupDiscussion';

const getStringParam = (value: string | string[] | undefined) =>
  typeof value === 'string' ? value : '';

const HelpGroupDiscussionPage = () => {
  const router = useRouter();
  const { query } = router;
  const slug = getStringParam(query.slug);
  const discussionId = getStringParam(query.discussionId);
  const replyId = getStringParam(query.replyId) || null;
  const moderationAction = parseModerationLinkAction(query.moderation);

  // Opened once from a Slack alert: a reload must not open it again
  const dropModerationAction = useCallback(() => {
    const { moderation, ...rest } = router.query;
    if (moderation === undefined) {
      return;
    }
    router.replace({ pathname: router.pathname, query: rest }, undefined, {
      shallow: true,
    });
  }, [router]);

  return (
    <LayoutBackOffice title="Groupes">
      {/* Remounted on another discussion or reply, so the view is positioned
          again for the new target */}
      <HelpGroupDiscussion
        key={`${slug}/${discussionId}/${replyId ?? ''}`}
        slug={slug}
        discussionId={discussionId}
        replyId={replyId}
        moderationAction={moderationAction}
        onModerationActionConsumed={dropModerationAction}
      />
    </LayoutBackOffice>
  );
};

export default HelpGroupDiscussionPage;
