import React from 'react';
import { v4 as uuid } from 'uuid';
import { EXTERNAL_USER_ROLES, USER_ROLES, UserRole } from 'src/constants/users';
import { isRoleIncluded } from 'src/utils/Finding';
import { MemberInfo } from './MemberInfo';
import {
  StyledNumberCandidates,
  StyledRelatedMemberListItem,
} from './RelatedMemberInfo.styles';

const uuidValue = uuid();

interface MemberProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  organization: {
    name: string;
  };
}
interface RelatedMemberInfoProps {
  relatedUser: MemberProps[];
  role: UserRole;
}

export function RelatedMemberInfo({
  role,
  relatedUser,
}: RelatedMemberInfoProps) {
  if (!relatedUser || relatedUser.length === 0) {
    return <span>Non lié</span>;
  }

  return (
    <>
      {role === USER_ROLES.COACH_EXTERNAL ? (
        <StyledNumberCandidates>{`${
          relatedUser ? relatedUser.length : 0
        } candidat${
          relatedUser && relatedUser.length > 1 ? 's' : ''
        }`}</StyledNumberCandidates>
      ) : (
        relatedUser.map(
          ({
            id,
            firstName,
            lastName,
            email,
            role: relatedUserRole,
            organization,
          }) => {
            return (
              <StyledRelatedMemberListItem key={`${id}-${uuidValue}`}>
                <MemberInfo
                  id={id}
                  firstName={firstName}
                  lastName={lastName}
                  email={email}
                  organizationName={
                    isRoleIncluded(EXTERNAL_USER_ROLES, relatedUserRole)
                      ? organization?.name
                      : null
                  }
                />
              </StyledRelatedMemberListItem>
            );
          }
        )
      )}
    </>
  );
}
