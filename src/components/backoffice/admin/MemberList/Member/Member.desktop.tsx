import moment from 'moment';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

import { StyledRow } from 'src/components/backoffice/admin/MemberList/Member/Member.styles';
import { renderCVStatus } from 'src/components/backoffice/admin/MemberList/Member/Member.utils';
import { MemberPropTypes } from 'src/components/backoffice/admin/MemberList/MemberList.shapes';
import { translateStatusCV } from 'src/components/backoffice/admin/MemberList/MemberList.utils';
import ImgProfile from 'src/components/headers/HeaderConnected/HeaderConnectedContent/ImgProfile';
import { Grid } from 'src/components/utils';
import Icon from 'src/components/utils/Icon';
import Checkbox from 'src/components/utils/Inputs/Checkbox';
import { useCheckbox } from 'src/components/utils/Inputs/Checkbox/useCheckbox';
import {
  CANDIDATE_USER_ROLES,
  EXTERNAL_USER_ROLES,
  NORMAL_USERS_ROLES,
  USER_ROLES,
} from 'src/constants';
import {
  getUserCandidateFromCoachOrCandidate,
  getRelatedUser,
  areRolesIncluded,
} from 'src/utils';

export function MemberDesktop({ member, role, callback }) {
  const cvStatus = renderCVStatus(member);
  const { checked, handleCheckBox } = useCheckbox(callback, member.id);
  const relatedUser = getRelatedUser(member);
  return (
    <StyledRow
      cvStatus={cvStatus.toLowerCase()}
      className={checked ? 'selected' : ''}
    >
      <td className="name-cell">
        <Link href={`/backoffice/admin/membres/${member.id}`}>
          <a>
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
        </Link>
      </td>
      <td className="associated-user-cell">
        {relatedUser ? (
          <Link href={`/backoffice/admin/membres/${relatedUser.id}`}>
            <a>
              <div className="bold">
                {relatedUser.firstName}
                &nbsp;
                {relatedUser.lastName}
              </div>
              <div>{relatedUser.email}</div>
            </a>
          </Link>
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
            {areRolesIncluded(CANDIDATE_USER_ROLES, [member.role]) ? (
              <>
                {getUserCandidateFromCoachOrCandidate(member) && (
                  <>
                    {getUserCandidateFromCoachOrCandidate(member).employed ? (
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
            {areRolesIncluded(CANDIDATE_USER_ROLES, [member.role]) ? (
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
            {areRolesIncluded(CANDIDATE_USER_ROLES, [member.role]) ? (
              <>
                {getUserCandidateFromCoachOrCandidate(member) && (
                  <div>
                    {getUserCandidateFromCoachOrCandidate(member).hidden ? (
                      <Icon
                        name="eye-hidden"
                        ratio={1.2}
                        className="uk-visible@m eye-hidden"
                      />
                    ) : (
                      <Icon
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
            <Checkbox
              checked={checked}
              handleClick={handleCheckBox}
              disabled={getUserCandidateFromCoachOrCandidate(member)?.hidden}
            />
          </td>
        </>
      )}
    </StyledRow>
  );
}

MemberDesktop.propTypes = {
  member: MemberPropTypes.isRequired,
  role: PropTypes.oneOf([...NORMAL_USERS_ROLES, ...EXTERNAL_USER_ROLES]),
  callback: PropTypes.func.isRequired,
};

MemberDesktop.defaultProps = {
  role: 'Candidat',
};
