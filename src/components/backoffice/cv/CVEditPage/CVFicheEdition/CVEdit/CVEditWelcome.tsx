import React from 'react';
import { UserWithUserCandidate } from 'src/api/types';
import { CandidatHeader } from 'src/components/backoffice/candidate/CandidatHeader';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { CANDIDATE_USER_ROLES, COACH_USER_ROLES } from 'src/constants/users';
import { isRoleIncluded } from 'src/utils/Finding';

export const CVEditWelcome = ({ user }: { user: UserWithUserCandidate }) => {
  return (
    <HeaderBackoffice
      childrenBottom
      title={`Ravi de vous revoir,${
        isRoleIncluded(COACH_USER_ROLES, user.role) ? ' coach' : ''
      } ${user.firstName} !`}
      description={
        isRoleIncluded(CANDIDATE_USER_ROLES, user.role)
          ? "Bienvenue dans votre espace personnel, depuis lequel vous pouvez modifier les informations qui s'affichent sur votre CV sur LinkedOut."
          : `Bienvenue dans l'espace personnel de votre candidat, depuis lequel vous pouvez modifier avec lui/elle les informations qui s'affichent sur son CV sur LinkedOut.`
      }
    >
      <CandidatHeader user={user} />
    </HeaderBackoffice>
  );
};
