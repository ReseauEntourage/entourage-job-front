import React, { useMemo, type JSX } from 'react';
import { Table, Th } from 'src/components/utils/Table';
import { USER_ROLES, UserRole } from 'src/constants/users';
import { MemberColumn } from './Member/Member.types';

interface MemberTableProps {
  columns: MemberColumn[];
  members: JSX.Element[];
  role: UserRole | UserRole[];
}

export function MemberTable({ columns, members, role }: MemberTableProps) {
  const columnsHeaders = useMemo<JSX.Element[]>(() => {
    let columnsArray = [];

    if (role === USER_ROLES.CANDIDATE) {
      columnsArray = [
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        <Th key="memberRole">Candidat</Th>,
      ];
    }
    if (role === USER_ROLES.COACH) {
      columnsArray = [
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        <Th key="memberRole">Coach</Th>,
      ];
    }
    if (role === USER_ROLES.REFERER) {
      columnsArray = [
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        <Th key="memberRole">Prescripteur</Th>,
      ];
    }

    if (columns.includes('associatedUser') && role === USER_ROLES.CANDIDATE) {
      columnsArray = [
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        ...columnsArray,

        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        <Th key="memberAssociatedRole">Coach</Th>,
      ];
    }
    if (columns.includes('associatedUser') && role === USER_ROLES.COACH) {
      columnsArray = [
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        ...columnsArray,

        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        <Th key="memberAssociatedRole">Candidat</Th>,
      ];
    }
    if (columns.includes('type')) {
      columnsArray = [
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        ...columnsArray,
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        <Th key="memberType">Type</Th>,
      ];
    }

    if (columns.includes('phone')) {
      columnsArray = [
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        ...columnsArray,
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        <Th key="memberPhone">Téléphone</Th>,
      ];
    }

    if (columns.includes('gender')) {
      columnsArray = [
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        ...columnsArray,
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        <Th key="memberGender">Genre</Th>,
      ];
    }

    if (columns.includes('address')) {
      columnsArray = [
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        ...columnsArray,
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        <Th key="memberAddress">Adresse</Th>,
      ];
    }

    if (columns.includes('organization')) {
      columnsArray = [
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        ...columnsArray,

        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        <Th key="memberOrganization">Structure</Th>,
      ];
    }
    if (columns.includes('zone')) {
      columnsArray = [
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        ...columnsArray,
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        <Th key="memberZone">Zone</Th>,
      ];
    }
    if (columns.includes('countRefered')) {
      columnsArray = [
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        ...columnsArray,

        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        <Th key="memberCountRefered">Nb. candidats</Th>,
      ];
    }
    if (columns.includes('lastConnection')) {
      columnsArray = [
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        ...columnsArray,

        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        <Th key="memberLastConnexion">Dernière connexion</Th>,
      ];
    }

    if (role === USER_ROLES.CANDIDATE) {
      if (columns.includes('cvUrl')) {
        columnsArray = [
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          ...columnsArray,
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          <Th key="memberCVLink">Lien CV</Th>,
        ];
      }
      if (columns.includes('employed')) {
        columnsArray = [
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          ...columnsArray,

          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          <Th key="memberEmployed">En emploi</Th>,
        ];
      }
      if (columns.includes('cvStatus')) {
        columnsArray = [
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          ...columnsArray,

          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          <Th key="memberCVStatus">Statut CV</Th>,
        ];
      }
      if (columns.includes('cvHidden')) {
        columnsArray = [
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          ...columnsArray,

          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          <Th key="memberCVHidden">CV masqué</Th>,
        ];
      }
      if (columns.includes('selection')) {
        columnsArray = [
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          ...columnsArray,

          // @ts-expect-error after enable TS strict mode. Please, try to fix it
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
