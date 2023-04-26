import moment from 'moment';
import React from 'react';

import { Tooltip } from 'react-tooltip';
import { translateStatusCV } from 'src/components/backoffice/admin/members/MemberList/MemberList.utils';
import { StyledMobileMember } from 'src/components/backoffice/admin/members/MemberTable/Member/Member.styles';
import { renderCVStatus } from 'src/components/backoffice/admin/members/MemberTable/Member/Member.utils';
import ImgProfile from 'src/components/headers/HeaderConnected/HeaderConnectedContent/ImgProfile';
import { SimpleLink } from 'src/components/utils';
import Icon from 'src/components/utils/Icon';
import { CheckBox, useCheckBox } from 'src/components/utils/Inputs/CheckBox';
import { ADMIN_ZONES } from 'src/constants/departements';
import {
  COACH_USER_ROLES,
  EXTERNAL_USER_ROLES,
  USER_ROLES,
  CANDIDATE_USER_ROLES,
  GENDERS_FILTERS,
} from 'src/constants/users';
import {
  getUserCandidateFromCoachOrCandidate,
  getRelatedUser,
  isRoleIncluded,
  findConstantFromValue,
} from 'src/utils/Finding';
import { buildContractLabel } from 'src/utils/Formatting';
import { MemberProps } from './Member.types';
import { MemberInfo, RelatedMemberInfo } from './MemberInfo';
import { MemberEmployedToggle } from './MemberToggle/MemberEmployedToggle';
import { MemberHiddenToggle } from './MemberToggle/MemberHiddenToggle';

const tooltipId = 'contract-tooltip';

export function MemberMobile({
  member,
  role,
  callback,
  columns,
  setMember,
  isEditable,
  disableLink,
}: MemberProps) {
  const cvStatus = renderCVStatus(member);
  const { checked, handleCheckBox } = useCheckBox(callback, member.id);
  const relatedUser = getRelatedUser(member);

  const userCandidate = getUserCandidateFromCoachOrCandidate(member);

  const contractLabel = member.candidat?.contract
    ? buildContractLabel(
        member.candidat.contract,
        member.candidat.endOfContract
      )
    : null;

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
          disableLink={disableLink}
        />
        {columns.includes('selection') &&
          callback &&
          !isRoleIncluded(COACH_USER_ROLES, role) && (
            <div className="checkbox-container">
              <CheckBox
                id={`member-${member.id}-check`}
                name={`member-${member.id}-check`}
                value={checked}
                handleClick={handleCheckBox}
                removeMargin
                disabled={userCandidate?.hidden}
              />
            </div>
          )}
      </div>
      {columns.includes('associatedUser') && (
        <div className="line coach-line">
          <div className="cell">
            <span className="title">
              {isRoleIncluded(COACH_USER_ROLES, role) && USER_ROLES.CANDIDATE}
              {isRoleIncluded(CANDIDATE_USER_ROLES, role) && USER_ROLES.COACH}
            </span>
            <RelatedMemberInfo relatedUser={relatedUser} role={member.role} />
          </div>
        </div>
      )}
      {(columns.includes('phone') || columns.includes('gender')) && (
        <div className="line phone-sex">
          {columns.includes('phone') && (
            <div className="cell">
              <span className="title">Téléphone</span>
              <span>{member.phone || '-'}</span>
            </div>
          )}
          {columns.includes('gender') && (
            <div className="cell">
              <span className="title">Sexe</span>
              <span>
                {findConstantFromValue(member.gender, GENDERS_FILTERS).label}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="line zone-date">
        {columns.includes('type') && (
          <div className="cell">
            <span className="title">Type</span>
            <span>
              {isRoleIncluded(EXTERNAL_USER_ROLES, member.role)
                ? 'Externe'
                : 'LKO'}
            </span>
          </div>
        )}
        {columns.includes('address') && (
          <div className="cell">
            <span className="title">Adresse</span>
            <span>{member.address || '-'}</span>
          </div>
        )}
        {columns.includes('zone') && (
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
        )}
        {columns.includes('organization') && (
          <div className="cell">
            <span className="title">Structure</span>
            <span>{member.organization?.name || '-'}</span>
          </div>
        )}
        {columns.includes('lastConnection') && (
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
        )}
      </div>
      {!isRoleIncluded(COACH_USER_ROLES, role) && (
        <div className="line work-cv">
          {columns.includes('cvUrl') && (
            <div className="cell">
              <span className="title">Lien CV</span>
              <span>
                <SimpleLink
                  href={`/cv/${userCandidate?.url}`}
                  isExternal
                  target="_blank"
                >
                  <Icon name="link" style={{ width: 20 }} />
                </SimpleLink>
              </span>
            </div>
          )}
          {columns.includes('employed') && (
            <div className="cell">
              <span className="title">En emploi</span>
              {isEditable ? (
                <MemberEmployedToggle setMember={setMember} member={member} />
              ) : (
                <span
                  data-tooltip-id={tooltipId}
                  data-tooltip-content={contractLabel}
                  data-tooltip-place="bottom"
                >
                  {userCandidate?.employed ? (
                    <span className="yes">Oui</span>
                  ) : (
                    <span className="no">Non</span>
                  )}
                  <Tooltip id={tooltipId} />
                </span>
              )}
            </div>
          )}
          {columns.includes('cvStatus') && (
            <div className="cell">
              <span className="title">Statut du CV</span>
              <span className="status-cv">
                {cvStatus === 'none' ? 'Aucun' : translateStatusCV(cvStatus)}
              </span>
            </div>
          )}
          {columns.includes('cvHidden') && (
            <div className="cell">
              <span className="title">CV masqué</span>
              {isEditable ? (
                <MemberHiddenToggle setMember={setMember} member={member} />
              ) : (
                <span>
                  {userCandidate?.hidden ? (
                    <Icon
                      name="eye-hidden"
                      ratio={1.2}
                      className="eye-hidden"
                    />
                  ) : (
                    <Icon name="eye-visible" ratio={1.2} />
                  )}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </StyledMobileMember>
  );
}
