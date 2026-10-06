import { useRouter } from 'next/router';
import React from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { HelpGroupPage } from '@/src/features/backoffice/help-groups/HelpGroupPage';

const HelpGroup = () => {
  const { query } = useRouter();
  const slug = typeof query.slug === 'string' ? query.slug : '';

  return (
    <LayoutBackOffice title="Groupes">
      <HelpGroupPage slug={slug} />
    </LayoutBackOffice>
  );
};

export default HelpGroup;
