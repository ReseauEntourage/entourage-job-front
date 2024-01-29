import React from 'react';
import { useSelector } from 'react-redux';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { Profile } from 'src/components/backoffice/profile';
import { useSelectedProfile } from 'src/components/backoffice/profile/useSelectedProfile';
import { fetchSelectedProfileSelectors } from 'src/use-cases/profiles';

const PageProfile = () => {
  const { selectedProfile } = useSelectedProfile();
  const isFetchProfileRequested = useSelector(
    fetchSelectedProfileSelectors.selectIsFetchSelectedProfileRequested
  );

  if (selectedProfile && !isFetchProfileRequested) {
    return <Profile />;
  }
  return <LoadingScreen />;
};

export default PageProfile;
