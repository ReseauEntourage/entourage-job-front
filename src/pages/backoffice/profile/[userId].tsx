import React from 'react';
import { useSelector } from 'react-redux';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { LoadingScreen } from '@/src/features/backoffice/LoadingScreen';
import { Profile } from '@/src/features/backoffice/profile';
import { useSelectedProfile } from '@/src/features/backoffice/profile/useSelectedProfile';
import { fetchSelectedProfileSelectors } from 'src/use-cases/profiles';

const PageProfile = () => {
  const { selectedProfile } = useSelectedProfile();
  const isFetchProfileRequested = useSelector(
    fetchSelectedProfileSelectors.selectIsFetchSelectedProfileRequested
  );

  return (
    <LayoutBackOffice
      title={
        selectedProfile
          ? `Profil de ${selectedProfile.firstName} ${selectedProfile.lastName}`
          : 'Profil'
      }
    >
      {selectedProfile && !isFetchProfileRequested ? (
        <Profile />
      ) : (
        <LoadingScreen />
      )}
    </LayoutBackOffice>
  );
};

export default PageProfile;
