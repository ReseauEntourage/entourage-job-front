import React, { useCallback, useEffect, useState } from 'react';
import { CV, UserWithUserCandidate } from 'src/api/types';
import { CANDIDATE_USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { isRoleIncluded } from 'src/utils';
import { Img } from './Img';

interface ImgProfileProps {
  user: UserWithUserCandidate;
  size?: number;
}

export const ImgProfile = ({ user, size = 40 }: ImgProfileProps) => {
  const connectedUser = useAuthenticatedUser();

  const myUser: UserWithUserCandidate = user || connectedUser;
  const [urlImg, setUrlImg] = useState<string | null>(null);
  const [hash, setHash] = useState<number>(Date.now());

  useEffect(() => {
    setUrlImg(
      `${process.env.AWSS3_URL}${process.env.AWSS3_IMAGE_DIRECTORY}${myUser.id}.profile.jpg`
    );
  }, [myUser.id]);

  useEffect(() => {
    setHash(Date.now());
  }, [urlImg]);

  const fallbackToCVImage = useCallback(() => {
    const candidatUser = myUser;
    if (
      isRoleIncluded(CANDIDATE_USER_ROLES, candidatUser.role) &&
      candidatUser.candidat?.cvs &&
      candidatUser.candidat?.cvs?.length > 0
    ) {
      const { cvs } = candidatUser.candidat;
      const latestCV: CV = cvs.reduce((lastFound, curr) => {
        return lastFound.version < curr.version ? curr : lastFound;
      }, cvs[0]);

      if (latestCV.urlImg) {
        setUrlImg(`${process.env.AWSS3_URL}/${latestCV.urlImg}`);
      }
    }
  }, [myUser]);

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
            onError={() => {
              setUrlImg(null);
              fallbackToCVImage();
            }}
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
