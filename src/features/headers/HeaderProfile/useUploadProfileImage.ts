import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxRequestEvents } from 'src/constants';
import {
  currentUserActions,
  updateUserProfilePictureSelectors,
} from 'src/use-cases/current-user';

export function useUploadProfileImage() {
  const [imageUploading, setImageUploading] = useState(false);
  const dispatch = useDispatch();

  const uploadProfileImage = useCallback(
    async ({ profileImage }: { profileImage: Blob }) => {
      setImageUploading(true);
      dispatch(
        currentUserActions.updateUserProfilePictureRequested({ profileImage })
      );
    },
    [dispatch]
  );

  const updateUserProfilePictureStatus = useSelector(
    updateUserProfilePictureSelectors.selectUpdateUserProfilePictureStatus
  );

  useEffect(() => {
    if (updateUserProfilePictureStatus === ReduxRequestEvents.SUCCEEDED) {
      setImageUploading(false);
    }
  }, [updateUserProfilePictureStatus]);

  return { imageUploading, uploadProfileImage };
}
