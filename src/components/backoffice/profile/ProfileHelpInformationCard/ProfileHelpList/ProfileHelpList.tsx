import React from 'react';
import { HelpValue, ParametresHelpCardContents } from 'src/constants/helps';
import { NormalUserRoles } from 'src/constants/users';
import {
  StyledHelpList,
  StyledHelpListImgContainer,
} from './ProfileHelpList.styles';

interface ProfileHelpListProps {
  helpList: { name: HelpValue }[];
  role: NormalUserRoles;
}

export const ProfileHelpList = ({ helpList, role }: ProfileHelpListProps) => {
  return (
    <StyledHelpList data-testid="parametres-help-list">
      {ParametresHelpCardContents[role].map(({ icon, label, value }, index) => {
        if (!helpList.some((help) => help.name === value)) {
          return null;
        }
        return (
          <li key={index}>
            <StyledHelpListImgContainer>{icon}</StyledHelpListImgContainer>
            {label}
          </li>
        );
      })}
    </StyledHelpList>
  );
};
