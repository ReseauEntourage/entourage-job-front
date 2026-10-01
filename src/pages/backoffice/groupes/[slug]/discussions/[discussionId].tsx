import { useRouter } from 'next/router';
import React from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { HelpGroupDiscussion } from '@/src/features/backoffice/help-groups/HelpGroupDiscussion';

const getStringParam = (value: string | string[] | undefined) =>
  typeof value === 'string' ? value : '';

const HelpGroupDiscussionPage = () => {
  const { query } = useRouter();

  return (
    <LayoutBackOffice title="Groupes">
      <HelpGroupDiscussion
        slug={getStringParam(query.slug)}
        discussionId={getStringParam(query.discussionId)}
        replyId={getStringParam(query.replyId) || null}
      />
    </LayoutBackOffice>
  );
};

export default HelpGroupDiscussionPage;
