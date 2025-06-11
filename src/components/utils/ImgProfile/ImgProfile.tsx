import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { UserCandidateWithUsers } from 'src/api/types';
import { Img } from 'src/components/utils/Img';
import { ReduxRequestEvents } from 'src/constants';
import { UserRoles } from 'src/constants/users';
import { useImageFallback } from 'src/hooks/useImageFallback';
import { updateUserProfilePictureSelectors } from 'src/use-cases/current-user';
import { StyledImgProfileContainer } from './ImgProfile.style';

interface ImgProfileProps {
  user: {
    id: string;
    firstName: string;
    role: UserRoles;
    candidat?: UserCandidateWithUsers;
  };
  size?: number;
  highlight?: boolean;
}

export const ImgProfile = ({
  user,
  size = 40,
  highlight = false,
}: ImgProfileProps) => {
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
    <StyledImgProfileContainer size={size} highlight={highlight}>
      {urlImg ? (
        <Img
          cover
          onError={fallbackToCVImage}
          src={`${urlImg}?${hash}`}
          alt={`photo de ${user.firstName}`}
        />
      ) : (
        <span
          className="uk-text-normal uk-text-uppercase"
          style={{ fontSize: size / 2, color: '#fff' }}
        >
          {user.firstName?.substring(0, 1)}
        </span>
      )}
    </StyledImgProfileContainer>
  );
};
