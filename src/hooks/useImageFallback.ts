import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ReduxRequestEvents } from 'src/constants';
import { updateUserProfilePictureSelectors } from 'src/use-cases/current-user';

export function useImageFallback({
  userId,
  hasPicture,
}: {
  userId: string;
  hasPicture?: boolean;
}) {
  const [urlImg, setUrlImg] = useState<string | null>(null);

  useEffect(() => {
    if (hasPicture === true) {
      setUrlImg(
        `${process.env.NEXT_PUBLIC_AWSS3_URL}${process.env.NEXT_PUBLIC_AWSS3_IMAGE_DIRECTORY}${userId}.profile.jpg`
      );
    }
  }, [hasPicture, userId]);

  const updateUserProfilePictureStatus = useSelector(
    updateUserProfilePictureSelectors.selectUpdateUserProfilePictureStatus
  );

  useEffect(() => {
    if (updateUserProfilePictureStatus === ReduxRequestEvents.SUCCEEDED) {
      setUrlImg(
        `${process.env.NEXT_PUBLIC_AWSS3_URL}${process.env.NEXT_PUBLIC_AWSS3_IMAGE_DIRECTORY}${userId}.profile.jpg`
      );
    }
  }, [updateUserProfilePictureStatus, userId]);

  return { urlImg };
}
