import React, { useMemo } from 'react';
import { DirectoryItem } from '../DirectoryItem';
import { useDirectory } from '../useDirectory';
import { CardList } from 'src/components/utils/CardList';
import { UserRoles } from 'src/constants/users';
import { StyledDirectoryListContainer } from './DirectoryList.styles';

export function DirectoryList() {
  const { profiles, isLoading } = useDirectory();

  const profileList = useMemo(() => {
    return profiles.map((profile) => {
      const helps =
        profile.role === UserRoles.CANDIDATE
          ? profile.helpNeeds
          : profile.helpOffers;

      const businessLines =
        profile.role === UserRoles.CANDIDATE
          ? profile.searchBusinessLines
          : profile.networkBusinessLines;

      return (
        <DirectoryItem
          key={profile.id}
          id={profile.id}
          firstName={profile.firstName}
          lastName={profile.lastName}
          role={profile.role}
          department={profile.department}
          helps={helps}
          businessLines={businessLines}
          ambitions={profile.searchAmbitions}
          job={profile.currentJob}
          isAvailable={profile.isAvailable}
          displayHelps
        />
      );
    });
  }, [profiles]);

  return (
    <StyledDirectoryListContainer>
      <CardList list={profileList} isLoading={isLoading} />
    </StyledDirectoryListContainer>
  );
}
