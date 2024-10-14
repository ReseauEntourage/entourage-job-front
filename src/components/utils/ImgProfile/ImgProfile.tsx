import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { UserCandidateWithUsers } from 'src/api/types';
import { Img } from 'src/components/utils/Img';
import { ReduxRequestEvents } from 'src/constants';
import { UserRole } from 'src/constants/users';
import { useImageFallback } from 'src/hooks/useImageFallback';
import { updateUserProfilePictureSelectors } from 'src/use-cases/current-user';

interface ImgProfileProps {
  user: {
    id: string;
    firstName: string;
    role: UserRole;
    candidat?: UserCandidateWithUsers;
  };
  size?: number;
}

export const ImgProfile = ({ user, size = 40 }: ImgProfileProps) => {
  const [hash, setHash] = useState<number>(Date.now());

  const { urlImg, fallbackToCVImage } = useImageFallback({
    userId: user.id,
    role: user.role,
    userCandidate: user.candidat,
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
    <div
      className="profileImage uk-background-primary uk-border-circle uk-position-relative uk-flex uk-flex-center uk-flex-middle"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        overflow: 'hidden',
      }}
    >
      {urlImg ? (
        <div className="uk-width-expand uk-height-1-1 uk-cover-container">
          <Img
            cover
            onError={fallbackToCVImage}
            src={`${urlImg}?${hash}`}
            alt={`photo de ${user.firstName}`}
          />
        </div>
      ) : (
        <span
          className="uk-text-normal uk-text-uppercase"
          style={{ fontSize: size / 2, color: '#fff' }}
        >
          {user.firstName?.substring(0, 1)}
        </span>
      )}
    </div>
  );
};
