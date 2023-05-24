import React from 'react';
import {
  StyledOrganizationInfoContainer,
  StyledOrganizationInfoNameContainer,
} from './OrganizationInfo.styles';

export interface MemberInfoProps {
  name: string;
  address?: string;
  children?: React.ReactNode;
}

export function OrganizationInfo({ name, address, children }: MemberInfoProps) {
  return (
    <StyledOrganizationInfoContainer>
      {children}
      <StyledOrganizationInfoNameContainer>
        <span>
          <span className="bold">{name}</span>
        </span>
        {address && <span>{address}</span>}
      </StyledOrganizationInfoNameContainer>
    </StyledOrganizationInfoContainer>
  );
}

OrganizationInfo.defaultProps = {
  address: null,
  children: undefined,
};
