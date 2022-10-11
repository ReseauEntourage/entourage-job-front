import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import _ from 'lodash';

import { getCandidateFromCoachOrCandidate, getRelatedUser } from 'src/utils';
import moment from 'moment';
import ImgProfile from 'src/components/headers/ImgProfile';
import { MemberPropTypes } from 'src/components/backoffice/admin/MemberList/shape';
import { translateStatusCV } from 'src/components/backoffice/admin/MemberList/utils';
import { USER_ROLES } from 'src/constants';
import { Grid } from 'src/components/utils';
import { IconNoSSR } from 'src/components/utils/Icon';

const Member = ({ member, role }) => {
  const { push } = useRouter();
  return (
    <tr
      className="uk-link-reset"
      style={{ cursor: 'pointer' }}
      onClick={() => {
        return push(`/backoffice/admin/membres/${member.id}`);
      }}
    >
      <td>
        <Grid row gap="small" middle className="uk-hidden@m" center>
          <ImgProfile user={member} size={48} />
          <Grid column gap="collapse">
            <span className="uk-text-bold">
              {member.firstName} {member.lastName}
            </span>
            <span>{member.email}</span>
          </Grid>
        </Grid>
        <Grid
          row
          gap="small"
          middle
          className="uk-visible@m"
          style={{ marginBottom: 15 }}
        >
          <ImgProfile user={member} size={48} />
          <Grid column gap="collapse">
            <span className="uk-text-bold">
              {member.firstName} {member.lastName}
            </span>
            <span>{member.email}</span>
          </Grid>
        </Grid>
      </td>
      <td className="uk-text-center">
        <span className="uk-label uk-text-nowrap uk-visible@m">
          {member.zone && _.capitalize(member.zone)}
        </span>
        <div className="uk-hidden@m">
          {member.zone ? (
            <span className="uk-label uk-text-nowrap">
              {_.capitalize(member.zone)}
            </span>
          ) : (
            <span className="uk-text-italic">Zone non renseignée</span>
          )}
        </div>
      </td>
      <td className="uk-text-center">
        {getRelatedUser(member) ? (
          `${getRelatedUser(member).firstName} ${
            getRelatedUser(member).lastName
          }`
        ) : (
          <span className="uk-text-italic">Non lié</span>
        )}
      </td>
      <td className="uk-text-center">
        {member.lastConnection ? (
          moment(member.lastConnection).format('DD/MM/YYYY')
        ) : (
          <span className="uk-text-italic">Aucune connexion</span>
        )}
      </td>
      {role !== USER_ROLES.COACH && (
        <>
          <td className="uk-text-center">
            {member.role === USER_ROLES.CANDIDAT ? (
              <>
                {getCandidateFromCoachOrCandidate(member) && (
                  <>
                    <span className="uk-hidden@m">
                      {getCandidateFromCoachOrCandidate(member).employed
                        ? 'A trouvé un emploi'
                        : "En recherche d'emploi"}
                    </span>
                    {getCandidateFromCoachOrCandidate(member).employed && (
                      <IconNoSSR
                        name="check"
                        ratio={1.2}
                        className="uk-text-primary uk-visible@m"
                      />
                    )}
                  </>
                )}
              </>
            ) : (
              <span>-</span>
            )}
          </td>
          <td className="uk-text-center">
            {member.role === USER_ROLES.CANDIDAT ? (
              <>
                {getCandidateFromCoachOrCandidate(member) &&
                getCandidateFromCoachOrCandidate(member).cvs &&
                getCandidateFromCoachOrCandidate(member).cvs.length > 0 ? (
                  translateStatusCV(
                    getCandidateFromCoachOrCandidate(member).cvs[0].status
                  )
                ) : (
                  <span className="uk-text-italic uk-text-info">Aucun CV</span>
                )}
              </>
            ) : (
              <span>-</span>
            )}
          </td>
          <td className="uk-text-center">
            {member.role === USER_ROLES.CANDIDAT ? (
              <>
                {getCandidateFromCoachOrCandidate(member) && (
                  <>
                    <span className="uk-hidden@m">
                      {getCandidateFromCoachOrCandidate(member).hidden
                        ? 'Masqué'
                        : 'Visible'}
                    </span>
                    {getCandidateFromCoachOrCandidate(member).hidden && (
                      <IconNoSSR
                        name="check"
                        ratio={1.2}
                        className="uk-text-primary uk-visible@m"
                      />
                    )}
                  </>
                )}
              </>
            ) : (
              <span>-</span>
            )}
          </td>
        </>
      )}
    </tr>
  );
};

Member.propTypes = {
  member: MemberPropTypes.isRequired,
  role: PropTypes.oneOf([USER_ROLES.CANDIDAT, USER_ROLES.COACH]),
};

Member.defaultProps = {
  role: 'Candidat',
};

export default Member;
