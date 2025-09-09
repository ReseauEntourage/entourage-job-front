import React, { useMemo } from 'react';
import { DirectoryEntity } from '@/src/constants/entity';
import { DirectoryUserItem } from '../DirectoryItem';
import { DirectoryCompanyItem } from '../DirectoryItem/DirectoryCompanyItem';
import { useDirectory } from '../useDirectory';
import { CardList } from 'src/components/utils/CardList';
import { StyledDirectoryListContainer } from './DirectoryList.styles';

export function DirectoryList() {
  const { profiles, companies, isProfileLoading, directoryFiltersParams } =
    useDirectory();
  const { entity } = directoryFiltersParams;
  const listItems = useMemo(() => {
    if (entity === DirectoryEntity.USER) {
      return profiles.map((profile) => {
        return (
          <DirectoryUserItem
            key={profile.id}
            id={profile.id}
            firstName={profile.firstName}
            lastName={profile.lastName}
            role={profile.role}
            department={profile.department}
            nudges={profile.nudges}
            sectorOccupations={profile.sectorOccupations}
            job={profile.currentJob}
            isAvailable={profile.isAvailable}
            displayHelps
            hasPicture={profile.hasPicture}
            currentJob={profile.currentJob}
          />
        );
      });
    }
    if (entity === DirectoryEntity.COMPANY) {
      return companies.map((company) => {
        return (
          <DirectoryCompanyItem
            key={company.id}
            id={company.id}
            name={company.name}
            businessSectors={company.businessSectors || []}
            users={company.users || []}
            logoUrl={company.logoUrl}
          />
        );
      });
    }
    return [];
  }, [entity, companies, profiles]);

  return (
    <StyledDirectoryListContainer>
      <CardList list={listItems} isLoading={isProfileLoading} />
    </StyledDirectoryListContainer>
  );
}
