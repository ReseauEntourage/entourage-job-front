import Link from 'next/link';
import React from 'react';
import { StyledMemberInfoContainer } from './MemberInfo.styles';

export interface MemberInfoProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  organizationName?: string;
  children?: React.ReactNode;
}
export function MemberInfo({
  id,
  firstName,
  lastName,
  email,
  organizationName,
  children,
}: MemberInfoProps) {
  return (
    <Link href={`/backoffice/admin/membres/${id}`}>
      <a>
        {children && children}
        <StyledMemberInfoContainer>
          <span>
            <span className="bold">
              {firstName} {lastName}
            </span>
            {organizationName && (
              <span className="bold">&nbsp;-&nbsp;{organizationName}</span>
            )}
          </span>
          {email && <span>{email}</span>}
        </StyledMemberInfoContainer>
      </a>
    </Link>
  );
}

MemberInfo.defaultProps = {
  children: undefined,
  organizationName: undefined,
};
