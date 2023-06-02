import React, { useMemo } from 'react';
import { Table, Th } from 'src/components/utils/Table';
import {
  CANDIDATE_USER_ROLES,
  COACH_USER_ROLES,
  UserRole,
} from 'src/constants/users';
import { isRoleIncluded } from 'src/utils/Finding';
import { MemberColumn } from './Member/Member.types';

interface MemberTableProps {
  columns: MemberColumn[];
  members: React.ReactNode;
  role: UserRole | UserRole[];
}

export function MemberTable({ columns, members, role }: MemberTableProps) {
  const columnsHeaders = useMemo<JSX.Element[]>(() => {
    let columnsArray = [];

    if (isRoleIncluded(CANDIDATE_USER_ROLES, role)) {
      columnsArray = [<Th>Candidat</Th>];
    }
    if (isRoleIncluded(COACH_USER_ROLES, role)) {
      columnsArray = [<Th>Coach</Th>];
    }

    if (
      columns.includes('associatedUser') &&
      isRoleIncluded(CANDIDATE_USER_ROLES, role)
    ) {
      columnsArray = [...columnsArray, <Th>Coach</Th>];
    }
    if (
      columns.includes('associatedUser') &&
      isRoleIncluded(COACH_USER_ROLES, role)
    ) {
      columnsArray = [...columnsArray, <Th>Candidat</Th>];
    }
    if (columns.includes('type')) {
      columnsArray = [...columnsArray, <Th>Type</Th>];
    }

    if (columns.includes('phone')) {
      columnsArray = [...columnsArray, <Th>Téléphone</Th>];
    }

    if (columns.includes('gender')) {
      columnsArray = [...columnsArray, <Th>Sexe</Th>];
    }

    if (columns.includes('address')) {
      columnsArray = [...columnsArray, <Th>Adresse</Th>];
    }

    if (columns.includes('zone')) {
      columnsArray = [...columnsArray, <Th>Zone</Th>];
    }
    if (columns.includes('organization')) {
      columnsArray = [...columnsArray, <Th>Structure</Th>];
    }
    if (columns.includes('lastConnection')) {
      columnsArray = [...columnsArray, <Th>Dernière connexion</Th>];
    }

    if (isRoleIncluded(CANDIDATE_USER_ROLES, role)) {
      if (columns.includes('cvUrl')) {
        columnsArray = [...columnsArray, <Th>Lien CV</Th>];
      }
      if (columns.includes('employed')) {
        columnsArray = [...columnsArray, <Th>En emploi</Th>];
      }
      if (columns.includes('cvStatus')) {
        columnsArray = [...columnsArray, <Th>Statut CV</Th>];
      }
      if (columns.includes('cvHidden')) {
        columnsArray = [...columnsArray, <Th>CV masqué</Th>];
      }
      if (columns.includes('selection')) {
        columnsArray = [...columnsArray, <Th>Sélection</Th>];
      }
    }

    return columnsArray;
  }, [columns, role]);

  return (
    <Table columns={columnsHeaders} dataTestId="member-list" body={members} />
  );
}
