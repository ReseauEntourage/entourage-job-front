import React from 'react';
import PropTypes from 'prop-types';

import { getCandidateFromCoachOrCandidate, getRelatedUser } from 'src/utils';
import moment from 'moment';
import ImgProfile from 'src/components/headers/HeaderConnected/HeaderConnectedContent/ImgProfile';
import { MemberPropTypes } from 'src/components/backoffice/admin/MemberList/shape';
import { translateStatusCV } from 'src/components/backoffice/admin/MemberList/utils';
import { USER_ROLES } from 'src/constants';
import { IconNoSSR } from 'src/components/utils/Icon';
import { StyledMobileMember } from 'src/components/backoffice/admin/MemberList/Member/styles';
import Checkbox from 'src/components/utils/Inputs/Checkbox';
import { useCheckbox } from 'src/components/utils/Inputs/Checkbox/useCheckbox';
import { renderCVStatus } from 'src/components/backoffice/admin/MemberList/Member/utils';
import Link from 'next/link';

const Member = ({ member, role, callback }) => {
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
              size={16}
              handleClick={handleCheckBox}
              disabled={getCandidateFromCoachOrCandidate(member)?.hidden}
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
              {getCandidateFromCoachOrCandidate(member).employed ? (
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
              {getCandidateFromCoachOrCandidate(member).hidden ? (
                <IconNoSSR
                  name="eye-hidden"
                  ratio={1.2}
                  className="eye-hidden"
                />
              ) : (
                <IconNoSSR name="eye-visible" ratio={1.2} />
              )}
            </span>
          </div>
        </div>
      )}
    </StyledMobileMember>
  );
};

Member.propTypes = {
  member: MemberPropTypes.isRequired,
  role: PropTypes.oneOf([USER_ROLES.CANDIDAT, USER_ROLES.COACH]),
  callback: PropTypes.func.isRequired,
};

Member.defaultProps = {
  role: 'Candidat',
};

export default Member;
