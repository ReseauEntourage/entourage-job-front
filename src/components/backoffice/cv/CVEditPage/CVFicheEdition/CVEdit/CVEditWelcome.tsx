import React from 'react';
import { UserWithUserCandidate } from 'src/api/types';
import { CandidatHeader } from 'src/components/backoffice/candidate/CandidatHeader';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { UserRoles } from 'src/constants/users';

export const CVEditWelcome = ({ user }: { user: UserWithUserCandidate }) => {
  return (
    <HeaderBackoffice
      childrenBottom
      title={`Ravi de vous revoir,${
        user.role === UserRoles.COACH ? ' coach' : ''
      } ${user.firstName} !`}
      description={
        user.role === UserRoles.CANDIDATE
          ? "Bienvenue dans votre espace personnel, depuis lequel vous pouvez modifier les informations qui s'affichent sur votre CV sur Entourage Pro."
          : `Bienvenue dans l'espace personnel de votre candidat, depuis lequel vous pouvez modifier avec lui/elle les informations qui s'affichent sur son CV sur Entourage Pro.`
      }
    >
      <CandidatHeader user={user} />
    </HeaderBackoffice>
  );
};
