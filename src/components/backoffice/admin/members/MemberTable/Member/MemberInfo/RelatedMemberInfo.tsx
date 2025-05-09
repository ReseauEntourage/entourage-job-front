import React from 'react';
import { v4 as uuid } from 'uuid';
import { UserWithUserCandidate } from 'src/api/types';
import { getRolesWithOrganization } from 'src/constants/users';
import { isRoleIncluded } from 'src/utils/Finding';
import { MemberInfo } from './MemberInfo';
import { StyledRelatedMemberListItem } from './RelatedMemberInfo.styles';

const uuidValue = uuid();

interface RelatedMemberInfoProps {
  relatedUser: UserWithUserCandidate[] | null;
}

export function RelatedMemberInfo({ relatedUser }: RelatedMemberInfoProps) {
  if (!relatedUser || relatedUser.length === 0) {
    return <span>Non lié</span>;
  }

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
                // @ts-expect-error after enable TS strict mode. Please, try to fix it
                organizationName={
                  isRoleIncluded(getRolesWithOrganization(), relatedUserRole)
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
