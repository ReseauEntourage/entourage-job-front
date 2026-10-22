import React from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { HelpGroupsCatalog } from '@/src/features/backoffice/help-groups/HelpGroupList';

const HelpGroups = () => {
  return (
    <LayoutBackOffice title="Groupes">
      <HelpGroupsCatalog />
    </LayoutBackOffice>
  );
};

export default HelpGroups;
