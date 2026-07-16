import React from 'react';
import { SidePanel } from '@/src/components/ui/SidePanel/SidePanel';
import { ProfileLivePreview } from './ProfileLivePreview';

export const ProfileLivePreviewPanel = () => {
  return (
    <SidePanel variant="lightGray" title="Aperçu de votre profil">
      <ProfileLivePreview />
    </SidePanel>
  );
};
