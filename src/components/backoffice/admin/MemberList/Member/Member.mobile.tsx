import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import { StyledMobileMember } from 'src/components/backoffice/admin/MemberList/Member/Member.styles';
import { renderCVStatus } from 'src/components/backoffice/admin/MemberList/Member/Member.utils';
import {
  MemberInfo,
  RelatedMemberInfo,
} from 'src/components/backoffice/admin/MemberList/Member/MemberInfo';
import { MemberPropTypes } from 'src/components/backoffice/admin/MemberList/MemberList.shapes';
import { translateStatusCV } from 'src/components/backoffice/admin/MemberList/MemberList.utils';
import ImgProfile from 'src/components/headers/HeaderConnected/HeaderConnectedContent/ImgProfile';
import Icon from 'src/components/utils/Icon';
import { CheckBox, useCheckBox } from 'src/components/utils/Inputs/CheckBox';
import { ADMIN_ZONES } from 'src/constants/departements';
import {
  COACH_USER_ROLES,
  EXTERNAL_USER_ROLES,
  ALL_USER_ROLES,
} from 'src/constants/users';
import {
  getUserCandidateFromCoachOrCandidate,
  getRelatedUser,
  isRoleIncluded,
} from 'src/utils';

export function MemberMobile({ member, role, callback }) {
  const cvStatus = renderCVStatus(member);
  const { checked, handleCheckBox } = useCheckBox(callback, member.id);
  const relatedUser = getRelatedUser(member);

  return (
    <StyledMobileMember
      cvStatus={cvStatus.toLowerCase()}
      className={checked ? 'selected' : ''}
    >
      <div className="line member-head">
        <ImgProfile user={member} size={29} />
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
        />
        {!isRoleIncluded(COACH_USER_ROLES, role) && (
          <div className="checkbox-container">
            <CheckBox
              id={`member-${member.id}-check`}
              name={`member-${member.id}-check`}
              value={checked}
              handleClick={handleCheckBox}
              removeMargin
              disabled={getUserCandidateFromCoachOrCandidate(member)?.hidden}
            />
          </div>
        )}
      </div>
      <div className="line coach-line">
        <div className="cell">
          <span className="title">
            {role === 'Coach' && 'Candidat'}
            {role === 'Candidat' && 'Coach'}
          </span>
          <RelatedMemberInfo relatedUser={relatedUser} />
        </div>
      </div>
      <div className="line zone-date">
        <div className="cell">
          <span className="title">Type</span>
          <span>
            {isRoleIncluded(EXTERNAL_USER_ROLES, member.role)
              ? 'Externe'
              : 'LKO'}
          </span>
        </div>
        <div className="cell">
          <span className="title">Zone</span>
          <span>
            {member?.zone
              ? member.zone.charAt(0).toUpperCase() +
                member.zone.slice(1).toLowerCase()
              : ADMIN_ZONES.HZ.charAt(0).toUpperCase() +
                ADMIN_ZONES.HZ.slice(1).toLowerCase()}
          </span>
        </div>
        <div className="cell">
          <span className="title">Dernière&nbsp;connexion</span>
          <span>
            {member.lastConnection ? (
              moment(member.lastConnection).format('DD/MM/YYYY')
            ) : (
              <span>Aucune</span>
            )}
          </span>
        </div>
      </div>
      {!isRoleIncluded(COACH_USER_ROLES, role) && (
        <div className="line work-cv">
          <div className="cell">
            <span className="title">En emploi</span>
            <span>
              {getUserCandidateFromCoachOrCandidate(member).employed ? (
                <span className="yes">Oui</span>
              ) : (
                <span className="no">Non</span>
              )}
            </span>
          </div>
          <div className="cell">
            <span className="title">Statut du CV</span>
            <span className="status-cv">
              {cvStatus === 'none' ? 'Aucun' : translateStatusCV(cvStatus)}
            </span>
          </div>
          <div className="cell">
            <span className="title">CV masqué</span>
            <span>
              {getUserCandidateFromCoachOrCandidate(member).hidden ? (
                <Icon name="eye-hidden" ratio={1.2} className="eye-hidden" />
              ) : (
                <Icon name="eye-visible" ratio={1.2} />
              )}
            </span>
          </div>
        </div>
      )}
    </StyledMobileMember>
  );
}

MemberMobile.propTypes = {
  member: MemberPropTypes.isRequired,
  role: PropTypes.oneOf(ALL_USER_ROLES),
  callback: PropTypes.func.isRequired,
};

MemberMobile.defaultProps = {
  role: 'Candidat',
};
