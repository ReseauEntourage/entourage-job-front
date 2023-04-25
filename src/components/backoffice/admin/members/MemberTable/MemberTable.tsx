/* eslint-disable react/require-default-props */

import React from 'react';
import { UserWithUserCandidate } from 'src/api/types';
import {
  CANDIDATE_USER_ROLES,
  COACH_USER_ROLES,
  UserRole,
} from 'src/constants/users';
import { isRoleIncluded } from 'src/utils/Finding';
import { Member } from './Member';
import { MemberColumn } from './Member/Member.types';
import { StyledTable } from './MemberTable.styles';

interface MemberTableProps {
  columns: MemberColumn[];
  members: UserWithUserCandidate[];
  role: UserRole;
  handleSelectedMembers?: (memberId: string) => void;
  isEditable?: boolean;
  setUser?: (user: UserWithUserCandidate) => void;
}
export function MemberTable({
  columns,
  members,
  role,
  handleSelectedMembers,
  isEditable = false,
  setUser,
}: MemberTableProps) {
  return (
    <StyledTable>
      <thead>
        <tr>
          {isRoleIncluded(CANDIDATE_USER_ROLES, role) && (
            <th className="uk-text-nowrap">Candidat</th>
          )}
          {isRoleIncluded(COACH_USER_ROLES, role) && (
            <th className="uk-text-nowrap">Coach</th>
          )}
          {columns.includes('associatedUser') &&
            isRoleIncluded(CANDIDATE_USER_ROLES, role) && (
              <th className="uk-text-nowrap">Coach</th>
            )}
          {columns.includes('associatedUser') &&
            isRoleIncluded(COACH_USER_ROLES, role) && (
              <th className="uk-text-nowrap">Candidat</th>
            )}
          {columns.includes('type') && <th className="uk-text-nowrap">Type</th>}

          {columns.includes('phone') && (
            <th className="uk-text-nowrap">Téléphone</th>
          )}

          {columns.includes('gender') && (
            <th className="uk-text-nowrap">Sexe</th>
          )}

          {columns.includes('address') && (
            <th className="uk-text-nowrap">Adresse</th>
          )}

          {columns.includes('zone') && <th className="uk-text-nowrap">Zone</th>}
          {columns.includes('organization') && (
            <th className="uk-text-nowrap">Structure</th>
          )}
          {columns.includes('lastConnection') && (
            <th className="uk-text-nowrap">Dernière connexion</th>
          )}
          {isRoleIncluded(CANDIDATE_USER_ROLES, role) && (
            <>
              {columns.includes('cvUrl') && (
                <th className="uk-text-nowrap">Lien CV</th>
              )}
              {columns.includes('employed') && (
                <th className="uk-text-nowrap">En emploi</th>
              )}
              {columns.includes('cvStatus') && (
                <th className="uk-text-nowrap">Statut CV</th>
              )}
              {columns.includes('cvHidden') && (
                <th className="uk-text-nowrap">CV masqué</th>
              )}
              {handleSelectedMembers && (
                <th className="uk-text-nowrap">Sélection</th>
              )}
            </>
          )}
        </tr>
      </thead>
      <tbody data-testid="member-list">
        {members.map((member, key) => {
          return (
            <Member
              columns={columns}
              role={role}
              member={member}
              key={key}
              callback={handleSelectedMembers}
              isEditable={isEditable}
              setMember={setUser}
            />
          );
        })}
      </tbody>
    </StyledTable>
  );
}
