import React from 'react';
import { BusinessSector, User } from '@/src/api/types';
import { CardListItem } from '@/src/components/ui/CardList';
import { CompanyCard } from '@/src/components/ui/Cards/EntityCards/CompanyCard/CompanyCard';

interface NetworkDirectoryCompanyItemProps {
  id: string;
  name: string;
  businessSectors: BusinessSector[];
  users: User[];
  logoUrl?: string;
}

export function NetworkDirectoryCompanyItem({
  id,
  name,
  businessSectors,
  users,
  logoUrl,
}: NetworkDirectoryCompanyItemProps) {
  return (
    <CardListItem dataTestId={id}>
      <CompanyCard
        id={id}
        name={name}
        businessSectors={businessSectors}
        users={users}
        logoUrl={logoUrl}
      />
    </CardListItem>
  );
}
