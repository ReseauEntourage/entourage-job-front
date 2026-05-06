import React from 'react';
import {
  StyledOrganizationInfoContainer,
  StyledOrganizationInfoNameContainer,
} from './OrganizationInfo.styles';

interface OrganizationInfoProps {
  name: string;
  address?: string;
  children?: React.ReactNode;
}

export function OrganizationInfo({
  name,
  address,
  children,
}: OrganizationInfoProps) {
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
