import React, { useEffect, useState } from 'react';
import { UserWithUserCandidate } from 'src/api/types';
import { Img } from 'src/components/utils/Img';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useImageFallback } from 'src/hooks/useImageFallback';

interface ImgProfileProps {
  user: Partial<UserWithUserCandidate>;
  size?: number;
}

export const ImgProfile = ({ user, size = 40 }: ImgProfileProps) => {
  const connectedUser = useAuthenticatedUser();

  const myUser: Partial<UserWithUserCandidate> = user || connectedUser;
  const [hash, setHash] = useState<number>(Date.now());

  const { urlImg, fallbackToCVImage } = useImageFallback({
    userId: myUser.id,
    role: myUser.role,
    userCandidate: myUser.candidat,
  });

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
            alt={`photo de ${myUser.firstName}`}
            id="parametres-profile-picture"
          />
        </div>
      ) : (
        <span
          className="uk-text-normal uk-text-uppercase"
          style={{ fontSize: size / 2, color: '#fff' }}
        >
          {myUser.firstName.substring(0, 1)}
        </span>
      )}
    </div>
  );
};
