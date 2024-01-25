import React from 'react';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { Profile } from 'src/components/backoffice/profile';
import { useSelectedProfile } from 'src/components/backoffice/profile/useSelectedProfile';

const PageProfile = () => {
  const { selectedProfile } =  useSelectedProfile()

  if (selectedProfile) {
    return <Profile />;
  }
  return <LoadingScreen />
};

export default PageProfile;
