import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { getCandidateFromCoachOrCandidate, getRelatedUser } from 'src/utils';
import moment from 'moment';
import ImgProfile from 'src/components/headers/ImgProfile';
import { MemberPropTypes } from 'src/components/backoffice/admin/MemberList/shape';
import { translateStatusCV } from 'src/components/backoffice/admin/MemberList/utils';
import { USER_ROLES } from 'src/constants';
import { Grid } from 'src/components/utils';
import { IconNoSSR } from 'src/components/utils/Icon';
import { StyledRow } from 'src/components/backoffice/admin/MemberList/Member/styles';
import Checkbox from 'src/components/utils/Inputs/Checkbox';

const Member = ({ member, role }) => {
  let cvStatus;
  if (getCandidateFromCoachOrCandidate(member)?.cvs?.[0]?.status) {
    cvStatus = getCandidateFromCoachOrCandidate(member).cvs[0].status;
  } else {
    cvStatus = 'none';
  }
  const [checked, setChecked] = useState(false);
  const handleCheckBox = () => {
    setChecked(!checked);
  };
  const relatedUser = getRelatedUser(member);
  return (
    <StyledRow
      cvStatus={cvStatus.toLowerCase()}
      className={checked ? 'selected' : ''}
    >
      <td className="name-cell">
        <a href={`/backoffice/admin/membres/${member.id}`}>
          <Grid row gap="small" middle className="uk-visible@m">
            <ImgProfile user={member} size={36} />
            <Grid column gap="collapse">
              <span className="bold">
                {member.firstName} {member.lastName}
              </span>
              <span>{member.email}</span>
            </Grid>
          </Grid>
        </a>
      </td>
      <td className="associated-user-cell">
        {relatedUser ? (
          <a href={`/backoffice/admin/membres/${relatedUser.id}`}>
            <div className="bold">
              {relatedUser.firstName}
              &nbsp;
              {relatedUser.lastName}
            </div>
            <div>{relatedUser.email}</div>
          </a>
        ) : (
          <span>Non lié</span>
        )}
      </td>
      <td>
        <span className="uk-text-nowrap uk-visible@m">
          {member?.zone?.charAt(0).toUpperCase() +
            member?.zone?.slice(1).toLowerCase()}
        </span>
      </td>
      <td>
        {member.lastConnection ? (
          moment(member.lastConnection).format('DD/MM/YYYY')
        ) : (
          <span>Aucune connexion</span>
        )}
      </td>
      {role !== USER_ROLES.COACH && (
        <>
          <td>
            {member.role === USER_ROLES.CANDIDAT ? (
              <>
                {getCandidateFromCoachOrCandidate(member) && (
                  <>
                    {getCandidateFromCoachOrCandidate(member).employed ? (
                      <span className="yes">Oui</span>
                    ) : (
                      <span className="no">Non</span>
                    )}
                  </>
                )}
              </>
            ) : (
              <span>-</span>
            )}
          </td>
          <td className="cv-status-cell">
            {member.role === USER_ROLES.CANDIDAT ? (
              <>
                {cvStatus === 'none' ? (
                  <span className="uk-text-info">Aucun</span>
                ) : (
                  <span>{translateStatusCV(cvStatus)}</span>
                )}
              </>
            ) : (
              <span>-</span>
            )}
          </td>
          <td className="hiddenCV-cell">
            {member.role === USER_ROLES.CANDIDAT ? (
              <>
                {getCandidateFromCoachOrCandidate(member) && (
                  <div>
                    {getCandidateFromCoachOrCandidate(member).hidden ? (
                      <IconNoSSR
                        name="eye-hidden"
                        ratio={1.2}
                        className="uk-visible@m eye-hidden"
                      />
                    ) : (
                      <IconNoSSR
                        name="eye-visible"
                        ratio={1.2}
                        className="uk-visible@m"
                      />
                    )}
                  </div>
                )}
              </>
            ) : (
              <span>-</span>
            )}
          </td>
          <td className="checkbox-cell">
            <Checkbox size={16} handleClick={handleCheckBox} />
          </td>
        </>
      )}
    </StyledRow>
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
