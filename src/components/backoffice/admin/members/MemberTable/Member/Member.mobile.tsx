import moment from 'moment';
import React from 'react';

import { Tooltip } from 'react-tooltip';
import { translateStatusCV } from 'src/components/backoffice/admin/members/MemberList/MemberList.utils';
import {
  StyledCVStatusCellContent,
  StyledEmployedCellContent,
  StyledMobileMember,
  StyledNameCellMobile,
} from 'src/components/backoffice/admin/members/MemberTable/Member/Member.styles';
import { renderCVStatus } from 'src/components/backoffice/admin/members/MemberTable/Member/Member.utils';
import { SimpleLink } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { ImgProfile } from 'src/components/utils/ImgProfile';
import { CheckBox, useCheckBox } from 'src/components/utils/Inputs/CheckBox';
import { TdMobile } from 'src/components/utils/Table';
import { ADMIN_ZONES } from 'src/constants/departements';
import {
  COACH_USER_ROLES,
  EXTERNAL_USER_ROLES,
  USER_ROLES,
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
  selectionCallback,
  columns,
  setMember,
  isEditable,
  disableLink,
}: MemberProps) {
  const cvStatus = renderCVStatus(member);
  const { checked, handleCheckBox } = useCheckBox(member.id, selectionCallback);
  const relatedUser = getRelatedUser(member);

  const userCandidate = getUserCandidateFromCoachOrCandidate(member);

  const contractLabel = member.candidat?.contract
    ? buildContractLabel(
        member.candidat.contract,
        member.candidat.endOfContract
      )
    : null;

  return (
    <StyledMobileMember selected={checked} cvStatus={cvStatus.toLowerCase()}>
      <div className="line">
        <StyledNameCellMobile>
          <ImgProfile user={member} size={29} />
          <MemberInfo
            id={member.id}
            firstName={member.firstName}
            lastName={member.lastName}
            email={member.email}
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            organizationName={
              isRoleIncluded(EXTERNAL_USER_ROLES, member.role)
                ? member.organization?.name
                : null
            }
            disableLink={disableLink}
          />
          {columns.includes('selection') &&
            selectionCallback &&
            !Array.isArray(userCandidate) &&
            !isRoleIncluded(COACH_USER_ROLES, role) && (
              <CheckBox
                id={`member-${member.id}-check`}
                name={`member-${member.id}-check`}
                value={checked}
                onChange={handleCheckBox}
                useOutsideOfForm
                disabled={userCandidate?.hidden}
              />
            )}
        </StyledNameCellMobile>
      </div>
      {columns.includes('associatedUser') && (
        <div className="line">
          <TdMobile
            title={
              isRoleIncluded(COACH_USER_ROLES, role)
                ? USER_ROLES.CANDIDATE
                : USER_ROLES.COACH
            }
          >
            <RelatedMemberInfo relatedUser={relatedUser} role={member.role} />
          </TdMobile>
        </div>
      )}
      {(columns.includes('phone') || columns.includes('gender')) && (
        <div className="line">
          {columns.includes('phone') && (
            <TdMobile title="Téléphone">
              <span>{member.phone || '-'}</span>
            </TdMobile>
          )}
          {columns.includes('gender') && (
            <TdMobile title="Genre">
              <span>
                {findConstantFromValue(member.gender, GENDERS_FILTERS).label}
              </span>
            </TdMobile>
          )}
        </div>
      )}

      <div className="line">
        {columns.includes('type') && (
          <TdMobile title="Type">
            <span>
              {isRoleIncluded(EXTERNAL_USER_ROLES, member.role)
                ? 'Externe'
                : 'LKO'}
            </span>
          </TdMobile>
        )}
        {columns.includes('address') && (
          <TdMobile title="Adresse">
            <span>{member.address || '-'}</span>
          </TdMobile>
        )}
        {columns.includes('zone') && (
          <TdMobile title="Zone">
            <span>
              {member.zone
                ? member.zone.charAt(0).toUpperCase() +
                  member.zone.slice(1).toLowerCase()
                : ADMIN_ZONES.HZ.charAt(0).toUpperCase() +
                  ADMIN_ZONES.HZ.slice(1).toLowerCase()}
            </span>
          </TdMobile>
        )}
        {columns.includes('organization') && (
          <TdMobile title="Structure">
            <span>{member.organization?.name || '-'}</span>
          </TdMobile>
        )}
        {columns.includes('lastConnection') && (
          <TdMobile title={`Dernière\xa0connexion`}>
            <span>
              {member.lastConnection ? (
                moment(member.lastConnection).format('DD/MM/YYYY')
              ) : (
                <span>Aucune</span>
              )}
            </span>
          </TdMobile>
        )}
      </div>
      {!isRoleIncluded(COACH_USER_ROLES, role) &&
        !Array.isArray(userCandidate) && (
          <div className="line">
            {columns.includes('cvUrl') && (
              <TdMobile title="Lien CV">
                <span>
                  <SimpleLink
                    href={`/cv/${userCandidate?.url}`}
                    isExternal
                    target="_blank"
                  >
                    <LucidIcon name="Link" size={20} />
                  </SimpleLink>
                </span>
              </TdMobile>
            )}
            {columns.includes('employed') && (
              <TdMobile title="En emploi">
                <StyledEmployedCellContent>
                  {isEditable ? (
                    <MemberEmployedToggle
                      // @ts-expect-error after enable TS strict mode. Please, try to fix it
                      setMember={setMember}
                      member={member}
                    />
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
              </TdMobile>
            )}
            {columns.includes('cvStatus') && (
              <TdMobile title="Statut du CV">
                <StyledCVStatusCellContent cvStatus={cvStatus.toLowerCase()}>
                  {cvStatus === 'none' ? 'Aucun' : translateStatusCV(cvStatus)}
                </StyledCVStatusCellContent>
              </TdMobile>
            )}
            {columns.includes('cvHidden') && (
              <TdMobile title="CV masqué">
                {isEditable ? (
                  <MemberHiddenToggle setMember={setMember} member={member} />
                ) : (
                  <span>
                    {userCandidate?.hidden ? (
                      <LucidIcon name="EyeOff" stroke="thin" />
                    ) : (
                      <LucidIcon name="Eye" stroke="thin" />
                    )}
                  </span>
                )}
              </TdMobile>
            )}
          </div>
        )}
    </StyledMobileMember>
  );
}
