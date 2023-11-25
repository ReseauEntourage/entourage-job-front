import _ from 'lodash';
import React from 'react';
import LinkIcon from 'assets/icons/link.svg';
import UserIcon from 'assets/icons/user.svg';
import { UserWithUserCandidate } from 'src/api/types';
import { SimpleLink } from 'src/components/utils';
import { ImgProfile } from 'src/components/utils/ImgProfile';
import { CANDIDATE_USER_ROLES, USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { getRelatedUser, isRoleIncluded } from 'src/utils/Finding';
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
  const connectedUser = useAuthenticatedUser();

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
          <UserIcon width={30} />
          <StyledRole>
            <span className="bold">{`${_.capitalize(user.role)}`}</span>
            {` de ${relatedUserText}`}
          </StyledRole>
        </StyledRoleContainer>
        {isRoleIncluded(CANDIDATE_USER_ROLES, user.role) && (
          <StyledRoleContainer>
            <LinkIcon width={30} />
            <SimpleLink
              className="uk-link-text"
              target="_blank"
              href={`/cv/${user?.candidat?.url}`}
            >
              <span>
                {process.env.SERVER_URL}/cv/{user?.candidat?.url}
              </span>
            </SimpleLink>
          </StyledRoleContainer>
        )}
      </StyledInfoContainer>
    </StyledContainer>
  );
}
