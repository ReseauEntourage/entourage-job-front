import React from 'react';
import { CardListItem } from '@/src/components/ui/CardList';
import { ProfileCard } from '@/src/components/ui/Cards/EntityCards/ProfileCard';
import { Genders } from '@/src/constants/genders';
import {
  MatchingReason,
  UserAchievement,
  UserProfileSectorOccupation,
} from 'src/api/types';
import { DepartmentName } from 'src/constants/departements';
import { UserRoles } from 'src/constants/users';

interface NetworkDirectoryUserItemProps {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRoles;
  gender: Genders;
  sectorOccupations?: UserProfileSectorOccupation[];
  department: DepartmentName;
  job?: string;
  isAvailable: boolean;
  hasPicture: boolean;
  currentJob?: string;
  recommendationReason?: MatchingReason | null;
  achievements: UserAchievement[];
}

export function NetworkDirectoryUserItem({
  id,
  firstName,
  lastName,
  role,
  gender,
  department,
  sectorOccupations,
  job,
  isAvailable,
  hasPicture,
  currentJob,
  recommendationReason,
  achievements,
}: NetworkDirectoryUserItemProps) {
  return (
    <CardListItem dataTestId={id}>
      <ProfileCard
        userId={id}
        firstName={firstName}
        lastName={lastName}
        role={role}
        gender={gender}
        department={department}
        sectorOccupations={sectorOccupations}
        job={job}
        isAvailable={isAvailable}
        hasPicture={hasPicture}
        currentJob={currentJob}
        recommendationReason={recommendationReason}
        achievements={achievements}
      />
    </CardListItem>
  );
}
