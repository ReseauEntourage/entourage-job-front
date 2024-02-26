import React from 'react';
import { Tooltip } from 'react-tooltip';
import { v4 as uuid } from 'uuid';
import { UserWithUserCandidate } from 'src/api/types';
import { EXTERNAL_USER_ROLES, USER_ROLES, UserRole } from 'src/constants/users';
import { isRoleIncluded } from 'src/utils/Finding';
import { MemberInfo } from './MemberInfo';
import {
  StyledNumberCandidates,
  StyledRelatedMemberListItem,
  StyledNumberCandidatesContainer,
} from './RelatedMemberInfo.styles';

const uuidValue = uuid();

interface RelatedMemberInfoProps {
  relatedUser: UserWithUserCandidate[] | null;
  role: UserRole;
}

const tooltipId = 'multiple-users-tooltip';

export function RelatedMemberInfo({
  role,
  relatedUser,
}: RelatedMemberInfoProps) {
  if (!relatedUser || relatedUser.length === 0) {
    return <span>Non lié</span>;
  }

  const multipleUsersString = `${
    relatedUser ? relatedUser.length : 0
  } candidat${relatedUser && relatedUser.length > 1 ? 's' : ''}`;

  const multipleUsersTooltip = relatedUser
    .map(({ firstName, lastName }) => {
      return `${firstName} ${lastName}`;
    })
    .join(`, `);

  return (
    <>
      {role === USER_ROLES.COACH_EXTERNAL ? (
        <StyledNumberCandidatesContainer>
          <StyledNumberCandidates
            data-tooltip-id={tooltipId}
            data-tooltip-content={multipleUsersTooltip}
            data-tooltip-place="top"
          >
            {multipleUsersString}
          </StyledNumberCandidates>
          <Tooltip id={tooltipId} />
        </StyledNumberCandidatesContainer>
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
                  // @ts-expect-error after enable TS strict mode. Please, try to fix it
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
