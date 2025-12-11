import moment from 'moment';
import React from 'react';

import { GENDERS_FILTERS } from '@/src/constants/genders';
import {
  StyledMobileMember,
  StyledNameCellMobile,
} from 'src/components/backoffice/admin/members/MemberTable/Member/Member.styles';
import { ImgUserProfile } from 'src/components/utils';
import { TdMobile } from 'src/components/utils/Table';
import { ADMIN_ZONES } from 'src/constants/departements';
import { getRolesWithOrganization } from 'src/constants/users';
import { isRoleIncluded, findConstantFromValue } from 'src/utils/Finding';
import { MemberProps } from './Member.types';
import { MemberInfo } from './MemberInfo';

export function MemberMobile({ member, columns, disableLink }: MemberProps) {
  return (
    <StyledMobileMember>
      <div className="line">
        <StyledNameCellMobile>
          <ImgUserProfile
            user={member}
            size={29}
            hasPicture={member.userProfile?.hasPicture || false}
          />
          <MemberInfo
            id={member.id}
            firstName={member.firstName}
            lastName={member.lastName}
            email={member.email}
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            organizationName={
              isRoleIncluded(getRolesWithOrganization(), member.role)
                ? member.organization?.name
                : null
            }
            disableLink={disableLink}
          />
        </StyledNameCellMobile>
      </div>
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
        {columns.includes('organization') && (
          <TdMobile title="Structure">
            <span>{member.organization?.name || '-'}</span>
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

        {columns.includes('countRefered') && (
          <TdMobile title="Nb. candidats">
            <span>{member.referredCandidates?.length || 0}</span>
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
    </StyledMobileMember>
  );
}
