import Link from 'next/link';
import React, { useMemo } from 'react';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import {
  StyledMemberInfoContainer,
  StyledMemberInfoLink,
  StyledMemberInfoNameContainer,
} from './MemberInfo.styles';

export interface MemberInfoProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  organizationName?: string;
  children?: React.ReactNode;
  disableLink?: boolean;
}

export function MemberInfo({
  id,
  firstName,
  lastName,
  email,
  organizationName,
  children,
  disableLink,
}: MemberInfoProps) {
  const user = useAuthenticatedUser();

  const content = useMemo(
    () => (
      <StyledMemberInfoContainer>
        {children}
        <StyledMemberInfoNameContainer>
          <span>
            <span className="bold">
              {firstName} {lastName}
            </span>
            {organizationName && (
              <span className="bold">&nbsp;-&nbsp;{organizationName}</span>
            )}
          </span>
          {email && <span>{email}</span>}
        </StyledMemberInfoNameContainer>
      </StyledMemberInfoContainer>
    ),
    [children, email, firstName, lastName, organizationName]
  );

  return disableLink ? (
    content
  ) : (
    <Link
      shallow
      href={
        user.role === UserRoles.ADMIN
          ? `/backoffice/admin/membres/${id}`
          : `/backoffice/candidat/${id}/cv`
      }
      scroll={false}
    >
      <StyledMemberInfoLink>{content}</StyledMemberInfoLink>
    </Link>
  );
}

MemberInfo.defaultProps = {
  children: undefined,
  organizationName: undefined,
  disableLink: false,
};
