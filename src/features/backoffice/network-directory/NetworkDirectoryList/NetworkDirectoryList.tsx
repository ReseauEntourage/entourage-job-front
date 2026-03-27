import React, { useMemo } from 'react';
import { CardList } from '@/src/components/ui/CardList';
import { NetworkDirectoryEntity } from '@/src/constants/network-directory';
import {
  NetworkDirectoryUserItem,
  NetworkDirectoryCompanyItem,
} from '../NetworkDirectoryItem';
import { useNetworkDirectory } from '../hooks/useNetworkDirectory';
import { StyledDirectoryListContainer } from './NetworkDirectoryList.styles';

export function NetworkDirectoryList() {
  const { profiles, companies, isProfileLoading, directoryFiltersParams } =
    useNetworkDirectory();
  const { entity } = directoryFiltersParams;

  const listItems = useMemo(() => {
    if (entity === NetworkDirectoryEntity.USER) {
      return profiles.map((profile) => {
        return (
          <NetworkDirectoryUserItem
            key={profile.id}
            id={profile.id}
            firstName={profile.firstName}
            lastName={profile.lastName}
            role={profile.role}
            department={profile.department}
            sectorOccupations={profile.sectorOccupations}
            job={profile.currentJob}
            isAvailable={profile.isAvailable}
            hasPicture={profile.hasPicture}
            currentJob={profile.currentJob}
          />
        );
      });
    }
    if (entity === NetworkDirectoryEntity.COMPANY) {
      return companies.map((company) => {
        return (
          <NetworkDirectoryCompanyItem
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
