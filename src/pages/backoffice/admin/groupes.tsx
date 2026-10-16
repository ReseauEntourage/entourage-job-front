import React from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { HelpGroupAdminList } from '@/src/features/backoffice/admin/help-groups/HelpGroupAdminList';

const HelpGroupsAdmin = () => {
  return (
    <LayoutBackOffice title="Gestion des groupes">
      <HelpGroupAdminList />
    </LayoutBackOffice>
  );
};

export default HelpGroupsAdmin;
