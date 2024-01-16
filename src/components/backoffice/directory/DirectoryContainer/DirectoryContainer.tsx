import { useRouter } from 'next/router';
import React from 'react';
import { DirectoryList } from '../DirectoryList';
import { Button } from 'src/components/utils';
import { CANDIDATE_USER_ROLES, COACH_USER_ROLES } from 'src/constants/users';
import { isRoleIncluded } from 'src/utils';
import {
  StyledDirectoryButtonContainer,
  StyledDirectoryContainer,
} from './DirectoryContainer.styles';
import { useRoleFilter } from './useRoleFilter';

const route = '/backoffice/annuaire';

export function DirectoryContainer() {
  const { push } = useRouter();
  const roleFilter = useRoleFilter();

  return (
    <StyledDirectoryContainer>
      <StyledDirectoryButtonContainer>
        <Button
          style={`custom-secondary${
            isRoleIncluded(CANDIDATE_USER_ROLES, roleFilter) ? '-inverted' : ''
          }`}
          onClick={() => {
            push({
              pathname: route,
              query: { role: CANDIDATE_USER_ROLES },
            });
          }}
        >
          Les candidats
        </Button>
        <Button
          style={`custom-secondary${
            isRoleIncluded(COACH_USER_ROLES, roleFilter) ? '-inverted' : ''
          }`}
          onClick={() => {
            push({
              pathname: route,
              query: { role: COACH_USER_ROLES },
            });
          }}
        >
          Les coachs
        </Button>
      </StyledDirectoryButtonContainer>
      <DirectoryList />
    </StyledDirectoryContainer>
  );
}
