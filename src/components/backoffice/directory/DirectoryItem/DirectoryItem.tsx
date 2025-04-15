import React from 'react';
import { CardListItem } from 'src/components/utils/CardList';
import { ProfileCard } from 'src/components/utils/Cards/ProfileCard';
import { BusinessLineValue } from 'src/constants';
import { Department } from 'src/constants/departements';
import { HelpValue } from 'src/constants/helps';
import { UserRoles } from 'src/constants/users';

interface DirectoryItemProps {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRoles;
  helps?: {
    name: HelpValue;
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
  isAvailable: boolean;
  displayHelps: boolean;
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
  isAvailable,
  displayHelps,
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
        isAvailable={isAvailable}
        displayHelps={displayHelps}
      />
    </CardListItem>
  );
}
