import React from 'react';
import { HelpNames } from 'src/api/types';
import { ProfileCard } from 'src/components/utils/Card/ProfileCard';
import { CardListItem } from 'src/components/utils/CardList';
import { BusinessLineValue } from 'src/constants';
import { Department } from 'src/constants/departements';
import { UserRole } from 'src/constants/users';

interface DirectoryItemProps {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  helps?: {
    name: HelpNames;
  }[];
  businessLines?: {
    name: BusinessLineValue;
    order: number;
  }[];
  ambitions?: {
    name: string;
    order: number;
  }[];
  department: Department;
  job?: string;
}

export function DirectoryItem({
  id,
  firstName,
  lastName,
  role,
  department,
  helps,
  businessLines,
  ambitions,
  job,
}: DirectoryItemProps) {
  return (
    <CardListItem dataTestId={id}>
      <ProfileCard
        userId={id}
        firstName={firstName}
        lastName={lastName}
        role={role}
        department={department}
        businessLines={businessLines}
        helps={helps}
        ambitions={ambitions}
        job={job}
      />
    </CardListItem>
  );
}