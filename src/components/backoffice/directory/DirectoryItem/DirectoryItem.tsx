import React from 'react';
import { UserProfileNudge, UserProfileSectorOccupation } from 'src/api/types';
import { CardListItem } from 'src/components/utils/CardList';
import { ProfileCard } from 'src/components/utils/Cards/ProfileCard';
import { Department } from 'src/constants/departements';
import { UserRole } from 'src/constants/users';

interface DirectoryItemProps {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  userProfileNudges?: UserProfileNudge[];
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
  userProfileNudges,
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
        userProfileNudges={userProfileNudges}
        sectorOccupations={sectorOccupations}
        job={job}
        isAvailable={isAvailable}
        displayHelps={displayHelps}
      />
    </CardListItem>
  );
}
