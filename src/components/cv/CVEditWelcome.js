import React from 'react';
import PropTypes from 'prop-types';
import HeaderBackoffice from 'src/components/headers/HeaderBackoffice';
import CandidatHeader from 'src/components/backoffice/cv/CandidatHeader';
import {
  CANDIDATE_USER_ROLES,
  COACH_USER_ROLES,
  USER_ROLES,
} from 'src/constants';
import { isRoleIncluded } from 'src/utils';

const CVEditWelcome = ({ user }) => {
  if (user === null) {
    return null;
  }
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
CVEditWelcome.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.oneOf([
      USER_ROLES.CANDIDATE,
      USER_ROLES.COACH,
      USER_ROLES.ADMIN,
    ]),
    firstName: PropTypes.string,
  }),
};
CVEditWelcome.defaultProps = {
  user: undefined,
};

export default CVEditWelcome;
