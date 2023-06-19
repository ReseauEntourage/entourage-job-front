import moment from 'moment';
import React from 'react';

import { Tooltip } from 'react-tooltip';
import { translateStatusCV } from 'src/components/backoffice/admin/members/MemberList/MemberList.utils';
import { renderCVStatus } from 'src/components/backoffice/admin/members/MemberTable/Member/Member.utils';
import ImgProfile from 'src/components/headers/HeaderConnected/HeaderConnectedContent/ImgProfile';
import { SimpleLink } from 'src/components/utils';
import Icon from 'src/components/utils/Icon';
import { CheckBox, useCheckBox } from 'src/components/utils/Inputs/CheckBox';
import { TrDesktop, TdDesktop } from 'src/components/utils/Table';
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
import {
  StyledCheckBoxCellContent,
  StyledCVStatusCellContent,
  StyledEmployedCellContent,
  StyledHiddenCVCellContent,
  StyledNameCell,
  StyledNoWrapCellContent,
} from './Member.styles';
import { MemberProps } from './Member.types';
import { MemberInfo, RelatedMemberInfo } from './MemberInfo';
import { MemberEmployedToggle } from './MemberToggle/MemberEmployedToggle';
import { MemberHiddenToggle } from './MemberToggle/MemberHiddenToggle';

const tooltipId = 'contract-tooltip';

export function MemberDesktop({
  member,
  role,
  selectionCallback,
  columns,
  isEditable,
  setMember,
  disableLink,
}: MemberProps) {
  const cvStatus = renderCVStatus(member);
  const { checked, handleCheckBox } = useCheckBox(selectionCallback, member.id);
  const relatedUser = getRelatedUser(member);

  const userCandidate = getUserCandidateFromCoachOrCandidate(member);

  const contractLabel = member.candidat?.contract
    ? buildContractLabel(
        member.candidat.contract,
        member.candidat.endOfContract
      )
    : null;

  return (
    <TrDesktop selected={checked}>
      <StyledNameCell cvStatus={cvStatus.toLowerCase()}>
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
      </StyledNameCell>

      {columns.includes('associatedUser') && (
        <TdDesktop>
          <RelatedMemberInfo relatedUser={relatedUser} role={member.role} />
        </TdDesktop>
      )}
      {columns.includes('type') && (
        <TdDesktop>
          <StyledNoWrapCellContent>
            <span>
              {isRoleIncluded(EXTERNAL_USER_ROLES, member.role)
                ? 'Externe'
                : 'LKO'}
            </span>
          </StyledNoWrapCellContent>
        </TdDesktop>
      )}
      {columns.includes('phone') && (
        <TdDesktop>
          <span>{member.phone || '-'}</span>
        </TdDesktop>
      )}
      {columns.includes('gender') && (
        <TdDesktop>
          <StyledNoWrapCellContent>
            <span>
              {findConstantFromValue(member.gender, GENDERS_FILTERS).label}
            </span>
          </StyledNoWrapCellContent>
        </TdDesktop>
      )}
      {columns.includes('address') && (
        <TdDesktop>
          <span>{member.address || '-'}</span>
        </TdDesktop>
      )}
      {columns.includes('zone') && (
        <TdDesktop>
          <StyledNoWrapCellContent>
            <span>
              {member.zone
                ? member.zone.charAt(0).toUpperCase() +
                  member.zone.slice(1).toLowerCase()
                : ADMIN_ZONES.HZ.charAt(0).toUpperCase() +
                  ADMIN_ZONES.HZ.slice(1).toLowerCase()}
            </span>
          </StyledNoWrapCellContent>
        </TdDesktop>
      )}
      {columns.includes('organization') && (
        <TdDesktop>
          <StyledNoWrapCellContent>
            <span>{member.organization?.name || '-'}</span>
          </StyledNoWrapCellContent>
        </TdDesktop>
      )}
      {columns.includes('lastConnection') && (
        <TdDesktop>
          {member.lastConnection ? (
            moment(member.lastConnection).format('DD/MM/YYYY')
          ) : (
            <span>Aucune connexion</span>
          )}
        </TdDesktop>
      )}
      {isRoleIncluded(CANDIDATE_USER_ROLES, role) && (
        <>
          {columns.includes('cvUrl') && (
            <TdDesktop>
              <span>
                <SimpleLink
                  href={`/cv/${userCandidate?.url}`}
                  isExternal
                  target="_blank"
                >
                  <Icon name="link" style={{ width: 20 }} />
                </SimpleLink>
              </span>
            </TdDesktop>
          )}
          {columns.includes('employed') && (
            <TdDesktop>
              <StyledEmployedCellContent>
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
              </StyledEmployedCellContent>
            </TdDesktop>
          )}
          {columns.includes('cvStatus') && (
            <TdDesktop>
              <StyledCVStatusCellContent cvStatus={cvStatus.toLowerCase()}>
                {cvStatus === 'none' ? (
                  <span>Aucun</span>
                ) : (
                  <span>{translateStatusCV(cvStatus)}</span>
                )}
              </StyledCVStatusCellContent>
            </TdDesktop>
          )}
          {columns.includes('cvHidden') && (
            <TdDesktop>
              <StyledHiddenCVCellContent>
                {isEditable ? (
                  <MemberHiddenToggle setMember={setMember} member={member} />
                ) : (
                  <>
                    {userCandidate?.hidden ? (
                      <Icon
                        name="eye-hidden"
                        ratio={1.2}
                        className="eye-hidden"
                      />
                    ) : (
                      <Icon name="eye-visible" ratio={1.2} />
                    )}
                  </>
                )}
              </StyledHiddenCVCellContent>
            </TdDesktop>
          )}
          {columns.includes('selection') && selectionCallback && (
            <TdDesktop>
              <StyledCheckBoxCellContent>
                <CheckBox
                  removeMargin
                  id={`member-${member.id}-check`}
                  name={`member-${member.id}-check`}
                  value={checked}
                  handleClick={handleCheckBox}
                  disabled={userCandidate?.hidden}
                />
              </StyledCheckBoxCellContent>
            </TdDesktop>
          )}
        </>
      )}
    </TrDesktop>
  );
}
