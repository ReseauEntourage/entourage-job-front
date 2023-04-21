import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import { StyledRow } from 'src/components/backoffice/admin/MemberList/Member/Member.styles';
import { renderCVStatus } from 'src/components/backoffice/admin/MemberList/Member/Member.utils';
import { MemberPropTypes } from 'src/components/backoffice/admin/MemberList/MemberList.shapes';
import { translateStatusCV } from 'src/components/backoffice/admin/MemberList/MemberList.utils';
import ImgProfile from 'src/components/headers/HeaderConnected/HeaderConnectedContent/ImgProfile';
import Icon from 'src/components/utils/Icon';
import { CheckBox, useCheckBox } from 'src/components/utils/Inputs/CheckBox';
import { ADMIN_ZONES } from 'src/constants/departements';
import {
  CANDIDATE_USER_ROLES,
  COACH_USER_ROLES,
  EXTERNAL_USER_ROLES,
  ALL_USER_ROLES,
} from 'src/constants/users';
import {
  getUserCandidateFromCoachOrCandidate,
  getRelatedUser,
  isRoleIncluded,
} from 'src/utils/Finding';
import { MemberInfo, RelatedMemberInfo } from './MemberInfo';

export function MemberDesktop({ member, role, callback }) {
  const cvStatus = renderCVStatus(member);
  const { checked, handleCheckBox } = useCheckBox(callback, member.id);
  const relatedUser = getRelatedUser(member);

  return (
    <StyledRow
      cvStatus={cvStatus.toLowerCase()}
      className={checked ? 'selected' : ''}
    >
      <td className="name-cell">
        <MemberInfo
          id={member.id}
          firstName={member.firstName}
          lastName={member.lastName}
          email={member.email}
          organizationName={
            isRoleIncluded(EXTERNAL_USER_ROLES, member.role)
              ? member.organization?.name
              : null
          }
        >
          <ImgProfile user={member} size={36} />
        </MemberInfo>
      </td>
      <td className="associated-user-cell">
        <RelatedMemberInfo relatedUser={relatedUser} role={member.role} />
      </td>
      <td>
        <span className="uk-text-nowrap uk-visible@m">
          {isRoleIncluded(EXTERNAL_USER_ROLES, member.role) ? 'Externe' : 'LKO'}
        </span>
      </td>
      <td>
        <span className="uk-text-nowrap uk-visible@m">
          {member?.zone
            ? member.zone.charAt(0).toUpperCase() +
              member.zone.slice(1).toLowerCase()
            : ADMIN_ZONES.HZ.charAt(0).toUpperCase() +
              ADMIN_ZONES.HZ.slice(1).toLowerCase()}
        </span>
      </td>
      <td>
        {member.lastConnection ? (
          moment(member.lastConnection).format('DD/MM/YYYY')
        ) : (
          <span>Aucune connexion</span>
        )}
      </td>
      {!isRoleIncluded(COACH_USER_ROLES, role) && (
        <>
          <td>
            {isRoleIncluded(CANDIDATE_USER_ROLES, member.role) ? (
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
            {isRoleIncluded(CANDIDATE_USER_ROLES, member.role) ? (
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
            {isRoleIncluded(CANDIDATE_USER_ROLES, member.role) ? (
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
            <CheckBox
              removeMargin
              id={`member-${member.id}-check`}
              name={`member-${member.id}-check`}
              value={checked}
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
  role: PropTypes.oneOfType([
    PropTypes.oneOf(ALL_USER_ROLES),
    PropTypes.arrayOf(PropTypes.oneOf(ALL_USER_ROLES)),
  ]),
  callback: PropTypes.func.isRequired,
};

MemberDesktop.defaultProps = {
  role: 'Candidat',
};
