import _ from 'lodash';
import React, { useContext } from 'react';
import { UserWithUserCandidate } from 'src/api/types';
import ImgProfile from 'src/components/headers/HeaderConnected/HeaderConnectedContent/ImgProfile';
import { SimpleLink } from 'src/components/utils';
import Icon from 'src/components/utils/Icon';
import { USER_ROLES } from 'src/constants/users';
import { UserContext } from 'src/store/UserProvider';
import { getRelatedUser } from 'src/utils/Finding';
import {
  StyledContainer,
  StyledInfoContainer,
  StyledNameContainer,
  StyledRole,
  StyledRoleContainer,
} from './MemberDetailsHeader.styles';

interface MemberDetailsHeaderProps {
  user: UserWithUserCandidate;
}

export function MemberDetailsHeader({ user }: MemberDetailsHeaderProps) {
  const { user: connectedUser } = useContext(UserContext);

  if (!user || !connectedUser) return null;

  const relatedUser = getRelatedUser(user);

  const relatedUserText =
    user.role === USER_ROLES.COACH_EXTERNAL
      ? `${relatedUser ? relatedUser.length : 0} candidat${
          relatedUser && relatedUser.length > 1 ? 's' : ''
        }`
      : `${
          relatedUser && relatedUser.length > 0
            ? `${relatedUser[0].firstName} ${relatedUser[0].lastName}`
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
          <StyledRole>
            <span className="bold">{`${_.capitalize(user.role)}`}</span>
            {` de ${relatedUserText}`}
          </StyledRole>
        </StyledRoleContainer>
        <StyledRoleContainer>
          <Icon name="link" style={{ width: 20 }} />
          <SimpleLink
            className="uk-link-text uk-margin-small-top"
            target="_blank"
            href={`/cv/${user?.candidat?.url}`}
          >
            <span>
              {process.env.SERVER_URL}/cv/{user?.candidat?.url}
            </span>
          </SimpleLink>
        </StyledRoleContainer>
      </StyledInfoContainer>
    </StyledContainer>
  );
}