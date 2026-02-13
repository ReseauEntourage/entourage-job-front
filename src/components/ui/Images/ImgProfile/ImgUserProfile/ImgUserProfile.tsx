import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ImgProfile } from '../ImgProfile';
import { ReduxRequestEvents } from 'src/constants';
import { UserRoles } from 'src/constants/users';
import { useImageFallback } from 'src/hooks/useImageFallback';
import { updateUserProfilePictureSelectors } from 'src/use-cases/current-user';

interface ImgUserProfileProps {
  user: {
    id: string;
    firstName: string;
    role: UserRoles;
  };
  size?: number;
  hasPicture: boolean;
  highlight?: boolean;
}

export const ImgUserProfile = ({
  user,
  hasPicture,
  size = 40,
  highlight = false,
}: ImgUserProfileProps) => {
  const [hash, setHash] = useState<number>(Date.now());

  const { urlImg } = useImageFallback({
    userId: user.id,
    hasPicture,
  });
  const updateUserProfilePictureStatus = useSelector(
    updateUserProfilePictureSelectors.selectUpdateUserProfilePictureStatus
  );

  useEffect(() => {
    if (updateUserProfilePictureStatus === ReduxRequestEvents.SUCCEEDED) {
      setHash(Date.now());
    }
  }, [updateUserProfilePictureStatus]);

  useEffect(() => {
    setHash(Date.now());
  }, [urlImg]);

  return (
    <ImgProfile
      pictureUrl={hasPicture ? `${urlImg}?${hash}` : null}
      placeholder={user.firstName}
      size={size}
      highlight={highlight}
      alt={`photo de ${user.firstName}`}
      cover
    />
  );
};
