import React from 'react';
import { UserProfileSectorOccupation } from 'src/api/types';
import { CardListItem } from 'src/components/utils/CardList';
import { ProfileCard } from 'src/components/utils/Cards/ProfileCard';
import { Department } from 'src/constants/departements';
import { HelpValue } from 'src/constants/helps';
import { UserRole } from 'src/constants/users';

interface DirectoryItemProps {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  helps?: {
    name: HelpValue;
  }[];
  sectorOccupations?: UserProfileSectorOccupation[];
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
  sectorOccupations,
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
        helps={helps}
        sectorOccupations={sectorOccupations}
        job={job}
        isAvailable={isAvailable}
        displayHelps={displayHelps}
      />
    </CardListItem>
  );
}
