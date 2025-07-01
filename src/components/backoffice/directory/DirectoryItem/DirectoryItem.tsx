import React from 'react';
import { Nudge, UserProfileSectorOccupation } from 'src/api/types';
import { CardListItem } from 'src/components/utils/CardList';
import { ProfileCard } from 'src/components/utils/Cards/ProfileCard';
import { Department } from 'src/constants/departements';
import { UserRoles } from 'src/constants/users';

interface DirectoryItemProps {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRoles;
  nudges?: Nudge[];
  sectorOccupations?: UserProfileSectorOccupation[];
  department: Department;
  job?: string;
  isAvailable: boolean;
  displayHelps: boolean;
  hasPicture: boolean;
}

export function DirectoryItem({
  id,
  firstName,
  lastName,
  role,
  department,
  nudges,
  sectorOccupations,
  job,
  isAvailable,
  displayHelps,
  hasPicture,
}: DirectoryItemProps) {
  return (
    <CardListItem dataTestId={id}>
      <ProfileCard
        userId={id}
        firstName={firstName}
        lastName={lastName}
        role={role}
        department={department}
        nudges={nudges}
        sectorOccupations={sectorOccupations}
        job={job}
        isAvailable={isAvailable}
        displayHelps={displayHelps}
        hasPicture={hasPicture}
      />
    </CardListItem>
  );
}
