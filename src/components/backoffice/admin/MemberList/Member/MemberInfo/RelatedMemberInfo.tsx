import React from 'react';
import { v4 as uuid } from 'uuid';
import { EXTERNAL_USER_ROLES, USER_ROLES } from 'src/constants/users';
import { isRoleIncluded } from 'src/utils';
import { MemberInfo } from './MemberInfo';
import { StyledRelatedMemberListItem } from './RelatedMemberInfo.styles';

const uuidValue = uuid();

interface MemberProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: typeof USER_ROLES;
  organization: {
    name: string;
  };
}
interface RelatedMemberInfoProps {
  relatedUser: MemberProps | MemberProps[];
}

export function RelatedMemberInfo({ relatedUser }: RelatedMemberInfoProps) {
  if (
    !relatedUser ||
    (Array.isArray(relatedUser) && relatedUser.length === 0)
  ) {
    return <span>Non lié</span>;
  }

  if (Array.isArray(relatedUser)) {
    return (
      <>
        {relatedUser.map(
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
        )}
      </>
    );
  }

  return (
    <MemberInfo
      id={relatedUser.id}
      firstName={relatedUser.firstName}
      lastName={relatedUser.lastName}
      email={relatedUser.email}
      organizationName={
        isRoleIncluded(EXTERNAL_USER_ROLES, relatedUser.role)
          ? relatedUser.organization?.name
          : null
      }
    />
  );
}
