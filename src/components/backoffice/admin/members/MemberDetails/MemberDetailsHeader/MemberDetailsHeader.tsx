import _ from 'lodash';
import React from 'react';
import { UserWithUserCandidate } from 'src/api/types';
import { SimpleLink } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { ImgProfile } from 'src/components/utils/ImgProfile';
import { USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { getRelatedUser } from 'src/utils/Finding';
import {
  StyledContainer,
  StyledInfoContainer,
  StyledNameContainer,
  StyledRoleContainer,
} from './MemberDetailsHeader.styles';

interface MemberDetailsHeaderProps {
  user: UserWithUserCandidate;
}

export function MemberDetailsHeader({ user }: MemberDetailsHeaderProps) {
  const connectedUser = useAuthenticatedUser();

  if (!user || !connectedUser) return null;

  const relatedUser = getRelatedUser(user);

  const relatedUserText = `${
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
        {(user.role === USER_ROLES.COACH ||
          user.role === USER_ROLES.CANDIDATE) && (
          <StyledRoleContainer>
            <LucidIcon name="User" />
            &nbsp;
            <div>
              <span className="bold">{`${_.capitalize(user.role)}`}</span>
              {` de ${relatedUserText}`}
            </div>
          </StyledRoleContainer>
        )}
        {user.role === USER_ROLES.REFERER && (
          <StyledRoleContainer>
            <LucidIcon name="User" />
            &nbsp;
            {user.referredCandidates && user.referredCandidates.length > 0 ? (
              <div>
                <span className="bold">{`${_.capitalize(user.role)}`}</span>
                {` de ${user.referredCandidates?.length} candidat${
                  (user.referredCandidates.length > 1 && 's') || ''
                }`}
              </div>
            ) : (
              <div>
                <span className="bold">{`${_.capitalize(user.role)}`}</span>
                {` d'aucun candidat`}
              </div>
            )}
          </StyledRoleContainer>
        )}
        {user.role === USER_ROLES.CANDIDATE && (
          <StyledRoleContainer>
            <LucidIcon name="Link" />
            &nbsp;
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
