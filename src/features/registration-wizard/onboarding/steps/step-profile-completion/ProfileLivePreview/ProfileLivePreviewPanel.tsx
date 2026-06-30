import React from 'react';
import { WizardSidePanel } from '@/src/components/ui/WizardSidePanel/WizardSidePanel';
import { ProfileLivePreview } from './ProfileLivePreview';

export const ProfileLivePreviewPanel = () => {
  return (
    <WizardSidePanel title="Aperçu de votre profil public">
      <ProfileLivePreview />
    </WizardSidePanel>
  );
};
