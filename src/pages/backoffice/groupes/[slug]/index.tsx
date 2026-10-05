import { useRouter } from 'next/router';
import React from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { HelpGroupPage } from '@/src/features/backoffice/help-groups/HelpGroupPage';

const HelpGroup = () => {
  const { query } = useRouter();
  const slug = typeof query.slug === 'string' ? query.slug : '';

  return (
    <LayoutBackOffice title="Groupes">
      {/* Keyed by group: no state (just joined, open composer) carries
          over to another group on a client side navigation */}
      <HelpGroupPage key={slug} slug={slug} />
    </LayoutBackOffice>
  );
};

export default HelpGroup;
