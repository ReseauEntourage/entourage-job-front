import moment from 'moment';
import React from 'react';

import { Tooltip } from 'react-tooltip';
import { translateStatusCV } from 'src/components/backoffice/admin/members/MemberList/MemberList.utils';
import { StyledRow } from 'src/components/backoffice/admin/members/MemberTable/Member/Member.styles';
import { renderCVStatus } from 'src/components/backoffice/admin/members/MemberTable/Member/Member.utils';
import ImgProfile from 'src/components/headers/HeaderConnected/HeaderConnectedContent/ImgProfile';
import { SimpleLink } from 'src/components/utils';
import Icon from 'src/components/utils/Icon';
import { CheckBox, useCheckBox } from 'src/components/utils/Inputs/CheckBox';
import { ADMIN_ZONES } from 'src/constants/departements';
import {
  CANDIDATE_USER_ROLES,
  EXTERNAL_USER_ROLES,
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

export function MemberDesktop({
  member,
  role,
  callback,
  columns,
  isEditable,
  setMember,
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
            !columns.includes('organization') &&
            isRoleIncluded(EXTERNAL_USER_ROLES, member.role)
              ? member.organization?.name
              : null
          }
          disableLink={disableLink}
        >
          <ImgProfile user={member} size={36} />
        </MemberInfo>
      </td>
      {columns.includes('associatedUser') && (
        <td className="associated-user-cell">
          <RelatedMemberInfo relatedUser={relatedUser} role={member.role} />
        </td>
      )}
      {columns.includes('type') && (
        <td>
          <span className="uk-text-nowrap uk-visible@m">
            {isRoleIncluded(EXTERNAL_USER_ROLES, member.role)
              ? 'Externe'
              : 'LKO'}
          </span>
        </td>
      )}
      {columns.includes('phone') && (
        <td>
          <span>{member.phone || '-'}</span>
        </td>
      )}
      {columns.includes('gender') && (
        <td>
          <span className="uk-text-nowrap">
            {findConstantFromValue(member.gender, GENDERS_FILTERS).label}
          </span>
        </td>
      )}
      {columns.includes('address') && (
        <td>
          <span>{member.address || '-'}</span>
        </td>
      )}
      {columns.includes('zone') && (
        <td>
          <span className="uk-text-nowrap uk-visible@m">
            {member?.zone
              ? member.zone.charAt(0).toUpperCase() +
                member.zone.slice(1).toLowerCase()
              : ADMIN_ZONES.HZ.charAt(0).toUpperCase() +
                ADMIN_ZONES.HZ.slice(1).toLowerCase()}
          </span>
        </td>
      )}
      {columns.includes('organization') && (
        <td>
          <span className="uk-text-nowrap">
            {member.organization?.name || '-'}
          </span>
        </td>
      )}
      {columns.includes('lastConnection') && (
        <td>
          {member.lastConnection ? (
            moment(member.lastConnection).format('DD/MM/YYYY')
          ) : (
            <span>Aucune connexion</span>
          )}
        </td>
      )}
      {isRoleIncluded(CANDIDATE_USER_ROLES, role) && (
        <>
          {columns.includes('cvUrl') && (
            <td>
              <span>
                <SimpleLink
                  href={`/cv/${userCandidate?.url}`}
                  isExternal
                  target="_blank"
                >
                  <Icon name="link" style={{ width: 20 }} />
                </SimpleLink>
              </span>
            </td>
          )}
          {columns.includes('employed') && (
            <td>
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
            </td>
          )}
          {columns.includes('cvStatus') && (
            <td>
              <div className="cv-status-cell">
                {cvStatus === 'none' ? (
                  <span className="uk-text-info uk-text-nowrap">Aucun</span>
                ) : (
                  <span className="uk-text-nowrap">
                    {translateStatusCV(cvStatus)}
                  </span>
                )}
              </div>
            </td>
          )}
          {columns.includes('cvHidden') && (
            <td className="hiddenCV-cell">
              {isEditable ? (
                <MemberHiddenToggle setMember={setMember} member={member} />
              ) : (
                <>
                  {userCandidate?.hidden ? (
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
                </>
              )}
            </td>
          )}
          {columns.includes('selection') && callback && (
            <td className="checkbox-cell">
              <CheckBox
                removeMargin
                id={`member-${member.id}-check`}
                name={`member-${member.id}-check`}
                value={checked}
                handleClick={handleCheckBox}
                disabled={userCandidate?.hidden}
              />
            </td>
          )}
        </>
      )}
    </StyledRow>
  );
}
