import React, { useContext, useEffect, useState } from 'react';
import { UserWithUserCandidate } from 'src/api/types';
import { Img } from 'src/components/utils';
import { CANDIDATE_USER_ROLES } from 'src/constants/users';
import { UserContext } from 'src/store/UserProvider';
import { isRoleIncluded } from 'src/utils/Finding';

interface ImgProfileProps {
  user?: UserWithUserCandidate;
  size?: number;
}

export const ImgProfile = ({ user, size = 40 }: ImgProfileProps) => {
  const userFromContext = useContext(UserContext).user;

  const { firstName, role, candidat } = user || userFromContext;
  const [urlImg, setUrlImg] = useState(null);

  useEffect(() => {
    if (
      isRoleIncluded(CANDIDATE_USER_ROLES, role) &&
      candidat &&
      candidat.cvs
    ) {
      const latestCV = candidat.cvs.reduce(
        (acc, curr) => {
          return acc.version < curr.version ? curr : acc;
        },
        { version: -1 }
      );
      setUrlImg(latestCV.urlImg);
    }
  }, [candidat, role, user]);

  return (
    <div
      className="profileImage uk-background-primary uk-border-circle uk-position-relative"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        overflow: 'hidden',
      }}
    >
      {urlImg ? (
        <div
          className="uk-height-1-1 uk-position-center uk-width-expand"
          style={{ maxWidth: 'inherit' }}
        >
          <Img
            className="uk-height-1-1"
            src={process.env.AWSS3_URL + urlImg}
            alt={`photo de ${firstName}`}
          />
        </div>
      ) : (
        <span
          className="uk-text-normal uk-text-uppercase uk-position-center"
          style={{ fontSize: size / 2, color: '#fff' }}
        >
          {firstName.substr(0, 1)}
        </span>
      )}
    </div>
  );
};
