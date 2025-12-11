import _ from 'lodash';
import React from 'react';
import { User } from 'src/api/types';
import { ImgUserProfile } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import {
  StyledContainer,
  StyledInfoContainer,
  StyledNameContainer,
  StyledRoleContainer,
} from './MemberDetailsHeader.styles';

interface MemberDetailsHeaderProps {
  user: User;
}

export function MemberDetailsHeader({ user }: MemberDetailsHeaderProps) {
  const connectedUser = useAuthenticatedUser();

  if (!user || !connectedUser) return null;

  return (
    <StyledContainer>
      <ImgUserProfile
        user={user}
        size={48}
        hasPicture={user.userProfile?.hasPicture || false}
      />
      <StyledInfoContainer>
        <StyledNameContainer>
          {user.firstName} {user.lastName}
          {user.organization ? ` - ${user.organization.name}` : ''}
        </StyledNameContainer>
        <span className="uk-label">
          {user.zone ? _.capitalize(user.zone) : 'Non renseignée'}
        </span>
        {user.role === UserRoles.REFERER && (
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
      </StyledInfoContainer>
    </StyledContainer>
  );
}
