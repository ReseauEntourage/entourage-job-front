import React from 'react';
import { HelpNames, UserCandidateWithUsers } from 'src/api/types';
import { ProfileCard } from 'src/components/utils/Card/ProfileCard';
import { CardListItem } from 'src/components/utils/CardList';
import { BusinessLineValue } from 'src/constants';
import { Department } from 'src/constants/departements';
import { UserRole } from 'src/constants/users';

interface DirectoryItemProps {
  userId: string;
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
  userCandidate?: UserCandidateWithUsers;
  department: Department;
  job?: string;
}

export function DirectoryItem({
  userId,
  firstName,
  lastName,
  role,
  department,
  helps,
  businessLines,
  ambitions,
  userCandidate,
  job,
}: DirectoryItemProps) {
  return (
    <CardListItem dataTestId={userId}>
      <ProfileCard
        userId={userId}
        firstName={firstName}
        lastName={lastName}
        role={role}
        department={department}
        businessLines={businessLines}
        helps={helps}
        ambitions={ambitions}
        userCandidate={userCandidate}
        job={job}
      />
    </CardListItem>
  );
}
