import _ from 'lodash';
import React, { useContext } from 'react';
import { User } from 'src/api/types';
import ImgProfile from 'src/components/headers/HeaderConnected/HeaderConnectedContent/ImgProfile';
import { SimpleLink } from 'src/components/utils';
import Icon, { IconNoSSR } from 'src/components/utils/Icon';
import {
  CANDIDATE_USER_ROLES,
  EXTERNAL_USER_ROLES,
  USER_ROLES,
} from 'src/constants/users';
import { UserContext } from 'src/store/UserProvider';
import {
  getRelatedUser,
  getUserCandidateFromCoach,
  isRoleIncluded,
  Grid,
} from 'src/utils';
import {
  StyledContainer, StyledInfoContainer,
  StyledNameContainer, StyledRoleContainer
} from "./MemberDetailsHeader.styles";

interface MemberDetailsHeaderProps {
  user: User;
}

export function MemberDetailsHeader({ user }: MemberDetailsHeaderProps) {
  const { user: connectedUser } = useContext(UserContext);

  if (!user || !connectedUser) return null;

  const relatedUser = getRelatedUser(user);

  const relatedUserArray =
    relatedUser && !Array.isArray(relatedUser) ? [relatedUser] : relatedUser;

  const relatedUserText =
    user.role === USER_ROLES.COACH_EXTERNAL
      ? `${relatedUser.length} candidat(s)`
      : `${
          relatedUserArray?.length > 0
            ? `${relatedUserArray[0].firstName} ${relatedUserArray[0].lastName}`
            : `personne`
        }`;

  return (
    <StyledContainer>
      <ImgProfile user={user} size={48} />
      <StyledInfoContainer>
        <StyledNameContainer>
          {user.firstName} {user.lastName}
          {user.organization ? ` - ${user.organization.name}` : ''}
        </StyledNameContainer>
        <span className="uk-label">
          {user.zone ? _.capitalize(user.zone) : 'Non renseignée'}
        </span>
        <StyledRoleContainer>
          <Icon name="user" style={{ width: 20 }} />
          <div>
            <span className="bold">{`${_.capitalize(user.role)}`}</span>
            {` de ${relatedUserText}`}
          </div>
        </StyledRoleContainer>
      </StyledInfoContainer>
    </StyledContainer>
  );
}
