import React from 'react';
import { HelpNames, ParametresHelpCardContents } from 'src/constants/helps';
import { USER_ROLES } from 'src/constants/users';
import {
  StyledHelpList,
  StyledHelpListImgContainer,
} from './ProfileHelpList.styles';

interface ProfileHelpListProps {
  helpList: { name: HelpNames }[];
  role: typeof USER_ROLES.CANDIDATE | typeof USER_ROLES.COACH;
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
