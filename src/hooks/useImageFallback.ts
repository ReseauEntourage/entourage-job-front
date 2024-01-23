import { useCallback, useEffect, useState } from 'react';
import { CV, UserCandidateWithUsers } from 'src/api/types';
import { CANDIDATE_USER_ROLES, UserRole } from 'src/constants/users';
import { isRoleIncluded } from 'src/utils';

export function useImageFallback({
  userId,
  role,
  userCandidate,
}: {
  userId: string | undefined;
  role: UserRole | undefined;
  userCandidate?: UserCandidateWithUsers;
}) {
  const [urlImg, setUrlImg] = useState<string | null>(null);

  useEffect(() => {
    setUrlImg(
      `${process.env.AWSS3_URL}${process.env.AWSS3_IMAGE_DIRECTORY}${userId}.profile.jpg`
    );
  }, [userId]);

  const fallbackToCVImage = useCallback(() => {
    setUrlImg(null);
    if (
      role &&
      isRoleIncluded(CANDIDATE_USER_ROLES, role) &&
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
