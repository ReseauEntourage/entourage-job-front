import { useRouter } from 'next/router';
import React from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { HelpGroupDiscussion } from '@/src/features/backoffice/help-groups/HelpGroupDiscussion';

const getStringParam = (value: string | string[] | undefined) =>
  typeof value === 'string' ? value : '';

const HelpGroupDiscussionPage = () => {
  const { query } = useRouter();
  const slug = getStringParam(query.slug);
  const discussionId = getStringParam(query.discussionId);
  const replyId = getStringParam(query.replyId) || null;

  return (
    <LayoutBackOffice title="Groupes">
      {/* Remounted on another discussion or reply, so the view is positioned
          again for the new target */}
      <HelpGroupDiscussion
        key={`${slug}/${discussionId}/${replyId ?? ''}`}
        slug={slug}
        discussionId={discussionId}
        replyId={replyId}
      />
    </LayoutBackOffice>
  );
};

export default HelpGroupDiscussionPage;
