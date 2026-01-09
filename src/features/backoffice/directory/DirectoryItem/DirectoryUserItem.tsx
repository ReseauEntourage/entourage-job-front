import React from 'react';
import { CardListItem } from '@/src/components/ui/CardList';
import { ProfileCard } from '@/src/components/ui/Cards/EntityCards/ProfileCard';
import { Nudge, UserProfileSectorOccupation } from 'src/api/types';
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
  displayNudges: boolean;
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
  displayNudges,
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
        displayNudges={displayNudges}
        hasPicture={hasPicture}
        currentJob={currentJob}
      />
    </CardListItem>
  );
}
