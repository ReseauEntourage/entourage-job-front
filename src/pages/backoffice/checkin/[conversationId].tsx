import { useRouter } from 'next/router';
import React from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { CheckinFlow } from '@/src/features/backoffice/checkin/CheckinFlow/CheckinFlow';

const PageCheckin = () => {
  const router = useRouter();
  const conversationId =
    typeof router.query.conversationId === 'string'
      ? router.query.conversationId
      : '';

  return (
    <LayoutBackOffice title="Bilan de conversation">
      {conversationId && <CheckinFlow conversationId={conversationId} />}
    </LayoutBackOffice>
  );
};

export default PageCheckin;
