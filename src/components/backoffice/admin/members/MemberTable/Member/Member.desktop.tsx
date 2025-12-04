import moment from 'moment';
import React from 'react';

import { GENDERS_FILTERS } from '@/src/constants/genders';
import { ImgUserProfile } from 'src/components/utils';
import { TrDesktop, TdDesktop } from 'src/components/utils/Table';
import { ADMIN_ZONES } from 'src/constants/departements';
import { getRolesWithOrganization } from 'src/constants/users';
import { isRoleIncluded, findConstantFromValue } from 'src/utils/Finding';
import { StyledNameCell, StyledNoWrapCellContent } from './Member.styles';
import { MemberProps } from './Member.types';
import { MemberInfo } from './MemberInfo';

export function MemberDesktop({ member, columns }: MemberProps) {
  return (
    <TrDesktop>
      <StyledNameCell>
        <MemberInfo
          id={member.id}
          firstName={member.firstName}
          lastName={member.lastName}
          email={member.email}
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          organizationName={
            !columns.includes('organization') &&
            isRoleIncluded(getRolesWithOrganization(), member.role)
              ? member.organization?.name
              : null
          }
        >
          <ImgUserProfile
            user={member}
            size={36}
            hasPicture={member.userProfile?.hasPicture || false}
          />
        </MemberInfo>
      </StyledNameCell>

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
      {columns.includes('organization') && (
        <TdDesktop>
          <StyledNoWrapCellContent>
            <span>{member.organization?.name || '-'}</span>
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
      {columns.includes('countRefered') && (
        <TdDesktop>
          <span>{member.referredCandidates?.length || 0}</span>
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
    </TrDesktop>
  );
}
