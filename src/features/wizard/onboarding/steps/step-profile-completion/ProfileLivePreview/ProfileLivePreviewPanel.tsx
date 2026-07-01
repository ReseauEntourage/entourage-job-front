import React from 'react';
import { SidePanel } from '@/src/components/ui/SidePanel/SidePanel';
import { ProfileLivePreview } from './ProfileLivePreview';

export const ProfileLivePreviewPanel = () => {
  return (
    <SidePanel title="Aperçu de votre profil public">
      <ProfileLivePreview />
    </SidePanel>
  );
};
