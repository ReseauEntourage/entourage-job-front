import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { DirectoryList } from '../DirectoryList';
import { useRole } from 'src/components/backoffice/useRole';
import { Button } from 'src/components/utils';
import { CANDIDATE_USER_ROLES, COACH_USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { isRoleIncluded } from 'src/utils';
import {
  StyledDirectoryButtonContainer,
  StyledDirectoryContainer,
} from './DirectoryContainer.styles';

export function DirectoryContainer() {
  const { replace } = useRouter();

  const user = useAuthenticatedUser();
  const role = useRole();

  useEffect(() => {
    if (!role) {
      if (isRoleIncluded(CANDIDATE_USER_ROLES, user.role)) {
        replace({
          pathname: '/backoffice/annuaire',
          query: { role: COACH_USER_ROLES },
        });
      }
      if (isRoleIncluded(COACH_USER_ROLES, user.role)) {
        replace({
          pathname: '/backoffice/annuaire',
          query: { role: CANDIDATE_USER_ROLES },
        });
      }
    }
  }, [replace, role, user.role]);

  return (
    <StyledDirectoryContainer>
      <StyledDirectoryButtonContainer>
        <Button
          style={`custom-secondary${
            isRoleIncluded(CANDIDATE_USER_ROLES, role) ? '-inverted' : ''
          }`}
          onClick={() => {
            // TODO dispatch action to filter by role
          }}
        >
          Les candidats
        </Button>
        <Button
          style={`custom-secondary${
            isRoleIncluded(COACH_USER_ROLES, role) ? '-inverted' : ''
          }`}
          onClick={() => {
            // TODO dispatch action to filter by role
          }}
        >
          Les coachs
        </Button>
      </StyledDirectoryButtonContainer>
      <DirectoryList />
    </StyledDirectoryContainer>
  );
}
