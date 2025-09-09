import React from 'react';
import { ProfileCard } from '@/src/components/utils/Cards/EntityCards/ProfileCard';
import { Nudge, UserProfileSectorOccupation } from 'src/api/types';
import { CardListItem } from 'src/components/utils/CardList';
import { DepartmentName } from 'src/constants/departements';
import { UserRoles } from 'src/constants/users';

interface DirectoryUserItemProps {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRoles;
  nudges?: Nudge[];
  sectorOccupations?: UserProfileSectorOccupation[];
  department: DepartmentName;
  job?: string;
  isAvailable: boolean;
  displayHelps: boolean;
  hasPicture: boolean;
  currentJob?: string;
}

export function DirectoryUserItem({
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
  currentJob,
}: DirectoryUserItemProps) {
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
        currentJob={currentJob}
      />
    </CardListItem>
  );
}
