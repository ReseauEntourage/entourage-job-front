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
  members: JSX.Element[];
  role: UserRole | UserRole[];
}

export function MemberTable({ columns, members, role }: MemberTableProps) {
  const columnsHeaders = useMemo<JSX.Element[]>(() => {
    let columnsArray = [];

    if (isRoleIncluded(CANDIDATE_USER_ROLES, role)) {
      columnsArray = [<Th key="memberRole">Candidat</Th>];
    }
    if (isRoleIncluded(COACH_USER_ROLES, role)) {
      columnsArray = [<Th key="memberRole">Coach</Th>];
    }

    if (
      columns.includes('associatedUser') &&
      isRoleIncluded(CANDIDATE_USER_ROLES, role)
    ) {
      columnsArray = [
        ...columnsArray,
        <Th key="memberAssociatedRole">Coach</Th>,
      ];
    }
    if (
      columns.includes('associatedUser') &&
      isRoleIncluded(COACH_USER_ROLES, role)
    ) {
      columnsArray = [
        ...columnsArray,
        <Th key="memberAssociatedRole">Candidat</Th>,
      ];
    }
    if (columns.includes('type')) {
      columnsArray = [...columnsArray, <Th key="memberType">Type</Th>];
    }

    if (columns.includes('phone')) {
      columnsArray = [...columnsArray, <Th key="memberPhone">Téléphone</Th>];
    }

    if (columns.includes('gender')) {
      columnsArray = [...columnsArray, <Th key="memberGender">Sexe</Th>];
    }

    if (columns.includes('address')) {
      columnsArray = [...columnsArray, <Th key="memberAddress">Adresse</Th>];
    }

    if (columns.includes('zone')) {
      columnsArray = [...columnsArray, <Th key="memberZone">Zone</Th>];
    }
    if (columns.includes('organization')) {
      columnsArray = [
        ...columnsArray,
        <Th key="memberOrganization">Structure</Th>,
      ];
    }
    if (columns.includes('lastConnection')) {
      columnsArray = [
        ...columnsArray,
        <Th key="memberLastConnexion">Dernière connexion</Th>,
      ];
    }

    if (isRoleIncluded(CANDIDATE_USER_ROLES, role)) {
      if (columns.includes('cvUrl')) {
        columnsArray = [...columnsArray, <Th key="memberCVLink">Lien CV</Th>];
      }
      if (columns.includes('employed')) {
        columnsArray = [
          ...columnsArray,
          <Th key="memberEmployed">En emploi</Th>,
        ];
      }
      if (columns.includes('cvStatus')) {
        columnsArray = [
          ...columnsArray,
          <Th key="memberCVStatus">Statut CV</Th>,
        ];
      }
      if (columns.includes('cvHidden')) {
        columnsArray = [
          ...columnsArray,
          <Th key="memberCVHidden">CV masqué</Th>,
        ];
      }
      if (columns.includes('selection')) {
        columnsArray = [
          ...columnsArray,
          <Th key="memberSelected">Sélection</Th>,
        ];
      }
    }

    return columnsArray;
  }, [columns, role]);

  return (
    <Table columns={columnsHeaders} dataTestId="member-list" body={members} />
  );
}
