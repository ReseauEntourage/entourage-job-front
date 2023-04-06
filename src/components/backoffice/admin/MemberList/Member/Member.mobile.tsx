import moment from 'moment';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

import { StyledMobileMember } from 'src/components/backoffice/admin/MemberList/Member/Member.styles';
import { renderCVStatus } from 'src/components/backoffice/admin/MemberList/Member/Member.utils';
import { MemberPropTypes } from 'src/components/backoffice/admin/MemberList/MemberList.shapes';
import { translateStatusCV } from 'src/components/backoffice/admin/MemberList/MemberList.utils';
import ImgProfile from 'src/components/headers/HeaderConnected/HeaderConnectedContent/ImgProfile';
import Icon from 'src/components/utils/Icon';
import Checkbox from 'src/components/utils/Inputs/Checkbox';
import { useCheckbox } from 'src/components/utils/Inputs/Checkbox/useCheckbox';
import {
  EXTERNAL_USER_ROLES,
  NORMAL_USERS_ROLES,
  USER_ROLES,
} from 'src/constants';
import {
  getUserCandidateFromCoachOrCandidate,
  getRelatedUser,
} from 'src/utils';

export function MemberMobile({ member, role, callback }) {
  const cvStatus = renderCVStatus(member);
  const { checked, handleCheckBox } = useCheckbox(callback, member.id);
  const relatedUser = getRelatedUser(member);
  return (
    <StyledMobileMember
      cvStatus={cvStatus.toLowerCase()}
      className={checked ? 'selected' : ''}
    >
      <div className="line member-head">
        <ImgProfile user={member} size={29} />
        <Link href={`/backoffice/admin/membres/${member.id}`}>
          <a>
            <span className="uk-text-bold">
              {member.firstName} {member.lastName}
            </span>
            <span>{member.email}</span>
          </a>
        </Link>
        {role !== USER_ROLES.COACH && (
          <div className="checkbox-container">
            <Checkbox
              checked={checked}
              handleClick={handleCheckBox}
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

          {getRelatedUser(member) ? (
            <Link href={`/backoffice/admin/membres/${relatedUser.id}`}>
              <a>
                <span>
                  <span className="uk-text-bold">
                    {getRelatedUser(member).firstName}
                    &nbsp;
                    {getRelatedUser(member).lastName}
                  </span>
                  &nbsp; &#8226; &nbsp;
                  {getRelatedUser(member).email}
                </span>
              </a>
            </Link>
          ) : (
            <span>Non lié</span>
          )}
        </div>
      </div>
      <div className="line zone-date">
        <div className="cell">
          <span className="title">Zone</span>
          <span>
            {member?.zone?.charAt(0).toUpperCase() +
              member?.zone?.slice(1).toLowerCase()}
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
      {role !== USER_ROLES.COACH && (
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
  role: PropTypes.oneOf([...NORMAL_USERS_ROLES, ...EXTERNAL_USER_ROLES]),
  callback: PropTypes.func.isRequired,
};

MemberMobile.defaultProps = {
  role: 'Candidat',
};
