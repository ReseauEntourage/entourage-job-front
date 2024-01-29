import React from 'react';
import { HelpNames } from 'src/api/types';
import {
  StyledHelpList,
  StyledHelpListImgContainer,
} from './ProfileHelpList.styles';
import { PARAMETRES_HELP_CARD_CONTENTS } from './ProfileHelpList.utils';

interface ProfileHelpListProps {
  helpList: { name: HelpNames }[];
  role: string;
}

export const ProfileHelpList = ({ helpList, role }: ProfileHelpListProps) => {
  return (
    <StyledHelpList data-testid="parametres-help-list">
      {PARAMETRES_HELP_CARD_CONTENTS[role.toLowerCase()].map(
        ({ icon, title, value }, index) => {
          if (!helpList.some((help) => help.name === value)) {
            return null;
          }
          return (
            <li key={index}>
              <StyledHelpListImgContainer>{icon}</StyledHelpListImgContainer>
              {title}
            </li>
          );
        }
      )}
    </StyledHelpList>
  );
};
