import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CV, UserCandidateWithUsers } from 'src/api/types';
import { ReduxRequestEvents } from 'src/constants';
import { USER_ROLES, UserRole } from 'src/constants/users';
import { updateUserProfilePictureSelectors } from 'src/use-cases/current-user';

export function useImageFallback({
  userId,
  role,
  userCandidate,
}: {
  userId: string;
  role: UserRole;
  userCandidate?: UserCandidateWithUsers;
}) {
  const [urlImg, setUrlImg] = useState<string | null>(null);

  useEffect(() => {
    setUrlImg(
      `${process.env.AWSS3_URL}${process.env.AWSS3_IMAGE_DIRECTORY}${userId}.profile.jpg`
    );
  }, [userId]);

  const updateUserProfilePictureStatus = useSelector(
    updateUserProfilePictureSelectors.selectUpdateUserProfilePictureStatus
  );

  useEffect(() => {
    if (updateUserProfilePictureStatus === ReduxRequestEvents.SUCCEEDED) {
      setUrlImg(
        `${process.env.AWSS3_URL}${process.env.AWSS3_IMAGE_DIRECTORY}${userId}.profile.jpg`
      );
    }
  }, [updateUserProfilePictureStatus, userId]);

  const fallbackToCVImage = useCallback(() => {
    setUrlImg(null);
    if (
      role === USER_ROLES.CANDIDATE &&
      userCandidate?.cvs &&
      userCandidate?.cvs?.length > 0
    ) {
      const { cvs } = userCandidate;
      const latestCV: CV = cvs.reduce((lastFound, curr) => {
        return lastFound.version < curr.version ? curr : lastFound;
      }, cvs[0]);

      if (latestCV.urlImg) {
        setUrlImg(`${process.env.AWSS3_URL}/${latestCV.urlImg}`);
      }
    }
  }, [role, userCandidate]);

  return { urlImg, fallbackToCVImage };
}
